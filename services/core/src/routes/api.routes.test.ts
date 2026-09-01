import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { describe, it } from 'node:test';

import { createApp, type CoreServices } from '../index.js';
import { NotFoundError } from '../services/errors.js';

const ids = {
  case: '123e4567-e89b-12d3-a456-426614174000',
};

const createTestServer = async (caseListError = false) => {
  const services = {
    caseService: {
      list: async () => {
        if (caseListError) throw new Error('database unavailable');
        return [];
      },
      getById: async () => {
        throw new NotFoundError('Case was not found');
      },
    },
    investigationService: { list: async () => [] },
    objectiveService: {},
  } as unknown as CoreServices;
  const server = createApp(services).listen(0);
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const address = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
};

const closeServer = async (server: ReturnType<ReturnType<typeof createApp>['listen']>) => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
};

describe('core API routes', () => {
  it('returns service data from a core endpoint', async () => {
    const { server, baseUrl } = await createTestServer();
    try {
      const response = await fetch(`${baseUrl}/api/cases`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), []);
    } finally {
      await closeServer(server);
    }
  });

  it('returns structured validation errors for invalid requests', async () => {
    const { server, baseUrl } = await createTestServer();
    try {
      const response = await fetch(`${baseUrl}/api/cases`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      });
      assert.equal(response.status, 400);
      const payload = (await response.json()) as { error: { code: string; details: unknown } };
      assert.equal(payload.error.code, 'VALIDATION_ERROR');
      assert.ok(payload.error.details);
    } finally {
      await closeServer(server);
    }
  });

  it('maps not-found service errors to 404', async () => {
    const { server, baseUrl } = await createTestServer();
    try {
      const response = await fetch(`${baseUrl}/api/cases/${ids.case}`);
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), {
        error: { code: 'NOT_FOUND', message: 'Case was not found' },
      });
    } finally {
      await closeServer(server);
    }
  });

  it('hides unexpected errors behind the internal error response', async () => {
    const { server, baseUrl } = await createTestServer(true);
    try {
      const response = await fetch(`${baseUrl}/api/cases`);
      assert.equal(response.status, 500);
      assert.deepEqual(await response.json(), {
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      });
    } finally {
      await closeServer(server);
    }
  });
});
