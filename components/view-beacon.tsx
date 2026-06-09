"use client";

import { useEffect } from "react";

// Fire-and-forget page-view tracker. Runs once per browser session per page so
// refreshes and React strict-mode double-renders don't inflate the count.
export function ViewBeacon({ pageId }: { pageId: string }) {
  useEffect(() => {
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
