import { motion } from "framer-motion";
import type { SimulationEvent } from "../../simulation/types";

const NODES = [
  { id: "PC", x: 20 },
  { id: "R1", x: 120 },
  { id: "R2", x: 220 },
  { id: "R3", x: 320 },
  { id: "Server", x: 420 },
];

interface RoutingTopologyViewProps {
  currentEvent: SimulationEvent | null;
}

export function RoutingTopologyView({ currentEvent }: RoutingTopologyViewProps) {
  const activeNodeId = currentEvent?.headers.hop ?? "PC";
  const activeNode = NODES.find((n) => n.id === activeNodeId) ?? NODES[0];

  return (
    <div className="routing-topology-view">
      <svg viewBox="0 0 460 80" width="460" height="80">
        {NODES.slice(0, -1).map((node, i) => (
          <line
            key={node.id}
            x1={node.x + 14}
            y1={40}
            x2={NODES[i + 1].x}
            y2={40}
            stroke="#95a5a6"
            strokeWidth={2}
          />
        ))}
        {NODES.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={40} r={14} fill="#2c3e50" />
            <text x={node.x} y={65} textAnchor="middle" fontSize="9">
              {node.id}
            </text>
          </g>
        ))}
        <motion.circle
          r={6}
          fill="#f1c40f"
          initial={{ cx: activeNode.x, cy: 40 }}
          animate={{ cx: activeNode.x, cy: 40 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      </svg>
      {currentEvent && <p>{currentEvent.description}</p>}
    </div>
  );
}
