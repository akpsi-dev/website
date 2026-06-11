import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import { CurtainLink } from "./chrome/Curtain";
import Magnetic from "./chrome/Magnetic";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import "./NavLinks.css";

export const LINKS = [
  { to: "/", label: "Home", index: "01" },
  { to: "/about", label: "About", index: "02" },
  { to: "/meet-us", label: "Meet Us", index: "03" },
  { to: "/brotherhood", label: "Brotherhood", index: "04" },
  { to: "/careers", label: "Careers", index: "05" },
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

export default function NavLinks({ isMobile, closeMobileMenu }) {
  const location = useLocation();
  const { reducedMotion } = useMotionPrefs();
  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  if (!isMobile) {
    return (
      <ul className="nav-links">
        {LINKS.map(({ to, label, index }) => (
          <li key={to}>
            <Magnetic strength={0.2}>
              <CurtainLink
                to={to}
                className={`nav-link${isActive(to) ? " active" : ""}`}
                aria-current={isActive(to) ? "page" : undefined}
              >
                <sup className="nav-link__index">{index}</sup>
                {label}
              </CurtainLink>
            </Magnetic>
          </li>
        ))}
        <li>
          <Magnetic strength={0.2}>
            <CurtainLink
              to="/rush"
              className={`nav-rush-chip${isActive("/rush") ? " active" : ""}`}
              aria-current={isActive("/rush") ? "page" : undefined}
            >
              Rush
            </CurtainLink>
          </Magnetic>
        </li>
      </ul>
    );
  }

  const menuLinks = [
    ...LINKS,
    { to: "/rush", label: "Rush", index: "06", rush: true },
  ];

  return (
    <div className="menu-takeover__content">
      <ul className="menu-takeover__list">
        {menuLinks.map(({ to, label, index, rush }, i) => (
          <li key={to} className="menu-takeover__item">
            <span className="menu-takeover__mask">
              <motion.span
                className="menu-takeover__line"
                initial={reducedMotion ? { opacity: 0 } : { y: "115%" }}
                animate={reducedMotion ? { opacity: 1 } : { y: "0%" }}
                exit={
                  reducedMotion
                    ? { opacity: 0, transition: { duration: 0.1 } }
                    : { y: "115%", transition: { duration: 0.25 } }
                }
                transition={{
                  duration: reducedMotion ? 0.15 : 0.6,
                  delay: reducedMotion ? 0 : 0.12 + i * 0.07,
                  ease: EASE_OUT_EXPO,
                }}
              >
                <CurtainLink
                  to={to}
                  className={`menu-link${isActive(to) ? " active" : ""}${rush ? " rush" : ""}`}
                  onClick={closeMobileMenu}
                  aria-current={isActive(to) ? "page" : undefined}
                >
                  <span className="menu-link__index mono-label">{index}</span>
                  {label}
                </CurtainLink>
              </motion.span>
            </span>
          </li>
        ))}
      </ul>

      <motion.div
        className="menu-takeover__footer"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={{ delay: 0.55, duration: 0.45, ease: EASE_OUT_EXPO }}
      >
        <div className="menu-takeover__socials">
          <a
            href="https://www.instagram.com/akpsi.uci/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="menu-social"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.linkedin.com/company/akpsi-uci/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="menu-social"
          >
            <Linkedin size={20} />
          </a>
        </div>
        <span className="mono-label">PI PSI — UC IRVINE</span>
      </motion.div>
    </div>
  );
}
