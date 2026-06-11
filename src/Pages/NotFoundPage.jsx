import React, { useMemo } from "react";
import { motion } from "framer-motion";
import "./NotFoundPage.css";
import { knightAKYLogo } from "../Assets";
import { headshotHash } from "../Assets/headshot";
import Seo from "../Components/Seo";
import { CurtainLink } from "../Components/chrome/Curtain";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import { closestNames } from "../utils/fuzzy";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

export default function NotFoundPage({
  brotherSearch = false,
  attemptedName = "",
  rosterNames = [],
}) {
  const { reducedMotion } = useMotionPrefs();

  const suggestions = useMemo(() => {
    if (!brotherSearch || !attemptedName || rosterNames.length === 0) return [];
    return closestNames(attemptedName, rosterNames, 3);
  }, [brotherSearch, attemptedName, rosterNames]);

  return (
    <div className="not-found">
      <Seo title="404" />

      <div className="not-found__numeral" aria-label="404">
        <span aria-hidden="true">4</span>
        <span
          className={`not-found__coin ${reducedMotion ? "not-found__coin--still" : ""}`}
          aria-hidden="true"
        >
          <img src={knightAKYLogo} alt="" />
        </span>
        <span aria-hidden="true">4</span>
      </div>

      <p className="mono-label not-found__notice">
        {brotherSearch
          ? "CORRECTION — NO BROTHER BY THAT NAME APPEARS IN OUR RECORDS."
          : "CORRECTION — THE PAGE YOU REQUESTED DOES NOT APPEAR IN OUR RECORDS."}
      </p>

      {suggestions.length > 0 && (
        <div className="not-found__suggest">
          <span className="mono-label not-found__suggest-label">
            DID YOU MEAN
          </span>
          <div className="not-found__cards">
            {suggestions.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 26, rotate: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: reducedMotion ? 0 : (i - 1) * 4,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + i * 0.08,
                  ease: EASE_OUT_EXPO,
                }}
                whileHover={{ rotate: 0, y: -6 }}
                className="not-found__card-wrap"
              >
                <CurtainLink
                  to={`/${encodeURIComponent(name.trim().replace(/\s+/g, "-"))}`}
                  className="not-found__card"
                >
                  <img
                    src={headshotHash[name] ?? headshotHash["Default Headshot"]}
                    alt={name}
                    loading="lazy"
                  />
                  <span className="not-found__card-name">{name}</span>
                </CurtainLink>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <CurtainLink to="/" className="hairline-button not-found__home">
        Return to the index
      </CurtainLink>
    </div>
  );
}
