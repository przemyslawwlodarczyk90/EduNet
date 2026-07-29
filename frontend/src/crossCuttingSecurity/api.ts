import { API_BASE_URL } from "../config";
import type { PhishingExample } from "./types";

export async function fetchPhishingExample(): Promise<PhishingExample> {
  const response = await fetch(`${API_BASE_URL}/api/phishing-example`);
  if (!response.ok) throw new Error(`Błąd pobierania przykładu phishingu: ${response.status}`);
  return response.json();
}
