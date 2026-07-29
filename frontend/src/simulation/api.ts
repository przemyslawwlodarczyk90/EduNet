import { API_BASE_URL } from "../config";
import type { OsiLayer, TcpIpLayer } from "./types";

export interface ScenarioSummary {
  scenarioId: string;
  title: string;
  osiLayers: OsiLayer[];
}

export interface CodeSnippet {
  scenarioId: string;
  fileName: string;
  language: string;
  code: string;
}

export async function fetchScenarios(model: "osi" | "tcpip", layer?: OsiLayer | TcpIpLayer): Promise<ScenarioSummary[]> {
  const params = new URLSearchParams({ model });
  if (layer) params.set("layer", layer);
  const response = await fetch(`${API_BASE_URL}/api/scenarios?${params.toString()}`);
  if (!response.ok) throw new Error(`Błąd pobierania scenariuszy: ${response.status}`);
  return response.json();
}

export async function fetchCodeSnippet(scenarioId: string): Promise<CodeSnippet> {
  const response = await fetch(`${API_BASE_URL}/api/code-snippets/${scenarioId}`);
  if (!response.ok) throw new Error(`Błąd pobierania kodu: ${response.status}`);
  return response.json();
}
