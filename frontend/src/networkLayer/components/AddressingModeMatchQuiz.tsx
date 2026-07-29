import { useState } from "react";

interface Question {
  scenario: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  {
    scenario: "Wysyłasz e-mail do jednego konkretnego adresata.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Router wysyła zapytanie ARP do wszystkich urządzeń w sieci lokalnej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 1,
  },
  {
    scenario: "Serwer strumieniuje wideo tylko do urządzeń zapisanych do konkretnej grupy odbiorczej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Zapytanie DNS trafia do najbliższego geograficznie serwera spośród wielu identycznych serwerów.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
  },
];

function buildQuestionOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function AddressingModeMatchQuiz() {
  const [order] = useState(buildQuestionOrder);
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
      <h4>Quiz: dopasuj tryb adresowania do scenariusza</h4>
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
