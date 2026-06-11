import React, { useEffect, useRef, useState } from "react";
import SplitType from "split-type";
import { useMotionPrefs } from "../../utils/useMotionPrefs";
import "./SplitLines.css";

/**
 * The signature line-mask rise: splits a headline into lines, wraps each in
 * an overflow-hidden mask, and slides them up into view when the element
 * enters the viewport. Splitting waits for fonts (wrong metrics otherwise)
 * and re-splits on resize. Reduced motion gets a simple fade.
 */
export default function SplitLines({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.07,
  duration = 0.9,
  once = true,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const { reducedMotion } = useMotionPrefs();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    let split;
    let observer;
    let resizeTimer;
    let cancelled = false;

    const arm = () => {
      if (cancelled || !el.isConnected) return;
      split = new SplitType(el, { types: "lines", lineClass: "split-line" });
      el.querySelectorAll(".split-line").forEach((line, i) => {
        const mask = document.createElement("span");
        mask.className = "split-mask";
        line.parentNode.insertBefore(mask, line);
        mask.appendChild(line);
        line.style.transitionDelay = `${delay + i * stagger}s`;
        line.style.transitionDuration = `${duration}s`;
      });
      setReady(true);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add("split-visible");
              if (once) observer.disconnect();
            } else if (!once) {
              el.classList.remove("split-visible");
            }
          });
        },
        { threshold: 0.25 },
      );
      observer.observe(el);
    };

    const disarm = () => {
      observer?.disconnect();
      split?.revert();
      el.classList.remove("split-visible");
    };

    document.fonts?.ready.then(() => {
      if (!cancelled) arm();
    });

    // iOS Safari fires resize on URL-bar collapse during normal scrolling;
    // line breaks only change with width, so ignore height-only resizes.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        disarm();
        arm();
        // Already on screen after a resize? Show immediately.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("split-visible");
        }
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      disarm();
    };
  }, [reducedMotion, delay, stagger, duration, once]);

  return (
    <Tag
      ref={ref}
      className={`split-lines ${reducedMotion ? "split-reduced" : ""} ${ready ? "split-ready" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
