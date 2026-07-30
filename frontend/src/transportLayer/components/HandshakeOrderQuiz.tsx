import { useState } from "react";

interface Challenge {
  title: string;
  order: string[];
  labels: Record<string, string>;
}

const CHALLENGES: Challenge[] = [
  {
    title: "Quiz: ułóż kolejność handshake'u TCP (przeciągnij elementy)",
    order: ["SYN", "SYN-ACK", "ACK"],
    labels: {
      SYN: "Klient → Serwer: SYN",
      "SYN-ACK": "Serwer → Klient: SYN-ACK",
      ACK: "Klient → Serwer: ACK",
    },
  },
  {
    title: "Quiz: ułóż kolejność zamykania połączenia TCP (przeciągnij elementy)",
    order: ["FIN-1", "ACK-1", "FIN-2", "ACK-2"],
    labels: {
      "FIN-1": "Klient → Serwer: FIN (klient kończy wysyłanie)",
      "ACK-1": "Serwer → Klient: ACK (potwierdzenie FIN klienta)",
      "FIN-2": "Serwer → Klient: FIN (serwer też kończy wysyłanie)",
      "ACK-2": "Klient → Serwer: ACK (potwierdzenie FIN serwera, połączenie zamknięte)",
    },
  },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickChallengeIndex(): number {
  return Math.floor(Math.random() * CHALLENGES.length);
}

export function HandshakeOrderQuiz() {
  const [challengeIndex, setChallengeIndex] = useState(pickChallengeIndex);
  const challenge = CHALLENGES[challengeIndex];
  const [items, setItems] = useState<string[]>(() => shuffle(challenge.order));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null) return;
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
    setDragIndex(null);
    setChecked(false);
  };

  const isCorrect = items.every((item, i) => item === challenge.order[i]);

  const nextChallenge = () => {
    const nextIndex = pickChallengeIndex();
    setChallengeIndex(nextIndex);
    setItems(shuffle(CHALLENGES[nextIndex].order));
    setChecked(false);
  };

  return (
    <div className="quiz">
      <h4>{challenge.title}</h4>
      <ul className="drag-order-list">
        {items.map((item, i) => (
          <li
            key={item}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className={checked ? (item === challenge.order[i] ? "correct" : "incorrect") : ""}
          >
            {i + 1}. {challenge.labels[item]}
          </li>
        ))}
      </ul>
      <div className="scenario-controls">
        <button onClick={() => setChecked(true)}>Sprawdź</button>
        <button
          onClick={() => {
            setItems(shuffle(challenge.order));
            setChecked(false);
          }}
        >
          Przetasuj
        </button>
        <button onClick={nextChallenge}>Inne zadanie</button>
      </div>
      {checked && (
        <p className={isCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}>
          {isCorrect ? "Poprawna kolejność!" : "Niepoprawna kolejność — spróbuj ponownie."}
        </p>
      )}
    </div>
  );
}
