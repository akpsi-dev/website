import { CDN_HOST, VIDEOS, videoUrl } from "./videoCdn";

describe("videoUrl", () => {
  it("joins the CDN host to a named video's key", () => {
    expect(videoUrl("RUSH")).toBe(`${CDN_HOST}/${VIDEOS.RUSH}`);
    expect(videoUrl("CRUISE")).toBe(`${CDN_HOST}/${VIDEOS.CRUISE}`);
    expect(videoUrl("CRUISE_MOBILE")).toBe(
      `${CDN_HOST}/${VIDEOS.CRUISE_MOBILE}`,
    );
  });

  it("produces a real https URL, not a doubled or missing slash", () => {
    // The whole point of the module is that a <video src> is safe to paste
    // wherever it lands, including after someone edits CDN_HOST by hand.
    expect(videoUrl("RUSH")).toMatch(/^https:\/\/[^/]+\/[^/].*\.mp4$/);
    expect(videoUrl("RUSH")).not.toMatch(/[^:]\/\//);
  });

  it("resolves HOME_HERO to its own distribution, not CDN_HOST", () => {
    // The rush video was uploaded to a second CloudFront distribution, so the
    // entry is an absolute URL rather than a key.
    expect(videoUrl("HOME_HERO")).toBe(VIDEOS.HOME_HERO);
    expect(videoUrl("HOME_HERO")).toMatch(/^https:\/\/[^/]+\/.+\.mp4$/);
  });

  it("returns undefined for an entry that is null or blank", () => {
    // What an unset video has to resolve to: React omits a src of undefined
    // entirely, and Home's loader reveals the page rather than waiting on a
    // canplay that will never fire.
    const unset = { ...VIDEOS, HOME_HERO: null };
    expect(unset.HOME_HERO ?? undefined).toBeUndefined();
  });

  it("returns undefined for an unknown name rather than a broken URL", () => {
    expect(videoUrl("NOT_A_VIDEO")).toBeUndefined();
    expect(videoUrl(undefined)).toBeUndefined();
  });

  it("passes an absolute URL through, so a second distribution can coexist", () => {
    const other = "https://d1newdist123.cloudfront.net/Videos/HomeHero.mp4";
    VIDEOS.__TEST__ = other;
    expect(videoUrl("__TEST__")).toBe(other);
    delete VIDEOS.__TEST__;
  });

  it("tolerates a stray slash on either side of the join", () => {
    VIDEOS.__TEST__ = "/Videos/HomeHero.mp4";
    expect(videoUrl("__TEST__")).toBe(`${CDN_HOST}/Videos/HomeHero.mp4`);
    delete VIDEOS.__TEST__;
  });
});
