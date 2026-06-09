import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon — the brand mark on a gradient tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #43E660, #1B5E2B)",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 9.5 L8.5 22 M16 9.5 L23.5 22"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="16" cy="7" r="3.2" fill="#fff" />
          <circle cx="8" cy="24.5" r="2.9" fill="#fff" />
          <circle cx="24" cy="24.5" r="2.9" fill="#fff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
