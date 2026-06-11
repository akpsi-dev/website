import React, { useRef } from "react";
import "./About.css";
import { motion, useScroll, useTransform } from "framer-motion";
import FAQ from "../Components/FAQ";
import {
  CoreValueB,
  CoreValueI,
  CoreValueK,
  CoreValueS,
  CoreValueU,
  WinterRetreatFraternity,
} from "../Assets";
import Seo from "../Components/Seo";
import Pic from "../Components/Pic";
import Footer from "../Components/chrome/Footer";
import SplitLines from "../Components/chrome/SplitLines";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const TIMELINE = [
  {
    year: "1904",
    title: "AKΨ Founded",
    description:
      "Alpha Kappa Psi is founded at New York University — the first professional business fraternity in the country.",
  },
  {
    year: "1999",
    title: "UCI Chapter Established",
    description:
      "The Pi Psi chapter at UC Irvine is chartered, bringing AKΨ's mission of professional development to Anteaters.",
  },
  {
    year: "2010",
    title: "500+ Alumni",
    description:
      "The chapter reaches a milestone of over 500 initiated brothers, building a growing network across industries nationwide.",
  },
  {
    year: "2018",
    title: "Top Chapter Recognition",
    description:
      "Pi Psi earns national recognition for chapter excellence, professional programming, and community philanthropy.",
  },
  {
    year: "2022",
    title: "Record Placements",
    description:
      "100% of graduating members secure internships or full-time roles at top-tier companies before commencement.",
  },
  {
    year: "2026",
    title: "Looking Ahead",
    description:
      "With over 700 lifetime alumni and a vibrant active chapter, Pi Psi continues to grow its legacy at UCI and beyond.",
  },
];

const majorData = [
  { name: "Business", value: 34 },
  { name: "Engineering", value: 19 },
  { name: "CompSci", value: 13 },
  { name: "Other", value: 8 },
  { name: "Arts", value: 17 },
  { name: "Health Sciences", value: 9 },
];

const clubData = [
  { name: "Professional", value: 37 },
  { name: "Social", value: 18 },
  { name: "Academic", value: 27 },
  { name: "Cultural", value: 10 },
  { name: "Other", value: 8 },
];

const placementData = [
  { year: "2021", oncampus: 63, beyondCampus: 68 },
  { year: "2022", oncampus: 70, beyondCampus: 74 },
  { year: "2023", oncampus: 72, beyondCampus: 81 },
  { year: "2024", oncampus: 77, beyondCampus: 85 },
  { year: "2025", oncampus: 77, beyondCampus: 83 },
  { year: "2026", oncampus: 88, beyondCampus: 92 },
];

const CHART_COLORS = [
  "#c8a24b",
  "#4e7fff",
  "#e3c77e",
  "#7fa0ff",
  "#a8a29a",
  "#6b665e",
];

const CORE_VALUES = [
  {
    letter: "B",
    title: "Brotherhood",
    image: CoreValueB,
    copy: "Foster lifelong connections",
  },
  {
    letter: "I",
    title: "Integrity",
    image: CoreValueI,
    copy: "Uphold ethical standards",
  },
  {
    letter: "K",
    title: "Knowledge",
    image: CoreValueK,
    copy: "Pursue continuous learning",
  },
  {
    letter: "S",
    title: "Service",
    image: CoreValueS,
    copy: "Give back to the community",
  },
  {
    letter: "U",
    title: "Unity",
    image: CoreValueU,
    copy: "Strengthen through collaboration",
  },
];

function Donut({ title, data }) {
  return (
    <motion.figure
      className="about-chart"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
    >
      <figcaption className="mono-label about-chart__title">{title}</figcaption>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="68%"
            outerRadius="96%"
            paddingAngle={2}
            stroke="none"
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ul className="about-chart__legend">
        {data.map((entry, i) => (
          <li key={entry.name}>
            <span
              className="about-chart__swatch"
              style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
            />
            <span className="about-chart__legend-name">{entry.name}</span>
            <span className="about-chart__legend-value">{entry.value}%</span>
          </li>
        ))}
      </ul>
    </motion.figure>
  );
}

export default function About() {
  const timelineRef = useRef(null);
  const { reducedMotion } = useMotionPrefs();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="about">
      <Seo title="About" />

      <section className="about-hero">
        <div className="about-hero__media" aria-hidden="true">
          <Pic src={WinterRetreatFraternity} alt="" priority />
        </div>
        <div className="about-hero__grade" aria-hidden="true" />
        <div className="about-hero__content">
          <span className="mono-label about-hero__eyebrow">
            EST. 1904 — PI PSI, UC IRVINE
          </span>
          <SplitLines as="h1" className="about-hero__title" stagger={0.06}>
            About ΑΚΨ
          </SplitLines>
        </div>
      </section>

      <section className="about-record">
        <div className="about-record__heading hairline-bottom">
          <span className="mono-label">OUR STORY</span>
        </div>
        <div className="about-record__timeline" ref={timelineRef}>
          <div className="about-record__rail" aria-hidden="true">
            <motion.span
              className="about-record__rail-fill"
              style={reducedMotion ? { scaleY: 1 } : { scaleY: lineScale }}
            />
          </div>
          {TIMELINE.map((item, i) => (
            <motion.article
              className="about-era"
              key={item.year}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              <span className="about-era__node" aria-hidden="true" />
              <span className="about-era__year">{item.year}</span>
              <div className="about-era__body">
                <h3 className="about-era__title">{item.title}</h3>
                <p className="about-era__desc">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-demo">
        <div className="about-demo__heading hairline-bottom">
          <span className="mono-label">CHAPTER DEMOGRAPHICS</span>
        </div>
        <div className="about-demo__grid">
          <Donut title="MAJOR BREAKDOWN" data={majorData} />
          <Donut title="CLUB INVOLVEMENT" data={clubData} />
          <motion.figure
            className="about-chart about-chart--wide"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <figcaption className="mono-label about-chart__title">
              LEADERSHIP INVOLVEMENT RATES
            </figcaption>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={placementData}
                margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
              >
                <XAxis
                  dataKey="year"
                  tick={{
                    fill: "#6b665e",
                    fontSize: 11,
                    fontFamily: "Spline Sans Mono",
                  }}
                  axisLine={{ stroke: "rgba(244,241,234,0.12)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "#6b665e",
                    fontSize: 11,
                    fontFamily: "Spline Sans Mono",
                  }}
                  axisLine={{ stroke: "rgba(244,241,234,0.12)" }}
                  tickLine={false}
                />
                <Line
                  type="monotone"
                  dataKey="oncampus"
                  stroke="#c8a24b"
                  name="On-campus (%)"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="beyondCampus"
                  stroke="#4e7fff"
                  name="Campus and Beyond (%)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <ul className="about-chart__legend about-chart__legend--row">
              <li>
                <span
                  className="about-chart__swatch"
                  style={{ background: "#c8a24b" }}
                />
                <span className="about-chart__legend-name">On-campus (%)</span>
              </li>
              <li>
                <span
                  className="about-chart__swatch"
                  style={{ background: "#4e7fff" }}
                />
                <span className="about-chart__legend-name">
                  Campus and Beyond (%)
                </span>
              </li>
            </ul>
          </motion.figure>
        </div>
      </section>

      <section className="about-values">
        <div className="about-values__heading hairline-bottom">
          <span className="mono-label">OUR CORE VALUES</span>
        </div>
        <div className="about-values__grid">
          {CORE_VALUES.map((value, i) => (
            <motion.article
              className="value-card"
              key={value.letter}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: (i % 5) * 0.06,
                ease: EASE_OUT_EXPO,
              }}
            >
              <span className="value-card__media">
                <Pic src={value.image} alt={value.title} aspectRatio="4 / 3" />
              </span>
              <span className="value-card__letter" aria-hidden="true">
                {value.letter}
              </span>
              <h3 className="value-card__title">{value.title}</h3>
              <p className="value-card__copy">{value.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-faq">
        <FAQ />
      </section>

      <section className="about-close hairline-top">
        <blockquote className="about-close__quote">
          <p>
            "Forging tomorrow's leaders through the crucible of brotherhood,
            integrity, and professional excellence."
          </p>
          <footer className="mono-label">
            Join us in writing the next chapter of business innovation and
            ethical leadership.
          </footer>
        </blockquote>
      </section>

      <Footer />
    </div>
  );
}
