import { useEffect, useRef, useState } from "react";

/**
 * A brother's favorite-song player.
 *
 * Almost every member gets the plain embed iframe: cheap, lazy, no third
 * party script. A member who asked for their song to begin part way in gets
 * the same player driven by Spotify's iFrame API instead, because the embed
 * URL has no start-time parameter — seeking is the only way in.
 *
 * The seek happens on the first playback update that reports the track
 * running from the top, which is as early as the API will let us touch it:
 * browsers block autoplay, so nothing can move until the viewer presses
 * play. The first moment of the song is therefore audible before the jump.
 * That is a property of the embed, not of this code.
 *
 * If the API script fails to load — blocked, offline, Spotify having a day —
 * the component falls back to the ordinary iframe, so the worst case is a
 * player that starts at 0:00 rather than no player at all.
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

export default function SpotifyPlayer({ embedUrl, startAt = 0, title }) {
  const hostRef = useRef(null);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const uri = spotifyUri(embedUrl);
  const seeking = startAt > 0 && Boolean(uri) && !apiUnavailable;

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
