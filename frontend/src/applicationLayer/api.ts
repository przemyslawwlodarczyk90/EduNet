import { API_BASE_URL } from "../config";
import type {
  ConceptTopic,
  DnsRecord,
  DnsRecordType,
  DnsZoneQueryResult,
  HttpVersionTimeline,
  ProtocolPort,
} from "./types";

export async function fetchDnsZone(): Promise<DnsRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/dns/zone`);
  if (!response.ok) throw new Error(`Błąd pobierania strefy DNS: ${response.status}`);
  return response.json();
}

export async function addDnsRecord(record: DnsRecord): Promise<DnsRecord> {
  const response = await fetch(`${API_BASE_URL}/api/dns/zone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });
  if (!response.ok) throw new Error(`Błąd dodawania rekordu: ${response.status}`);
  return response.json();
}

export async function removeDnsRecord(name: string, type: DnsRecordType): Promise<void> {
  const params = new URLSearchParams({ name, type });
  const response = await fetch(`${API_BASE_URL}/api/dns/zone?${params.toString()}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Błąd usuwania rekordu: ${response.status}`);
}

export async function queryDnsZone(name: string, type: DnsRecordType): Promise<DnsZoneQueryResult> {
  const response = await fetch(`${API_BASE_URL}/api/dns/zone/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type, value: "" }),
  });
  if (!response.ok) throw new Error(`Błąd zapytania DNS: ${response.status}`);
  return response.json();
}

export async function fetchHttpVersions(): Promise<HttpVersionTimeline[]> {
  const response = await fetch(`${API_BASE_URL}/api/http-versions`);
  if (!response.ok) throw new Error(`Błąd pobierania wersji HTTP: ${response.status}`);
  return response.json();
}

export async function fetchConceptTopics(): Promise<ConceptTopic[]> {
  const response = await fetch(`${API_BASE_URL}/api/concept-topics`);
  if (!response.ok) throw new Error(`Błąd pobierania tematów: ${response.status}`);
  return response.json();
}

export async function fetchConceptTopic(id: string): Promise<ConceptTopic> {
  const response = await fetch(`${API_BASE_URL}/api/concept-topics/${id}`);
  if (!response.ok) throw new Error(`Błąd pobierania tematu: ${response.status}`);
  return response.json();
}

export async function fetchProtocolPorts(): Promise<ProtocolPort[]> {
  const response = await fetch(`${API_BASE_URL}/api/protocol-ports`);
  if (!response.ok) throw new Error(`Błąd pobierania portów: ${response.status}`);
  return response.json();
}
