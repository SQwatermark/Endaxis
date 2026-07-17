# 动作身份字段与显示名称整理（设计提案）

> 状态：设计提案 / 待重新接入当前 `main`。
>
> 本文记录的是围绕时间轴动作显示名称的一次轻量整理方案，以及此前本地实现过的代码改造思路。当前 `main` 已经完成 TypeScript 化和 `timelineStore` 拆分，但尚未合入本文所述的 `actionIdentity` / `actionDisplay` 工具。后续如果继续处理存档字段语义和 i18n 泄漏，应以本文作为设计背景，并按当前 TS 文件结构重新落地。

目标读者是已经了解 Endaxis 基本架构，但不了解本次对话背景的维护者。

## 背景与问题

时间轴上的 `action.name` 过去同时承担了两个角色：

- 作为 UI 显示文本，例如“普攻”“战技”“Final Strike”。
- 作为动作身份的近似标识，用来让用户知道轴上的块是什么技能。

这会带来几个维护风险：

1. UI 文本会被保存进存档。用户在英文环境创建动作后切回中文，轴上仍可能显示旧语言文本。
2. `skillType.attack` 在英文和俄文里被翻译成了“重击/最后一击”，导致“普攻”和“重击”共用同一个 i18n 键。
3. 部分代码读取 `comboSegmentIndex` 推导源技能段号，但它实际表示连携分组内的序号，不是技能数据表里的 segment index。
4. 后续如果继续把 `name` 当身份字段，存档兼容和多语言显示会越来越难维护。

本次整理的原则是：不改变存档结构、不新增持久化字段，先明确现有字段语义，并让 UI 层根据动作身份动态推导显示名称。`action.name` 仅作为旧存档或信息不足时的兜底。

## 字段语义

当前时间轴 action 可以用已有字段表达身份：

| 字段                  | 语义               | 说明                                                                                                |
| --------------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `instanceId`          | 时间轴实例 ID      | 每次放到轴上生成，区分同一个技能的多个实例。                                                        |
| `type`                | 动作类型           | 如 `basicAttack`、`battleSkill`、`comboSkill`、`ultimate`。模拟、属性筛选、图标配色等逻辑主要看它。 |
| `sourceSkillKey`      | 源技能键           | 优先表示这个 action 来自角色数据里的哪个技能或变体。                                                |
| `skillId`             | 旧/兼容源技能键    | `sourceSkillKey` 不存在时可作为 fallback。                                                          |
| `segmentIndex`        | 源技能分段序号     | 1-based，表示数据表里第几个 segment。                                                               |
| `attackSegmentIndex`  | 普攻源段序号       | 1-based，表示普攻数据表里的第几个 segment。                                                         |
| `attackSequenceIndex` | 可执行普攻序列序号 | 1-based，过滤掉 duration 为 0 的普攻段后，在实际普攻链中的第几段。                                  |
| `attackSequenceTotal` | 可执行普攻段总数   | 用于判断最后一段是否应显示为“重击”。                                                                |
| `comboSegmentIndex`   | 连携分组序号       | 只表示一个连携链/连携窗口里的第几个块，不代表源技能 segment。                                       |
| `comboSegmentTotal`   | 连携分组总数       | 配合 `comboSegmentIndex` 显示 ①/②/③ 等后缀。                                                        |
| `name`                | 旧显示文本         | 不再作为可靠身份字段；仅在身份不足或旧存档中作为兜底。                                              |

源技能解析优先级为：

```text
sourceSkillKey -> skillId -> type
```

源分段解析优先级为：

```text
segmentIndex -> attackSegmentIndex -> attackSequenceIndex
```

注意：`comboSegmentIndex` 被明确排除，因为它不是源技能分段身份。

## 拟议代码改动

### 1. 新增动作身份工具

建议新增 `src/utils/actionIdentity.ts`：

- `getActionSourceSkillKey(action)`：从 `sourceSkillKey`、`skillId`、`type` 推导源技能键。
- `getActionSourceSegmentIndex(action)`：从源分段字段推导 0-based segment index。
- `normalizeVariantSourceSkillKey(sourceSkillKey)`：把 `xxx_variant_enhancedBattleSkill` 规范成 `enhancedBattleSkill`。
- `isVariantAction(action)`：判断一个 action 是否是角色技能变体。

其中 `getActionSourceSegmentIndex` 加了中文注释，强调 `comboSegmentIndex` 不是源技能表分段。

### 2. 新增动作显示工具

建议新增 `src/utils/actionDisplay.ts`：

- `getActionTypeDisplayName(action, t)`：把 `type` 映射到当前 locale 下的技能类型名。
- `getActionDisplayName(action, t, options)`：生成完整显示名。
- `getActionTimelineLabel(action, t, options)`：生成时间轴块上的短标签。

这个模块属于 UI 展示层。它接收 Vue i18n 的 `t`、当前 `locale` 和可选 `operatorId`，不在 store 或模拟层里直接调用全局 i18n。

关键行为：

- 标准技能不读旧 `action.name`，而是按 `type` 生成当前语言的“普攻/战技/连携/终结技”等。
- 多段标准技能会保留源 `segmentIndex`，例如显示为“连携 1 / 连携 2”。
- 普攻非最后段在时间轴上显示 `A1`、`A2`，最后段按 `skillType.finalStrike` 显示“重击/Final Strike”。
- 技能变体优先用 `operatorId + sourceSkillKey` 调 `getOperatorSubSkillName` 取当前语言文本。
- 无法推导身份时，才回退旧 `action.name`。

### 3. 接入时间轴块和属性面板

`src/components/ActionItem.vue`：

- 移除组件内手写的 `TYPE_SHORTHAND`、变体后缀、普攻最后段名称逻辑。
- 改为统一调用 `getActionTimelineLabel`。
- 复用 `actionTrackId` 计算当前 action 所在轨道，既用于名称解析，也用于元素主题色 fallback。

`src/components/PropertiesPanel.vue`：

- 标题和连接列表里的 action 名称改为调用 `getActionDisplayName`。
- 库模式仍保留库模板的 `target.name`，因为技能库本身是当前 locale 生成的临时展示数据，不是已持久化的时间轴 action。

### 4. 修正 i18n 语义

更新三种语言的 `skillType`：

- `skillType.attack` 表示普通攻击。
- 新增 `skillType.finalStrike` 表示重击/最后一击。

同时更新 `src/components/HitDamageDetailDialog.vue`，使 `finalStrike` 类型显示走 `skillType.finalStrike`，不再复用 `skillType.attack`。

### 5. 修正 store 内部源分段解析

`src/stores/timelineStore.ts` 及其拆分后的相关子模块不再维护本地版的 `getActionSourceSkillKey` / `getActionSegmentIndex`，改为导入 `actionIdentity` 工具。

同时原先的 `getActionSegmentIndex` 会把 `comboSegmentIndex` 当作源段号的问题被移除。

### 6. 补充测试

新增：

- `src/utils/actionIdentity.test.ts`
- `src/utils/actionDisplay.test.ts`

更新：

- `src/components/ActionItem.structure.test.ts`
- `src/stores/timelineStore.test.ts`

测试覆盖：

- 源技能键解析优先级。
- `comboSegmentIndex` 不参与源 segment 解析。
- 标准技能显示名不依赖旧 `action.name`。
- 普攻段和重击显示逻辑。
- 时间轴短标签和连携后缀。

## 兼容性

本次改动不改变存档 schema，也不要求迁移旧存档。

兼容策略是：

- 新旧存档只要带有 `type`、`sourceSkillKey`、`skillId`、`segmentIndex` 等现有字段，就可以按当前语言重新生成显示名。
- 缺少身份字段的旧 action 仍可回退到 `action.name`。
- 后续如果需要做更彻底的历史记录或存档结构重构，可以基于这里定义的字段语义继续推进。

## 历史验证记录

以下是此前本地实现时的验证记录，不代表当前 `main` 已经具备这些文件或测试：

执行过：

```bash
npm test -- --run
npm run build
```

结果：

- 单元测试通过：37 个测试文件，317 个测试。
- 生产构建通过。
- 构建仅保留既有的大 chunk 警告。

另：

```bash
npm run type-check
```

仍失败在既有 ECharts 子模块声明缺失：

- `echarts/core`
- `echarts/charts`
- `echarts/components`
- `echarts/renderers`

这不是本次动作身份和显示名称整理引入的问题。

## 后续建议

1. 继续收敛 store 内的 i18n 使用。技能库可以短期保留，因为它是 UI 临时模型；长期最好也把“数据模型”和“展示文本”拆得更清楚。
2. 梳理导入/导出存档格式，明确哪些字段是稳定身份字段，哪些字段只是 UI 派生字段。
3. 如果未来增加武器主动技能或装备主动效果，需要为 `librarySource`、`sourceWeaponId`、装备来源字段补充同级语义定义。
4. 处理 ECharts 子模块声明问题，让 `npm run type-check` 能重新作为完整质量门禁。
