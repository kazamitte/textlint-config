import { TextlintKernelDescriptor } from '@textlint/kernel';
import { TextlintConfigOptions } from './textlint.base.cjs';
export { TextlintStyle } from './textlint.base.cjs';

declare function createHtmlConfig(options?: TextlintConfigOptions): TextlintKernelDescriptor;

export { TextlintConfigOptions, createHtmlConfig };
