import { TextlintKernelDescriptor } from '@textlint/kernel';
import { TextlintConfigOptions } from './textlint.base.js';
export { TextlintStyle } from './textlint.base.js';

declare function createHtmlConfig(options?: TextlintConfigOptions): TextlintKernelDescriptor;

export { TextlintConfigOptions, createHtmlConfig };
