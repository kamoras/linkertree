import type { CSSProperties } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { getTheme } from "@/lib/themes";
import {
  buttonRadius,
  fontStack,
  contrastText,
  normalizeHex,
  withAlpha,
  resolveCustomTheme,
  CUSTOM_THEME_ID,
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
  // Custom theme colors (used when theme === "custom").
  customBg?: string | null;
  customBg2?: string | null;
  customText?: string | null;
  links: LinkItem[];
  socials?: SocialItem[];
  // When true, link clicks route through the tracking redirect and a page-view
  // beacon fires. Off for the dashboard preview.
  trackClicks?: boolean;
};

function initials(title: string): string {
  const parts = title.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "·";
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
  customBg,
  customBg2,
  customText,
  links,
  socials = [],
  trackClicks = false,
}: LinktreeViewProps) {
  const t = getTheme(theme);
  const radius = buttonRadius(buttonStyle);
  const accent = normalizeHex(accentColor);

  const isCustom = theme === CUSTOM_THEME_ID;
  const custom = isCustom
    ? resolveCustomTheme({ customBg, customBg2, customText })
    : null;

  // Muted text: a class for presets, an inline color for custom themes.
  const mutedClass = custom ? "" : t.muted;
  const mutedStyle: CSSProperties | undefined = custom
    ? { color: custom.mutedColor }
    : undefined;

  // Button look: custom accent > custom-theme derived > preset classes.
  let buttonClass: string;
  let buttonStyleObj: CSSProperties | undefined;
  if (accent) {
    buttonClass = `${radius} border transition hover:opacity-90`;
    buttonStyleObj = {
      backgroundColor: accent,
      borderColor: accent,
      color: contrastText(accent),
    };
  } else if (custom) {
    buttonClass = `${radius} border transition hover:opacity-90`;
    buttonStyleObj = {
      backgroundColor: withAlpha(custom.textColor, 0.12),
      borderColor: withAlpha(custom.textColor, 0.22),
      color: custom.textColor,
    };
  } else {
    buttonClass = `${radius} ${t.button}`;
    buttonStyleObj = undefined;
  }

  const hasBgImage = Boolean(backgroundImageUrl);

  const containerClass = custom ? "" : `${t.background} ${t.text}`;
  const containerStyle: CSSProperties = {
    fontFamily: fontStack(fontFamily),
    ...(custom ? { ...custom.backgroundStyle, color: custom.textColor } : {}),
    ...(hasBgImage
      ? {
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
  };

  const avatarRingStyle = custom
    ? ({ ["--tw-ring-color"]: custom.ringColor } as CSSProperties)
    : undefined;

  return (
    <div
      className={`relative flex w-full flex-col items-center ${
        // Fill the viewport on public pages; fill the frame in the editor preview.
        trackClicks ? "min-h-screen" : "min-h-full"
      } ${containerClass} px-6 py-16`}
      style={containerStyle}
    >
      {hasBgImage && (
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      )}
      {trackClicks && <ViewBeacon pageId={pageId} />}

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center">
        {/* Avatar */}
        <div
          className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-4 ${
            custom ? "" : t.ring
          } bg-black/20 text-2xl font-bold`}
          style={avatarRingStyle}
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
          <p
            className={`mt-2 max-w-sm text-center text-sm ${mutedClass}`}
            style={mutedStyle}
          >
            {bio}
          </p>
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
            <p
              className={`text-center text-sm ${mutedClass}`}
              style={mutedStyle}
            >
              No links yet.
            </p>
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
              mutedClassName={mutedClass}
              mutedStyle={mutedStyle}
            />
          </div>
        )}

        {!hideBranding && (
          <footer
            className={`mt-auto pt-12 text-xs ${mutedClass}`}
            style={mutedStyle}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 opacity-70 transition hover:opacity-100"
            >
              <LogoMark className="h-3.5 w-3.5" />
              <span>Made with Linkertree</span>
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}
