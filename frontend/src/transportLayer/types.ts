export type DuplexModeValue = "FULL" | "HALF";

export interface DuplexMode {
  id: string;
  technology: string;
  mode: DuplexModeValue;
  description: string;
}
