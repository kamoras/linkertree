// Per-page appearance overrides layered on top of the chosen theme.

export const BUTTON_STYLES = [
  { id: "rounded", label: "Rounded" },
  { id: "pill", label: "Pill" },
  { id: "square", label: "Square" },
] as const;

export const BUTTON_RADIUS: Record<string, string> = {
  rounded: "rounded-xl",
  pill: "rounded-full",
  square: "rounded-none",
};

export const FONT_OPTIONS = [
  { id: "sans", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Mono" },
  { id: "rounded", label: "Rounded" },
  { id: "display", label: "Display" },
] as const;

export const FONT_STACKS: Record<string, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  rounded:
    'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", system-ui, sans-serif',
  display: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};

export function buttonRadius(style: string | null | undefined): string {
  return BUTTON_RADIUS[style ?? "rounded"] ?? BUTTON_RADIUS.rounded;
}

export function fontStack(font: string | null | undefined): string {
  return FONT_STACKS[font ?? "sans"] ?? FONT_STACKS.sans;
}

// Returns a readable foreground (#000 / #fff) for a given hex background.
export function contrastText(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#ffffff";
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  // Perceived luminance (sRGB).
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export function normalizeHex(value: string | null | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  return HEX_RE.test(v) ? v.toLowerCase() : null;
}

// hex -> rgba() string (for derived muted/ring colors on custom themes).
export function withAlpha(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const CUSTOM_THEME_ID = "custom";

export type CustomColors = {
  customBg?: string | null;
  customBg2?: string | null;
  customText?: string | null;
};

// Sensible defaults so a half-configured custom theme still looks intentional.
const DEFAULT_CUSTOM_BG = "#0f172a";
const DEFAULT_CUSTOM_TEXT = "#ffffff";

// Resolved background + text styling for the public page. For a custom theme we
// emit inline styles (arbitrary hex can't be Tailwind classes); otherwise the
// caller falls back to the preset theme's classes.
export function resolveCustomTheme(c: CustomColors) {
  const bg = normalizeHex(c.customBg) ?? DEFAULT_CUSTOM_BG;
  const bg2 = normalizeHex(c.customBg2);
  const text = normalizeHex(c.customText) ?? DEFAULT_CUSTOM_TEXT;
  return {
    backgroundStyle: {
      background: bg2 ? `linear-gradient(to bottom, ${bg}, ${bg2})` : bg,
    } as const,
    textColor: text,
    mutedColor: withAlpha(text, 0.7),
    ringColor: withAlpha(text, 0.25),
  };
}
