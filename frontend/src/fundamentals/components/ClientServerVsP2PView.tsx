import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchNetworkArchitectures } from "../api";
import type { NetworkArchitecture } from "../types";

interface NodePosition {
  name: string;
  x: number;
  y: number;
}

function layoutPositions(participants: string[], cx: number, cy: number, r: number): NodePosition[] {
  return participants.map((name, i) => {
    const angle = (2 * Math.PI * i) / participants.length - Math.PI / 2;
    return { name, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

export function ClientServerVsP2PView() {
  const [architectures, setArchitectures] = useState<NetworkArchitecture[]>([]);
  const [selectedId, setSelectedId] = useState<string>("client-server");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    fetchNetworkArchitectures().then(setArchitectures);
  }, []);

  useEffect(() => {
    setStepIndex(0);
  }, [selectedId]);

  const architecture = architectures.find((a) => a.id === selectedId);
  if (!architecture) return null;

  const positions = layoutPositions(architecture.participants, 150, 150, 100);
  const posByName = Object.fromEntries(positions.map((p) => [p.name, p]));
  const currentStep = architecture.steps[stepIndex];
  const from = posByName[currentStep.from];
  const to = posByName[currentStep.to];

  return (
    <div className="client-server-p2p-view">
      <div className="mode-toggle">
        {architectures.map((a) => (
          <button key={a.id} className={a.id === selectedId ? "active" : ""} onClick={() => setSelectedId(a.id)}>
            {a.title}
          </button>
        ))}
      </div>
      <p>{architecture.description}</p>
      <svg viewBox="0 0 300 300" width="300" height="300">
        {positions.map((p) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r={28} fill="#2c3e50" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill="#fff">
              {p.name}
            </text>
          </g>
        ))}
        {from && to && (
          <motion.circle
            key={stepIndex}
            r={7}
            fill="#f1c40f"
            initial={{ cx: from.x, cy: from.y }}
            animate={{ cx: to.x, cy: to.y }}
            transition={{ duration: 1 }}
          />
        )}
      </svg>
      <p className="step-label">
        {currentStep.from} → {currentStep.to}: {currentStep.label}
      </p>
      <div className="scenario-controls">
        <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={stepIndex === 0}>
          ⏮ Poprzedni
        </button>
        <button
          onClick={() => setStepIndex((i) => Math.min(architecture.steps.length - 1, i + 1))}
          disabled={stepIndex === architecture.steps.length - 1}
        >
          Następny ⏭
        </button>
      </div>
    </div>
  );
}
