import { useEffect, useRef, useState } from "react";
import { useScenarioSession } from "../simulationStore";
import { pauseScenario, rewindScenario, stepScenario } from "../scenarioClient";

const AUTO_STEP_INTERVAL_MS = 1200;

interface ScenarioControlsProps {
  sessionId: string;
}

export function ScenarioControls({ sessionId }: ScenarioControlsProps) {
  const { error } = useScenarioSession(sessionId);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (error) {
      setIsPlaying(false);
    }
  }, [error]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => stepScenario(sessionId), AUTO_STEP_INTERVAL_MS);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, sessionId]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseScenario(sessionId);
    }
    setIsPlaying((value) => !value);
  };

  return (
    <div className="scenario-controls">
      <button onClick={togglePlay}>{isPlaying ? "⏸ Pauza" : "▶ Odtwórz"}</button>
      <button onClick={() => stepScenario(sessionId)}>⏭ Krok</button>
      <button onClick={() => rewindScenario(sessionId)}>⏮ Cofnij</button>
    </div>
  );
}
