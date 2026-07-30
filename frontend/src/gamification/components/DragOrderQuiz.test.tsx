import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DragOrderQuiz } from "./DragOrderQuiz";
import type { OrderQuizItem } from "../types";

const ITEMS: OrderQuizItem[] = [
  { id: "first", label: "Pierwszy krok" },
  { id: "second", label: "Drugi krok" },
  { id: "third", label: "Trzeci krok" },
];

beforeEach(() => {
  // DragOrderQuiz uses a Fisher-Yates shuffle: for each i, j = floor(random * (i+1)).
  // A value just under 1 makes j === i for every i >= 1, so every "swap" is a no-op
  // and items render in the given (correct) order — 0.5 would NOT do this here (that
  // trick only works for the sort-based `.sort(() => Math.random() - 0.5)` shuffle
  // used elsewhere, e.g. CdnAndAnycastQuiz).
  vi.spyOn(Math, "random").mockReturnValue(0.9999999);
});

afterEach(() => {
  vi.restoreAllMocks();
});

function itemLabels() {
  return screen.getAllByRole("listitem").map((li) => li.textContent);
}

describe("DragOrderQuiz", () => {
  it("renders items in order and confirms a correct arrangement on check", async () => {
    const user = userEvent.setup();
    render(<DragOrderQuiz title="Ułóż kroki" items={ITEMS} />);

    expect(itemLabels()).toEqual(["1. Pierwszy krok", "2. Drugi krok", "3. Trzeci krok"]);

    await user.click(screen.getByRole("button", { name: "Sprawdź" }));

    expect(await screen.findByText("Poprawna kolejność!")).toBeInTheDocument();
  });

  it("dragging an item to a new position changes the order and is detected as incorrect", async () => {
    const user = userEvent.setup();
    render(<DragOrderQuiz title="Ułóż kroki" items={ITEMS} />);

    const listItems = screen.getAllByRole("listitem");
    fireEvent.dragStart(listItems[0]);
    fireEvent.dragOver(listItems[2]);
    fireEvent.drop(listItems[2]);

    expect(itemLabels()).toEqual(["1. Drugi krok", "2. Trzeci krok", "3. Pierwszy krok"]);

    await user.click(screen.getByRole("button", { name: "Sprawdź" }));

    expect(await screen.findByText("Niepoprawna kolejność — spróbuj ponownie.")).toBeInTheDocument();
  });

  it("reshuffling clears the previous feedback", async () => {
    const user = userEvent.setup();
    render(<DragOrderQuiz title="Ułóż kroki" items={ITEMS} />);

    await user.click(screen.getByRole("button", { name: "Sprawdź" }));
    expect(await screen.findByText("Poprawna kolejność!")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Przetasuj" }));

    expect(screen.queryByText("Poprawna kolejność!")).not.toBeInTheDocument();
  });
});
