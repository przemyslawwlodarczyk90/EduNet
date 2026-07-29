import { useEffect, useMemo, useState } from "react";
import { fetchTopologies } from "../api";
import type { NetworkTopology } from "../types";

function buildAdjacency(topology: NetworkTopology): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  topology.nodes.forEach((n) => adjacency.set(n.id, []));
  topology.links.forEach((link) => {
    adjacency.get(link.from)?.push(link.to);
    adjacency.get(link.to)?.push(link.from);
  });
  return adjacency;
}

function bfsLayers(adjacency: Map<string, string[]>, origin: string, excluded: Set<string>): Map<string, number> {
  const layers = new Map<string, number>();
  if (!origin || excluded.has(origin)) return layers;
  layers.set(origin, 0);
  const queue = [origin];
  while (queue.length > 0) {
    const current = queue.shift() as string;
    const currentLayer = layers.get(current) ?? 0;
    for (const neighbor of adjacency.get(current) ?? []) {
      if (excluded.has(neighbor) || layers.has(neighbor)) continue;
      layers.set(neighbor, currentLayer + 1);
      queue.push(neighbor);
    }
  }
  return layers;
}

export function TopologyDiagram() {
  const [topologies, setTopologies] = useState<NetworkTopology[]>([]);
  const [selectedId, setSelectedId] = useState("star");
  const [failedNodes, setFailedNodes] = useState<Set<string>>(new Set());
  const [signalStep, setSignalStep] = useState(-1);

  useEffect(() => {
    fetchTopologies().then(setTopologies);
  }, []);

  useEffect(() => {
    setFailedNodes(new Set());
    setSignalStep(-1);
  }, [selectedId]);

  const topology = topologies.find((t) => t.id === selectedId);
  const adjacency = useMemo(() => (topology ? buildAdjacency(topology) : new Map<string, string[]>()), [topology]);
  const origin = topology?.nodes[0]?.id ?? "";
  const layers = useMemo(() => bfsLayers(adjacency, origin, failedNodes), [adjacency, origin, failedNodes]);
  const maxLayer = Math.max(0, ...Array.from(layers.values()));

  useEffect(() => {
    if (signalStep < 0 || signalStep >= maxLayer) return;
    const timer = setTimeout(() => setSignalStep((s) => s + 1), 500);
    return () => clearTimeout(timer);
  }, [signalStep, maxLayer]);

  if (!topology) return null;

  const nodeById = Object.fromEntries(topology.nodes.map((n) => [n.id, n]));
  const scale = (v: number) => 30 + v * 240;

  const toggleFailed = (id: string) => {
    setSignalStep(-1);
    setFailedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const disconnected = topology.nodes.filter((n) => !layers.has(n.id) && !failedNodes.has(n.id));

  return (
    <div className="topology-diagram">
      <div className="mode-toggle">
        {topologies.map((t) => (
          <button key={t.id} className={t.id === selectedId ? "active" : ""} onClick={() => setSelectedId(t.id)}>
            {t.name}
          </button>
        ))}
      </div>
      <p>{topology.description}</p>
      <div className="topology-controls">
        <button onClick={() => setSignalStep(0)}>Symuluj sygnał</button>
        <button
          onClick={() => {
            setFailedNodes(new Set());
            setSignalStep(-1);
          }}
        >
          Reset awarii
        </button>
      </div>
      <svg viewBox="0 0 300 300" width="300" height="300">
        {topology.links.map((link) => {
          const from = nodeById[link.from];
          const to = nodeById[link.to];
          const broken = failedNodes.has(link.from) || failedNodes.has(link.to);
          return (
            <line
              key={`${link.from}-${link.to}`}
              x1={scale(from.x)}
              y1={scale(from.y)}
              x2={scale(to.x)}
              y2={scale(to.y)}
              stroke={broken ? "#e74c3c" : "#95a5a6"}
              strokeDasharray={broken ? "4 4" : undefined}
              strokeWidth={2}
            />
          );
        })}
        {topology.nodes.map((node) => {
          const failed = failedNodes.has(node.id);
          const layer = layers.get(node.id);
          const reachable = layer !== undefined;
          const reached = reachable && signalStep >= (layer as number);
          let fill = "#95a5a6";
          if (failed) fill = "#c0392b";
          else if (reached) fill = "#2ecc71";
          else if (reachable) fill = "#2c3e50";
          return (
            <g key={node.id} onClick={() => toggleFailed(node.id)} style={{ cursor: "pointer" }}>
              <circle cx={scale(node.x)} cy={scale(node.y)} r={16} fill={fill} />
              <text x={scale(node.x)} y={scale(node.y) + 4} textAnchor="middle" fontSize="9" fill="#fff">
                {failed ? "✕" : node.id}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="topology-legend">
        Kliknij węzeł, aby zasymulować jego awarię. Węzły odcięte od <strong>{origin}</strong>:{" "}
        {disconnected.length > 0 ? disconnected.map((n) => n.id).join(", ") : "brak"}
      </p>
      <p>
        <strong>Propagacja sygnału:</strong> {topology.signalPropagationDescription}
      </p>
      <p>
        <strong>Zachowanie przy awarii:</strong> {topology.failureBehaviorDescription}
      </p>
    </div>
  );
}
