"use client";

import { useState } from "react";
import { deletePage } from "@/app/actions/pages";

export function DeletePageButton({
  pageId,
  title,
}: {
  pageId: string;
  title: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">Delete “{title}”?</span>
        <form action={deletePage.bind(null, pageId)}>
          <button className="font-medium text-rose-400 hover:text-rose-300">
            Yes
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="text-slate-400 hover:text-white"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-slate-500 transition hover:text-rose-400"
    >
      Delete
    </button>
  );
}
