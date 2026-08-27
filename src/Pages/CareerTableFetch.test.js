import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
  expect(screen.queryByRole("table")).not.toBeInTheDocument();

  resolve({
    data: { values: [["Alice", "2025", "Finance", "Sector", "Co", "Analyst"]] },
  });

  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(container.querySelectorAll(".careers-skeleton__bar")).toHaveLength(0);
});

test("a failed fetch drops the skeleton instead of hanging on it", async () => {
  axios.get.mockRejectedValue(new Error("quota exceeded"));
  const { container } = renderTable();

  await waitFor(() =>
    expect(container.querySelectorAll(".careers-skeleton__bar")).toHaveLength(
      0,
    ),
  );
  expect(screen.getByRole("table")).toBeInTheDocument();
});
