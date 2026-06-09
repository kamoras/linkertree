import { getTheme } from "@/lib/themes";

export type LinktreeViewProps = {
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  theme: string;
  links: { id: string; title: string; url: string }[];
  // When true, link clicks are tracked via the redirect endpoint.
  trackClicks?: boolean;
};

function initials(title: string): string {
  const parts = title.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "🌿";
}

export function LinktreeView({
  title,
  bio,
  avatarUrl,
  theme,
  links,
  trackClicks = false,
}: LinktreeViewProps) {
  const t = getTheme(theme);

  return (
    <div
      className={`flex min-h-full w-full flex-col items-center ${t.background} ${t.text} px-6 py-16`}
    >
      <div className="flex w-full max-w-md flex-1 flex-col items-center">
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

        {/* Links */}
        <div className="mt-8 w-full space-y-3">
          {links.map((link, i) => (
            <a
              key={link.id}
              href={
                trackClicks ? `/api/click/${link.id}` : link.url
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${i * 60}ms` }}
              className={`animate-rise block w-full rounded-xl px-5 py-4 text-center font-medium transition ${t.button}`}
            >
              {link.title}
            </a>
          ))}
          {links.length === 0 && (
            <p className={`text-center text-sm ${t.muted}`}>No links yet.</p>
          )}
        </div>

        <footer className={`mt-auto pt-12 text-xs ${t.muted}`}>
          <a
            href="/"
            className="opacity-70 transition hover:opacity-100"
          >
            Made with 🌿 Linkertree
          </a>
        </footer>
      </div>
    </div>
  );
}
