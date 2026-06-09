import Link from "next/link";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";

// Brand palette — a friendly spring-green / cream homage to the category leader,
// with the twist that none of it costs anything.
const INK = "#0F2E1B"; // near-black green (headlines)
const LEAF = "#1F7A3D"; // mid green (mark / accents on cream)
const LIME = "#43E660"; // vivid highlight green
const BTN = "#1B5E2B"; // primary button green

const FEATURES = [
  {
    t: "Built-in analytics",
    d: "Views, clicks, click-through rate and where your traffic really comes from.",
  },
  {
    t: "Unlimited links & pages",
    d: "Add as many links and as many pages as you want. No caps, ever.",
  },
  {
    t: "Custom themes & colors",
    d: "Six themes plus your own colors, fonts, backgrounds and button styles.",
  },
  {
    t: "Scheduled & featured links",
    d: "Put links on a timer and spotlight the ones that matter.",
  },
  {
    t: "YouTube & Spotify embeds",
    d: "Drop in a video or a track and it plays right on your page.",
  },
  {
    t: "Email capture + CSV export",
    d: "Grow a mailing list from your page and export it whenever you like.",
  },
];

const PLAN_FEATURES = [
  "Unlimited links & pages",
  "Full analytics dashboard",
  "Every theme + custom branding",
  "Link scheduling & thumbnails",
  "YouTube & Spotify embeds",
  "Email capture & CSV export",
  "QR code for every page",
  "Self-host & own your data",
];

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-5 w-5 shrink-0"
      fill="none"
      aria-hidden
    >
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
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-14 text-center">
        <span
          className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold"
          style={{ backgroundColor: LIME, color: INK }}
        >
          Free forever · No Pro tier · No paywall
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-7xl">
          Everything you are. In one simple link in bio.{" "}
          <span style={{ color: LEAF }}>For free.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-[#3a5a48]">
          The link-in-bio that doesn&apos;t nickel-and-dime you. Analytics,
          themes, scheduling, embeds, email capture — the stuff other platforms
          call &ldquo;Pro&rdquo; — Linkertree just gives away. Because charging
          for buttons is a little wild.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={session ? "/dashboard" : "/register"}
            className="rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:opacity-95"
            style={{ backgroundColor: BTN }}
          >
            {session ? "Go to dashboard" : "Get started for free"}
          </Link>
          <a
            href="https://github.com/kamoras/linkertree"
            className="rounded-full border bg-white px-7 py-3.5 text-base font-semibold transition hover:bg-black/[0.03]"
            style={{ borderColor: "rgba(15,46,27,0.15)" }}
          >
            View on GitHub
          </a>
        </div>
        <p className="mt-4 text-sm text-[#4b6b5a]">
          No credit card — there&apos;s nowhere to put one.
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          Every &ldquo;Pro&rdquo; feature. Zero dollars.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#3a5a48]">
          Here&apos;s what you&apos;d be paying a monthly subscription for
          somewhere else.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="rounded-2xl border bg-white p-6 text-left shadow-sm"
              style={{ borderColor: "rgba(15,46,27,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Check />
                <p className="font-bold">{f.t}</p>
              </div>
              <p className="mt-2 text-sm text-[#3a5a48]">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing parody */}
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          Pick a plan
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-[#3a5a48]">
          Take your time. It&apos;s a big decision.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          <PlanCard name="Starter" price="$0" cadence="forever" />
          <PlanCard
            name="Pro"
            price="$0"
            cadence="forever"
            wasPrice="$9/mo"
            featured
          />
        </div>
        <p className="mt-6 text-center text-sm text-[#4b6b5a]">
          Same plan twice. We checked — it&apos;s all free.
        </p>
      </section>

      <footer
        className="border-t"
        style={{ borderColor: "rgba(15,46,27,0.1)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-[#4b6b5a]">
          <Logo className="text-base" markClassName="h-5 w-5 text-[#1F7A3D]" />
          <p>Open source · MIT licensed · Self-host in minutes</p>
          <p className="text-xs text-[#7c907f]">
            A free, open-source link-in-bio. Not affiliated with Linktree.
          </p>
        </div>
      </footer>
    </main>
  );
}

function PlanCard({
  name,
  price,
  cadence,
  wasPrice,
  featured = false,
}: {
  name: string;
  price: string;
  cadence: string;
  wasPrice?: string;
  featured?: boolean;
}) {
  return (
    <div
      className="rounded-3xl border bg-white p-7 text-left shadow-sm"
      style={{
        borderColor: featured ? LIME : "rgba(15,46,27,0.1)",
        borderWidth: featured ? 2 : 1,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{name}</h3>
        {featured && (
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: LIME, color: INK }}
          >
            Most popular
          </span>
        )}
      </div>
      <div className="mt-4 flex items-end gap-2">
        {wasPrice && (
          <span className="text-xl font-semibold text-[#9aa89f] line-through">
            {wasPrice}
          </span>
        )}
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="pb-1 text-sm text-[#4b6b5a]">/{cadence}</span>
      </div>
      <ul className="mt-6 space-y-2.5">
        {PLAN_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/register"
        className="mt-7 block rounded-full px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-95"
        style={{ backgroundColor: BTN }}
      >
        Get started — free
      </Link>
    </div>
  );
}
