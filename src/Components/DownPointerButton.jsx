import React, { useEffect, useCallback } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import "./DownPointerButton.css";
import { useState } from "react";

export default function DownPointerButton() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToNextSnapElement = useCallback(() => {
    const snapElements = Array.from(document.querySelectorAll("*")).filter(
      (el) => getComputedStyle(el).scrollSnapAlign === "start",
    );

    if (snapElements.length === 0) return;

    const viewportHeight = window.innerHeight;

    const currentIndex = snapElements.findIndex(
      (el) =>
        el.getBoundingClientRect().top > -viewportHeight / 2 &&
        el.getBoundingClientRect().top <= viewportHeight / 2,
    );

    let nextIndex = currentIndex + 1;
    if (nextIndex >= snapElements.length - 1) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }

    if (nextIndex >= snapElements.length) {
      nextIndex = 0;
      setIsAtBottom(false);
    }

    snapElements[nextIndex].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const button = document.getElementById("scroll-down-button");
      button.classList.add("pulse");
      setTimeout(() => button.classList.remove("pulse"), 1000);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkIfBottom = () => {
      const scrollPosition = window.pageYOffset;
      const windowSize = window.innerHeight;
      const bodyHeight = document.documentElement.scrollHeight;

      if (Math.abs(scrollPosition + windowSize - bodyHeight) < 2) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", checkIfBottom);
    return () => window.removeEventListener("scroll", checkIfBottom);
  }, []);

  return (
    <button
      id="scroll-down-button"
      className="scroll-down-button"
      onClick={scrollToNextSnapElement}
    >
      {isAtBottom ? (
        <KeyboardDoubleArrowUpIcon size={24} />
      ) : (
        <KeyboardDoubleArrowDownIcon size={24} />
      )}
    </button>
  );
}
