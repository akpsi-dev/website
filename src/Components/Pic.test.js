import React from "react";
import { render, screen } from "@testing-library/react";
import Pic from "./Pic";

test("lazy-loads by default and derives aspect ratio from width/height", () => {
  render(<Pic src="/a.png" alt="a" width={4} height={3} />);
  const img = screen.getByAltText("a");
  expect(img).toHaveAttribute("loading", "lazy");
  expect(img).toHaveAttribute("decoding", "async");
  expect(img.style.aspectRatio).toBe("4 / 3");
});

test("priority images load eagerly", () => {
  render(<Pic src="/b.png" alt="b" priority />);
  expect(screen.getByAltText("b")).toHaveAttribute("loading", "eager");
});
