import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import "./Navbar.css";

export function useMobile() {
  // Lazy init so the first render already knows the real viewport — pages
  // pick video sources off this flag and must not fetch the wrong one first.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 768,
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { isMobile, setIsMobile };
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useMobile();
  const { reducedMotion } = useMotionPrefs();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const mobileOverlay = (
    <AnimatePresence>
      {isMobile && isMobileMenuOpen && (
        <motion.div
          className="menu-takeover"
          data-lenis-prevent
          initial={reducedMotion ? { opacity: 0 } : { y: "100%" }}
          animate={reducedMotion ? { opacity: 1 } : { y: "0%" }}
          exit={reducedMotion ? { opacity: 0 } : { y: "100%" }}
          transition={{
            duration: reducedMotion ? 0.15 : 0.55,
            ease: [0.83, 0, 0.17, 1],
          }}
        >
          <NavLinks isMobile={true} closeMobileMenu={closeMobileMenu} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <nav className="navbar" aria-label="Primary">
        {!isMobile && <NavLinks isMobile={false} />}
        {isMobile && (
          <motion.button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={26} strokeWidth={1.75} color="#f4f1ea" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={26} strokeWidth={1.75} color="#f4f1ea" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </nav>
      {ReactDOM.createPortal(mobileOverlay, document.body)}
    </>
  );
}
