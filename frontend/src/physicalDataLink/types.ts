export interface TopologyNode {
  id: string;
  x: number;
  y: number;
}

export interface TopologyLink {
  from: string;
  to: string;
}

export interface NetworkTopology {
  id: string;
  name: string;
  description: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  signalPropagationDescription: string;
  failureBehaviorDescription: string;
}

export type MediumCategory = "COPPER" | "FIBER" | "WIFI" | "BLUETOOTH" | "CELLULAR";

export interface TransmissionMedium {
  id: string;
  category: MediumCategory;
  name: string;
  maxSpeed: string;
  yearIntroduced: string | null;
  description: string;
}

export interface WifiSecurityStandard {
  id: string;
  name: string;
  year: string;
  description: string;
  weakness: string;
}

export interface ArpCapturedPacket {
  id: number;
  type: "REQUEST" | "REPLY";
  senderIp: string;
  senderMac: string;
  targetIp: string;
}

export interface ArpTableValidationResult {
  correct: boolean;
  expected: Record<string, string>;
  mismatches: string[];
}
