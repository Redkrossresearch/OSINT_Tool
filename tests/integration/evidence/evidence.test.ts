import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo, Server } from 'node:net';
import { createIntegrationApp } from '../app.ts';
import { resetDatabase, disconnectDatabase } from '../db.ts';

let server: Server;
let base: string;

before(async () => {
  const app = createIntegrationApp();
  server = app.listen(0);
  const addr = server.address() as AddressInfo;
  base = `http://127.0.0.1:${addr.port}`;
});

after(async () => {
  await resetDatabase();
  server.closeAllConnections?.();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await disconnectDatabase().catch(() => {});
});

const setupInvestigation = async () => {
  const c = (await (
    await fetch(`${base}/api/cases`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'C', created_by: randomUUID() }),
    })
  ).json()) as { id: string };
  const inv = (await (
    await fetch(`${base}/api/investigations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ case_id: c.id, objective: { type: 'PERSON', name: 'P' } }),
    })
  ).json()) as { id: string };
  return inv.id;
};

const postEvidence = (investigationId: string) =>
  fetch(`${base}/api/evidence`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-actor-id': 'collector' },
    body: JSON.stringify({
      investigation_id: investigationId,
      type: 'WEB_PAGE',
      source: {
        connector_name: 'web',
        query: 'https://example.com',
        timestamp: new Date().toISOString(),
        parameters: {},
      },
      content: '<html>example</html>',
      metadata: { type: 'WEB_PAGE', url: 'https://example.com', title: 'Example' },
    }),
  });

test('creates evidence with a SHA-256 hash', async () => {
  const invId = await setupInvestigation();
  const res = await postEvidence(invId);
  assert.equal(res.status, 201);
  const data = (await res.json()) as { id: string; hash: string };
  assert.match(data.hash, /^[A-Fa-f0-9]{64}$/);
});

test('lists evidence by investigation', async () => {
  const invId = await setupInvestigation();
  await postEvidence(invId);
  const list = (await (await fetch(`${base}/api/evidence?investigation_id=${invId}`)).json()) as unknown[];
  assert.ok(Array.isArray(list));
  assert.ok(list.length >= 1);
});

test('records provenance on creation', async () => {
  const invId = await setupInvestigation();
  const created = (await (await postEvidence(invId)).json()) as { id: string };
  const provenance = (await (await fetch(`${base}/api/evidence/${created.id}/provenance`)).json()) as unknown[];
  assert.ok(Array.isArray(provenance));
  assert.ok(provenance.length >= 1);
});

test('evidence is immutable (update/delete rejected)', async () => {
  const invId = await setupInvestigation();
  const created = (await (await postEvidence(invId)).json()) as { id: string };
  const patch = await fetch(`${base}/api/evidence/${created.id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: 'tampered' }),
  });
  assert.ok(patch.status >= 400 && patch.status < 500);
  const del = await fetch(`${base}/api/evidence/${created.id}`, { method: 'DELETE' });
  assert.ok(del.status >= 400 && del.status < 500);
});
