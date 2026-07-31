import { useEffect, useState } from "react";
import { fetchContainerOrderQuizzes } from "../api";
import type { OrderQuiz } from "../types";
import { DragOrderQuiz } from "./DragOrderQuiz";

export function OrderQuizBankView() {
  const [quizzes, setQuizzes] = useState<OrderQuiz[] | null>(null);

  useEffect(() => {
    fetchContainerOrderQuizzes().then(setQuizzes);
  }, []);

  if (!quizzes) return <p>Wczytywanie quizów porządkowych…</p>;

  return (
    <div className="order-quiz-bank">
      {quizzes.map((quiz) => (
        <DragOrderQuiz key={quiz.id} title={quiz.title} items={quiz.correctOrder} />
      ))}
    </div>
  );
}
