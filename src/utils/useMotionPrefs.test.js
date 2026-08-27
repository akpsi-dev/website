import React from "react";
import { render, screen } from "@testing-library/react";
import { MotionPrefsProvider, useMotionPrefs } from "./useMotionPrefs";

function Probe() {
  const { reducedMotion, finePointer } = useMotionPrefs();
  return <span>{`${reducedMotion}:${finePointer}`}</span>;
}

test("provider exposes motion prefs and mirrors them onto the html element", () => {
  render(
    <MotionPrefsProvider>
      <Probe />
    </MotionPrefsProvider>,
  );
  expect(screen.getByText(/^(true|false):(true|false)$/)).toBeInTheDocument();
  expect(document.documentElement.getAttribute("data-reduced-motion")).toMatch(
    /^(true|false)$/,
  );
});

test("hook falls back to a safe default outside a provider", () => {
  render(<Probe />);
  expect(screen.getByText("false:true")).toBeInTheDocument();
});
