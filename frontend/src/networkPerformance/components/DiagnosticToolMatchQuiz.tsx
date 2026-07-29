import { useState } from "react";

interface Question {
  symptom: string;
  options: string[];
  correctIndex: number;
}

const COMMANDS = ["ping", "traceroute / tracert", "ipconfig / ifconfig", "nslookup / dig", "netstat", "arp -a"];

const QUESTIONS: Question[] = [
  { symptom: "Chcesz sprawdzić, czy zdalny host w ogóle odpowiada i ile trwa komunikacja w obie strony.", options: COMMANDS, correctIndex: 0 },
  { symptom: "Chcesz zobaczyć, przez które routery przechodzi pakiet, zanim dotrze do celu.", options: COMMANDS, correctIndex: 1 },
  { symptom: "Chcesz sprawdzić własny adres IP, maskę podsieci i bramę domyślną przypisane do karty sieciowej.", options: COMMANDS, correctIndex: 2 },
  { symptom: "Chcesz sprawdzić, na jaki adres IP wskazuje dana nazwa domenowa.", options: COMMANDS, correctIndex: 3 },
  { symptom: "Chcesz zobaczyć listę aktywnych połączeń sieciowych i nasłuchujących portów na komputerze.", options: COMMANDS, correctIndex: 4 },
  { symptom: "Chcesz sprawdzić, jaki adres MAC odpowiada danemu adresowi IP w lokalnej sieci.", options: COMMANDS, correctIndex: 5 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function DiagnosticToolMatchQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: która komenda odpowie na ten objaw?</h4>
      <p>{question.symptom}</p>
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
        <div className="quiz-feedback">
          <p>
            {selected === question.correctIndex
              ? "Poprawnie!"
              : `Niepoprawnie — poprawna odpowiedź to: ${question.options[question.correctIndex]}`}
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
