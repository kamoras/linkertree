"use client";

import { useEffect } from "react";

// Ensure a stable per-visitor id in a cookie so the server can (a) count each
// visitor once and (b) attribute clicks to a visit for an honest CTR.
function ensureVisitId(): void {
  if (document.cookie.includes("lt_vid=")) return;
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  // ~1 year, lax so it's sent on the click redirect navigation too.
  document.cookie = `lt_vid=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

// Fire-and-forget page-view tracker. Runs once per browser session per page so
// refreshes and React strict-mode double-renders don't spam the endpoint; the
// server dedupes per visitor regardless.
export function ViewBeacon({ pageId }: { pageId: string }) {
  useEffect(() => {
    ensureVisitId();

    const key = `lt-viewed:${pageId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable — still count the view
    }

    // The real traffic source is document.referrer (the page that linked here,
    // e.g. instagram.com) — NOT the request's Referer header, which for this
    // same-origin fetch would just be the linktree page itself. Ignore
    // same-origin referrers so internal navigation counts as "Direct".
    let referrer = "";
    try {
      if (
        document.referrer &&
        new URL(document.referrer).origin !== window.location.origin
      ) {
        referrer = document.referrer;
      }
    } catch {
      // malformed referrer — leave blank
    }

    fetch(`/api/view/${pageId}`, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referrer }),
    }).catch(() => {});
  }, [pageId]);

  return null;
}
