import { useEffect, useState } from "react";
import { fetchArpTablePackets, validateArpTable } from "../api";
import type { ArpCapturedPacket, ArpTableValidationResult } from "../types";

export function BuildArpTableExercise() {
  const [packets, setPackets] = useState<ArpCapturedPacket[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ArpTableValidationResult | null>(null);

  useEffect(() => {
    fetchArpTablePackets().then(setPackets);
  }, []);

  const uniqueIps = Array.from(new Set(packets.map((p) => p.senderIp)));

  const handleSubmit = async () => {
    const validation = await validateArpTable(answers);
    setResult(validation);
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="build-arp-table-exercise">
      <h4>Ćwiczenie: zbuduj tablicę ARP na podstawie przechwyconych pakietów</h4>
      <table className="headers-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Typ</th>
            <th>Nadawca (IP)</th>
            <th>Nadawca (MAC)</th>
            <th>Cel (IP)</th>
          </tr>
        </thead>
        <tbody>
          {packets.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.type === "REQUEST" ? "Żądanie" : "Odpowiedź"}</td>
              <td>{p.senderIp}</td>
              <td>{p.senderMac}</td>
              <td>{p.targetIp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="headers-table">
        <thead>
          <tr>
            <th>Adres IP</th>
            <th>Twój adres MAC</th>
          </tr>
        </thead>
        <tbody>
          {uniqueIps.map((ip) => {
            const mismatch = result && result.mismatches.includes(ip);
            const ok = result && !mismatch;
            return (
              <tr key={ip}>
                <td>{ip}</td>
                <td>
                  <input
                    type="text"
                    value={answers[ip] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [ip]: e.target.value }))}
                    className={result ? (ok ? "correct-input" : "incorrect-input") : ""}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="scenario-controls">
        <button onClick={handleSubmit}>Sprawdź</button>
        <button onClick={reset}>Wyczyść</button>
      </div>

      {result && (
        <p className={result.correct ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}>
          {result.correct
            ? "Poprawnie! Tablica ARP zbudowana prawidłowo."
            : `Niepoprawne lub brakujące wpisy: ${result.mismatches.join(", ")}.`}
        </p>
      )}
    </div>
  );
}
