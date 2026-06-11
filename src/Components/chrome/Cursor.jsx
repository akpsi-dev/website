import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionPrefs } from "../../utils/useMotionPrefs";
import "./Cursor.css";

/**
 * Desktop-only companion cursor: a small bone dot with spring follow that
 * grows into a labeled chip over elements tagged data-cursor="PLAY" etc.
 * The native cursor stays visible; this is an annotation, not a replacement.
 */
export default function Cursor() {
  const { reducedMotion, finePointer } = useMotionPrefs();
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 35 });
  const springY = useSpring(y, { stiffness: 400, damping: 35 });

  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return undefined;

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e) => {
      const target = e.target.closest?.("[data-cursor]");
      if (target) {
        setLabel(target.getAttribute("data-cursor"));
        setActive(true);
      } else {
        setActive(false);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className={`cursor ${active ? "cursor--active" : ""}`}
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    >
      <span className="cursor__label mono-label">{active ? label : ""}</span>
    </motion.div>
  );
}
