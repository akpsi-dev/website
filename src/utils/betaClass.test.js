import {
  BETA_CLASS,
  BETA_CLASS_VISIBLE,
  betaClassRows,
  betaMembersAwaitingPhotos,
  hasHeadshot,
  isBetaMemberReady,
} from "./betaClass";
import { headshotHash } from "../Assets/headshot";

describe("BETA_CLASS", () => {
  it("is on, with the readiness gate rather than the flag holding members back", () => {
    expect(BETA_CLASS_VISIBLE).toBe(true);
    // Every member the flag lets through has to be ready, which is what
    // makes turning it on safe while most of the class is still blank.
    expect(betaClassRows().length).toBeLessThan(BETA_CLASS.length);
    betaClassRows().forEach((row) => {
      expect(headshotHash[row[0]]).toBeDefined();
    });
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

  it("keeps the members alphabetical, as the roster sheet is", () => {
    const names = BETA_CLASS.map((member) => member.fullName);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe("isBetaMemberReady", () => {
  it("needs both a write-up and a registered headshot", () => {
    const withPhoto = Object.keys(headshotHash)[0];
    expect(isBetaMemberReady({ fullName: withPhoto, whyAkpsi: "words" })).toBe(
      true,
    );
    // A write-up but no photo is the case that would render a grey card.
    expect(
      isBetaMemberReady({ fullName: "Nobody At All", whyAkpsi: "words" }),
    ).toBe(false);
    // A photo but no words is an empty profile behind a real face.
    expect(isBetaMemberReady({ fullName: withPhoto })).toBe(false);
    expect(isBetaMemberReady(undefined)).toBe(false);
  });
});

describe("betaMembersAwaitingPhotos", () => {
  it("names every member with no headshot, and only those", () => {
    const waiting = betaMembersAwaitingPhotos();
    BETA_CLASS.forEach((member) => {
      const key = member.fullName.toLowerCase();
      expect(waiting.has(key)).toBe(!hasHeadshot(member.fullName));
    });
  });

  it("does not suppress a member whose write-up lives on the sheet", () => {
    // Emily Chien filled the form out, so her words are in the roster rather
    // than in betaClass. Asking for them here as well suppressed the very row
    // that carried them, and she stayed off the site after her photo landed.
    const written = BETA_CLASS.filter(
      (member) => hasHeadshot(member.fullName) && !member.whyAkpsi,
    );
    const waiting = betaMembersAwaitingPhotos();
    written.forEach((member) => {
      expect(waiting.has(member.fullName.toLowerCase())).toBe(false);
    });
  });

  it("keys names the way roster.js does, lowercased and single spaced", () => {
    [...betaMembersAwaitingPhotos()].forEach((key) => {
      expect(key).toBe(key.trim().toLowerCase());
      expect(key).not.toMatch(/ {2}/);
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

  it("emits only the members who are ready", () => {
    const emitted = betaClassRows().map((row) => row[0]);
    expect(emitted).toEqual(
      BETA_CLASS.filter(isBetaMemberReady).map((member) => member.fullName),
    );
  });

  it("leaves out a member who has written their profile but has no photo", () => {
    const written = BETA_CLASS.find(
      (member) => member.whyAkpsi && !isBetaMemberReady(member),
    );
    // Skipped once every member with a write-up has their headshot in.
    if (!written) return;
    expect(betaClassRows().map((row) => row[0])).not.toContain(
      written.fullName,
    );
  });

  it("never emits a row whose member-written cells are blank", () => {
    betaClassRows().forEach((row) => {
      // Hometown, major, LinkedIn, interests, experience, ask-me-about,
      // why-AKPsi and the Spotify link all come from the member.
      [1, 2, 5, 6, 7, 8, 9, 10].forEach((i) =>
        expect(String(row[i]).trim()).not.toBe(""),
      );
    });
  });

  it("joins the list cells with newlines, the way splitItems reads them", () => {
    const row = betaClassRows().find((r) => r[0] === "Pranav Rao");
    expect(row[7].split("\n")).toContain("Hardware R&D Engineer - HERO Lab");
    expect(row[6].split("\n").length).toBeGreaterThan(1);
  });

  it("puts each cell in the roster's own column", () => {
    const row = betaClassRows().find((r) => r[0] === "Pranav Rao");
    expect(row[1]).toBe("Santa Clara, CA");
    expect(row[2]).toBe("Electrical Engineering");
    expect(row[4]).toBe("2029");
    expect(row[5]).toContain("linkedin.com/in/pranavrao09");
    expect(row[10]).toContain("open.spotify.com/track/");
  });
});
