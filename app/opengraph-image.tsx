import { ImageResponse } from "next/og";

export const alt = "Linkertree — everything you are, in one link, for free";
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
          background: "#F3F1EA",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand accent bar */}
        <div
          style={{
            height: 14,
            background: "linear-gradient(90deg, #43E660, #1B5E2B)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <svg width="70" height="70" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 9.5 L8.5 22 M16 9.5 L23.5 22"
                stroke="#1B5E2B"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="16" cy="7" r="3.2" fill="#1B5E2B" />
              <circle cx="8" cy="24.5" r="2.9" fill="#1B5E2B" />
              <circle cx="24" cy="24.5" r="2.9" fill="#1B5E2B" />
            </svg>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#0F2E1B" }}>
              Linkertree
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 74,
                fontWeight: 800,
                color: "#0F2E1B",
                lineHeight: 1.04,
                maxWidth: 960,
              }}
            >
              Everything you are. In one link. For free.
            </div>
            <div style={{ fontSize: 30, color: "#3a5a48", marginTop: 26 }}>
              Every Pro feature, zero dollars · Open source · Self-hostable
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
