export type DnsRecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT";

export interface DnsRecord {
  name: string;
  type: DnsRecordType;
  value: string;
}

export interface DnsZoneQueryResult {
  name: string;
  type: DnsRecordType;
  values: string[];
  found: boolean;
}

export interface HttpTimelineEvent {
  resource: string;
  connectionId: number;
  startMs: number;
  endMs: number;
}

export interface HttpVersionTimeline {
  version: string;
  label: string;
  events: HttpTimelineEvent[];
  totalTimeMs: number;
  description: string;
}

export interface HttpHistoryMilestone {
  version: string;
  year: string;
  standardOrOrigin: string;
  keyInnovation: string;
  description: string;
}

export interface ConceptTopic {
  id: string;
  name: string;
  description: string;
  keyPoints: string[];
}

export interface ProtocolPort {
  protocol: string;
  port: number;
  transport: string;
}
