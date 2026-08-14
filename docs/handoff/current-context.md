# 当前任务快照

> 更新时间：2026-08-10（Asia/Shanghai）  
> 本文只记录变化最快的短期状态。完全不了解背景时，必须从 [交接文档首页](./README.md) 开始阅读。

## 当前目标

在不修改旧版实现的前提下，继续建设 `src/next`，最终以干员、武器、装备、敌人和用户操作序列为输入，输出完整战斗过程、资源曲线、伤害、状态、诊断和日志。新版 UI 尽可能 1:1 保持旧版布局和交互。

固定优先级：精准与完备 > 清晰与可维护 > 性能。不得用无证据的猜测填充游戏规则。

## Git 状态

- 仓库：`C:\Users\sqwat\Projects\zmd\Endaxis`
- 分支：`main`
- 代码基线：`4e886dd6df3d8e1d499ab40682ff29c5b5259f29`
- `docs/handoff` 是当前新增、尚未提交的交接文档库。
- 用户已主动搁置梨诺、新武器、本地化、导出脚本和部分架构文档修改；先检查 shelf/stash，不要重新实现或声称丢失。

## 最新验证

- `npm.cmd run type-check:next`：通过；
- `npm.cmd exec vitest run src/next`：138 个文件、709 项测试通过；
- 生成器：202 项 Python 测试通过；
- 页面：`http://127.0.0.1:5173/next/timeline`。

## 最近完成

- 构筑、静态面板、潜能属性和标准玩家伤害场景贯通；
- 时间轴选择、移动、撤销重做、复制粘贴、平移缩放、技能块连接；
- 全局技力、轨道初始终结技能量和技能费用补丁；
- 26 名干员终结技降费潜能生成；
- 干员资源规则从编译后技能和同一构筑面板统一推导；
- 光标辅助线与编辑落点分离，按真实鼠标位置采样；
- **阶段 A：模拟结果进入 UI**（`ScenarioSimulationService` + `useScenarioSimulation`）：
  - 应用层可缓存、可中止的异步模拟入口，按场景 revision 缓存并冻结运行结果；
  - 页面编辑后自动重编译与重模拟，防竞态，严格失败时显示错误并丢弃旧结果；
  - 技力、各干员终结技能量、敌人生命、失衡曲线从同一份回执投影；
  - 光标辅助线直接采样这些曲线（时间 + SP + 敌人生命 + 各干员终结技能量）；
  - 合法性警告从同一 receipt/diagnostic reducer 归约到具体技能块（红标 + tooltip）；
- **标准环境接入失衡与元素附着**：
  - 连续失衡账本接入 `StandardPlayerDamageEnvironment`：敌人 `CombatVitals` 以帧制失衡规则初始化（满值起始），`CombatVitalsRuntime` 由装配根逐帧推进，`PoiseApplied`/`PoiseRecovered` 进入回执与失衡曲线；节点阈值已保留，节点效果尚未执行；
  - 注入版本化元素附着目录后 `applyElementalInfliction` 按目录状态机执行（附着/爆发/复合状态），未注入时仍被预检拒绝；
  - 预检相应放行 stagger 字段、`dealStagger` 与（有目录时的）`applyElementalInfliction`；
- **元素反应状态接入**（`ElementalReactionContainer` + 执行器）：
  - 敌人身上的反应（感电/腐蚀）按等级 1-4 与剩余时长记录，`applyElementalReaction` 升级/刷新、`consumeElementalReaction` 消费、`elementalReactionActive` 条件按等级判断；只记录状态事实，反应伤害效果待数据闭环；
- **法术爆发（同元素附着二次触发）完整实现**：
  - 4 个同元素爆发 Buff（Fire/Pulse/Cryst/Natural）已从 combat-1.4.4 源数据导入版本化目录：持续 5 秒、1 秒后触发一次，含 `triggerSpellBurst` 动作与爆发伤害参数（倍率来自 SkillSetting"法术爆发伤害倍率"第 1 列），表现动作（动画/特效/声音/镜头/顿帧）经证据确认为 `visualOnly`；
  - `spellBurstRuntime` 按 combat-spec 已复刻语义执行：倍率 × 增强公式（linear/saturating/none）→ 标准玩家伤害公式（防御/抗性/暴击）→ 敌人生命写入，回执 `SpellBurstApplied`；
  - **数据缺口**：SkillSetting 数值（法术爆发伤害倍率）是游戏内 ScriptableObject，AKEDB 与本地均无，需从游戏客户端导出（combat-spec 的 `SkillSettingCatalogExportCommand` 已就绪）；导出后放入 `src/next/data/buffs/skill-setting-catalog.combat-1.4.4.json` 并注入服务即生效；缺失时爆发触发明确报错，不假装打出伤害；
  - 来源附着增强属性（`PhysicalAndSpellInflictionEnhance`）尚未在面板落地，以 0 作中性基线；
- **敌人效果渲染（附着段 + 爆发/反应标记）**：
  - 敌人 Buff 结束（到期/消费/驱散）由容器回调记录 `BuffFinished` 回执（buffId、reason、层数）；
  - `projectEnemyEffectViz` 把附着施加/结束整理成元素段（起止帧、层数），把爆发/反应整理成标记点；
  - 底部"敌"面板新增敌人效果区：生命读数 + 元素色附着段 + 爆发/反应圆点标记，坐标与资源曲线同一体系并跟随时间轴滚动；
  - 已知严格缺口：异元素附着组合仍会因复合状态 Buff 定义缺失而失败（与爆发同类的数据问题，等复合状态目录导入）。
  - 佩丽卡战技、终结技、连携技现已全部可完整模拟；庄方宜等带 `applyStatus`/语义状态条件的干员仍严格失败；
- **时间轴命中点（对齐旧版样式与交互）**：
  - 命中点画在技能块底部，红色菱形、hover 金色放大发光，与旧版一致；
  - 条件分支的命中点只在真的触发过（有对应日志）时显示，与旧版一致；
  - 点击命中点打开伤害详情弹窗，展示该命中的伤害/暴击/倍率/剩余生命/附着/反应日志；
  - `DamageApplied` 回执携带可选步骤键，命中点 tooltip 显示伤害/暴击/元素/附着/反应；
  - 连线工具可拖到命中点端点，创建 `damageHit` 连接并随项目校验；
- **资源曲线与时间轴对齐**：
  - 底部曲线改用与时间轴相同的坐标（准备区偏移 + 每帧像素），并跟随时间轴横向滚动，和上方标尺/技能块一一对齐；每 5 秒一条纵向网格线；
  - 干员终结技能量（充能）移出底部曲线，改为画在各干员轨道上（元素色、底部向上、满能量高亮线，抄旧版 GaugeOverlay）；
  - 底部曲线只保留全队 SP、敌人生命、失衡三行；每帧自动回复的 SP 不再单独标点（回执带 `source: 'autoRecovery'` 标记，折线保留、圆点跳过）；
- **术语**：代码注释与文档中"项目文档"统一改为"存档"，避免与 markdown 文档混淆；类型标识符（`ScenarioDocument` 等）暂未改名。

## 当前最值得做

1. 补齐敌人生命/失衡之外尚未投影的诊断面板与战斗日志展示；
2. 命中点选择/编辑（依赖 per-cast 编译接通，属阶段 B 编辑闭环）；
3. 继续补齐干员、武器、装备和敌人编辑闭环；
4. 阶段 C：语义状态（`applyStatus`）、处决、生命汲取等剩余机制接入正式环境。

## 最新数据结论

AKEDB CDN `1.4.4@9163343-11`：

- 梨诺有 CharacterTable、12 个 SkillPatch、天赋潜能文本和 72 项 BuffData，但没有根 SkillData；
- 曜夜 `wpn_lance_0014` 有基础表、SkillPatch 和 2 项 BuffData，但没有根 SkillData；
- 可以确认基础面板、描述和逐级参数，不能仅据此闭环技能动作帧和完整执行序列。

## 恢复工作前

1. 阅读 [项目与工具总览](./02-projects-and-tools.md) 和 [当前状态与路线图](./06-current-state-and-roadmap.md)；
2. 运行 `git status --short`、`git log -10 --oneline`；
3. 阅读与任务对应的 `docs/next`、`docs/research` 或 Combat Spec 文档；
4. 不修改旧版文件，不回退用户内容；
5. 新证据同步更新研究文档、C# Spec 和 Next 行为映射。
