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
- 没有战斗效果的表现投射物、教程标记和全等级为零的资源动作会保留在审计层，但不生成无效果 DSL 步骤。非零根资源获得会按原生帧和动作顺序进入统一调度；当前只接受已闭环的固定系数 `1`，其他系数必须先补反编译证据。`Atb` 映射为全队共享技力，`UltimateSp` 映射为施法者终结技能量，生成器不得把两者统一写成同一资源所有者。`atbGainMethod`、`atbSourceType`、仅主控限制、百分比、终结技回复标签和忽略回能倍率均保留在中间层；普通/返还与来源倍率会进入 SP 步骤，尚未建模的终结技能量选项会阻止正式编译。
- `IfElseAction` 会作为结构化条件审计保留。当前已完整记录浮点比较、技能类型、实体数量与 Buff 层数条件；其中 `CheckBuffStackNumAdvanced` 的 `Id/Tag + BuffCount + limitSkillCastId=false` 已有反编译闭环，`CheckEntityNum` 仍只保存原始目标集合参数，不会在固定单敌人模型中擅自改写成战斗状态。根时间轴上的双操作数计算、原地黑板修改、Buff 黑板读取和 Buff 结束与条件分支内的同类动作共用编译器，并按其原生帧和 `serverActionIndex` 进入统一调度。
- 条件分支中的 Buff 读取、层数读取、结束、黑板计算和黑板修改只属于对应成功/失败分支。生成器报告存在尚未编译的条件时，`complete` 必须为 `false`，不得把这些子动作提升为无条件步骤。
- 根时间轴解析只展开动作列表容器，遇到具体 Action 后停止；`IfElseAction` 两侧的伤害、投射物和能力实体只归条件树所有，不再被通用递归遍历重复投影。佩丽卡连携的自递归投射物会保留为投射物子技能条件，并仅在清单显式声明单敌人省略且分支形状严格匹配时忽略。
- 条件分支以递归 ordered tree 保存。每个条件节点保留原始路径，成功/失败分支中的直接子动作保留原始下标；嵌套 `IfElseAction` 留在父分支中的实际位置，不会被提升为并列条件。重复动作不会排序或去重。
- 顶层时间轴动作统一保留原生 `serverActionIndex`。递归子技能使用由各层 `serverActionIndex` 组成的 `actionOrder`，例如 `[3, 7]` 表示根动作 3 触发的子技能动作 7。跨载体归并按 `(frame, actionOrder)` 排序；分支子动作的 `actionIndex` 仍表示分支数组下标，两类索引不可互换。
- SkillData 声明的动作黑板默认值会保留在审计层。正式 DSL 只注入已编译条件树实际读写的声明值，随后由 SkillPatch 的逐等级同名值覆盖；相机、输入方向等表现变量不会因为存在于原生黑板就进入战斗运行时。
- 该条件树仍是审计中间层。当前九类战斗叶子均复用全局严格 parser 并携带 typed payload：黑板计算/修改、Buff 黑板读取、Buff 层数读取、Buff 结束、Buff 创建、资源变化、投射物发射和能力实体生成。投射物与能力实体叶子只保存直接资源身份，子技能内容继续由独立 resolver 解析，避免在条件树中复制整棵子图。
- 正式条件编译已支持动作黑板浮点比较、固定单敌人目标上的 `Tag + BuffCount` 查询，以及施法者自身的 `Id + BuffCount` 查询；比较统一使用原生容差。实体集合、距离和主控身份等条件仍会明确拒绝，不能因为审计层保存了参数就视为可执行。
- 递归条件编译骨架能够保持成功/失败分支与嵌套顺序，并生成正式 `branch`/`sequence` DSL；当前接入敌方 Tag Buff 黑板读取/结束、施法者 ID Buff 的检查/结束、`ModifyDynamicBlackboard` 的七种原地运算，以及 `SimpleCalcBBAction` 的双操作数加法、乘法和除法。两类黑板动作使用独立步骤：后者不读取目标键旧值，按单精度计算，除零保留原生 IEEE 结果。任何未接入的叶子都会报告完整分支路径，整棵条件树不产生输出。
- 庄方宜目前已有三棵顶层条件树能够独立完整编译：普攻二、普攻三的飞剑距离黑板更新，以及普通战技结束上一轮飞剑 Buff。`resolvedSchedule` 已按 `(frame, actionOrder)` 归并伤害与条件根，`resolvedDamageSequence` 只会在整棵条件树可编译时输出；普攻三已进入审计阶段 DSL，普攻二仍被距离条件阻塞，普通战技仍被其他未解析根动作阻塞。
- 任一技能只要仍含 `conditionalActions`，所有正式 DSL 编译器都会拒绝输出。即使成功/失败分支当前看起来相同，也不能在条件类型及其副作用尚未完整解析时提前消去。审计阶段可以继续保留完整来源树，但不得生成遗漏条件分支的“部分技能”；庄方宜相关普攻会在动作黑板修改和实体条件闭环后逐项恢复编译。
- 佩丽卡已经完整生成并作为正式数据入口；新增干员前应优先把所需通用语义编译器补齐，避免在清单中复制手写 TS。
