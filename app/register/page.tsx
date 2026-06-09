import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { RegisterForm } from "./register-form";

export const metadata = { title: "Create your account" };

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          aria-label="Linkertree home"
          className="mb-8 flex justify-center"
        >
          <Logo className="text-lg text-white" />
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Free forever. Your first page is ready instantly.
          </p>
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
