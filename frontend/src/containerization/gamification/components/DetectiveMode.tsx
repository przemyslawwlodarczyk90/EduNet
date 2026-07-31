import { useState } from "react";
import type { DetectiveCase } from "../types";

interface DetectiveModeProps {
  title: string;
  cases: DetectiveCase[];
}

export function DetectiveMode({ title, cases }: DetectiveModeProps) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const detectiveCase = cases[caseIndex];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const next = () => {
    setSelected(null);
    setCaseIndex((i) => (i + 1) % cases.length);
  };

  return (
    <div className="network-detective-mode">
      <h4>{title}</h4>
      <p className="detective-case-title">{detectiveCase.title}</p>
      <table className="headers-table">
        <tbody>
          {detectiveCase.facts.map((fact) => (
            <tr key={fact.label}>
              <td>{fact.label}</td>
              <td>{fact.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Objaw:</strong> {detectiveCase.symptom}
      </p>
      <div className="quiz-options detective-options">
        {detectiveCase.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === detectiveCase.correctIndex;
          const className = selected !== null ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={i} className={className} onClick={() => handleAnswer(i)} disabled={selected !== null}>
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="quiz-feedback">
          <p>{selected === detectiveCase.correctIndex ? "Trafna diagnoza!" : "Niepoprawna diagnoza."}</p>
          <p>{detectiveCase.explanation}</p>
          <button onClick={next}>Następny przypadek</button>
        </div>
      )}
    </div>
  );
}
