import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useMotionPrefs } from "../../utils/useMotionPrefs";
import "./Curtain.css";

/**
 * The ink curtain: one overlay that serves as the route transition and the
 * lazy-chunk loading mask. Navigation through navigateWithCurtain() covers
 * the screen with ink (carrying the destination folio), swaps the route
 * while hidden, then lifts.
 */

const FOLIOS = {
  "/": "01 — HOME",
  "/about": "02 — ABOUT",
  "/meet-us": "03 — MEET US",
  "/brotherhood": "04 — BROTHERHOOD",
  "/careers": "05 — CAREERS",
  "/rush": "06 — RUSH",
};

function folioFor(path) {
  return FOLIOS[path] ?? "PI PSI — UC IRVINE";
}

const CurtainContext = createContext({ navigateWithCurtain: () => {} });

export function useCurtain() {
  return useContext(CurtainContext);
}

const EASE_IN_OUT = [0.83, 0, 0.17, 1];

export function CurtainProvider({ children }) {
  const [phase, setPhase] = useState("idle"); // idle | covering | lifting
  const [folio, setFolio] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { reducedMotion } = useMotionPrefs();
  const pendingPath = useRef(null);

  const navigateWithCurtain = useCallback(
    (to) => {
      if (to === location.pathname) return;
      if (phase === "covering") {
        // Mid-cover re-click: retarget the pending navigation instead of
        // racing it with a direct push.
        pendingPath.current = to;
        setFolio(folioFor(to));
        return;
      }
      if (reducedMotion || phase !== "idle") {
        navigate(to);
        return;
      }
      pendingPath.current = to;
      setFolio(folioFor(to));
      setPhase("covering");
    },
    [navigate, location.pathname, reducedMotion, phase],
  );

  const handlePhaseComplete = useCallback(() => {
    if (phase === "covering") {
      if (pendingPath.current && pendingPath.current !== location.pathname) {
        navigate(pendingPath.current);
      }
      pendingPath.current = null;
      // Hold one frame while the new route mounts beneath the ink.
      requestAnimationFrame(() => setPhase("lifting"));
    } else if (phase === "lifting") {
      setPhase("idle");
    }
  }, [phase, navigate, location.pathname]);

  // Scroll to top whenever the route changes (covered or not).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const value = useMemo(() => ({ navigateWithCurtain }), [navigateWithCurtain]);

  return (
    <CurtainContext.Provider value={value}>
      {children}
      {phase !== "idle" && (
        <motion.div
          className="curtain"
          initial={{ y: "100%" }}
          animate={{ y: phase === "covering" ? "0%" : "-101%" }}
          transition={{
            duration: phase === "covering" ? 0.35 : 0.55,
            ease: EASE_IN_OUT,
          }}
          onAnimationComplete={handlePhaseComplete}
        >
          <span className="curtain__folio mono-label">{folio}</span>
          <span className="curtain__rule" aria-hidden="true" />
        </motion.div>
      )}
    </CurtainContext.Provider>
  );
}

/**
 * Suspense fallback that fully covers the viewport while a route chunk
 * loads — the curtain IS the loading state, so code splitting is invisible.
 */
export function ChunkCover() {
  return (
    <div className="curtain curtain--static" aria-hidden="true">
      <span className="curtain__rule" />
    </div>
  );
}

/**
 * Anchor that routes through the curtain. Renders a real <a> for
 * accessibility; modified clicks (new tab etc.) behave natively.
 */
export function CurtainLink({ to, children, className, onClick, ...rest }) {
  const { navigateWithCurtain } = useCurtain();
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
      return;
    e.preventDefault();
    onClick?.(e);
    navigateWithCurtain(to);
  };
  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
