// Visual themes for public linktree pages. Each theme is a self-contained set of
// CSS classes so pages render without external config. Add new themes here and
// they automatically appear in the dashboard theme picker.

export type Theme = {
  id: string;
  name: string;
  // Page background (behind the card).
  background: string;
  // Primary text color.
  text: string;
  // Muted/secondary text color.
  muted: string;
  // Link button styles (idle + hover).
  button: string;
  // Avatar ring color.
  ring: string;
};

export const themes: Theme[] = [
  {
    id: "midnight",
    name: "Midnight",
    background: "bg-gradient-to-b from-slate-900 via-slate-900 to-black",
    text: "text-white",
    muted: "text-slate-400",
    button:
      "bg-white/10 text-white border border-white/10 hover:bg-white/20 hover:scale-[1.02]",
    ring: "ring-white/20",
  },
  {
    id: "sunset",
    name: "Sunset",
    background: "bg-gradient-to-b from-orange-500 via-pink-500 to-purple-600",
    text: "text-white",
    muted: "text-white/80",
    button:
      "bg-white/15 text-white border border-white/20 hover:bg-white/30 hover:scale-[1.02]",
    ring: "ring-white/40",
  },
  {
    id: "forest",
    name: "Forest",
    background: "bg-gradient-to-b from-emerald-800 via-emerald-700 to-green-900",
    text: "text-white",
    muted: "text-emerald-100/80",
    button:
      "bg-white/10 text-white border border-white/15 hover:bg-white/25 hover:scale-[1.02]",
    ring: "ring-emerald-200/40",
  },
  {
    id: "paper",
    name: "Paper",
    background: "bg-gradient-to-b from-stone-100 to-stone-200",
    text: "text-stone-900",
    muted: "text-stone-500",
    button:
      "bg-white text-stone-900 border border-stone-300 shadow-sm hover:shadow-md hover:scale-[1.02]",
    ring: "ring-stone-300",
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "bg-gradient-to-b from-sky-500 via-blue-600 to-indigo-800",
    text: "text-white",
    muted: "text-sky-100/80",
    button:
      "bg-white/15 text-white border border-white/20 hover:bg-white/30 hover:scale-[1.02]",
    ring: "ring-white/40",
  },
  {
    id: "candy",
    name: "Candy",
    background: "bg-gradient-to-b from-fuchsia-400 via-rose-400 to-amber-300",
    text: "text-rose-950",
    muted: "text-rose-900/70",
    button:
      "bg-white/70 text-rose-950 border border-white/60 hover:bg-white hover:scale-[1.02]",
    ring: "ring-white/60",
  },
];

export const DEFAULT_THEME = "midnight";

export function getTheme(id: string | undefined | null): Theme {
  return themes.find((t) => t.id === id) ?? themes[0];
}
