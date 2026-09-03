import { describe, expect, it } from 'vitest';
import { createHtmlConfig } from './textlint.html.js';

describe('createHtmlConfig', () => {
  it('adds html support on top of the base extensions', () => {
    const d = createHtmlConfig();
    expect(d.availableExtensions).toContain('.html');
    expect(d.availableExtensions).toContain('.md');
    expect(d.availableExtensions).toContain('.txt');
  });

  it('registers the html plugin alongside the base plugins', () => {
    const ids = createHtmlConfig()
      .toJSON()
      .plugin.map((p) => p.id);
    expect(ids).toContain('html');
    expect(ids).toEqual(
      expect.arrayContaining(['@textlint/markdown', '@textlint/text']),
    );
  });

  it('keeps the base rule set', () => {
    const ids = createHtmlConfig()
      .toJSON()
      .rule.map((r) => r.id);
    expect(
      ids.some((id) => id.startsWith('preset-ja-technical-writing/')),
    ).toBe(true);
  });
});
