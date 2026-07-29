import { motion } from "framer-motion";
import type { ReactElement } from "react";
import type { DeviceBehavior } from "../types";

const PULSE = { repeat: Infinity, duration: 1.4, ease: "easeInOut" as const };

function RepeatSignal() {
  return (
    <svg viewBox="0 0 200 120" width="220" height="130">
      <circle cx={100} cy={60} r={14} fill="#2c3e50" />
      {[[20, 20], [180, 20], [20, 100], [180, 100]].map(([x, y], i) => (
        <g key={i}>
          <line x1={100} y1={60} x2={x} y2={y} stroke="#95a5a6" strokeWidth={2} />
          <motion.circle
            cx={x}
            cy={y}
            r={6}
            fill="#f1c40f"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ ...PULSE, delay: i * 0.1 }}
          />
        </g>
      ))}
    </svg>
  );
}

function SelectiveForward() {
  const ports: [number, number][] = [[20, 20], [180, 20], [20, 100], [180, 100]];
  const targetIndex = 1;
  return (
    <svg viewBox="0 0 200 120" width="220" height="130">
      <circle cx={100} cy={60} r={14} fill="#2c3e50" />
      {ports.map(([x, y], i) => (
        <g key={i}>
          <line x1={100} y1={60} x2={x} y2={y} stroke="#95a5a6" strokeWidth={i === targetIndex ? 2 : 1} opacity={i === targetIndex ? 1 : 0.3} />
        </g>
      ))}
      <motion.circle
        r={6}
        fill="#f1c40f"
        initial={{ cx: 100, cy: 60 }}
        animate={{ cx: [100, ports[targetIndex][0]], cy: [60, ports[targetIndex][1]] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

function Route() {
  return (
    <svg viewBox="0 0 240 100" width="240" height="100">
      <circle cx={30} cy={50} r={16} fill="#2c3e50" />
      <text x={30} y={54} textAnchor="middle" fontSize="10" fill="#fff">A</text>
      <rect x={104} y={34} width={32} height={32} rx={6} fill="#8e44ad" />
      <circle cx={210} cy={50} r={16} fill="#2c3e50" />
      <text x={210} y={54} textAnchor="middle" fontSize="10" fill="#fff">B</text>
      <line x1={46} y1={50} x2={104} y2={50} stroke="#95a5a6" strokeWidth={2} />
      <line x1={136} y1={50} x2={194} y2={50} stroke="#95a5a6" strokeWidth={2} />
      <motion.circle
        r={6}
        fill="#f1c40f"
        cy={50}
        animate={{ cx: [30, 120, 210] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
    </svg>
  );
}

function Modulate() {
  return (
    <svg viewBox="0 0 200 80" width="220" height="90">
      <motion.path
        stroke="#3498db"
        strokeWidth={3}
        fill="none"
        animate={{
          d: [
            "M0,40 Q25,10 50,40 T100,40 T150,40 T200,40",
            "M0,40 L20,40 L20,10 L50,10 L50,70 L80,70 L80,10 L110,10 L110,70 L140,70 L140,40 L200,40",
            "M0,40 Q25,10 50,40 T100,40 T150,40 T200,40",
          ],
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
    </svg>
  );
}

function Filter() {
  return (
    <svg viewBox="0 0 200 100" width="220" height="100">
      <rect x={90} y={20} width={20} height={60} fill="#7f8c8d" />
      <motion.circle
        r={7}
        fill="#f1c40f"
        cy={50}
        animate={{ cx: [20, 100, 100, 180], fill: ["#f1c40f", "#f1c40f", "#2ecc71", "#2ecc71"] }}
        transition={{ repeat: Infinity, duration: 2.4, times: [0, 0.4, 0.5, 1] }}
      />
    </svg>
  );
}

function TranslateNetworks() {
  return (
    <svg viewBox="0 0 220 100" width="220" height="100">
      <rect x={10} y={30} width={60} height={40} rx={8} fill="#2980b9" opacity={0.5} />
      <rect x={150} y={30} width={60} height={40} rx={8} fill="#c0392b" opacity={0.5} />
      <rect x={95} y={35} width={30} height={30} rx={6} fill="#f39c12" />
      <motion.circle
        r={6}
        cy={50}
        animate={{ cx: [30, 110, 180], fill: ["#2980b9", "#f39c12", "#c0392b"] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

function Distribute() {
  const targets: [number, number][] = [[170, 20], [170, 50], [170, 80]];
  return (
    <svg viewBox="0 0 200 100" width="220" height="100">
      <circle cx={20} cy={50} r={12} fill="#2c3e50" />
      {targets.map(([x, y], i) => (
        <rect key={i} x={x} y={y - 10} width={20} height={20} rx={4} fill="#7f8c8d" />
      ))}
      <motion.circle
        r={6}
        fill="#f1c40f"
        cy={50}
        animate={{
          cx: [20, ...targets.map((t) => t[0] + 10)],
          cy: [50, ...targets.map((t) => t[1])],
        }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

function RelayApplication() {
  return (
    <svg viewBox="0 0 240 80" width="240" height="80">
      <circle cx={30} cy={40} r={14} fill="#2c3e50" />
      <text x={30} y={44} textAnchor="middle" fontSize="9" fill="#fff">Klient</text>
      <rect x={104} y={24} width={32} height={32} rx={6} fill="#16a085" />
      <circle cx={210} cy={40} r={14} fill="#2c3e50" />
      <text x={210} y={44} textAnchor="middle" fontSize="9" fill="#fff">Serwer</text>
      <motion.circle
        r={6}
        fill="#f1c40f"
        cy={40}
        animate={{ cx: [30, 120, 210, 120, 30] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
    </svg>
  );
}

const ANIMATIONS: Record<DeviceBehavior, () => ReactElement> = {
  REPEAT_SIGNAL: RepeatSignal,
  SELECTIVE_FORWARD: SelectiveForward,
  ROUTE: Route,
  MODULATE: Modulate,
  FILTER: Filter,
  TRANSLATE_NETWORKS: TranslateNetworks,
  DISTRIBUTE: Distribute,
  RELAY_APPLICATION: RelayApplication,
};

interface DeviceBehaviorAnimationProps {
  behavior: DeviceBehavior;
}

export function DeviceBehaviorAnimation({ behavior }: DeviceBehaviorAnimationProps) {
  const Animation = ANIMATIONS[behavior];
  return (
    <div className="device-behavior-animation">
      <Animation />
    </div>
  );
}
