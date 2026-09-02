import React, { useEffect, useMemo, useState } from "react";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import "./Countdown.css";

/**
 * Splits the gap between now and target into whole units.
 * Clamps at zero: the countdown must never render a negative value, so a
 * target in the past reads as all zeros with `expired` set, not as -1 days.
 */
export function countdownParts(target, now) {
  const remaining = Math.max(0, target.getTime() - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: remaining === 0,
  };
}

function srSummary(parts, label) {
  if (parts.expired) return label;
  const bits = [
    [parts.days, "day"],
    [parts.hours, "hour"],
    [parts.minutes, "minute"],
  ]
    .filter(([v]) => v > 0)
    .map(([v, unit]) => `${v} ${unit}${v === 1 ? "" : "s"}`);
  return bits.length
    ? `${bits.join(", ")} remaining`
    : "Less than a minute remaining";
}

/**
 * Standalone so both the Home teaser hero and the Rush page can mount it.
 *
 * Under reduced motion it ticks once a minute rather than once a second, and
 * drops the seconds cell entirely — a seconds readout refreshed every 60s is
 * wrong for 59 of those seconds, which is worse than not showing it.
 */
export default function Countdown({
  target,
  expiredLabel = "RUSH IS HERE",
  className = "",
}) {
  const { reducedMotion } = useMotionPrefs();
  const intervalMs = reducedMotion ? 60000 : 1000;

  const [now, setNow] = useState(() => Date.now());
  const parts = useMemo(() => countdownParts(target, now), [target, now]);
  const { expired } = parts;

  useEffect(() => {
    // Stop scheduling once the target passes — nothing below can change again.
    if (expired) return undefined;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, expired]);

  if (expired) {
    return (
      <p className={`countdown countdown--expired ${className}`.trim()}>
        {expiredLabel}
      </p>
    );
  }

  const cells = [
    [parts.days, "D", "countdown__value--days"],
    [parts.hours, "H", ""],
    [parts.minutes, "M", ""],
  ];
  if (!reducedMotion) cells.push([parts.seconds, "S", ""]);

  return (
    <div
      className={`countdown ${className}`.trim()}
      role="timer"
      /* The cells are hidden from assistive tech and replaced by one coherent
         label. Announcing four separate numbers every second would be noise,
         so this is deliberately not a live region. */
      aria-label={srSummary(parts, expiredLabel)}
    >
      {cells.map(([value, unit, valueClass]) => (
        <span className="countdown__cell" key={unit} aria-hidden="true">
          <span className={`countdown__value ${valueClass}`.trim()}>
            {/* One span per digit, each in an identical fixed-width slot.
                Neither font on this site has tabular figures — Playfair's
                digits run 16.9px to 28.4px and Anton's "1" is a third narrower
                than the rest — so font-variant-numeric cannot help. Giving each
                digit its own slot makes the alignment a property of the layout
                instead of the typeface, which is what lets the numbers be set
                in Playfair rather than something plainer. */}
            {String(value)
              .padStart(2, "0")
              .split("")
              .map((digit, i) => (
                <span className="countdown__digit" key={i}>
                  {digit}
                </span>
              ))}
          </span>
          <span className="countdown__unit">{unit}</span>
        </span>
      ))}
    </div>
  );
}
