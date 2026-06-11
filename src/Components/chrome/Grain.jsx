import React from "react";
import "./Grain.css";
import { useMotionPrefs } from "../../utils/useMotionPrefs";

/**
 * Sitewide film-grain overlay. Pure CSS (inline SVG turbulence from tokens),
 * pointer-transparent, and removed entirely for reduced-motion / low-end
 * devices where an extra composited layer is not worth it.
 */
export default function Grain() {
  const { reducedMotion } = useMotionPrefs();
  if (reducedMotion) return null;
  return <div className="grain-overlay" aria-hidden="true" />;
}
