import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question:
      "Dlaczego użytkownik z Europy i użytkownik z Azji, łączący się z tą samą usługą CDN, mogą trafić do zupełnie innych serwerów?",
    options: [
      "To błąd konfiguracji, który powinien zostać naprawiony",
      "Ruch jest kierowany do najbliższego geograficznie węzła — dokładnie tak, jak działa adresowanie anycast",
      "CDN zawsze losuje serwer bez żadnej logiki",
      "Każdy użytkownik ma przypisany na stałe jeden, ten sam serwer na całym świecie",
    ],
    correctIndex: 1,
    explanation:
      "To ten sam mechanizm, co adresowanie anycast poznane w warstwie sieciowej: transmisja trafia do najbliższego węzła oferującego tę samą usługę.",
  },
  {
    question: "Który z poznanych wcześniej trybów adresowania najlepiej opisuje kierowanie użytkownika do najbliższego węzła CDN?",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
    explanation: "Anycast: transmisja trafia do najbliższego węzła oferującego tę samą usługę — dokładnie to robi CDN.",
  },
  {
    question: "Czy CDN routing (do najbliższego węzła) i load balancing (rozdzielanie ruchu między serwery) to ten sam mechanizm?",
    options: [
      "Tak, to dokładnie to samo",
      "Nie — to różne mechanizmy o podobnym celu: CDN skraca drogę do treści, load balancing rozkłada obciążenie między serwery wykonujące tę samą pracę",
      "Load balancing dotyczy tylko jednego serwera, więc nie ma sensu porównania",
      "CDN nie ma nic wspólnego z rozkładaniem ruchu",
    ],
    correctIndex: 1,
    explanation:
      "CDN odpowiada na pytanie \"z którego GEOGRAFICZNEGO węzła obsłużyć użytkownika\", a load balancing na pytanie \"który z serwerów W TYM SAMYM miejscu ma obsłużyć kolejne żądanie\" — cele są podobne (wydajność, niezawodność), ale to inne warstwy problemu.",
  },
  {
    question: "Dlaczego światowe systemy DNS (np. publiczne resolvery) też często wykorzystują anycast?",
    options: [
      "Żeby użytkownik zawsze łączył się z najbliższym geograficznie serwerem DNS, skracając czas odpowiedzi",
      "Żeby ukryć prawdziwy adres IP serwera DNS",
      "Żeby wymusić szyfrowanie zapytań DNS",
      "DNS nigdy nie wykorzystuje anycast",
    ],
    correctIndex: 0,
    explanation:
      "Tak jak w CDN, anycast pozwala setkom serwerów DNS na całym świecie dzielić jeden adres IP — użytkownik zawsze trafia do najbliższego z nich.",
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function CdnAndAnycastQuiz() {
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
      <h4>Quiz koncepcyjny: CDN, load balancing i anycast</h4>
      <p>{question.question}</p>
      <div className="quiz-options detective-options">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
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
          <p>{selected === question.correctIndex ? "Poprawnie!" : "Niepoprawnie."}</p>
          <p>{question.explanation}</p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
