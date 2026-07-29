import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question: "Dlaczego TCP/IP traktuje sesję, prezentację i aplikację jako JEDNĄ warstwę, a nie trzy osobne jak OSI?",
    options: [
      "Bo te trzy warstwy OSI są dokładnie tym samym mechanizmem, tylko zduplikowanym",
      "Bo w praktyce programiści aplikacji sieciowych piszą kod, który obsługuje te funkcje łącznie, a nie jako oddzielne, niezależne etapy",
      "Bo warstwy sesji i prezentacji w ogóle nie istnieją w rzeczywistych sieciach",
      "Bo model TCP/IP jest starszy i nie zdążono ich rozdzielić",
    ],
    correctIndex: 1,
    explanation:
      "TCP/IP powstał jako model praktyczny, opisujący to, co faktycznie robią programy i protokoły — a te (np. HTTP, TLS, zarządzanie sesją) w praktyce są zaimplementowane razem, na poziomie aplikacji, bez wyraźnego rozdzielenia na trzy osobne etapy.",
  },
  {
    question: "Czy to uproszczenie oznacza, że funkcje sesji i prezentacji (np. TLS, cookies) znikają w TCP/IP?",
    options: [
      "Tak, TCP/IP nie obsługuje szyfrowania ani sesji",
      "Nie — te same mechanizmy nadal istnieją i działają, po prostu model TCP/IP nie nazywa ich osobnymi warstwami",
      "Tak, ale tylko dla protokołów UDP",
      "Nie, ale tylko w IPv6",
    ],
    correctIndex: 1,
    explanation:
      "Mechanizmy (szyfrowanie TLS, identyfikator sesji) działają identycznie niezależnie od tego, którym modelem je opisujemy — różni się tylko sposób ICH KATEGORYZACJI w warstwach.",
  },
];

export function WhyOneLayerQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const question = QUESTIONS[index];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
  };

  const next = () => {
    setSelected(null);
    setIndex((i) => (i + 1) % QUESTIONS.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz koncepcyjny: dlaczego to jedna warstwa, a nie trzy?</h4>
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
    </div>
  );
}
