import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionPrefs } from "../../utils/useMotionPrefs";
import "./Preloader.css";

const SESSION_KEY = "akpsi-preloaded";
const HARD_CAP_MS = 2200;
const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_IN_OUT = [0.83, 0, 0.17, 1];

function alreadyPlayed() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * First-visit preloader: the monogram clip-wipes in like drying ink while a
 * mono counter tracks real readiness (fonts), hard-capped at 2.2s. Plays
 * once per session; repeat navigations go straight to the page.
 */
export default function Preloader() {
  const { reducedMotion } = useMotionPrefs();
  const [visible, setVisible] = useState(() => !alreadyPlayed());
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef(null);

  useEffect(() => {
    if (!visible) return undefined;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // best-effort
    }

    startRef.current = performance.now();
    let fontsReady = false;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    let raf;
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const timeShare = Math.min(elapsed / HARD_CAP_MS, 1);
      // Progress rides the clock but completes early once fonts resolve.
      const target = fontsReady ? Math.max(timeShare, 0.99) : timeShare * 0.92;
      setProgress((p) => Math.max(p, target));
      if (timeShare >= 1 || (fontsReady && elapsed > 600)) {
        setProgress(1);
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  // Hold the "EST. 1904" beat, then lift.
  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setVisible(false), reducedMotion ? 50 : 450);
    return () => clearTimeout(t);
  }, [done, reducedMotion]);

  if (!visible && !done) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          initial={false}
          exit={reducedMotion ? { opacity: 0 } : { y: "-101%" }}
          transition={{
            duration: reducedMotion ? 0.2 : 0.65,
            ease: EASE_IN_OUT,
          }}
          aria-hidden="true"
        >
          <span className="preloader__corner mono-label">
            ALPHA KAPPA PSI — PI PSI
          </span>
          <motion.span
            className="preloader__monogram"
            initial={
              reducedMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }
            }
            animate={
              reducedMotion ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }
            }
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            ΑΚΨ
          </motion.span>
          <span className="preloader__counter mono-label">
            {done ? "EST. 1904" : `${Math.round(progress * 100)}%`}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
