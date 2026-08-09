# Endaxis Next 构筑编译调用链

## 当前链路

1. `ScenarioDocument` 在 `builds` 中保存 `OperatorBuildDocument`、`WeaponBuildDocument`、`GearBuildDocument`，轨道只保存这些 Build 的引用。
2. `resolveScenarioBuilds` 是目录身份进入编译流水线的统一边界。它按轨道顺序解析干员、武器、四个装备槽和生效三件套，并严格检查缺失引用、重复干员 Build、武器类型及装备槽位兼容性。
3. `compileResolvedScenarioTimeline` 和 `compileResolvedScenarioEquipment` 只读取解析产物，不再按 slug 查询目录；`compileScenarioRuntimeAssembly` 一次解析后把同一结果交给二者。
4. 保留的 `compileScenarioTimeline` 与 `compileScenarioEquipment` 是独立编译入口。前者只需要干员目录，后者会先调用统一解析器，便于测试和外部工具按阶段使用。
5. `compileEquipment` 已能按已选词条等级解析武器、装备和三件套贡献，并将 `main` / `secondary` 映射为装备者的真实四维属性。
6. `compileScenarioResources` 只解析队伍身份与资源初值；其上限、回能倍率等规则仍由尚未完成的构筑解析阶段显式提供。
7. 面板侧目前只有通用 `CombatAttributeSet` 聚合公式和外部注入的运行时实体，尚无“干员成长 + 武器基础攻击 + 装备基础防御 + 常驻贡献”的面板计算器，也没有可供应用层读取的完整面板快照。

## Build Resolver 的边界

`ResolvedScenarioBuild` 保存项目 Build 与目录定义的配对结果，以及由三件规则推导出的生效套装。它是当前构筑解析的第一阶段，不是最终面板：

- 不向存档写入任何派生值；
- 不为缺少武器或装备的编辑中间态补默认对象；
- 不计算成长、武器攻击或装备防御；
- 不把静态修正安装进战斗属性；
- 后续面板、资源规则和技能升级解析应继续扩展独立阶段，不得绕过它重新查询目录。

这样可以让编辑器保留未完成配装，同时让需要完整事实的编译阶段统一失败，而不是不同模块得到互相矛盾的解释。

## 后续缺口

- 干员等级、晋升、信赖和 `baseStatOverrides` 尚未编译为基础属性。
- 武器等级与调谐对应的基础攻击成长规则尚未闭环。
- 装备 `baseDefense`、四维、普通面板属性和伤害加成尚未安装到正式面板/伤害读取端口。
- 潜能、天赋、武器潜能及装备事件监听器仍缺少各自的编译与运行时注册链路。
- `runScenarioSimulation` 尚无最终面板快照；在 Build Resolver 建立前不应从零散状态拼装近似结果。
