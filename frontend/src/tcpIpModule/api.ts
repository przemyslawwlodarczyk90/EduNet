import { API_BASE_URL } from "../config";
import { loggedFetch } from "../lib/logger";
import type { TcpIpLayerInfo } from "./types";

export async function fetchTcpIpLayers(): Promise<TcpIpLayerInfo[]> {
  const response = await loggedFetch(`${API_BASE_URL}/api/tcpip-layers`);
  if (!response.ok) throw new Error(`Błąd pobierania warstw TCP/IP: ${response.status}`);
  return response.json();
}
