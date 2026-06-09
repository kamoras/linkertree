"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { pageSchema, linkSchema, socialSchema } from "@/lib/validation";
import { getPlatform } from "@/lib/social";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

// Confirm the page belongs to the current user; throws/redirects otherwise.
async function assertPageOwner(pageId: string, userId: string) {
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page || page.userId !== userId) redirect("/dashboard");
  return page;
}

export type ActionState = { error?: string } | undefined;

export async function createPage(): Promise<void> {
  const userId = await requireUserId();
  const suffix = Math.random().toString(36).slice(2, 7);
  const page = await prisma.page.create({
    data: {
      userId,
      slug: `links-${suffix}`,
      title: "New Linktree",
      theme: "midnight",
    },
  });
  revalidatePath("/dashboard");
  redirect(`/dashboard/${page.id}`);
}

export async function updatePage(
  pageId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  await assertPageOwner(pageId, userId);

  const parsed = pageSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    bio: formData.get("bio"),
    avatarUrl: formData.get("avatarUrl"),
    theme: formData.get("theme"),
    published: formData.get("published") === "on",
    accentColor:
      formData.get("accentEnabled") === "on" ? formData.get("accentColor") : "",
    backgroundImageUrl: formData.get("backgroundImageUrl"),
    buttonStyle: formData.get("buttonStyle") || undefined,
    fontFamily: formData.get("fontFamily") || undefined,
    hideBranding: formData.get("hideBranding") === "on",
    collectEmails: formData.get("collectEmails") === "on",
    emailHeading: formData.get("emailHeading"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  // Enforce global slug uniqueness with a friendly message.
  const clash = await prisma.page.findUnique({ where: { slug: data.slug } });
  if (clash && clash.id !== pageId) {
    return { error: "That handle is already taken" };
  }

  await prisma.page.update({
    where: { id: pageId },
    data: {
      slug: data.slug,
      title: data.title,
      bio: data.bio || null,
      avatarUrl: data.avatarUrl || null,
      theme: data.theme,
      published: data.published ?? true,
      accentColor: data.accentColor || null,
      backgroundImageUrl: data.backgroundImageUrl || null,
      buttonStyle: data.buttonStyle ?? "rounded",
      fontFamily: data.fontFamily ?? "sans",
      hideBranding: data.hideBranding ?? false,
      collectEmails: data.collectEmails ?? false,
      emailHeading: data.emailHeading || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${pageId}`);
  revalidatePath(`/${data.slug}`);
  return { error: undefined };
}

export async function deletePage(pageId: string): Promise<void> {
  const userId = await requireUserId();
  await assertPageOwner(pageId, userId);
  await prisma.page.delete({ where: { id: pageId } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function addLink(
  pageId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  await assertPageOwner(pageId, userId);

  const parsed = linkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const max = await prisma.link.aggregate({
    where: { pageId },
    _max: { position: true },
  });

  await prisma.link.create({
    data: {
      pageId,
      title: parsed.data.title,
      url: parsed.data.url,
      position: (max._max.position ?? -1) + 1,
    },
  });

  revalidatePath(`/dashboard/${pageId}`);
  return { error: undefined };
}

export async function updateLink(
  linkId: string,
  formData: FormData
): Promise<void> {
  const userId = await requireUserId();
  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) redirect("/dashboard");
  await assertPageOwner(link.pageId, userId);

  const parsed = linkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    featured: formData.get("featured") === "on",
    embedType: formData.get("embedType") ?? "",
    startsAt: formData.get("startsAt") ?? "",
    endsAt: formData.get("endsAt") ?? "",
  });
  if (!parsed.success) return;

  await prisma.link.update({
    where: { id: linkId },
    data: {
      title: parsed.data.title,
      url: parsed.data.url,
      thumbnailUrl: parsed.data.thumbnailUrl || null,
      featured: parsed.data.featured ?? false,
      embedType: parsed.data.embedType || null,
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
    },
  });
  revalidatePath(`/dashboard/${link.pageId}`);
}

export async function toggleLink(linkId: string): Promise<void> {
  const userId = await requireUserId();
  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) return;
  await assertPageOwner(link.pageId, userId);
  await prisma.link.update({
    where: { id: linkId },
    data: { active: !link.active },
  });
  revalidatePath(`/dashboard/${link.pageId}`);
}

export async function deleteLink(linkId: string): Promise<void> {
  const userId = await requireUserId();
  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) return;
  await assertPageOwner(link.pageId, userId);
  await prisma.link.delete({ where: { id: linkId } });
  revalidatePath(`/dashboard/${link.pageId}`);
}

// Move a link up or down by swapping positions with its neighbour.
export async function moveLink(
  linkId: string,
  direction: "up" | "down"
): Promise<void> {
  const userId = await requireUserId();
  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) return;
  await assertPageOwner(link.pageId, userId);

  const neighbour = await prisma.link.findFirst({
    where:
      direction === "up"
        ? { pageId: link.pageId, position: { lt: link.position } }
        : { pageId: link.pageId, position: { gt: link.position } },
    orderBy: { position: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbour) return;

  await prisma.$transaction([
    prisma.link.update({
      where: { id: link.id },
      data: { position: neighbour.position },
    }),
    prisma.link.update({
      where: { id: neighbour.id },
      data: { position: link.position },
    }),
  ]);
  revalidatePath(`/dashboard/${link.pageId}`);
}

// Persist a new ordering produced by drag-and-drop in the editor.
export async function reorderLinks(
  pageId: string,
  orderedIds: string[]
): Promise<void> {
  const userId = await requireUserId();
  await assertPageOwner(pageId, userId);

  // Only reorder links that actually belong to this page.
  const owned = await prisma.link.findMany({
    where: { pageId },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((l) => l.id));
  const ids = orderedIds.filter((id) => ownedIds.has(id));

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.link.update({ where: { id }, data: { position: index } })
    )
  );
  revalidatePath(`/dashboard/${pageId}`);
}

// --- Social links --------------------------------------------------------

export async function addSocial(
  pageId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  await assertPageOwner(pageId, userId);

  const parsed = socialSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  if (!getPlatform(parsed.data.platform)) {
    return { error: "Unknown platform" };
  }

  const max = await prisma.socialLink.aggregate({
    where: { pageId },
    _max: { position: true },
  });

  await prisma.socialLink.create({
    data: {
      pageId,
      platform: parsed.data.platform,
      url: parsed.data.url,
      position: (max._max.position ?? -1) + 1,
    },
  });
  revalidatePath(`/dashboard/${pageId}`);
  return { error: undefined };
}

export async function deleteSocial(socialId: string): Promise<void> {
  const userId = await requireUserId();
  const social = await prisma.socialLink.findUnique({
    where: { id: socialId },
  });
  if (!social) return;
  await assertPageOwner(social.pageId, userId);
  await prisma.socialLink.delete({ where: { id: socialId } });
  revalidatePath(`/dashboard/${social.pageId}`);
}
