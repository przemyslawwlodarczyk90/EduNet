export type LabProtocol = "TELNET" | "FTP" | "SMTP";

export interface LabSessionView {
  sessionId: string;
  protocol: LabProtocol;
  hostPort: number;
  expiresAt: string;
}
