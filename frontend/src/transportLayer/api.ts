import { API_BASE_URL } from "../config";
import { loggedFetch } from "../lib/logger";
import type { DuplexMode } from "./types";

export async function fetchDuplexModes(): Promise<DuplexMode[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/duplex-modes`);
  if (!response.ok) throw new Error(`Błąd pobierania trybów duplex: ${response.status}`);
  return response.json();
}
