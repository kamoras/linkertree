import Link from "next/link";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <LogoMark className="h-14 w-14 text-[#43E660]" />
      <h1 className="mt-6 text-2xl font-bold">Page not found</h1>
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
