import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ActiveBrotherList from "./ActiveBrotherList";

function renderList(brothers) {
  return render(
    <MemoryRouter>
      <ActiveBrotherList brothers={brothers} isLoading={false} />
    </MemoryRouter>,
  );
}

test("renders a card per named row", () => {
  renderList([["Jane Doe"], ["John Roe"]]);
  expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  expect(screen.getByText("John Roe")).toBeInTheDocument();
});

test("blank and malformed rows are skipped instead of crashing the grid", () => {
  renderList([[], [""], ["  "], [undefined, "Chapman"], null, ["Jane Doe"]]);
  expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  expect(screen.getAllByRole("link")).toHaveLength(1);
});

test("slug matches the trimmed, whitespace-collapsed name", () => {
  renderList([["  Jane   Doe  "]]);
  expect(screen.getByRole("link")).toHaveAttribute("href", "/Jane-Doe");
});

test("tolerates a missing brothers prop", () => {
  renderList(undefined);
  expect(screen.queryAllByRole("link")).toHaveLength(0);
});
