import { API_BASE_URL } from "../config";
import { loggedFetch } from "../lib/logger";
import type { NetworkArchitecture, NetworkDevice, NetworkType } from "./types";

export async function fetchNetworkTypes(): Promise<NetworkType[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/network-types`);
  if (!response.ok) throw new Error(`Błąd pobierania typów sieci: ${response.status}`);
  return response.json();
}

export async function fetchNetworkArchitectures(): Promise<NetworkArchitecture[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/network-architectures`);
  if (!response.ok) throw new Error(`Błąd pobierania architektur: ${response.status}`);
  return response.json();
}

export async function fetchNetworkDevices(): Promise<NetworkDevice[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/network-devices`);
  if (!response.ok) throw new Error(`Błąd pobierania urządzeń: ${response.status}`);
  return response.json();
}
