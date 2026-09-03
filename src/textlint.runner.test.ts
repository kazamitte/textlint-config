import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createBaseConfig } from './textlint.base.js';
import { runTextlint } from './textlint.runner.js';

const fixtures = fileURLToPath(new URL('./__fixtures__/', import.meta.url));

describe('runTextlint', () => {
  it('lints a matched file and returns a formatted report', async () => {
    const res = await runTextlint({ cwd: fixtures, globs: ['sample.md'] });
    expect(res.results).toHaveLength(1);
    expect(typeof res.output).toBe('string');
    expect(typeof res.problemCount).toBe('number');
    expect(res.problemCount).toBeGreaterThanOrEqual(0);
  });

  it('treats "no matching files" as an empty result, not an error', async () => {
    const res = await runTextlint({
      cwd: fixtures,
      globs: ['does-not-exist.md'],
    });
    expect(res.results).toEqual([]);
    expect(res.problemCount).toBe(0);
  });

  it('honors a prebuilt descriptor over config/rules', async () => {
    const descriptor = createBaseConfig({ aiWriting: false, spacing: false });
    const res = await runTextlint({
      cwd: fixtures,
      globs: ['sample.md'],
      descriptor,
    });
    expect(res.results).toHaveLength(1);
  });
});
