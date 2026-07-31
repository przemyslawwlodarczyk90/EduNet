export interface ContainerStepEvent {
  stepId: number;
  scenarioId: string;
  stage: string;
  title: string;
  visualState: Record<string, string>;
  codeLineRef: string | null;
  description: string;
  timestampMs: number;
}

export interface ContainerScenarioErrorEvent {
  sessionId: string;
  message: string;
}
