export interface SubnetCalculationResult {
  ip: string;
  ipBinary: string;
  maskDotted: string;
  maskBinary: string;
  prefixLength: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string | null;
  lastUsableHost: string | null;
  usableHostCount: number;
}

export interface Subnet {
  networkAddress: string;
  broadcastAddress: string;
  prefixLength: number;
  firstUsableHost: string | null;
  lastUsableHost: string | null;
  usableHostCount: number;
}

export interface SubnetExerciseQuestion {
  ip: string;
  prefixLength: number;
  difficulty: number;
}

export interface SubnetExerciseSubmission {
  ip: string;
  prefixLength: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  usableHostCount: number;
}

export interface SubnetExerciseResult {
  correct: boolean;
  expected: Subnet;
  mismatches: string[];
}
