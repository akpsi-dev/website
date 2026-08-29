import React, { useState, useEffect } from "react";
import "./Careers.css";
import { motion } from "framer-motion";
import { alumni1 } from "../Assets";
import CareerTable from "./CareerTable";
import CareerLogoScroller from "./CareerLogoScroll";

export default function Careers() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = alumni1;
    img.onload = () => {
      setIsLoading(false);
    };
    // If the image fails to load, we still want to show the content
    img.onerror = () => {
      setIsLoading(false);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="careersContainer">
      {/* The photo belongs to the hero only. It used to sit on the page
          container, so it stayed fixed behind the whole route — including
          behind the ledger — and read as a full-page wallpaper. */}
      <motion.div
        className="careerstitleSection"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${alumni1})`,
        }}
      >
        <div className="hero-title" style={{ top: "-150px" }}>
          Careers
        </div>
      </motion.div>

      <div className="careersmainTitleSection">
        <h1 className="careersmainTitle">Our Professional Experience</h1>
      </div>
      <div className="careers-section">
        <CareerLogoScroller />
        <CareerTable />
      </div>
    </div>
  );
}
