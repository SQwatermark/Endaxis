# Next 单敌人元素运行时装配缺口

## 结论

当前不能在应用层完整装配真实的敌人元素反应运行时。核心已经具备附着决策、Buff 容器、目录编译和附着到 Buff 的适配器，当前版本四系附着也已组成正式敌方实体运行时；但爆发与复合状态数据仍未闭环。此时用一个简单的 `{ element, layers }` 变量代替 Buff 容器，会绕过叠层、爆发、异元素复合状态、持续时间和生命周期行为，因此不得进入正式模拟路径。

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
4. 敌方 Buff 逐帧调度缺口已由 `c3b6fcf` 完成：装配入口现在强制接收 `enemyBuffRuntime`，并在每帧技能输入与动作前推进敌方 Buff 生命周期。
5. 四系附着目录现可创建独立的 `ElementalBuffRuntime`：通用 Buff 查询、元素附着写入和逐帧到期共享同一容器；每条技能执行链单独创建附着适配器，不共享投影中的附着实例。

## 已定位的数据与工具

- 复刻工具：`vfs-index-browser/combat-spec`
- 1.4.4 Buff 源目录：`vfs-index-browser/data/research-artifacts/combat-1.4.4/derived/buff-data-cdn`
- 已有命令：
  - `export-elemental-attachment-catalog`
  - `export-compound-status-factory-catalog`
  - `export-skill-setting-catalog`
  - `audit-compound-status-actions`
  - `validate-buffs`

上述源目录已经包含 4 个附着、4 个同元素爆发、12 个复合状态工厂、12 个复合状态最终 Buff 和 3 个自然复合状态 wrapper。当前不能直接导入的原因不是找不到 Buff，而是严格解析遇到尚未复刻的行为：

- `EnemyHurtAnimAction`
- `CheckSuperArmor`：9 处
- `ModifyDynamicBlackboard`：12 处
- `RefreshBuffAttrModifierValue`：6 处，核心目录原语已实现；它按当前 Buff 黑板重新构造并替换已注册的属性修正
- `StoreAttributeValue`：6 处

本地尚未找到匹配 1.4.4 的真实 `SkillSetting.json`。需要从 `Beyond.Gameplay.SkillSetting` ScriptableObject 导出：

- `spellInflictionDataList`：`key`、`desc`、四列 `values`、`enhanceFormulaKey`
- `physicalAndSpellInflictionEnhanceFormulaList`：`key`、`formulaType`、`paramA`、`paramB`

## 后续顺序

1. 从已确认版本的数据源导出元素爆发和复合状态最终 Buff，继续使用严格 schema，未知行为直接报错。
2. 导出复合状态所需的 `SkillSetting` 与增强公式，并补目录交叉引用校验。
3. 建立“工厂配方 + SkillSetting + 来源附着增强属性”到 Buff 应用参数的运行时端口。
4. 继续复刻其余四类原生 Action；纯动画行为可以明确标记为后端无效果，但必须由证据确认，不能靠名称忽略。
5. 完成后再在应用层创建正式的单敌人环境，不保留简化回退。
