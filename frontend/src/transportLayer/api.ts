import { API_BASE_URL } from "../config";
import type { DuplexMode } from "./types";

export async function fetchDuplexModes(): Promise<DuplexMode[]> {
  const response = await fetch(`${API_BASE_URL}/api/duplex-modes`);
  if (!response.ok) throw new Error(`Błąd pobierania trybów duplex: ${response.status}`);
  return response.json();
}
