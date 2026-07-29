import { useEffect, useState } from "react";
import { fetchTopologies } from "../api";
import type { NetworkTopology } from "../types";

interface Question {
  topology: NetworkTopology;
  options: NetworkTopology[];
}

function buildQuestion(topologies: NetworkTopology[]): Question {
  const topology = topologies[Math.floor(Math.random() * topologies.length)];
  const distractors = topologies
    .filter((t) => t.id !== topology.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [topology, ...distractors].sort(() => Math.random() - 0.5);
  return { topology, options };
}

export function TopologyMatchQuiz() {
  const [topologies, setTopologies] = useState<NetworkTopology[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetchTopologies().then((data) => {
      setTopologies(data);
      setQuestion(buildQuestion(data));
    });
  }, []);

  if (!question) return null;

  const handleAnswer = (id: string) => {
    if (selectedId) return;
    setSelectedId(id);
    setScore((s) => ({ correct: s.correct + (id === question.topology.id ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelectedId(null);
    setQuestion(buildQuestion(topologies));
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj topologię do opisu</h4>
      <p>
        Która topologia: <em>{question.topology.failureBehaviorDescription}</em>
      </p>
      <div className="quiz-options">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.id === question.topology.id;
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
            {selectedId === question.topology.id
              ? "Poprawnie!"
              : `Niepoprawnie — poprawna odpowiedź to ${question.topology.name}.`}
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
