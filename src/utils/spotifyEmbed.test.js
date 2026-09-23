import { spotifyEmbedUrl } from "./spotifyEmbed";

const TRACK = "https://open.spotify.com/embed/track/2ZCbeHTNfpzUbiWlhVPkBo";

describe("spotifyEmbedUrl", () => {
  it("builds the player URL from a plain share link", () => {
    expect(
      spotifyEmbedUrl("https://open.spotify.com/track/2ZCbeHTNfpzUbiWlhVPkBo"),
    ).toBe(TRACK);
  });

  it("drops the share and campaign parameters the app appends", () => {
    expect(
      spotifyEmbedUrl(
        "https://open.spotify.com/track/2ZCbeHTNfpzUbiWlhVPkBo?si=BKNtObRMSmG97c4fjEz8bQ&utm_source=copy-link",
      ),
    ).toBe(TRACK);
  });

  it("handles the context and autoplay parameters too", () => {
    expect(
      spotifyEmbedUrl(
        "https://open.spotify.com/track/2ZCbeHTNfpzUbiWlhVPkBo?autoplay_ok=1&context=spotify%3Aplaylist%3A37i9dQZF1F5p",
      ),
    ).toBe(TRACK);
  });

  it("handles a locale link", () => {
    expect(
      spotifyEmbedUrl(
        "https://open.spotify.com/intl-de/track/2ZCbeHTNfpzUbiWlhVPkBo?si=x",
      ),
    ).toBe(TRACK);
  });

  it("handles the desktop app's spotify: URI", () => {
    expect(spotifyEmbedUrl("spotify:track:2ZCbeHTNfpzUbiWlhVPkBo")).toBe(TRACK);
  });

  it("reads the id out of an iframe someone pasted by hand", () => {
    expect(
      spotifyEmbedUrl(
        '<iframe src="https://open.spotify.com/embed/track/2ZCbeHTNfpzUbiWlhVPkBo?utm_source=generator" width="100%"></iframe>',
      ),
    ).toBe(TRACK);
  });

  it("keeps albums, playlists and podcast episodes", () => {
    expect(spotifyEmbedUrl("https://open.spotify.com/album/abc123")).toBe(
      "https://open.spotify.com/embed/album/abc123",
    );
    expect(spotifyEmbedUrl("https://open.spotify.com/episode/abc123")).toBe(
      "https://open.spotify.com/embed/episode/abc123",
    );
  });

  it("returns null for an empty, missing or non-Spotify cell", () => {
    expect(spotifyEmbedUrl("")).toBeNull();
    expect(spotifyEmbedUrl(undefined)).toBeNull();
    expect(spotifyEmbedUrl("   ")).toBeNull();
    expect(spotifyEmbedUrl("https://music.apple.com/song/123")).toBeNull();
  });

  it("refuses a Spotify URL that is not an embeddable thing", () => {
    expect(spotifyEmbedUrl("https://open.spotify.com/user/someone")).toBeNull();
  });

  it("never returns markup, so nothing from the sheet can be injected", () => {
    expect(spotifyEmbedUrl('<img src=x onerror="alert(1)">')).toBeNull();
  });
});
