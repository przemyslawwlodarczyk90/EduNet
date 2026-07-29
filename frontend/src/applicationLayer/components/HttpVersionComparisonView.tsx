import { useEffect, useState } from "react";
import { fetchHttpVersions } from "../api";
import type { HttpVersionTimeline } from "../types";

const SPEED_SCALE = 4; // stretch real ms so the animation is visible

export function HttpVersionComparisonView() {
  const [timelines, setTimelines] = useState<HttpVersionTimeline[]>([]);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [finishedOrder, setFinishedOrder] = useState<string[]>([]);

  useEffect(() => {
    fetchHttpVersions().then((data) => {
      // task 21 focuses on comparing the four "modern" transport variants; HTTP/0.9 stays a
      // historical reference shown separately in HttpEvolutionTimeline.
      setTimelines(data.filter((t) => t.version !== "HTTP/0.9"));
    });
  }, []);

  const runSimulation = () => {
    setRunning(true);
    setStarted(false);
    setFinishedOrder([]);
    requestAnimationFrame(() => requestAnimationFrame(() => setStarted(true)));
    timelines.forEach((timeline) => {
      setTimeout(() => {
        setFinishedOrder((prev) => [...prev, timeline.version]);
      }, timeline.totalTimeMs * SPEED_SCALE);
    });
  };

  const fastest = timelines.length > 0 ? [...timelines].sort((a, b) => a.totalTimeMs - b.totalTimeMs)[0] : null;
  const predictionCorrect = prediction && fastest ? prediction === fastest.version : null;

  return (
    <div className="http-version-comparison-view">
      {!running && (
        <div className="http-predictor">
          <p>Zanim uruchomisz symulację: która wersja HTTP skończy pobieranie tego zestawu zasobów najszybciej?</p>
          <div className="mode-toggle">
            {timelines.map((t) => (
              <button
                key={t.version}
                className={prediction === t.version ? "active" : ""}
                onClick={() => setPrediction(t.version)}
              >
                {t.version}
              </button>
            ))}
          </div>
          <button disabled={!prediction} onClick={runSimulation}>
            Uruchom symulację
          </button>
        </div>
      )}

      {running && (
        <>
          <div className="http-version-tracks">
            {timelines.map((timeline) => (
              <div key={timeline.version} className="http-version-track">
                <div className="http-version-track-label">
                  {timeline.label} — {timeline.totalTimeMs} ms
                </div>
                <div className="http-version-track-bar">
                  <div
                    className="http-version-track-fill"
                    style={{
                      width: started ? "100%" : "0%",
                      transitionDuration: `${timeline.totalTimeMs * SPEED_SCALE}ms`,
                    }}
                  />
                </div>
                {finishedOrder.includes(timeline.version) && <span className="http-version-done">✓ ukończono</span>}
              </div>
            ))}
          </div>
          {finishedOrder.length === timelines.length && fastest && (
            <div className="http-predictor-result">
              <p>
                Najszybsza była: <strong>{fastest.version}</strong> ({fastest.totalTimeMs} ms)
              </p>
              {prediction && (
                <p className={predictionCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}>
                  {predictionCorrect ? "Twoja przewidywanie było trafne!" : `Przewidziałeś ${prediction} — tym razem nietrafnie.`}
                </p>
              )}
              <button
                onClick={() => {
                  setRunning(false);
                  setPrediction(null);
                  setFinishedOrder([]);
                }}
              >
                Spróbuj ponownie
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
