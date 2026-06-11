import React, { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import { CurtainLink } from "./Components/chrome/Curtain";
import "./Main.css";

export default function Main() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="main-header" data-scrolled={scrolled}>
      <CurtainLink to="/" className="wordmark" aria-label="Home">
        <span className="wordmark__letters">ΑΚΨ</span>
        <span className="wordmark__chapter mono-label">PI PSI</span>
      </CurtainLink>
      <Navbar />
    </header>
  );
}
