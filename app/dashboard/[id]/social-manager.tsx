"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { SocialLink } from "@prisma/client";
import { SOCIAL_PLATFORMS, getPlatform } from "@/lib/social";
import { addSocial, deleteSocial } from "@/app/actions/pages";

export function SocialManager({
  pageId,
  socials,
}: {
  pageId: string;
  socials: SocialLink[];
}) {
  const action = addSocial.bind(null, pageId);
  const [state, formAction] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.error) formRef.current?.reset();
  }, [state]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold">Social icons</h2>
      <p className="mt-1 text-sm text-slate-400">
        A row of social links shown at the top of your page.
      </p>

      <ul className="mt-4 space-y-2">
        {socials.map((s) => {
          const p = getPlatform(s.platform);
          return (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: p?.color ?? "#475569" }}
              >
                {p?.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-200">
                  {p?.label ?? s.platform}
                </p>
                <p className="truncate text-xs text-slate-500">{s.url}</p>
              </div>
              <form action={deleteSocial.bind(null, s.id)}>
                <button
                  type="submit"
                  className="rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-white/10 hover:text-rose-300"
                  aria-label="Remove"
                >
                  Remove
                </button>
              </form>
            </li>
          );
        })}
        {socials.length === 0 && (
          <li className="text-sm text-slate-500">No social links yet.</li>
        )}
      </ul>

      <form ref={formRef} action={formAction} className="mt-4 flex gap-2">
        <select
          name="platform"
          defaultValue="instagram"
          className="rounded-lg border border-white/10 bg-slate-900/60 px-2 py-2.5 text-sm text-white outline-none focus:border-indigo-400"
        >
          {SOCIAL_PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <input
          name="url"
          required
          placeholder="Link or handle"
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-400"
        />
        <AddButton />
      </form>
      {state?.error && (
        <p className="mt-2 text-sm text-rose-400">{state.error}</p>
      )}
    </section>
  );
}

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-60"
    >
      Add
    </button>
  );
}
