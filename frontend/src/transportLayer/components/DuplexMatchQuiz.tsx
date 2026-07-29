import { useEffect, useState } from "react";
import { fetchDuplexModes } from "../api";
import type { DuplexMode } from "../types";

interface Question {
  mode: DuplexMode;
  options: ["Full duplex", "Half duplex"];
  correctIndex: number;
}

function buildQuestion(modes: DuplexMode[]): Question {
  const mode = modes[Math.floor(Math.random() * modes.length)];
  return { mode, options: ["Full duplex", "Half duplex"], correctIndex: mode.mode === "FULL" ? 0 : 1 };
}

export function DuplexMatchQuiz() {
  const [modes, setModes] = useState<DuplexMode[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchDuplexModes().then((data) => {
      setModes(data);
      setQuestion(buildQuestion(data));
    });
  }, []);

  if (!question) return null;

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setQuestion(buildQuestion(modes));
  };

  return (
    <div className="quiz">
      <h4>Quiz: full czy half duplex?</h4>
      <p>{question.mode.technology}</p>
      <div className="quiz-options">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          const className = selected !== null ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={option} className={className} onClick={() => handleAnswer(i)} disabled={selected !== null}>
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="quiz-feedback">
          <p>
            {selected === question.correctIndex
              ? "Poprawnie!"
              : `Niepoprawnie — poprawna odpowiedź to ${question.options[question.correctIndex]}.`}
          </p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
