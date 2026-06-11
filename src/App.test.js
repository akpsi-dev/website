import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders site navigation", async () => {
  render(<App />);
  expect(await screen.findByRole("navigation")).toBeInTheDocument();
  expect(screen.getByText(/about/i)).toBeInTheDocument();
  expect(screen.getByText(/rush/i)).toBeInTheDocument();
});
