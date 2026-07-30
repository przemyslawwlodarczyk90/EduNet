import { useEffect, useState } from "react";
import { fetchLearningPath } from "../api";
import type { LearningPathModule } from "../types";

const STORAGE_KEY = "edunet-learning-path-completed";

function loadCompleted(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(completed: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
}

interface LearningPathViewProps {
  onNavigate: (navView: string) => void;
}

export function LearningPathView({ onNavigate }: LearningPathViewProps) {
  const [modules, setModules] = useState<LearningPathModule[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompleted());

  useEffect(() => {
    fetchLearningPath().then(setModules);
  }, []);

  const markCompleted = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev).add(id);
      saveCompleted(next);
      return next;
    });
  };

  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div className="learning-path-view">
      <ul className="learning-path-list">
        {sorted.map((module, i) => {
          const isCompleted = completed.has(module.id);
          const isUnlocked = i === 0 || completed.has(sorted[i - 1].id);
          const status = isCompleted ? "Ukończony" : isUnlocked ? "Odblokowany" : "Zablokowany";
          return (
            <li key={module.id} className={`learning-path-item ${isUnlocked ? "unlocked" : "locked"}`}>
              <span className="learning-path-order">{module.order}.</span>
              <span className="learning-path-label">{module.label}</span>
              <span className="learning-path-status">{status}</span>
              <button disabled={!isUnlocked} onClick={() => onNavigate(module.navView)}>
                Przejdź do modułu
              </button>
              {isUnlocked && !isCompleted && (
                <button onClick={() => markCompleted(module.id)}>Oznacz jako ukończony</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
