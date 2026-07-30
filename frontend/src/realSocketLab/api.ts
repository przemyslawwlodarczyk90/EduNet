import { API_BASE_URL } from "../config";
import type { LabProtocol, LabSessionView } from "./types";

export const LAB_WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export async function startLabSession(protocol: LabProtocol): Promise<LabSessionView> {
  const response = await fetch(`${API_BASE_URL}/api/lab/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ protocol }),
  });
  if (!response.ok) throw new Error(`Błąd uruchamiania sesji laboratorium: ${response.status}`);
  return response.json();
}

export async function stopLabSession(sessionId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/lab/sessions/${sessionId}`, { method: "DELETE" });
}
