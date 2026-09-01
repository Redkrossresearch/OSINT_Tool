import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ObjectiveType } from '@osint-tool/schemas';

import type { Connector } from '../framework/connector-interface.js';
import { ConnectorRegistry, ConnectorRegistryError } from '../registry/connector-registry.js';

const makeConnector = (name = 'web-fetch'): Connector => ({
  name,
  version: '1.0.0',
  supportedObjectiveTypes: [ObjectiveType.DOMAIN],
  configure: async () => {},
  collect: async function* () {},
  health: async () => ({ status: 'healthy', lastCheck: new Date() }),
});

describe('ConnectorRegistry', () => {
  it('registers and discovers a connector by name', () => {
    const registry = new ConnectorRegistry();
    const connector = makeConnector('dns-rdap');
    registry.register(connector);
    assert.equal(registry.get('dns-rdap'), connector);
  });

  it('returns all registered connectors', () => {
    const registry = new ConnectorRegistry();
    registry.register(makeConnector('web-fetch'));
    registry.register(makeConnector('cert-intel'));
    assert.equal(registry.all().length, 2);
  });

  it('lists connector descriptors without exposing the instance', () => {
    const registry = new ConnectorRegistry();
    registry.register(makeConnector('github-public'));
    const descriptors = registry.list();
    assert.deepEqual(descriptors, [
      {
        name: 'github-public',
        version: '1.0.0',
        supportedObjectiveTypes: ['DOMAIN'],
      },
    ]);
  });

  it('rejects registering a duplicate connector name', () => {
    const registry = new ConnectorRegistry();
    registry.register(makeConnector('web-fetch'));
    assert.throws(
      () => registry.register(makeConnector('web-fetch')),
      (error: unknown) =>
        error instanceof ConnectorRegistryError && error.code === 'DUPLICATE_CONNECTOR',
    );
  });

  it('throws when a connector is not found', () => {
    const registry = new ConnectorRegistry();
    assert.throws(
      () => registry.get('missing'),
      (error: unknown) =>
        error instanceof ConnectorRegistryError && error.code === 'CONNECTOR_NOT_FOUND',
    );
  });
});
