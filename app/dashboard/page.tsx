import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTheme } from "@/lib/themes";
import { createPage } from "@/app/actions/pages";
import { SignOutButton } from "./sign-out-button";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pages = await prisma.page.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { links: true } } },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          🌿 Linkertree
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-400 sm:inline">
            {session.user.email}
          </span>
          <SignOutButton />
        </div>
      </header>

      <div className="mt-10 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your pages</h1>
          <p className="mt-1 text-sm text-slate-400">
            {pages.length} {pages.length === 1 ? "linktree" : "linktrees"}
          </p>
        </div>
        <form action={createPage}>
          <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
            + New page
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {pages.map((page) => {
          const theme = getTheme(page.theme);
          return (
            <Link
              key={page.id}
              href={`/dashboard/${page.id}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 shrink-0 rounded-full ${theme.background}`}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{page.title}</p>
                  <p className="truncate text-sm text-slate-400">
                    /{page.slug}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{page._count.links} links</span>
                <span
                  className={
                    page.published
                      ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300"
                      : "rounded-full bg-slate-500/15 px-2 py-0.5 text-slate-400"
                  }
                >
                  {page.published ? "Live" : "Draft"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {pages.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-12 text-center text-slate-400">
          No pages yet. Create your first one above.
        </div>
      )}
    </main>
  );
}
