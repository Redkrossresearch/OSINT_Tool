import { createHash, timingSafeEqual } from 'node:crypto';

const sortKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([key, entryValue]) => [key, sortKeys(entryValue)]),
    );
  }

  return value;
};

const canonicalize = (content: string): string => {
  try {
    return JSON.stringify(sortKeys(JSON.parse(content)));
  } catch {
    return content;
  }
};

export const computeHash = (content: string): string => {
  return createHash('sha256').update(canonicalize(content), 'utf8').digest('hex');
};

export const verifyHash = (content: string, expectedHash: string): boolean => {
  if (!/^[a-fA-F0-9]{64}$/.test(expectedHash)) {
    return false;
  }

  const actualHash = Buffer.from(computeHash(content), 'hex');
  const expectedDigest = Buffer.from(expectedHash, 'hex');

  return timingSafeEqual(actualHash, expectedDigest);
};
