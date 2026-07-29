import { API_BASE_URL } from "../config";
import type {
  ArpCapturedPacket,
  ArpTableValidationResult,
  MediumCategory,
  NetworkTopology,
  TransmissionMedium,
  WifiSecurityStandard,
} from "./types";

export async function fetchTopologies(): Promise<NetworkTopology[]> {
  const response = await fetch(`${API_BASE_URL}/api/topologies`);
  if (!response.ok) throw new Error(`Błąd pobierania topologii: ${response.status}`);
  return response.json();
}

export async function fetchTransmissionMedia(category?: MediumCategory): Promise<TransmissionMedium[]> {
  const params = category ? `?category=${category}` : "";
  const response = await fetch(`${API_BASE_URL}/api/transmission-media${params}`);
  if (!response.ok) throw new Error(`Błąd pobierania mediów transmisyjnych: ${response.status}`);
  return response.json();
}

export async function fetchWifiSecurityStandards(): Promise<WifiSecurityStandard[]> {
  const response = await fetch(`${API_BASE_URL}/api/wifi-security-standards`);
  if (!response.ok) throw new Error(`Błąd pobierania standardów bezpieczeństwa Wi-Fi: ${response.status}`);
  return response.json();
}

export async function fetchArpTablePackets(): Promise<ArpCapturedPacket[]> {
  const response = await fetch(`${API_BASE_URL}/api/exercises/arp-table`);
  if (!response.ok) throw new Error(`Błąd pobierania ćwiczenia ARP: ${response.status}`);
  return response.json();
}

export async function validateArpTable(submission: Record<string, string>): Promise<ArpTableValidationResult> {
  const response = await fetch(`${API_BASE_URL}/api/exercises/arp-table/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });
  if (!response.ok) throw new Error(`Błąd walidacji tablicy ARP: ${response.status}`);
  return response.json();
}
