import { useState } from "react";

interface DetectiveCase {
  hostA: { ip: string; mask: string };
  hostB: { ip: string; mask: string };
  symptom: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CASES: DetectiveCase[] = [
  {
    hostA: { ip: "192.168.1.10", mask: "255.255.255.0" },
    hostB: { ip: "192.168.1.130", mask: "255.255.255.128" },
    symptom: "Host A nie może nawiązać komunikacji z Host B, mimo że wydają się być w tej samej sieci.",
    options: [
      "Adresy IP są w różnych sieciach fizycznych",
      "Maski podsieci są niezgodne — Host B uznaje Host A za spoza swojej podsieci",
      "Adres IP Host B jest nieprawidłowy (spoza zakresu prywatnego)",
      "Obaj hosty mają identyczny adres IP",
    ],
    correctIndex: 1,
    explanation:
      "Host B z maską /25 dzieli 192.168.1.0/24 na dwie połowy i widzi Host A (.10) jako spoza swojej podsieci, więc próbuje wysłać ruch przez bramę zamiast bezpośrednio.",
  },
  {
    hostA: { ip: "10.0.0.5", mask: "255.255.255.0" },
    hostB: { ip: "10.0.1.5", mask: "255.255.255.0" },
    symptom: "Host A i Host B nie mogą się skomunikować bez routera pośredniczącego.",
    options: [
      "Oba hosty mają identyczną maskę /24, ale są w różnych sieciach (10.0.0.0/24 i 10.0.1.0/24)",
      "Maska podsieci jest nieprawidłowa dla obu hostów",
      "Adres IP Host A koliduje z adresem sieci",
      "Adres IP Host B jest adresem rozgłoszeniowym",
    ],
    correctIndex: 0,
    explanation: "10.0.0.0/24 i 10.0.1.0/24 to dwie odrębne sieci — komunikacja między nimi wymaga routera.",
  },
];

export function NetworkDetectiveMode() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const detectiveCase = CASES[caseIndex];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const next = () => {
    setSelected(null);
    setCaseIndex((i) => (i + 1) % CASES.length);
  };

  return (
    <div className="network-detective-mode">
      <h4>Tryb detektywa: dlaczego brak komunikacji?</h4>
      <table className="headers-table">
        <thead>
          <tr>
            <th />
            <th>Adres IP</th>
            <th>Maska</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Host A</td>
            <td>{detectiveCase.hostA.ip}</td>
            <td>{detectiveCase.hostA.mask}</td>
          </tr>
          <tr>
            <td>Host B</td>
            <td>{detectiveCase.hostB.ip}</td>
            <td>{detectiveCase.hostB.mask}</td>
          </tr>
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
