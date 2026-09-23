import axios from "axios";
import {
  fetchVisibleRoster,
  isHiddenBrother,
  rosterSlug,
  HIDDEN_BROTHERS,
} from "./roster";

jest.mock("axios");

/* The Beta shell is stubbed rather than imported, so these tests describe how
   the merge behaves and not who happens to be in the class this week. Turning
   the real class on would otherwise have broken every count below. */
let mockBetaVisible = false;
let mockBetaRows = [];
jest.mock("./betaClass", () => ({
  get BETA_CLASS_VISIBLE() {
    return mockBetaVisible;
  },
  betaClassRows: () => mockBetaRows,
}));

function batchGet(rosterRows, dorRows) {
  axios.get.mockResolvedValue({
    data: {
      valueRanges: [{ values: rosterRows }, { values: dorRows }],
    },
  });
}

async function fetchVisibleRosterFrom(rosterRows, dorRows) {
  batchGet(rosterRows, dorRows);
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

describe("fetchVisibleRoster", () => {
  beforeEach(() => {
    mockBetaVisible = false;
    mockBetaRows = [];
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
