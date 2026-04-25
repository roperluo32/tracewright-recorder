export type RecorderStatus = 'idle' | 'recording' | 'paused';

export type RecordingStepType = 'goto' | 'click' | 'fill' | 'select' | 'press';

export interface RecordingStep {
  id: string;
  type: RecordingStepType;
  selector?: string;
  value?: string;
  url?: string;
  key?: string;
  label: string;
  timestamp: number;
  redacted?: boolean;
}

export interface RecordingSession {
  id: string;
  title: string;
  url: string;
  startedAt: string;
  updatedAt: string;
  status: RecorderStatus;
  steps: RecordingStep[];
}

export interface RecorderSettings {
  testIdAttribute: string;
  maxHistoryItems: number;
  includeUrlAssertions: boolean;
}

export interface HistoryEntry extends RecordingSession {
  savedAt: string;
}

export interface StartRecordingMessage {
  type: 'TRACEWRIGHT_START';
  session: RecordingSession;
  settings: RecorderSettings;
}

export interface StopRecordingMessage {
  type: 'TRACEWRIGHT_STOP';
}

export interface PauseRecordingMessage {
  type: 'TRACEWRIGHT_PAUSE';
}

export interface ResumeRecordingMessage {
  type: 'TRACEWRIGHT_RESUME';
}

export interface GetStepsMessage {
  type: 'TRACEWRIGHT_GET_STEPS';
}

export interface StepsChangedMessage {
  type: 'TRACEWRIGHT_STEPS_CHANGED';
  steps: RecordingStep[];
  title: string;
  url: string;
}

export type RuntimeMessage =
  | StartRecordingMessage
  | StopRecordingMessage
  | PauseRecordingMessage
  | ResumeRecordingMessage
  | GetStepsMessage
  | StepsChangedMessage;
