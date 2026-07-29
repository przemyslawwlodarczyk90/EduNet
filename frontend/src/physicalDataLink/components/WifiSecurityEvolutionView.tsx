import { useEffect, useState } from "react";
import { fetchWifiSecurityStandards } from "../api";
import type { WifiSecurityStandard } from "../types";

export function WifiSecurityEvolutionView() {
  const [standards, setStandards] = useState<WifiSecurityStandard[]>([]);

  useEffect(() => {
    fetchWifiSecurityStandards().then(setStandards);
  }, []);

  return (
    <div className="wifi-security-evolution">
      <div className="timeline-track">
        {standards.map((standard) => (
          <div key={standard.id} className="timeline-entry">
            <div className="timeline-year">{standard.year}</div>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <strong>{standard.name}</strong>
              <p>{standard.description}</p>
              <p className="wifi-security-weakness">
                <em>{standard.weakness}</em>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
