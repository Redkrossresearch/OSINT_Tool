import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { describe, it } from 'node:test';

import express from 'express';
import { ObjectiveType } from '@osint-tool/schemas';

import type { Connector } from '../framework/connector-interface.js';
import { ConnectorRegistry } from '../registry/connector-registry.js';
import { ConnectorHealthChecker } from '../registry/health-checker.js';
import { createConnectorRouter } from '../routes/connector.routes.js';

const makeConnector = (name: string): Connector => ({
  name,
  version: '1.0.0',
  supportedObjectiveTypes: [ObjectiveType.DOMAIN],
  configure: async () => {},
  collect: async function* () {},
  health: async () => ({ status: 'healthy', lastCheck: new Date() }),
});

const createServer = async () => {
  const registry = new ConnectorRegistry();
  registry.register(makeConnector('web-fetch'));
  registry.register(makeConnector('dns-rdap'));
  const healthChecker = new ConnectorHealthChecker(registry);
  await healthChecker.check();

  const app = express();
  app.use('/api/connectors', createConnectorRouter(registry, healthChecker));
  const server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const address = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
};

const closeServer = async (server: ReturnType<ReturnType<typeof express>['listen']>) => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
};

describe('connector API routes', () => {
  it('lists registered connectors', async () => {
    const { server, baseUrl } = await createServer();
    try {
      const response = await fetch(`${baseUrl}/api/connectors`);
      assert.equal(response.status, 200);
      const payload = (await response.json()) as Array<{ name: string }>;
      assert.equal(payload.length, 2);
      assert.deepEqual(payload.map((c) => c.name).sort(), ['dns-rdap', 'web-fetch']);
    } finally {
      await closeServer(server);
    }
  });

  it('exposes connector health status', async () => {
    const { server, baseUrl } = await createServer();
    try {
      const response = await fetch(`${baseUrl}/api/connectors/health`);
      assert.equal(response.status, 200);
      const payload = (await response.json()) as {
        checkedAt: string;
        connectors: Array<{ connector_name: string; status: string }>;
      };
      assert.equal(payload.connectors.length, 2);
      assert.ok(payload.connectors.every((record) => record.status === 'healthy'));
    } finally {
      await closeServer(server);
    }
  });
});
