import { TextlintKernelRule, TextlintKernelDescriptor, TextlintResult, TextlintFixResult } from '@textlint/kernel';
import { TextlintConfigOptions } from './textlint.base.js';

type RunTextlintOptions = {
    /** Globs and the ignore file resolve against this. @default process.cwd() */
    cwd?: string;
    /** Options forwarded to the shared descriptor factory. */
    config?: TextlintConfigOptions;
    /** Extra rules concatenated onto the descriptor. */
    rules?: TextlintKernelRule[];
    /** Prebuilt descriptor; overrides `config`/`rules`. @default createHtmlConfig(config) */
    descriptor?: TextlintKernelDescriptor;
    /** Defaults to one glob per extension the descriptor's plugins support. */
    globs?: string[];
    /** Path to an ignore file. @default the config package's bundled `.textlintignore` */
    ignoreFilePath?: string;
    /** @default 'stylish' */
    formatterName?: string;
    /** Auto-fix files on disk instead of reporting. @default false */
    fix?: boolean;
};
type RunTextlintResult = {
    results: TextlintResult[] | TextlintFixResult[];
    /** Formatted report, ready to print (empty in `fix` mode). */
    output: string;
    /** Total messages across all files (0 in `fix` mode). */
    problemCount: number;
};
declare function runTextlint(options?: RunTextlintOptions): Promise<RunTextlintResult>;

export { type RunTextlintOptions, type RunTextlintResult, runTextlint };
