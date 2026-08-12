# Endaxis Next 核心数据模型

## 1. 为什么必须区分模型

旧版最难维护的问题之一，是一个对象同时承担编辑、持久化、运行时和展示职责。Next 将数据分成五类：

| 模型                 | 所有者       | 是否持久化 | 是否可变       | 典型内容                                 |
| -------------------- | ------------ | ---------- | -------------- | ---------------------------------------- |
| Project document     | 用户         | 是         | 通过命令替换   | 构筑、敌人、技能位置、显式编辑值         |
| Game catalog         | 游戏数据版本 | 否         | 否             | 干员技能、武器词条、装备定义、敌人默认值 |
| Compiled program     | 编译阶段     | 否         | 否             | 展开等级后的技能、输入、面板、装备贡献   |
| Runtime state        | 单场模拟     | 否         | 是             | 资源、Buff、生命、失衡、冷却、黑板       |
| Receipt / projection | 模拟与展示   | 否         | receipt 只追加 | 事实日志、曲线、诊断、分析               |

任何字段先判断属于哪一类，再决定放在哪里。

## 2. V2 存档

唯一定义位于 `src/next/core/project/schema.ts`，当前 `schemaVersion` 为 2，时间统一使用 30 FPS 的整数帧。

项目保存：

- 干员等级、突破、潜能、信赖、技能和天赋状态；
- 武器等级、突破、潜能和词条等级；
- 装备身份和精锻等级；
- 敌人目录引用或自定义值；
- 四条轨道和初始资源；
- 技能释放位置及用户可编辑字段；
- 用户连接、机制选择和场景设置；
- `gameDataRevision` 等版本身份。

项目不保存：

- 翻译后的技能名称和描述；
- 干员最终面板；
- 编译后的技能步骤；
- Buff、状态、冷却和资源运行时；
- 伤害结果、曲线、诊断和日志；
- 选择、悬停、弹窗、快捷键焦点和撤销游标；
- 主题和语言偏好。

### `edited` 的意义

技能块保存编辑器暴露的完整值，同时用 `edited` 标记用户明确接管的字段。这样项目可精确恢复当前编辑结果，又允许未来“按新目录刷新未编辑默认值”，不会依赖基线值比较猜测用户意图。

## 3. 游戏数据定义

目录对象是版本化、只读、可复用的蓝图。

### 干员

`operatorDefinition.ts` 中的核心关系是：

```text
OperatorDefinition
  -> SkillGroupDefinition
     -> SkillDefinition | SkillDefinition[]
        -> ScheduledSequenceDefinition[]
           -> ActionSequenceDefinition
              -> CombatStepDefinition[]
```

技能组用于编辑器分组和一次放置多个技能，例如普攻链。技能是可独立释放的稳定身份。CombatStep 是有序行为，不需要为每个叶子动作分配仪式性 ID。

### 武器、装备和套装

`equipmentDefinition.ts` 将效果分为：

- 构筑期静态 modifier；
- 战斗期 event handler；
- 面板数值、属性和伤害加成等可枚举贡献。

项目只保存所选对象和等级，目录保存默认规则。

### 敌人

`enemyDefinition.ts` 保存目录默认值；项目实例在选择时复制为可编辑输入。编译后形成 `CombatEnemyProgram`，运行时不再回查目录。

## 4. 有序动作模型

一个 Hit 中 Buff、伤害、失衡和资源的先后直接由数组顺序表达：

```ts
sequence([
  step('applyBuff', ...),
  step('dealDamage', ...),
  step('changeResource', ...),
]);
```

不使用 `beforeDamage`、`afterDamage` 等平行槽位。`conditional` 和 `once` 自己拥有嵌套 sequence，因此复杂分支仍保持一种执行语义。

## 5. 稳定身份与实例身份

- `operatorSlug`、`skillKey`、`weaponSlug` 等是目录稳定身份。
- build ID、skill cast ID、connection ID 是项目实例身份。
- Buff instance ID、skill cast runtime ID 是单场运行时身份。
- UI vnode key、hover key 是瞬时展示身份。

这些身份不能互相替代。翻译名称永远不是领域身份。

伤害连接只需要命中端点，因此持久化 `hitId`；不渲染也不被引用的 Buff 或资源步骤不保存额外 ID。

## 6. 编译产物

`core/compiler/combatProgram.ts` 定义运行时协议。编译器会：

- 选择当前技能等级的数值；
- 把秒转换到明确需要的帧边界；
- 保留动作顺序和条件树；
- 冻结构筑期面板和敌人输入；
- 生成按绝对帧排序的 `ScheduledSkillInput`。

编译产物是当前场景的派生值，不能写回项目或跨 game-data revision 长期缓存。

## 7. 运行时状态

每次模拟创建全新状态：

- `CombatResources`：共享技力和逐干员终结技能量；
- `SkillRuntime`：冷却、费用、执行游标、一次性 scope 和动作黑板；
- `CombatBuffContainer`：实体 Buff、叠层和修正注册；
- `CombatStatusContainer`：语义状态层数与持续时间；
- `CombatVitals`：生命和失衡；
- `TimedMarkerContainer`：原生定时标记；
- 随机样本源和事件分发器。

原则是“一场战斗、一个实体、一种状态一个所有者”。同一干员的技能 Buff 操作和伤害修正必须读取同一个 Buff runtime。

## 8. Receipt 和 projection

Receipt 记录“发生了什么”，不记录“UI 应如何画”。每条事实包含帧、时间、事件、来源/目标和结构化数据。

Projection 负责把事实转换为：

- 稀疏变化点；
- 连续曲线；
- 告警和诊断；
- 统计与伤害归因。

这样同一份模拟事实可以服务桌面 UI、移动只读页、导出图片和测试，而无需多次模拟。
