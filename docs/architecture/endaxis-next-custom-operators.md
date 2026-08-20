# Endaxis Next 项目级自定义模板设计

本文定义项目级自定义模板的长期数据边界，并重点说明自定义干员。目标是让用户从内置模板派生可参与配装、排轴和模拟的完整定义，同时不为自定义内容维护第二套战斗逻辑。

## 1. 基本原则

- 官方与自定义内容使用相同的 `OperatorDefinition`、`WeaponDefinition`、`GearDefinition`、`GearSetDefinition`、校验器、编译器和模拟器。
- 官方定义来自版本化 `GameDataRepository`，只读且不进入项目存档。
- 自定义定义归项目所有，完整保存在项目顶层；轨道只保存模板引用和养成实例。
- 项目不保存编译后的等级值、面板、技能程序、运行时状态或投影结果。
- 从现有模板派生是一次性完整物化。`origin` 只用于来源审计和显式重置，不参与运行时继承或隐式合并。
- 模板 ID 与展示资源身份分离：`project:operator:*` 是稳定引用，头像和技能图片读取定义的 `assetSlug`。
- 自定义名称和说明是用户内容，不进入游戏文本 i18n；界面固定文本仍使用 i18n。

## 2. 用户入口

角色编辑器逐步提供三种入口：

1. **从现有模板派生**：把当前官方或自定义干员完整复制为新的项目模板，并原子切换当前轨道。
2. **空白角色**：从满足结构校验的最小模板开始编辑。
3. **编辑项目模板**：修改项目中已有定义；所有引用该模板的轨道在下一次解析时统一使用新内容。

官方定义本身不可直接修改。用户点击“自定义干员”时即创建项目模板，不产生隐藏的页面覆盖。

## 3. 存档结构

项目顶层保存统一定义库：

```ts
interface ProjectTemplateOriginDocument {
  templateId: string;
  gameDataRevision: string;
}

interface ProjectOperatorTemplateDocument {
  id: string;
  name: string;
  origin?: ProjectTemplateOriginDocument;
  definition: OperatorDefinition;
}

interface ProjectDefinitionLibraryDocument {
  operators: Record<string, ProjectOperatorTemplateDocument>;
  weapons: Record<string, ProjectWeaponTemplateDocument>;
  gears: Record<string, ProjectGearTemplateDocument>;
  gearSets: Record<string, ProjectGearSetTemplateDocument>;
}

interface OperatorInstanceDocument {
  operatorSlug: string; // 内置 slug 或 project:operator:* 模板 ID
  // 其余养成字段省略
}

interface EndaxisProjectDocument {
  definitionLibrary?: ProjectDefinitionLibraryDocument;
  // 其余项目字段省略
}
```

四类项目模板分别使用 `project:operator:*`、`project:weapon:*`、`project:gear:*` 和 `project:gearSet:*` 命名空间。模板记录 key、记录 `id` 与物化定义的 `slug` 必须一致。内置 slug 与项目 ID 可由现有字符串引用字段统一承载；导入或复制发生冲突时必须生成新 ID 并重写项目内引用。

自定义定义只保存一份。多个轨道或场景可以引用同一模板；需要分叉时执行显式复制。

## 4. 解析与编译

项目加载后的定义解析顺序如下：

1. 校验项目 JSON、模板库结构、项目命名空间、记录身份和定义内容。
2. 构造项目模板覆盖在版本化 `GameDataRepository` 之上的统一查询视图；项目 ID 与内置 ID 冲突时失败关闭。
3. 面板解析、配装筛选、技能库生成、场景校验、编译与模拟只依赖统一查询视图。
4. 编译轨道时严格解析技能组 key、技能 key 和步骤 key。失配技能块留在原帧并就地报告，不自动删除、迁移或回退。
5. 一次模拟开始前编译定义和养成实例；模拟过程中不读取可变编辑状态。

组合查询视图属于应用装配，不能修改版本化仓库，也不能让核心编译器直接读取 Vue/Pinia 状态。

## 5. 模板编辑与技能块编辑

- 干员模板编辑器修改 `OperatorDefinition`，用于定义角色长期拥有的基础属性、技能、天赋、潜能、Buff 和能力实体。
- 技能块编辑器修改某一次释放的完整 `SkillDefinition` 覆盖，只影响该时间轴块。
- 两处复用相同的结构化技能表单和 DSL 校验，不建立隐藏的双向绑定。

模板内部 key 可自由改名、增删和重排。已有轨道引用不会被编辑器暗中修复；严格匹配发生在使用点解析和编译边界。这样既不限制模板创作，也不掩盖已经失效的技能块。

## 6. UI 与错误边界

选择器展示内置与项目模板的并集。项目模板应提供复制、重命名、删除和导入导出；删除被引用模板时必须阻止操作并列出引用位置。

实现至少拒绝：

- 项目模板 ID 重复、命名空间错误、记录身份不一致或引用缺失；
- 定义不满足可解释的 DSL 结构；
- 项目模板 ID 与内置数据冲突；
- 删除仍被场景引用的模板；
- 导入时产生未处理的身份冲突。

模板不要求为已有轨道保留旧 key。引用一致性问题必须在具体使用位置显示，不能为使项目通过校验而静默改写时间轴。

## 7. 当前进度与顺序

1. 已完成项目级定义库、来源审计、统一查询视图、项目校验和序列化往返。
2. 已完成项目级撤销/重做；场景命令通过活动场景适配器与模板修改共享历史。
3. 已完成“自定义干员”从当前模板物化、原子切换当前轨道、统一列表、定义编辑和严格失配诊断。
4. 下一步接入真实项目打开/保存页面，并补项目模板 ID 的持久分配器，替代页面样板计数器。
5. 随后为武器、装备和套装接入派生与编辑入口；它们的 schema、项目库及统一列表查询已经具备。
6. 最后增加空白模板、项目内复制、删除引用保护和导入冲突重写。

首个稳定存档版本发布前不为中间 schema 编写迁移。正式发布后，自定义定义和引用才进入版本迁移承诺。
