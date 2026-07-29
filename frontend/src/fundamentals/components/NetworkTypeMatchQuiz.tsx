import { useEffect, useState } from "react";
import { fetchNetworkTypes } from "../api";
import type { NetworkType } from "../types";

interface Question {
  type: NetworkType;
  options: NetworkType[];
}

function buildQuestion(types: NetworkType[]): Question {
  const type = types[Math.floor(Math.random() * types.length)];
  const distractors = types
    .filter((t) => t.id !== type.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [type, ...distractors].sort(() => Math.random() - 0.5);
  return { type, options };
}

export function NetworkTypeMatchQuiz() {
  const [types, setTypes] = useState<NetworkType[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchNetworkTypes().then((data) => {
      setTypes(data);
      setQuestion(buildQuestion(data));
    });
  }, []);

  if (!question) return null;

  const handleAnswer = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    setScore((s) => ({ correct: s.correct + (id === question.type.id ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelectedId(null);
    setQuestion(buildQuestion(types));
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj rodzaj sieci do scenariusza</h4>
      <p>
        Jaki to rodzaj sieci? — <em>{question.type.example}</em>
      </p>
      <div className="quiz-options">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.id === question.type.id;
          const className = selectedId ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={option.id} className={className} onClick={() => handleAnswer(option.id)} disabled={!!selectedId}>
              {option.id}
            </button>
          );
        })}
      </div>
      {selectedId && (
        <div className="quiz-feedback">
          <p>{selectedId === question.type.id ? "Poprawnie!" : `Niepoprawnie — poprawna odpowiedź to ${question.type.id}.`}</p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
