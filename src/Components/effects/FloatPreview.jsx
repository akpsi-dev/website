import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionPrefs } from "../../utils/useMotionPrefs";
import "./FloatPreview.css";

const SIZE = { width: 280, height: 350 };

function webglCapable() {
  if (typeof navigator !== "undefined" && navigator.deviceMemory < 4)
    return false;
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Cursor-following headshot preview for the roster INDEX view. On capable
 * desktops the image renders through a WebGL displacement shader that warps
 * with pointer velocity; otherwise it falls back to a plain floating image.
 */
export default function FloatPreview({ src, visible }) {
  const { reducedMotion, finePointer } = useMotionPrefs();
  const containerRef = useRef(null);
  const canvasApi = useRef(null);
  const [useGl, setUseGl] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28 });
  const springY = useSpring(y, { stiffness: 260, damping: 28 });

  const enabled = finePointer && !reducedMotion;

  // Pointer follow + velocity kicks into the shader.
  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      x.set(e.clientX + 28);
      y.set(e.clientY - SIZE.height / 2);
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      canvasApi.current?.kick(Math.min(Math.hypot(dx, dy) / 40, 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  // Lazy-create the WebGL canvas on first show.
  useEffect(() => {
    if (!enabled || !visible || canvasApi.current || !webglCapable())
      return undefined;
    let cancelled = false;
    import("./floatCanvas").then(({ createFloatCanvas }) => {
      if (cancelled || !containerRef.current || canvasApi.current) return;
      try {
        canvasApi.current = createFloatCanvas(containerRef.current, SIZE);
        // Creation only happens while visible — start rendering immediately
        // rather than waiting for the next visibility change.
        canvasApi.current.play();
        setUseGl(true);
      } catch {
        setUseGl(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [enabled, visible]);

  useEffect(
    () => () => {
      canvasApi.current?.destroy();
      canvasApi.current = null;
    },
    [],
  );

  useEffect(() => {
    if (!canvasApi.current) return;
    if (visible) {
      canvasApi.current.play();
    } else {
      canvasApi.current.pause();
    }
  }, [visible, useGl]);

  useEffect(() => {
    if (src && canvasApi.current) canvasApi.current.setImage(src);
  }, [src, useGl]);

  if (!enabled) return null;

  return (
    <motion.div
      className="float-preview"
      style={{ x: springX, y: springY, width: SIZE.width, height: SIZE.height }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <div ref={containerRef} className="float-preview__gl" />
      {!useGl && src && <img className="float-preview__img" src={src} alt="" />}
    </motion.div>
  );
}
