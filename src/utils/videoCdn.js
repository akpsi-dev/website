/**
 * Every video the site plays, in one place.
 *
 * Videos are never bundled — they are served from a CloudFront distribution, so
 * a video is a host plus a key rather than an import. Keeping both here means
 * swapping distributions is an edit to CDN_HOST and nothing else, instead of a
 * hunt through the three components that happen to render a <video>.
 *
 * TO DROP IN THE NEW DISTRIBUTION:
 *   1. Set CDN_HOST to the new domain (scheme included, no trailing slash).
 *   2. Point HOME_HERO at the key your friend uploaded it under.
 * If the new videos land on a *different* distribution than the old ones, give
 * that one entry an absolute https:// URL — videoUrl passes those through
 * untouched, so the two distributions can coexist.
 */

/** CloudFront distribution serving the current videos. */
export const CDN_HOST = "https://d395js6c4h8h6h.cloudfront.net";

/**
 * Named videos, as keys within CDN_HOST — or absolute URLs, for a video on some
 * other distribution.
 *
 * HOME_HERO is the one the Home page plays behind the title on arrival. It
 * lives on its own distribution rather than CDN_HOST, which is the absolute
 * URL case videoUrl was written for — the two distributions coexist without
 * either one having to move.
 */
export const VIDEOS = {
  HOME_HERO: "https://d3007pp24fl3gy.cloudfront.net/fall_rush_2026.mp4",
  RUSH: "Videos/SpringRushVideo2026.mp4",
  CRUISE: "Videos/CruiseVideo2026.mp4",
  CRUISE_MOBILE: "Videos/CruiseReelWebsite.mp4",
};

/**
 * Resolves a VIDEOS entry to a URL to hand a <video src>.
 *
 * Returns undefined for a missing or not-yet-set entry, which is deliberate:
 * React omits a src of undefined entirely, and Home's loader already treats a
 * video element with no source as "reveal the page now" rather than waiting on
 * a canplay that will never fire. So an unset video degrades to no video, not
 * to a broken request or a page stuck behind the loader.
 *
 * @param {keyof typeof VIDEOS} name
 * @returns {string | undefined}
 */
export function videoUrl(name) {
  const entry = VIDEOS[name];
  if (typeof entry !== "string" || entry.trim() === "") return undefined;

  const key = entry.trim();
  // An entry that is already a full URL belongs to another distribution (or an
  // external host) and is used as given.
  if (/^https?:\/\//i.test(key)) return key;

  return `${CDN_HOST.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}
