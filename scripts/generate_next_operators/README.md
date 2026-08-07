# Next 干员 DSL 生成器

该工具从解包 `SkillData`、`BuffData` 和 `TableCfg` 生成 Endaxis Next 干员定义。它不读取现有干员 TS；无法确认语义的战斗行为会阻止正式 DSL 生成，而不是被静默丢弃。

## 输入

- `skill-data-cdn`：技能时间线、动作顺序、伤害、失衡、资源变化和投射物命中子技能。
- `TableCfg`：技能逐等级补丁、干员基础信息、属性成长、技能组、天赋节点和潜能效果。
- `operators.json`：游戏数据无法自行决定的 Endaxis 身份映射与语义声明。

`operators.json` 不保存可从数据源取得的倍率、冷却、持续时间、属性成长或潜能数值。它只声明稳定 DSL key、原生技能到 Endaxis 技能的映射，以及单敌人模型取舍等无法由原始字段唯一推导的语义。

## 输出

每名干员最多生成三个文件：

- `<slug>.generated.ts`：完整、可审计的技能中间表示。
- `<slug>.audit.json`：便于人工检查的来源、动作和未解析依赖报告。
- `<slug>.operator.generated.ts`：编译后的技能、面板基线、技能组、天赋和潜能组成的完整 `OperatorDefinition`；正式数据不拆成多个文件。

完整定义包含基础信息、六个里程碑等级的面板基线、技能组、天赋和潜能。生成器会反向核对 `CharGrowthTable.skillGroupMap`，并验证天赋、潜能修改的技能 ID、黑板键和数据形状。

## 使用

默认读取相邻研究工具仓库中的缓存：

```powershell
python scripts/generate_next_operators/generate_next_operators.py
```

指定数据目录或只生成一名干员：

```powershell
python scripts/generate_next_operators/generate_next_operators.py `
  --source C:\path\to\skill-data-cdn `
  --tables C:\path\to\TableCfg `
  --operator perlica
```

检查已提交生成物是否过期：

```powershell
python scripts/generate_next_operators/generate_next_operators.py --check
```

运行 Python 规则测试：

```powershell
python -m unittest discover scripts/generate_next_operators -p "test_*.py"
```

## 当前边界

- Endaxis 假定干员与唯一敌人的距离为零且攻击必然命中，不计算投射物轨迹、范围和碰撞；投射物暂按 `0` 帧命中，并在中间层以 `assumedTravelFrames: 0` 明示。若后续发现原生事件队列在零距离下仍会延后一帧，再统一修正该假设。
- 技能释放条件只用于合法性诊断。即使条件、费用或冷却不满足，用户排入时间轴的技能仍会进入模拟并产生结果。
- 当前战斗模型只有一个敌人。佩丽卡连携的多目标递归弹射必须在清单中显式声明忽略，并由生成器校验它确实是同一投射物和命中技能形成的递归分支。
- 没有战斗效果的表现投射物、教程标记和全等级为零的资源动作会保留在审计层，但不生成无效果 DSL 步骤。
- 佩丽卡已经完整生成并作为正式数据入口；新增干员前应优先把所需通用语义编译器补齐，避免在清单中复制手写 TS。
