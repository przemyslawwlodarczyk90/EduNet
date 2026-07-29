import { API_BASE_URL } from "../config";
import type { EncryptionType } from "./types";

export async function fetchEncryptionTypes(): Promise<EncryptionType[]> {
  const response = await fetch(`${API_BASE_URL}/api/encryption-types`);
  if (!response.ok) throw new Error(`Błąd pobierania typów szyfrowania: ${response.status}`);
  return response.json();
}
