import { splitItems } from "./splitItems";

describe("splitItems", () => {
  it("returns an empty list for blank or missing cells", () => {
    expect(splitItems("")).toEqual([]);
    expect(splitItems(undefined)).toEqual([]);
    expect(splitItems(null)).toEqual([]);
  });

  it("splits on blank-line separated entries, the common sheet shape", () => {
    expect(splitItems("Basketball\n\nBadminton\n\nGym")).toEqual([
      "Basketball",
      "Badminton",
      "Gym",
    ]);
  });

  it("splits on single newlines too", () => {
    // Rare in the sheet (one cell today) but real: the old parser split on
    // blank lines only, so a single-newline cell was one run-on item.
    expect(splitItems("Stocks\nGolf\nTraveling")).toEqual([
      "Stocks",
      "Golf",
      "Traveling",
    ]);
  });

  it("normalizes Windows and old-Mac line breaks", () => {
    expect(splitItems("Stocks\r\nGolf")).toEqual(["Stocks", "Golf"]);
    expect(splitItems("Stocks\rGolf")).toEqual(["Stocks", "Golf"]);
  });

  it("keeps commas inside an entry when the cell has line breaks", () => {
    expect(
      splitItems("Music (Alt Rap, RnB, Indie Pop)\n\nHyundai, Inc."),
    ).toEqual(["Music (Alt Rap, RnB, Indie Pop)", "Hyundai, Inc."]);
  });

  it("falls back to commas for legacy rows with no line breaks", () => {
    expect(splitItems("Stocks, Golf, Traveling")).toEqual([
      "Stocks",
      "Golf",
      "Traveling",
    ]);
  });

  it("trims whitespace around every entry", () => {
    expect(splitItems("  Stocks  \n\n   Golf ")).toEqual(["Stocks", "Golf"]);
    expect(splitItems(" Stocks ,  Golf ")).toEqual(["Stocks", "Golf"]);
  });

  it("drops empty entries from stray delimiters", () => {
    expect(splitItems("Stocks\n\n\n\nGolf\n\n")).toEqual(["Stocks", "Golf"]);
    expect(splitItems("Stocks,,Golf,")).toEqual(["Stocks", "Golf"]);
    expect(splitItems("\n\n")).toEqual([]);
    expect(splitItems(",,,")).toEqual([]);
  });

  it("returns a single entry when there is no delimiter at all", () => {
    expect(splitItems("Photography")).toEqual(["Photography"]);
  });
});
