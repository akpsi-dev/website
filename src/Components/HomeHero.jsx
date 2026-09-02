import React from "react";
import { motion } from "framer-motion";
import { TeaserHero } from "../Assets";
import "./HomeHero.css";

/* Re-exported so callers already importing it from here keep working
   (Countdown.test.js pins it, and /rush counts down to it). */
export { RUSH_START } from "../utils/rushDate";

/** The video the 'video' variant plays. Not bundled — served from CloudFront. */
const RUSH_VIDEO_URL =
  "https://d395js6c4h8h6h.cloudfront.net/Videos/SpringRushVideo2026.mp4";

/**
 * The Home hero, in three interchangeable states.
 *
 *   'teaser'  — now. Tartan backdrop, title, countdown to RUSH_START.
 *   'video'   — rush week. The CloudFront rush video behind the title.
 *   'default' — after. Title alone, no video request, no timer.
 *
 * All three are built and styled, so moving between them on the day is a
 * one-value edit to HERO_VARIANT in Home.jsx, not a code change made under
 * time pressure.
 *
 * videoRef is only attached by the 'video' variant. Home's loader waits on the
 * video's canplay/error to reveal the page and falls through immediately when
 * the ref is empty, so the other two variants reveal without waiting.
 */
export default function HomeHero({
  variant = "teaser",
  videoRef,
  onTitleClick,
}) {
  const isVideo = variant === "video";
  const isTeaser = variant === "teaser";

  return (
    <>
      {isVideo && (
        <div className="background-video">
          <video
            ref={videoRef}
            src={RUSH_VIDEO_URL}
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

      <motion.div
        className={`hero-section hero-section--${variant}`}
        style={isTeaser ? { backgroundImage: `url(${TeaserHero})` } : undefined}
      >
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            onClick={onTitleClick}
            style={{ cursor: onTitleClick ? "pointer" : "default" }}
          >
            ΑΚΨ - UCI
          </motion.h1>

          {/* The countdown lives on /rush only for now. The teaser hero keeps
              the tartan and the title; the clock is one page's job, not two.
              Restore by putting <Countdown target={RUSH_START} /> back here —
              both imports are still in place for exactly that. */}
          {isTeaser && (
            <div className="hero-teaser__countdown">
              <p className="hero-teaser__label">FALL RUSH 2026</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
