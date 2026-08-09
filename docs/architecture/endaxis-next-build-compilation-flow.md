# Endaxis Next 构筑编译调用链

## 当前链路

1. `ScenarioDocument` 在 `builds` 中保存 `OperatorBuildDocument`、`WeaponBuildDocument`、`GearBuildDocument`，轨道只保存这些 Build 的引用。
2. `resolveScenarioBuilds` 是目录身份进入编译流水线的统一边界。它按轨道顺序解析干员、武器、四个装备槽和生效三件套，并严格检查缺失引用、重复干员 Build、武器类型及装备槽位兼容性。
3. `compileResolvedScenarioTimeline` 和 `compileResolvedScenarioEquipment` 只读取解析产物，不再按 slug 查询目录；`compileScenarioRuntimeAssembly` 一次解析后把同一结果交给二者。
4. 保留的 `compileScenarioTimeline` 与 `compileScenarioEquipment` 是独立编译入口。前者只需要干员目录，后者会先调用统一解析器，便于测试和外部工具按阶段使用。
5. `compileEquipment` 已能按已选词条等级解析武器、装备和三件套贡献，并将 `main` / `secondary` 映射为装备者的真实四维属性。
6. `compileScenarioResources` 只解析队伍身份与资源初值；其上限、回能倍率等规则仍由尚未完成的构筑解析阶段显式提供。
7. `resolveOperatorPanel` 已从解析构筑计算六个等级节点上的基础四维、阵列属性、武器攻击、装备防御、静态配装修正及面板相关天赋/潜能，并输出逐项来源回执。
8. `compileScenarioRuntimeAssembly` 将同一面板交给战斗操作执行器，`runScenarioSimulation` 也会返回本次模拟实际使用的面板；属性详情与伤害链不得另行计算。
9. `compileScenarioEnemy` 只从项目敌人实例编译生命、防御、抗性、处决倍率和帧制失衡规则；同一结果会进入每个操作执行器上下文，并由 `runScenarioSimulation` 返回。
10. `resolveStaticPlayerDamageSnapshots` 在每次标准伤害执行前，从上述面板和敌人程序冻结攻防快照，并按当前伤害类型与技能类型筛选静态配装增伤。动态 Buff、瞬时属性、目标状态和暴击采样仍由命中生命周期在对应阶段提供。
11. `runStandardPlayerDamageScenarioSimulation` 已能把上述编译结果交给严格标准生命伤害环境，并从同一敌人生命账本返回最终生命与伤害回执。调用方必须显式提供随机样本源和非随机命中输入；不支持的机制不会降级执行。

## Build Resolver 的边界

`ResolvedScenarioBuild` 保存项目 Build 与目录定义的配对结果，以及由三件规则推导出的生效套装。它是构筑解析的第一阶段，不是最终面板：

- 不向存档写入任何派生值；
- 不为缺少武器或装备的编辑中间态补默认对象；
- 不计算成长、武器攻击或装备防御，这些由后续 `resolveOperatorPanel` 负责；
- 不把静态修正安装进战斗属性；
- 后续面板、资源规则和技能升级解析应继续扩展独立阶段，不得绕过它重新查询目录。

这样可以让编辑器保留未完成配装，同时让需要完整事实的编译阶段统一失败，而不是不同模块得到互相矛盾的解释。

## 面板计算边界

当前面板计算严格支持：

- 干员与武器的 `1/20/40/60/80/90` 六个有源数据节点；
- 通用阵列主属性 `[10, 15, 15, 20]`，以及目录显式声明的例外；
- 主属性 `0.5%`、副属性 `0.2%` 的攻击换算，力量每点增加 `5` 生命；
- 武器基础攻击、装备基础防御、四维 flat/percent、普通面板 flat/percent；
- `addBuildAttribute` 与 `addPanelStat` 这两种构筑期养成修正；
- 不进入普通面板的静态 `damageBonus` 会作为 `combatModifiers` 保留。

尚未规范化的 `baseStatOverrides` 会明确失败，非等级节点也不会擅自插值。比率字段在核心中统一使用小数，UI 负责格式化为百分数。

轨道头的“属性详情”直接读取 `resolveOperatorPanel` 的结果，并可展开查看原始贡献来源；解析失败时按钮保持不可用并通过标题暴露原因。弹窗不进行第二次计算，因此用户看到的数值与模拟器初始化收到的面板相同。

## 后续缺口

- 非六节点等级的成长规则尚未恢复，当前编辑器也只允许六个节点。
- `baseStatOverrides` 的稳定字段语义与迁移策略尚未确定。
- 静态面板、配装增伤和敌人防御属性已经能生成标准主动伤害快照；动态 Buff、事件环境、瞬时属性和暴击随机源尚未完成场景级装配。
- 严格标准生命伤害环境已经拥有敌人生命、实体事件和伤害修正注册表，但仍需由应用层显式选择具有证据的暴击采样与运行时倍率策略；它尚未成为 `runScenarioSimulation` 的隐式默认环境。
- 潜能、天赋、武器潜能及装备事件监听器仍缺少各自的编译与运行时注册链路。
- 来源回执目前记录原始基础值、flat 与 percent 贡献；若要复刻旧版公式分组展示，需要在核心中补充可结构化解释的派生计算步骤，而不是在 UI 中反推公式。
- 多节点失衡与 `superArmor` 尚未完成运行时闭环；编译器保留原始项目值，不把它们近似塞入现有单节点 `CombatVitals`。
