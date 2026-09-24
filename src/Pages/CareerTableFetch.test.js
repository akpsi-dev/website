import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import axios from "axios";
import CareerTable from "./CareerTable";

jest.mock("axios");

function renderTable() {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <CareerTable />
    </SWRConfig>,
  );
}

beforeEach(() => {
  window.sessionStorage.clear();
  jest.clearAllMocks();
});

test("shows skeleton bars while the sheet is in flight, then the rows", async () => {
  let resolve;
  axios.get.mockReturnValue(
    new Promise((r) => {
      resolve = r;
    }),
  );
  const { container } = renderTable();

  expect(container.querySelectorAll(".careers-skeleton__bar")).toHaveLength(8);
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

  resolve({
    data: { values: [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]] },
  });

  // 2026 carries repo-held placements, so that is where the page opens.
  await userEvent.click(await screen.findByRole("button", { name: "2025" }));

  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(container.querySelectorAll(".careers-skeleton__bar")).toHaveLength(0);
  // Grouped under its sector heading, not rendered as a fourth column.
  expect(screen.getByRole("heading", { name: "Finance" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "2025" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("a failed fetch drops the skeleton instead of hanging on it", async () => {
  axios.get.mockRejectedValue(new Error("quota exceeded"));
  const { container } = renderTable();

  await waitFor(() =>
    expect(container.querySelectorAll(".careers-skeleton__bar")).toHaveLength(
      0,
    ),
  );
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});

test("switching years swaps the sheet", async () => {
  axios.get.mockResolvedValue({
    data: {
      values: [
        ["Alice", "2025", "Finance", "Sector", "Co", "Analyst"],
        ["Bob", "2024", "Technology", "Sector", "Co", "Engineer"],
      ],
    },
  });
  renderTable();

  await userEvent.click(await screen.findByRole("button", { name: "2025" }));

  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(screen.queryByText("Bob")).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "2024" }));

  expect(await screen.findByText("Bob")).toBeInTheDocument();
  expect(screen.queryByText("Alice")).not.toBeInTheDocument();
});

test("a seeded year with no rows says so instead of rendering an empty sheet", async () => {
  axios.get.mockResolvedValue({
    data: { values: [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]] },
  });
  renderTable();

  await userEvent.click(await screen.findByRole("button", { name: "2018" }));

  expect(
    await screen.findByText(/No placements recorded for 2018 yet/),
  ).toBeInTheDocument();
});

test("opens on the pinned 2026 tab, not the newer 2027 one", async () => {
  axios.get.mockResolvedValue({
    data: { values: [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]] },
  });
  renderTable();

  // Braeden, Logan and Tyler are incoming on 2027 roles, so 2027 now holds
  // rows — but PINNED_YEAR keeps the fuller 2026 tab as the one visitors
  // land on. 2027 is a click away.
  expect(await screen.findByText("Anna Shan")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "2026" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await userEvent.click(screen.getByRole("button", { name: "2027" }));
  expect(await screen.findByText("Tyler Ho")).toBeInTheDocument();
});

test("2026 still carries the repo-held placements the sheet lacks", async () => {
  axios.get.mockResolvedValue({
    data: { values: [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]] },
  });
  renderTable();

  await userEvent.click(await screen.findByRole("button", { name: "2026" }));
  expect(await screen.findByText("Anna Shan")).toBeInTheDocument();
  // 2025 is untouched by the merge and still reachable.
  await userEvent.click(screen.getByRole("button", { name: "2025" }));
  expect(await screen.findByText("Alice")).toBeInTheDocument();
});

test("a year with no rows anywhere still says so", async () => {
  axios.get.mockResolvedValue({
    data: { values: [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]] },
  });
  renderTable();

  await userEvent.click(await screen.findByRole("button", { name: "2019" }));

  expect(
    await screen.findByText(/No placements recorded for 2019 yet/),
  ).toBeInTheDocument();
});
