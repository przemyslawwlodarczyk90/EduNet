export type OsiLayer =
  | "PHYSICAL"
  | "DATA_LINK"
  | "NETWORK"
  | "TRANSPORT"
  | "SESSION"
  | "PRESENTATION"
  | "APPLICATION";

export type TcpIpLayer = "NETWORK_ACCESS" | "INTERNET" | "TRANSPORT" | "APPLICATION";

export interface SimulationEvent {
  stepId: number;
  scenarioId: string;
  layer: OsiLayer;
  tcpIpLayer: TcpIpLayer;
  packetType: string;
  headers: Record<string, string>;
  codeLineRef: string | null;
  description: string;
  timestampMs: number;
  macAddress: string | null;
}

export interface ScenarioErrorEvent {
  sessionId: string;
  message: string;
}
