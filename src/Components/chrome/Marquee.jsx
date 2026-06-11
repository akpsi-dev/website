import React from "react";
import { useMotionPrefs } from "../../utils/useMotionPrefs";
import "./Marquee.css";

/**
 * Infinite mono ticker strip. Pure CSS transform animation (GPU-friendly),
 * paused under reduced motion. Items are duplicated to create the loop.
 */
export default function Marquee({ items, speed = 40, className = "" }) {
  const { reducedMotion } = useMotionPrefs();
  const row = (key) => (
    <div className="marquee__row" aria-hidden={key > 0} key={key}>
      {items.map((item, i) => (
        <span className="marquee__item mono-label" key={i}>
          {item}
          <span className="marquee__diamond" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee ${reducedMotion ? "marquee--paused" : ""} ${className}`}
      style={{ "--marquee-duration": `${speed}s` }}
    >
      <div className="marquee__track">{[0, 1].map(row)}</div>
    </div>
  );
}
