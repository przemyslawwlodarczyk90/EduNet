import { useState } from "react";

interface Question {
  feature: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { feature: "Multipleksowanie wielu żądań na jednym połączeniu TCP", options: ["HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"], correctIndex: 2 },
  { feature: "Działa na UDP (QUIC) zamiast TCP", options: ["HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"], correctIndex: 3 },
  { feature: "Wymaga nowego połączenia TCP na każde żądanie", options: ["HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"], correctIndex: 0 },
  { feature: "Wprowadza connection keep-alive, ale bez multipleksowania", options: ["HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"], correctIndex: 1 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function HttpVersionMatchQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj cechę do wersji HTTP</h4>
      <p>{question.feature}</p>
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
