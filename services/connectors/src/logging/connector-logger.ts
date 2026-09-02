export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export type LogEventType =
  | 'COLLECTION_START'
  | 'COLLECTION_END'
  | 'QUERY'
  | 'ERROR'
  | 'WARNING'
  | 'INFO'
  | 'DEBUG';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  levelName: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  connectorName: string;
  event: LogEventType;
  message: string;
  metadata?: Record<string, unknown>;
  error?: {
    code?: string;
    message: string;
    cause?: string;
  };
}

export interface ConnectorLoggerOptions {
  level?: LogLevel;
  output?: (entry: LogEntry) => void;
}

const LEVEL_NAMES: Record<LogLevel, LogEntry['levelName']> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

function defaultOutput(entry: LogEntry): void {
  process.stdout.write(JSON.stringify(entry) + '\n');
}

export class ConnectorLogger {
  private readonly minLevel: LogLevel;
  private readonly output: (entry: LogEntry) => void;

  public constructor(options: ConnectorLoggerOptions = {}) {
    this.minLevel = options.level ?? LogLevel.INFO;
    this.output = options.output ?? defaultOutput;
  }

  public collectionStart(
    connectorName: string,
    query: string,
    objectiveType?: string,
  ): void {
    this.log({
      connectorName,
      event: 'COLLECTION_START',
      level: LogLevel.INFO,
      message: `collection started`,
      metadata: { query, ...(objectiveType !== undefined ? { objectiveType } : {}) },
    });
  }

  public collectionEnd(
    connectorName: string,
    query: string,
    resultCount: number,
    durationMs: number,
  ): void {
    this.log({
      connectorName,
      event: 'COLLECTION_END',
      level: LogLevel.INFO,
      message: `collection completed`,
      metadata: { query, resultCount, durationMs },
    });
  }

  public queryLogged(
    connectorName: string,
    query: string,
    parameters?: Record<string, unknown>,
  ): void {
    this.log({
      connectorName,
      event: 'QUERY',
      level: LogLevel.INFO,
      message: `query executed`,
      metadata: { query, ...(parameters !== undefined ? { parameters } : {}) },
    });
  }

  public error(
    connectorName: string,
    message: string,
    error?: { code?: string; message: string; cause?: string },
  ): void {
    this.log({
      connectorName,
      event: 'ERROR',
      level: LogLevel.ERROR,
      message,
      ...(error !== undefined ? { error } : {}),
    });
  }

  public warning(connectorName: string, message: string, metadata?: Record<string, unknown>): void {
    this.log({
      connectorName,
      event: 'WARNING',
      level: LogLevel.WARN,
      message,
      ...(metadata !== undefined ? { metadata } : {}),
    });
  }

  public info(connectorName: string, message: string, metadata?: Record<string, unknown>): void {
    this.log({
      connectorName,
      event: 'INFO',
      level: LogLevel.INFO,
      message,
      ...(metadata !== undefined ? { metadata } : {}),
    });
  }

  public debug(connectorName: string, message: string, metadata?: Record<string, unknown>): void {
    this.log({
      connectorName,
      event: 'DEBUG',
      level: LogLevel.DEBUG,
      message,
      ...(metadata !== undefined ? { metadata } : {}),
    });
  }

  private log(partial: Omit<LogEntry, 'timestamp' | 'levelName'>): void {
    if (partial.level < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      levelName: LEVEL_NAMES[partial.level],
      ...partial,
    };

    this.output(entry);
  }
}
