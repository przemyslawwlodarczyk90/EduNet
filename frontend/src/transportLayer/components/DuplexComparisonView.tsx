import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchDuplexModes } from "../api";
import type { DuplexMode } from "../types";

function FullDuplexDiagram() {
  return (
    <svg viewBox="0 0 200 80" width="200" height="80">
      <line x1={10} y1={20} x2={190} y2={20} stroke="#95a5a6" strokeWidth={2} />
      <line x1={10} y1={55} x2={190} y2={55} stroke="#95a5a6" strokeWidth={2} />
      <motion.circle
        r={6}
        fill="#2ecc71"
        initial={{ cx: 10, cy: 20 }}
        animate={{ cx: 190, cy: 20 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
      />
      <motion.circle
        r={6}
        fill="#2980b9"
        initial={{ cx: 190, cy: 55 }}
        animate={{ cx: 10, cy: 55 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
      />
    </svg>
  );
}

function HalfDuplexDiagram() {
  return (
    <svg viewBox="0 0 200 80" width="200" height="80">
      <line x1={10} y1={40} x2={190} y2={40} stroke="#95a5a6" strokeWidth={2} />
      <motion.circle
        r={6}
        fill="#e67e22"
        initial={{ cx: 10, cy: 40 }}
        animate={{ cx: [10, 190, 190, 10, 10], cy: 40 }}
        transition={{ repeat: Infinity, duration: 3, times: [0, 0.45, 0.5, 0.95, 1], ease: "linear" }}
      />
    </svg>
  );
}

export function DuplexComparisonView() {
  const [modes, setModes] = useState<DuplexMode[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    fetchDuplexModes().then((data) => {
      setModes(data);
      setSelectedId(data[0]?.id ?? "");
    });
  }, []);

  const selected = modes.find((m) => m.id === selectedId);

  return (
    <div className="duplex-comparison-view">
      <div className="mode-toggle">
        {modes.map((mode) => (
          <button key={mode.id} className={mode.id === selectedId ? "active" : ""} onClick={() => setSelectedId(mode.id)}>
            {mode.technology}
          </button>
        ))}
      </div>
      {selected && (
        <>
          <p>
            <strong>{selected.mode === "FULL" ? "Full duplex" : "Half duplex"}:</strong> {selected.description}
          </p>
          {selected.mode === "FULL" ? <FullDuplexDiagram /> : <HalfDuplexDiagram />}
        </>
      )}
    </div>
  );
}
