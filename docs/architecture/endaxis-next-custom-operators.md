# Endaxis Next 自定义干员设计

本文定义自定义干员的长期数据边界和接入路线。目标是让用户复制官方干员或从空白模板开始，编辑出可参与配装、排轴和模拟的完整干员，同时不为自定义内容维护第二套战斗逻辑。

## 1. 基本原则

- 官方干员与自定义干员使用同一个 `OperatorDefinition` 结构、校验器、编译器和模拟器。
- 官方定义来自版本化 `GameDataRepository`，只读且不进入项目存档。
- 自定义定义归项目所有，完整保存在项目顶层；轨道只保存定义引用和养成实例。
- 项目不保存编译后的等级值、面板、技能实例、运行时状态或投影结果。
- 复制官方干员是一次性复制。复制后形成独立定义，不再跟随官方模板更新。
- 自定义名称和说明是用户内容，不进入游戏文本 i18n；界面固定文本仍使用 i18n。

## 2. 用户入口

角色编辑器提供三种入口：

1. **复制现有干员**：把当前官方或自定义干员的完整定义复制为新的项目定义。
2. **空白角色**：从满足结构校验的最小模板开始编辑。
3. **编辑自定义干员**：修改项目中已有定义。已经引用该定义的轨道在下一次编译时统一使用新内容。

官方干员本身不可直接修改。用户点击编辑官方干员时，应明确执行“复制并编辑”，避免产生官方数据被项目局部覆盖的错觉。

## 3. 存档结构

稳定版本可采用下列方向，字段名在实现前仍可调整：

```ts
interface CustomOperatorDocument {
  id: string;
  name: string;
  definition: OperatorDefinition;
}

type OperatorDefinitionSource = { kind: 'game'; slug: string } | { kind: 'custom'; id: string };

interface OperatorInstanceDocument {
  source: OperatorDefinitionSource;
  level: number;
  promoted: boolean;
  potential: number;
  trustLevel: number;
  skillLevels: Record<string, number>;
  talentStates: Record<string, number>;
  baseStatOverrides?: Record<string, number>;
}

interface EndaxisProjectDocument {
  customOperators: CustomOperatorDocument[];
  // 其余项目字段省略
}
```

`CustomOperatorDocument.id` 是项目内身份；`definition.slug` 不能承担项目引用，因为它原本属于官方游戏数据的命名空间。导入或复制时若 ID 冲突，应生成新 ID 并重写项目内引用。

自定义定义只保存一份。多个轨道或场景可以引用同一份定义，这符合“编辑角色模板，所有使用位置共同更新”的直觉。用户需要分叉版本时，应执行复制。

## 4. 解析与编译

项目加载后的定义解析顺序如下：

1. 校验项目 JSON 的基本结构和自定义定义的稳定身份。
2. 严格校验每份 `OperatorDefinition`，包括技能键、天赋、潜能、等级值和所有内联 Buff。
3. 构造项目级 `OperatorDefinitionResolver`。
4. `kind: 'game'` 委托给 `GameDataRepository`；`kind: 'custom'` 从项目定义表读取。
5. 面板解析、武器兼容检查、技能库生成和场景编译都只依赖统一 resolver 返回的 `OperatorDefinition`。
6. 一次模拟开始前编译定义和养成实例；模拟过程中不再读取可变编辑状态。

组合解析视图属于应用层装配，不能修改 `GameDataRepository` 的只读游戏数据语义，也不能让核心编译器直接读取 Pinia 或 UI 状态。

## 5. 与技能编辑器的关系

自定义干员与时间轴技能块覆盖解决不同问题：

- 角色编辑器修改 `OperatorDefinition`，用于定义角色长期拥有的技能、天赋、潜能和基础属性。
- 技能块编辑器修改某一次释放的完整 `SkillDefinition` 覆盖，只影响该时间轴块。
- 用户可以把一个技能块的自定义定义复制回自定义干员的某个技能模板，但这应是显式命令，不能建立隐藏的双向绑定。

两处编辑器必须复用相同的 `SkillDefinition` 表单组件和严格校验。这样从空白角色搭建技能与编辑单次技能块不会形成两套字段语义。

## 6. UI 结构

角色选择器保留现有布局，在官方列表之外增加“自定义”筛选和新建按钮。角色编辑器至少包含：

- 身份：名称、头像、稀有度、武器类型、元素、定位；
- 成长：四维属性、等级成长、信赖加点；
- 技能：技能组、技能定义、连携注册；
- 养成：天赋与潜能；
- 完整性：错误、警告和当前无法执行的能力。

编辑器应提供复制、重命名、删除和导入导出。删除已被轨道引用的定义时必须阻止操作并列出引用位置，不能静默清空轨道。

## 7. 校验与错误边界

首个实现至少要拒绝：

- 自定义定义 ID 重复或引用缺失；
- 技能组键、技能键、天赋键或潜能键重复；
- 技能等级来源与养成字段不匹配；
- 武器类型、属性类型、元素或角色定位不在明确枚举中；
- `SkillDefinition`、内联 Buff 或事件监听器不满足严格结构校验；
- 删除仍被场景引用的自定义干员；
- 导入时产生未处理的身份冲突。

宽松转换只适用于官方数据生成过程。用户保存自定义定义前应通过严格校验，避免把无法解释的半成品带入模拟。

## 8. 实现顺序

1. 等 `OperatorDefinition`、技能和 Buff 结构完成当前收敛，确定空白模板的最小合法形态。
2. 抽出统一的 `OperatorDefinitionResolver`，先保持所有现有调用仍只解析官方定义。
3. 在项目 schema 中加入自定义定义表与来源联合，并补齐引用校验。
4. 让面板、配装、技能库和模拟编译通过 resolver 读取定义。
5. 抽取并复用技能定义编辑组件，完成复制官方干员和编辑自定义干员。
6. 增加空白角色创建、项目内复制、删除保护以及导入导出测试。

首个稳定存档版本发布前不为中间 schema 编写迁移。正式发布后，自定义定义和引用才进入版本迁移承诺。
