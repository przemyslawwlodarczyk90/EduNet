import { useState } from "react";
import type { OrderQuizItem } from "../types";

interface DragOrderQuizProps {
  title: string;
  items: OrderQuizItem[];
}

function shuffle<T>(input: T[]): T[] {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function DragOrderQuiz({ title, items }: DragOrderQuizProps) {
  const [order, setOrder] = useState<OrderQuizItem[]>(() => shuffle(items));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null) return;
    setOrder((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
    setDragIndex(null);
    setChecked(false);
  };

  const isCorrect = order.every((item, i) => item.id === items[i].id);

  return (
    <div className="quiz">
      <h4>{title} (przeciągnij elementy)</h4>
      <ul className="drag-order-list">
        {order.map((item, i) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className={checked ? (item.id === items[i].id ? "correct" : "incorrect") : ""}
          >
            {i + 1}. {item.label}
          </li>
        ))}
      </ul>
      <div className="scenario-controls">
        <button onClick={() => setChecked(true)}>Sprawdź</button>
        <button
          onClick={() => {
            setOrder(shuffle(items));
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
