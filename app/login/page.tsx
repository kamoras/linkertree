import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center text-lg font-semibold tracking-tight"
        >
          🌿 Linkertree
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Log in to manage your pages.
          </p>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          No account?{" "}
          <Link href="/register" className="font-medium text-white hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
