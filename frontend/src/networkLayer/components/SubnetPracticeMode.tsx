import { useEffect, useState } from "react";
import { fetchRandomSubnetExercise, submitSubnetExercise } from "../api";
import type { SubnetExerciseQuestion, SubnetExerciseResult } from "../types";

const FIELDS: { key: keyof typeof EMPTY_ANSWERS; label: string }[] = [
  { key: "networkAddress", label: "Adres sieci" },
  { key: "broadcastAddress", label: "Adres rozgłoszeniowy" },
  { key: "firstUsableHost", label: "Pierwszy host" },
  { key: "lastUsableHost", label: "Ostatni host" },
  { key: "usableHostCount", label: "Liczba hostów" },
];

const EMPTY_ANSWERS = {
  networkAddress: "",
  broadcastAddress: "",
  firstUsableHost: "",
  lastUsableHost: "",
  usableHostCount: "",
};

export function SubnetPracticeMode() {
  const [difficulty, setDifficulty] = useState(1);
  const [question, setQuestion] = useState<SubnetExerciseQuestion | null>(null);
  const [answers, setAnswers] = useState({ ...EMPTY_ANSWERS });
  const [result, setResult] = useState<SubnetExerciseResult | null>(null);

  const loadQuestion = (level: number) => {
    fetchRandomSubnetExercise(level).then((q) => {
      setQuestion(q);
      setAnswers({ ...EMPTY_ANSWERS });
      setResult(null);
    });
  };

  useEffect(() => {
    loadQuestion(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!question) return;
    const submission = {
      ip: question.ip,
      prefixLength: question.prefixLength,
      networkAddress: answers.networkAddress,
      broadcastAddress: answers.broadcastAddress,
      firstUsableHost: answers.firstUsableHost,
      lastUsableHost: answers.lastUsableHost,
      usableHostCount: Number(answers.usableHostCount),
    };
    const validation = await submitSubnetExercise(submission);
    setResult(validation);
  };

  return (
    <div className="subnet-practice-mode">
      <div className="mode-toggle">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            className={level === difficulty ? "active" : ""}
            onClick={() => {
              setDifficulty(level);
              loadQuestion(level);
            }}
          >
            Poziom {level}
          </button>
        ))}
      </div>
      {question && (
        <p>
          Oblicz parametry sieci dla <strong>{question.ip}/{question.prefixLength}</strong>
        </p>
      )}
      <table className="headers-table">
        <tbody>
          {FIELDS.map((field) => {
            const mismatch = result?.mismatches.includes(field.key);
            const ok = result && !mismatch;
            return (
              <tr key={field.key}>
                <td>{field.label}</td>
                <td>
                  <input
                    aria-label={field.label}
                    value={answers[field.key]}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className={result ? (ok ? "correct-input" : "incorrect-input") : ""}
                  />
                </td>
                {result && <td>{ok ? "✓" : `poprawnie: ${String(result.expected[field.key as keyof typeof result.expected])}`}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="scenario-controls">
        <button onClick={handleSubmit}>Sprawdź</button>
        <button onClick={() => loadQuestion(difficulty)}>Nowe zadanie</button>
      </div>
      {result && (
        <p className={result.correct ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}>
          {result.correct ? "Wszystko poprawnie!" : "Sprawdź podświetlone pola powyżej."}
        </p>
      )}
    </div>
  );
}
