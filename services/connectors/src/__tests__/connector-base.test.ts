import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ObjectiveType, type Observation as ObservationSchema } from '@osint-tool/schemas';

import { BaseConnector, ConnectorError } from '../framework/connector-base.js';
import type { ConnectorConfig } from '../framework/connector-config.js';
import type { CollectorInput } from '../framework/connector-interface.js';

class TestConnector extends BaseConnector {
  public attempts = 0;
  public readonly runTimestamps: number[] = [];
  private readonly behavior: () => Promise<ObservationSchema | undefined>;

  public constructor(behavior: () => Promise<ObservationSchema | undefined>) {
    super({ name: 'test', version: '1.0.0', supportedObjectiveTypes: [ObjectiveType.DOMAIN] });
    this.behavior = behavior;
  }

  protected async *fetchObservations(input: CollectorInput): AsyncGenerator<ObservationSchema> {
    void input;
    const result = await this.request(async () => {
      this.attempts += 1;
      this.runTimestamps.push(Date.now());
      const value = await this.behavior();
      if (value === undefined) throw new Error('operation failed');
      return value;
    });
    if (result !== undefined) yield result;
  }
}

const observation = (): ObservationSchema => ({
  id: 'obs-1',
  evidence_id: 'ev-1',
  type: 'DNS_RECORD',
  data: {},
  confidence: 1,
  source_ref: {
    connector_name: 'test',
    query: 'example.com',
    timestamp: new Date(),
    parameters: {},
  },
  timestamp: new Date(),
});

describe('BaseConnector.configure', () => {
  it('requires configuration before collecting', async () => {
    const connector = new TestConnector(async () => observation());
    await assert.rejects(
      async () => {
        for await (const obs of connector.collect({} as CollectorInput)) {
          void obs;
        }
      },
      (error: unknown) => error instanceof ConnectorError && error.code === 'NOT_CONFIGURED',
    );
  });

  it('rejects an invalid configuration', async () => {
    const connector = new TestConnector(async () => observation());
    await assert.rejects(() =>
      connector.configure({ timeoutMs: -1 } as unknown as ConnectorConfig),
    );
  });
});

describe('BaseConnector.retry', () => {
  it('retries with exponential backoff until the operation succeeds', async () => {
    let count = 0;
    const connector = new TestConnector(async () => {
      count += 1;
      if (count < 3) throw new Error('transient');
      return observation();
    });
    await connector.configure({ timeoutMs: 1000, maxRetries: 3 });

    const collected: ObservationSchema[] = [];
    for await (const obs of connector.collect({} as CollectorInput)) {
      collected.push(obs);
    }

    assert.equal(count, 3);
    assert.equal(collected.length, 1);
    const health = await connector.health();
    assert.equal(health.status, 'healthy');
  });

  it('throws RETRIES_EXHAUSTED after exceeding max retries', async () => {
    const connector = new TestConnector(async () => {
      throw new Error('persistent');
    });
    await connector.configure({ timeoutMs: 1000, maxRetries: 2 });

    await assert.rejects(
      async () => {
        for await (const obs of connector.collect({} as CollectorInput)) {
          void obs;
        }
      },
      (error: unknown) => error instanceof ConnectorError && error.code === 'RETRIES_EXHAUSTED',
    );

    assert.equal(connector.attempts, 3);
    const health = await connector.health();
    assert.equal(health.status, 'degraded');
    assert.ok(health.error);
  });

  it('surfaces a timeout through the retry contract', async () => {
    const connector = new TestConnector(() => new Promise<ObservationSchema | undefined>(() => {}));
    await connector.configure({ timeoutMs: 5, maxRetries: 0 });

    await assert.rejects(
      async () => {
        for await (const obs of connector.collect({} as CollectorInput)) {
          void obs;
        }
      },
      (error: unknown) =>
        error instanceof ConnectorError &&
        error.code === 'RETRIES_EXHAUSTED' &&
        error.message.includes('timed out'),
    );
  });
});

describe('BaseConnector.rateLimit', () => {
  it('spaces requests according to the configured rate limit', async () => {
    const connector = new TestConnector(async () => observation());
    await connector.configure({
      timeoutMs: 1000,
      maxRetries: 0,
      rateLimit: { requestsPerInterval: 1, intervalMs: 60 },
    });

    for (let i = 0; i < 3; i += 1) {
      for await (const obs of connector.collect({} as CollectorInput)) {
        void obs;
      }
    }

    assert.equal(connector.runTimestamps.length, 3);
    const first = connector.runTimestamps[0] ?? 0;
    const last = connector.runTimestamps[2] ?? 0;
    assert.ok(last - first >= 100, `expected spacing, got ${last - first}ms`);
  });
});
