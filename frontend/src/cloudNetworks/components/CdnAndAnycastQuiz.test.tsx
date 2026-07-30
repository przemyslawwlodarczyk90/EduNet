import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CdnAndAnycastQuiz } from "./CdnAndAnycastQuiz";

beforeEach(() => {
  // Math.random() - 0.5 === 0 for every comparison keeps the shuffle a no-op,
  // so questions render in their declared order and the test stays deterministic.
  vi.spyOn(Math, "random").mockReturnValue(0.5);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CdnAndAnycastQuiz", () => {
  it("shows feedback and increments the score after a correct answer", async () => {
    const user = userEvent.setup();
    render(<CdnAndAnycastQuiz />);

    await user.click(
      screen.getByRole("button", {
        name: "Ruch jest kierowany do najbliższego geograficznie węzła — dokładnie tak, jak działa adresowanie anycast",
      }),
    );

    expect(await screen.findByText("Poprawnie!")).toBeInTheDocument();
    expect(screen.getByText("Wynik: 1 / 1")).toBeInTheDocument();
  });

  it("shows feedback without incrementing correct count after a wrong answer", async () => {
    const user = userEvent.setup();
    render(<CdnAndAnycastQuiz />);

    await user.click(screen.getByRole("button", { name: "CDN zawsze losuje serwer bez żadnej logiki" }));

    expect(await screen.findByText("Niepoprawnie.")).toBeInTheDocument();
    expect(screen.getByText("Wynik: 0 / 1")).toBeInTheDocument();
  });

  it("disables all options after answering and advances to the next question", async () => {
    const user = userEvent.setup();
    render(<CdnAndAnycastQuiz />);

    const firstOption = screen.getByRole("button", { name: "To błąd konfiguracji, który powinien zostać naprawiony" });
    await user.click(firstOption);
    expect(firstOption).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Następne pytanie" }));

    expect(
      screen.getByText("Który z poznanych wcześniej trybów adresowania najlepiej opisuje kierowanie użytkownika do najbliższego węzła CDN?"),
    ).toBeInTheDocument();
  });
});
