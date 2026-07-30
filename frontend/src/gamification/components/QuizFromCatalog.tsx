import { useEffect, useState } from "react";
import { fetchQuiz, submitQuiz } from "../api";
import type { QuizResult, QuizView } from "../types";

interface QuizFromCatalogProps {
  quizId: string;
}

export function QuizFromCatalog({ quizId }: QuizFromCatalogProps) {
  const [quiz, setQuiz] = useState<QuizView | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    fetchQuiz(quizId).then(setQuiz);
  }, [quizId]);

  if (!quiz) return <p>Wczytywanie quizu…</p>;

  const restart = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setResult(null);
  };

  const selectAnswer = async (optionIndex: number) => {
    const nextAnswers = [...answers, optionIndex];
    setAnswers(nextAnswers);

    if (questionIndex + 1 < quiz.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const submitted = await submitQuiz(quiz.id, nextAnswers);
      setResult(submitted);
    }
  };

  if (result) {
    return (
      <div className="quiz">
        <h4>{quiz.title}</h4>
        <p className="quiz-score">
          Wynik: {result.correct} / {result.total}
        </p>
        <ul className="quiz-review-list">
          {quiz.questions.map((question, i) => (
            <li key={question.id} className={result.correctness[i] ? "correct" : "incorrect"}>
              <strong>{question.prompt}</strong>
              <br />
              {result.explanations[i]}
            </li>
          ))}
        </ul>
        <button onClick={restart}>Spróbuj ponownie</button>
      </div>
    );
  }

  const question = quiz.questions[questionIndex];

  return (
    <div className="quiz">
      <h4>{quiz.title}</h4>
      <p className="quiz-progress">
        Pytanie {questionIndex + 1} / {quiz.questions.length}
      </p>
      <p>{question.prompt}</p>
      <div className="quiz-options detective-options">
        {question.options.map((option, i) => (
          <button key={i} onClick={() => selectAnswer(i)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
