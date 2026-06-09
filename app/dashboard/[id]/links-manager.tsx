"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { Link as LinkModel } from "@prisma/client";
import {
  addLink,
  updateLink,
  toggleLink,
  deleteLink,
  moveLink,
} from "@/app/actions/pages";

export function LinksManager({
  pageId,
  links,
}: {
  pageId: string;
  links: LinkModel[];
}) {
  const action = addLink.bind(null, pageId);
  const [state, formAction] = useFormState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the add-form after a successful submit (state resets to {error: undefined}).
  useEffect(() => {
    if (state && !state.error) formRef.current?.reset();
  }, [state]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold">Links</h2>

      <form
        ref={formRef}
        action={formAction}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <input
          name="title"
          placeholder="Label (e.g. My YouTube)"
          required
          maxLength={80}
          className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
        />
        <input
          name="url"
          type="url"
          placeholder="https://…"
          required
          className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
        />
        <AddButton />
      </form>
      {state?.error && <p className="mt-2 text-sm text-rose-400">{state.error}</p>}

      <ul className="mt-5 space-y-2">
        {links.map((link, i) => (
          <LinkRow
            key={link.id}
            link={link}
            isFirst={i === 0}
            isLast={i === links.length - 1}
          />
        ))}
      </ul>
      {links.length === 0 && (
        <p className="mt-5 text-sm text-slate-500">
          No links yet — add your first one above.
        </p>
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
      className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
    >
      {pending ? "Adding…" : "Add"}
    </button>
  );
}

function LinkRow({
  link,
  isFirst,
  isLast,
}: {
  link: LinkModel;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="rounded-lg border border-white/10 bg-slate-900/40 p-3">
        <form
          action={async (formData) => {
            await updateLink(link.id, formData);
            setEditing(false);
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            name="title"
            defaultValue={link.title}
            required
            maxLength={80}
            className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
          <input
            name="url"
            type="url"
            defaultValue={link.url}
            required
            className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <button className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/40 p-3 ${
        link.active ? "" : "opacity-50"
      }`}
    >
      {/* Reorder controls */}
      <div className="flex flex-col">
        <IconForm action={moveLink.bind(null, link.id, "up")} disabled={isFirst}>
          ▲
        </IconForm>
        <IconForm
          action={moveLink.bind(null, link.id, "down")}
          disabled={isLast}
        >
          ▼
        </IconForm>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{link.title}</p>
        <p className="truncate text-xs text-slate-400">{link.url}</p>
      </div>

      <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">
        {link.clicks} clicks
      </span>

      <button
        onClick={() => setEditing(true)}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/5"
      >
        Edit
      </button>

      <form action={toggleLink.bind(null, link.id)} className="shrink-0">
        <button
          className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-white/5"
          title={link.active ? "Hide" : "Show"}
        >
          {link.active ? "Hide" : "Show"}
        </button>
      </form>

      <form action={deleteLink.bind(null, link.id)} className="shrink-0">
        <button className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-rose-500/10 hover:text-rose-400">
          Delete
        </button>
      </form>
    </li>
  );
}

function IconForm({
  action,
  disabled,
  children,
}: {
  action: () => Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <button
        disabled={disabled}
        className="px-1 text-[10px] leading-tight text-slate-500 transition hover:text-white disabled:opacity-30"
      >
        {children}
      </button>
    </form>
  );
}
