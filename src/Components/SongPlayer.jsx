import { useEffect, useRef, useState } from "react";

import { songVideoId } from "../utils/songStart";

/**
 * A brother's favorite-song player, in three shapes.
 *
 * Almost every member gets the plain Spotify embed: cheap, lazy, no third
 * party script.
 *
 * A member who asked for their song to begin part way in gets YouTube
 * instead, whose player takes a start parameter and is cued there before a
 * note plays, for every visitor. Spotify cannot do this: its embed URL has
 * no start-time parameter, and a signed-out listener is served a thirty
 * second preview that a request like 2:38 falls outside of altogether.
 *
 * The third shape is for a member who asks for a timestamp before anybody
 * has found their song on YouTube: the Spotify player driven by its iFrame
 * API, seeking on the first playback update that reports the track running
 * from the top. It works only for signed-in listeners and the opening
 * moment is audible before the jump, which is exactly why the YouTube path
 * exists — but it is better than ignoring the request. If the API script
 * fails to load, this falls back to the ordinary iframe, so the worst case
 * is a player that starts at 0:00 rather than no player at all.
 */

const IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

/* One script for the whole app, however many players ask for it. */
let apiPromise = null;

function loadIframeApi() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    if (window.SpotifyIframeApi) {
      resolve(window.SpotifyIframeApi);
      return;
    }

    window.onSpotifyIframeApiReady = (api) => {
      window.SpotifyIframeApi = api;
      resolve(api);
    };

    const script = document.createElement("script");
    script.src = IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("Spotify iFrame API failed to load"));
    };
    document.body.appendChild(script);
  });

  return apiPromise;
}

/* The API wants a URI, not the embed URL the sheet cell gives us. */
export function spotifyUri(embedUrl) {
  const match = String(embedUrl ?? "").match(
    /open\.spotify\.com\/embed\/([a-z]+)\/([A-Za-z0-9]+)/i,
  );
  return match ? `spotify:${match[1].toLowerCase()}:${match[2]}` : null;
}

export default function SongPlayer({ embedUrl, startAt = 0, name, title }) {
  const hostRef = useRef(null);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const videoId = startAt > 0 ? songVideoId(name) : null;
  const uri = spotifyUri(embedUrl);
  const seeking = startAt > 0 && !videoId && Boolean(uri) && !apiUnavailable;

  useEffect(() => {
    if (!seeking) return undefined;

    let controller = null;
    let cancelled = false;
    let seeked = false;

    loadIframeApi()
      .then((api) => {
        if (cancelled || !hostRef.current) return;

        api.createController(
          hostRef.current,
          { uri, width: "100%", height: 232 },
          (embedController) => {
            if (cancelled) {
              embedController.destroy();
              return;
            }
            controller = embedController;
            embedController.addListener("playback_update", (event) => {
              const { position, isPaused, duration } = event?.data ?? {};

              /* Only once, and only into a track that actually reaches the
                 timestamp. A signed-out visitor gets Spotify's 30 second
                 preview, whose duration is far short of a request like 2:38
                 — seeking past the end of that clip would strand the player
                 rather than honour anything, so it plays as it always has.
                 The first update also arrives mid-buffer with duration 0,
                 which this skips for the same reason. */
              if (seeked || isPaused !== false) return;
              if (!(duration > startAt * 1000)) return;
              /* Still at the top: the viewer's press of play, rather than
                 ordinary progress or a scrub of their own. */
              if (position >= 4000) return;

              seeked = true;
              embedController.seek(startAt);
            });
          },
        );
      })
      .catch(() => {
        if (!cancelled) setApiUnavailable(true);
      });

    return () => {
      cancelled = true;
      if (controller) controller.destroy();
    };
  }, [seeking, uri, startAt]);

  if (videoId) {
    /* start= is honoured for everyone, and nocookie keeps YouTube from
       writing anything until the viewer actually presses play. */
    return (
      <iframe
        className="brother-soundtrack__player"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${startAt}&rel=0`}
        title={title}
        width="100%"
        height="232"
        frameBorder="0"
        loading="lazy"
        allow="encrypted-media; clipboard-write; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  if (!seeking) {
    return (
      /* Height lives in the stylesheet next to the width it has to stay
         inside; this attribute is only the pre-CSS fallback. */
      <iframe
        className="brother-soundtrack__player"
        src={embedUrl}
        title={title}
        width="100%"
        height="232"
        frameBorder="0"
        loading="lazy"
        allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    );
  }

  /* createController replaces this node with an iframe of its own, so the
     player styles hang off the wrapper. */
  return (
    <div className="brother-soundtrack__host">
      <div ref={hostRef} />
    </div>
  );
}
