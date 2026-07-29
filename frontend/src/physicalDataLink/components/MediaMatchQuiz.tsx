import { useEffect, useState } from "react";
import { fetchTransmissionMedia } from "../api";
import type { TransmissionMedium } from "../types";

interface Question {
  medium: TransmissionMedium;
  options: TransmissionMedium[];
}

function buildQuestion(media: TransmissionMedium[]): Question {
  const medium = media[Math.floor(Math.random() * media.length)];
  const distractors = media
    .filter((m) => m.id !== medium.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [medium, ...distractors].sort(() => Math.random() - 0.5);
  return { medium, options };
}

export function MediaMatchQuiz() {
  const [media, setMedia] = useState<TransmissionMedium[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchTransmissionMedia().then((data) => {
      setMedia(data);
      setQuestion(buildQuestion(data));
    });
  }, []);

  if (!question) return null;

  const handleAnswer = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    setScore((s) => ({ correct: s.correct + (id === question.medium.id ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelectedId(null);
    setQuestion(buildQuestion(media));
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj medium/standard do opisu</h4>
      <p>
        Co to za medium/standard? — <em>{question.medium.description}</em>
      </p>
      <div className="quiz-options">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.id === question.medium.id;
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
          <p>
            {selectedId === question.medium.id
              ? "Poprawnie!"
              : `Niepoprawnie — poprawna odpowiedź to ${question.medium.name}.`}
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
