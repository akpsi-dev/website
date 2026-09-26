import React from "react";
import { motion } from "framer-motion";
import { HomeHeroPoster } from "../Assets";
import { videoUrl } from "../utils/videoCdn";

/* Re-exported so callers already importing it from here keep working
   (Countdown.test.js pins it, and /rush counts down to it). */
export { RUSH_START } from "../utils/rushDate";

/** The video the 'video' variant plays. Not bundled — served from CloudFront.
 *
 *  HOME_HERO is the new distribution's video and wins as soon as it is set in
 *  videoCdn.js; until then this falls back to the rush video, so the 'video'
 *  variant is never left sourceless. Both resolve to undefined when unset, and
 *  a <video> with no src is handled — see videoUrl. */
const HERO_VIDEO_URL = videoUrl("HOME_HERO") ?? videoUrl("RUSH");

/**
 * The Home hero, in two interchangeable states.
 *
 *   'video'   — now. The rush video behind the title.
 *   'default' — after. Title alone, no video request, no timer.
 *
 * Both are built and styled, so moving between them on the day is a one-value
 * edit to HERO_VARIANT in Home.jsx, not a code change made under time
 * pressure.
 *
 * A third state, 'teaser', backed the title with a tartan graphic while rush
 * was unannounced. It came out with the artwork once the video landed; it was
 * a backdrop and a label, and git has both if a future cycle wants them.
 *
 * videoRef is only attached by the 'video' variant. Home's loader waits on the
 * video's canplay/error to reveal the page and falls through immediately when
 * the ref is empty, so the other two variants reveal without waiting.
 */
export default function HomeHero({
  variant = "video",
  videoRef,
  onTitleClick,
}) {
  const isVideo = variant === "video";

  return (
    <>
      {isVideo && (
        <div className="background-video">
          {/* The poster is the video's own first frame, so there is no jump
              when playback starts — it just stops being a still. Without it
              the hero is flat black until enough of a 9MB file has arrived. */}
          <video
            ref={videoRef}
            src={HERO_VIDEO_URL}
            poster={HomeHeroPoster}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <motion.div className={`hero-section hero-section--${variant}`}>
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            onClick={onTitleClick}
            style={{ cursor: onTitleClick ? "pointer" : "default" }}
          >
            ΑΚΨ - UCI
          </motion.h1>

          {/* The countdown lives on /rush, not here: the clock is one page's
              job, not two. */}
        </div>
      </motion.div>
    </>
  );
}
