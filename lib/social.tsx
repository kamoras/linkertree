import type { ReactNode } from "react";

// Supported social platforms for the icon row. Each entry has a brand color
// and a compact inline SVG glyph (no icon dependency, so pages stay portable).
// Where a faithful brand mark is impractical inline, we use a clean monogram.

export type SocialPlatform = {
  id: string;
  label: string;
  color: string;
  // How to build the href from the stored value.
  href: (value: string) => string;
  // Placeholder shown in the editor input.
  placeholder: string;
  icon: ReactNode;
};

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function Monogram({ text }: { text: string }) {
  return (
    <span className="text-[11px] font-bold leading-none tracking-tight">
      {text}
    </span>
  );
}

// Prefix a bare handle/URL with https:// when the user omitted the scheme.
function asUrl(value: string): string {
  const v = value.trim();
  if (!v) return "#";
  if (/^https?:\/\//i.test(v) || v.startsWith("mailto:") || v.startsWith("tel:"))
    return v;
  return `https://${v}`;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "instagram",
    label: "Instagram",
    color: "#E4405F",
    placeholder: "https://instagram.com/you",
    href: asUrl,
    icon: (
      <Glyph>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </Glyph>
    ),
  },
  {
    id: "x",
    label: "X / Twitter",
    color: "#000000",
    placeholder: "https://x.com/you",
    href: asUrl,
    icon: (
      <Glyph>
        <path d="M4 4l16 16M20 4L4 20" />
      </Glyph>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#010101",
    placeholder: "https://tiktok.com/@you",
    href: asUrl,
    icon: (
      <Glyph>
        <path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2 4 4.5 4.2" />
      </Glyph>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "#FF0000",
    placeholder: "https://youtube.com/@you",
    href: asUrl,
    icon: (
      <Glyph>
        <rect x="2.5" y="6" width="19" height="12" rx="3" />
        <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
      </Glyph>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    color: "#181717",
    placeholder: "https://github.com/you",
    href: asUrl,
    icon: <Monogram text="GH" />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    placeholder: "https://linkedin.com/in/you",
    href: asUrl,
    icon: <Monogram text="in" />,
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    placeholder: "https://facebook.com/you",
    href: asUrl,
    icon: <Monogram text="f" />,
  },
  {
    id: "twitch",
    label: "Twitch",
    color: "#9146FF",
    placeholder: "https://twitch.tv/you",
    href: asUrl,
    icon: (
      <Glyph>
        <path d="M4 4h16v10l-4 4h-4l-3 3v-3H4z" />
        <path d="M11 8v4M15 8v4" />
      </Glyph>
    ),
  },
  {
    id: "email",
    label: "Email",
    color: "#0F766E",
    placeholder: "you@example.com",
    href: (v) => `mailto:${v.trim()}`,
    icon: (
      <Glyph>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </Glyph>
    ),
  },
  {
    id: "website",
    label: "Website",
    color: "#475569",
    placeholder: "https://your-site.com",
    href: asUrl,
    icon: (
      <Glyph>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </Glyph>
    ),
  },
];

export const SOCIAL_PLATFORM_IDS = SOCIAL_PLATFORMS.map((p) => p.id);

export function getPlatform(id: string): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find((p) => p.id === id);
}
