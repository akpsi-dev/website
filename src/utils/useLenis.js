import { useEffect } from "react";
import { useMotionPrefs } from "./useMotionPrefs";

/**
 * Smooth scrolling on desktop fine-pointer devices only — touch keeps
 * native momentum. Lenis is imported lazily so mobile never pays for it.
 */
export default function useLenis() {
  const { reducedMotion, finePointer } = useMotionPrefs();

  useEffect(() => {
    if (!finePointer || reducedMotion) return undefined;
    if (typeof ResizeObserver === "undefined") return undefined;

    let lenis;
    let raf;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.1 });
      const loop = (time) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [finePointer, reducedMotion]);
}
