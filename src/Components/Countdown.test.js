import React from "react";
import { render, screen, act } from "@testing-library/react";
import Countdown, { countdownParts } from "./Countdown";
import { MotionPrefsProvider } from "../utils/useMotionPrefs";
import { RUSH_START } from "./HomeHero";

const T = new Date("2026-09-28T18:00:00-07:00");

function renderCountdown(props = {}) {
  return render(
    <MotionPrefsProvider>
      <Countdown target={T} {...props} />
    </MotionPrefsProvider>,
  );
}

describe("countdownParts", () => {
  it("splits a gap into whole units", () => {
    const now = T.getTime() - (((2 * 24 + 3) * 60 + 4) * 60 + 5) * 1000;
    expect(countdownParts(T, now)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      expired: false,
    });
  });

  it("never returns negative values once the target has passed", () => {
    const parts = countdownParts(T, T.getTime() + 5 * 86400 * 1000);
    expect(parts).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    });
  });

  it("marks the exact target instant as expired", () => {
    expect(countdownParts(T, T.getTime()).expired).toBe(true);
    expect(countdownParts(T, T.getTime() - 1).expired).toBe(false);
  });
});

/* Each digit renders in its own fixed-width slot, so a value is spread across
   several spans rather than sitting in one text node. Read it back off the
   cells instead of matching whole strings. */
function readCells() {
  return [...document.querySelectorAll(".countdown__cell")].map((cell) => ({
    value: cell.querySelector(".countdown__value").textContent,
    unit: cell.querySelector(".countdown__unit").textContent,
  }));
}

describe("Countdown", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("pads every unit to a fixed two digits so the row cannot reflow", () => {
    jest.setSystemTime(T.getTime() - (((1 * 24 + 2) * 60 + 3) * 60 + 4) * 1000);
    renderCountdown();
    expect(readCells()).toEqual([
      { value: "01", unit: "D" },
      { value: "02", unit: "H" },
      { value: "03", unit: "M" },
      { value: "04", unit: "S" },
    ]);
  });

  it("gives every digit its own slot so the font cannot shift the row", () => {
    jest.setSystemTime(T.getTime() - 10 * 1000);
    renderCountdown();
    const slots = [...document.querySelectorAll(".countdown__cell")].map(
      (c) => c.querySelectorAll(".countdown__digit").length,
    );
    // two digits per cell, one slot each
    expect(slots).toEqual([2, 2, 2, 2]);
  });

  it("ticks once a second", () => {
    jest.setSystemTime(T.getTime() - 10 * 1000);
    renderCountdown();
    expect(readCells().at(-1)).toEqual({ value: "10", unit: "S" });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(readCells().at(-1)).toEqual({ value: "09", unit: "S" });
  });

  it("shows the expired label instead of zeros, and stops ticking", () => {
    jest.setSystemTime(T.getTime() + 1000);
    renderCountdown();
    expect(screen.getByText("RUSH IS HERE")).toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    expect(jest.getTimerCount()).toBe(0);
  });

  it("flips to the expired label as the target passes while mounted", () => {
    jest.setSystemTime(T.getTime() - 2000);
    renderCountdown();
    expect(screen.getByRole("timer")).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.getByText("RUSH IS HERE")).toBeInTheDocument();
  });

  it("drops the seconds cell under reduced motion", () => {
    window.localStorage.setItem("akpsi-reduced-motion", "true");
    jest.setSystemTime(T.getTime() - 90 * 1000);
    renderCountdown();
    expect(readCells()).toEqual([
      { value: "00", unit: "D" },
      { value: "00", unit: "H" },
      { value: "01", unit: "M" },
    ]);
    window.localStorage.removeItem("akpsi-reduced-motion");
  });
});

describe("RUSH_START", () => {
  it("is 6pm Pacific on 28 September 2026, pinned to a single instant", () => {
    expect(RUSH_START.toISOString()).toBe("2026-09-29T01:00:00.000Z");
  });
});
