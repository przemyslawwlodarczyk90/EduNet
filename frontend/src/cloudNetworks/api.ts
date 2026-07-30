import { API_BASE_URL } from "../config";
import { loggedFetch } from "../lib/logger";
import type { CdnNode, LoadBalancerResult, LoadBalancerServer } from "./types";

export async function fetchCdnNodes(): Promise<CdnNode[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/cdn/nodes`);
  if (!response.ok) throw new Error(`Błąd pobierania węzłów CDN: ${response.status}`);
  return response.json();
}

export async function fetchLoadBalancerServers(): Promise<LoadBalancerServer[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/loadbalancer/servers`);
  if (!response.ok) throw new Error(`Błąd pobierania listy serwerów: ${response.status}`);
  return response.json();
}

export async function routeLoadBalancerRequests(requestCount: number, downServerIds: string[]): Promise<LoadBalancerResult> {
  const response = await loggedFetch(`${API_BASE_URL}/api/loadbalancer/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestCount, downServerIds }),
  });
  if (!response.ok) throw new Error(`Błąd symulacji load balancera: ${response.status}`);
  return response.json();
}
