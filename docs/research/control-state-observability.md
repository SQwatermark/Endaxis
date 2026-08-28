# 固定木桩的倒地／起身可观察边界（2026-08-28）

## 结论

`KnockDownAction` 是普通倒地物理异常，不是防反。敌人没有主动行为，因而不恢复敌人的
攻击、红圈、移动、倒地动画或起身后恢复行动能力；但不能同时删掉破防门、伤害、Buff、
控制免疫、干员侧事件和被读取的状态。原生事实见 combat-spec `docs/knockdown-action.md`。

**撤销“先接完整起身配置与控制器才能生成余烬”的前置路线。** 先查具体保留程序的读者，
只恢复对数值、Buff、条件和事件有影响的部分。当前根 KnockDown 仍未放开，完整度不增加。

## 本机盘点与证据边界

- 来源范围：2459 份 SkillData、2678 份 BuffData，共 5137 文件。不是全部游戏资产的完整性证明。
- 对倒地、起身、弱点中断三个标签连同祖先路径盘点：36 处引用，其中 21 处原生实体标签查询。
  写标签、Buff 分类查询与实体查询分开计数，不把 Owner/Source/Target 名称直接解释为敌人。
- 没有发现起身标签的直接字面读取；存在 `Status/Immobilized` 父级查询，不能据前一句就删除起身。
- 两份 `eny_0045_agtrinit_skill141*` 和 `buff_eny_0045_agtrinit_interrupt3tag` 有共 3 处未解析引用
  （2 个不同 ID）。保留在报告中，未忽略或猜路径；不能宣称全资产零未知，也不能自动认定它们与本问题无关。
- 本工具只是来源候选盘点，不做全程序活跃性证明：动态黑板、原生预定义查询、禁用节点、
  未编译技能、领域入口和 Buff 闭包仍需结合审计。不得据“扫描没有命中”自动放行新动作。

## 具体消费者

| 来源 | 实际读取／响应 | 本轮判断 |
| --- | --- | --- |
| `buff_equipsuit_knockdownup_01` | Attacker 侧伤害修正，查询 Target 的倒地标签，读取 `downdmg` | 倒地有数值意义，不能整体删除；当前表未查到该被动挂接，不能称已发布可用套装 |
| `buff_grounded_dam_up` / `cri_cridam_up` / `pen_up` | Target 倒地条件下增伤／暴击／穿透修正 | 来源候选；不能按文件名推断它们已进入构筑闭包 |
| `buff_chr_0009_azrila_talent_0_1` | `OnAfterOutputKnockDown` 后概率施加 Buff | 原始资源候选，不在当前余烬真实来源闭包；不能当成整名生成的前置需求 |
| `buff_chr_0015_lifeng_talent_2` | `OnBeforeOutputKnockDown` 执行动作序列 | 击倒前事件也是潜在战斗依赖，不能统一删除 |
| `buff_chr_0017_yvonne_normal_skill_projectile` | Buff 结束时查询 Owner 的 `Status/Immobilized` | 当前完整伊冯定义中该 Buff 的所有施加目标均为 caster；读取干员自身，不要求敌人起身 |
| `buff_chr_0030_zhuangfy_ult_base` | 查询 Source 的 `Status/Immobilized` | 来源指向干员侧的候选；庄方宜未完成，不据此宣称整名依赖已闭合 |
| `buff_eny_*` 的控制状态查询 | 敌人行动／护盾／伤害条件等混合用途 | 不因命名统一删除；仅固定木桩明确未安装的敌人逻辑不进入该场景 |

现有五份完整定义（秋栗、艾维文娜、狼卫、赛希、伊冯）实际对象已回归检查：可能读取起身
标签的条件只有伊冯的上述 buffOwner 查询，所有安装点均为 caster。这个结论只覆盖五份
完整定义，不等于其余 25 名、任意装备或用户自定义数据也不读取敌人起身。

## 实现约束与下一步

1. 最小根倒地切片保留破防门、状态 Buff、免疫准入、前后事件、返回策略。
2. 倒地标签持续时间有明确伤害读者，使用倒地请求时长与已证明的来源加成；不是关联 Buff 的寿命。
3. 若闭包没有敌方起身标签／祖先查询或其他状态读者，倒地到期后不必进入动画起身状态。
   这不需要导入 EnemyAnimExtraData，也不需要模拟恢复行动。
4. 新闭包出现敌方起身读者时明确阻断或补足该必要状态，不能悄悄当 false 或固定秒数。
5. 下一步贯通余烬根动作及其实际消费者所需的最小切片。根返回值与真正控制成功不同，
   不能以 `returnTrueWhen=Always` 当作必然击倒，也不能用旧 `outputKnockDown` 标记代替整条链。

上一轮未接入生产的 `getUpRuntime.ts` 及其测试已撤下；仅撤销这两个新原型文件。
combat-spec 的 `GetUpTimeState` 和回归保留为原生证据，不反向以木桩简化改写游戏事实。

## 复现

### 普通根执行切片（后续实现检查点）

`knockDownOperationExecutor.ts` 负责单敌人根入口、破防门、通用物理事件、状态 Buff 和返回策略；
`ordinaryKnockDownRuntime.ts` 负责组件准入、专属事件、共享容器标签及独立控制计时。
参数只定义于契约 `CombatStepParameters.applyKnockDown`；两个运行模块中的接口是同步调用端口，
不是新的序列化协议或第二份来源 schema。

测试显式提供无起身读者的到期退出回调，不能当作生产零秒起身默认值。标准环境现可显式装配
同一敌人控制实例，由 assembly 在 Buff 推进前输入实体 delta；来源属性已按元数据初始化，
专属前后事件已接公共 Buff 同步响应。正式入口尚未安装闭包消费者门禁/到期策略，根来源投影和标准预检
仍保持失败关闭。额外异常、敌人部位、浮空转倒地不在该切片的验收范围。既有五 Buff 编译闭包通过，
但本轮执行测试用可控的真实 Buff 容器定义验证流程，不能冒称五 Buff 的真实伤害数值已运行验收。

```powershell
npx vitest run src/next/core/combat/runtime/knockDownOperationExecutor.test.ts
npx vitest run src/next/core/combat/runtime/standardPlayerDamageKnockDown.test.ts
```

### 实体时钟与来源属性（本轮新增）

- 原生链见 combat-spec `docs/knockdown-action.md` 的“控制组件实体时钟”节：普通组件使用
  `rawFixedDelta × entityFinalScale`，不是 AbilitySystem 默认时钟，也不是状态 Buff 的时钟。
- `BoundCombatBattleRuntimes.enemyControlRuntime` 在本场实例内绑定；assembly 复用
  `TimeDilationRuntime.getEntityScale('enemy')`。模式 0/2 不改变该选择，冻屏暂停控制计时，
  而模式 2 的默认 Buff 寿命仍可能到期。没有在全局缓存单次控制状态。
- `AttributeMetaTable[34]` 的 default=0、min=0、无 max 已从 CDN 核实；来源 SHA-256：
  `7f0e7acd2200a049576002cfee643a46425edfa6b4b4ffc686f20061c634e5a4`。
  清单 `akedb-sources.json` 新增该表；临时下载到 `tmp/knockdown-sources`，未覆盖旧缓存账本。
- `beforeOutputKnockDown / afterOutputKnockDown` 是组件同步事件；不映射成旧 `outputKnockDown`
  或通用 After。新回归验证首次破防不触发、第二次同步响应、时长回调读取动态属性、跨场隔离。

### 余烬当前引用闭包纠正（本轮新增）

用当前 manifest、角色/养成表和 `resolveOperatorSourceClosure` 从真实根逐层装入 Buff，得到
**10 个 SkillData / 15 个 BuffData，missing=0、dynamic references=0**。附属被动仅
`chr_0009_azrila_talent_2`；起身及祖先标签来源扫描为 0，未知标签为 0。
这仍不是带任意装备/队友的完整场景验收，也不替代最终运行程序门禁。

此前被当成天赋依赖的 `buff_chr_0009_azrila_talent_0_1` **不在该闭包**，全缓存也未发现其
Skill/Buff 入边。它引用的 `buff_chr_0009_azrila_talent_0` 本地缺失、CDN 精确 URL 返回 404，
但不能将这个未挂接候选变成余烬阻塞，更不能猜定义或为它强行加入当前干员。其是否是历史残留
尚未取证。前序“必须先接余烬倒地天赋”的说法在当前来源下撤销；公共同步事件能力仍保留。

此次还发现既有 `parseBuffDefinitionReferenceNodes` 对全缓存预解析会被无关
`buff_cc_chr_no_lastcombo_stop_atb_recover_countdown` 中的 `GodEntityFinder` 阻断。
本次单干员核对按 missing Buff ID 逐层调用同一个严格解析器，没有放宽解析器或忽略可达错误。
后续应把按根懒加载接入通用来源盘点，而不是扩张与当前根无关的动作支持。

### 来源盘点

```powershell
npm run audit:game-data:tag-references -- --sources tmp/game-data-sources/skill-data-cdn --sources tmp/game-data-sources/BuffData --catalog src/next/data/combat/gameplayTagCatalog.generated.ts --tag Status/Immobilized/KnockDown --tag Status/Immobilized/Getup --tag Status/SkillCast/WeaknessInterrupted --output tmp/control-state-dependencies.json
npx vitest run tools/game-data-compiler/test/gameplayTagReferences.test.ts tools/game-data-compiler/test/controlStateBoundary.test.ts
```

报告保存逐文件 SHA-256、路径、原生类型、查询目标、禁用状态和未知引用。任何新来源或
场景变化需重跑；`controlStateBoundary.test.ts` 将新增的当前完整定义消费者显式暴露为失败，
要求重新审计，而不是把此结论写成永久的游戏规则。

前序联合回归 346 文件 / 4125 项通过（装配/事件投影切片），四套类型检查通过。

### 正式入口门禁与真实转换复查（2026-08-28 后续）

`knockDownProjection.ts` 仅接受普通干员来源与已证明唯一敌人目标；`isExtra=true` 拒绝。
`inspectKnockDownControlConsumers` 扫描整场静态编译入口，包含技能、Buff、能力实体、初始化、
被动、升级、连携、装备和面板修饰器；没有遍历可变运行状态。根动作存在时，任何非 caster 的
Getup/祖先查询均阻断，未明 BuffOwner 也不放行。未摆放程序仍扫描；这不是分支可达性或
跨 Buff 归属证明，可能保守拒绝实际上安全的组合（如伊冯 caster BuffOwner 读者）。
通过门禁才执行标准入口显式到期退出，不恢复敌人起身动画。隐式 Buff 闭包也检查其调度、
生命周期、Ability 和 Ignite 响应，不能只凭根步骤通过就宣称整个数值闭包可模拟。

前序全量主动矩阵重跑后为 **171/309、5 名完整、余烬 7/9**：

- 战技：`input_angle` 表现计算被判定流向战斗条件，需继续证明保留分支行为是否等价。
- 连携：潜能路径的 `CureTarget` 搜索排除已保存的主控，再按生命比例升序取一人；
  后续修改治疗黑板并对保存目标 Heal。需要真实上下文目标选择，不应在 Heal 时重新查人。
- 真实整名规划仍失败，未输出/登记余烬完整定义；下游未挂接旧天赋候选不属于这两项阻塞。

本轮前/后报告分别为 `tmp/knockdown-release-baseline/operator-active-skill-migration.json`
与 `tmp/knockdown-release-after/operator-active-skill-migration.json`；tmp 不提交。
最后回归数字见当前交接，不把这些结构测试计作余烬正式完成。

### 自下而上归约后的战技进展

用户确认 Next 保证攻击命中敌人。原生角度可以影响扇形范围，不应据此要求恢复范围模拟；
投影先处理末端，再删除没有实际行为的分支和纯条件，而不是把未知角度填成零。
当前余烬战技主体为 4 条调度序列，保留伤害、倒地、Buff 与时序，角度选择分支已不进入输出。
`input_angle` 的独立 Assign 仍保留；不是所有黑板写入都被当作读取，也未做通用死写消除。

最新矩阵 **172/309、5 名完整、余烬 8/9**。正式动作依赖收集同时补上隐式倒地/破防 Buff
及敌方目标归属，避免根来源已经取回依赖但正式动作树又丢失。连携仍被 CureTarget 目标查询阻断。
续作已按 combat-spec `keyword-actions.md` 接通 Shelter 公共载体及原始四件闭包。
战技连续施放两次的探针现已通过，包含庇护开/关两种输入、首次破防、再次倒地及伤害。
保留庇护 Buff 分类标签/优先级/子对象，不增加受击逻辑；不能将标签可被套装观察的载体全部删除。
探针使用通用面板并显式注入天赋开关，尚未完成原始养成与整名发布验收。
