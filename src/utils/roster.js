import axios from "axios";
import {
  BETA_CLASS_VISIBLE,
  betaClassRows,
  betaMembersAwaitingPhotos,
} from "./betaClass";

export const ROSTER_SHEET_ID = "167TmecKc4cduWtdounqiXDkYgQjssu9cSz4QLljuKLg";
const API_KEY = process.env.REACT_APP_ACTIVE_INFO_KEY;

export const ROSTER_RANGE = "Form Responses 1!C2:M";

/* The chapter moved to a second form, which writes to its own spreadsheet.
   Rather than copy rows between the two by hand — which is how a graduation
   year got typed over — the roster spreadsheet carries a "New Responses" tab
   holding an IMPORTRANGE of that form's responses, so the columns line up
   with ROSTER_RANGE and this stays one batchGet.

   Read AFTER the roster tab on purpose: same brother on both tabs means they
   resubmitted, and the newer answers are the ones to show. */
export const NEW_RESPONSES_RANGE = "New Responses!C2:M";

/* The chapter parks the sitting Director of Rituals on a tab of their own so
   they stay off the site. That tab is a year behind: it still holds Brandon
   Koh, last year's DoR, who belongs back on the roster now. Its columns match
   ROSTER_RANGE, so the rows drop straight in. */
export const DOR_RANGE = "DOR!C1:M";

/* Hidden from Meet Us and from /:name — NOT deleted. Every sheet row stays
   put, and every headshot and company logo stays in src/Assets. Deleting a
   name from this list puts that brother straight back, data intact. */
export const HIDDEN_BROTHERS = [
  // The sitting Director of Rituals, kept off the site by chapter convention.
  "Henry Lee",

  // Graduated. The class of 2026, plus Daniel Kim, whose 2025 class was
  // never cleared last year. Their roles live on the Careers page under 2026.
  // Ashlyn Wong is class of 2026 but stays on Meet Us by request.
  "Aarush Inamdar",
  "Alex Kao",
  "Alex Sriprathum",
  "Alexis Lin",
  "Allen Lai",
  "Anna Shan",
  "Anuj Patel",
  "Carl Qiao",
  "Daniel Kim",
  "David Kim",
  "Donny Chau",
  "Izella Han",
  "Lauren Cho",
  "Mason Whang",
  "Ryan Park",
  "Sarah Kim",
  "Yan Amy Zhou",

  // No longer in the chapter. Elle Hsu would not have been caught by the
  // graduating class — she is 2027.
  "Elle Hsu",
];

export function isHiddenBrother(name) {
  return HIDDEN_BROTHERS.includes(String(name ?? "").trim());
}

// Must stay in sync with the slug built in ActiveBrotherList and MeetUs.
export function rosterSlug(name = "") {
  return String(name ?? "")
    .trim()
    .replace(/\s+/g, "-");
}

/* Members answer the update form with instructions as often as with answers:
   "keep" in a cell they want left as it is, "just add" above the one role
   they came to add. A row replaces a row, so taken literally those words are
   what the profile renders — Melinda Do's page read "keep" under Ask Me
   About and under Why I Love AKPsi.

   So a new row is merged into the one it supersedes, cell by cell:
   "keep", or an unanswered cell, inherits what the roster tab already holds,
   and "just add" puts the lines under it in front of the existing ones
   instead of replacing them. Everything else is taken as written. */
const INHERIT = "keep";
const PREPEND = "just add";
const LINES = /\r\n|\r|\n/;

export function mergeNewResponse(newRow = [], previousRow = []) {
  const width = Math.max(newRow.length, previousRow.length);
  return Array.from({ length: width }, (_, i) => {
    const previous = previousRow[i] ?? "";
    const text = String(newRow[i] ?? "").trim();
    if (!text || text.toLowerCase() === INHERIT) return previous;

    const lines = text.split(LINES);
    if (lines[0].trim().toLowerCase() === PREPEND) {
      const added = lines.slice(1).filter((line) => line.trim());
      const held = String(previous)
        .split(LINES)
        .filter((line) => line.trim());
      return [...added, ...held].join("\n");
    }
    return newRow[i];
  });
}

/* An IMPORTRANGE that has lost its source — the spreadsheet renamed, moved,
   or its permission revoked — fills the tab with error text rather than going
   empty. Left alone, "#REF!" arrives here as a brother's name and renders a
   card. Sheets errors are the only cell values that start with "#". */
function isSheetError(row) {
  const name = String(row?.[0] ?? "").trim();
  return name.startsWith("#") || name === "Loading...";
}

/**
 * Every brother the site should show: the roster tab, the new form's imported
 * responses and the parked DoR tab, minus anyone in HIDDEN_BROTHERS. All three
 * are tabs of one spreadsheet, so it stays a single batchGet.
 *
 * Sorted by name, because the roster tab is maintained in alphabetical order
 * and the other two would otherwise land in a clump at the end of the grid.
 */
export async function fetchVisibleRoster() {
  const ranges = [ROSTER_RANGE, NEW_RESPONSES_RANGE, DOR_RANGE]
    .map((range) => `ranges=${encodeURIComponent(range)}`)
    .join("&");
  const response = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${ROSTER_SHEET_ID}/values:batchGet?key=${API_KEY}&${ranges}`,
  );
  const valueRanges = response.data.valueRanges || [];
  const [rosterValues = [], newResponseValues = [], dorValues = []] =
    valueRanges.map((valueRange) =>
      (valueRange.values || []).filter((row) => !isSheetError(row)),
    );

  /* Case, surrounding blanks and a doubled space between names are all
     typing, not a different brother. Inner spacing matters because rosterSlug
     collapses it too: "Erin  Tran" and "Erin Tran" already route to the same
     /Erin-Tran profile, so left as two rows they were two cards pointing at
     one page. */
  const nameKey = (row) =>
    String(row?.[0] ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  /* One row per brother, keyed on name. The roster tab is a form response
     sheet, so a submission appends rather than overwrites: a brother who
     fills the form twice — or who was typed in by hand and then submitted —
     has more than one row, and without this every one of them rendered as
     its own card on Meet Us. The last row wins, that being their most recent
     answers. */
  const byName = new Map();
  rosterValues.forEach((row) => {
    const key = nameKey(row);
    if (key) byName.set(key, row);
  });

  /* The new form's responses land after the roster tab's, so a brother who
     has filled out the newer form shows those answers. Whoever has not is
     untouched and keeps the row the roster tab holds for them. */
  newResponseValues.forEach((row) => {
    const key = nameKey(row);
    if (key) byName.set(key, mergeNewResponse(row, byName.get(key)));
  });

  /* The DoR tab is a parking spot that runs a year behind the roster, so it
     only supplies a brother the roster tab does not already hold. Otherwise
     Brandon Koh's stale parked row would outrank the form response he sends
     now that he is back on the roster. */
  dorValues.forEach((row) => {
    const key = nameKey(row);
    if (key && !byName.has(key)) byName.set(key, row);
  });

  /* A Beta member who has filled out the update form has a sheet row, and a
     sheet row does not pass through betaClassRows — so the class's readiness
     gate never saw it and they landed on Meet Us behind a grey placeholder.
     Suppressed here instead, which covers every tab at once. */
  const awaitingPhotos = betaMembersAwaitingPhotos();
  const sheetRows = [...byName.entries()]
    .filter(([key]) => !awaitingPhotos.has(key))
    .map(([, row]) => row);

  // Beta is a shell with no headshots or write-ups yet, so it stays off the
  // site behind its own flag. Once a member has a real row in the sheet, that
  // row wins and the shell entry drops out on its own.
  const onSheet = new Set(
    sheetRows.map((row) =>
      String(row?.[0] ?? "")
        .trim()
        .toLowerCase(),
    ),
  );
  const shellRows = BETA_CLASS_VISIBLE
    ? betaClassRows().filter(
        (row) => !onSheet.has(String(row[0]).trim().toLowerCase()),
      )
    : [];

  return [...sheetRows, ...shellRows]
    .filter((row) => row?.[0] && !isHiddenBrother(row[0]))
    .sort((a, b) =>
      String(a[0]).trim().localeCompare(String(b[0]).trim(), "en", {
        sensitivity: "base",
      }),
    );
}
