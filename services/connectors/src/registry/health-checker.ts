import type { ConnectorHealthStatus } from '../framework/connector-interface.js';
import type { ConnectorRegistry } from './connector-registry.js';

export interface ConnectorHealthRecord {
  connector_name: string;
  status: ConnectorHealthStatus;
  lastCheck: Date | null;
  error?: string;
}

export interface ConnectorHealthReport {
  checkedAt: Date;
  connectors: ConnectorHealthRecord[];
}

const DEFAULT_INTERVAL_MS = 60_000;

export class ConnectorHealthChecker {
  private readonly records = new Map<string, ConnectorHealthRecord>();
  private timer: ReturnType<typeof setInterval> | undefined;

  public constructor(
    private readonly registry: ConnectorRegistry,
    private readonly intervalMs: number = DEFAULT_INTERVAL_MS,
  ) {}

  public async check(): Promise<ConnectorHealthReport> {
    const checkedAt = new Date();
    for (const connector of this.registry.all()) {
      this.records.set(connector.name, await this.checkOne(connector.name));
    }
    return this.report(checkedAt);
  }

  public async status(): Promise<ConnectorHealthReport> {
    return this.report(new Date());
  }

  public start(): void {
    if (this.timer !== undefined) return;
    void this.check();
    this.timer = setInterval(() => void this.check(), this.intervalMs);
  }

  public stop(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private async checkOne(name: string): Promise<ConnectorHealthRecord> {
    const lastCheck = new Date();
    try {
      const connector = this.registry.get(name);
      const health = await connector.health();
      return {
        connector_name: name,
        status: health.status,
        lastCheck,
        ...(health.error === undefined ? {} : { error: health.error }),
      };
    } catch (error) {
      return {
        connector_name: name,
        status: 'unavailable',
        lastCheck,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private report(checkedAt: Date): ConnectorHealthReport {
    return {
      checkedAt,
      connectors: this.registry.all().map((connector) => {
        const record = this.records.get(connector.name);
        if (record === undefined) {
          return {
            connector_name: connector.name,
            status: 'unavailable' as const,
            lastCheck: null,
          };
        }
        return record;
      }),
    };
  }
}
