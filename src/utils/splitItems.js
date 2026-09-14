/**
 * Split a multi-entry sheet cell (Interests, Experience, Ask Me About) into
 * list items.
 *
 * Newline first, comma only as a fallback. A comma is ordinary punctuation
 * inside these entries — "Music (Alt Rap, RnB, Indie Pop)", "Hyundai America
 * Technical Center, Inc." — so splitting on it would shred entries that are
 * perfectly well formed. It only delimits when the cell has no line break at
 * all, which is the shape the older form responses came back in.
 */
export function splitItems(text) {
  if (!text) return [];

  // \r\n (Windows) and \r (old Mac) line breaks, normalized to \n.
  const normalized = String(text).replace(/\r\n|\r/g, "\n");

  // \n+ so a blank line between entries yields one break, not an empty item.
  const delimiter = normalized.includes("\n") ? /\n+/ : ",";

  return normalized
    .split(delimiter)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export default splitItems;
