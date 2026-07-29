import { useEffect, useState } from "react";
import { fetchNetworkTypes } from "../api";
import type { NetworkType } from "../types";

const ORDER = ["WAN", "MAN", "WLAN", "LAN", "PAN"];
const RADII: Record<string, number> = { WAN: 240, MAN: 190, WLAN: 140, LAN: 95, PAN: 50 };
const COLORS: Record<string, string> = {
  WAN: "#8e44ad",
  MAN: "#2980b9",
  WLAN: "#16a085",
  LAN: "#27ae60",
  PAN: "#f39c12",
};

export function NetworkScopeMap() {
  const [types, setTypes] = useState<NetworkType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchNetworkTypes().then(setTypes);
  }, []);

  const byId = Object.fromEntries(types.map((t) => [t.id, t]));
  const selected = selectedId ? byId[selectedId] : null;

  return (
    <div className="network-scope-map">
      <svg viewBox="0 0 500 500" width="300" height="300">
        {ORDER.filter((id) => byId[id]).map((id) => (
          <circle
            key={id}
            cx={250}
            cy={250}
            r={RADII[id]}
            fill={COLORS[id]}
            fillOpacity={selectedId === id ? 0.85 : 0.35}
            stroke={COLORS[id]}
            strokeWidth={selectedId === id ? 3 : 1}
            onClick={() => setSelectedId(id)}
            style={{ cursor: "pointer" }}
          />
        ))}
        {ORDER.filter((id) => byId[id]).map((id) => (
          <text
            key={`${id}-label`}
            x={250}
            y={250 - RADII[id] + 16}
            textAnchor="middle"
            fontSize="12"
            fill="#fff"
            pointerEvents="none"
          >
            {id}
          </text>
        ))}
      </svg>
      {selected && (
        <div className="scope-details">
          <h4>{selected.name}</h4>
          <p>{selected.description}</p>
          <p>
            <strong>Zasięg:</strong> {selected.approximateRange}
          </p>
          <p>
            <strong>Przykład:</strong> {selected.example}
          </p>
        </div>
      )}
    </div>
  );
}
