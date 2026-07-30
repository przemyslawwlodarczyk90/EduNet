import { useEffect, useState } from "react";
import { fetchEncryptionTypes } from "../api";
import type { EncryptionType } from "../types";
import { log } from "../../lib/logger";

interface Question {
  type: EncryptionType;
  options: EncryptionType[];
}

function buildQuestion(types: EncryptionType[]): Question {
  const type = types[Math.floor(Math.random() * types.length)];
  const distractors = types.filter((t) => t.id !== type.id);
  const options = [type, ...distractors].sort(() => Math.random() - 0.5);
  return { type, options };
}

export function EncryptionTypeMatchQuiz() {
  const [types, setTypes] = useState<EncryptionType[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchEncryptionTypes().then((data) => {
      setTypes(data);
      setQuestion(buildQuestion(data));
    });
  }, []);

  if (!question) return null;

  const handleAnswer = (id: string) => {
    if (selectedId) return;
    log("quiz", `EncryptionTypeMatchQuiz: ${id === question.type.id ? "poprawna" : "błędna"} odpowiedź (${id})`);
    setSelectedId(id);
    setScore((s) => ({ correct: s.correct + (id === question.type.id ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelectedId(null);
    setQuestion(buildQuestion(types));
  };

  return (
    <div className="quiz">
      <h4>Quiz: symetryczne czy asymetryczne?</h4>
      <p>{question.type.description}</p>
      <div className="quiz-options">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.id === question.type.id;
          const className = selectedId ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={option.id} className={className} onClick={() => handleAnswer(option.id)} disabled={!!selectedId}>
              {option.name}
            </button>
          );
        })}
      </div>
      {selectedId && (
        <div className="quiz-feedback">
          <p>{selectedId === question.type.id ? "Poprawnie!" : `Niepoprawnie — poprawna odpowiedź to ${question.type.name}.`}</p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
