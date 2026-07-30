import { API_BASE_URL } from "../config";
import { loggedFetch } from "../lib/logger";
import type { PhishingExample } from "./types";

export async function fetchPhishingExample(): Promise<PhishingExample> {
  const response = await loggedFetch(`${API_BASE_URL}/api/phishing-example`);
  if (!response.ok) throw new Error(`Błąd pobierania przykładu phishingu: ${response.status}`);
  return response.json();
}
