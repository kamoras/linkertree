// Linkertree brand mark + wordmark. The mark is an abstract "tree of links":
// a parent node branching to two child nodes. Monochrome (currentColor) so it
// adapts to any context — colour it via the `className` text color.

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      {/* Branches */}
      <path
        d="M16 9.5 L8.5 22 M16 9.5 L23.5 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Nodes */}
      <circle cx="16" cy="7" r="3.4" fill="currentColor" />
      <circle cx="8" cy="24.5" r="3.1" fill="currentColor" />
      <circle cx="24" cy="24.5" r="3.1" fill="currentColor" />
    </svg>
  );
}

// Mark + "Linkertree" wordmark. By default the mark picks up the brand indigo
// and the wordmark inherits the surrounding text color.
export function Logo({
  className,
  markClassName = "h-5 w-5 text-[#43E660]",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-semibold tracking-tight ${
        className ?? ""
      }`}
    >
      <LogoMark className={markClassName} />
      <span>Linkertree</span>
    </span>
  );
}
