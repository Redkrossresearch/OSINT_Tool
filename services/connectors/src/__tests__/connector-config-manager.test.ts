import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ConnectorConfigError,
  loadConnectorConfig,
  normalizeConnectorName,
  validateConnectorConfigs,
} from '../config/connector-config.js';

const emptyEnv = {};

describe('normalizeConnectorName', () => {
  it('normalizes a dash-prefixed connector name to an env-safe token', () => {
    assert.equal(normalizeConnectorName('web-fetch'), 'web_fetch');
    assert.equal(normalizeConnectorName('Web Fetch'), 'web_fetch');
  });
});

describe('loadConnectorConfig defaults', () => {
  it('applies framework defaults when no env is provided', () => {
    const config = loadConnectorConfig('web-fetch', emptyEnv);
    assert.equal(config.timeoutMs, 30_000);
    assert.equal(config.maxRetries, 3);
    assert.equal(config.rateLimit, undefined);
    assert.deepEqual(config.options, {});
  });

  it('reads global defaults from env', () => {
    const config = loadConnectorConfig('web-fetch', {
      CONNECTOR_TIMEOUT_MS: '5000',
      CONNECTOR_MAX_RETRIES: '2',
      CONNECTOR_RATE_LIMIT_MS: '1000',
    });
    assert.equal(config.timeoutMs, 5000);
    assert.equal(config.maxRetries, 2);
    assert.deepEqual(config.rateLimit, { requestsPerInterval: 1, intervalMs: 1000 });
  });
});

describe('loadConnectorConfig per-connector overrides', () => {
  it('prefers per-connector values over globals', () => {
    const config = loadConnectorConfig('dns-rdap', {
      CONNECTOR_TIMEOUT_MS: '5000',
      CONNECTOR_DNS_RDAP_TIMEOUT_MS: '7000',
      CONNECTOR_DNS_RDAP_MAX_RETRIES: '1',
    });
    assert.equal(config.timeoutMs, 7000);
    assert.equal(config.maxRetries, 1);
  });

  it('maps an API endpoint into options', () => {
    const config = loadConnectorConfig('cert-intel', {
      CONNECTOR_CERT_INTEL_API_ENDPOINT: 'https://crt.sh',
    });
    assert.equal(config.options.apiEndpoint, 'https://crt.sh');
  });

  it('maps generic connector options from CONNECTOR_<NAME>_OPTION_<KEY>', () => {
    const config = loadConnectorConfig('web-search', {
      CONNECTOR_WEB_SEARCH_OPTION_USER_AGENT: 'redkross/0.1',
      CONNECTOR_WEB_SEARCH_OPTION_REGION: 'us',
    });
    assert.equal(config.options.user_agent, 'redkross/0.1');
    assert.equal(config.options.region, 'us');
  });
});

describe('loadConnectorConfig validation', () => {
  it('fails with a clear error for an invalid timeout value', () => {
    assert.throws(
      () => loadConnectorConfig('web-fetch', { CONNECTOR_TIMEOUT_MS: 'not-a-number' }),
      (error: unknown) =>
        error instanceof ConnectorConfigError &&
        error.connectorName === 'web-fetch' &&
        error.envVar === 'CONNECTOR_TIMEOUT_MS',
    );
  });

  it('fails when a per-connector rate limit is not a positive integer', () => {
    assert.throws(
      () => loadConnectorConfig('dns-rdap', { CONNECTOR_DNS_RDAP_RATE_LIMIT_MS: '0' }),
      (error: unknown) => error instanceof ConnectorConfigError,
    );
  });
});

describe('validateConnectorConfigs', () => {
  it('loads and validates a set of connectors at startup', () => {
    const configs = validateConnectorConfigs(['web-fetch', 'dns-rdap'], {
      CONNECTOR_TIMEOUT_MS: '8000',
    });
    assert.equal(configs.length, 2);
    assert.ok(configs.every((config) => config.timeoutMs === 8000));
  });
});
