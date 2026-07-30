import { useEffect, useState } from "react";
import { fetchHttpHistory } from "../api";
import type { HttpHistoryMilestone } from "../types";

export function HttpHistoryTimeline() {
  const [milestones, setMilestones] = useState<HttpHistoryMilestone[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  useEffect(() => {
    fetchHttpHistory().then((data) => {
      setMilestones(data);
      setSelectedVersion(data[0]?.version ?? null);
    });
  }, []);

  const selected = milestones.find((m) => m.version === selectedVersion);

  return (
    <div className="http-history-timeline">
      <div className="timeline-track">
        {milestones.map((milestone) => (
          <button
            key={milestone.version}
            className={`timeline-entry timeline-entry-button${milestone.version === selectedVersion ? " active" : ""}`}
            onClick={() => setSelectedVersion(milestone.version)}
          >
            <div className="timeline-year">{milestone.year.split(" ")[0].replace(/[(),]/g, "")}</div>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <strong>{milestone.version}</strong>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="http-history-details">
          <p>
            <strong>Rok / standard:</strong> {selected.year} — {selected.standardOrOrigin}
          </p>
          <p>
            <strong>Kluczowa innowacja:</strong> {selected.keyInnovation}
          </p>
          <p>{selected.description}</p>
        </div>
      )}
    </div>
  );
}
