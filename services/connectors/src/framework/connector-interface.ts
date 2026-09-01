import type { Objective, ObjectiveType, Observation } from '@osint-tool/schemas';

import type { ConnectorConfigInput } from './connector-config.js';

export interface CollectorInput {
  objective: Objective;
  query: string;
}

export type ConnectorHealthStatus = 'healthy' | 'degraded' | 'unavailable';

export interface ConnectorHealth {
  status: ConnectorHealthStatus;
  lastCheck: Date;
  error?: string;
}

export interface Connector {
  name: string;
  version: string;
  supportedObjectiveTypes: ObjectiveType[];
  configure(config: ConnectorConfigInput): Promise<void>;
  collect(input: CollectorInput): AsyncGenerator<Observation>;
  health(): Promise<ConnectorHealth>;
}
