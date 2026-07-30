import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuizFromCatalog } from "./QuizFromCatalog";
import { fetchQuiz, submitQuiz } from "../api";
import type { QuizResult, QuizView } from "../types";

vi.mock("../api", () => ({
  fetchQuiz: vi.fn(),
  submitQuiz: vi.fn(),
}));

const mockedFetchQuiz = vi.mocked(fetchQuiz);
const mockedSubmitQuiz = vi.mocked(submitQuiz);

const QUIZ: QuizView = {
  id: "sample-quiz",
  title: "Quiz próbny",
  moduleId: "sample-module",
  osiLayers: [],
  questions: [
    { id: "q1", prompt: "Pytanie pierwsze?", options: ["A", "B"] },
    { id: "q2", prompt: "Pytanie drugie?", options: ["C", "D"] },
  ],
};

const RESULT: QuizResult = {
  quizId: "sample-quiz",
  correct: 1,
  total: 2,
  correctness: [true, false],
  explanations: ["Bo tak.", "Bo inaczej."],
};

describe("QuizFromCatalog", () => {
  it("walks through every question then submits the collected answers and shows the score", async () => {
    mockedFetchQuiz.mockResolvedValue(QUIZ);
    mockedSubmitQuiz.mockResolvedValue(RESULT);
    const user = userEvent.setup();

    render(<QuizFromCatalog quizId="sample-quiz" />);

    expect(await screen.findByText("Pytanie pierwsze?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "A" }));

    expect(await screen.findByText("Pytanie drugie?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "D" }));

    expect(await screen.findByText("Wynik: 1 / 2")).toBeInTheDocument();
    expect(mockedSubmitQuiz).toHaveBeenCalledWith("sample-quiz", [0, 1]);
    expect(screen.getByText("Bo tak.")).toBeInTheDocument();
    expect(screen.getByText("Bo inaczej.")).toBeInTheDocument();
  });

  it("restarting after a result goes back to the first question without refetching the quiz", async () => {
    mockedFetchQuiz.mockResolvedValue(QUIZ);
    mockedSubmitQuiz.mockResolvedValue(RESULT);
    const user = userEvent.setup();

    render(<QuizFromCatalog quizId="sample-quiz" />);

    await user.click(await screen.findByRole("button", { name: "A" }));
    await user.click(await screen.findByRole("button", { name: "D" }));
    await screen.findByText("Wynik: 1 / 2");

    await user.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));

    expect(await screen.findByText("Pytanie pierwsze?")).toBeInTheDocument();
    expect(mockedFetchQuiz).toHaveBeenCalledTimes(1);
  });
});
