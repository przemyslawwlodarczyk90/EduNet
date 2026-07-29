import { useState } from "react";

interface Question {
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    scenario: "System wykrył podejrzany pakiet, wygenerował alarm dla administratora, ale przepuścił pakiet dalej.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "IDS (Intrusion Detection System) tylko wykrywa i informuje — nigdy sam nie blokuje ruchu.",
  },
  {
    scenario: "System wykrył podejrzany pakiet i natychmiast go odrzucił, zanim dotarł do celu.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "IPS (Intrusion Prevention System) aktywnie reaguje — blokuje ruch, a nie tylko go zgłasza.",
  },
  {
    scenario: "Administrator dostał powiadomienie o ataku, ale ruch nadal dotarł do serwera i musiał zareagować ręcznie.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Brak automatycznej blokady, tylko powiadomienie — to zachowanie typowe dla IDS.",
  },
  {
    scenario: "Atak sieciowy został zablokowany automatycznie, bez udziału administratora, w czasie rzeczywistym.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Automatyczna, natychmiastowa blokada bez interwencji człowieka to cecha IPS.",
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function IdsVsIpsQuiz() {
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
      <h4>Quiz: czy tak zareagowałby IDS czy IPS?</h4>
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
          <p>{selected === question.correctIndex ? "Poprawnie!" : "Niepoprawnie."}</p>
          <p>{question.explanation}</p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
