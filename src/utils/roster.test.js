import axios from "axios";
import {
  fetchVisibleRoster,
  isHiddenBrother,
  rosterSlug,
  HIDDEN_BROTHERS,
} from "./roster";

jest.mock("axios");

function batchGet(rosterRows, dorRows) {
  axios.get.mockResolvedValue({
    data: {
      valueRanges: [{ values: rosterRows }, { values: dorRows }],
    },
  });
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

  it("restores the parked DoR tab onto the roster", async () => {
    batchGet([["Erin Tran"]], [["Brandon Koh", "Fullerton, CA"]]);
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toContain("Brandon Koh");
  });

  it("sorts the DoR rows into the roster rather than appending them", async () => {
    batchGet([["Aarush Inamdar"], ["Erin Tran"]], [["Brandon Koh"]]);
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toEqual([
      "Aarush Inamdar",
      "Brandon Koh",
      "Erin Tran",
    ]);
  });

  it("sorts case-insensitively", async () => {
    batchGet([["alex Kao"], ["Aarush Inamdar"]], []);
    const rows = await fetchVisibleRoster();
    expect(rows.map((row) => row[0])).toEqual(["Aarush Inamdar", "alex Kao"]);
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
});
