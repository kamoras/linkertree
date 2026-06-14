import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";

// Brand palette — a warm spring-green / cream identity.
const INK = "#0F2E1B"; // near-black green (headlines)
const LIME = "#43E660"; // vivid highlight green
const BTN = "#1B5E2B"; // primary button green

const FEATURES = [
  {
    title: "Built-in analytics",
    description: "See your visitors, your clicks, and where your traffic comes from.",
  },
  {
    title: "Unlimited links & pages",
    description: "Add as many links and as many pages as you need.",
  },
  {
    title: "Custom themes & colors",
    description: "Make it yours with themes, colors, fonts and backgrounds.",
  },
  {
    title: "Scheduled & featured links",
    description: "Spotlight what matters and schedule links to come and go.",
  },
  {
    title: "YouTube & Spotify embeds",
    description: "Drop in a video or a track and it plays right on your page.",
  },
  {
    title: "Email capture",
    description: "Grow a mailing list from your page and export it anytime.",
  },
];

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill={LIME} />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#F3F1EA]" style={{ color: INK }}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo className="text-lg" markClassName="h-6 w-6 text-[#1F7A3D]" />
        <div className="flex items-center gap-2 text-sm">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: BTN }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 font-medium transition hover:bg-black/5"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: BTN }}
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-16 text-center">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold"
          style={{ backgroundColor: LIME, color: INK }}
        >
          Free to use
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-7xl">
          Everything you are. In one simple link in bio.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-[#3a5a48]">
          Bring together your links, content and socials on one beautiful page.
          Built-in analytics, custom themes, embeds and more — all included, and
          ready in minutes.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={session ? "/dashboard" : "/register"}
            className="rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:opacity-95"
            style={{ backgroundColor: BTN }}
          >
            {session ? "Go to dashboard" : "Get started — it's free"}
          </Link>
          <a
            href="https://github.com/kamoras/linkertree"
            className="rounded-full border bg-white px-7 py-3.5 text-base font-semibold transition hover:bg-black/[0.03]"
            style={{ borderColor: "rgba(15,46,27,0.15)" }}
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          Everything your page needs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#3a5a48]">
          Thoughtful tools to share what you do, grow your audience, and look
          great doing it.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-white p-6 text-left shadow-sm"
              style={{ borderColor: "rgba(15,46,27,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Check />
                <p className="font-bold">{f.title}</p>
              </div>
              <p className="mt-2 text-sm text-[#3a5a48]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <div
          className="rounded-3xl px-8 py-14 text-center"
          style={{ backgroundColor: INK }}
        >
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Make your link in bio today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-[#bfe6c9]">
            Set up your page in a few minutes. No design skills required.
          </p>
          <Link
            href={session ? "/dashboard" : "/register"}
            className="mt-8 inline-block rounded-full px-7 py-3.5 text-base font-semibold transition hover:scale-[1.02]"
            style={{ backgroundColor: LIME, color: INK }}
          >
            {session ? "Go to dashboard" : "Get started — it's free"}
          </Link>
        </div>
      </section>

      <footer
        className="border-t"
        style={{ borderColor: "rgba(15,46,27,0.1)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-[#4b6b5a]">
          <Logo className="text-base" markClassName="h-5 w-5 text-[#1F7A3D]" />
          <p className="text-xs text-[#7c907f]">
            An independent, open-source project. Not affiliated with Linktree.
          </p>
        </div>
      </footer>
    </main>
  );
}
