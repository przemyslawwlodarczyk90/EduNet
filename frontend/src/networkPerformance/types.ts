export type PacketOutcome = "ON_TIME" | "DELAYED" | "LOST";

export interface PacketTransmissionEvent {
  packetIndex: number;
  sentAtMs: number;
  arrivedAtMs: number | null;
  outcome: PacketOutcome;
}

export interface NetworkQualityResult {
  events: PacketTransmissionEvent[];
  onTimeCount: number;
  delayedCount: number;
  lostCount: number;
  estimatedThroughputMbps: number;
}

export interface NetworkQualityRequest {
  bandwidthMbps: number;
  latencyMs: number;
  jitterMs: number;
  packetLossPercent: number;
}

export interface TerminalCommandResult {
  command: string;
  output: string;
}
