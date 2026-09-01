import type { Connector } from '../framework/connector-interface.js';

export class ConnectorRegistryError extends Error {
  public readonly code: 'DUPLICATE_CONNECTOR' | 'CONNECTOR_NOT_FOUND';

  public constructor(code: 'DUPLICATE_CONNECTOR' | 'CONNECTOR_NOT_FOUND', message: string) {
    super(message);
    this.name = 'ConnectorRegistryError';
    this.code = code;
  }
}

export interface ConnectorDescriptor {
  name: string;
  version: string;
  supportedObjectiveTypes: string[];
}

export class ConnectorRegistry {
  private readonly connectors = new Map<string, Connector>();

  public register(connector: Connector): void {
    if (this.connectors.has(connector.name)) {
      throw new ConnectorRegistryError(
        'DUPLICATE_CONNECTOR',
        `connector '${connector.name}' is already registered`,
      );
    }
    this.connectors.set(connector.name, connector);
  }

  public get(name: string): Connector {
    const connector = this.connectors.get(name);
    if (connector === undefined) {
      throw new ConnectorRegistryError('CONNECTOR_NOT_FOUND', `connector '${name}' was not found`);
    }
    return connector;
  }

  public all(): Connector[] {
    return [...this.connectors.values()];
  }

  public list(): ConnectorDescriptor[] {
    return this.all().map((connector) => ({
      name: connector.name,
      version: connector.version,
      supportedObjectiveTypes: connector.supportedObjectiveTypes,
    }));
  }
}
