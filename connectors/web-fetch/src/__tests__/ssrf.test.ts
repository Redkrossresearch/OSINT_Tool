import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  SsrfError,
  isNonPublicAddress,
  parseTargetUrl,
  resolvePublicTarget,
  validatePublicUrl,
} from '../ssrf.js';

describe('parseTargetUrl', () => {
  it('accepts http and https URLs', () => {
    assert.equal(parseTargetUrl('https://example.com/path').protocol, 'https:');
    assert.equal(parseTargetUrl('http://example.com').protocol, 'http:');
  });

  it('rejects non-http(s) schemes', () => {
    for (const bad of ['file:///etc/passwd', 'ftp://example.com', 'gopher://example.com']) {
      assert.throws(() => parseTargetUrl(bad), SsrfError);
    }
  });

  it('rejects malformed URLs', () => {
    assert.throws(() => parseTargetUrl('not a url'), SsrfError);
    assert.throws(() => parseTargetUrl(''), SsrfError);
    assert.throws(() => parseTargetUrl('http://'), SsrfError);
  });

  it('rejects URLs that embed credentials', () => {
    assert.throws(() => parseTargetUrl('http://user:pass@example.com/'), SsrfError);
    assert.throws(() => parseTargetUrl('http://user@example.com/'), SsrfError);
  });
});

describe('isNonPublicAddress', () => {
  it('rejects an invalid IP string', () => {
    assert.throws(() => isNonPublicAddress('definitely-not-an-ip'), SsrfError);
  });

  it('flags loopback addresses', () => {
    assert.equal(isNonPublicAddress('127.0.0.1'), true);
    assert.equal(isNonPublicAddress('127.0.0.0'), true);
    assert.equal(isNonPublicAddress('::1'), true);
    assert.equal(isNonPublicAddress('::'), true);
  });

  it('flags private ranges', () => {
    assert.equal(isNonPublicAddress('10.0.0.1'), true);
    assert.equal(isNonPublicAddress('10.255.255.255'), true);
    assert.equal(isNonPublicAddress('172.16.0.1'), true);
    assert.equal(isNonPublicAddress('172.31.255.255'), true);
    assert.equal(isNonPublicAddress('192.168.1.1'), true);
    assert.equal(isNonPublicAddress('fd00::1'), true);
    assert.equal(isNonPublicAddress('fc00::1'), true);
  });

  it('flags link-local and CGNAT ranges', () => {
    assert.equal(isNonPublicAddress('169.254.169.254'), true);
    assert.equal(isNonPublicAddress('fe80::1'), true);
    assert.equal(isNonPublicAddress('100.64.0.1'), true);
    assert.equal(isNonPublicAddress('100.127.255.255'), true);
  });

  it('flags multicast, reserved, and documentation ranges', () => {
    assert.equal(isNonPublicAddress('224.0.0.1'), true);
    assert.equal(isNonPublicAddress('239.255.255.255'), true);
    assert.equal(isNonPublicAddress('240.0.0.1'), true);
    assert.equal(isNonPublicAddress('255.255.255.255'), true);
    assert.equal(isNonPublicAddress('0.0.0.0'), true);
    assert.equal(isNonPublicAddress('192.0.2.1'), true);
    assert.equal(isNonPublicAddress('198.51.100.1'), true);
    assert.equal(isNonPublicAddress('203.0.113.1'), true);
    assert.equal(isNonPublicAddress('ff02::1'), true);
    assert.equal(isNonPublicAddress('2001:db8::1'), true);
  });

  it('allows public addresses', () => {
    assert.equal(isNonPublicAddress('93.184.216.34'), false);
    assert.equal(isNonPublicAddress('8.8.8.8'), false);
    assert.equal(isNonPublicAddress('2606:4700::1111'), false);
  });
});

describe('resolvePublicTarget', () => {
  it('resolves a public hostname with an injected resolver', async () => {
    const resolver = async (host: string) => (host === 'example.com' ? ['93.184.216.34'] : []);
    const target = await validatePublicUrl('http://example.com/', { resolver });
    assert.equal(target.ip, '93.184.216.34');
    assert.equal(target.hostname, 'example.com');
    assert.equal(target.port, 80);
  });

  it('blocks a hostname that resolves to a private address', async () => {
    const resolver = async () => ['127.0.0.1'];
    await assert.rejects(
      validatePublicUrl('http://example.com/', { resolver }),
      (error: unknown) => error instanceof SsrfError && error.reason === 'BLOCKED_ADDRESS',
    );
  });

  it('blocks cloud metadata style addresses', async () => {
    const resolver = async () => ['169.254.169.254'];
    await assert.rejects(
      validatePublicUrl('http://metadata.example.com/', { resolver }),
      SsrfError,
    );
  });

  it('blocks when ANY resolved address is non-public (mixed DNS answer)', async () => {
    const resolver = async () => ['93.184.216.34', '10.0.0.5'];
    await assert.rejects(
      validatePublicUrl('http://example.com/', { resolver }),
      (error: unknown) => error instanceof SsrfError && error.reason === 'BLOCKED_ADDRESS',
    );
  });

  it('accepts ip-literals without a resolver', async () => {
    const target = await resolvePublicTarget(new URL('http://93.184.216.34/page'));
    assert.equal(target.ip, '93.184.216.34');
  });

  it('throws when DNS resolution fails', async () => {
    const resolver = async () => {
      throw new Error('ENOTFOUND');
    };
    await assert.rejects(
      validatePublicUrl('http://nxdomain.local/', { resolver }),
      (error: unknown) => error instanceof SsrfError && error.reason === 'DNS_FAILED',
    );
  });

  it('blocks an ipv6 private literal', async () => {
    await assert.rejects(validatePublicUrl('http://[::1]/'), SsrfError);
    await assert.rejects(validatePublicUrl('http://[fd00::1]/'), SsrfError);
  });
});
