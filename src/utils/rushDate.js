/** Fall Rush 2026 kickoff — 2026-09-28 18:00 America/Los_Angeles.
 *
 *  Written with an explicit -07:00 rather than a bare local timestamp so every
 *  visitor counts down to the same instant regardless of their own timezone.
 *  -07:00 is PDT, which is correct for this date: in 2026 US daylight time does
 *  not end until November 1, so September 28 is still on the summer offset.
 *
 *  Shared: the Home teaser hero and the Rush page both count down to it, so it
 *  lives here rather than inside either one of them.
 */
export const RUSH_START = new Date("2026-09-28T18:00:00-07:00");
