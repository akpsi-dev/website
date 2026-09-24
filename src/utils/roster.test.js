import axios from "axios";
import {
  fetchVisibleRoster,
  isHiddenBrother,
  rosterSlug,
  HIDDEN_BROTHERS,
  mergeNewResponse,
} from "./roster";

jest.mock("axios");

/* The Beta shell is stubbed rather than imported, so these tests describe how
   the merge behaves and not who happens to be in the class this week. Turning
   the real class on would otherwise have broken every count below. */
let mockBetaVisible = false;
let mockBetaRows = [];
let mockAwaitingPhotos = new Set();
jest.mock("./betaClass", () => ({
  get BETA_CLASS_VISIBLE() {
    return mockBetaVisible;
  },
  betaClassRows: () => mockBetaRows,
  betaMembersAwaitingPhotos: () => mockAwaitingPhotos,
}));

/* Ranges come back in the order they were requested: the roster tab, the new
   form's imported responses, then the parked DoR tab. */
function batchGet(rosterRows, dorRows, newResponseRows = []) {
  axios.get.mockResolvedValue({
    data: {
      valueRanges: [
        { values: rosterRows },
        { values: newResponseRows },
        { values: dorRows },
      ],
    },
  });
}

async function fetchVisibleRosterFrom(rosterRows, dorRows, newResponseRows) {
  batchGet(rosterRows, dorRows, newResponseRows);
  return fetchVisibleRoster();
}

describe("rosterSlug", () => {
  it("joins the name with hyphens, matching the /:name route", () => {
    expect(rosterSlug("Brandon Koh")).toBe("Brandon-Koh");
    expect(rosterSlug("  Ava Lily Tran  ")).toBe("Ava-Lily-Tran");
  });

  it("survives a blank or missing name", () => {
    expect(rosterSlug(undefined)).toBe("");
    expect(rosterSlug("")).toBe("");
  });
});

describe("isHiddenBrother", () => {
  it("hides the sitting Director of Rituals", () => {
    expect(isHiddenBrother("Henry Lee")).toBe(true);
    expect(isHiddenBrother(" Henry Lee ")).toBe(true);
  });

  it("leaves everyone else visible", () => {
    expect(isHiddenBrother("Brandon Koh")).toBe(false);
  });
});

describe("mergeNewResponse", () => {
  const previous = [
    "Melinda Do",
    "San Gabriel, CA",
    "old major",
    "Chi",
    "2028",
  ];

  it("takes the new answer wherever there is one", () => {
    const merged = mergeNewResponse(
      ["Melinda Do", "San Gabriel, CA", "new major"],
      previous,
    );
    expect(merged[2]).toBe("new major");
  });

  it('inherits the cell a member wrote "keep" in', () => {
    // She meant leave it alone; taken literally the profile renders the
    // word "keep" under that heading.
    const merged = mergeNewResponse(["Melinda Do", "keep", "KEEP "], previous);
    expect(merged[1]).toBe("San Gabriel, CA");
    expect(merged[2]).toBe("old major");
  });

  it("inherits a cell the member left empty rather than clearing it", () => {
    const merged = mergeNewResponse(["Melinda Do", ""], previous);
    expect(merged[1]).toBe("San Gabriel, CA");
  });

  it('puts a "just add" entry in front of the existing list', () => {
    const merged = mergeNewResponse(
      ["Melinda Do", "just add\nMarketing Ambassador - Taco Bell"],
      ["Melinda Do", "Consultant - SAP\nIntern - Somewhere"],
    );
    expect(merged[1].split("\n")).toEqual([
      "Marketing Ambassador - Taco Bell",
      "Consultant - SAP",
      "Intern - Somewhere",
    ]);
  });

  it("handles a first submission, with nothing to merge into", () => {
    expect(mergeNewResponse(["New Brother", "Irvine"], undefined)).toEqual([
      "New Brother",
      "Irvine",
    ]);
  });
});

describe("fetchVisibleRoster", () => {
  beforeEach(() => {
    mockBetaVisible = false;
    mockBetaRows = [];
    mockAwaitingPhotos = new Set();
  });
  afterEach(() => jest.clearAllMocks());

  it("drops hidden brothers without touching the sheet", async () => {
    batchGet(
      [
        ["Henry Lee", "Irvine"],
        ["Erin Tran", "Irvine"],
      ],
      [],
    );
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran"]);
  });

  it("shows a brother once when the form sheet holds two rows for them", async () => {
    // The roster tab is a form response sheet, so submitting appends. A
    // brother backfilled by hand who later fills out the form had a row each,
    // and Meet Us rendered a card for both.
    const rows = await fetchVisibleRosterFrom(
      [
        ["Erin Tran", "Irvine, CA"],
        ["Erin Tran", "Fullerton, CA"],
      ],
      [],
    );
    expect(rows).toHaveLength(1);
  });

  it("keeps the most recent of a brother's rows, not the backfilled one", async () => {
    const rows = await fetchVisibleRosterFrom(
      [
        ["Erin Tran", "stale backfill"],
        ["Erin Tran", "what she submitted"],
      ],
      [],
    );
    expect(rows[0][1]).toBe("what she submitted");
  });

  it("matches duplicate names regardless of case or stray spacing", async () => {
    const rows = await fetchVisibleRosterFrom(
      [["Erin Tran"], ["  erin tran  "]],
      [],
    );
    expect(rows).toHaveLength(1);
  });

  it("folds a doubled inner space, which the slug collapses anyway", async () => {
    // rosterSlug turns both of these into /Erin-Tran, so two rows meant two
    // cards leading to one profile.
    const rows = await fetchVisibleRosterFrom(
      [["Erin Tran"], ["Erin  Tran"]],
      [],
    );
    expect(rows).toHaveLength(1);
  });

  it("lets a form response outrank the year-behind DoR row", async () => {
    // Brandon Koh is parked on the DoR tab and belongs back on the roster. The
    // moment he fills out the form he is on both tabs, and the parked row is
    // the stale one.
    const rows = await fetchVisibleRosterFrom(
      [["Brandon Koh", "submitted this year"]],
      [["Brandon Koh", "parked last year"]],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0][1]).toBe("submitted this year");
  });

  it("restores the parked DoR tab onto the roster", async () => {
    batchGet([["Erin Tran"]], [["Brandon Koh", "Fullerton, CA"]]);
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toContain("Brandon Koh");
  });

  it("sorts the DoR rows into the roster rather than appending them", async () => {
    batchGet([["Ava Lily Tran"], ["Erin Tran"]], [["Brandon Koh"]]);
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toEqual([
      "Ava Lily Tran",
      "Brandon Koh",
      "Erin Tran",
    ]);
  });

  it("sorts case-insensitively", async () => {
    batchGet([["tyler Ho"], ["Ava Lily Tran"]], []);
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toEqual(["Ava Lily Tran", "tyler Ho"]);
  });

  it("skips blank and malformed rows", async () => {
    batchGet([["Erin Tran"], [], [""], [null]], []);
    const rows = await fetchVisibleRoster();
    expect(rows).toHaveLength(1);
  });

  it("requests both ranges in a single batchGet", async () => {
    batchGet([], []);
    await fetchVisibleRoster();
    expect(axios.get).toHaveBeenCalledTimes(1);
    const url = axios.get.mock.calls[0][0];
    expect(url).toContain("values:batchGet");
    expect(url).toContain(encodeURIComponent("Form Responses 1!C2:M"));
    expect(url).toContain(encodeURIComponent("DOR!C1:M"));
  });

  it("tolerates a sheet response with no valueRanges", async () => {
    axios.get.mockResolvedValue({ data: {} });
    await expect(fetchVisibleRoster()).resolves.toEqual([]);
  });

  it("keeps the hidden list as the single place names are suppressed", () => {
    expect(HIDDEN_BROTHERS).toContain("Henry Lee");
  });

  it("hides graduated seniors and departed brothers alike", async () => {
    batchGet(
      [
        ["Aarush Inamdar"],
        ["Elle Hsu"],
        ["Daniel Kim"],
        ["Erin Tran"],
        ["Tyler Ho"],
      ],
      [],
    );
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran", "Tyler Ho"]);
  });

  it("shows the new form's answers over the roster tab's for the same brother", async () => {
    // The point of the imported tab: a brother who resubmits is updated
    // without anyone copying rows between the two spreadsheets by hand.
    const rows = await fetchVisibleRosterFrom(
      [["Max Truong", "the old row"]],
      [],
      [["Max Truong", "what he just submitted"]],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0][1]).toBe("what he just submitted");
  });

  it("leaves a brother who has not filled the new form alone", async () => {
    const rows = await fetchVisibleRosterFrom(
      [["Erin Tran", "her roster row"]],
      [],
      [["Max Truong", "his new row"]],
    );
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran", "Max Truong"]);
    expect(rows[0][1]).toBe("her roster row");
  });

  it('keeps the old cell when the new form row says "keep"', async () => {
    const rows = await fetchVisibleRosterFrom(
      [["Melinda Do", "hers", "her why"]],
      [],
      [["Melinda Do", "new hometown", "keep"]],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0][1]).toBe("new hometown");
    expect(rows[0][2]).toBe("her why");
  });

  it("suppresses a Beta member who submitted the form but has no headshot", async () => {
    // The class's readiness gate only covers rows betaClassRows hands over.
    // A Beta member who fills the update form arrives on the sheet instead.
    mockAwaitingPhotos = new Set(["levia whang"]);
    const rows = await fetchVisibleRosterFrom(
      [["Erin Tran"]],
      [],
      [["Levia Whang", "Alameda, CA"]],
    );
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran"]);
  });

  it("keeps a Beta member whose headshot is in", async () => {
    mockAwaitingPhotos = new Set(["levia whang"]);
    const rows = await fetchVisibleRosterFrom(
      [["Pranav Rao", "Santa Clara, CA"]],
      [],
      [],
    );
    expect(rows.map((row) => row[0])).toEqual(["Pranav Rao"]);
  });

  it("writes Alpha out as Alpha Alpha, the way the older rows read", async () => {
    const rows = await fetchVisibleRosterFrom(
      [["Erin Tran", "", "", "Alpha", "2028"]],
      [],
    );
    expect(rows[0][3]).toBe("Alpha Alpha");
  });

  it("leaves every other pledge class as it was written", async () => {
    const rows = await fetchVisibleRosterFrom(
      [
        ["Erin Tran", "", "", "Chi"],
        ["Tyler Ho", "", "", "Upsilon"],
      ],
      [],
    );
    expect(rows.map((row) => row[3])).toEqual(["Chi", "Upsilon"]);
  });

  it("hides a Beta row with no headshot even when the name is not on the list", async () => {
    // The awaiting-photos list spells names the way this repo does. A sheet
    // row spelled differently would slip past it, so the class cell is the
    // backstop.
    mockAwaitingPhotos = new Set(["simram saini"]);
    const rows = await fetchVisibleRosterFrom(
      [
        ["Erin Tran", "", "", "Chi"],
        ["Simran Saini", "", "", "Beta", "2029"],
      ],
      [],
    );
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran"]);
  });

  it("shows a Beta member whose headshot is registered", async () => {
    const rows = await fetchVisibleRosterFrom(
      [["Megan Dinh", "Los Angeles, CA", "", "Beta", "2028"]],
      [],
    );
    expect(rows.map((row) => row[0])).toEqual(["Megan Dinh"]);
  });

  it("skips the error text a broken IMPORTRANGE fills the tab with", async () => {
    // Source renamed, moved or access revoked: every cell becomes #REF!, and
    // without this the grid renders a card named "#REF!".
    const rows = await fetchVisibleRosterFrom(
      [["Erin Tran"]],
      [],
      [["#REF!"], ["#N/A"], ["Loading..."], ["Max Truong"]],
    );
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran", "Max Truong"]);
  });

  it("requests the new responses tab alongside the other two", async () => {
    batchGet([], []);
    await fetchVisibleRoster();
    const url = axios.get.mock.calls[0][0];
    expect(url).toContain(encodeURIComponent("New Responses!C2:M"));
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("keeps the Beta shell off the roster while it is not visible", async () => {
    mockBetaVisible = false;
    mockBetaRows = [["Shell Member"]];
    const rows = await fetchVisibleRosterFrom([["Erin Tran"]], []);
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran"]);
  });

  it("sorts the shell rows in with the sheet rows once it is visible", async () => {
    mockBetaVisible = true;
    mockBetaRows = [["Ava Lily Tran"]];
    const rows = await fetchVisibleRosterFrom([["Erin Tran"]], []);
    expect(rows.map((row) => row[0])).toEqual(["Ava Lily Tran", "Erin Tran"]);
  });

  it("drops a shell row once that member has a row on the sheet", async () => {
    // The shell is a stand-in. The moment the real submission lands it is the
    // sheet's row that should be rendered, not the copy held in the repo.
    mockBetaVisible = true;
    mockBetaRows = [["Erin Tran", "held in the repo"]];
    const rows = await fetchVisibleRosterFrom(
      [["erin tran", "from the sheet"]],
      [],
    );
    expect(rows).toHaveLength(1);
    expect(rows[0][1]).toBe("from the sheet");
  });

  it("hides a shell member who is on the hidden list", async () => {
    mockBetaVisible = true;
    mockBetaRows = [["Henry Lee"]];
    const rows = await fetchVisibleRosterFrom([["Erin Tran"]], []);
    expect(rows.map((row) => row[0])).toEqual(["Erin Tran"]);
  });

  it("lists every hidden brother exactly once", () => {
    expect(new Set(HIDDEN_BROTHERS).size).toBe(HIDDEN_BROTHERS.length);
  });
});
