import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HttpVersionComparisonView } from "./HttpVersionComparisonView";
import { fetchHttpVersions } from "../api";
import type { HttpVersionTimeline } from "../types";

vi.mock("../api", () => ({
  fetchHttpVersions: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchHttpVersions);

const TIMELINES: HttpVersionTimeline[] = [
  { version: "HTTP/0.9", label: "HTTP/0.9", events: [], totalTimeMs: 100, description: "" },
  { version: "HTTP/1.1", label: "HTTP/1.1", events: [], totalTimeMs: 30, description: "" },
  { version: "HTTP/2", label: "HTTP/2", events: [], totalTimeMs: 10, description: "" },
];

describe("HttpVersionComparisonView", () => {
  it("excludes HTTP/0.9 from the prediction choices (shown separately as a historical reference)", async () => {
    mockedFetch.mockResolvedValue(TIMELINES);
    render(<HttpVersionComparisonView />);

    expect(await screen.findByRole("button", { name: "HTTP/1.1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "HTTP/0.9" })).not.toBeInTheDocument();
  });

  it("disables the run button until a prediction is chosen", async () => {
    mockedFetch.mockResolvedValue(TIMELINES);
    const user = userEvent.setup();
    render(<HttpVersionComparisonView />);

    const runButton = await screen.findByRole("button", { name: "Uruchom symulację" });
    expect(runButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "HTTP/2" }));
    expect(runButton).toBeEnabled();
  });

  it("confirms a correct prediction once the fastest version finishes", async () => {
    mockedFetch.mockResolvedValue(TIMELINES);
    const user = userEvent.setup();
    render(<HttpVersionComparisonView />);

    await user.click(await screen.findByRole("button", { name: "HTTP/2" }));
    await user.click(screen.getByRole("button", { name: "Uruchom symulację" }));

    expect(
      await screen.findByText("Twoja przewidywanie było trafne!", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Najszybsza była:/)).toBeInTheDocument();
  });

  it("flags an incorrect prediction once the fastest version finishes", async () => {
    mockedFetch.mockResolvedValue(TIMELINES);
    const user = userEvent.setup();
    render(<HttpVersionComparisonView />);

    await user.click(await screen.findByRole("button", { name: "HTTP/1.1" }));
    await user.click(screen.getByRole("button", { name: "Uruchom symulację" }));

    expect(
      await screen.findByText("Przewidziałeś HTTP/1.1 — tym razem nietrafnie.", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });
});
