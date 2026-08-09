# Endaxis Next 构筑编译调用链

## 当前链路

1. `ScenarioDocument` 在 `builds` 中保存 `OperatorBuildDocument`、`WeaponBuildDocument`、`GearBuildDocument`，轨道只保存这些 Build 的引用。
2. `compileScenarioTimeline` 目前只解析干员 Build、目录技能和时间轴输入；`compileScenarioResources` 只解析队伍身份与资源初值。
3. `compileEquipment` 已能按已选词条等级解析武器、装备和三件套贡献，并将 `main` / `secondary` 映射为装备者的真实四维属性。
4. 此前 `compileScenarioRuntimeAssembly` 没有读取轨道的武器和装备引用，因此 `compileEquipment` 的产物无法进入 `CombatRuntimeAssembly` 或 `runScenarioSimulation`。
5. 面板侧目前只有通用 `CombatAttributeSet` 聚合公式和外部注入的运行时实体，没有“干员成长 + 武器基础攻击 + 装备基础防御 + 常驻贡献”的 Build Resolver，也没有可供应用层读取的完整面板快照。

## 本次选择

最靠前且可独立补齐的缺口是：按场景轨道解析装备 Build，编译真实装备贡献，并把贡献随干员程序送到运行时操作执行器上下文。该段只做已有 DSL 明确规定的身份、等级、槽位、套装三件规则和主副属性解析，不计算尚无正式聚合边界的面板数值。

## 后续缺口

- 干员等级、晋升、信赖和 `baseStatOverrides` 尚未编译为基础属性。
- 武器等级与调谐对应的基础攻击成长规则尚未闭环。
- 装备 `baseDefense`、四维、普通面板属性和伤害加成尚未安装到正式面板/伤害读取端口。
- 潜能、天赋、武器潜能及装备事件监听器仍缺少各自的编译与运行时注册链路。
- `runScenarioSimulation` 尚无最终面板快照；在 Build Resolver 建立前不应从零散状态拼装近似结果。
