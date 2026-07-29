import { API_BASE_URL } from "../config";
import type { TcpIpLayerInfo } from "./types";

export async function fetchTcpIpLayers(): Promise<TcpIpLayerInfo[]> {
  const response = await fetch(`${API_BASE_URL}/api/tcpip-layers`);
  if (!response.ok) throw new Error(`Błąd pobierania warstw TCP/IP: ${response.status}`);
  return response.json();
}
