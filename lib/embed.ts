// Convert a YouTube/Spotify share URL into an embeddable iframe src.

export function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.pathname.startsWith("/watch")) {
      id = u.searchParams.get("v") ?? "";
    } else if (u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/embed/")) {
      id = u.pathname.split("/")[2] ?? "";
    }
    id = id.split(/[?&/]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function spotifyEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    // /track/ID, /album/ID, /playlist/ID, /episode/ID, /show/ID
    const [, type, id] = u.pathname.split("/");
    const allowed = ["track", "album", "playlist", "episode", "show", "artist"];
    if (!allowed.includes(type) || !id) return null;
    return `https://open.spotify.com/embed/${type}/${id.split("?")[0]}`;
  } catch {
    return null;
  }
}

export function embedSrc(
  embedType: string | null | undefined,
  url: string
): string | null {
  if (embedType === "youtube") return youtubeEmbed(url);
  if (embedType === "spotify") return spotifyEmbed(url);
  return null;
}
