import axios from "axios";

export const ROSTER_SHEET_ID = "167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg";
const API_KEY = process.env.REACT_APP_ACTIVE_INFO_KEY;

export const ROSTER_RANGE = "Form Responses 1!C2:M";

/* The chapter parks the sitting Director of Rituals on a tab of their own so
   they stay off the site. That tab is a year behind: it still holds Brandon
   Koh, last year's DoR, who belongs back on the roster now. Its columns match
   ROSTER_RANGE, so the rows drop straight in. */
export const DOR_RANGE = "DOR!C1:M";

/* Hidden from Meet Us and from /:name — NOT deleted. The sheet row stays put,
   and the headshot and company logo stay in src/Assets. Emptying this list
   puts them back on the site with their data intact. */
export const HIDDEN_BROTHERS = ["Henry Lee"];

export function isHiddenBrother(name) {
  return HIDDEN_BROTHERS.includes(String(name ?? "").trim());
}

// Must stay in sync with the slug built in ActiveBrotherList and MeetUs.
export function rosterSlug(name = "") {
  return String(name ?? "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Every brother the site should show: the roster tab plus the parked DoR tab,
 * minus anyone in HIDDEN_BROTHERS. One batchGet, so it costs a single request.
 *
 * Sorted by name, because the roster tab is maintained in alphabetical order
 * and the DoR rows would otherwise land in a clump at the end of the grid.
 */
export async function fetchVisibleRoster() {
  const ranges = [ROSTER_RANGE, DOR_RANGE]
    .map((range) => `ranges=${encodeURIComponent(range)}`)
    .join("&");
  const response = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ROSTER_SHEET_ID}/values:batchGet?key=${API_KEY}&${ranges}`,
  );
  const valueRanges = response.data.valueRanges || [];
  return valueRanges
    .flatMap((valueRange) => valueRange.values || [])
    .filter((row) => row?.[0] && !isHiddenBrother(row[0]))
    .sort((a, b) =>
      String(a[0]).trim().localeCompare(String(b[0]).trim(), "en", {
        sensitivity: "base",
      }),
    );
}
