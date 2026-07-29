import { useState } from "react";

interface RoutingQuizQuestion {
  destinationIp: string;
  entries: { network: string; prefixLength: number; gateway: string }[];
  correctIndex: number;
}

const QUESTIONS: RoutingQuizQuestion[] = [
  {
    destinationIp: "172.16.5.20",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "10.0.0.254" },
      { network: "172.16.0.0/16", prefixLength: 16, gateway: "10.0.1.1" },
      { network: "172.16.5.0/24", prefixLength: 24, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "8.8.8.8",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "10.0.0.254" },
      { network: "192.168.0.0/16", prefixLength: 16, gateway: "10.0.1.1" },
    ],
    correctIndex: 0,
  },
];

export function RoutingQuiz() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[questionIndex];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setQuestionIndex((i) => (i + 1) % QUESTIONS.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: który wpis tabeli routingu zostanie użyty?</h4>
      <p>
        Adres docelowy: <strong>{question.destinationIp}</strong>
      </p>
      <table className="headers-table">
        <thead>
          <tr>
            <th>Sieć docelowa</th>
            <th>Brama</th>
            <th>Wybór</th>
          </tr>
        </thead>
        <tbody>
          {question.entries.map((entry, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correctIndex;
            const className = selected !== null ? (isCorrect ? "routing-entry-used" : isSelected ? "incorrect-input" : "") : "";
            return (
              <tr key={i} className={className}>
                <td>{entry.network}</td>
                <td>{entry.gateway}</td>
                <td>
                  <button onClick={() => handleAnswer(i)} disabled={selected !== null}>
                    Wybierz
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {selected !== null && (
        <div className="quiz-feedback">
          <p>
            {selected === question.correctIndex
              ? "Poprawnie! To najbardziej szczegółowy pasujący wpis (longest prefix match)."
              : `Niepoprawnie — poprawny wpis to ${question.entries[question.correctIndex].network}.`}
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
