"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Link as LinkModel } from "@prisma/client";
import {
  addLink,
  updateLink,
  toggleLink,
  deleteLink,
  moveLink,
  reorderLinks,
} from "@/app/actions/pages";

// Format a Date for a <input type="datetime-local">.
function toLocalInput(d: Date | null | undefined): string {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(
    dt.getHours()
  )}:${pad(dt.getMinutes())}`;
}

export function LinksManager({
  pageId,
  links,
}: {
  pageId: string;
  links: LinkModel[];
}) {
  const action = addLink.bind(null, pageId);
  const [state, formAction] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Local copy so drag-reordering feels instant; resync (during render, the
  // React-endorsed way) when the server sends a fresh list.
  const [items, setItems] = useState(links);
  const [prevLinks, setPrevLinks] = useState(links);
  if (links !== prevLinks) {
    setPrevLinks(links);
    setItems(links);
  }
  const dragId = useRef<string | null>(null);

  useEffect(() => {
    if (state && !state.error) formRef.current?.reset();
  }, [state]);

  function handleDragEnter(overId: string) {
    const fromId = dragId.current;
    if (!fromId || fromId === overId) return;
    setItems((curr) => {
      const from = curr.findIndex((i) => i.id === fromId);
      const to = curr.findIndex((i) => i.id === overId);
      if (from === -1 || to === -1) return curr;
      const next = [...curr];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function handleDrop() {
    dragId.current = null;
    setItems((curr) => {
      reorderLinks(
        pageId,
        curr.map((i) => i.id)
      );
      return curr;
    });
  }

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
        {items.map((link, i) => (
          <LinkRow
            key={link.id}
            link={link}
            isFirst={i === 0}
            isLast={i === items.length - 1}
            onDragStart={() => (dragId.current = link.id)}
            onDragEnter={() => handleDragEnter(link.id)}
            onDrop={handleDrop}
          />
        ))}
      </ul>
      {items.length === 0 && (
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

const inputClass =
  "w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400";

function LinkRow({
  link,
  isFirst,
  isLast,
  onDragStart,
  onDragEnter,
  onDrop,
}: {
  link: LinkModel;
  isFirst: boolean;
  isLast: boolean;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDrop: () => void;
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
          className="space-y-2"
        >
          <input
            name="title"
            defaultValue={link.title}
            required
            maxLength={80}
            placeholder="Label"
            className={inputClass}
          />
          <input
            name="url"
            type="url"
            defaultValue={link.url}
            required
            placeholder="https://…"
            className={inputClass}
          />
          <input
            name="thumbnailUrl"
            type="url"
            defaultValue={link.thumbnailUrl ?? ""}
            placeholder="Thumbnail image URL (optional)"
            className={inputClass}
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-slate-400">
                Embed as
              </span>
              <select
                name="embedType"
                defaultValue={link.embedType ?? ""}
                className={inputClass}
              >
                <option value="">Button (default)</option>
                <option value="youtube">YouTube video</option>
                <option value="spotify">Spotify</option>
              </select>
            </label>
            <label className="flex items-end gap-2 pb-2">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={link.featured}
                className="h-4 w-4 rounded border-white/20 bg-slate-900"
              />
              <span className="text-sm text-slate-300">Feature this link</span>
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-slate-400">
                Show from (optional)
              </span>
              <input
                type="datetime-local"
                name="startsAt"
                defaultValue={toLocalInput(link.startsAt)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-400">
                Hide after (optional)
              </span>
              <input
                type="datetime-local"
                name="endsAt"
                defaultValue={toLocalInput(link.endsAt)}
                className={inputClass}
              />
            </label>
          </div>

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
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onDragEnd={onDrop}
      className={`flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/40 p-3 ${
        link.active ? "" : "opacity-50"
      }`}
    >
      {/* Drag handle */}
      <span
        className="shrink-0 cursor-grab select-none text-slate-600 active:cursor-grabbing"
        title="Drag to reorder"
        aria-hidden
      >
        ⠿
      </span>

      {/* Keyboard-accessible reorder fallback */}
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

      {link.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={link.thumbnailUrl}
          alt=""
          className="h-8 w-8 shrink-0 rounded object-cover"
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-medium text-white">
          {link.featured && <span title="Featured">★</span>}
          {link.embedType && <span title="Embed">▶</span>}
          {(link.startsAt || link.endsAt) && <span title="Scheduled">⏱</span>}
          <span className="truncate">{link.title}</span>
        </p>
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
