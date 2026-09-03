import type { TextlintKernelDescriptor } from '@textlint/kernel';
import { describe, expect, it } from 'vitest';
import { createBaseConfig } from './textlint.base.js';

const ruleIds = (d: TextlintKernelDescriptor): string[] =>
  d.toJSON().rule.map((r) => r.id);
const pluginIds = (d: TextlintKernelDescriptor): string[] =>
  d.toJSON().plugin.map((p) => p.id);
const filterIds = (d: TextlintKernelDescriptor): string[] =>
  d.toJSON().filterRule.map((f) => f.id);

const hasPreset = (ids: string[], preset: string): boolean =>
  ids.some((id) => id.startsWith(`${preset}/`));

describe('createBaseConfig', () => {
  it('lints markdown and plain text, but not html', () => {
    const d = createBaseConfig();
    expect(d.availableExtensions).toContain('.md');
    expect(d.availableExtensions).toContain('.txt');
    expect(d.availableExtensions).not.toContain('.html');
  });

  it('wires the markdown/text plugins and the comments filter', () => {
    const d = createBaseConfig();
    expect(pluginIds(d)).toEqual(
      expect.arrayContaining(['@textlint/markdown', '@textlint/text']),
    );
    expect(filterIds(d)).toContain('comments');
  });

  it('defaults to the ja-technical-writing style preset', () => {
    const ids = ruleIds(createBaseConfig());
    expect(hasPreset(ids, 'preset-ja-technical-writing')).toBe(true);
    expect(hasPreset(ids, 'preset-japanese')).toBe(false);
    expect(hasPreset(ids, 'preset-jtf-style')).toBe(false);
  });

  it('selects exactly one style preset', () => {
    const ids = ruleIds(createBaseConfig({ style: 'japanese' }));
    expect(hasPreset(ids, 'preset-japanese')).toBe(true);
    expect(hasPreset(ids, 'preset-ja-technical-writing')).toBe(false);
  });

  it('adds ai-writing and spacing presets by default, and can drop them', () => {
    const withAll = ruleIds(createBaseConfig());
    expect(hasPreset(withAll, 'preset-ai-writing')).toBe(true);
    expect(hasPreset(withAll, 'preset-ja-spacing')).toBe(true);

    const without = ruleIds(
      createBaseConfig({ aiWriting: false, spacing: false }),
    );
    expect(hasPreset(without, 'preset-ai-writing')).toBe(false);
    expect(hasPreset(without, 'preset-ja-spacing')).toBe(false);
  });
});

describe('createBaseConfig overrides', () => {
  // A real ruleId from the default config, so override tests stay in sync with
  // whatever the installed preset versions actually ship.
  const spacingRule = (): string => {
    const id = ruleIds(createBaseConfig()).find((r) =>
      r.startsWith('preset-ja-spacing/'),
    );
    if (id === undefined) throw new Error('no preset-ja-spacing rule found');
    return id;
  };

  it('disables a single rule by its flat ruleId', () => {
    const target = spacingRule();
    const ids = ruleIds(createBaseConfig({ rules: { [target]: false } }));
    expect(ids).not.toContain(target);
  });

  it('disables an entire preset by its name key', () => {
    const ids = ruleIds(
      createBaseConfig({ rules: { 'preset-ai-writing': false } }),
    );
    expect(hasPreset(ids, 'preset-ai-writing')).toBe(false);
  });

  it('accepts the nested textlintrc-style preset map form', () => {
    const target = spacingRule();
    const ruleKey = target.slice('preset-ja-spacing/'.length);
    const ids = ruleIds(
      createBaseConfig({
        rules: { 'preset-ja-spacing': { [ruleKey]: false } },
      }),
    );
    expect(ids).not.toContain(target);
  });

  it("replaces a rule's options with an object override", () => {
    const target = spacingRule();
    const d = createBaseConfig({ rules: { [target]: { custom: true } } });
    const entry = d.toJSON().rule.find((r) => r.id === target);
    expect(entry?.options).toEqual({ custom: true });
  });
});
