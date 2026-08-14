# 武器与装备定义结构蓝图

本文定义 Endaxis Next 中武器、装备和套装从只读游戏数据进入构筑、编译和战斗运行时的目标契约。它与 `SkillDefinition` 蓝图互补：配装不另造一套战斗语言，动态能力必须复用统一事件、条件和有序步骤。

## 1. 设计目标

- 定义文件只保存游戏事实，不保存用户选择的等级、潜能或精锻状态。
- 项目只保存定义引用和用户可编辑实例值，不复制武器、装备默认属性。
- 静态面板贡献在构筑编译阶段解析；战斗期行为在运行时安装。
- 武器词条、装备词条和套装效果使用同一种贡献结构。
- 名称和描述由按需 locale 提供；战斗定义不保存已翻译文本。
- 无法从原始数据确认的能力必须进入审计缺口，不得用近似数值静默生成。

## 2. 分层结构

```text
只读游戏定义
  WeaponDefinition
  GearDefinition
  GearSetDefinition
        |
        v
项目实例
  WeaponInstanceDocument
  GearInstanceDocument
        |
        v
ResolvedScenarioBuild
  定义 + 用户等级 + 装备者主副属性 + 三件套结果
        |
        v
CompiledEquipmentContribution[]
  已展开的静态修正 + 已编译事件处理器 + 稳定来源
        |
        +--> resolveOperatorPanel：静态面板和战斗快照
        |
        +--> 语义事件运行时：安装战斗期监听器
```

定义层不得读取项目，运行时不得回查定义或重新解析等级值。

## 3. 公共贡献结构

```ts
interface EquipmentContributionDefinition {
  modifiers?: readonly EquipmentModifierDefinition[];
  eventHandlers?: readonly EquipmentEventHandlerDefinition[];
}
```

一项贡献可以同时包含构筑期常驻修正与战斗期事件行为。两者职责不同，不能把事件触发增益提前折算为常驻面板。

### 3.1 常驻修正

```ts
type EquipmentModifierDefinition =
  | {
      kind: 'attribute';
      attribute: OperatorAttribute | 'main' | 'secondary';
      operation: 'flat' | 'percent';
      value: LevelValues;
    }
  | {
      kind: 'panelStat';
      stat: EquipmentPanelStat;
      value: LevelValues;
    }
  | {
      kind: 'damageBonus';
      damageTypes: DamageType | readonly DamageType[];
      skillTypes?: SkillType | readonly SkillType[];
      value: LevelValues;
    };
```

- `attribute` 修改四维属性；`main`、`secondary` 在 Build Resolver 中解析为装备者的实际属性。
- `panelStat` 只用于无需按伤害或技能分类筛选的面板字段。
- `damageBonus` 在每次伤害时按伤害类型和可选技能类型筛选，不能塞入普通面板字段。
- 百分比统一使用小数；`LevelValues` 单值表示所有词条等级相同。

后续新增常驻修正必须先确认合并槽位和消费位置。不能增加一个含义模糊的任意 `statKey`。

### 3.2 战斗期事件

```ts
interface EquipmentEventHandlerDefinition {
  key: string;
  event: CombatEventTrigger;
  condition?: CombatCondition;
  sequence: ActionSequenceDefinition;
}
```

事件身份、条件树和步骤序列与干员技能共用正式类型。运行时流程为：

1. 战斗装配时按装备来源安装监听器。
2. 统一语义事件层广播事件。
3. 监听器检查来源范围和条件。
4. 按明确优先级与声明顺序执行 `sequence`。
5. 卸下装备或结束战斗时释放注册句柄。

当前编译器已经生成 `CompiledEquipmentEventHandler`，但正式事件安装尚未闭环，因此这部分属于“部分接入”。

## 4. 武器定义

```ts
interface WeaponDefinition {
  slug: string;
  iconPath?: string;
  rarity: WeaponRarity;
  weaponType: OperatorWeaponType;
  baseAttackAtLevelNodes: readonly number[];
  traits: readonly WeaponTraitDefinition[];
}

interface WeaponTraitDefinition extends EquipmentContributionDefinition {
  key: string;
  levelCount: number;
}
```

### 4.1 基础攻击

`baseAttackAtLevelNodes` 当前对应 1、20、40、60、80、90 级节点。非节点等级必须由已确认的成长规则解析；在规则进入核心前，不允许线性插值。

### 4.2 词条等级

项目中的 `traitLevels` 直接表示三条词条的最终等级。潜能与基质只是游戏 UI 中提高词条等级的来源，不进入模拟存档，也不需要单独建模。

- 三星武器可有两条词条。
- 四星及以上通常有三条词条。
- `levelCount` 是该词条定义可解析的等级数量。
- 编译时要求实例词条数量与定义严格一致。

### 4.3 武器形态

现有 `WeaponDefinition` 尚未表达由属性、形态或战斗状态切换的武器能力。正式扩展前必须先从原始数据确认它属于：

- 构筑期选择；
- 战斗期条件分支；
- 同一词条内部事件行为；
- 或完全不同的武器定义。

在语义确认前，适配器应报告不支持，不能选取其中一个形态作为默认答案。

## 5. 装备定义

```ts
interface GearDefinition {
  slug: string;
  iconPath?: string;
  slotType: 'armor' | 'gloves' | 'accessory';
  levelRequirement: number;
  baseDefense: number;
  traits: readonly GearTraitDefinition[];
  gearSetSlug?: string;
}
```

- 两个配件槽共享 `accessory` 定义类型，槽位区别属于项目实例。
- `baseDefense` 是装备基础防御，不随词条精锻重复计算。
- `artificingLevels` 中的 `0` 表示初始档，编译时映射到词条定义的第一级。
- `gearSetSlug` 只声明归属，不在单件装备中复制套装效果。

## 6. 套装定义

```ts
interface GearSetDefinition extends EquipmentContributionDefinition {
  slug: string;
}
```

所有套装统一在装备三件及以上时生效，因此定义中不保存 `requiredCount`。Build Resolver 根据四个装备槽计算一次激活结果，面板和战斗运行时必须复用该结果，不能分别重新计数。

## 7. 编译产物与来源

```ts
interface CompiledEquipmentContribution {
  source: EquipmentContributionSource;
  selectedLevel: number;
  modifiers: readonly ResolvedEquipmentModifier[];
  eventHandlers: readonly CompiledEquipmentEventHandler[];
}
```

`source` 必须能稳定区分武器词条、装备词条和套装，用于面板明细、回执归因、诊断和运行时卸载。它不是本地化名称，也不应保存源文件路径。

编译阶段负责：

- 校验选择等级；
- 解析 `LevelValues`；
- 将相对主副属性解析为固定四维；
- 编译事件步骤中的等级值；
- 保留事件、条件和来源身份。

编译阶段不负责注册事件、修改可变 Buff 容器或执行伤害。

## 8. 项目存档

项目只保存：

```ts
interface WeaponInstanceDocument {
  weaponSlug: string;
  level: number;
  tuned: boolean;
  potential: number;
  traitLevels: number[];
}

interface GearInstanceDocument {
  gearSlug: string;
  artificingLevels: number[];
}
```

其中当前战斗计算实际依赖的是武器身份、等级、突破状态和最终词条等级，以及装备身份与精锻等级。`potential` 暂时保留为用户构筑信息，但不能与 `traitLevels` 重复叠加；若后续 UI 不再需要它，应通过项目版本迁移删除，而不是让编译器猜测二者关系。

存档不得保存定义中的基础攻击、防御、词条文本、套装描述或编译后贡献。数据版本更新后，未被用户直接编辑的游戏事实应由当前定义重新解析。

## 9. 严格校验

定义进入正式目录前至少应检查：

- slug 在对应目录内唯一；
- 武器星级、类型和成长节点合法；
- 词条 key 在单件定义内唯一；
- `levelCount` 与所有等级值长度一致；
- 装备槽位和套装引用存在；
- 套装统一按三件规则激活；
- 事件处理器 key 在单项贡献内唯一；
- 事件、条件和步骤通过统一严格校验；
- 未知字段、枚举和值类型立即失败。

项目实例还需检查定义引用、武器类型兼容、装备槽位、词条数量和等级范围。

## 10. 当前状态与下一步

| 能力                   | 当前状态                                                         | 下一步                                |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| 武器/装备/套装核心类型 | 已接入，定义级严格校验已覆盖真实共享目录                         | 将校验接入后续原始数据生成入口        |
| 构筑实例与选择 UI      | 已接入                                                           | 完善筛选与错误提示                    |
| 静态面板贡献           | 已接入                                                           | 扩大真实数据样本验证                  |
| 战斗增伤贡献           | 已编译并进入静态伤害快照                                         | 核对全部分类合并规则                  |
| 事件处理器编译         | 已接入统一语义事件层；伤害、技能命中和附着可同步触发             | 补齐状态到期/消费发布端与连携共用注册 |
| 动态 Buff 与内部冷却   | 通用条件、资源、Buff、状态和标记响应已具备装配入口，数据覆盖有限 | 用复杂武器和套装闭环                  |
| 武器形态               | 尚未建模                                                         | 先研究原始数据语义                    |
| 原始数据生成器         | 尚未形成完整闭环                                                 | 复用干员生成器的严格解析原则          |

优先验证样本应同时包含：静态面板词条、按伤害分类增伤、条件触发 Buff、内部冷却、叠层和套装事件。只有这些样本从定义贯通到 receipt，才能认为武器装备结构正式稳定。

当前配装事件不会伪造 `CompiledSkillProgram`。运行时保留武器词条、装备词条或套装来源，
并通过独立末端执行器处理尚未归入通用责任链的操作。装备事件直接造成伤害或元素附着时，
在来源分类、技能标签和倍率筛选规则取得反编译依据前，标准环境会在模拟前明确拒绝。
