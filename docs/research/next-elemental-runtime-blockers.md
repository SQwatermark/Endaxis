# Next 单敌人元素运行时装配缺口

## 结论

当前不能在应用层完整装配真实的敌人元素附着运行时。核心已经具备附着决策、Buff 容器、目录编译和附着到 Buff 的适配器，但版本化数据与逐帧调度尚未闭环。此时用一个简单的 `{ element, layers }` 变量代替 Buff 容器，会绕过叠层、爆发、异元素复合状态、持续时间和生命周期行为，因此不得进入正式模拟路径。

## 已具备的链路

1. `resolveElementalInfliction` 按当前附着生成语义操作。
2. `ElementalInflictionOperationExecutor` 在技能 sequence 指定的位置执行这些操作并记录回执。
3. `ElementalInflictionBuffAdapter` 可以把操作写入 `CombatBuffContainer`。
4. `CompiledCombatBuffCatalog` 可以把严格解析后的目录项编译为 Buff 定义和元素角色索引。
5. `compoundStatusFactoryCatalog` 已保存十二种有向异元素组合的工厂配方。

## 已确认缺口

1. `elemental-attachments.combat-1.4.4.json` 当前只有四项 `elementalAttachment`，缺少四种 `elementalBurst` 的完整 Buff 定义。
2. 同一目录缺少十二种 `compoundStatus` 最终 Buff 定义；工厂配方中的 `createdBuff.buffId` 因此没有可实例化的目录定义。
3. 复合状态工厂依赖的 `SkillSetting` 数值和增强公式尚未导出。其结果还需要来源干员的元素附着增强属性，不能只靠静态 JSON 合成。
4. `CombatRuntimeAssembly` 目前只逐帧调度显式传入的干员 `buffRuntime`，敌方仅暴露 `BuffOperationTarget`，没有敌方 Buff 的逐帧调度端口。即使成功施加附着，持续时间也不会正确推进和到期。

## 后续顺序

1. 从已确认版本的数据源导出元素爆发和复合状态最终 Buff，继续使用严格 schema，未知行为直接报错。
2. 导出复合状态所需的 `SkillSetting` 与增强公式，并补目录交叉引用校验。
3. 建立“工厂配方 + SkillSetting + 来源附着增强属性”到 Buff 应用参数的运行时端口。
4. 给战斗装配根增加敌方 Buff 帧运行时，并验证附着叠层、爆发、复合状态和自然到期。
5. 完成后再在应用层创建正式的单敌人环境，不保留简化回退。
