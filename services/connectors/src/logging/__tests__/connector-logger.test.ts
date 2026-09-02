import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ConnectorLogger, LogLevel, type LogEntry } from '../connector-logger.js';

function collect(output: (entry: LogEntry) => void): ConnectorLogger {
  return new ConnectorLogger({ level: LogLevel.DEBUG, output });
}

function captureEntries(): { entries: LogEntry[]; logger: ConnectorLogger } {
  const entries: LogEntry[] = [];
  const logger = collect((entry) => entries.push(entry));
  return { entries, logger };
}

describe('ConnectorLogger', () => {
  it('produces valid JSON-compatible log entries', () => {
    const { entries, logger } = captureEntries();
    logger.info('web-fetch', 'test message');

    assert.equal(entries.length, 1);
    const entry = entries[0]!;
    assert.ok(typeof entry.timestamp === 'string');
    assert.ok(entry.timestamp.endsWith('Z'));
    assert.equal(entry.levelName, 'INFO');
    assert.equal(entry.connectorName, 'web-fetch');
    assert.equal(entry.event, 'INFO');
    assert.equal(entry.message, 'test message');
  });

  it('serialises entries to JSON via default output', () => {
    const lines: string[] = [];
    const logger = new ConnectorLogger({
      level: LogLevel.DEBUG,
      output: (entry) => lines.push(JSON.stringify(entry)),
    });

    logger.info('dns-rdap', 'hello');
    assert.equal(lines.length, 1);
    const parsed = JSON.parse(lines[0]!) as LogEntry;
    assert.equal(parsed.connectorName, 'dns-rdap');
  });
});

describe('collection lifecycle logging', () => {
  it('logs COLLECTION_START with query and objectiveType', () => {
    const { entries, logger } = captureEntries();
    logger.collectionStart('web-fetch', 'https://example.com', 'DOMAIN');

    assert.equal(entries.length, 1);
    const entry = entries[0]!;
    assert.equal(entry.event, 'COLLECTION_START');
    assert.equal(entry.levelName, 'INFO');
    assert.equal(entry.metadata?.query, 'https://example.com');
    assert.equal(entry.metadata?.objectiveType, 'DOMAIN');
  });

  it('logs COLLECTION_START without objectiveType when omitted', () => {
    const { entries, logger } = captureEntries();
    logger.collectionStart('cert-intel', 'example.com');

    const entry = entries[0]!;
    assert.equal(entry.event, 'COLLECTION_START');
    assert.equal(entry.metadata?.query, 'example.com');
    assert.equal(entry.metadata?.objectiveType, undefined);
  });

  it('logs COLLECTION_END with resultCount and durationMs', () => {
    const { entries, logger } = captureEntries();
    logger.collectionEnd('dns-rdap', 'example.com', 42, 150);

    assert.equal(entries.length, 1);
    const entry = entries[0]!;
    assert.equal(entry.event, 'COLLECTION_END');
    assert.equal(entry.levelName, 'INFO');
    assert.equal(entry.metadata?.resultCount, 42);
    assert.equal(entry.metadata?.durationMs, 150);
    assert.equal(entry.metadata?.query, 'example.com');
  });
});

describe('query logging', () => {
  it('logs a query with parameters', () => {
    const { entries, logger } = captureEntries();
    logger.queryLogged('github-public', 'repos/redkross', { per_page: 30 });

    const entry = entries[0]!;
    assert.equal(entry.event, 'QUERY');
    assert.equal(entry.metadata?.query, 'repos/redkross');
    assert.deepEqual(entry.metadata?.parameters, { per_page: 30 });
  });

  it('logs a query without parameters', () => {
    const { entries, logger } = captureEntries();
    logger.queryLogged('web-search', 'osint tools');

    const entry = entries[0]!;
    assert.equal(entry.event, 'QUERY');
    assert.equal(entry.metadata?.query, 'osint tools');
    assert.equal(entry.metadata?.parameters, undefined);
  });
});

describe('error logging', () => {
  it('logs an error with code, message, and cause', () => {
    const { entries, logger } = captureEntries();
    logger.error('web-fetch', 'request failed', {
      code: 'TIMEOUT',
      message: 'operation timed out',
      cause: 'ETIMEDOUT',
    });

    const entry = entries[0]!;
    assert.equal(entry.event, 'ERROR');
    assert.equal(entry.levelName, 'ERROR');
    assert.equal(entry.message, 'request failed');
    assert.ok(entry.error);
    assert.equal(entry.error!.code, 'TIMEOUT');
    assert.equal(entry.error!.message, 'operation timed out');
    assert.equal(entry.error!.cause, 'ETIMEDOUT');
  });

  it('logs an error without an error detail object', () => {
    const { entries, logger } = captureEntries();
    logger.error('dns-rdap', 'unexpected failure');

    const entry = entries[0]!;
    assert.equal(entry.event, 'ERROR');
    assert.equal(entry.error, undefined);
  });
});

describe('warning logging', () => {
  it('logs a warning with metadata', () => {
    const { entries, logger } = captureEntries();
    logger.warning('cert-intel', 'rate limit approaching', { remaining: 2 });

    const entry = entries[0]!;
    assert.equal(entry.event, 'WARNING');
    assert.equal(entry.levelName, 'WARN');
    assert.equal(entry.message, 'rate limit approaching');
    assert.equal(entry.metadata?.remaining, 2);
  });

  it('logs a warning without metadata', () => {
    const { entries, logger } = captureEntries();
    logger.warning('web-fetch', 'degraded response');

    const entry = entries[0]!;
    assert.equal(entry.event, 'WARNING');
    assert.equal(entry.metadata, undefined);
  });
});

describe('info and debug logging', () => {
  it('logs an info entry', () => {
    const { entries, logger } = captureEntries();
    logger.info('web-search', 'results parsed', { count: 10 });

    const entry = entries[0]!;
    assert.equal(entry.event, 'INFO');
    assert.equal(entry.levelName, 'INFO');
    assert.equal(entry.metadata?.count, 10);
  });

  it('logs a debug entry', () => {
    const { entries, logger } = captureEntries();
    logger.debug('dns-rdap', 'raw response received');

    const entry = entries[0]!;
    assert.equal(entry.event, 'DEBUG');
    assert.equal(entry.levelName, 'DEBUG');
  });
});

describe('log level filtering', () => {
  it('suppresses entries below the configured level', () => {
    const entries: LogEntry[] = [];
    const warnLogger = new ConnectorLogger({
      level: LogLevel.WARN,
      output: (entry) => entries.push(entry),
    });

    warnLogger.debug('a', 'debug msg');
    warnLogger.info('a', 'info msg');
    warnLogger.warning('a', 'warn msg');
    warnLogger.error('a', 'error msg');

    assert.equal(entries.length, 2);
    assert.equal(entries[0]!.event, 'WARNING');
    assert.equal(entries[1]!.event, 'ERROR');
  });

  it('defaults to INFO level when no level is specified', () => {
    const entries: LogEntry[] = [];
    const logger = new ConnectorLogger({ output: (entry) => entries.push(entry) });

    logger.debug('c', 'should be suppressed');
    logger.info('c', 'should appear');

    assert.equal(entries.length, 1);
    assert.equal(entries[0]!.event, 'INFO');
  });
});
