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
