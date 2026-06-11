import React from "react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { useMotionPrefs } from "../../utils/useMotionPrefs";
import "./Footer.css";

/**
 * Shared site footer. Copy is carried over from the existing Home footer.
 */
export default function Footer() {
  const { userToggled, setUserToggle } = useMotionPrefs();

  return (
    <footer className="site-footer hairline-top">
      <div className="site-footer__row">
        <div className="site-footer__social">
          <a
            href="https://www.instagram.com/akpsiuci"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="site-footer__icon"
          >
            <Instagram size={18} strokeWidth={1.75} />
          </a>
          <a
            href="https://facebook.com/akpsiuci"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="site-footer__icon"
          >
            <Facebook size={18} strokeWidth={1.75} />
          </a>
          <a
            href="https://www.linkedin.com/company/alpha-kappa-psi-uci"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="site-footer__icon"
          >
            <Linkedin size={18} strokeWidth={1.75} />
          </a>
        </div>
        <a
          href="mailto:akpsi.uci.rush@gmail.com"
          className="site-footer__mail mono-label"
        >
          akpsi.uci.rush@gmail.com
        </a>
      </div>
      <div className="site-footer__row site-footer__row--bottom">
        <p className="site-footer__statement">
          Our members strive to uphold the highest standards in everything they
          do.
        </p>
        <button
          type="button"
          className="site-footer__motion mono-label"
          onClick={() => setUserToggle(!userToggled)}
          aria-pressed={userToggled}
        >
          Motion: {userToggled ? "Reduced" : "On"}
        </button>
      </div>
      <div className="site-footer__row site-footer__row--legal">
        <span className="mono-label">ALPHA KAPPA PSI — PI PSI — UC IRVINE</span>
        <span className="mono-label site-footer__credit">
          Site designed and developed in-house
        </span>
      </div>
    </footer>
  );
}
