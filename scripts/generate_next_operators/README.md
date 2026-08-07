# Next 干员数据生成器

该脚本从解包 `SkillData` 和 `SkillPatchTable` 生成 Next 干员 DSL 之前的严格中间层。它不读取现有干员 TS，也不会把
尚未解释的 `DamageAction`、Buff、投射物或 AbilityEntity 静默转换为空行为。

当前阶段已经生成：

- 技能身份与来源文件；
- 费用、扣费帧和冷却；
- `AllowNextSkillAction` 与 `ComboCacheAction` 窗口；
- `timelineBlockFrames = min(exclusiveFrame + 1, AllowNextSkillAction.startFrame)`；
- TimelineAction 起止帧和嵌套行为类型；
- 非空 Blackboard 依赖键；原始模板中启用标记为真但键为空的占位配置不视为依赖；
- `LaunchProjectile.projectileSkillId` 指向的命中 SkillData、DamageUnit 和二级投射物；
- 技能本体中 `DamageAction` 的时间段、动作序号与 DamageUnit；
- 技能逐等级 Blackboard、费用与冷却，以及 DamageUnit 对 Blackboard 等级值的解析结果；
- 阻止技能被误认为完整的未解析战斗行为清单。

当前投射物飞行时间固定假设为0帧。生成结果通过 `assumedTravelFrames: 0` 明确保留该假设，后续
接入 ProjectileData 后可以替换，而不会改变命中 SkillData 的递归展开结构。

默认从相邻复刻库读取缓存，并将结果写入 `src/next/data/operators/generated`：

```powershell
python scripts/generate_next_operators/generate_next_operators.py
```

也可以显式指定目录或只生成一个干员：

```powershell
python scripts/generate_next_operators/generate_next_operators.py `
  --source C:\path\to\SkillData `
  --tables C:\path\to\TableCfg `
  --operator perlica
```

CI 或提交前可检查生成结果是否过期：

```powershell
python scripts/generate_next_operators/generate_next_operators.py --check
```

`operators.json` 只负责将游戏技能 ID 映射到稳定的 Endaxis 技能身份。伤害倍率、命中时机和特殊
机制不得复制现有 TS；后续应由 SkillPatch、BuffData、投射物与 AbilityEntity 适配器补齐。

最终 DSL 由后续语义编译阶段生成。该阶段只能消费已经闭环的中间节点；例如投射物 DamageUnit 的
`blackboardKey` 必须已经解析出 `levelValues`。仍包含未支持战斗行为的技能只进入审计报告，不允许
通过省略行为的方式伪装成完整技能。

清单中带有 `compile` 的技能会额外写入 `<slug>.skills.generated.ts`。当前首个编译器支持普通攻击：
它将逐枚投射物命中编译为调度伤害，并支持同次命中的失衡。`final` 和
`spRecoveryBlackboardKey` 是无法仅凭通用 DamageUnit 唯一确定的业务语义，必须在清单中显式声明；
实际回复数值仍从 SkillPatch 读取。
