import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LinktreeView } from "@/components/linktree-view";
import { PageSettings } from "./page-settings";
import { SocialManager } from "./social-manager";
import { LinksManager } from "./links-manager";
import { QrCodeCard } from "./qr-code-card";

export const metadata = { title: "Edit page" };

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      links: { orderBy: { position: "asc" } },
      socialLinks: { orderBy: { position: "asc" } },
    },
  });

  if (!page || page.userId !== session.user.id) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← All pages
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/${page.id}/analytics`}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
          >
            📊 Analytics
          </Link>
          <a
            href={`/${page.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
          >
            View live ↗
          </a>
        </div>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Editor column */}
        <div className="space-y-8">
          <PageSettings page={page} />
          <SocialManager pageId={page.id} socials={page.socialLinks} />
          <LinksManager pageId={page.id} links={page.links} />
          <QrCodeCard slug={page.slug} />
        </div>

        {/* Live preview (updates on save) */}
        <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <p className="mb-3 text-center text-xs uppercase tracking-wide text-slate-500">
            Preview
          </p>
          <div className="mx-auto h-[640px] w-full max-w-[320px] overflow-hidden rounded-[2.5rem] border-[10px] border-slate-800 bg-black shadow-2xl">
            <div className="h-full w-full overflow-y-auto">
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
                links={page.links.filter((l) => l.active)}
                socials={page.socialLinks}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
