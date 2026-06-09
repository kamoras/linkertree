"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Page } from "@prisma/client";
import { themes } from "@/lib/themes";
import { updatePage } from "@/app/actions/pages";
import { DeletePageButton } from "./delete-page-button";

export function PageSettings({ page }: { page: Page }) {
  const action = updatePage.bind(null, page.id);
  const [state, formAction] = useFormState(action, undefined);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Page settings</h2>
        <DeletePageButton pageId={page.id} title={page.title} />
      </div>

      <form action={formAction} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Title"
            name="title"
            defaultValue={page.title}
            placeholder="My Links"
          />
          <Field
            label="Handle"
            name="slug"
            defaultValue={page.slug}
            prefix="/"
            placeholder="yourname"
          />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-300">
            Bio
          </span>
          <textarea
            name="bio"
            defaultValue={page.bio ?? ""}
            maxLength={280}
            rows={2}
            placeholder="A short description"
            className="w-full resize-none rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
          />
        </label>

        <Field
          label="Avatar image URL (optional)"
          name="avatarUrl"
          type="url"
          defaultValue={page.avatarUrl ?? ""}
          placeholder="https://…/photo.jpg"
        />

        {/* Theme picker */}
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Theme
          </span>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {themes.map((t) => (
              <label key={t.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={t.id}
                  defaultChecked={page.theme === t.id}
                  className="peer sr-only"
                />
                <div
                  className={`h-14 rounded-lg ${t.background} ring-2 ring-transparent transition peer-checked:ring-white peer-checked:ring-offset-2 peer-checked:ring-offset-slate-900`}
                  title={t.name}
                />
                <span className="mt-1 block text-center text-[11px] text-slate-400">
                  {t.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={page.published}
            className="h-4 w-4 rounded border-white/20 bg-slate-900"
          />
          <span className="text-sm text-slate-300">
            Published (visible to the public)
          </span>
        </label>

        {state?.error && (
          <p className="text-sm text-rose-400">{state.error}</p>
        )}

        <SaveButton />
      </form>
    </section>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

function Field({
  label,
  prefix,
  ...props
}: {
  label: string;
  prefix?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </span>
      <div className="flex items-center rounded-lg border border-white/10 bg-slate-900/60 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/30">
        {prefix && (
          <span className="pl-3 text-sm text-slate-500">{prefix}</span>
        )}
        <input
          {...props}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none"
        />
      </div>
    </label>
  );
}
