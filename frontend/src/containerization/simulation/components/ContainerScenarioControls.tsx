import { useEffect, useRef, useState } from "react";
import { useContainerScenarioSession } from "../containerScenarioStore";
import { pauseContainerScenario, rewindContainerScenario, stepContainerScenario } from "../containerScenarioClient";

const AUTO_STEP_INTERVAL_MS = 1600;

interface ContainerScenarioControlsProps {
  sessionId: string;
}

export function ContainerScenarioControls({ sessionId }: ContainerScenarioControlsProps) {
  const { error } = useContainerScenarioSession(sessionId);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (error) {
      setIsPlaying(false);
    }
  }, [error]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => stepContainerScenario(sessionId), AUTO_STEP_INTERVAL_MS);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, sessionId]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseContainerScenario(sessionId);
    }
    setIsPlaying((value) => !value);
  };

  return (
    <div className="scenario-controls">
      <button onClick={togglePlay}>{isPlaying ? "⏸ Pauza" : "▶ Odtwórz"}</button>
      <button onClick={() => stepContainerScenario(sessionId)}>⏭ Krok</button>
      <button onClick={() => rewindContainerScenario(sessionId)}>⏮ Cofnij</button>
    </div>
  );
}
