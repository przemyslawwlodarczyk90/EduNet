import { API_BASE_URL } from "../config";
import type { NetworkQualityRequest, NetworkQualityResult, TerminalCommandResult } from "./types";

export async function simulateNetworkQuality(request: NetworkQualityRequest): Promise<NetworkQualityResult> {
  const response = await fetch(`${API_BASE_URL}/api/quality/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Błąd symulacji jakości łącza: ${response.status}`);
  return response.json();
}

export async function executeTerminalCommand(command: string, args: string[]): Promise<TerminalCommandResult> {
  const response = await fetch(`${API_BASE_URL}/api/terminal/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command, args }),
  });
  if (!response.ok) throw new Error(`Błąd wykonania komendy: ${response.status}`);
  return response.json();
}
