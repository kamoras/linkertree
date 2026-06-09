import Link from "next/link";
import { getTheme } from "@/lib/themes";
import {
  buttonRadius,
  fontStack,
  contrastText,
  normalizeHex,
} from "@/lib/appearance";
import { getPlatform } from "@/lib/social";
import { embedSrc } from "@/lib/embed";
import { ViewBeacon } from "@/components/view-beacon";
import { SubscribeForm } from "@/components/subscribe-form";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string | null;
  featured?: boolean;
  embedType?: string | null;
};

export type SocialItem = {
  id: string;
  platform: string;
  url: string;
};

export type LinktreeViewProps = {
  pageId: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  theme: string;
  accentColor?: string | null;
  backgroundImageUrl?: string | null;
  buttonStyle?: string | null;
  fontFamily?: string | null;
  hideBranding?: boolean;
  collectEmails?: boolean;
  emailHeading?: string | null;
  links: LinkItem[];
  socials?: SocialItem[];
  // When true, link clicks route through the tracking redirect and a page-view
  // beacon fires. Off for the dashboard preview.
  trackClicks?: boolean;
};

function initials(title: string): string {
  const parts = title.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "🌿";
}

export function LinktreeView({
  pageId,
  title,
  bio,
  avatarUrl,
  theme,
  accentColor,
  backgroundImageUrl,
  buttonStyle,
  fontFamily,
  hideBranding = false,
  collectEmails = false,
  emailHeading,
  links,
  socials = [],
  trackClicks = false,
}: LinktreeViewProps) {
  const t = getTheme(theme);
  const radius = buttonRadius(buttonStyle);
  const accent = normalizeHex(accentColor);

  // Resolve the button look: a custom accent overrides the theme's button
  // classes, otherwise we use the theme's.
  const buttonClass = accent
    ? `${radius} border transition hover:opacity-90`
    : `${radius} ${t.button}`;
  const buttonStyleObj = accent
    ? { backgroundColor: accent, borderColor: accent, color: contrastText(accent) }
    : undefined;

  const hasBgImage = Boolean(backgroundImageUrl);

  return (
    <div
      className={`relative flex min-h-full w-full flex-col items-center ${t.background} ${t.text} px-6 py-16`}
      style={{
        fontFamily: fontStack(fontFamily),
        ...(hasBgImage
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      {hasBgImage && (
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      )}
      {trackClicks && <ViewBeacon pageId={pageId} />}

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center">
        {/* Avatar */}
        <div
          className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-4 ${t.ring} bg-black/20 text-2xl font-bold`}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials(title)}</span>
          )}
        </div>

        <h1 className="mt-5 text-center text-2xl font-bold">{title}</h1>
        {bio && (
          <p className={`mt-2 max-w-sm text-center text-sm ${t.muted}`}>{bio}</p>
        )}

        {/* Social icons */}
        {socials.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {socials.map((s) => {
              const p = getPlatform(s.platform);
              if (!p) return null;
              return (
                <a
                  key={s.id}
                  href={p.href(s.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.label}
                  title={p.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-110"
                  style={{ backgroundColor: p.color }}
                >
                  {p.icon}
                </a>
              );
            })}
          </div>
        )}

        {/* Links */}
        <div className="mt-8 w-full space-y-3">
          {links.map((link, i) => {
            const src = embedSrc(link.embedType, link.url);
            const delay = { animationDelay: `${i * 60}ms` } as const;

            if (src) {
              return (
                <div key={link.id} className="animate-rise" style={delay}>
                  {link.title && (
                    <p className="mb-2 text-center text-sm font-medium">
                      {link.title}
                    </p>
                  )}
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                    <iframe
                      src={src}
                      title={link.title || "embed"}
                      loading="lazy"
                      allow="encrypted-media; clipboard-write; picture-in-picture"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  </div>
                </div>
              );
            }

            return (
              <a
                key={link.id}
                href={trackClicks ? `/api/click/${link.id}` : link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...delay, ...buttonStyleObj }}
                className={`animate-rise flex w-full items-center gap-3 px-5 py-4 font-medium transition ${buttonClass} ${
                  link.featured ? "shadow-lg ring-2 ring-current/30" : ""
                }`}
              >
                {link.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={link.thumbnailUrl}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                ) : null}
                <span
                  className={`min-w-0 flex-1 text-center ${
                    link.thumbnailUrl ? "-ml-10 pl-10" : ""
                  } ${link.featured ? "text-lg font-semibold" : ""}`}
                >
                  {link.title}
                </span>
                {link.featured && (
                  <span aria-hidden className="shrink-0 text-sm">
                    ★
                  </span>
                )}
              </a>
            );
          })}
          {links.length === 0 && (
            <p className={`text-center text-sm ${t.muted}`}>No links yet.</p>
          )}
        </div>

        {/* Email capture */}
        {collectEmails && (
          <div className="mt-8 w-full">
            <SubscribeForm
              pageId={pageId}
              heading={emailHeading}
              buttonClassName={buttonClass}
              buttonStyle={buttonStyleObj}
              inputClassName={`${radius} bg-black/20 border border-white/15 placeholder:opacity-60`}
              mutedClassName={t.muted}
            />
          </div>
        )}

        {!hideBranding && (
          <footer className={`mt-auto pt-12 text-xs ${t.muted}`}>
            <Link
              href="/"
              className="opacity-70 transition hover:opacity-100"
            >
              Made with 🌿 Linkertree
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}
