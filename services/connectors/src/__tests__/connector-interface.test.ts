import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ObjectiveType, type Observation as ObservationSchema } from '@osint-tool/schemas';

import type {
  Connector,
  ConnectorHealth,
  CollectorInput,
} from '../framework/connector-interface.js';
import type { ConnectorConfigInput } from '../framework/connector-config.js';

class StubConnector implements Connector {
  public readonly name = 'stub';
  public readonly version = '0.0.1';
  public readonly supportedObjectiveTypes = [ObjectiveType.IP];

  public async configure(_config: ConnectorConfigInput): Promise<void> {
    void _config;
  }

  public async *collect(_input: CollectorInput): AsyncGenerator<ObservationSchema> {
    void _input;
    yield* [];
  }

  public async health(): Promise<ConnectorHealth> {
    return { status: 'healthy', lastCheck: new Date() };
  }
}

describe('Connector interface', () => {
  it('is satisfied by a conforming implementation', async () => {
    const connector: Connector = new StubConnector();
    assert.equal(connector.name, 'stub');
    assert.deepEqual(connector.supportedObjectiveTypes, [ObjectiveType.IP]);
    const health = await connector.health();
    assert.equal(health.status, 'healthy');
  });
});
