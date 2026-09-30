import { render, screen, waitFor } from "@testing-library/react";
import SongPlayer, { spotifyUri } from "./SongPlayer";

const EMBED = "https://open.spotify.com/embed/track/4j13h3sia1FhQG18bjSXEC";

/* A stand-in for Spotify's iFrame API: hands back a controller, remembers
   the playback_update listener so a test can feed it updates, and records
   every seek. */
const stub = { createController: () => {} };

function fakeApi() {
  const seeks = [];
  let listener = null;

  const controller = {
    addListener: (event, fn) => {
      if (event === "playback_update") listener = fn;
    },
    seek: (seconds) => seeks.push(seconds),
    destroy: jest.fn(),
  };

  /* The component caches the API promise for the life of the app, so tests
     share one stub object and swap what its createController does. */
  stub.createController = (_el, _opts, callback) => callback(controller);

  return {
    seeks,
    controller,
    update: (data) => listener?.({ data }),
    get listening() {
      return Boolean(listener);
    },
  };
}

const PLAYING_FROM_TOP = { isPaused: false, position: 500, duration: 198000 };

describe("spotifyUri", () => {
  it("turns an embed URL into the URI the API wants", () => {
    expect(spotifyUri(EMBED)).toBe("spotify:track:4j13h3sia1FhQG18bjSXEC");
  });

  it("is null for anything else", () => {
    expect(spotifyUri("")).toBeNull();
    expect(spotifyUri("https://example.com/track/abc")).toBeNull();
  });
});

describe("SongPlayer", () => {
  afterEach(() => {
    delete window.SpotifyIframeApi;
  });

  it("renders the plain lazy iframe when no start time is asked for", () => {
    render(<SongPlayer embedUrl={EMBED} title="song" />);

    const frame = screen.getByTitle("song");
    expect(frame.tagName).toBe("IFRAME");
    expect(frame).toHaveAttribute("src", EMBED);
    expect(frame).toHaveAttribute("loading", "lazy");
    /* The whole point of the default path: no third party script. */
    expect(document.querySelector('script[src*="iframe-api"]')).toBeNull();
  });

  it("gives a member with a start time and a video the YouTube player", () => {
    render(
      <SongPlayer
        embedUrl={EMBED}
        startAt={158}
        name="Annabelle Butarbutar"
        title="song"
      />,
    );

    const frame = screen.getByTitle("song");
    /* Cued at the second she asked for, for every visitor. */
    expect(frame).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/SmCgdsZfRHc?start=158&rel=0",
    );
    /* And Spotify is not consulted at all. */
    expect(document.querySelector('script[src*="iframe-api"]')).toBeNull();
  });

  it("leaves her on Spotify when she has not asked for a start time", () => {
    render(
      <SongPlayer embedUrl={EMBED} name="Annabelle Butarbutar" title="song" />,
    );

    expect(screen.getByTitle("song")).toHaveAttribute("src", EMBED);
  });

  it("seeks to the requested second once the track plays from the top", async () => {
    const spotify = fakeApi();
    window.SpotifyIframeApi = stub;

    render(
      <SongPlayer
        embedUrl={EMBED}
        startAt={158}
        name="Nobody With A Video"
        title="song"
      />,
    );
    await waitFor(() => expect(spotify.listening).toBe(true));

    spotify.update(PLAYING_FROM_TOP);
    expect(spotify.seeks).toEqual([158]);
  });

  it("only redirects the viewer once, not on every update", async () => {
    const spotify = fakeApi();
    window.SpotifyIframeApi = stub;

    render(
      <SongPlayer
        embedUrl={EMBED}
        startAt={158}
        name="Nobody With A Video"
        title="song"
      />,
    );
    await waitFor(() => expect(spotify.listening).toBe(true));

    spotify.update(PLAYING_FROM_TOP);
    spotify.update({ isPaused: false, position: 1200, duration: 198000 });
    /* And a scrub of their own back to the start stays where they put it. */
    spotify.update({ isPaused: false, position: 0, duration: 198000 });
    expect(spotify.seeks).toEqual([158]);
  });

  it("leaves a signed-out visitor's 30 second preview alone", async () => {
    const spotify = fakeApi();
    window.SpotifyIframeApi = stub;

    render(
      <SongPlayer
        embedUrl={EMBED}
        startAt={158}
        name="Nobody With A Video"
        title="song"
      />,
    );
    await waitFor(() => expect(spotify.listening).toBe(true));

    /* 2:38 is past the end of a 30 second clip: seeking there would strand
       the player, so the preview plays as it always has. */
    spotify.update({ isPaused: false, position: 400, duration: 30000 });
    expect(spotify.seeks).toEqual([]);
  });

  it("waits out the buffering update that reports no duration yet", async () => {
    const spotify = fakeApi();
    window.SpotifyIframeApi = stub;

    render(
      <SongPlayer
        embedUrl={EMBED}
        startAt={158}
        name="Nobody With A Video"
        title="song"
      />,
    );
    await waitFor(() => expect(spotify.listening).toBe(true));

    spotify.update({
      isPaused: false,
      isBuffering: true,
      position: 0,
      duration: 0,
    });
    expect(spotify.seeks).toEqual([]);

    spotify.update(PLAYING_FROM_TOP);
    expect(spotify.seeks).toEqual([158]);
  });

  it("does nothing while the player sits paused", async () => {
    const spotify = fakeApi();
    window.SpotifyIframeApi = stub;

    render(
      <SongPlayer
        embedUrl={EMBED}
        startAt={158}
        name="Nobody With A Video"
        title="song"
      />,
    );
    await waitFor(() => expect(spotify.listening).toBe(true));

    spotify.update({ isPaused: true, position: 0, duration: 198000 });
    expect(spotify.seeks).toEqual([]);
  });

  it("tears the controller down with the page", async () => {
    const spotify = fakeApi();
    window.SpotifyIframeApi = stub;

    const { unmount } = render(
      <SongPlayer
        embedUrl={EMBED}
        startAt={158}
        name="Nobody With A Video"
        title="song"
      />,
    );
    await waitFor(() => expect(spotify.listening).toBe(true));

    unmount();
    expect(spotify.controller.destroy).toHaveBeenCalled();
  });
});
