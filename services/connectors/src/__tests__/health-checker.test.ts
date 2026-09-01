import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ObjectiveType } from '@osint-tool/schemas';

import type { Connector, ConnectorHealth } from '../framework/connector-interface.js';
import { ConnectorRegistry } from '../registry/connector-registry.js';
import { ConnectorHealthChecker } from '../registry/health-checker.js';

const makeConnector = (name: string, health: ConnectorHealth): Connector => ({
  name,
  version: '1.0.0',
  supportedObjectiveTypes: [ObjectiveType.DOMAIN],
  configure: async () => {},
  collect: async function* () {},
  health: async () => health,
});

describe('ConnectorHealthChecker', () => {
  it('records each connector health status', async () => {
    const registry = new ConnectorRegistry();
    registry.register(makeConnector('ok', { status: 'healthy', lastCheck: new Date() }));
    registry.register(
      makeConnector('down', { status: 'unavailable', lastCheck: new Date(), error: 'down' }),
    );

    const checker = new ConnectorHealthChecker(registry);
    const report = await checker.check();

    assert.equal(report.connectors.length, 2);
    const byName = new Map(report.connectors.map((r) => [r.connector_name, r]));
    assert.equal(byName.get('ok')?.status, 'healthy');
    assert.equal(byName.get('down')?.status, 'unavailable');
    assert.equal(byName.get('down')?.error, 'down');
  });

  it('reports unavailable and lastCheck when health() throws', async () => {
    const registry = new ConnectorRegistry();
    const failing: Connector = {
      name: 'broken',
      version: '1.0.0',
      supportedObjectiveTypes: [ObjectiveType.IP],
      configure: async () => {},
      collect: async function* () {},
      health: async () => {
        throw new Error('boom');
      },
    };
    registry.register(failing);

    const checker = new ConnectorHealthChecker(registry);
    const report = await checker.check();

    const record = report.connectors[0];
    assert.equal(record?.connector_name, 'broken');
    assert.equal(record?.status, 'unavailable');
    assert.equal(record?.error, 'boom');
    assert.ok(record?.lastCheck instanceof Date);
  });

  it('reports unavailable for connectors not yet checked', async () => {
    const registry = new ConnectorRegistry();
    registry.register(makeConnector('ok', { status: 'healthy', lastCheck: new Date() }));

    const checker = new ConnectorHealthChecker(registry);
    const report = await checker.status();

    assert.equal(report.connectors[0]?.status, 'unavailable');
    assert.equal(report.connectors[0]?.lastCheck, null);
  });
});
