"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

// Renders a downloadable QR code that points at the public page URL.
export function QrCodeCard({ slug }: { slug: string }) {
  const [qr, setQr] = useState<{ url: string; dataUrl: string } | null>(null);

  useEffect(() => {
    const pageUrl = `${window.location.origin}/${slug}`;
    QRCode.toDataURL(pageUrl, {
      width: 512,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((dataUrl) => setQr({ url: pageUrl, dataUrl }))
      .catch(() => {});
  }, [slug]);

  const url = qr?.url ?? "";
  const dataUrl = qr?.dataUrl ?? null;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold">QR code</h2>
      <p className="mt-1 text-sm text-slate-400">
        Print it or share it — it links straight to your page.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white p-2">
          {dataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt={`QR code for ${url}`} className="h-full w-full" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-slate-400">{url}</p>
          {dataUrl && (
            <a
              href={dataUrl}
              download={`${slug}-qr.png`}
              className="mt-3 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Download PNG
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
