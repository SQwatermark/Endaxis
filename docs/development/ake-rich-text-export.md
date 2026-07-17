# AKEDB 干员富文本与战斗术语转换流程

本文档记录 Endaxis 如何从 AKEDatabase 导出干员技能、天赋、潜能说明，并保留 AKEDB 的富文本语义。后续 AKEDB 数据更新或新增干员时，应按本文流程重新生成游戏内容文本。

## 目标

转换流程产出四个文件：

```text
src/i18n/game-locales/zh/operators.json
src/i18n/game-locales/zh/battleTerms.json
src/i18n/game-locales/en/operators.json
src/i18n/game-locales/en/battleTerms.json
```

`operators.json` 保存干员名、技能名、技能描述、天赋描述、潜能描述。描述字段保留 `<@...>`、`<#...>`、`<image...>` 标签。

`battleTerms.json` 只保存战斗术语，也就是 AKEDB `HyperlinkTextTable.json` 中 `id` 以 `ba.` 开头的条目。样式方案不再写入 JSON，而是固定在 `src/data/gameRichText.ts` 中。

## 数据源

| AKEDB 文件 | 用途 |
| --- | --- |
| `CharacterTable.json` | 干员名称、干员基础入口 |
| `CharGrowthTable.json` | 技能组、天赋节点、技能描述 |
| `CharacterPotentialTable.json` | 潜能名称与潜能效果入口 |
| `PotentialTalentEffectTable.json` | 天赋/潜能效果说明与 blackboard |
| `SkillPatchTable.json` | 技能/效果 blackboard，用于替换 `{value:format}` 占位符 |
| `I18nTextTable_CN.json` / `I18nTextTable_EN.json` | 中英文文本解析 |
| `HyperlinkTextTable.json` | `<#ba.*>` 战斗术语的名称、说明、图标、样式 ID |
| `RichTextStyleTable.json` | 作为样式方案参考；当前 Endaxis 已将颜色和样式前置图标固化到 `gameRichText.ts` |

## 废案管理员过滤

AKEDB 中保留了废案管理员 `chr_0002_endminm` 和 `chr_0003_endminf`，当前实际使用的管理员是 `chr_9000_endmin`。导出脚本会显式排除这两个废案角色，避免废案天赋文本和 blackboard 进入转换流程。

## battleTerms.json 结构

```json
{
  "terms": {
    "ba.burning": {
      "name": "法术异常 - 燃烧",
      "description": "...",
      "styleId": "ba.fire",
      "iconPath": "/icons/icon_battle_debuff_burning.webp"
    }
  }
}
```

字段语义：

| 字段 | 含义 |
| --- | --- |
| `name` | 术语显示名，可继续包含富文本标签 |
| `description` | 术语解释，可继续包含富文本标签和内联图标 |
| `styleId` | 文本样式 ID；Endaxis 用它查固定样式表，得到颜色和可选前置图标 |
| `iconPath` | Endaxis 内部图标路径，必须是 `/icons/*.webp` 形式 |

`battleTerms.json` 不再保存 `styles`。这能避免把 AKEDB 的 UI 样式表直接耦合进 Endaxis，也避免在运行时继续维护 AKEDB 路径到 Endaxis 图标路径的映射。

## 标签规则

当前保留三类标签：

| 标签 | 示例 | Endaxis 行为 |
| --- | --- | --- |
| `<@styleId>...</>` | `<@ba.fire>灼热伤害</>` | 按 `gameRichText.ts` 中固定样式表上色；若 AKEDB 样式带 image，则显示前置图标 |
| `<#termId>...</>` | `<#ba.burning>燃烧</>` | 按术语 `styleId` 上色；若术语有解释，则显示下划线、前置图标和 tooltip |
| `<image="path">` | `<image="/icons/icon_energy_fusion_fire.webp">` | 渲染为行内图标；导出阶段必须已转成 Endaxis 内部路径 |

运行时的 `resolveRichTextImage()` 只接受 `/icons/...` 或 `icons/...`，不再接受 `public/images/...`、`TermIcon/...`、`BuffIcon/...` 等 AKEDB 原始路径。

## 图标映射

图标映射集中在 `scripts/export/export_operators_json.py` 的 `ENDAXIS_ICON_PATH_MAP` 中维护。

导出时会做两件事：

1. 把 `HyperlinkTextTable.json` 里的 `iconPath` 转成 Endaxis 内部路径，写入术语 `iconPath`。
2. 把描述文本里的 `<image="...">` 标签同步改写成 Endaxis 内部路径。

如果 AKEDB 后续新增术语或新增内联图标，必须先给 `ENDAXIS_ICON_PATH_MAP` 增加明确映射，或补充对应的内部图标资源。无法映射的术语图标或 `<image>` 标签会让导出直接失败，避免静默丢失数据或在运行时出现坏图。

## styleId 与 iconPath 的关系

`styleId` 和 `iconPath` 不能合并成一个字段。

AKEDB 中 `richTextId` 指向的是文本样式语义，用于决定颜色，也可能在样式 `preDef` 里携带前置图标；`HyperlinkTextTable.iconPath` 指向的是术语自己的解释图标。两者不一定是一一对应关系。例如 `ba.burning` 术语的 `richTextId` 是 `ba.fire`，表示它沿用灼热颜色，但术语图标需要显示“燃烧”的专用图标。

因此 Endaxis 约定：

- `styleId` 参与样式解析，当前包括颜色和 AKEDB 样式前置图标。
- `iconPath` 表示术语 tooltip 和术语正文前置图标使用的内部图标，优先级高于样式图标。
- 样式颜色和样式前置图标固定在 `src/data/gameRichText.ts`，不由导出 JSON 动态决定。

## 严格校验

导出脚本会在写入 JSON 前严格扫描富文本和占位符数据：

- 只接受 `<@styleId>...</>`、`<#termId>...</>`、`</>` 和 `<image="...">`。
- AKEDB 源数据里的 `<image>` 可以带已知属性，但输出统一写成 `<image="/icons/xxx">`。
- 图片路径必须能映射到 Endaxis 内部 `/icons/...` 路径。
- 标签必须正确闭合，不能出现未匹配的 `</>` 或未闭合的 `<@...>` / `<#...>`。
- `blackboard` 必须是列表，每项只能包含 `key`、`value`、`valueStr`。
- `blackboard.key` 必须是非空字符串，`blackboard.value` 必须是数值，`blackboard.valueStr` 只能为空。
- `skillBbModifier.floatValue` 必须是数值，`skillBbModifier.stringValue` 只能为空；如果后续 AKEDB 开始使用字符串型黑板值，需要先显式建模。
- 描述里的 `{expr:format}` 占位符必须能从已建模的 blackboard 或 modifier 数值解析，且 format 必须是已支持的数字格式。

任何未预料的标签、未映射图片、闭合错误、未知 blackboard 数据类型、未知占位符变量或未支持的占位符格式都会抛出异常并中止导出。这样做的目的是让数据结构变化在导出阶段暴露，而不是生成看似成功但语义缺失的 JSON。

## 重新导出流程

在 WSL 工作区执行：

```bash
cd ~/arknights/Endaxis
python3 scripts/export/export_operators_json.py \
  /mnt/c/Users/sqwat/Projects/zmd/AKEDatabase/public/TableCfg \
  src/i18n/game-locales
```

导出完成后应检查输出行数，例如：

```text
src/i18n/game-locales/zh/operators.json: 28 operators; src/i18n/game-locales/zh/battleTerms.json: 62 terms
src/i18n/game-locales/en/operators.json: 28 operators; src/i18n/game-locales/en/battleTerms.json: 62 terms
```

## 验证

至少执行：

```bash
npm run test -- gameRichText gameText
npm run build
```

需要人工检查的 UI：

- 干员实例编辑弹窗中的技能、天赋、潜能说明。
- `<@ba.*>` 样式若在 AKEDB 中带 image，是否显示前置小图标。
- `<#ba.*>` 战斗术语是否有下划线、前置小图标和深色 tooltip。
- `<image>` 行内图标是否接近正文大小，不应出现巨大图标。
- 深色 tooltip 下，术语颜色、正文颜色、图标可读性是否正常。

## 维护原则

1. 导出 JSON 只保存游戏内容文本和术语数据，不保存 Endaxis UI 样式策略。
2. 样式方案属于 Endaxis 渲染策略，颜色和样式前置图标固定放在 `src/data/gameRichText.ts`。
3. AKEDB 资源路径只在导出阶段出现；进入 `src/i18n/game-locales` 后应全部变成 Endaxis 内部路径。
4. 后续新增语言时，`battleTerms.json` 的结构应保持一致；缺失游戏内容语言可以继续回退到英文。