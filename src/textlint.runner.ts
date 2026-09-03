import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  TextlintKernelDescriptor,
  type TextlintFixResult,
  type TextlintKernelRule,
  type TextlintResult,
} from '@textlint/kernel';
import { createLinter, loadLinterFormatter } from 'textlint';
import type { TextlintConfigOptions } from './textlint.base.js';
import { createHtmlConfig } from './textlint.html.js';

export type RunTextlintOptions = {
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

export type RunTextlintResult = {
  results: TextlintResult[] | TextlintFixResult[];
  /** Formatted report, ready to print (empty in `fix` mode). */
  output: string;
  /** Total messages across all files (0 in `fix` mode). */
  problemCount: number;
};

// Bundled default ignore (build output), the same way the ESLint config ships
// its own .gitignore. Patterns are depth-agnostic so they apply against any cwd.
const DEFAULT_IGNORE_FILE = fileURLToPath(
  new URL('../.textlintignore', import.meta.url),
);

const buildDescriptor = (
  config: TextlintConfigOptions,
  rules: TextlintKernelRule[],
): TextlintKernelDescriptor => {
  const base = createHtmlConfig(config);
  if (rules.length === 0) return base;
  return base.concat(
    new TextlintKernelDescriptor({ rules, filterRules: [], plugins: [] }),
  );
};

// The descriptor's plugins already declare which extensions they lint, so derive
// the globs from it — the caller never restates the file types.
const globsFor = (descriptor: TextlintKernelDescriptor): string[] =>
  descriptor.availableExtensions.map((ext) => `**/*${ext}`);

// An empty target set is not a failure for a runner — treat it as "nothing".
const ignoreNoTargets = (error: unknown): never[] => {
  const type = (error as { errors?: { type?: string }[] } | null)?.errors?.[0]
    ?.type;
  if (type === 'SearchFilesNoTargetFileError') return [];
  throw error;
};

// Lint (or, with `fix`, auto-fix) files with the shared descriptor. `cwd` is
// supplied by the caller (the consumer's project root) so globs and the ignore
// file resolve against the consumer, not this package. `config` / `rules` tune
// the descriptor without rebuilding it. Side-effect free in lint mode — the
// caller prints `output` and picks the exit code; `fix` writes to disk instead
// and reports nothing.
export async function runTextlint(
  options: RunTextlintOptions = {},
): Promise<RunTextlintResult> {
  const {
    cwd = process.cwd(),
    config = {},
    rules = [],
    descriptor = buildDescriptor(config, rules),
    globs = globsFor(descriptor),
    ignoreFilePath = DEFAULT_IGNORE_FILE,
    formatterName = 'stylish',
    fix = false,
  } = options;

  const linter = createLinter({ descriptor, cwd, ignoreFilePath });

  if (fix) {
    // `fixFiles` computes the fixed text but never writes it — the CLI layer
    // does that. Write back the files that actually changed.
    const results: TextlintFixResult[] = await linter
      .fixFiles(globs)
      .catch(ignoreNoTargets);
    await Promise.all(
      results
        .filter((result) => result.applyingMessages.length > 0)
        .map((result) => writeFile(result.filePath, result.output)),
    );
    return { results, output: '', problemCount: 0 };
  }

  const results: TextlintResult[] = await linter
    .lintFiles(globs)
    .catch(ignoreNoTargets);
  const formatter = await loadLinterFormatter({ formatterName });
  const output = formatter.format(results);
  const problemCount = results.reduce(
    (total, result) => total + result.messages.length,
    0,
  );

  return { results, output, problemCount };
}
