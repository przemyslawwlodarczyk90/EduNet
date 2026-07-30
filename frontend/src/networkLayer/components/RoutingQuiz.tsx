import { useState } from "react";
import { log } from "../../lib/logger";

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
  {
    destinationIp: "10.0.5.7",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "10.0.0.0/8", prefixLength: 8, gateway: "10.0.0.1" },
      { network: "10.0.5.0/24", prefixLength: 24, gateway: "10.0.5.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "192.168.1.50",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "192.168.0.0/16", prefixLength: 16, gateway: "10.0.1.1" },
      { network: "192.168.1.0/25", prefixLength: 25, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "172.20.14.9",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "172.16.0.0/12", prefixLength: 12, gateway: "10.0.1.1" },
      { network: "172.20.0.0/16", prefixLength: 16, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "203.0.113.5",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "10.0.0.0/8", prefixLength: 8, gateway: "10.0.1.1" },
      { network: "172.16.0.0/12", prefixLength: 12, gateway: "10.0.2.1" },
    ],
    correctIndex: 0,
  },
  {
    destinationIp: "192.168.10.200",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "192.168.10.0/24", prefixLength: 24, gateway: "10.0.1.1" },
      { network: "192.168.10.128/25", prefixLength: 25, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "192.168.20.10",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "192.168.0.0/16", prefixLength: 16, gateway: "10.0.1.1" },
      { network: "192.168.20.0/24", prefixLength: 24, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "10.10.10.10",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "10.0.0.0/8", prefixLength: 8, gateway: "10.0.1.1" },
      { network: "10.10.0.0/16", prefixLength: 16, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "172.31.5.5",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "172.16.0.0/12", prefixLength: 12, gateway: "10.0.1.1" },
      { network: "172.31.0.0/16", prefixLength: 16, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "198.51.100.42",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "10.0.0.0/8", prefixLength: 8, gateway: "10.0.1.1" },
      { network: "172.16.0.0/12", prefixLength: 12, gateway: "10.0.2.1" },
    ],
    correctIndex: 0,
  },
  {
    destinationIp: "192.168.1.1",
    entries: [
      { network: "192.168.1.0/24", prefixLength: 24, gateway: "10.0.1.1" },
      { network: "192.168.1.0/25", prefixLength: 25, gateway: "10.0.2.1" },
      { network: "192.168.1.128/25", prefixLength: 25, gateway: "10.0.3.1" },
    ],
    correctIndex: 1,
  },
  {
    destinationIp: "192.168.1.200",
    entries: [
      { network: "192.168.1.0/24", prefixLength: 24, gateway: "10.0.1.1" },
      { network: "192.168.1.0/25", prefixLength: 25, gateway: "10.0.2.1" },
      { network: "192.168.1.128/25", prefixLength: 25, gateway: "10.0.3.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "10.1.2.3",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "10.0.0.0/8", prefixLength: 8, gateway: "10.0.1.1" },
      { network: "10.1.0.0/16", prefixLength: 16, gateway: "10.0.2.1" },
      { network: "10.1.2.0/24", prefixLength: 24, gateway: "10.0.3.1" },
    ],
    correctIndex: 3,
  },
  {
    destinationIp: "203.0.113.77",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "203.0.113.0/24", prefixLength: 24, gateway: "10.0.1.1" },
    ],
    correctIndex: 1,
  },
  {
    destinationIp: "192.0.2.255",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "192.0.2.0/24", prefixLength: 24, gateway: "10.0.1.1" },
      { network: "192.0.2.128/25", prefixLength: 25, gateway: "10.0.2.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "192.0.2.100",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "192.0.2.0/24", prefixLength: 24, gateway: "10.0.1.1" },
      { network: "192.0.2.128/25", prefixLength: 25, gateway: "10.0.2.1" },
    ],
    correctIndex: 1,
  },
  {
    destinationIp: "10.20.30.40",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "10.20.0.0/16", prefixLength: 16, gateway: "10.0.1.1" },
      { network: "10.20.30.0/24", prefixLength: 24, gateway: "10.0.2.1" },
      { network: "10.20.30.32/28", prefixLength: 28, gateway: "10.0.3.1" },
    ],
    correctIndex: 3,
  },
  {
    destinationIp: "10.20.30.50",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "10.20.0.0/16", prefixLength: 16, gateway: "10.0.1.1" },
      { network: "10.20.30.0/24", prefixLength: 24, gateway: "10.0.2.1" },
      { network: "10.20.30.32/28", prefixLength: 28, gateway: "10.0.3.1" },
    ],
    correctIndex: 2,
  },
  {
    destinationIp: "172.20.1.5",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "172.20.0.0/16", prefixLength: 16, gateway: "10.0.1.1" },
    ],
    correctIndex: 1,
  },
  {
    destinationIp: "8.8.4.4",
    entries: [
      { network: "0.0.0.0/0", prefixLength: 0, gateway: "192.168.1.254" },
      { network: "8.8.8.0/24", prefixLength: 24, gateway: "10.0.1.1" },
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
    log("quiz", `RoutingQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
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
