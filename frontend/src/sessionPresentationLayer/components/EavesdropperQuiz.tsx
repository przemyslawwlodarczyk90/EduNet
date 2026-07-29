import { useState } from "react";

interface Question {
  scenario: string;
  options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { scenario: "Administrator loguje się do routera przez Telnet.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Administrator loguje się do serwera przez SSH.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Użytkownik przegląda stronę przez HTTP (bez S).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Użytkownik przegląda stronę przez HTTPS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function EavesdropperQuiz() {
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
      <h4>Quiz: co widzi podsłuchujący?</h4>
      <p>{question.scenario}</p>
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
              : `Niepoprawnie — poprawna odpowiedź to "${question.options[question.correctIndex]}".`}
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
