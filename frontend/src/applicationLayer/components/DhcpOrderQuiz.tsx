import { useState } from "react";

interface Challenge {
  title: string;
  order: string[];
  labels: Record<string, string>;
}

const CHALLENGES: Challenge[] = [
  {
    title: "Quiz: ułóż kroki DORA (przeciągnij elementy)",
    order: ["DISCOVER", "OFFER", "REQUEST", "ACK"],
    labels: {
      DISCOVER: "Discover: klient szuka serwera DHCP",
      OFFER: "Offer: serwer proponuje adres IP",
      REQUEST: "Request: klient akceptuje propozycję",
      ACK: "Acknowledge: serwer potwierdza przypisanie",
    },
  },
  {
    title: "Quiz: ułóż kroki odnowienia dzierżawy DHCP (przeciągnij elementy)",
    order: ["T1-TIMER", "UNICAST-REQUEST", "SERVER-ACK", "T2-FALLBACK"],
    labels: {
      "T1-TIMER": "Mija połowa czasu dzierżawy (T1) — klient budzi się z timera odnowienia",
      "UNICAST-REQUEST": "Klient wysyła unicast DHCPREQUEST bezpośrednio do serwera, który przydzielił adres",
      "SERVER-ACK": "Serwer odpowiada DHCPACK, przedłużając dzierżawę bez ponownego Discover/Offer",
      "T2-FALLBACK": "Jeśli serwer nie odpowie do 87,5% czasu dzierżawy (T2), klient próbuje broadcastem do dowolnego serwera",
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

export function DhcpOrderQuiz() {
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
