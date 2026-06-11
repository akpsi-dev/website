import React, { useEffect, useMemo, useState } from "react";
import "./Recruitment.css";
import { motion } from "framer-motion";
import { ArrowUpRight, Volume2, VolumeX, CalendarPlus } from "lucide-react";
import { PalmTreeCity, SummerAudio } from "../Assets";
import Seo from "../Components/Seo";
import Footer from "../Components/chrome/Footer";
import Magnetic from "../Components/chrome/Magnetic";
import { useMotionPrefs } from "../utils/useMotionPrefs";
import { downloadIcs } from "../utils/ics";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const APPLICATION_URL = "https://forms.gle/hhx3Kfi2YS9cqUGd7";

// Existing Spring Rush 2026 events; `start`/`end` are the same dates in
// machine form, used for the countdown and the .ics downloads.
const EVENTS = [
  {
    name: "Meet The Bros",
    date: "Tuesday, March 31",
    location: "SB1 1200",
    attire: "Casual",
    time: "6:00 PM - 9:00 PM",
    openness: "Open Invite",
    start: new Date(2026, 2, 31, 18, 0),
    end: new Date(2026, 2, 31, 21, 0),
  },
  {
    name: "Alumni Night",
    date: "Thursday, April 2",
    location: "SB1 1200",
    attire: "Business Professional",
    time: "6:00 PM - 9:00 PM",
    openness: "Open Invite",
    start: new Date(2026, 3, 2, 18, 0),
    end: new Date(2026, 3, 2, 21, 0),
  },
  {
    name: "Game Night",
    date: "Friday, April 3",
    location: "SB1 1200",
    attire: "Business Casual",
    time: "6:00 PM - 9:00 PM",
    openness: "Open Invite",
    start: new Date(2026, 3, 3, 18, 0),
    end: new Date(2026, 3, 3, 21, 0),
  },
  {
    name: "Social Barbeque",
    date: "Tuesday, April 7th",
    location: "Sent via Email",
    attire: "Casual",
    time: "6:00 PM",
    openness: "Invite Only",
    start: new Date(2026, 3, 7, 18, 0),
    end: new Date(2026, 3, 7, 21, 0),
  },
  {
    name: "Interviews",
    date: "Thursday, April 9th + Friday, April 10th",
    location: "Sent via Email",
    attire: "Business Professional",
    time: "6:00 PM",
    openness: "Invite Only",
    start: new Date(2026, 3, 9, 18, 0),
    end: new Date(2026, 3, 9, 21, 0),
  },
];

// The plain web URL works in every browser and deep-links into the
// installed Google Calendar app on both iOS and Android — no UA branching.
const CALENDAR_URL = `https://calendar.google.com/calendar/u/0?cid=${encodeURIComponent(
  "2dffb3ba0d4158fce2472e84601aa546522ce8b9df5219c466ae9b6f886e809d@group.calendar.google.com",
)}&ctz=${encodeURIComponent("America/Los_Angeles")}`;

/** Ticks once a second only while a future event exists, so the countdown
 *  rolls over to the next event and stops entirely after the last one. */
function useNow(enabled) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [enabled]);
  return now;
}

function countdownParts(target, now) {
  if (!target) return null;
  const remaining = target.getTime() - now;
  if (remaining <= 0) return null;
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function StaggerTitle({ words }) {
  const { reducedMotion } = useMotionPrefs();
  let letterIndex = 0;
  return (
    <h1 className="rush-hero__title">
      {words.map((word, w) => (
        <span className="rush-hero__word" key={w}>
          {word.split("").map((ch, i) => {
            const d = letterIndex++;
            return (
              <motion.span
                key={i}
                className="rush-hero__letter"
                initial={
                  reducedMotion ? { opacity: 1 } : { y: "110%", opacity: 0 }
                }
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + d * 0.04,
                  ease: EASE_OUT_EXPO,
                }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export default function Recruitment() {
  const [audio] = useState(() => new Audio(SummerAudio));
  const [soundOn, setSoundOn] = useState(false);

  const anyFutureEvents = EVENTS.some((e) => e.start.getTime() > Date.now());
  const now = useNow(anyFutureEvents);
  const nextEvent = useMemo(
    () => EVENTS.find((e) => e.start.getTime() > now),
    [now],
  );
  const countdown = countdownParts(nextEvent?.start, now);

  useEffect(() => {
    audio.loop = true;
    audio
      .play()
      .then(() => setSoundOn(true))
      .catch(() => setSoundOn(false));
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const toggleSound = () => {
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      audio
        .play()
        .then(() => setSoundOn(true))
        .catch(() => setSoundOn(false));
    }
  };

  return (
    <div className="rush">
      <Seo title="Rush" />

      <section className="rush-hero">
        <div
          className="rush-hero__bg"
          style={{ backgroundImage: `url(${PalmTreeCity})` }}
          aria-hidden="true"
        />
        <div className="rush-hero__grade" aria-hidden="true" />
        <div className="rush-hero__content">
          <span className="mono-label rush-hero__eyebrow">
            UC IRVINE — PI PSI CHAPTER
          </span>
          <StaggerTitle words={["Spring", "Rush", "2026"]} />
          <div className="rush-hero__actions">
            <Magnetic strength={0.25}>
              <a className="rush-cta rush-cta--brass" href={APPLICATION_URL}>
                Rush Application
                <ArrowUpRight size={15} strokeWidth={2} />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                className="hairline-button"
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Add Rush Events to Calendar
              </a>
            </Magnetic>
          </div>
        </div>
        <button
          type="button"
          className="rush-sound mono-label"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        >
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {soundOn ? "Sound on" : "Sound off"}
        </button>
      </section>

      {countdown && (
        <div className="rush-countdown hairline-top hairline-bottom">
          <span className="mono-label">NEXT EVENT — {nextEvent.name}</span>
          <span className="rush-countdown__clock" role="timer">
            {[
              [countdown.days, "D"],
              [countdown.hours, "H"],
              [countdown.minutes, "M"],
              [countdown.seconds, "S"],
            ].map(([value, unit]) => (
              <span className="rush-countdown__cell" key={unit}>
                {String(value).padStart(2, "0")}
                <span className="rush-countdown__unit">{unit}</span>
              </span>
            ))}
          </span>
        </div>
      )}

      <section className="rush-schedule">
        <div className="rush-schedule__heading hairline-bottom">
          <span className="mono-label">SCHEDULE</span>
          <span className="mono-label rush-schedule__count">
            {String(EVENTS.length).padStart(2, "0")} EVENTS
          </span>
        </div>
        {EVENTS.map((event, i) => (
          <motion.article
            className="rush-event hairline-bottom"
            key={event.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: EASE_OUT_EXPO }}
          >
            <span className="rush-event__day">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="rush-event__main">
              <h3 className="rush-event__name">{event.name}</h3>
              <span className="mono-label rush-event__date">{event.date}</span>
            </div>
            <dl className="rush-event__meta">
              <div>
                <dt className="mono-label">TIME</dt>
                <dd>{event.time}</dd>
              </div>
              <div>
                <dt className="mono-label">LOCATION</dt>
                <dd>{event.location}</dd>
              </div>
              <div>
                <dt className="mono-label">ATTIRE</dt>
                <dd>{event.attire}</dd>
              </div>
              <div>
                <dt className="mono-label">INVITE</dt>
                <dd>{event.openness}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="rush-event__ics mono-label"
              onClick={() => downloadIcs(event)}
              aria-label={`Add ${event.name} to calendar`}
            >
              <CalendarPlus size={14} strokeWidth={1.75} />
              Save the date
            </button>
          </motion.article>
        ))}
      </section>

      <div className="rush-apply-bar">
        <a className="rush-apply-bar__link" href={APPLICATION_URL}>
          Rush Application
          <ArrowUpRight size={16} strokeWidth={2} />
        </a>
      </div>

      <Footer />
    </div>
  );
}
