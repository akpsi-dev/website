/**
 * The Spotify player URL for a "Favorite song (Spotify link)" cell.
 *
 * The form asks for a link and members paste exactly that — a share URL with
 * whatever tracking the Spotify app appended (?si=, &utm_source=, &context=,
 * ?autoplay_ok=). The page, though, was dropping the cell straight into
 * dangerouslySetInnerHTML, which renders a bare URL as its own text: the
 * naked link sat where the player should be. Older rows where somebody hand
 * pasted an <iframe> worked, which is why this went unnoticed.
 *
 * So: pull the id out of whatever shape the cell holds — share link, an
 * intl-xx link, a spotify: URI, or the src of a hand-pasted iframe — and
 * build the embed URL ourselves. Nothing from the sheet reaches the DOM as
 * markup any more.
 *
 * Returns null when there is no Spotify id to be found, which the caller
 * renders as no player at all rather than as broken text.
 */
const EMBEDDABLE = new Set(["track", "album", "playlist", "episode", "show"]);

export function spotifyEmbedUrl(raw) {
  const cell = String(raw ?? "").trim();
  if (!cell) return null;

  // open.spotify.com/track/ID, allowing for the /embed/ an already-built
  // player URL carries, an /intl-de style locale segment, and any query
  // string after the id.
  const url = cell.match(
    /open\.spotify\.com\/(?:embed\/)?(?:intl-[a-z-]+\/)?([a-z]+)\/([A-Za-z0-9]+)/i,
  );
  // spotify:track:ID, the desktop app's "copy Spotify URI".
  const uri = cell.match(/spotify:([a-z]+):([A-Za-z0-9]+)/i);
  const match = url ?? uri;
  if (!match) return null;

  const [, type, id] = match;
  const kind = type.toLowerCase();
  if (!EMBEDDABLE.has(kind)) return null;

  return `https://open.spotify.com/embed/${kind}/${id}`;
}

export default spotifyEmbedUrl;
