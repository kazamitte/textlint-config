import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/textlint.base.ts',
    'src/textlint.html.ts',
    'src/textlint.runner.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  // runner.ts resolves the bundled `.textlintignore` via `import.meta.url`.
  // Shim it so the CJS output works under CommonJS (import.meta is ESM-only).
  shims: true,
  // Self-contained entry files with stable names. The little duplicated `base`
  // code across entries is cheaper than shipping hashed shared chunks whose
  // names churn between builds. Runtime deps are externalized by tsup.
  splitting: false,
});
