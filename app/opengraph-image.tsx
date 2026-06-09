import { ImageResponse } from "next/og";

export const alt = "Linkertree — one link for everything you do";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social-share card for the site (Open Graph + Twitter).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b1020",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand accent bar */}
        <div
          style={{
            height: 12,
            background: "linear-gradient(90deg, #6366f1, #d946ef, #f59e0b)",
          }}
        />
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <svg width="72" height="72" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 9.5 L8.5 22 M16 9.5 L23.5 22"
                stroke="#a5b4fc"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="16" cy="7" r="3.2" fill="#a5b4fc" />
              <circle cx="8" cy="24.5" r="2.9" fill="#a5b4fc" />
              <circle cx="24" cy="24.5" r="2.9" fill="#a5b4fc" />
            </svg>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#ffffff" }}>
              Linkertree
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 78,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.05,
                maxWidth: 940,
              }}
            >
              One link for everything you do.
            </div>
            <div style={{ fontSize: 30, color: "#94a3b8", marginTop: 28 }}>
              Open source · Self-hostable · Free forever
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
