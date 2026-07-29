import { useState } from "react";

interface Question {
  scenario: string;
  options: ["TCP", "UDP"];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { scenario: "Pobieranie pliku, gdzie każdy bajt musi dotrzeć bezbłędnie.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Gra online, gdzie liczy się jak najniższe opóźnienie, a pojedyncza utracona klatka nie jest krytyczna.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Wysyłanie e-maila.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Zapytanie DNS o adres IP domeny.", options: ["TCP", "UDP"], correctIndex: 1 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function ProtocolUseCaseQuiz() {
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
      <h4>Quiz: dopasuj protokół do zastosowania</h4>
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
