import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LinktreeView } from "@/components/linktree-view";

// Revalidate public pages periodically so edits show up without a redeploy.
export const revalidate = 60;

async function getPage(slug: string) {
  return prisma.page.findUnique({
    where: { slug: slug.toLowerCase() },
    include: { links: { where: { active: true }, orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = await getPage(params.slug);
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
  params: { slug: string };
}) {
  const page = await getPage(params.slug);
  if (!page || !page.published) notFound();

  return (
    <div className="min-h-screen">
      <LinktreeView
        title={page.title}
        bio={page.bio}
        avatarUrl={page.avatarUrl}
        theme={page.theme}
        links={page.links}
        trackClicks
      />
    </div>
  );
}
