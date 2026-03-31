import React, { useState, useEffect } from "react";
import "./Recruitment.css";
import { NatureAscend } from "../Assets";
import RushEventInfo from "../Components/RushEventInfo";
import DownPointerButton from "../Components/DownPointerButton";
import RushButton from "../Components/RushButton";
import RotatingText from "../Components/RotatingText/RotatingText";
import { SummerAudio } from "../Assets";

export default function Recruitment() {
  const [isLoading, setIsLoading] = useState(true);
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

  const [audio] = useState(new Audio(SummerAudio));

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

  useEffect(() => {
    const img = new Image();
    img.src = NatureAscend;
    img.onload = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
  }, []);

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

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="recruitmentContainer">
      <div className="hero-recruitment-Section viewport">
        <h1 className="main-recruitment-Title">
          Spring Rush{" "}
          <RotatingText
            texts={["2026", "2016"]}
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
        </h1>
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
      </div>
      {events.map((event, index) => (
        <div key={index} className="viewport">
          <RushEventInfo event={event} />
        </div>
      ))}
      <DownPointerButton />
    </div>
  );
}
