import { BETA_CLASS, BETA_CLASS_VISIBLE, betaClassRows } from "./betaClass";

describe("BETA_CLASS", () => {
  it("stays off the site until the headshots and write-ups arrive", () => {
    expect(BETA_CLASS_VISIBLE).toBe(false);
  });

  it("lists each member once", () => {
    const names = BETA_CLASS.map((member) => member.fullName);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every member a name and a graduation year", () => {
    BETA_CLASS.forEach((member) => {
      expect(member.fullName.trim()).not.toBe("");
      expect(member.graduationYear).toMatch(/^20\d{2}$/);
    });
  });
});

describe("betaClassRows", () => {
  it("matches the roster's column count", () => {
    betaClassRows().forEach((row) => expect(row).toHaveLength(11));
  });

  it("files every member under the Beta pledge class", () => {
    betaClassRows().forEach((row) => expect(row[3]).toBe("Beta"));
  });

  it("puts the name and graduation year in the roster's own columns", () => {
    const row = betaClassRows().find((r) => r[0] === "Daniela Herrera");
    expect(row[0]).toBe("Daniela Herrera");
    expect(row[4]).toBe("2027");
  });

  it("leaves the member-written fields blank for now", () => {
    // Hometown, major, LinkedIn, interests, experience, ask-me-about,
    // why-AKPsi and the Spotify embed all come from the member.
    betaClassRows().forEach((row) => {
      [1, 2, 5, 6, 7, 8, 9, 10].forEach((i) => expect(row[i]).toBe(""));
    });
  });

  it("returns one row per member", () => {
    expect(betaClassRows()).toHaveLength(BETA_CLASS.length);
  });
});
