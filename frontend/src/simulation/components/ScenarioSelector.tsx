import { useEffect, useState } from "react";
import { fetchScenarios, type ScenarioSummary } from "../api";
import { OSI_LAYER_ORDER, TCPIP_LAYER_ORDER, OSI_LAYER_LABELS, TCPIP_LAYER_LABELS } from "../layerModel";
import type { OsiLayer, TcpIpLayer } from "../types";

interface ScenarioSelectorProps {
  onSelect: (scenarioId: string) => void;
  selectedScenarioId: string | null;
}

type Model = "osi" | "tcpip";

export function ScenarioSelector({ onSelect, selectedScenarioId }: ScenarioSelectorProps) {
  const [model, setModel] = useState<Model>("osi");
  const [layer, setLayer] = useState<string>("");
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);

  useEffect(() => {
    const layerParam = layer ? (layer as OsiLayer | TcpIpLayer) : undefined;
    fetchScenarios(model, layerParam).then(setScenarios);
  }, [model, layer]);

  const layerOptions = model === "osi" ? OSI_LAYER_ORDER : TCPIP_LAYER_ORDER;
  const layerLabels: Record<string, string> = model === "osi" ? OSI_LAYER_LABELS : TCPIP_LAYER_LABELS;

  return (
    <div className="scenario-selector">
      <div className="mode-toggle">
        <button
          className={model === "osi" ? "active" : ""}
          onClick={() => {
            setModel("osi");
            setLayer("");
          }}
        >
          OSI
        </button>
        <button
          className={model === "tcpip" ? "active" : ""}
          onClick={() => {
            setModel("tcpip");
            setLayer("");
          }}
        >
          TCP/IP
        </button>
      </div>

      <select value={layer} onChange={(e) => setLayer(e.target.value)}>
        <option value="">Wszystkie warstwy</option>
        {layerOptions.map((option) => (
          <option key={option} value={option}>
            {layerLabels[option]}
          </option>
        ))}
      </select>

      <ul className="scenario-list">
        {scenarios.map((scenario) => (
          <li key={scenario.scenarioId}>
            <button
              className={scenario.scenarioId === selectedScenarioId ? "active" : ""}
              onClick={() => onSelect(scenario.scenarioId)}
            >
              {scenario.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
