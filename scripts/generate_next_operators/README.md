# Next 干员数据生成器

该脚本从解包 `SkillData` 生成 Next 干员 DSL 之前的严格中间层。它不读取现有干员 TS，也不会把
尚未解释的 `DamageAction`、Buff、投射物或 AbilityEntity 静默转换为空行为。

当前阶段已经生成：

- 技能身份与来源文件；
- 费用、扣费帧和冷却；
- `AllowNextSkillAction` 与 `ComboCacheAction` 窗口；
- `timelineBlockFrames = min(exclusiveFrame + 1, AllowNextSkillAction.startFrame)`；
- TimelineAction 起止帧和嵌套行为类型；
- 非空 Blackboard 依赖键；原始模板中启用标记为真但键为空的占位配置不视为依赖；
- 阻止技能被误认为完整的未解析战斗行为清单。

默认从相邻复刻库读取缓存，并将结果写入 `src/next/data/operators/generated`：

```powershell
python scripts/generate_next_operators/generate_next_operators.py
```

也可以显式指定目录或只生成一个干员：

```powershell
python scripts/generate_next_operators/generate_next_operators.py `
  --source C:\path\to\SkillData `
  --operator perlica
```

CI 或提交前可检查生成结果是否过期：

```powershell
python scripts/generate_next_operators/generate_next_operators.py --check
```

`operators.json` 只负责将游戏技能 ID 映射到稳定的 Endaxis 技能身份。伤害倍率、命中时机和特殊
机制不得复制现有 TS；后续应由 SkillPatch、BuffData、投射物与 AbilityEntity 适配器补齐。
