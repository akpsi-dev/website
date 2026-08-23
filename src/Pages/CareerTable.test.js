import { buildCareerData } from "./CareerTable";

// Row shape from the sheet: [Name, Year, Category, Sector, Company, Position]
const row = (name, year, category) => [
  name,
  year,
  category,
  "Sector",
  "Company",
  "Position",
];

describe("buildCareerData", () => {
  it("files a normal row under its year and category", () => {
    const data = buildCareerData([row("Alice", "2025", "Finance")]);
    expect(data["2025"].Finance.map((r) => r.Name)).toEqual(["Alice"]);
  });

  it("creates a bucket for a year that predates the code (the 2026 bug)", () => {
    // This is the row that used to throw and blank the entire Careers page.
    const data = buildCareerData([row("Bob", "2026", "Technology")]);
    expect(data["2026"].Technology.map((r) => r.Name)).toEqual(["Bob"]);
  });

  it("routes an unknown sector to Misc instead of throwing", () => {
    const data = buildCareerData([row("Cara", "2026", "Quantum Vibes")]);
    expect(data["2026"].Misc.map((r) => r.Name)).toEqual(["Cara"]);
  });

  it("survives blank, short, and year-less rows", () => {
    expect(() =>
      buildCareerData([[], ["Dan"], row("Eve", "", "Finance")]),
    ).not.toThrow();
  });

  it("handles a missing values array from the API", () => {
    expect(() => buildCareerData(undefined)).not.toThrow();
    expect(() => buildCareerData(null)).not.toThrow();
  });

  it("keeps the seeded year tabs present even with no data", () => {
    const data = buildCareerData([]);
    expect(Object.keys(data)).toEqual(
      expect.arrayContaining(["2018", "2025"]),
    );
  });

  it("does not lose earlier rows when a later row is malformed", () => {
    const data = buildCareerData([
      row("Alice", "2025", "Finance"),
      [],
      row("Bob", "2026", "Technology"),
    ]);
    expect(data["2025"].Finance).toHaveLength(1);
    expect(data["2026"].Technology).toHaveLength(1);
  });
});
