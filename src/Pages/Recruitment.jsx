import React, { useState, useEffect } from "react";
import "./Recruitment.css";
import RushEventInfo from "../Components/RushEventInfo";
import DownPointerButton from "../Components/DownPointerButton";
import RushButton from "../Components/RushButton";
import RotatingText from "../Components/RotatingText/RotatingText";
import { SummerAudio } from "../Assets";
import Countdown from "../Components/Countdown";
import { RUSH_START } from "../utils/rushDate";

/* Which rush cycle state the page is in.

   'coming-soon' — Fall Rush 2026 is announced but the schedule is not. Shows
                   the hero and a countdown to RUSH_START, and nothing else.
   'live'        — the full schedule, as the page has always rendered.

   The `events` array below is deliberately left in place. It still holds the
   Spring 2026 dates, which are stale, but keeping it means switching to 'live'
   is a one-value edit against a structure you can already see — replace the
   entries with the Fall dates and flip this. */
const RUSH_STATE = "coming-soon";

/* The Calvin Harris loop that used to autoplay on this page. Backlogged, not
   removed — flip to true and it comes back exactly as it was.

   Off for now because it started unprompted with no control to stop it, which
   also means most browsers refuse to play it at all: autoplay with sound needs
   a user gesture first, so the .play() below was usually rejected. If it does
   come back it wants a visible mute toggle rather than a bare autoplay. */
const RUSH_AUDIO_ENABLED = false;

export default function Recruitment() {
  const [isMobile, setIsMobile] = useState(false);

  const events = [
    {
      name: "Meet The Bros",
      date: "Tuesday, March 31",
      location: "SB1 1200",
      attire: "Casual",
      time: "6:00 PM - 9:00 PM",
      "open-ness": "Open Invite",
    },
    {
      name: "Alumni Night",
      date: "Thursday, April 2",
      location: "SB1 1200",
      attire: "Business Professional",
      time: "6:00 PM - 9:00 PM",
      "open-ness": "Open Invite",
    },
    {
      name: "Game Night",
      date: "Friday, April 3",
      location: "SB1 1200",
      attire: "Business Casual",
      time: "6:00 PM - 9:00 PM",
      "open-ness": "Open Invite",
    },
    {
      name: "Social Barbeque",
      date: "Tuesday, April 7th",
      location: "Sent via Email",
      attire: "Casual",
      time: "6:00 PM",
      "open-ness": "Invite Only",
    },
    {
      name: "Interviews",
      date: "Thursday, April 9th + Friday, April 10th",
      location: "Sent via Email",
      attire: "Business Professional",
      time: "6:00 PM",
      "open-ness": "Invite Only",
    },
  ];

  /* Lazy initialiser on purpose. `useState(new Audio(...))` builds a fresh
     Audio on every single render and throws all but the first away; the
     callback form runs once. It also means nothing is constructed at all
     while the flag is off. */
  const [audio] = useState(() =>
    RUSH_AUDIO_ENABLED ? new Audio(SummerAudio) : null,
  );

  // Detect if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice =
        /android|iPad|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
  }, []);

  useEffect(() => {
    if (!audio) return undefined;

    // Set up audio
    audio.loop = true;

    // Start playing when component mounts
    audio.play().catch((error) => {
      console.log("Audio playback failed:", error);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  // Get the appropriate calendar link based on device
  const getCalendarLink = () => {
    // Full calendar ID (from your embed URL)
    const calendarId =
      "2dffb3ba0d4158fce2472e84601aa546522ce8b9df5219c466ae9b6f886e809d@group.calendar.google.com";
    const calendarTz = "America/Los_Angeles"; // timezone from the embed URL

    const encodedId = encodeURIComponent(calendarId);
    const encodedTz = encodeURIComponent(calendarTz);

    if (isMobile) {
      // Mobile app deep links (will open the Google Calendar app if installed)
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return `googlecalendar://addcalendar?cid=${encodedId}`;
      } else {
        return `intent://calendar/addcalendar?cid=${encodedId}#Intent;scheme=googlecalendar;package=com.google.android.calendar;end`;
      }
    } else {
      // Desktop: open the calendar page (users can add/subscribe there)
      // Use the `cid` variant which opens the calendar and allows subscribing.
      return `https://calendar.google.com/calendar/u/0?cid=${encodedId}&ctz=${encodedTz}`;
    }
  };

  const isComingSoon = RUSH_STATE === "coming-soon";

  return (
    <div className="recruitmentContainer">
      <div className="hero-recruitment-Section viewport">
        <h1 className="main-recruitment-Title">
          {isComingSoon ? (
            "Fall Rush 2026"
          ) : (
            <>
              Fall Rush{" "}
              {/* The 2016 flash is a joke about the retro skyline that used to
                  back this page. It is kept for the live schedule, but it has
                  no place next to a countdown, where the year is information
                  rather than a gag. RotatingText itself is untouched and still
                  in the repo. */}
              <RotatingText
                texts={["2016", "2026"]}
                rotationInterval={1000}
                loop={false}
                splitBy="characters"
                staggerFrom="last"
                staggerDuration={0.06}
                initial={{ y: "60%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-60%", opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                mainClassName="countdown-year"
              />
            </>
          )}
        </h1>
        {isComingSoon ? (
          <div className="rush-comingsoon">
            <Countdown target={RUSH_START} />
            <p className="rush-comingsoon__note">
              Schedule and applications announced soon.
            </p>
          </div>
        ) : (
          <div className="rush-buttons">
            <RushButton
              href={getCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>Add Rush Events to Calendar</b>
            </RushButton>
            <RushButton href="https://forms.gle/hhx3Kfi2YS9cqUGd7">
              <b>Rush Application</b>
            </RushButton>
          </div>
        )}
      </div>
      {/* Both are schedule-dependent: the cards are the schedule, and the down
          arrow exists to page through them. Neither has anything to show while
          the dates are unannounced. */}
      {!isComingSoon &&
        events.map((event, index) => (
          <div key={index} className="viewport">
            <RushEventInfo event={event} />
          </div>
        ))}
      {!isComingSoon && <DownPointerButton />}
    </div>
  );
}
