import { useState } from "react";

const CORRECT_ORDER = ["DISCOVER", "OFFER", "REQUEST", "ACK"];
const LABELS: Record<string, string> = {
  DISCOVER: "Discover: klient szuka serwera DHCP",
  OFFER: "Offer: serwer proponuje adres IP",
  REQUEST: "Request: klient akceptuje propozycję",
  ACK: "Acknowledge: serwer potwierdza przypisanie",
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function DhcpOrderQuiz() {
  const [items, setItems] = useState<string[]>(() => shuffle(CORRECT_ORDER));
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

  const isCorrect = items.every((item, i) => item === CORRECT_ORDER[i]);

  return (
    <div className="quiz">
      <h4>Quiz: ułóż kroki DORA (przeciągnij elementy)</h4>
      <ul className="drag-order-list">
        {items.map((item, i) => (
          <li
            key={item}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className={checked ? (item === CORRECT_ORDER[i] ? "correct" : "incorrect") : ""}
          >
            {i + 1}. {LABELS[item]}
          </li>
        ))}
      </ul>
      <div className="scenario-controls">
        <button onClick={() => setChecked(true)}>Sprawdź</button>
        <button
          onClick={() => {
            setItems(shuffle(CORRECT_ORDER));
            setChecked(false);
          }}
        >
          Przetasuj
        </button>
      </div>
      {checked && (
        <p className={isCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}>
          {isCorrect ? "Poprawna kolejność!" : "Niepoprawna kolejność — spróbuj ponownie."}
        </p>
      )}
    </div>
  );
}
