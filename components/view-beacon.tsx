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
    fetch(`/api/view/${pageId}`, { method: "POST", keepalive: true }).catch(
      () => {}
    );
  }, [pageId]);

  return null;
}
