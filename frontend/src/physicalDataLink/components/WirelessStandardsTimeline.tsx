import { useEffect, useState } from "react";
import { fetchTransmissionMedia } from "../api";
import type { TransmissionMedium } from "../types";

export function WirelessStandardsTimeline() {
  const [wifi, setWifi] = useState<TransmissionMedium[]>([]);
  const [cellular, setCellular] = useState<TransmissionMedium[]>([]);

  useEffect(() => {
    fetchTransmissionMedia("WIFI").then(setWifi);
    fetchTransmissionMedia("CELLULAR").then(setCellular);
  }, []);

  const renderTimeline = (title: string, items: TransmissionMedium[]) => (
    <div className="wireless-timeline">
      <h4>{title}</h4>
      <div className="timeline-track">
        {items.map((item) => (
          <div key={item.id} className="timeline-entry">
            <div className="timeline-year">{item.yearIntroduced}</div>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <strong>{item.name}</strong>
              <div>{item.maxSpeed}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="wireless-standards-timeline">
      {renderTimeline("Standardy Wi-Fi", wifi)}
      {renderTimeline("Generacje sieci komórkowych", cellular)}
    </div>
  );
}
