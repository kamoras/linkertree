import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Analytics" };

const WINDOW_DAYS = 30;

function lastNDays(n: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function refHost(ref: string | null): string {
  if (!ref) return "Direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "") || "Direct";
  } catch {
    return "Other";
  }
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const page = await prisma.page.findUnique({ where: { id } });
  if (!page || page.userId !== session.user.id) notFound();

  const since = new Date();
  since.setDate(since.getDate() - WINDOW_DAYS);

  const [totalViews, clickSum, views, clicks, topLinks, leadCount] =
    await Promise.all([
      prisma.pageView.count({ where: { pageId: id } }),
      prisma.link.aggregate({ where: { pageId: id }, _sum: { clicks: true } }),
      prisma.pageView.findMany({
        where: { pageId: id, createdAt: { gte: since } },
        select: { createdAt: true, referrer: true },
      }),
      prisma.clickEvent.findMany({
        where: { pageId: id, createdAt: { gte: since } },
        select: { createdAt: true, referrer: true },
      }),
      prisma.link.findMany({
        where: { pageId: id },
        orderBy: { clicks: "desc" },
        take: 8,
        select: { id: true, title: true, clicks: true },
      }),
      prisma.lead.count({ where: { pageId: id } }),
    ]);

  const totalClicks = clickSum._sum.clicks ?? 0;
  const ctr = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0;

  // Daily buckets for the charts.
  const days = lastNDays(WINDOW_DAYS);
  const viewByDay = new Map<string, number>();
  const clickByDay = new Map<string, number>();
  for (const v of views)
    viewByDay.set(dayKey(v.createdAt), (viewByDay.get(dayKey(v.createdAt)) ?? 0) + 1);
  for (const c of clicks)
    clickByDay.set(dayKey(c.createdAt), (clickByDay.get(dayKey(c.createdAt)) ?? 0) + 1);

  const viewSeries = days.map((d) => viewByDay.get(dayKey(d)) ?? 0);
  const clickSeries = days.map((d) => clickByDay.get(dayKey(d)) ?? 0);

  // Top referrers across views + clicks.
  const refCounts = new Map<string, number>();
  for (const v of views)
    refCounts.set(refHost(v.referrer), (refCounts.get(refHost(v.referrer)) ?? 0) + 1);
  const topRefs = [...refCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <header className="flex items-center justify-between">
        <Link
          href={`/dashboard/${id}`}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to editor
        </Link>
        <a
          href={`/api/leads/${id}`}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
        >
          ⬇ Export leads CSV
        </a>
      </header>

      <h1 className="mt-4 text-2xl font-bold">{page.title} — analytics</h1>
      <p className="text-sm text-slate-400">Last {WINDOW_DAYS} days</p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total views" value={totalViews} />
        <Stat label="Total clicks" value={totalClicks} />
        <Stat label="Click-through rate" value={`${ctr}%`} />
        <Stat label="Email leads" value={leadCount} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BarChart title="Views" series={viewSeries} days={days} color="#6366f1" />
        <BarChart title="Clicks" series={clickSeries} days={days} color="#10b981" />
      </div>

      {/* Top links + referrers */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Top links</h2>
          <ul className="mt-4 space-y-2">
            {topLinks.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate text-slate-200">{l.title}</span>
                <span className="shrink-0 font-medium text-slate-400">
                  {l.clicks}
                </span>
              </li>
            ))}
            {topLinks.length === 0 && (
              <li className="text-sm text-slate-500">No clicks yet.</li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Top sources</h2>
          <ul className="mt-4 space-y-2">
            {topRefs.map(([host, n]) => (
              <li
                key={host}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate text-slate-200">{host}</span>
                <span className="shrink-0 font-medium text-slate-400">{n}</span>
              </li>
            ))}
            {topRefs.length === 0 && (
              <li className="text-sm text-slate-500">No traffic yet.</li>
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

function BarChart({
  title,
  series,
  days,
  color,
}: {
  title: string;
  series: number[];
  days: Date[];
  color: string;
}) {
  const max = Math.max(1, ...series);
  const total = series.reduce((a, b) => a + b, 0);
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-slate-400">{total} total</span>
      </div>
      <div className="mt-4 flex h-28 items-end gap-[3px]">
        {series.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${Math.max(2, (v / max) * 100)}%`,
              backgroundColor: color,
              opacity: v === 0 ? 0.18 : 1,
            }}
            title={`${days[i].toLocaleDateString()}: ${v}`}
          />
        ))}
      </div>
    </section>
  );
}
