import { useEffect, useState } from "react";
import { fetchProtocolPorts } from "../api";
import type { ProtocolPort } from "../types";

interface Question {
  protocol: ProtocolPort;
  options: number[];
}

function buildQuestion(ports: ProtocolPort[]): Question {
  const protocol = ports[Math.floor(Math.random() * ports.length)];
  const distractors = ports
    .filter((p) => p.port !== protocol.port)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((p) => p.port);
  const options = [protocol.port, ...distractors].sort(() => Math.random() - 0.5);
  return { protocol, options };
}

export function ProtocolPortQuiz() {
  const [ports, setPorts] = useState<ProtocolPort[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchProtocolPorts().then((data) => {
      setPorts(data);
      setQuestion(buildQuestion(data));
    });
  }, []);

  if (!question) return null;

  const handleAnswer = (port: number) => {
    if (selected !== null) return;
    setSelected(port);
    setScore((s) => ({ correct: s.correct + (port === question.protocol.port ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setQuestion(buildQuestion(ports));
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj protokół do domyślnego portu</h4>
      <p>Jaki domyślny port używa: {question.protocol.protocol}?</p>
      <div className="quiz-options">
        {question.options.map((port) => {
          const isSelected = selected === port;
          const isCorrect = port === question.protocol.port;
          const className = selected !== null ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={port} className={className} onClick={() => handleAnswer(port)} disabled={selected !== null}>
              {port}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="quiz-feedback">
          <p>
            {selected === question.protocol.port
              ? "Poprawnie!"
              : `Niepoprawnie — poprawny port to ${question.protocol.port}.`}
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
