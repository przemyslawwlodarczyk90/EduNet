import { useState } from "react";
import { SimulatedTerminal } from "./SimulatedTerminal";

interface DiagnosisCase {
  symptom: string;
  expectedCommands: string[];
  explanation: string;
}

const CASES: DiagnosisCase[] = [
  {
    symptom:
      "Strona firma.pl nie chce się otworzyć, ale inne strony internetowe działają normalnie. Podejrzewasz problem z rozwiązywaniem nazwy domenowej.",
    expectedCommands: ["nslookup", "dig"],
    explanation: "nslookup/dig sprawdzają, na jaki adres IP wskazuje dana nazwa domenowa — to pierwszy krok przy podejrzeniu problemu z DNS.",
  },
  {
    symptom:
      "Podejrzewasz, że problem leży na jednym z routerów pomiędzy Tobą a serwerem 172.16.0.10 — chcesz zobaczyć każdy przeskok po drodze.",
    expectedCommands: ["traceroute", "tracert"],
    explanation: "traceroute/tracert pokazuje każdy router (przeskok) na trasie do celu wraz z czasem odpowiedzi.",
  },
  {
    symptom: "Chcesz sprawdzić, czy Twój komputer w ogóle ma poprawnie skonfigurowany adres IP i bramę domyślną.",
    expectedCommands: ["ipconfig", "ifconfig", "ip"],
    explanation: "ipconfig/ifconfig wyświetla lokalną konfigurację interfejsu sieciowego — adres IP, maskę i bramę domyślną.",
  },
];

export function DiagnoseWithTerminalExercise() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const diagnosisCase = CASES[caseIndex];

  const handleCommand = (command: string) => {
    if (feedback) return;
    const normalized = command.trim().toLowerCase();
    setFeedback(diagnosisCase.expectedCommands.includes(normalized) ? "correct" : "incorrect");
  };

  const next = () => {
    setFeedback(null);
    setCaseIndex((i) => (i + 1) % CASES.length);
  };

  return (
    <div className="diagnose-with-terminal-exercise">
      <p>
        <strong>Objaw:</strong> {diagnosisCase.symptom}
      </p>
      <SimulatedTerminal key={caseIndex} onCommandExecuted={handleCommand} />
      {feedback && (
        <div className="quiz-feedback">
          <p>{feedback === "correct" ? "Dobry wybór komendy!" : "To nie jest właściwa komenda do tego objawu."}</p>
          <p>{diagnosisCase.explanation}</p>
          <button onClick={next}>Następny przypadek</button>
        </div>
      )}
    </div>
  );
}
