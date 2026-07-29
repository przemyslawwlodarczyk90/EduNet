import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  {
    question: "Który z poniższych elementów wiadomości jest typową cechą ostrzegawczą (phishing)?",
    options: [
      "Wiadomość podpisana Twoim pełnym imieniem i nazwiskiem",
      "\"Twoje konto zostanie zablokowane w ciągu 24 godzin\"",
      "Domena e-mail zgodna z oficjalną domeną nadawcy",
      "Brak jakichkolwiek linków w treści",
    ],
    correctIndex: 1,
  },
  {
    question: "Dlaczego rozbieżność między wyświetlaną nazwą nadawcy a domeną e-mail jest podejrzana?",
    options: [
      "Nie jest podejrzana — to normalne w każdej wiadomości",
      "Bo prawdziwe instytucje zawsze wysyłają wiadomości z własnej, oficjalnej domeny",
      "Bo wyświetlana nazwa nigdy nie ma znaczenia",
      "Bo tylko banki mają tego typu rozbieżności",
    ],
    correctIndex: 1,
  },
  {
    question: "Co powinno wzbudzić podejrzenia w treści linku w wiadomości e-mail?",
    options: [
      "Link prowadzi do strony z certyfikatem HTTPS",
      "Wyświetlany tekst linku różni się od rzeczywistego adresu docelowego",
      "Link jest napisany w tym samym kolorze co reszta tekstu",
      "Link znajduje się na końcu wiadomości",
    ],
    correctIndex: 1,
  },
  {
    question: "Czy poważna instytucja finansowa poprosi Cię o podanie hasła lub pełnego numeru karty przez e-mail?",
    options: [
      "Tak, to standardowa procedura weryfikacji",
      "Nie — żadna poważna instytucja nie prosi o takie dane e-mailem",
      "Tak, ale tylko w pilnych sprawach",
      "Zależy od banku",
    ],
    correctIndex: 1,
  },
  {
    question: "Ogólnikowe powitanie typu \"Szanowny Kliencie\" (zamiast Twojego imienia i nazwiska) jest:",
    options: [
      "Dowodem, że wiadomość na pewno jest bezpieczna",
      "Możliwą cechą ostrzegawczą — prawdziwa instytucja zwykle zna Twoje dane",
      "Standardem używanym wyłącznie przez banki",
      "Bez znaczenia dla oceny wiadomości",
    ],
    correctIndex: 1,
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function PhishingRedFlagsQuiz() {
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
      <h4>Quiz: rozpoznawanie cech podejrzanej wiadomości</h4>
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
