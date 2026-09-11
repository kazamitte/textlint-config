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
export {
  createBaseConfig
};
