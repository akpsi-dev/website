import {
  SONG_START_TIMES,
  parseTimestamp,
  songStartSeconds,
} from "./songStart";

describe("parseTimestamp", () => {
  it("reads a timeline stamp", () => {
    expect(parseTimestamp("2:38")).toBe(158);
  });

  it("reads an hour-long stamp", () => {
    expect(parseTimestamp("1:02:30")).toBe(3750);
  });

  it("reads a plain seconds count, as a string or a number", () => {
    expect(parseTimestamp("158")).toBe(158);
    expect(parseTimestamp(158)).toBe(158);
  });

  it("treats the top of the song as no request at all", () => {
    expect(parseTimestamp("0:00")).toBe(0);
    expect(parseTimestamp(0)).toBe(0);
  });

  it("refuses anything that is not a time", () => {
    ["", null, undefined, "soon", "2:38 please", "-1", "2:5", "2:78"].forEach(
      (value) => expect(parseTimestamp(value)).toBe(0),
    );
  });
});

describe("songStartSeconds", () => {
  it("honours a member's request", () => {
    expect(songStartSeconds("Annabelle Butarbutar", "")).toBe(158);
  });

  it("gives everyone else the top of the song", () => {
    expect(
      songStartSeconds(
        "Pranav Rao",
        "https://open.spotify.com/track/2ZCbeHTNfpzUbiWlhVPkBo",
      ),
    ).toBe(0);
  });

  it("matches the name the way the sheet may have spaced it", () => {
    expect(songStartSeconds("  Annabelle Butarbutar  ", "")).toBe(158);
  });

  it("is not fooled by a missing or unnamed brother", () => {
    expect(songStartSeconds(undefined, "")).toBe(0);
    expect(songStartSeconds("", "")).toBe(0);
  });

  it("lets a t= on the link win over the table", () => {
    expect(
      songStartSeconds(
        "Annabelle Butarbutar",
        "https://open.spotify.com/track/4j13h3sia1FhQG18bjSXEC?t=1:10",
      ),
    ).toBe(70);
  });

  it("ignores the si= parameter, which is not a timestamp", () => {
    expect(
      songStartSeconds(
        "Pranav Rao",
        "https://open.spotify.com/track/2ZCbeHTNfpzUbiWlhVPkBo?si=BKNtObRMSmG97c4fjEz8bQ",
      ),
    ).toBe(0);
  });

  it("keeps every request in the table a real time", () => {
    Object.entries(SONG_START_TIMES).forEach(([name, stamp]) => {
      expect(name.trim()).toBe(name);
      expect(parseTimestamp(stamp)).toBeGreaterThan(0);
    });
  });
});
