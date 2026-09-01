import type { ConnectorConfig, ConnectorConfigInput } from '../framework/connector-config.js';
import { validateConnectorConfig } from '../framework/connector-config.js';

export interface ConnectorConfigErrorOptions {
  connectorName: string;
  envVar?: string;
  cause?: unknown;
}

export class ConnectorConfigError extends Error {
  public readonly connectorName: string;
  public readonly envVar?: string;
  public readonly cause?: unknown;

  public constructor(message: string, options: ConnectorConfigErrorOptions) {
    super(message);
    this.name = 'ConnectorConfigError';
    this.connectorName = options.connectorName;
    this.envVar = options.envVar;
    this.cause = options.cause;
  }
}

export type EnvMap = Record<string, string | undefined>;

const GLOBAL = {
  TIMEOUT_MS: 'CONNECTOR_TIMEOUT_MS',
  MAX_RETRIES: 'CONNECTOR_MAX_RETRIES',
  RATE_LIMIT_MS: 'CONNECTOR_RATE_LIMIT_MS',
} as const;

const DEFAULT_REQUESTS_PER_INTERVAL = 1;

export function normalizeConnectorName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function connectorEnvKey(name: string, suffix: string): string {
  return `CONNECTOR_${normalizeConnectorName(name).toUpperCase()}_${suffix}`;
}

function parsePositiveInt(
  value: string | undefined,
  envVar: string,
  connectorName: string,
): number | undefined {
  if (value === undefined || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ConnectorConfigError(`expected ${envVar} to be a positive integer, got '${value}'`, {
      connectorName,
      envVar,
    });
  }
  return parsed;
}

function readPerConnectorOption(connectorName: string, env: EnvMap): Record<string, unknown> {
  const options: Record<string, unknown> = {};
  const prefix = connectorEnvKey(connectorName, 'OPTION_');

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined || value === '') continue;
    if (key.startsWith(prefix)) {
      const optionKey = key.slice(prefix.length).toLowerCase();
      options[optionKey] = value;
    }
  }
  return options;
}

export function loadConnectorConfig(name: string, env: EnvMap = process.env): ConnectorConfig {
  const connectorName = name;

  const timeoutMs =
    parsePositiveInt(
      env[connectorEnvKey(name, 'TIMEOUT_MS')],
      connectorEnvKey(name, 'TIMEOUT_MS'),
      connectorName,
    ) ?? parsePositiveInt(env[GLOBAL.TIMEOUT_MS], GLOBAL.TIMEOUT_MS, connectorName);

  const maxRetries =
    parsePositiveInt(
      env[connectorEnvKey(name, 'MAX_RETRIES')],
      connectorEnvKey(name, 'MAX_RETRIES'),
      connectorName,
    ) ?? parsePositiveInt(env[GLOBAL.MAX_RETRIES], GLOBAL.MAX_RETRIES, connectorName);

  const intervalMs =
    parsePositiveInt(
      env[connectorEnvKey(name, 'RATE_LIMIT_MS')],
      connectorEnvKey(name, 'RATE_LIMIT_MS'),
      connectorName,
    ) ?? parsePositiveInt(env[GLOBAL.RATE_LIMIT_MS], GLOBAL.RATE_LIMIT_MS, connectorName);

  const apiEndpoint = env[connectorEnvKey(name, 'API_ENDPOINT')];
  const options = {
    ...(apiEndpoint === undefined || apiEndpoint === '' ? {} : { apiEndpoint }),
    ...readPerConnectorOption(name, env),
  };

  const input: ConnectorConfigInput = {
    ...(timeoutMs === undefined ? {} : { timeoutMs }),
    ...(maxRetries === undefined ? {} : { maxRetries }),
    ...(intervalMs === undefined
      ? {}
      : { rateLimit: { requestsPerInterval: DEFAULT_REQUESTS_PER_INTERVAL, intervalMs } }),
    options,
  };

  try {
    return validateConnectorConfig(input);
  } catch (error) {
    throw new ConnectorConfigError(`invalid configuration for connector '${connectorName}'`, {
      connectorName,
      cause: error,
    });
  }
}

export function validateConnectorConfigs(
  names: string[],
  env: EnvMap = process.env,
): ConnectorConfig[] {
  return names.map((name) => loadConnectorConfig(name, env));
}
