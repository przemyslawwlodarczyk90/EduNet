import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchTransmissionMedia } from "../api";
import type { TransmissionMedium } from "../types";

export function MediaComparisonView() {
  const [copperOptions, setCopperOptions] = useState<TransmissionMedium[]>([]);
  const [fiberOptions, setFiberOptions] = useState<TransmissionMedium[]>([]);
  const [copperId, setCopperId] = useState<string>("");
  const [fiberId, setFiberId] = useState<string>("");

  useEffect(() => {
    fetchTransmissionMedia("COPPER").then((data) => {
      setCopperOptions(data);
      setCopperId(data[0]?.id ?? "");
    });
    fetchTransmissionMedia("FIBER").then((data) => {
      setFiberOptions(data);
      setFiberId(data[0]?.id ?? "");
    });
  }, []);

  const copper = copperOptions.find((m) => m.id === copperId);
  const fiber = fiberOptions.find((m) => m.id === fiberId);

  return (
    <div className="media-comparison-view">
      <div className="media-comparison-selectors">
        <label>
          Kabel miedziany:{" "}
          <select value={copperId} onChange={(e) => setCopperId(e.target.value)}>
            {copperOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Światłowód:{" "}
          <select value={fiberId} onChange={(e) => setFiberId(e.target.value)}>
            {fiberOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {copper && (
        <div className="media-pipe-row">
          <div className="media-pipe copper">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="media-pipe-particle"
                animate={{ left: ["0%", "95%"] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.6, ease: "linear" }}
              />
            ))}
          </div>
          <div className="media-pipe-label">
            {copper.name} — {copper.maxSpeed}
          </div>
        </div>
      )}

      {fiber && (
        <div className="media-pipe-row">
          <div className="media-pipe fiber">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="media-pipe-particle"
                animate={{ left: ["0%", "95%"] }}
                transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.14, ease: "linear" }}
              />
            ))}
          </div>
          <div className="media-pipe-label">
            {fiber.name} — {fiber.maxSpeed}
          </div>
        </div>
      )}

      {copper && <p>{copper.description}</p>}
      {fiber && <p>{fiber.description}</p>}
    </div>
  );
}
