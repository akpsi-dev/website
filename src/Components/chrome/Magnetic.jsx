import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionPrefs } from "../../utils/useMotionPrefs";

/**
 * Wraps an interactive element with a subtle magnetic pull toward the
 * pointer. Desktop fine-pointer only; renders children untouched otherwise.
 */
export default function Magnetic({ children, strength = 0.3, className }) {
  const ref = useRef(null);
  const { reducedMotion, finePointer } = useMotionPrefs();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  const enabled = finePointer && !reducedMotion;

  const onMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      style={
        enabled
          ? { x: springX, y: springY, display: "inline-block" }
          : undefined
      }
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  );
}
