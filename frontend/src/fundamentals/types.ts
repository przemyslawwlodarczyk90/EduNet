import type { OsiLayer } from "../simulation/types";

export interface NetworkType {
  id: string;
  name: string;
  approximateRange: string;
  description: string;
  example: string;
}

export interface CommunicationStep {
  from: string;
  to: string;
  label: string;
}

export interface NetworkArchitecture {
  id: string;
  title: string;
  description: string;
  participants: string[];
  steps: CommunicationStep[];
}

export type DeviceBehavior =
  | "REPEAT_SIGNAL"
  | "SELECTIVE_FORWARD"
  | "ROUTE"
  | "MODULATE"
  | "FILTER"
  | "TRANSLATE_NETWORKS"
  | "DISTRIBUTE"
  | "RELAY_APPLICATION";

export interface NetworkDevice {
  id: string;
  name: string;
  osiLayers: OsiLayer[];
  description: string;
  behavior: DeviceBehavior;
  behaviorDescription: string;
}
