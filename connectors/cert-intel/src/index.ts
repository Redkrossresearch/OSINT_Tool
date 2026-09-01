import { createHash, randomUUID } from 'node:crypto';

import {
  ObjectiveType,
  EvidenceMetadataType,
  type Observation,
  type SourceRef,
} from '@osint-tool/schemas';
import { BaseConnector } from '../../../services/connectors/src/framework/connector-base.js';
import type { CollectorInput } from '../../../services/connectors/src/framework/connector-interface.js';

const DEFAULT_CONFIDENCE = 0.95;
const DEFAULT_CRTSH_BASE_URL = 'https://crt.sh';

export interface CrtShCertificateEntry {
  issuer_ca_id?: number;
  issuer_name?: string;
  common_name?: string;
  name_value?: string;
  id?: number;
  entry_timestamp?: string;
  not_before?: string;
  not_after?: string;
  serial_number?: string;
  [key: string]: unknown;
}

export interface CertIntelConnectorOptions {
  crtShBaseUrl?: string;
  fetchFn?: typeof fetch;
}

export class CertIntelConnector extends BaseConnector {
  private readonly crtShBaseUrl: string;
  private readonly fetchFn: typeof fetch;

  public constructor(options: CertIntelConnectorOptions = {}) {
    super({
      name: 'cert-intel',
      version: '1.0.0',
      supportedObjectiveTypes: [ObjectiveType.DOMAIN, ObjectiveType.COMPANY],
    });

    this.crtShBaseUrl = (options.crtShBaseUrl ?? DEFAULT_CRTSH_BASE_URL).replace(/\/+$/, '');
    this.fetchFn = options.fetchFn ?? globalThis.fetch;
  }

  protected async *fetchObservations(input: CollectorInput): AsyncGenerator<Observation> {
    const rawQuery = input.query.trim();
    if (rawQuery.length === 0) {
      throw new Error('cert-intel: query must not be empty');
    }

    const cleanQuery = sanitizeQuery(rawQuery);

    const sourceRef: SourceRef = {
      connector_name: this.name,
      query: cleanQuery,
      timestamp: new Date(),
      parameters: {
        objective_type: input.objective.type,
      },
    };

    const certificates = await this.queryCrtSh(cleanQuery);
    const seenFingerprints = new Set<string>();

    for (const cert of certificates) {
      const observation = this.createCertificateObservation(cert, cleanQuery, sourceRef);
      if (observation && !seenFingerprints.has(observation.data.fingerprint_sha256 as string)) {
        seenFingerprints.add(observation.data.fingerprint_sha256 as string);
        yield observation;
      }
    }
  }

  private async queryCrtSh(query: string): Promise<CrtShCertificateEntry[]> {
    const url = `${this.crtShBaseUrl}/?q=${encodeURIComponent(query)}&output=json`;

    try {
      return await this.request(async () => {
        const response = await this.fetchFn(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'osint-tool-cert-intel-connector/1.0.0',
          },
        });

        if (response.status === 404 || response.status === 400) {
          return [];
        }

        if (!response.ok) {
          throw new Error(`crt.sh request failed with HTTP ${response.status}`);
        }

        const text = await response.text();
        if (!text || text.trim().length === 0) {
          return [];
        }

        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            return data as CrtShCertificateEntry[];
          }
          return [];
        } catch {
          // If crt.sh returned non-JSON error or HTML
          return [];
        }
      });
    } catch {
      return [];
    }
  }

  private createCertificateObservation(
    cert: CrtShCertificateEntry,
    targetQuery: string,
    sourceRef: SourceRef,
  ): Observation | null {
    const now = new Date();

    const subject = cert.common_name || extractPrimaryDomain(cert.name_value) || targetQuery;
    const issuer = cert.issuer_name || 'Unknown Issuer';
    const serialNumber = normalizeSerialNumber(cert.serial_number, cert.id);
    const fingerprintSha256 = generateFingerprint(cert, serialNumber, issuer, subject);

    const domains = extractDomains(cert.name_value, cert.common_name);

    const notBefore = parseDate(cert.not_before);
    const notAfter = parseDate(cert.not_after);

    const payload: Record<string, unknown> = {
      type: EvidenceMetadataType.CERTIFICATE,
      serial_number: serialNumber,
      subject,
      issuer,
      fingerprint_sha256: fingerprintSha256,
      domains,
      crtsh_id: cert.id,
    };

    if (notBefore) {
      payload.not_before = notBefore;
    }
    if (notAfter) {
      payload.not_after = notAfter;
    }

    return {
      id: randomUUID(),
      evidence_id: randomUUID(),
      type: EvidenceMetadataType.CERTIFICATE,
      data: payload,
      confidence: DEFAULT_CONFIDENCE,
      source_ref: {
        ...sourceRef,
        timestamp: now,
        parameters: {
          ...sourceRef.parameters,
          subject,
          issuer,
        },
      },
      timestamp: now,
    };
  }
}

function sanitizeQuery(query: string): string {
  let cleaned = query.trim();
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/\/.*$/, '');
  cleaned = cleaned.replace(/:\d+$/, '');
  return cleaned.toLowerCase();
}

function extractPrimaryDomain(nameValue?: string): string | undefined {
  if (!nameValue) return undefined;
  const first = nameValue.split('\n')[0]?.trim();
  return first && first.length > 0 ? first : undefined;
}

function extractDomains(nameValue?: string, commonName?: string): string[] {
  const domains = new Set<string>();

  if (commonName) {
    domains.add(commonName.trim().toLowerCase());
  }

  if (nameValue) {
    const lines = nameValue.split('\n');
    for (const line of lines) {
      const clean = line.trim().toLowerCase();
      if (clean.length > 0) {
        domains.add(clean);
      }
    }
  }

  return Array.from(domains);
}

function normalizeSerialNumber(serialNumber?: string, id?: number): string {
  if (serialNumber && serialNumber.trim().length > 0) {
    return serialNumber.trim();
  }
  if (id !== undefined) {
    return id.toString(16);
  }
  return randomUUID().replace(/-/g, '');
}

function generateFingerprint(
  cert: CrtShCertificateEntry,
  serialNumber: string,
  issuer: string,
  subject: string,
): string {
  // If a valid 64-hex SHA-256 fingerprint is already provided
  if (
    typeof cert.fingerprint_sha256 === 'string' &&
    /^[A-Fa-f0-9]{64}$/.test(cert.fingerprint_sha256)
  ) {
    return cert.fingerprint_sha256.toLowerCase();
  }

  // Generate deterministic SHA-256 fingerprint
  const seed = `${cert.id || ''}:${serialNumber}:${issuer}:${subject}:${cert.not_before || ''}:${cert.not_after || ''}`;
  return createHash('sha256').update(seed).digest('hex');
}

function parseDate(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export { CertIntelConnector as default };
