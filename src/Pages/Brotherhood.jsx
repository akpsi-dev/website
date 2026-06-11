import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Brotherhood.css";
import { useMobile } from "../Components/Navbar";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import Seo from "../Components/Seo";
import Pic from "../Components/Pic";
import Footer from "../Components/chrome/Footer";
import SplitLines from "../Components/chrome/SplitLines";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import {
  BrotherhoodImage70,
  BrotherhoodImage30,
  BrotherhoodImage65,
  BrotherhoodImage68,
  BrotherhoodImage71,
  BrotherhoodImage72,
  BrotherhoodImage51,
  BrotherhoodImage73,
  BrotherhoodImage75,
  BrotherhoodImage76,
  BrotherhoodImage60,
  BrotherhoodImage78,
  BrotherhoodImage40,
  BrotherhoodImage28,
  BrotherhoodImage18,
  BrotherhoodImage79,
  BrotherhoodImage80,
  BrotherhoodImage82,
  BrotherhoodImage15,
  BrotherhoodImage83,
  BrotherhoodImage16,
  BrotherhoodImage9,
  BrotherhoodImage52,
  BrotherhoodImage54,
  BrotherhoodImage55,
  BrotherhoodImage66,
  BrotherhoodImage85,
  BrotherhoodImage84,
  BrotherhoodImage86,
  BrotherhoodImage87,
  BrotherhoodImage88,
  BrotherhoodImage89,
  BrotherhoodImage90,
  BrotherhoodImage91,
  BrotherhoodImage92,
  BrotherhoodImage93,
  BrotherhoodImage94,
  BrotherhoodImage95,
  BrotherhoodImage96,
  BrotherhoodImage97,
  BrotherhoodImage98,
} from "../Assets";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const CAROUSEL_IMAGES = [
  BrotherhoodImage89,
  BrotherhoodImage97,
  BrotherhoodImage96,
  BrotherhoodImage87,
];

const SCRAPBOOK_IMAGES = [
  BrotherhoodImage30,
  BrotherhoodImage65,
  BrotherhoodImage88,
  BrotherhoodImage68,
  BrotherhoodImage92,
  BrotherhoodImage70,
  BrotherhoodImage71,
  BrotherhoodImage72,
  BrotherhoodImage90,
  BrotherhoodImage51,
  BrotherhoodImage73,
  BrotherhoodImage91,
  BrotherhoodImage75,
  BrotherhoodImage76,
  BrotherhoodImage60,
  BrotherhoodImage78,
  BrotherhoodImage40,
  BrotherhoodImage28,
  BrotherhoodImage18,
  BrotherhoodImage95,
  BrotherhoodImage79,
  BrotherhoodImage93,
  BrotherhoodImage80,
  BrotherhoodImage84,
  BrotherhoodImage82,
  BrotherhoodImage98,
  BrotherhoodImage83,
  BrotherhoodImage16,
  BrotherhoodImage9,
  BrotherhoodImage52,
  BrotherhoodImage54,
  BrotherhoodImage55,
  BrotherhoodImage66,
  BrotherhoodImage94,
  BrotherhoodImage86,
  BrotherhoodImage85,
  BrotherhoodImage15,
];

/** One collage column drifting at its own parallax rate. */
function CollageColumn({ images, indices, drift, onOpen }) {
  const ref = useRef(null);
  const { reducedMotion } = useMotionPrefs();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <motion.div
      className="collage__column"
      ref={ref}
      style={reducedMotion ? undefined : { y }}
    >
      {images.map((image, i) => (
        <motion.button
          type="button"
          className="collage__item"
          key={indices[i]}
          onClick={() => onOpen(indices[i])}
          aria-label={`Open photo ${indices[i] + 1} of ${SCRAPBOOK_IMAGES.length}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          <Pic src={image} alt="AKY brothers together" />
        </motion.button>
      ))}
    </motion.div>
  );
}

function Lightbox({ index, onClose, onStep }) {
  const total = SCRAPBOOK_IMAGES.length;

  const step = useCallback(
    (dir) => onStep((index + dir + total) % total),
    [index, onStep, total],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, step]);

  return (
    <motion.div
      className="lightbox"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <span className="lightbox__counter mono-label">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <button
        type="button"
        className="lightbox__close"
        onClick={onClose}
        aria-label="Close"
        autoFocus
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      <motion.div
        className="lightbox__frame"
        key={index}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
        onClick={(e) => e.stopPropagation()}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(e, info) => {
          if (info.offset.x < -70) step(1);
          else if (info.offset.x > 70) step(-1);
        }}
      >
        <img src={SCRAPBOOK_IMAGES[index]} alt="AKY brothers together" />
      </motion.div>

      <div className="lightbox__nav" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous photo"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next photo">
          <ArrowRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Brotherhood() {
  const { isMobile } = useMobile();
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    // The video element remounts with a new source when isMobile flips,
    // so readiness must reset with it.
    setVideoReady(false);
    const el = videoRef.current;
    if (!el) return undefined;
    const onCanPlay = () => setVideoReady(true);
    if (el.readyState >= 3) setVideoReady(true);
    el.addEventListener("canplay", onCanPlay);
    return () => el.removeEventListener("canplay", onCanPlay);
  }, [isMobile]);

  const columnCount = isMobile ? 2 : 3;
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => ({
      images: [],
      indices: [],
    }));
    SCRAPBOOK_IMAGES.forEach((img, i) => {
      cols[i % columnCount].images.push(img);
      cols[i % columnCount].indices.push(i);
    });
    return cols;
  }, [columnCount]);

  const drifts = [26, 60, 40];

  return (
    <div className="brotherhood">
      <Seo title="Brotherhood" />

      <section className="bh-hero">
        <div className="bh-hero__media">
          <video
            ref={videoRef}
            key={isMobile ? "mobile" : "desktop"}
            src={
              isMobile
                ? "https://d395js6c4h8h6h.cloudfront.net/Videos/CruiseReelWebsite.mp4"
                : "https://d395js6c4h8h6h.cloudfront.net/Videos/CruiseVideo2026.mp4"
            }
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className={videoReady ? "is-ready" : ""}
          >
            Your browser does not support the video tag.
          </video>
          <div className="bh-hero__grade" aria-hidden="true" />
        </div>
        <div className="bh-hero__content">
          <span className="mono-label bh-hero__eyebrow">
            PI PSI — UC IRVINE
          </span>
          <SplitLines as="h1" className="bh-hero__title" stagger={0.06}>
            Brotherhood
          </SplitLines>
        </div>
      </section>

      <section className="bh-flicks">
        <div className="bh-section-heading hairline-bottom">
          <span className="mono-label">OUR NEWEST FLICKS</span>
          <p className="bh-section-sub">
            Some of our favorite moments in recent memory.
          </p>
        </div>
        <div className="bh-flicks__grid">
          {CAROUSEL_IMAGES.map((image, i) => (
            <motion.div
              className="bh-flicks__item"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: (i % 2) * 0.1,
                ease: EASE_OUT_EXPO,
              }}
            >
              <Pic
                src={image}
                alt="AKY brothers together"
                aspectRatio="4 / 3"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bh-scrapbook">
        <div className="bh-section-heading hairline-bottom">
          <span className="mono-label">THE ALL-TIME SCRAPBOOK</span>
          <p className="bh-section-sub">
            From quarterly retreats to spontaneous hangouts, our brothers in
            Alpha Kappa Psi always make lifelong memories.
          </p>
        </div>
        <div className="collage">
          {columns.map((col, c) => (
            <CollageColumn
              key={c}
              images={col.images}
              indices={col.indices}
              drift={drifts[c % drifts.length]}
              onOpen={setLightbox}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            index={lightbox}
            onClose={() => setLightbox(null)}
            onStep={setLightbox}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
