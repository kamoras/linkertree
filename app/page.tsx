import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo className="text-lg text-white" markClassName="h-6 w-6 text-indigo-400" />
        <div className="flex items-center gap-3 text-sm">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-white px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-slate-300 transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-200"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
          Open source · MIT licensed · Free forever
        </span>
        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          One link for{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            everything
          </span>{" "}
          you do.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg text-slate-400">
          Build a beautiful link-in-bio page in minutes. Host as many as you
          want. No subscriptions, no lock-in — deploy your own copy free on
          Vercel.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={session ? "/dashboard" : "/register"}
            className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-indigo-500/20 transition hover:scale-105 hover:bg-slate-100"
          >
            {session ? "Go to dashboard" : "Create your page →"}
          </Link>
          <a
            href="https://github.com"
            className="rounded-full border border-white/15 px-6 py-3 font-medium text-slate-200 transition hover:bg-white/5"
          >
            Star on GitHub
          </a>
        </div>

        <div className="mt-20 grid w-full gap-4 sm:grid-cols-3">
          {[
            {
              t: "Built-in analytics",
              d: "Views, clicks, CTR and top sources — no upsell.",
            },
            {
              t: "Fully customizable",
              d: "Themes, colors, fonts, thumbnails and embeds.",
            },
            {
              t: "Own your data",
              d: "Self-host on your own database, unlimited pages.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left"
            >
              <p className="font-semibold text-white">{f.t}</p>
              <p className="mt-1 text-sm text-slate-400">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10 text-center text-sm text-slate-500">
        Built with Next.js · MIT licensed · Free to self-host
      </footer>
    </main>
  );
}
