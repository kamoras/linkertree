"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
    >
      Sign out
    </button>
  );
}
