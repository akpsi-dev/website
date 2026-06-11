import React from "react";
import "./Careers.css";
import { alumni1 } from "../Assets";
import Seo from "../Components/Seo";
import Footer from "../Components/chrome/Footer";
import SplitLines from "../Components/chrome/SplitLines";
import CareerTable from "./CareerTable";
import CareerLogoScroller from "./CareerLogoScroll";

export default function Careers() {
  return (
    <div className="careers">
      <Seo title="Careers" />

      <section className="careers-hero">
        <div
          className="careers-hero__bg"
          style={{ backgroundImage: `url(${alumni1})` }}
          aria-hidden="true"
        />
        <div className="careers-hero__grade" aria-hidden="true" />
        <div className="careers-hero__content">
          <span className="mono-label careers-hero__eyebrow">
            PI PSI — UC IRVINE
          </span>
          <SplitLines as="h1" className="careers-hero__title" stagger={0.06}>
            Careers
          </SplitLines>
        </div>
      </section>

      <section className="careers-logos">
        <div className="careers-logos__heading hairline-bottom">
          <span className="mono-label">WHERE OUR BROTHERS WORK</span>
        </div>
        <CareerLogoScroller />
      </section>

      <section className="careers-ledger">
        <header className="careers-ledger__heading">
          <span className="mono-label careers-ledger__eyebrow">THE LEDGER</span>
          <h2 className="careers-ledger__title">Our Professional Experience</h2>
        </header>
        <CareerTable />
      </section>

      <Footer />
    </div>
  );
}
