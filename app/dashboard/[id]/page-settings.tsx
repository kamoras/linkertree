"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Page } from "@prisma/client";
import { themes } from "@/lib/themes";
import { BUTTON_STYLES, FONT_OPTIONS } from "@/lib/appearance";
import { updatePage } from "@/app/actions/pages";
import { DeletePageButton } from "./delete-page-button";

const selectClass =
  "w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30";
const checkboxClass = "h-4 w-4 rounded border-white/20 bg-slate-900";

export function PageSettings({ page }: { page: Page }) {
  const action = updatePage.bind(null, page.id);
  const [state, formAction] = useActionState(action, undefined);

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
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
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
            {/* Custom theme */}
            <label className="cursor-pointer">
              <input
                type="radio"
                name="theme"
                value="custom"
                defaultChecked={page.theme === "custom"}
                className="peer sr-only"
              />
              <div
                className="h-14 rounded-lg bg-[conic-gradient(at_top_left,_#f87171,_#fbbf24,_#34d399,_#60a5fa,_#c084fc,_#f87171)] ring-2 ring-transparent transition peer-checked:ring-white peer-checked:ring-offset-2 peer-checked:ring-offset-slate-900"
                title="Custom"
              />
              <span className="mt-1 block text-center text-[11px] text-slate-400">
                Custom
              </span>
            </label>
          </div>

          {/* Custom theme colors (apply when the Custom theme is selected) */}
          <div className="mt-3 rounded-lg border border-white/10 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400">
              Custom colors — used when the <strong>Custom</strong> theme is
              selected.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="color"
                  name="customBg"
                  defaultValue={page.customBg ?? "#0f172a"}
                  className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
                />
                <span className="text-sm text-slate-300">Background</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="customBg2Enabled"
                  defaultChecked={Boolean(page.customBg2)}
                  className={checkboxClass}
                />
                <input
                  type="color"
                  name="customBg2"
                  defaultValue={page.customBg2 ?? "#312e81"}
                  className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
                />
                <span className="text-sm text-slate-300">Gradient</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="color"
                  name="customText"
                  defaultValue={page.customText ?? "#ffffff"}
                  className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
                />
                <span className="text-sm text-slate-300">Text</span>
              </label>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={page.published}
            className={checkboxClass}
          />
          <span className="text-sm text-slate-300">
            Published (visible to the public)
          </span>
        </label>

        {/* Appearance & branding */}
        <details className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
          <summary className="cursor-pointer select-none text-sm font-medium text-slate-200">
            Appearance &amp; branding
          </summary>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">
                  Button shape
                </span>
                <select
                  name="buttonStyle"
                  defaultValue={page.buttonStyle}
                  className={selectClass}
                >
                  {BUTTON_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">
                  Font
                </span>
                <select
                  name="fontFamily"
                  defaultValue={page.fontFamily}
                  className={selectClass}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="accentEnabled"
                defaultChecked={Boolean(page.accentColor)}
                className={checkboxClass}
              />
              <span className="text-sm text-slate-300">Custom accent color</span>
              <input
                type="color"
                name="accentColor"
                defaultValue={page.accentColor ?? "#6366f1"}
                className="h-8 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
              />
            </div>

            <Field
              label="Background image URL (optional)"
              name="backgroundImageUrl"
              type="url"
              defaultValue={page.backgroundImageUrl ?? ""}
              placeholder="https://…/background.jpg"
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="hideBranding"
                defaultChecked={page.hideBranding}
                className={checkboxClass}
              />
              <span className="text-sm text-slate-300">
                Hide “Made with Linkertree” footer
              </span>
            </label>
          </div>
        </details>

        {/* Email capture */}
        <details className="rounded-lg border border-white/10 bg-slate-900/40 p-4">
          <summary className="cursor-pointer select-none text-sm font-medium text-slate-200">
            Collect emails
          </summary>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="collectEmails"
                defaultChecked={page.collectEmails}
                className={checkboxClass}
              />
              <span className="text-sm text-slate-300">
                Show an email signup form on my page
              </span>
            </label>
            <Field
              label="Signup heading (optional)"
              name="emailHeading"
              defaultValue={page.emailHeading ?? ""}
              placeholder="Join my newsletter"
            />
          </div>
        </details>

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
