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
  await resetDatabase().catch(() => {});
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

test('creates an objective for an investigation', async () => {
  const invId = await setupInvestigation();
  const res = await fetch(`${base}/api/objectives`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ investigation_id: invId, objective: { type: 'DOMAIN', domain: 'example.com' } }),
  });
  assert.equal(res.status, 201);
  const data = (await res.json()) as { id: string; type: string };
  assert.equal(data.type, 'DOMAIN');
});

test('rejects objective without investigation_id (400)', async () => {
  const res = await fetch(`${base}/api/objectives`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ objective: { type: 'DOMAIN', domain: 'example.com' } }),
  });
  assert.equal(res.status, 400);
});

test('gets and deletes an objective', async () => {
  const invId = await setupInvestigation();
  const created = (await (
    await fetch(`${base}/api/objectives`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ investigation_id: invId, objective: { type: 'IP', ip_address: '8.8.8.8' } }),
    })
  ).json()) as { id: string };
  const got = await fetch(`${base}/api/objectives/${created.id}`);
  assert.equal(got.status, 200);
  const del = await fetch(`${base}/api/objectives/${created.id}`, { method: 'DELETE' });
  assert.equal(del.status, 204);
  const missing = await fetch(`${base}/api/objectives/${created.id}`);
  assert.equal(missing.status, 404);
});
