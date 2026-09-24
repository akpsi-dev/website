import { LOCAL_CAREERS, mergeCareerRows } from "./careersLocal";

const CATEGORIES = [
  "Accounting",
  "Finance",
  "Consulting",
  "Marketing",
  "Technology",
  "Misc",
];

describe("LOCAL_CAREERS", () => {
  it("uses the six-column sheet shape", () => {
    LOCAL_CAREERS.forEach((row) => expect(row).toHaveLength(6));
  });

  it("files every row under a year the ledger has a tab for", () => {
    // The list is no longer 2026-only: Braeden, Logan and Tyler are incoming
    // on their roles in 2027, so the year is what separates them.
    LOCAL_CAREERS.forEach((row) => expect(["2026", "2027"]).toContain(row[1]));
  });

  it("files the incoming brothers under 2027, not 2026", () => {
    const incoming = ["Braeden Yeoh", "Logan Kim", "Tyler Ho"];
    incoming.forEach((name) => {
      const rows = LOCAL_CAREERS.filter((row) => row[0] === name);
      expect(rows).toHaveLength(1);
      expect(rows[0][1]).toBe("2027");
    });
  });

  it("only uses categories the ledger renders", () => {
    LOCAL_CAREERS.forEach((row) => expect(CATEGORIES).toContain(row[2]));
  });

  it("lists no row twice", () => {
    // Keyed on name + company + position rather than name alone: a brother
    // can hold two roles at once (Annie Nguyen's Adobe analyst seat and her
    // Microsoft ambassadorship), and the sheet has carried multi-role
    // brothers since 2024. What this still catches is the same placement
    // pasted in twice.
    const keys = LOCAL_CAREERS.map((row) => `${row[0]}|${row[4]}|${row[5]}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("gives a brother with two roles a row for each", () => {
    const annie = LOCAL_CAREERS.filter((row) => row[0] === "Annie Nguyen");
    expect(annie.map((row) => row[4]).sort()).toEqual(["Adobe", "Microsoft"]);
  });

  it("leaves no blank cells", () => {
    LOCAL_CAREERS.forEach((row) =>
      row.forEach((cell) => expect(String(cell).trim()).not.toBe("")),
    );
  });
});

describe("mergeCareerRows", () => {
  it("keeps every sheet row untouched", () => {
    const sheet = [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]];
    expect(mergeCareerRows(sheet)).toEqual(expect.arrayContaining([sheet[0]]));
  });

  it("appends the local rows when the sheet has none", () => {
    const merged = mergeCareerRows([["Alice", "2025", "F", "S", "C", "P"]]);
    expect(merged).toHaveLength(1 + LOCAL_CAREERS.length);
  });

  it("lets a sheet row supersede the repo row for the same brother and year", () => {
    const sheet = [
      ["Anna Shan", "2026", "Finance", "From Sheet", "BlackRock", "Analyst"],
    ];
    const merged = mergeCareerRows(sheet);
    const annaRows = merged.filter((row) => row[0] === "Anna Shan");
    expect(annaRows).toHaveLength(1);
    expect(annaRows[0][3]).toBe("From Sheet");
  });

  it("matches names case- and whitespace-insensitively", () => {
    const sheet = [["  anna shan  ", "2026", "F", "S", "C", "P"]];
    const annaRows = mergeCareerRows(sheet).filter(
      (row) => String(row[0]).trim().toLowerCase() === "anna shan",
    );
    expect(annaRows).toHaveLength(1);
  });

  it("does not treat a different year as a duplicate", () => {
    const sheet = [["Anna Shan", "2025", "F", "S", "C", "P"]];
    const annaRows = mergeCareerRows(sheet).filter(
      (row) => row[0].trim() === "Anna Shan",
    );
    expect(annaRows).toHaveLength(2);
  });

  it("survives a missing or malformed sheet response", () => {
    expect(mergeCareerRows(undefined)).toHaveLength(LOCAL_CAREERS.length);
    expect(mergeCareerRows(null)).toHaveLength(LOCAL_CAREERS.length);
  });
});
