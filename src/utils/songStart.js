/**
 * Where in the song a member wants their player to begin.
 *
 * The form asks for a link and nothing else, so a request like Annabelle's —
 * "start it at 2:38" — has nowhere on the sheet to live. It lives here, keyed
 * on the name exactly as the sheet spells it, until the form grows a field
 * for it. A member with no entry gets the ordinary player, untouched.
 *
 * Seconds, or an "m:ss" string, which is how anybody reading the Spotify
 * timeline will write it down.
 */
export const SONG_START_TIMES = {
  // Interstate 10 (feat. Future) — asked for 2:38, the point her timeline
  // showed as -0:38 remaining. The track runs 3:18, so it is a real spot.
  "Annabelle Butarbutar": "2:38",
};

/**
 * The same song on YouTube, for the members whose start time has to hold for
 * everybody.
 *
 * Spotify's embed serves a signed-out visitor a thirty second preview, and
 * a request like 2:38 is simply not inside that clip. YouTube's player takes
 * a start parameter and honours it for anyone, signed in or not, and lands
 * there before the first note rather than jumping once playback begins.
 *
 * So a member listed here gets their song from YouTube. The trade is that
 * the card looks like a video rather than a Spotify player; the trade is
 * worth it only for somebody who actually asked for a timestamp, which is
 * why this table and SONG_START_TIMES are separate.
 *
 * Use the official upload, and check the id plays embedded before adding it:
 * plenty of music videos refuse to.
 */
export const SONG_VIDEOS = {
  // Mustard — "Interstate 10 feat. Future (Audio)", the artist's own channel.
  "Annabelle Butarbutar": "SmCgdsZfRHc",
};

/* The YouTube id for a member's song, or null. Only meaningful alongside a
   start time: without one the Spotify player is the nicer card. */
export function songVideoId(name) {
  return SONG_VIDEOS[String(name ?? "").trim()] ?? null;
}

/* "2:38" -> 158. Also accepts "1:02:30" and a plain seconds count, and
   returns 0 for anything that is not a time, so a typo can only mean "play
   it from the top" rather than seeking somewhere absurd. */
export function parseTimestamp(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  }
  const text = String(value ?? "").trim();
  if (!text) return 0;
  if (!/^\d+(:[0-5]\d)*$/.test(text)) return 0;

  const seconds = text
    .split(":")
    .reduce((total, part) => total * 60 + Number(part), 0);
  return seconds > 0 ? seconds : 0;
}

/**
 * The start offset in seconds for a member's player, 0 when they have not
 * asked for one.
 *
 * A "t=" on the link wins over the table above: if Spotify ever does hand
 * out timestamped track links, a member pasting one has said what they want
 * more directly than this file can.
 */
export function songStartSeconds(name, cell = "") {
  const param = String(cell ?? "").match(/[?&#]t=(\d+(?::[0-5]\d)*)/);
  if (param) {
    const fromLink = parseTimestamp(param[1]);
    if (fromLink) return fromLink;
  }
  return parseTimestamp(SONG_START_TIMES[String(name ?? "").trim()]);
}

export default songStartSeconds;
