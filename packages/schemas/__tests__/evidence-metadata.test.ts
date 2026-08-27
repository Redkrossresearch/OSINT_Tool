import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EvidenceMetadataType,
  EvidenceMetadataTypeSchema,
  EvidenceMetadataSchema,
  WebPageMetadataSchema,
  DnsRecordMetadataSchema,
  CertificateMetadataSchema,
  GithubDataMetadataSchema,
  SearchResultMetadataSchema,
} from '../src/evidence-metadata.js';

const VALID_URL = 'https://example.com/page';
const VALID_FINGERPRINT = 'a'.repeat(64);
const VALID_DATE = '2024-01-15T10:30:00.000Z';

describe('EvidenceMetadataType', () => {
  it('should contain all five evidence metadata type values', () => {
    assert.equal(EvidenceMetadataType.WEB_PAGE, 'WEB_PAGE');
    assert.equal(EvidenceMetadataType.DNS_RECORD, 'DNS_RECORD');
    assert.equal(EvidenceMetadataType.CERTIFICATE, 'CERTIFICATE');
    assert.equal(EvidenceMetadataType.GITHUB_DATA, 'GITHUB_DATA');
    assert.equal(EvidenceMetadataType.SEARCH_RESULT, 'SEARCH_RESULT');
  });
});

describe('EvidenceMetadataTypeSchema', () => {
  it('should accept WEB_PAGE', () => {
    const r = EvidenceMetadataTypeSchema.safeParse('WEB_PAGE');
    assert.equal(r.success, true);
  });

  it('should accept DNS_RECORD', () => {
    const r = EvidenceMetadataTypeSchema.safeParse('DNS_RECORD');
    assert.equal(r.success, true);
  });

  it('should accept CERTIFICATE', () => {
    const r = EvidenceMetadataTypeSchema.safeParse('CERTIFICATE');
    assert.equal(r.success, true);
  });

  it('should accept GITHUB_DATA', () => {
    const r = EvidenceMetadataTypeSchema.safeParse('GITHUB_DATA');
    assert.equal(r.success, true);
  });

  it('should accept SEARCH_RESULT', () => {
    const r = EvidenceMetadataTypeSchema.safeParse('SEARCH_RESULT');
    assert.equal(r.success, true);
  });

  it('should reject invalid type', () => {
    const r = EvidenceMetadataTypeSchema.safeParse('UNKNOWN_TYPE');
    assert.equal(r.success, false);
  });
});

describe('WebPageMetadataSchema', () => {
  it('should accept valid WEB_PAGE metadata with required fields', () => {
    const valid = {
      type: EvidenceMetadataType.WEB_PAGE,
      url: VALID_URL,
      title: 'Example Page',
    };
    const r = WebPageMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
    if (r.success) {
      assert.equal(r.data.type, 'WEB_PAGE');
      assert.equal(r.data.url, VALID_URL);
      assert.equal(r.data.title, 'Example Page');
    }
  });

  it('should accept WEB_PAGE with optional common and type-specific fields', () => {
    const valid = {
      type: EvidenceMetadataType.WEB_PAGE,
      url: VALID_URL,
      title: 'Example Page',
      http_status: 200,
      final_url: 'https://example.com/redirected',
      response_time_ms: 145,
      collected_at: VALID_DATE,
      collector: 'web-scraper',
      notes: 'Static page',
    };
    const r = WebPageMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
  });

  it('should reject WEB_PAGE when url is missing', () => {
    const invalid = {
      type: EvidenceMetadataType.WEB_PAGE,
      title: 'Example Page',
    };
    const r = WebPageMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject WEB_PAGE when title is missing', () => {
    const invalid = {
      type: EvidenceMetadataType.WEB_PAGE,
      url: VALID_URL,
    };
    const r = WebPageMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject WEB_PAGE with invalid url format', () => {
    const invalid = {
      type: EvidenceMetadataType.WEB_PAGE,
      url: 'not-a-url',
      title: 'X',
    };
    const r = WebPageMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject WEB_PAGE with empty url or title', () => {
    const r1 = WebPageMetadataSchema.safeParse({ type: 'WEB_PAGE', url: '', title: 'X' });
    const r2 = WebPageMetadataSchema.safeParse({ type: 'WEB_PAGE', url: VALID_URL, title: '' });
    assert.equal(r1.success, false);
    assert.equal(r2.success, false);
  });
});

describe('DnsRecordMetadataSchema', () => {
  it('should accept valid DNS_RECORD metadata with required fields', () => {
    const valid = {
      type: EvidenceMetadataType.DNS_RECORD,
      record_type: 'A',
      record_name: 'example.com',
    };
    const r = DnsRecordMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
    if (r.success) {
      assert.equal(r.data.type, 'DNS_RECORD');
      assert.equal(r.data.record_type, 'A');
      assert.equal(r.data.record_name, 'example.com');
    }
  });

  it('should accept DNS_RECORD with valid record types (CNAME, MX, NS, TXT, AAAA)', () => {
    for (const rt of ['CNAME', 'MX', 'NS', 'TXT', 'AAAA', 'SOA', 'SRV', 'PTR', 'CAA']) {
      const r = DnsRecordMetadataSchema.safeParse({
        type: 'DNS_RECORD',
        record_type: rt,
        record_name: 'example.com',
      });
      assert.equal(r.success, true, `record_type ${rt} should be valid`);
    }
  });

  it('should accept DNS_RECORD with optional fields', () => {
    const valid = {
      type: EvidenceMetadataType.DNS_RECORD,
      record_type: 'A',
      record_name: 'example.com',
      resolver: '8.8.8.8',
      ttl: 300,
      collected_at: VALID_DATE,
    };
    const r = DnsRecordMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
  });

  it('should reject DNS_RECORD when record_type is missing', () => {
    const invalid = { type: 'DNS_RECORD', record_name: 'example.com' };
    const r = DnsRecordMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject DNS_RECORD when record_name is missing', () => {
    const invalid = { type: 'DNS_RECORD', record_type: 'A' };
    const r = DnsRecordMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject DNS_RECORD with invalid record_type', () => {
    const invalid = { type: 'DNS_RECORD', record_type: 'INVALID', record_name: 'example.com' };
    const r = DnsRecordMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });
});

describe('CertificateMetadataSchema', () => {
  it('should accept valid CERTIFICATE metadata with required fields', () => {
    const valid = {
      type: EvidenceMetadataType.CERTIFICATE,
      serial_number: '01:23:45:67:89:AB:CD:EF',
      subject: 'CN=example.com',
      issuer: 'CN=Let\'s Encrypt Authority X3',
      fingerprint_sha256: VALID_FINGERPRINT,
    };
    const r = CertificateMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
    if (r.success) {
      assert.equal(r.data.type, 'CERTIFICATE');
      assert.equal(r.data.fingerprint_sha256, VALID_FINGERPRINT);
    }
  });

  it('should accept CERTIFICATE with optional date fields', () => {
    const valid = {
      type: EvidenceMetadataType.CERTIFICATE,
      serial_number: '00:11:22',
      subject: 'CN=x',
      issuer: 'CN=y',
      fingerprint_sha256: VALID_FINGERPRINT,
      not_before: VALID_DATE,
      not_after: '2025-01-01T00:00:00Z',
    };
    const r = CertificateMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
  });

  it('should reject CERTIFICATE when serial_number is missing', () => {
    const invalid = {
      type: 'CERTIFICATE',
      subject: 'x',
      issuer: 'y',
      fingerprint_sha256: VALID_FINGERPRINT,
    };
    const r = CertificateMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject CERTIFICATE when subject is missing', () => {
    const invalid = {
      type: 'CERTIFICATE',
      serial_number: '1',
      issuer: 'y',
      fingerprint_sha256: VALID_FINGERPRINT,
    };
    const r = CertificateMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject CERTIFICATE when issuer is missing', () => {
    const invalid = {
      type: 'CERTIFICATE',
      serial_number: '1',
      subject: 'x',
      fingerprint_sha256: VALID_FINGERPRINT,
    };
    const r = CertificateMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject CERTIFICATE when fingerprint_sha256 is missing or invalid', () => {
    const missing = { type: 'CERTIFICATE', serial_number: '1', subject: 'x', issuer: 'y' };
    const short = {
      type: 'CERTIFICATE',
      serial_number: '1',
      subject: 'x',
      issuer: 'y',
      fingerprint_sha256: 'abcd',
    };
    const nonHex = {
      type: 'CERTIFICATE',
      serial_number: '1',
      subject: 'x',
      issuer: 'y',
      fingerprint_sha256: 'g'.repeat(64),
    };
    assert.equal(CertificateMetadataSchema.safeParse(missing).success, false);
    assert.equal(CertificateMetadataSchema.safeParse(short).success, false);
    assert.equal(CertificateMetadataSchema.safeParse(nonHex).success, false);
  });
});

describe('GithubDataMetadataSchema', () => {
  it('should accept valid GITHUB_DATA metadata with required fields', () => {
    const valid = {
      type: EvidenceMetadataType.GITHUB_DATA,
      repository: 'Redkrossresearch/OSINT_Tool',
      data_category: 'commit',
    };
    const r = GithubDataMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
    if (r.success) {
      assert.equal(r.data.type, 'GITHUB_DATA');
      assert.equal(r.data.repository, 'Redkrossresearch/OSINT_Tool');
    }
  });

  it('should accept GITHUB_DATA with all valid data_category values', () => {
    for (const dc of ['commit', 'issue', 'pr', 'user', 'repo', 'release', 'file']) {
      const r = GithubDataMetadataSchema.safeParse({
        type: 'GITHUB_DATA',
        repository: 'a/b',
        data_category: dc,
      });
      assert.equal(r.success, true, `data_category ${dc} should be valid`);
    }
  });

  it('should accept GITHUB_DATA with optional fields', () => {
    const valid = {
      type: EvidenceMetadataType.GITHUB_DATA,
      repository: 'a/b',
      data_category: 'pr',
      branch: 'team/1-core',
      query: 'is:open',
      result_count: 42,
    };
    const r = GithubDataMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
  });

  it('should reject GITHUB_DATA when repository is missing', () => {
    const invalid = { type: 'GITHUB_DATA', data_category: 'repo' };
    const r = GithubDataMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject GITHUB_DATA when data_category is missing or invalid', () => {
    const missing = { type: 'GITHUB_DATA', repository: 'a/b' };
    const invalidCat = { type: 'GITHUB_DATA', repository: 'a/b', data_category: 'wiki' };
    assert.equal(GithubDataMetadataSchema.safeParse(missing).success, false);
    assert.equal(GithubDataMetadataSchema.safeParse(invalidCat).success, false);
  });
});

describe('SearchResultMetadataSchema', () => {
  it('should accept valid SEARCH_RESULT metadata with required fields', () => {
    const valid = {
      type: EvidenceMetadataType.SEARCH_RESULT,
      engine: 'Google',
      query: 'OSINT tool github',
    };
    const r = SearchResultMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
    if (r.success) {
      assert.equal(r.data.type, 'SEARCH_RESULT');
      assert.equal(r.data.engine, 'Google');
      assert.equal(r.data.query, 'OSINT tool github');
    }
  });

  it('should accept SEARCH_RESULT with optional fields', () => {
    const valid = {
      type: EvidenceMetadataType.SEARCH_RESULT,
      engine: 'DuckDuckGo',
      query: 'test',
      result_position: 3,
      total_results: 1_500_000,
      source_url: 'https://duckduckgo.com/?q=test',
    };
    const r = SearchResultMetadataSchema.safeParse(valid);
    assert.equal(r.success, true);
  });

  it('should reject SEARCH_RESULT when engine is missing', () => {
    const invalid = { type: 'SEARCH_RESULT', query: 'test' };
    const r = SearchResultMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject SEARCH_RESULT when query is missing', () => {
    const invalid = { type: 'SEARCH_RESULT', engine: 'Bing' };
    const r = SearchResultMetadataSchema.safeParse(invalid);
    assert.equal(r.success, false);
  });

  it('should reject SEARCH_RESULT with empty engine or query', () => {
    const r1 = SearchResultMetadataSchema.safeParse({ type: 'SEARCH_RESULT', engine: '', query: 'q' });
    const r2 = SearchResultMetadataSchema.safeParse({ type: 'SEARCH_RESULT', engine: 'X', query: '' });
    assert.equal(r1.success, false);
    assert.equal(r2.success, false);
  });
});

describe('EvidenceMetadataSchema (discriminated union)', () => {
  it('should accept all 5 valid metadata types via union', () => {
    const samples = [
      { type: 'WEB_PAGE', url: VALID_URL, title: 'T' },
      { type: 'DNS_RECORD', record_type: 'A', record_name: 'x.com' },
      {
        type: 'CERTIFICATE',
        serial_number: '1',
        subject: 's',
        issuer: 'i',
        fingerprint_sha256: VALID_FINGERPRINT,
      },
      { type: 'GITHUB_DATA', repository: 'a/b', data_category: 'repo' },
      { type: 'SEARCH_RESULT', engine: 'X', query: 'q' },
    ];
    for (const s of samples) {
      const r = EvidenceMetadataSchema.safeParse(s);
      assert.equal(r.success, true, `${s.type} should pass through union`);
    }
  });

  it('should reject metadata with missing discriminator type', () => {
    const r = EvidenceMetadataSchema.safeParse({ url: VALID_URL, title: 'T' });
    assert.equal(r.success, false);
  });

  it('should reject metadata with invalid discriminator type', () => {
    const r = EvidenceMetadataSchema.safeParse({
      type: 'FAKE_TYPE',
      url: VALID_URL,
      title: 'T',
    });
    assert.equal(r.success, false);
  });

  it('should reject WEB_PAGE-typed object with DNS_RECORD-only wrong fields accepted as type', () => {
    const r = EvidenceMetadataSchema.safeParse({
      type: 'WEB_PAGE',
      record_type: 'A',
      record_name: 'x',
    });
    assert.equal(r.success, false);
  });

  it('should coerce collected_at / not_before / not_after dates when provided as ISO strings', () => {
    const r = EvidenceMetadataSchema.safeParse({
      type: 'WEB_PAGE',
      url: VALID_URL,
      title: 'T',
      collected_at: VALID_DATE,
    });
    assert.equal(r.success, true);
    if (r.success) {
      assert.ok(r.data.collected_at instanceof Date);
    }
  });
});
