# 非 Buff 状态与能力实体的状态栏展示边界

## 结论

旧版没有独立的能力实体运行模型。它把一部分需要被排轴者观察的持续对象直接实现为 `status`
效果，并借用 Buff 图标、层数和持续条展示。Next 已经按原生数据把 Buff 与能力实体拆成两个领域对象，
因此不能把旧版实现方式原样搬回运行时；但状态栏仍应恢复这些对象的**可见性**。

正确边界是：

- 战斗规则始终读取真实的能力实体实例、实体局部时钟、实体 Buff 和结束事件；
- 状态栏可以同时展示 Buff 生命周期和能力实体生命周期，但展示项必须保留来源种类，不能把实体伪造成
  一个可参与条件、叠层或消费的 Buff；
- 只有经过逐项确认的持续玩法对象进入状态栏。投射物、瞬时伤害范围、假目标、镜像、激光目标等即使
  技术上也是 AbilityEntity，也默认不显示；
- 展示起止帧必须来自 `AbilityEntitySpawned` / `AbilityEntityFinished` 回执，不能用技能面板上的固定秒数
  猜测；实体受到局部时间倍率、提前结束或数量上限替换时，显示自然跟随真实模拟结果；
- 名称、图标和计数方式属于显式展示语义。游戏原始资产已经声明的内容必须由转换器直接归一化，
  不能在 Endaxis 中再手工配置一份；也不能从原生 ID 字符串、子技能名称或寿命长短猜测缺失内容。

## 原生展示语义是唯一事实源

“不同状态的显示规则不能用一条通用算法推断”不等于“每名干员都要手工配置”。正确结构是：

1. 按游戏原生机制实现多个严格适配器，例如 Buff `iconConfig`、以 AbilityEntity/TimedMarker 为图标
   倒计时源的 Buff、角色 HUD 计数器；
2. 各适配器把原生字段归一化为同一份只读状态展示契约；
3. 投影器只读取归一化定义和真实运行回执，不再解释原始资产，也不维护第二份名称、图标或层数规则。

当前 Buff 链已经严格提取 `visible`、头顶/队伍显示位、图标、样式和排序等字段；这些 Buff 必须零配置
显示。原生代码还证明 `AbilityEntityController` 实现 `IBuffIconDurationSource`，`CreateBuffAction` 和
`AuraAction` 可通过 `overrideBuffIconDuration` / `buffIconDurationSource` 让真实 Buff 图标显示能力实体或
`TimedMarker` 的剩余时间。原始资产中的编辑器说明明确写着“当 ActionOwner 是 AbilityEntity 时，Buff
图标倒计时显示 Owner 的剩余时间”。因此许多旧版“能力实体状态”更可能是**真实 Buff 图标 + 实体
倒计时源**，而不是能力实体自身拥有另一套图标定义。

当前转换器虽然严格解析了上述动作字段，但战斗投影明确丢弃了这层只影响图标的倒计时来源；时间轴仍
按 Buff 自身寿命绘制。这是已经定位的展示语义损失。当前 AbilityEntity 模板链也只解码逻辑前缀，组件
数量和 RID 仍只是解码边界。两者都属于**转换器覆盖缺口**，不能当成原始游戏没有展示语义的证据。

当前 IL2CPP 静态证据只覆盖 `Gameplay.Beyond.dll`：能看到 `AbilitySystem.onBuffIconChange`、
`OnBuffIconChange`、Buff 合并/层数规则和倒计时来源，但尚未包含订阅该事件并最终绘制图标的完整 UI/View
程序集。后续若要完全复刻布局与动画，需要扩展 dump；生成状态定义不应等待视觉控件反编译完成。

只有同时满足以下条件时才允许产品兜底：已经审计相关原始资产及专用 UI 控制器；确认没有足够的原生
展示语义；该状态对排轴仍有必要。兜底必须单独标为 `legacyFallback`，记录证据和原因；一旦转换器取得
完整原生定义，校验器必须拒绝同身份继续保留兜底，防止两份数据漂移。自定义干员是另一种情况：其
编辑结果本身就是定义来源，不属于内置游戏数据的人工覆写。

## 已确认的新旧对应

| 旧版直接模拟的状态 | Next 原生能力实体证据 | 对应结论 | 计数注意事项 |
| --- | --- | --- | --- |
| 赛希 `xaihi-auxiliary-crystal`（支援晶体） | `abilityentity_chr_0011_seraph_normal_skill`，战技生成，实体内部承载治疗与连携计数 Buff | 确认对应 | 旧版的 2 层表示剩余使用次数，不是两个实体。Next 是一个实体；内部 `buff_chr_0011_seraph_combo_count` 达到 2 后结束实体。因此不能用存活实例数冒充旧版层数。 |
| 庄方宜 `zhuangfangyi-sunderblades`（青霆剑） | `abilityentity_chr_0030_zhuangfy_normal_skill_sword`，每把剑独立生成、独立结束，并受动态寿命与数量上限控制 | 确认对应 | 计数可以来自同 owner 下存活的同类实体数；各实例寿命独立，不能合成一个假的刷新型 Buff。 |
| 汤汤 `tangtang-whirlpools`（涡流） | `abilityentity_chr_0027_tangtang_comboskill_water`，连携生成，原生最大同时存在 2 个，后续技能会查找这些实例 | 确认对应 | 适合按存活实例数显示 1/2；实体自身与其产生的水龙卷伤害/易伤 Buff 是不同状态。 |
| 艾维文娜 `avywenna-thunderlance` / `avywenna-thunderlance-ex`（雷枪/强雷枪） | `abilityentity_chr_0012_avywen_combo_skill_lance` / `abilityentity_chr_0012_avywen_ultimate_skill`，战技查找并召回实体 | 确认对应 | 旧版普通雷枪一次显示 3 层，而 Next 当前是一份逻辑实体蓝图；层数不能仅按实例数计算，需继续从原生实体内部状态或可靠展示证据闭合。 |
| 萤石 `fluorite-battle-improvised-explosive`（自制炸弹） | `abilityentity_chr_0022_bounda_normal_skill`，以敌人为目标生成，子技能延迟结算伤害 | 确认对应 | 它应出现在敌方状态区；旧版写 3 秒，Next 模板寿命为 5 秒，最终持续条以真实生成/结束回执为准，旧值只作差异审计。 |
| 诀 `arcane-gloompurger-array`（破晦阵） | `abilityentity_chr_0032_lizhiyan_ultimate_skill`，奥义按 `duration_aura` 覆盖模板寿命生成，技能和 Buff 会查找该实体 | 确认对应 | 展示主阵实体，不展示 place、laser、laser target、death 等内部配套实体；集束打击计数仍是独立 Buff 状态。 |

这些对应不是按名称相似得出：每一项都同时具备旧版可见 `status`、Next 的明确生成动作，以及后续
查找、消费、结束或子技能行为证据。

## 已检查但不能等同的项目

- 莱万汀“熔火”是角色积累状态；战技火球能力实体只是一次技能的伤害载体，两者不是同一对象。
- 终末地管理员“源石结晶”、大潘“备料”、卡缪“追猎”、洛茜“精准衔接”等在旧版承担资源、
  技能窗口或角色 Buff 语义，不能因为名字像场上物体就改成能力实体展示。
- 卡缪战技蝙蝠等 Next 持续实体在旧版没有对应可见状态。是否新增为状态栏项目，需要游戏 UI 或
  资源展示字段证据；“寿命较长”本身不足以判定应当显示。
- 其他攻击辅助实体（庄方宜普攻雷击范围、Ardelia 羊形攻击、诀的激光与落点、假目标等）默认隐藏。
  它们仍完整参与模拟与战斗日志，只是不占用状态栏。

## 建议的实现结构

当前 `projectBuffTimelineViz` 只消费 Buff 回执，这是正确的 Buff 边界，不应把能力实体事件塞进该函数。
应新增并列的能力实体状态投影，再在 UI 层合并布局：

1. 通用状态指示器投影按归一化定义选择事实适配器；能力实体适配器配对 `AbilityEntitySpawned` 与
   `AbilityEntityFinished`，以运行时实例 ID 保留精确生命周期。
2. 内置干员的 `statusIndicators` 应由转换器从原生展示机制生成，而不是人工抄写。没有归一化定义即
   不显示；应先补提取器或取得缺失证据，不能由 UI 临时猜测。极少数兼容兜底与生成定义隔离维护。
3. Buff 段与实体段实现共同的只读视觉段契约，但保留 `kind: 'buff' | 'abilityEntity'` 和各自身份。
   tooltip 与调试信息必须能说明它究竟是哪一种运行对象。
4. 第一批只接入上述六组已确认对应；每组用真实场景回执锁定开始、提前结束、替换和计数变化。
5. 计数策略至少要区分“存活实例数”和“实体内部剩余次数”。赛希与艾维文娜的旧版层数证明了
   `layers = live instance count` 不能作为全局默认值；未闭合的层数宁可暂不显示，也不能造规则。
6. 同一玩法对象的内部 Buff 默认不重复显示；只有它本身具有独立名称、图标和玩法含义时才并列展示。
   例如破晦阵与集束打击计数应同时存在，而支援晶体内部的完成/销毁控制 Buff 不应单列。

## 验收顺序

1. 庄方宜青霆剑：验证多实例、独立寿命、最早实例被数量上限回收。
2. 汤汤涡流：验证 1/2 个实例计数和被后续技能查找后的变化。
3. 萤石自制炸弹：验证敌方状态区与模板寿命差异。
4. 诀破晦阵：验证只展示主实体，内部实体不污染状态栏。
5. 赛希支援晶体：先补“剩余次数”展示来源，再复刻 2 → 1 → 结束。
6. 艾维文娜雷枪：取得普通雷枪 3 层的可靠数据来源后再打开层数角标。

旧版数据用于确认排轴者需要观察什么以及发现数量/时长差异；最终生命周期和战斗行为以
`combat-spec`、解包资产和 Next 实际回执为准。

## 问题不能只按 AbilityEntity 解决

旧版的 `status` 同时承担了两种职责：一是模拟 Buff，二是给任何需要观察的持续机制提供图标、层数和
持续条。因此“旧版显示为 Buff”并不能证明它在游戏规则中是 Buff。当前已能看到至少四种来源：

| Next 中的真实来源 | 旧版示例 | 正确处理 |
| --- | --- | --- |
| 真实 Buff 实例 | 莱万汀熔火、大潘备料、安塔尔聚焦、角色增益和敌方减益 | 读取 `BuffApplied` / `BuffFinished` 及真实层数；已有原生展示字段时直接生成。字段缺失时先检查专用 UI 资产和提取器覆盖，不能立即补产品配置，更不能另造 Buff。 |
| 真实能力实体 | 支援晶体、青霆剑、涡流、雷枪、自制炸弹、破晦阵 | 读取实体生成/结束及必要的实体宿主 Buff；不能把实体重新放进 Buff 容器。 |
| 已有专用生命周期 | 连携窗口、终结技强化、技能冷却 | 继续使用专用投影和专用视觉层。旧版曾用 status 只是旧架构限制，不应为了“像旧版”重复画进状态栏。 |
| 复合或派生的可观察状态 | 支援晶体剩余次数、多个青霆剑实例的合计、不同类型雷枪的合计 | 从多个真实回执做只读归并；归并规则必须逐项配置，不能写进模拟运行时。 |

因此最终要设计的不是“所有能力实体默认可见”，而是**由原生展示机制生成的统一状态指示器定义**。
Buff 和实体定义仍保持各自唯一、稳定的游戏数据结构；生成的指示器引用这些身份并保留原生规定的
展示方式。是否放在 `OperatorDefinition` 内只是最终装配位置，不表示它由人工按干员维护。

## 定义的归属

建议在公共游戏数据契约中定义稳定的 `StatusIndicatorDefinition`。转换器通过原生机制适配器生成
内置游戏数据；Next 装配时只消费生成结果：

```text
packages/game-data-contract
  只定义 StatusIndicatorDefinition 的唯一稳定契约

tools/game-data-compiler
  从 Buff iconConfig、图标倒计时来源、角色 HUD 控制器等原生证据生成归一化定义

src/next/data/operators/generated-definitions/
  与干员规则定义一同承载生成的 statusIndicators

src/next/data/status-indicator-fallbacks/
  仅保存已审计且原生证据确实不足的 legacyFallback；正常内置数据不得进入这里
```

这样做有三个目的：

- 游戏更新后，展示定义与原始资产一同重生成，不会和手写副本漂移；
- 转换器不依赖 Endaxis UI，只实现有反编译或资产字段依据的原生机制适配器；
- 自定义完整干员定义仍可携带同一份契约，编辑器以后可以编辑，而不是建立第二套私有格式。

原生 Buff 已有可信 `presentation` 时自动归一化，不要求重复填写指示器。非 Buff 和复合状态也应优先
从其原生展示组件或专用 HUD 逻辑生成。产品兜底不是处理“生成器暂时不会”的捷径。

## 建议的稳定契约

下列草案刻意使用封闭联合类型。它不是任意回执查询语言，不允许填写事件名、表达式字符串或 JavaScript
回调；每增加一种来源或计数方式，都必须先证明它是可复用的产品语义。

```ts
export interface StatusIndicatorDefinition {
  readonly key: string;
  readonly provenance: StatusIndicatorProvenance;
  readonly source: StatusIndicatorSource;
  readonly anchor: 'sourceOperator' | 'buffTarget' | 'enemy';
  readonly aggregation: 'perInstance' | 'grouped';
  readonly badge?: StatusIndicatorBadge;
  readonly presentation: StatusIndicatorPresentation;
  /** 本指示器已完整代替这些 Buff 的默认图标，避免重复显示。 */
  readonly replacesDefaultBuffPresentationIds?: readonly string[];
}

export type StatusIndicatorProvenance =
  | { readonly kind: 'native'; readonly mechanism: string; readonly sourcePath: string }
  | { readonly kind: 'legacyFallback'; readonly evidence: string; readonly reason: string }
  | { readonly kind: 'custom' };

export type StatusIndicatorSource =
  | {
      readonly kind: 'buff';
      readonly buffIds: readonly string[];
    }
  | {
      readonly kind: 'abilityEntity';
      readonly abilityEntityIds: readonly string[];
    };

export type StatusIndicatorBadge =
  | { readonly kind: 'buffLayers' }
  | { readonly kind: 'activeSourceCount' }
  | {
      /** 在当前来源能力实体的 Buff 容器中读取计数，并显示 maximum - layers。 */
      readonly kind: 'remainingHostedBuffLayers';
      readonly buffId: string;
      readonly maximum: number;
    }
  | {
      /** 不同实体模板代表不同数量时，按模板显式加权。 */
      readonly kind: 'weightedActiveEntityCount';
      readonly weights: Readonly<Record<string, number>>;
    };

export interface StatusIndicatorPresentation {
  readonly nameKey: string;
  readonly iconId?: string;
  readonly iconPath?: string;
  /** 熔火等状态可以按真实层数切换图标；数组下标 0 对应值 1。 */
  readonly iconPathsByValue?: readonly string[];
  readonly showBadge?: boolean;
  readonly showDurationBar?: boolean;
}
```

契约中的三个维度必须分开：

- `source` 决定何时存在以及何时结束；
- `badge` 决定某一帧显示什么数值；
- `presentation` 只决定名字、图标和绘制方式。

不能用一个模糊的 `stacks` 字段同时表达实体数量、Buff 层数和剩余使用次数。

`anchor` 也不能从目标 ID 猜测：萤石炸弹显示在敌方区；青霆剑显示在来源干员轨；队伍 Buff 则可按
实际 Buff 目标显示。能力实体的运行时 `targetId` 是实体实例句柄，本身不是应该承载图标的 UI 轨道。

投影输出应收敛为统一但保留来源身份的只读段：

```ts
export interface StatusIndicatorSegment {
  readonly indicatorKey: string;
  readonly sourceKind: 'buff' | 'abilityEntity';
  readonly anchorId: string;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly value?: number;
  readonly presentation: StatusIndicatorPresentation;
}
```

`sourceKind` 和实际实例身份不能在中间层丢失；tooltip、日志定位和后续编辑器必须能回到真实 Buff 或
实体，而不是只剩一个无法审计的彩色条。

同一帧可能先结束实体宿主的内部 Buff，再记录 `AbilityEntityFinished`，也可能连续施加、叠层和消费。
投影器应按帧分组，按 receipt sequence 完成该帧所有状态归约后再输出一次可见状态变化。不能为同帧
中间态生成零长度段，否则支援晶体结束时可能短暂从 1 跳回 2，批量生成的青霆剑也会产生闪烁。

## 典型归一化结果

以下代码表示转换器或自定义干员编辑器产出的最终契约，不表示内置干员要人工填写这些对象。示例中的
旧版图片路径只是待追溯线索；在对应原生展示语义闭合前，不能直接落入正式生成物。

### 莱万汀熔火：真实 Buff 层数与分层图标

```ts
{
  key: 'meltingFlame',
  provenance: {
    kind: 'native',
    mechanism: '待从角色 HUD 或 Buff 展示链闭合',
    sourcePath: '待取得',
  },
  source: { kind: 'buff', buffIds: ['buff_chr_0016_laevat_energy'] },
  anchor: 'buffTarget',
  aggregation: 'grouped',
  badge: { kind: 'buffLayers' },
  presentation: {
    nameKey: 'meltingFlame',
    iconPathsByValue: [
      '/operators/laevatain/magma_1.webp',
      '/operators/laevatain/magma_2.webp',
      '/operators/laevatain/magma_3.webp',
      '/operators/laevatain/magma_4.webp',
    ],
    showBadge: true,
    showDurationBar: false,
  },
}
```

这段仅刻画期望的归一化形状，**现在不能作为正式配置提交**。当前证据只能证明能量 Buff、满层表现
Buff 和减抗显示 Buff 的原生行为链；四级图标究竟来自哪个 HUD/资产控制器仍需追溯。熔火没有持续
时间，直到被技能消费；所以也不应为了复刻旧版的 `duration: 999` 画一条虚假的 999 秒条。

### 庄方宜青霆剑：实体组数量

```ts
{
  key: 'sunderblades',
  provenance: {
    kind: 'native',
    mechanism: '待解码的 AbilityEntity 展示机制',
    sourcePath: '待取得',
  },
  source: {
    kind: 'abilityEntity',
    abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_sword'],
  },
  anchor: 'sourceOperator',
  aggregation: 'grouped',
  badge: { kind: 'activeSourceCount' },
  presentation: {
    nameKey: 'sunderblades',
    iconPath: '/operators/zhuang-fangyi/battle.webp',
    showBadge: true,
    showDurationBar: true,
  },
}
```

投影在任一剑生成或结束时切分状态段并更新数量。每把剑仍保留独立寿命；聚合只是显示，不会改成共享
持续时间或刷新型 Buff。

### 赛希支援晶体：实体寿命与内部计数的组合

```ts
{
  key: 'auxiliaryCrystal',
  provenance: {
    kind: 'native',
    mechanism: '待解码的 AbilityEntity/HUD 计数机制',
    sourcePath: '待取得',
  },
  source: {
    kind: 'abilityEntity',
    abilityEntityIds: ['abilityentity_chr_0011_seraph_normal_skill'],
  },
  anchor: 'sourceOperator',
  aggregation: 'grouped',
  badge: {
    kind: 'remainingHostedBuffLayers',
    buffId: 'buff_chr_0011_seraph_combo_count',
    maximum: 2,
  },
  presentation: {
    nameKey: 'auxiliaryCrystal',
    iconPath: '/operators/xaihi/battle.webp',
    showBadge: true,
    showDurationBar: true,
  },
}
```

实体生成时显示 2，宿主计数 Buff 到 1 层时显示 1，实体结束时关闭。计数 Buff 自身不进入状态栏。

### 艾维文娜雷枪：显式加权而不是猜实例数

普通雷枪与强雷枪应拆成两个指示器，分别使用各自名称和图标。若后续证据确认“一份普通雷枪实体表示
三柄、强雷枪表示一柄”，普通项可使用：

```ts
badge: {
  kind: 'weightedActiveEntityCount',
  weights: { abilityentity_chr_0012_avywen_combo_skill_lance: 3 },
}
```

在该 3 层关系取得可靠证据前，只显示存在时间而不显示角标；旧版数值不能单独成为生产规则证据。

## 旧版可见状态的全量处置门禁

需要建立一次性的旧版可见状态清单，但**旧版 ID 不进入运行时契约**。审计表中每个旧版非隐藏
`status` 必须且只能落入以下一种处置：

1. `nativeBuffPresentation`：Next 的真实 Buff 已携带可信展示信息；
2. `nativeStatusIndicator`：由 Buff 以外的原生展示机制适配器生成，读取能力实体或复合事实；
3. `dedicatedTimelineLayer`：连携窗口、冷却、强化状态等已有更准确的专用展示；
4. `legacyFallback`：已审计原始资产但展示语义确实不足，仍需兼容旧版可观察状态，必须附证据和原因；
5. `intentionallyNotDisplayed`：旧版显示属于错误或无价值内部状态，必须附证据和原因。

生成器可以检查配置引用的 Buff/实体是否存在、类型是否匹配、图标和 i18n 键是否可解析，也可以输出
“尚未处置”的审计报告；但不能根据名字、寿命、最大叠层或是否有子技能自动选择处置方式。

契约校验至少应拒绝：重复指示器键、不存在的 Buff/实体 ID、与来源不兼容的 badge、非正数 maximum
或权重、`iconPathsByValue` 与可达值范围不一致，以及两个指示器同时替代同一默认 Buff 展示。若同一
身份已有完整 `native` 定义，也必须拒绝 `legacyFallback`，避免人工副本覆盖原始游戏语义。
仓库装配还应验证每项配置只挂到能够实际拥有这些来源定义的干员，避免跨干员字符串引用悄悄失效。

第一轮实现应先扩展源资产提取与原生机制审计，再建立契约、通用投影和上述门禁。优先用已经带完整
Buff `presentation` 的样本证明零配置链路；青霆剑、涡流、萤石炸弹、支援晶体等必须先找到原生展示
组件或专用 HUD 语义。熔火四级图标和艾维文娜计数未闭合前只保留审计项，不应手配进正式定义。
