import { useState } from "react";

interface Question {
  osiLayer: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { osiLayer: "Warstwa fizyczna", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Warstwa łącza danych", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Warstwa sieciowa", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Warstwa transportowa", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Warstwa sesji", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Warstwa prezentacji", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Warstwa aplikacji", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function OsiToTcpIpMatchQuiz() {
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
      <h4>Quiz: dopasuj warstwę OSI do odpowiednika w TCP/IP</h4>
      <p>{question.osiLayer}</p>
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
