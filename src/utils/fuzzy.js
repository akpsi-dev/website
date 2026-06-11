/** Small fuzzy matcher for "did you mean" suggestions on bad /:name slugs. */

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = curr;
  }
  return prev[n];
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Returns the top `count` names closest to `query`, best first.
 * Names sharing a token with the query rank above pure edit distance.
 */
export function closestNames(query, names, count = 3) {
  const q = normalize(query);
  const queryTokens = query
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);

  return names
    .map((name) => {
      const distance = levenshtein(q, normalize(name));
      const tokenHit = name
        .toLowerCase()
        .split(/\s+/)
        .some((token) =>
          queryTokens.some(
            (qt) => token.startsWith(qt) || qt.startsWith(token),
          ),
        );
      return { name, score: distance - (tokenHit ? 6 : 0) };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map((entry) => entry.name);
}
