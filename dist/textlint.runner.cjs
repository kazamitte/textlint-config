"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/textlint.runner.ts
var textlint_runner_exports = {};
__export(textlint_runner_exports, {
  runTextlint: () => runTextlint
});
module.exports = __toCommonJS(textlint_runner_exports);

// node_modules/.pnpm/tsup@8.5.1_postcss@8.5.26_typescript@5.9.3/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL(`file:${__filename}`).href : document.currentScript && document.currentScript.tagName.toUpperCase() === "SCRIPT" ? document.currentScript.src : new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/textlint.runner.ts
var import_promises = require("fs/promises");
var import_node_url = require("url");
var import_kernel3 = require("@textlint/kernel");
var import_textlint = require("textlint");

// src/textlint.html.ts
var import_kernel2 = require("@textlint/kernel");
var import_module_interop2 = require("@textlint/module-interop");
var import_textlint_plugin_html = __toESM(require("textlint-plugin-html"), 1);

// src/textlint.base.ts
var import_kernel = require("@textlint/kernel");
var import_module_interop = require("@textlint/module-interop");
var import_textlint_plugin_markdown = __toESM(require("@textlint/textlint-plugin-markdown"), 1);
var import_textlint_plugin_text = __toESM(require("@textlint/textlint-plugin-text"), 1);
var import_textlint_filter_rule_comments = __toESM(require("textlint-filter-rule-comments"), 1);
var import_textlint_rule_preset_ai_writing = __toESM(require("textlint-rule-preset-ai-writing"), 1);
var import_textlint_rule_preset_ja_spacing = __toESM(require("textlint-rule-preset-ja-spacing"), 1);
var import_textlint_rule_preset_ja_technical_writing = __toESM(require("textlint-rule-preset-ja-technical-writing"), 1);
var import_textlint_rule_preset_japanese = __toESM(require("textlint-rule-preset-japanese"), 1);
var import_textlint_rule_preset_jtf_style = __toESM(require("textlint-rule-preset-jtf-style"), 1);
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
  japanese: ["preset-japanese", import_textlint_rule_preset_japanese.default],
  "ja-technical-writing": [
    "preset-ja-technical-writing",
    import_textlint_rule_preset_ja_technical_writing.default
  ],
  "jtf-style": ["preset-jtf-style", import_textlint_rule_preset_jtf_style.default]
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
      ...aiWriting ? expandPreset("preset-ai-writing", import_textlint_rule_preset_ai_writing.default) : [],
      ...spacing ? expandPreset("preset-ja-spacing", import_textlint_rule_preset_ja_spacing.default) : []
    ],
    overrides
  );
  return new import_kernel.TextlintKernelDescriptor({
    rules,
    filterRules: [
      {
        ruleId: "comments",
        rule: (0, import_module_interop.moduleInterop)(import_textlint_filter_rule_comments.default),
        options: true
      }
    ],
    plugins: [
      {
        pluginId: "@textlint/markdown",
        plugin: (0, import_module_interop.moduleInterop)(
          import_textlint_plugin_markdown.default
        )
      },
      {
        pluginId: "@textlint/text",
        plugin: (0, import_module_interop.moduleInterop)(import_textlint_plugin_text.default)
      }
    ]
  });
}

// src/textlint.html.ts
function createHtmlConfig(options = {}) {
  return createBaseConfig(options).concat(
    new import_kernel2.TextlintKernelDescriptor({
      rules: [],
      filterRules: [],
      plugins: [{ pluginId: "html", plugin: (0, import_module_interop2.moduleInterop)(import_textlint_plugin_html.default) }]
    })
  );
}

// src/textlint.runner.ts
var DEFAULT_IGNORE_FILE = (0, import_node_url.fileURLToPath)(
  new URL("../.textlintignore", importMetaUrl)
);
var buildDescriptor = (config, rules) => {
  const base = createHtmlConfig(config);
  if (rules.length === 0) return base;
  return base.concat(
    new import_kernel3.TextlintKernelDescriptor({ rules, filterRules: [], plugins: [] })
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
  const linter = (0, import_textlint.createLinter)({ descriptor, cwd, ignoreFilePath });
  if (fix) {
    const results2 = await linter.fixFiles(globs).catch(ignoreNoTargets);
    await Promise.all(
      results2.filter((result) => result.applyingMessages.length > 0).map((result) => (0, import_promises.writeFile)(result.filePath, result.output))
    );
    return { results: results2, output: "", problemCount: 0 };
  }
  const results = await linter.lintFiles(globs).catch(ignoreNoTargets);
  const formatter = await (0, import_textlint.loadLinterFormatter)({ formatterName });
  const output = formatter.format(results);
  const problemCount = results.reduce(
    (total, result) => total + result.messages.length,
    0
  );
  return { results, output, problemCount };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runTextlint
});
