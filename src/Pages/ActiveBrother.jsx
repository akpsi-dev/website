import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "./ActiveBrother.css";
import { headshotHash } from "../Assets/headshot";
import { companyHash } from "../Assets/company";
import Seo from "../Components/Seo";
import Footer from "../Components/chrome/Footer";
import SplitLines from "../Components/chrome/SplitLines";
import { CurtainLink } from "../Components/chrome/Curtain";
import { useMotionPrefs } from "../utils/useMotionPrefs";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

function splitItems(text) {
  if (!text) return [];
  return text
    .replace(/\r\n|\r|\n/g, "\n")
    .split("\n\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function slugFor(name = "") {
  return encodeURIComponent(name.trim().replace(/\s+/g, "-"));
}

/** Pointer-driven holographic sheen over the cover portrait. */
function HoloPortrait({ name }) {
  const ref = useRef(null);
  const { reducedMotion, finePointer } = useMotionPrefs();
  const enabled = finePointer && !reducedMotion;

  const onMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", `${mx}%`);
    ref.current.style.setProperty("--my", `${my}%`);
    ref.current.style.setProperty("--sheen", "1");
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--sheen", "0");
  };

  return (
    <div
      className="profile__portrait"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <img
        src={headshotHash[name] ?? headshotHash["Default Headshot"]}
        alt={name}
      />
      <span className="profile__sheen" aria-hidden="true" />
    </div>
  );
}

/**
 * The sheet cell historically holds pasted Spotify embed HTML. Injecting it
 * raw would be stored XSS for anyone with sheet access, so extract the
 * track reference and build the iframe in code instead.
 */
function spotifyEmbedSrc(cell) {
  const match =
    /open\.spotify\.com\/(?:embed\/)?(track|album|playlist|episode)\/([A-Za-z0-9]+)/.exec(
      cell ?? "",
    );
  if (!match) return null;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
}

/** Spotify embed deferred until the card scrolls near the viewport. */
function FavoriteSong({ embedSrc }) {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);
  const { reducedMotion } = useMotionPrefs();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="profile__song hairline-top" ref={ref}>
      <div className="profile__song-head">
        <span className="mono-label profile__song-label">FAVORITE SONG</span>
        <span
          className={`profile__eq ${reducedMotion ? "profile__eq--still" : ""}`}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
        </span>
      </div>
      {load && (
        <div className="profile__song-embed">
          <iframe
            title="Favorite song"
            src={embedSrc}
            width="100%"
            height="152"
            frameBorder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      )}
    </div>
  );
}

export default function ActiveBrother({ brotherInfo, prevName, nextName }) {
  const [
    name,
    hometown,
    major,
    pledgeClass,
    graduationYear,
    linkedinUrl,
    interestsRaw,
    experienceRaw,
    askMeAboutRaw,
    loveStatement,
    favoriteSong,
  ] = brotherInfo;

  const company = companyHash[name];

  const sections = [
    { label: "Interests", items: splitItems(interestsRaw) },
    { label: "Experience", items: splitItems(experienceRaw) },
    { label: "Ask Me About", items: splitItems(askMeAboutRaw) },
  ].filter((section) => section.items.length > 0);

  const meta = [
    ["Hometown", hometown],
    ["Major", major],
    ["Class", pledgeClass],
    ["Graduation", graduationYear],
  ].filter(([, value]) => value);

  return (
    <article className="profile">
      <Seo title={name} description={`${name} — Alpha Kappa Psi, UCI`} />

      <div className="profile__layout">
        <div className="profile__left">
          <HoloPortrait name={name} />
          <span className="mono-label profile__stamp">
            PI PSI{graduationYear ? ` — CLASS OF ${graduationYear}` : ""}
          </span>
        </div>

        <div className="profile__right">
          <SplitLines as="h1" className="profile__name" stagger={0.06}>
            {name}
          </SplitLines>

          <dl className="profile__meta">
            {meta.map(([label, value]) => (
              <div className="profile__meta-row hairline-bottom" key={label}>
                <dt className="mono-label">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {company && (
              <div className="profile__meta-row hairline-bottom">
                <dt className="mono-label">Company</dt>
                <dd>
                  <img className="profile__company" src={company} alt="" />
                </dd>
              </div>
            )}
          </dl>

          {linkedinUrl && (
            <a
              className="hairline-button profile__linkedin"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
              <ArrowUpRight size={15} strokeWidth={1.75} />
            </a>
          )}

          {sections.map((section, s) => (
            <motion.section
              className="profile__section"
              key={section.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: s * 0.05,
                ease: EASE_OUT_EXPO,
              }}
            >
              <h2 className="mono-label profile__section-label">
                {section.label}
              </h2>
              <ul className="profile__list">
                {section.items.map((item, i) => (
                  <li className="profile__list-item hairline-bottom" key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}

          {loveStatement && (
            <motion.blockquote
              className="profile__love"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            >
              <span className="mono-label profile__section-label">
                Why I Love AKPsi
              </span>
              <p>{loveStatement}</p>
            </motion.blockquote>
          )}

          {spotifyEmbedSrc(favoriteSong) && (
            <FavoriteSong embedSrc={spotifyEmbedSrc(favoriteSong)} />
          )}
        </div>
      </div>

      <nav className="profile__folios hairline-top" aria-label="Roster">
        {prevName ? (
          <CurtainLink
            to={`/${slugFor(prevName)}`}
            className="profile__folio mono-label"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            {prevName}
          </CurtainLink>
        ) : (
          <span />
        )}
        <CurtainLink to="/meet-us" className="profile__folio mono-label">
          THE INDEX
        </CurtainLink>
        {nextName ? (
          <CurtainLink
            to={`/${slugFor(nextName)}`}
            className="profile__folio mono-label profile__folio--next"
          >
            {nextName}
            <ArrowRight size={14} strokeWidth={1.75} />
          </CurtainLink>
        ) : (
          <span />
        )}
      </nav>

      <Footer />
    </article>
  );
}
