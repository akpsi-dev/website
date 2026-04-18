import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import "./NavLinks.css";
import { staggerContainer, EASE_OUT_EXPO } from "../utils/motion";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/meet-us", label: "Meet Us" },
  { to: "/brotherhood", label: "Brotherhood" },
  { to: "/careers", label: "Careers" },
  { to: "/rush", label: "Rush", rush: true },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

export default function NavLinks({ isMobile, closeMobileMenu }) {
  if (!isMobile) {
    return (
      <ul className="nav-links">
        {LINKS.map(({ to, label, end, rush }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `NavLink${isActive ? " active" : ""}${rush ? " rush" : ""}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mobile-nav-content">
      <motion.ul
        className="nav-links mobile"
        variants={staggerContainer(0.07, 0.05)}
        initial="hidden"
        animate="visible"
      >
        {LINKS.map(({ to, label, end, rush }) => (
          <motion.li key={to} variants={itemVariants}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `NavLink mobile${isActive ? " active" : ""}${rush ? " rush" : ""}`
              }
              onClick={closeMobileMenu}
            >
              {label}
            </NavLink>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        className="mobile-socials"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <a
          href="https://www.instagram.com/akpsi.uci/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="social-icon"
        >
          <Instagram size={22} />
        </a>
        <a
          href="https://www.linkedin.com/company/akpsi-uci/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="social-icon"
        >
          <Linkedin size={22} />
        </a>
      </motion.div>
    </div>
  );
}
