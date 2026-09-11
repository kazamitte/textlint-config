// src/textlint.runner.ts
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import {
  TextlintKernelDescriptor as TextlintKernelDescriptor3
} from "@textlint/kernel";
import { createLinter, loadLinterFormatter } from "textlint";

// src/textlint.html.ts
import { TextlintKernelDescriptor as TextlintKernelDescriptor2 } from "@textlint/kernel";
import { moduleInterop as moduleInterop2 } from "@textlint/module-interop";
import htmlPlugin from "textlint-plugin-html";

// src/textlint.base.ts
import {
  TextlintKernelDescriptor
} from "@textlint/kernel";
import { moduleInterop } from "@textlint/module-interop";
import markdownPlugin from "@textlint/textlint-plugin-markdown";
import textPlugin from "@textlint/textlint-plugin-text";
import commentsFilter from "textlint-filter-rule-comments";
import presetAiWriting from "textlint-rule-preset-ai-writing";
import presetJaSpacing from "textlint-rule-preset-ja-spacing";
import presetJaTechnicalWriting from "textlint-rule-preset-ja-technical-writing";
import presetJapanese from "textlint-rule-preset-japanese";
import presetJtfStyle from "textlint-rule-preset-jtf-style";
var asPreset = (preset) => "rules" in preset ? preset : preset.default;
var expandPreset = (presetName, preset) => {
  const { rules, rulesConfig } = asPreset(preset);
  return Object.keys(rules).map((ruleKey) => ({
    ruleId: `${presetName}/${ruleKey}`,
    rule: rules[ruleKey],
    options: rulesConfig?.[ruleKey] ?? true
  }));
};
var STYLE_PRESETS = {
  japanese: ["preset-japanese", presetJapanese],
  "ja-technical-writing": [
    "preset-ja-technical-writing",
    presetJaTechnicalWriting
  ],
  "jtf-style": ["preset-jtf-style", presetJtfStyle]
};
var flattenOverrides = (overrides) => Object.fromEntries(
  Object.entries(overrides).flatMap(
    ([key, value]) => !key.includes("/") && value !== null && typeof value === "object" ? Object.entries(value).map(([ruleKey, ruleValue]) => [
      `${key}/${ruleKey}`,
      ruleValue
    ]) : [[key, value]]
  )
);
var applyOverrides = (rules, rawOverrides) => {
  const overrides = flattenOverrides(rawOverrides);
  return rules.flatMap((rule) => {
    const presetName = rule.ruleId.slice(0, rule.ruleId.indexOf("/"));
    const key = rule.ruleId in overrides ? rule.ruleId : presetName in overrides ? presetName : void 0;
    if (key === void 0) return [rule];
    const override = overrides[key];
    if (override === false) return [];
    if (override === true) return [rule];
    return [{ ...rule, options: override }];
  });
};
function createBaseConfig(options = {}) {
  const {
    style = "ja-technical-writing",
    aiWriting = true,
    spacing = true,
    rules: overrides = {}
  } = options;
  const rules = applyOverrides(
    [
      ...expandPreset(...STYLE_PRESETS[style]),
      ...aiWriting ? expandPreset("preset-ai-writing", presetAiWriting) : [],
      ...spacing ? expandPreset("preset-ja-spacing", presetJaSpacing) : []
    ],
    overrides
  );
  return new TextlintKernelDescriptor({
    rules,
    filterRules: [
      {
        ruleId: "comments",
        rule: moduleInterop(commentsFilter),
        options: true
      }
    ],
    plugins: [
      {
        pluginId: "@textlint/markdown",
        plugin: moduleInterop(
          markdownPlugin
        )
      },
      {
        pluginId: "@textlint/text",
        plugin: moduleInterop(textPlugin)
      }
    ]
  });
}

// src/textlint.html.ts
function createHtmlConfig(options = {}) {
  return createBaseConfig(options).concat(
    new TextlintKernelDescriptor2({
      rules: [],
      filterRules: [],
      plugins: [{ pluginId: "html", plugin: moduleInterop2(htmlPlugin) }]
    })
  );
}

// src/textlint.runner.ts
var DEFAULT_IGNORE_FILE = fileURLToPath(
  new URL("../.textlintignore", import.meta.url)
);
var buildDescriptor = (config, rules) => {
  const base = createHtmlConfig(config);
  if (rules.length === 0) return base;
  return base.concat(
    new TextlintKernelDescriptor3({ rules, filterRules: [], plugins: [] })
  );
};
var globsFor = (descriptor) => descriptor.availableExtensions.map((ext) => `**/*${ext}`);
var ignoreNoTargets = (error) => {
  const type = error?.errors?.[0]?.type;
  if (type === "SearchFilesNoTargetFileError") return [];
  throw error;
};
async function runTextlint(options = {}) {
  const {
    cwd = process.cwd(),
    config = {},
    rules = [],
    descriptor = buildDescriptor(config, rules),
    globs = globsFor(descriptor),
    ignoreFilePath = DEFAULT_IGNORE_FILE,
    formatterName = "stylish",
    fix = false
  } = options;
  const linter = createLinter({ descriptor, cwd, ignoreFilePath });
  if (fix) {
    const results2 = await linter.fixFiles(globs).catch(ignoreNoTargets);
    await Promise.all(
      results2.filter((result) => result.applyingMessages.length > 0).map((result) => writeFile(result.filePath, result.output))
    );
    return { results: results2, output: "", problemCount: 0 };
  }
  const results = await linter.lintFiles(globs).catch(ignoreNoTargets);
  const formatter = await loadLinterFormatter({ formatterName });
  const output = formatter.format(results);
  const problemCount = results.reduce(
    (total, result) => total + result.messages.length,
    0
  );
  return { results, output, problemCount };
}
export {
  runTextlint
};
