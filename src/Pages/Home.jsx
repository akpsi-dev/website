import React, { useRef, useEffect, useState } from "react";
import "./Home.css";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  BrotherhoodImage66,
  BrotherhoodImage75,
  BrotherhoodImage76,
  knightAKYLogo,
} from "../Assets";
import Seo from "../Components/Seo";
import Pic from "../Components/Pic";
import SplitLines from "../Components/chrome/SplitLines";
import Marquee from "../Components/chrome/Marquee";
import Magnetic from "../Components/chrome/Magnetic";
import Footer from "../Components/chrome/Footer";
import { CurtainLink } from "../Components/chrome/Curtain";
import { useMotionPrefs } from "../utils/useMotionPrefs";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const TICKER_ITEMS = [
  "ALPHA KAPPA PSI",
  "PI PSI CHAPTER",
  "UC IRVINE",
  "EST. 1904",
  "THE FIRST AND LARGEST BUSINESS FRATERNITY",
];

const PILLARS = [
  {
    index: "01",
    title: "Brotherhood",
    image: BrotherhoodImage76,
    copy: "In Alpha Kappa Psi, you meet as strangers but leave as lifelong friends. Our brotherhood sets us apart and shapes us into who we are.",
    to: "/meet-us",
    label: "Brothers",
  },
  {
    index: "02",
    title: "Professionalism",
    image: BrotherhoodImage66,
    copy: "We inspire one another to chase our passions with confidence by equipping ourselves with the tools necessary to succeed in any industry.",
    to: "/careers",
    label: "Careers",
  },
  {
    index: "03",
    title: "Personal Growth",
    image: BrotherhoodImage75,
    copy: "Our unique culture inspires, encourages, and motivates you to step out of your comfort zone and live the life you've always imagined.",
    to: "/rush",
    label: "Recruitment",
  },
];

/** Bone veil with the monogram knocked out — the video plays inside the
 *  letterforms, then the veil dissolves to full bleed. */
function HeroVeil({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let dissolveTimer;
    const arm = setTimeout(() => setLeaving(true), 2000);
    return () => {
      clearTimeout(arm);
      clearTimeout(dissolveTimer);
    };
  }, []);

  return (
    <motion.div
      className="hero-veil"
      initial={{ opacity: 1 }}
      animate={leaving ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
      transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
      onAnimationComplete={() => {
        if (leaving) onDone();
      }}
      aria-hidden="true"
    >
      <span className="hero-veil__glyphs">ΑΚΨ</span>
    </motion.div>
  );
}

export default function Home() {
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const { reducedMotion } = useMotionPrefs();
  const [videoReady, setVideoReady] = useState(false);
  const [veilDone, setVeilDone] = useState(reducedMotion);

  // If motion preferences flip to reduced while the veil is mid-flight, its
  // exit animation never completes — force the hero content through.
  useEffect(() => {
    if (reducedMotion) setVeilDone(true);
  }, [reducedMotion]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return undefined;
    const handleCanPlay = () => setVideoReady(true);
    if (videoElement.readyState >= 3) setVideoReady(true);
    videoElement.addEventListener("canplay", handleCanPlay);
    return () => videoElement.removeEventListener("canplay", handleCanPlay);
  }, []);

  return (
    <div className="home">
      <Seo title="Home" />

      <section className="home-hero" ref={heroRef}>
        <motion.div
          className="home-hero__media"
          style={reducedMotion ? undefined : { y: videoY }}
        >
          <video
            ref={videoRef}
            src="https://d395js6c4h8h6h.cloudfront.net/Videos/SpringRushVideo2026.mp4"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className={videoReady ? "is-ready" : ""}
          >
            Your browser does not support the video tag.
          </video>
          <div className="home-hero__grade" aria-hidden="true" />
        </motion.div>

        {!veilDone && !reducedMotion && (
          <AnimatePresence>
            <HeroVeil onDone={() => setVeilDone(true)} />
          </AnimatePresence>
        )}

        <motion.div
          className="home-hero__content"
          style={
            reducedMotion ? undefined : { y: titleY, opacity: titleOpacity }
          }
        >
          <motion.span
            className="mono-label home-hero__eyebrow"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={veilDone ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: reducedMotion ? 0 : 0.6,
              delay: reducedMotion ? 0 : 0.1,
              ease: EASE_OUT_EXPO,
            }}
          >
            ALPHA KAPPA PSI — PI PSI CHAPTER
          </motion.span>
          <h1 className="home-hero__title" aria-label="Alpha Kappa Psi UCI">
            <span className="home-hero__mask">
              <motion.span
                className="home-hero__line"
                initial={reducedMotion ? false : { y: "115%" }}
                animate={veilDone ? { y: "0%" } : {}}
                transition={{
                  duration: reducedMotion ? 0 : 0.9,
                  delay: reducedMotion ? 0 : 0.15,
                  ease: EASE_OUT_EXPO,
                }}
              >
                ΑΚΨ — UCI
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <div className="home-hero__ticker hairline-top">
          <Marquee items={TICKER_ITEMS} speed={36} />
        </div>
      </section>

      <section className="home-info">
        <span className="mono-label home-info__eyebrow">EST. 1904</span>
        <SplitLines as="h2" className="home-info__title">
          The first and largest business fraternity
        </SplitLines>
        <div className="home-info__body">
          <div className="home-info__copy">
            <p>
              The organization of Alpha Kappa Psi was founded in New York
              University in 1904. Spanning decades, Alpha Kappa Psi has helped
              over 300,000 individuals create lifelong friends and pursue their
              dreams. Our goal is to help Anteaters become the best versions of
              themselves.
            </p>
            <Magnetic strength={0.25}>
              <a
                className="hairline-button"
                href="https://akpsi.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </a>
            </Magnetic>
          </div>
          <motion.div
            className="home-info__emblem"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            <Pic src={knightAKYLogo} alt="Knight Logo of Alpha Kappa Psi" />
          </motion.div>
        </div>
      </section>

      <section className="home-pillars">
        <div className="home-pillars__heading hairline-bottom">
          <span className="mono-label">OUR PILLARS</span>
        </div>
        {PILLARS.map((pillar) => (
          <PillarRow key={pillar.index} {...pillar} />
        ))}
      </section>

      <Footer />
    </div>
  );
}

function PillarRow({ index, title, image, copy, to, label }) {
  const rowRef = useRef(null);
  const { reducedMotion } = useMotionPrefs();
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <CurtainLink to={to} className="pillar-row">
      <div className="pillar-row__inner hairline-bottom" ref={rowRef}>
        <div className="pillar-row__text">
          <span className="mono-label pillar-row__index">{index}</span>
          <SplitLines as="h3" className="pillar-row__title" stagger={0.05}>
            {title}
          </SplitLines>
          <p className="pillar-row__copy">{copy}</p>
          <span className="mono-label pillar-row__link">
            {label}
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </span>
        </div>
        <div className="pillar-row__media">
          <motion.div
            className="pillar-row__media-inner"
            style={reducedMotion ? undefined : { y: imageY }}
          >
            <Pic src={image} alt={title} aspectRatio="4 / 3" />
          </motion.div>
        </div>
      </div>
    </CurtainLink>
  );
}
