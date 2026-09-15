import { CAREERS_2026, mergeCareerRows } from "./careers2026";

const CATEGORIES = [
  "Accounting",
  "Finance",
  "Consulting",
  "Marketing",
  "Technology",
  "Misc",
];

describe("CAREERS_2026", () => {
  it("uses the six-column sheet shape", () => {
    CAREERS_2026.forEach((row) => expect(row).toHaveLength(6));
  });

  it("files every row under 2026", () => {
    CAREERS_2026.forEach((row) => expect(row[1]).toBe("2026"));
  });

  it("only uses categories the ledger renders", () => {
    CAREERS_2026.forEach((row) => expect(CATEGORIES).toContain(row[2]));
  });

  it("lists each brother once", () => {
    const names = CAREERS_2026.map((row) => row[0]);
    expect(new Set(names).size).toBe(names.length);
  });

  it("leaves no blank cells", () => {
    CAREERS_2026.forEach((row) =>
      row.forEach((cell) => expect(String(cell).trim()).not.toBe("")),
    );
  });
});

describe("mergeCareerRows", () => {
  it("keeps every sheet row untouched", () => {
    const sheet = [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]];
    expect(mergeCareerRows(sheet)).toEqual(expect.arrayContaining([sheet[0]]));
  });

  it("appends the 2026 rows when the sheet has none", () => {
    const merged = mergeCareerRows([["Alice", "2025", "F", "S", "C", "P"]]);
    expect(merged).toHaveLength(1 + CAREERS_2026.length);
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
    expect(mergeCareerRows(undefined)).toHaveLength(CAREERS_2026.length);
    expect(mergeCareerRows(null)).toHaveLength(CAREERS_2026.length);
  });
});
