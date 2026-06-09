import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LinktreeView } from "@/components/linktree-view";

// Revalidate public pages periodically so edits show up without a redeploy.
export const revalidate = 60;

async function getPage(slug: string) {
  const now = new Date();
  return prisma.page.findUnique({
    where: { slug: slug.toLowerCase() },
    include: {
      socialLinks: { orderBy: { position: "asc" } },
      links: {
        where: {
          active: true,
          // Respect the scheduled visibility window.
          AND: [
            { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
            { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          ],
        },
        orderBy: { position: "asc" },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || !page.published) return { title: "Not found" };
  return {
    title: page.title,
    description: page.bio ?? `Links from ${page.title}`,
    openGraph: {
      title: page.title,
      description: page.bio ?? `Links from ${page.title}`,
      images: page.avatarUrl ? [page.avatarUrl] : undefined,
    },
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || !page.published) notFound();

  return (
    <div className="min-h-screen">
      <LinktreeView
        pageId={page.id}
        title={page.title}
        bio={page.bio}
        avatarUrl={page.avatarUrl}
        theme={page.theme}
        accentColor={page.accentColor}
        backgroundImageUrl={page.backgroundImageUrl}
        buttonStyle={page.buttonStyle}
        fontFamily={page.fontFamily}
        hideBranding={page.hideBranding}
        collectEmails={page.collectEmails}
        emailHeading={page.emailHeading}
        customBg={page.customBg}
        customBg2={page.customBg2}
        customText={page.customText}
        links={page.links}
        socials={page.socialLinks}
        trackClicks
      />
    </div>
  );
}
