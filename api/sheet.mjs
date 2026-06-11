/**
 * Vercel serverless proxy for the two Google Sheets the site reads.
 *
 * Keeps the Sheets API keys server-side (env vars WITHOUT the REACT_APP_
 * prefix, so they never enter the client bundle) and only allows the exact
 * sheet/range combinations the site uses. Responses are edge-cached for
 * 5 minutes, which also absorbs traffic spikes against the Google quota.
 */

const ROSTER_SHEET_ID = "167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg";
const CAREERS_SHEET_ID = "1YY9TyYXJPHNJ8n1M2O9iKQaB00oCIghhkb5UpxTxV0g";

const WHITELIST = {
  [ROSTER_SHEET_ID]: {
    keyEnv: "ACTIVE_INFO_KEY",
    ranges: new Set([
      "Form Responses 1!C2:M",
      "Form Responses 1!C2:L",
      "Leadership Test!A2:C",
    ]),
  },
  [CAREERS_SHEET_ID]: {
    keyEnv: "CAREERS_INFO_KEY",
    ranges: new Set(["Form Responses 1!B2:G"]),
  },
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { id, range } = req.query;
  const entry = WHITELIST[id];
  if (!entry || !entry.ranges.has(range)) {
    res.status(403).json({ error: "Sheet or range not allowed" });
    return;
  }

  const apiKey = process.env[entry.keyEnv];
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured: missing API key" });
    return;
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const upstream = await fetch(url);
    if (!upstream.ok) {
      res
        .status(upstream.status === 429 ? 429 : 502)
        .json({ error: "Upstream sheet fetch failed" });
      return;
    }
    const data = await upstream.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
    res.status(200).json({ values: data.values ?? [] });
  } catch {
    res.status(502).json({ error: "Upstream sheet fetch failed" });
  }
}
