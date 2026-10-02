import { REMOVED_LIST_ITEMS, scrubRemovedItems } from "./roster";

/* Column order: name, hometown, major, class, year, linkedin, interests,
   experience, ask me about, why akpsi, song. */
const bradly = (askMeAbout) => [
  "Bradly Ho",
  "Irvine, CA",
  "Business Administration",
  "Alpha",
  "2027",
  "https://linkedin.com/in/x",
  "Hiking\nCoffee",
  "Intern - PwC",
  askMeAbout,
  "Why I love AKPsi",
  "https://open.spotify.com/track/abc",
];

describe("scrubRemovedItems", () => {
  it("takes the line down however the member typed it", () => {
    ["Prelaw", "Pre-law", "pre law", "  PRELAW  "].forEach((spelling) => {
      const row = scrubRemovedItems(
        bradly(`Ex-pet duck\n${spelling}\nMax Vano`),
      );
      expect(row[8]).toBe("Ex-pet duck\nMax Vano");
    });
  });

  it("leaves the rest of his answers alone", () => {
    const row = scrubRemovedItems(bradly("Ex-pet duck\nPrelaw"));
    expect(row[6]).toBe("Hiking\nCoffee");
    expect(row[7]).toBe("Intern - PwC");
    expect(row[9]).toBe("Why I love AKPsi");
  });

  it("costs nothing once the cell itself is cleared", () => {
    const row = scrubRemovedItems(bradly("Ex-pet duck\nMax Vano"));
    expect(row[8]).toBe("Ex-pet duck\nMax Vano");
  });

  it("does not touch a brother who asked for nothing", () => {
    const row = ["Max Vano", "", "", "", "", "", "", "", "Prelaw", "", ""];
    expect(scrubRemovedItems(row)).toBe(row);
  });

  it("names every brother in the table exactly as the sheet spells it", () => {
    Object.entries(REMOVED_LIST_ITEMS).forEach(([name, items]) => {
      expect(name.trim()).toBe(name);
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
