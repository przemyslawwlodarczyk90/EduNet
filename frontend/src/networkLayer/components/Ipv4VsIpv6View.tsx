import { useState } from "react";

const FACTS: { aspect: string; ipv4: string; ipv6: string }[] = [
  { aspect: "Długość adresu", ipv4: "32 bity", ipv6: "128 bitów" },
  { aspect: "Pula adresów", ipv4: "~4.3 miliarda", ipv6: "praktycznie nieograniczona" },
  { aspect: "Zapis", ipv4: "kropkowo-dziesiętny, np. 192.168.1.1", ipv6: "szesnastkowy z dwukropkami, np. 2001:0db8::1" },
  { aspect: "NAT", ipv4: "powszechny, z powodu niedoboru adresów", ipv6: "niepotrzebny — adresów wystarcza dla każdego urządzenia" },
];

const QUESTIONS = [
  { question: "Ile bitów ma adres IPv6?", options: ["32", "64", "128"], correctIndex: 2 },
  { question: "Dlaczego NAT jest tak powszechny w IPv4?", options: ["Ze względów bezpieczeństwa", "Z powodu niedoboru dostępnych adresów", "Bo tego wymaga protokół TCP"], correctIndex: 1 },
];

export function Ipv4VsIpv6View() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const question = QUESTIONS[questionIndex];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  return (
    <div className="ipv4-vs-ipv6-view">
      <table className="headers-table">
        <thead>
          <tr>
            <th />
            <th>IPv4</th>
            <th>IPv6</th>
          </tr>
        </thead>
        <tbody>
          {FACTS.map((fact) => (
            <tr key={fact.aspect}>
              <td>{fact.aspect}</td>
              <td>{fact.ipv4}</td>
              <td>{fact.ipv6}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="quiz">
        <h4>Krótki quiz</h4>
        <p>{question.question}</p>
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
          <button
            onClick={() => {
              setSelected(null);
              setQuestionIndex((i) => (i + 1) % QUESTIONS.length);
            }}
          >
            Następne pytanie
          </button>
        )}
      </div>
    </div>
  );
}
