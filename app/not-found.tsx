import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl">🌿</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-400">
        This linktree doesn’t exist or isn’t published.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
      >
        Go home
      </Link>
    </main>
  );
}
