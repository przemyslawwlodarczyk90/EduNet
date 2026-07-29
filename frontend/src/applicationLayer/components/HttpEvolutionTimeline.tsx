import { useEffect, useState } from "react";
import { fetchHttpVersions } from "../api";
import type { HttpVersionTimeline } from "../types";

export function HttpEvolutionTimeline() {
  const [timelines, setTimelines] = useState<HttpVersionTimeline[]>([]);

  useEffect(() => {
    fetchHttpVersions().then(setTimelines);
  }, []);

  return (
    <div className="http-evolution-timeline">
      <div className="timeline-track">
        {timelines.map((t) => (
          <div key={t.version} className="timeline-entry">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <strong>{t.version}</strong>
              <p>{t.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
