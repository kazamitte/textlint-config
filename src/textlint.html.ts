import { TextlintKernelDescriptor } from '@textlint/kernel';
import { moduleInterop } from '@textlint/module-interop';
import htmlPlugin from 'textlint-plugin-html';
import {
  createBaseConfig,
  type TextlintConfigOptions,
} from './textlint.base.js';

export type { TextlintConfigOptions, TextlintStyle } from './textlint.base.js';

// Base plus the HTML processor plugin, so `.html` is linted with the same
// rules; base still covers `.md` / `.txt`.
export function createHtmlConfig(
  options: TextlintConfigOptions = {},
): TextlintKernelDescriptor {
  return createBaseConfig(options).concat(
    new TextlintKernelDescriptor({
      rules: [],
      filterRules: [],
      plugins: [{ pluginId: 'html', plugin: moduleInterop(htmlPlugin) }],
    }),
  );
}
