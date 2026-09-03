# Endaxis 游戏数据编译器

这里是新版游戏数据转换器的唯一实现入口。它用 TypeScript 取代现有 Python
生成器，把反编译及游戏导出数据转换成 Endaxis Next 可加载、可编辑、可审计的正式定义。

这不是对旧生成器的逐行翻译。新版实现以原生数据结构为公共基础，只把干员、武器和
装备的特有入口从公共编译流程中剥离。旧 Python 生成器已在全干员迁移完成后退役，
不能继续承载新功能。

## 统一入口（2026-08-30）

### 空目录重建入口第一阶段（2026-09-03）

当前开发主线为**优先适配新版与接入新增内容，最终全部游戏派生资源可从空目录一次重建**。
仍以 AKEDB 为主、VFS 补缺；不等待 VFS 完整替代 AKEDB，也不借此恢复已回退的错误生成物。

`rebuild:game-data` 已接入来源下载、逐文件/整批哈希复验、身份覆盖检查、单件装备候选生成及
重跑 `--check`。每次只创建 `tmp/game-data-rebuild/run-*`，候选保留正式相对路径；不会覆盖正式
定义、图片、旧版代码或项目数据。失败会留报告和下载器自己的 `.partial-*` 供排查。

```powershell
# 第一条已实际验证：从网络下载当前表，在没有任何候选产物的目录生成全部单件装备。
npm run rebuild:game-data -- --tables-only
# 离线重试也必须有下载器的 hybrid provenance，逐项校验，不搜索旧缓存。
npm run rebuild:game-data -- --source-root tmp/rebuild-tables-20260903 --tables-only
# 完整目标当前仍未闭合：继续采用 hybrid 全量下载，但报告明确未完成，退出码为 2。
npm run rebuild:game-data
```

- `--tables-only` 仅表示表和单件装备切片通过；始终输出 `fullRebuild=false`、`published=false`。
  完整入口在其他阶段闭合前返回 2；传输/校验/生成错误返回 1。不提供 `--publish` 或正式输出开关。
- 来源复验拒绝 VFS-only、错版本、路径穿越、重复/漏记/额外文件、链接、字节/大小/哈希变化与清单
  数量不符。生成后再次复验整批身份。VFS 补件仍明确 `vfsVersionVerified=false`，哈希不证明同版本。
- 身份检查比较角色/套装表与现有转换配置。未配置角色不自动注册；管理员表现变体、非玩家记录和
  真正新内容仍须分类。套装固定名单未覆盖的新项不会再在这份报告里静默消失。
- 套装生成器改为遍历 `EquipSuitTable` 的全部身份，逐项走原有公共静态/运行编译器并收集错误；
  任一身份未闭合时整批不写盘。`gearSetIdentities.json` 只保留已发布基线身份，不再截断生成范围。
- 正式装备目录仅在候选生成之后用作可选差异比较；该目录不存在时也能生成。比较只忽略 CRLF/LF，
  不忽略游戏数值或行为字段。报告保留木桩省略诊断，而不是删除后宣称原生完整。
- `report.json.remaining` 明确记录后续阻塞：全部领域的同批依赖、全局/模板证据、本地化旧文件、
  图标扫描、旧展示适配和敌人预设、全量模拟与发布。它不是可执行删除清单；混合目录不能整体清空。

单件装备兼容性可对隔离报告运行：

```powershell
$env:ENDAXIS_GAME_DATA_REBUILD_REPORT = 'D:\Projects\Endaxis\tmp\game-data-rebuild\run-实际目录\report.json'
npx vitest run tools/game-data-compiler/test/rebuiltGearCandidate.test.ts --maxWorkers=2
Remove-Item Env:ENDAXIS_GAME_DATA_REBUILD_REPORT
```

该门禁重新核对来源和生成文件，逐件验证契约、四种属性的全部主副属性组合以及最低/最高精锻的
单件上轴伤害模拟。干员与公共规则仍来自可信正式基线，**不是新版套装闭合或全资源空目录模拟证明**。
不指定环境变量时仅运行一份小型真实装备夹具回归，不依赖本机 `tmp/` 下载。2026-09-03 当前 AKEDB
`1.5.3@9885010-4` 的 258 件候选通过 **774 项**；旧 243 件定义文本完全不变，新增 15 件，索引更新，
没有删除条目。套装新身份 `suit_spellburst` 尚未进入正式名单，不能将这 15 件连同未闭合套装直接发布。

本机完整命令也已完成来源下载与装备切片：报告在 `tmp/game-data-rebuild/run-dYAF19/report.json`，
快照 `3c85bb1596f73d384403bdfe35f576b1ffb00beafcb13fe502fdc8154fd3331c`，共 6,230 项，
其中 AKEDB 5,511 项、VFS 补件 719 项。它覆盖当前来源清单，不代表所有全局配置、图片/HUD 和
本地化派生流程已覆盖。重试可传入该次的 `sources` 目录，不需重新下载，仍会完整复验。

用该批 SkillData/BuffData 加**基线标签目录**进行定位性套装试编译，发现新套装
`buff_equipsuit_spellburst_01.abilityEventAction[0].actions[0].actionData[3]` 的
`AddGlobalCDTimer`（Owner，0.1 秒）曾阻塞。该 Buff 来自 AKEDB，不是 VFS 数字枚举误读；
公共投影在未固定 BuffOwner 时只接受 caster，不能直接把 Owner 强写为 caster 绕过。
原生全局冷却语义已有 `combat-spec/docs/global-timed-marker.md` 证据，应先核对目标绑定及
全局标记与普通 TimedMarker 的现有简化，再补统一检查/写入和运行回归。此次诊断未发布任何套装，
也不能用基线标签冒充同批完整重建。

同日后续已补齐公共全局冷却协议及独立运行目录，并先修复复刻库、再修复 Endaxis 的爆发前元素
条件漏接。24 个套装候选现在全部可生成；28 项实机兼容性测试通过，含新套装寒冷/自然触发、
电磁不触发、同帧冷却、三个独立 20 秒实例及首个爆发伤害差分。正式目录未发布，完整重建入口
仍等待同批标签等输入。证据与复跑命令见[新套装研究记录](../../docs/research/spellburst-gear-set-2026-09-03.md)。

### 完整标签与套装自动重建（2026-09-03 后续）

```powershell
npm run rebuild:game-data -- --source-root tmp/game-data-rebuild/run-dYAF19/sources --unity-worker D:/Projects/vfs-index-browser/unity-worker/src/Vfs.UnityWorker/bin/Release/net9.0-windows/Vfs.UnityWorker.exe
```

显式 worker 路径支持 exe/dll。`exportGameplayTagConfigSet.ts` 只编排 VFS 通用导出能力，按
当前逻辑目录发现成员并严格连接 PPtr/CAB，不复制旧成员名单或产物。AKEDB 无配置才补 VFS；
所有输入/请求/审计均在本次 tmp 下。当前恢复 6956 条路径及 179/67/37 全局预定义，生成全部
24 套套装；完整命令仍因武器 `OnBuffEnhanceChanged` 未接入而失败，不发布部分武器。
无 worker 时明确阻塞，不隐式使用正式标签。前文保留的是阶段历史。
来源、重复路径处理和证据边界见[新版标签重建](../../docs/research/gameplay-tag-refresh-2026-09-03.md)。

### 新旧干员刷新门禁（2026-09-03）

完整标签阶段成功后，统一命令还会运行 `operator-refresh`：尝试当前全部 CharacterData 前缀、
黑板与连携条件（不只遍历已配置干员），并以原有公共技能库编译器检查全部配置干员的 SkillData /
CharGrowthTable。明细保存于本次 `audit/operator-refresh.json`，不读取旧生成定义。
模板 pin 变化与解析失败分别报告，不因 pin 变化跳过新内容，也不自动更新正式 pin。
需要审阅的变化、缺件、失败及未配置身份另记为 `operator-refresh-review: blocked`；
`compiled-prefix` 不表示完整技能闭包、完整模板或模拟通过。

当前已复验快照的 32 份模板前缀可全部编译，30 个已配置 pin 均不同；未配置的两份为男管理员表现
与 Typhoeus，不应注册成两名新干员。30 名技能库中 29 名通过，庄方宜的 `ultimate_skill_end` 已
不在当前等级组内，但仍在角色主动技能登记中，须核查内部结束技能路由，不能直接删除或改成强化终结技。
新干员的 Pending 检查及 `trigger` 与主控角色身份比较均走公共条件解析与模拟，不做干员特例。
研究、复验结果与当前网络阻塞见[干员刷新检查点](../../docs/research/operator-template-refresh-2026-09-03.md)。

### 各领域独立入口

根 `scripts/` 已清空。当前游戏数据工具统一位于本目录：

- `scripts/generateWeaponDefinitions.ts`、`generateGearDefinitions.ts`、
  `generateGearSetDefinitions.ts`：武器、单件装备和套装正式生成及 `--check`；
- `scripts/auditGearSetSourceClosure.ts`、`auditGearSetStaticDefinitions.ts`：套装来源闭包与静态候选审计；
- `scripts/exportReferencedGameIcons.ts`：扫描正式运行引用，只补缺漏地导出 WebP；`--overwrite` 覆盖，
  `--dry-run` 只审计，`--prune` 删除引用闭包外的受管游戏资源；
  `--output-root` 指定独立图片目录（默认 `public`），覆盖与清理都只作用于该目录，引用仍扫描当前
  源码。全量重导建议 `--overwrite --output-root tmp/game-icons-reexport`，零失败后再发布；项目占位图
  从正式目录复制，明确标记为 `kept-local`，不是游戏导出。审计记录原图及 WebP 的 SHA-256，位于
  `tmp/referenced-game-icons/audit.json`；连续不同批次验证须分别保存该审计。
- `scripts/exportGameLocales.py`：尚未 TS 化的 AKEDB 本地化导出，当前与融合来源策略一致；图标入口的
  `--skip-rich-text-refresh` 只调用其本地图标 manifest 生成，不触发远端刷新。完整本地化导出仍需迁移；
- `scripts/generateOperatorPassiveUiPrefabCatalog.ts`：从 VFS 对象快照识别角色专属 HUD prefab 的
  `UICharPassive*` 组件，并生成模拟所需的窄语义目录；
- `config/gearSetIdentities.json`：已闭合并进入正式库的套装身份；
- `legacy/enemy-ranks`：仍有证据价值、但尚未改写为 TS 的敌人 rank 原始提取器。

根 `package.json` 暴露 `generate:game-data:*`、`audit:game-data:*`、`export:game-icons` 和
`export:game-locales`。机器审计和中间 manifest 只写入已忽略的 `tmp/`。

来源格式适配必须共用：Skill 工厂、TargetSettings、BuffFindSettings、黑板赋值和方向设置，
均由精确原生类型所属的公共读取器负责，不在干员、武器、装备或 Unity RID 适配中复制近似结构。
**枚举数字 → 原生名称属于 VFS 导出职责**，必须从同版本 metadata 批量提取；转换器最终只读名称，
不得继续新增手填数值映射。本轮前序为 VFS 数字 JSON 增加的 source/*Enums.ts 兼容尚未清退，
这是待迁移缺口，不是允许继续扩大的架构。保留各公共结构读取器，后续删除的是数字编码兼容。
VFS 的新批量枚举导出尚未完成实机验证，不能将它标成已可替代 AKEDB。
来源新增字段先按下文“影响筛查优先”判断是否涉及模拟结果，再按需核对原生消费者；
Selector.processTargetType 有真实消费者，
目前分别取证并开放 PriorityFilter、ExcludeTarget、ShuffleTarget 的普通 Targets 分支；
受击目标通道仍不放行。
证据见 combat-spec 的 docs/selector-pipeline.md，不能静默忽略。

### 角色专属 HUD prefab 转换边界

输入目录的每个一级子目录表示一个 prefab，至少要含 VFS `ObjectSnapshot` 导出的
`GameObject/` 和 `MonoBehaviour/`。当前只接受原生专用组件
`UICharPassiveMultiStates`、`UICharPassiveCounter`、`UICharPassiveZhuangfy`、
`UICharPassiveLizhiyan`、`UICharPassiveLiino`；缺失、重复或未知组件都会阻断，不按 prefab
名字猜规则。生成命令示例：

```powershell
npm run generate:game-data:operator-passive-ui -- --snapshot-root tmp/passive-ui-prefabs
npm run generate:game-data:operator-passive-ui -- --snapshot-root tmp/passive-ui-prefabs --check
```

自动进入数据契约的只有计数上限、状态阈值和可读 Buff ID。这些字段直接决定时间轴状态段和
模拟快照，适合稳定转换。`RectTransform`、`UIImage` 的静态布局可以由每种受支持组件的窄
展示适配器提取或核对，但不属于模拟契约；通用 Animation、材质动画、粒子、闪烁和音效不转换，
也不为此实现 Unity UI 运行时。当前网页展示使用原生纹理和逐组件核实的静态状态，省略动画不会
改变状态是否存在、层数或进度。要扩展新 prefab，必须先确认其专用组件语义，再新增显式适配器和
回归样例，不能把未知通用层级静默拍平成图片列表。

## 当前纵向迁移（2026-08-28）

本轮最新：标签已单向迁为可读路径，五名完整干员可以严格重建；没有增加完整干员数量。
同版本 GameplayTagConfigSet 的 26 份配置已恢复为 6806 条唯一非空路径；全局预定义表
175 标签 / 61 查询 / 36 条免疫规则现已全部严格生成。详见[完整配置集证据与复现](../../docs/research/gameplay-tag-config-set.md)。
普通根 KnockDown 已有公共投影和标准入口消费者门禁；最新矩阵为 **172/309 / 5 名完整 / 余烬 8/9**。
余烬战技主体、庇护四件 Buff 闭包及连续两次施放切片已通过；连携仍为潜能最低血量目标组。
庇护复用公共 KeywordAction 管线，保留 Buff 分类标签/优先级/子对象，不因干员不受伤删除身份。
原生无 subtype 来源与 Owner 身份边界见 combat-spec `docs/keyword-actions.md`。
尚未发布完整定义；战技探针显式注入天赋开关，不等于原始天赋/潜能装配已验收。

连携目标选择的原生链现已在 combat-spec 闭合：保存主控组 → 排除该快照 → 生命比例优先级筛选。
来源层用 `CharacterTeamSelectionSource` 保留实际排除引用，不从 `Main` 组名或 Owner 名称猜身份。
Next 查询快照操作与 Context 治疗接线仍待实现，不复用治疗时重选人的快捷枚举。
数据流、并列选择边界与接入顺序见[队友目标快照](../../docs/research/character-team-target-snapshots.md)。

### 无效分支必须自下而上删除

#### 待办：按组件实际承载的行为决定是否生成（2026-09-03）

状态：用户要求先记录为后续优化，不立即实现。下述为设计方向，不代表审计器或类型级裁剪已落地。

组件是行为的容器，不因原生存在某个组件类型就要求 Endaxis 定义与运行时一对一实现。
判据是当前模拟场景下的实际行为及其依赖，不是原始字段数量、回调是否非空，或原生理论上
能否承载战斗行为。组件自身的固定行为和配置的子行为必须一起检查。

1. **实例级**：从叶子向根、从有效读者向前追踪依赖。有战斗行为则保留组件承载该行为所需的
   最小语义；其中无关行为仍可裁剪。全部行为均不可观察时，组件实例整体不生成。
2. **可配置行为**：能装任意动作/回调的组件，递归分析当前数据实际装入的行为。不能因为
   理论上能装伤害就强制实现，也不能因为目前叫特效或移动就无条件删除；只装无效行为的
   非空回调也应消去。有效返回值、跨组件共享状态、时间和外部读者属于行为依赖。
3. **类型/分支级**：若当前完整输入集中，该组件类型或精确配置分支的所有实例均没有战斗行为，
   则该类型/分支不需要进入 Endaxis 正式定义、公共游戏数据契约、编辑器或运行时。
   转换器只需保留必要的行为槽位识别、审计与消去能力，不为无效组件先造完整正式结构再丢弃。

类型级省略是**当前数据集的结论**，不是原生类型永久无效。审计记录输入快照/范围、原生类型、
分支条件、实例数量和残留有效行为；新数据每次重新审计。新增有效行为只使对应类型/分支的
省略结论失效，进入正常转换或明确报告缺失支持，不能套用历史结论静默丢弃。
局部样本通过不能冒充全库结论；未知行为不能记为“无影响”。

combat-spec 保留原生结构和执行证据，不受 Endaxis 类型级裁剪反向约束。将来启动此待办时，先做
全输入行为审计并批量排除无效类型/分支，再实现有战斗行为的剩余部分，不继续逐组件补齐原生系统。

#### 场景简化优先于原生完整复刻（2026-09-03）

combat-spec 研究和记录原生规则；Endaxis 只保留会影响固定木桩模拟结果的部分。
两者的完成门槛不同：只要已证明某项差异在当前场景不可观察，Endaxis 不应等待其原生
导航、碰撞、洗牌等内部算法完整复刻。证据仍统一记录在 combat-spec，不在转换器猜规则。

- **影响筛查优先，深挖按需**：遇到新组件或字段，先看现有结构、实际配置的末端行为、
  已有证据与有效消费者，判断是否可能改变当前模拟结果。已有依据足以确认无影响就停止
  追踪内部算法，接入既有省略路径；可能影响伤害、状态、资源、时间、目标身份/数量或
  后续有效行为时，才围绕具体疑点追加原生取证。尚不确定不等于无影响，但只补足决定
  保留或省略所需的证据，不以完整还原组件为目标。这是当前工作顺序，不启动上方待办审计器。
- 纯位移、传送落点、朝向、距离和命中范围：按零空间、所有攻击命中唯一敌人的前提消去，
  不生成对应运行时操作，也不要求可见程序不再读取的空间参数拥有完整执行模型。
- 目标筛选：若输入已证明就是唯一敌人，且筛选仅涉及上述空间命中或不改变单项集合的
  排序/随机选择，则折叠为既有敌人身份。不要把“全体敌人里选一名”引入战斗随机性。
- 不按动作名称一刀切：队友、主控、能力实体等集合可能不止一个对象；排除唯一敌人可能
  得到空集；状态/标签资格、数量裁剪、重复作用次数也可能改变实际结果。这些差异不能
  因为动作叫“目标筛选”就删除。身份、基数与后续消费者才是判据。
- 保留可观察的时间与控制流：空间动作消去不等于删掉其调度时间、移动结束触发的有效行为、
  返回值、失败回调或会被伤害/Buff/资源读取的黑板写入。先投影末端，再判断这些消费者是否仍存在。
- 来源结构与行为支持分开审计：未知字段先做影响筛查，必要时查所属类型和原生消费者，确认纯空间用途后归入
  已有省略策略；不为无效参数增加契约字段或运行时开关，也不全局放宽未知字段白名单。
  活性已消失的子程序不应继续以其中未支持的条件/算法阻塞正式生成。

接下来的移动/传送迁移以建立这一有界消去路径为先，而非在 Endaxis 中补齐原生空间系统。

新版移动字段已接入来源校验：CustomRootMotion 的 `manualTick`，MoveTo 的 `manualTick`、
`updateLatestMainCharacter`、`dontClampFaceToMoveDirToXZ`。旧结构可缺省，显式值必须是布尔；
它们不进入正式契约，也不改变既有调度或返回值边界。原生直接消费者分别记录在 combat-spec
`docs/custom-root-motion-action.md`、`docs/move-to-action.md`，不继续展开导航内部算法。
EffectAction 的 `bigEffectTarget` 复用公共 TargetSettings 读取器；非空特效句柄写回明确阻断，
直到其有效消费者得到处理。原生表现边界统一见 combat-spec `docs/presentation-actions.md`。

SetStrafeModeAction 的可选 `yawOffset` 必须为有限数值；它直传移动组件的锁镜头朝向偏移，
沿用 strafeMode 省略，不写入契约。RayCastEffectAction 则不是纯表现：命中组可被伤害读取；
在既有 PointToPoint/FixedPoint/Anti 边界上，只新增允许明确 caster 持有的自动阵营过滤，
不扩大到实体宿主的未知阵营、显式阵营或不可选中目标。原生过滤与目标写回依据统一见
combat-spec `docs/ray-cast-effect-action.md`，不将射线整体删除。

同样的字段级兼容边界适用于 VoiceTrigger 的播放偏移/淡入与 TemporaryUnlock 的手动锁定开关；
语音句柄写回非空仍需消费者投影，不能当纯音频省略。DamageUnit 新版 `damageTags` 仅空列表
与旧结构等价，非空标签有伤害免疫等原生消费者，不能丢弃。ObtainCost 的新增技力标签开关
`useAtbGainTag` 与 `atbGainTag` 必须成对，当前只支持关闭分支；不与终结技恢复标签混用。
这些有界兼容不代表已支持标签生效分支，也不因此在契约或运行时引入原生数字 ID。

Buff `showDirectlyInHeadBuff` 是显示资格增量，目前只接受关闭分支，不映射成已有显示槽。
`stackEffects[].effectActions[]` 的精确类型已由专用槽确定：使用公共 EffectAction 读取器的
`typedSlot` 编码，不含 `$type`；普通动作使用 `polymorphic` 编码。禁止各维护一份字段表，
也不能用可选 `$type` 全局放宽普通动作校验。输入位移新增根运动混合参数同样只在来源读取，
不改变动作区间和技能时间轴。

InstantModifyAttribute 新导出的私有 loader/mask 仅接受成对空初态；来源 IR 不保存缓存，
实际 modifier、属性侧与黑板引用仍完整进入公共属性读取器。非空缓存不静默忽略，亦不把规则
扩展给名称相近的 Poise/Heal 处理器。PullAction 新增 alwaysNext 是返回控制，来源保留布尔，
旧输入缺省为 false。对既有已证明唯一敌人的路径，true 同样可省略位移并保留后继动作；
未知/队伍目标和条件槽返回值消费者不放宽，不把它当无条件恒真的条件叶。原生依据分别为 combat-spec 的
`docs/damage-processors.md`、`docs/pull-action.md`。

新版角色运行模板接入需区分两种哈希：下载清单 SHA-256 校验导出 JSON 字节；
`runtimeTemplate.sourceSha256` 固定的是 JSON 内声明的源资产身份，不是 JSON 自身的哈希。
切换输入批次时，先核对下载来源、字节哈希、原生类型、sourceCharacterId、连携技能身份，
再在隔离候选 manifest 中更新源资产固定值，跑模板审计与整名预检；不可删除正式哈希门禁。
这一步不是派生目录重建，模板前缀通过也不意味着同批实体/弹道等目录或完整模拟已经通过。

AbilityEntityData 新前缀的 name 是可重复模板标签，不是稳定资产 ID 或显示名称；公共模板
读取器只校验其字符串类型，不改变 gameId、寿命、标签与叠层。不要以“目录太旧”为由掩盖
原始单文件格式不兼容，也不要在各领域入口重复剥离 name。聚合同批模板时先核对下载清单
中的逐文件哈希，再复用公共目录编译器；仅聚合模板前缀不等于组件或其他派生目录完成。

Aura 新增 filterFactionSource 与角度/高度限制共用一份字段校验，目前仅接受 plain Source
及两个限制关闭的分支。阵营来源与 buffSource 是两个不同原生字段，不得合并。关闭限制时
原生不执行几何计算，其参数不进入有效黑板依赖；Buff 安装、进入/退出行为与来源身份不省略。
原生证据位于 combat-spec 的 `docs/aura-influence-lifecycle.md`。

MergeTargetAction 的 mergeHittableTargets 仅开放关闭分支，不改变普通目标有序去重；
RandomPointFinder 的 extent2D 只兼容 Circle/Sector 的零常量尺寸，不删除 pointNum 或其
黑板依赖。CastSkill 新中断选项进入延迟请求，当前仅开放 false，不能以敌人无主动行为
为由忽略干员自己的施法控制。三者都由现有公共读取器处理，无领域特判或新运行时字段。
证据分别见 combat-spec 的 merge-target-action、random-point-finder、cast-skill-action。

当前传送失败回调已接入公共树：`controlFlow.ts` 用 `actionWithCallback` 保存持有动作、
`targetPointInvalid` 触发语义及原样解析的 SequenceAction 子树；未知触发不自动扩展。
动作叶子解析器只负责持有动作，带回调的完整输入必须走公共序列入口，不能绕回叶子直接解析。
`actionSequenceProgram.ts` 提供回调投影钩子，领域投影先递归编译子树，结果为空才消去持有动作；
不使用“原始 actionData 非空即失败”的规则，不把回调当成同步后继，也不向外传播其局部状态。
根守卫同样在末端投影后处理，`resultIsConsumed` 为真时不能因无副作用而抹掉返回值。
原生证据唯一入口为 combat-spec `docs/teleport-position-selection.md`。

这不是完整的全程序反向活性分析：回调树和纯守卫已自底向上处理，空间 Context 逃逸仍采用
保守来源检查，尚未区分所有覆盖写、死分支和跨调度活跃区间。后续完善此检查时应以剩余有效
读者为根做反向依赖分析，不能将目前保守阻塞解释为必须给 Next 建模空间或原生随机系统。

先转换末端实际行为，再向根回收分支；两支为空且条件无副作用，就不要求该条件先有运行模型，
并直接从产物删除整个分支，不输出空 `conditional`。已经建模的纯条件同样适用。
条件写黑板、推进随机流或其真假仍被外层消费时不能删除；`resultIsConsumed` 统一约束后者。
这不等于反向执行动作：黑板/目标组写入顺序仍沿原生顺序，分支局部状态不向外泄漏。

Next 的前提是所有攻击命中木桩，不是“角度只影响原生表现”。角度可以影响原生扇形范围；
只有其末端已按固定命中/零空间边界省略时，相关条件才可回收。余下程序若仍读取该角度来改变
倍率、Buff 或有效守卫，则明确阻断。角度/曲线引用检查覆盖整份 SkillData，不局限单个调度。
Assign 的目的键不算读取，但赋值保留；本轮没有启动通用黑板活性删除或跨作用域常量传播。

### 控制行为按实际读者裁剪（2026-08-28）

敌人没有主动行为，不建模防反所需的攻击、红圈、移动或倒地／起身动画；但普通 KnockDown
有伤害、破防、Buff 和干员天赋事件，不能整个省略。撤销“完整起身配置是根动作前置”的路线。
先核对保留闭包对倒地／起身标签（含父级）的读者及目标归属，仅恢复可观察数值和状态。
当前五份完整定义没有敌方起身标签消费者；其他干员、装备和自定义闭包仍需独立审计。
新增 `audit:game-data:tag-references` 是来源候选盘点，不替代可达性证明，不据零命中自动放行。
命令、逐项证据与下一步见[控制状态边界](../../docs/research/control-state-observability.md)。
根 KnockDown 使用独立公共叶子投影；不能用旧 outputKnockDown 标记或无条件 AddBuff 假装完成。

本体已有唯一契约 `applyKnockDown` 与普通根执行切片，验证首次破防、Buff/控制两层免疫、
延迟时长求值、专属/通用事件、返回值和重复倒地。正式入口已经扫描全场静态编译程序：
根控制存在时，非 caster 的 Getup 及祖先标签查询阻断；BuffOwner 归属不明也阻断。
这是保守检查，包括未摆放技能，不是精确可达性/目标传播。没有相关读者才执行显式到期退出。
实体 delta、来源属性和公共专属事件已完成标准环境装配回归；额外异常 `isExtra=true` 尚需
通用 BuffAddContext 支持。仍需余烬真实伤害及整名验收，不将切片回归计为完整干员数。

下一步目标选择必须保留“查询时选人并保存上下文 → 后续动作消费”的时机；现有 HealTarget
最低血量枚举并不能直接替代 FindTargetAction。空候选、主控排除及并列顺序须按 combat-spec
证据处理，不得用敌人无主动行为推导治疗无事件。

当前余烬实际来源闭包（manifest + 养成表）为 10 SkillData / 15 BuffData，缺失及动态引用均为 0。
此前候选 `buff_chr_0009_azrila_talent_0_1` 不在其中，**不得作为余烬当前天赋或缺资源阻塞**。
引用图从根逐层解析，不能把整个 Buff 缓存的未挂接资源当成某个干员的依赖。
`AttributeMetaTable` 已纳入自有下载清单，倒地时长加成默认/范围从该表核实。

### GameplayTag 单向边界（2026-08-28）

- 唯一公开类型是 `GameplayTag = string`，内容为可读完整路径。它不是数字品牌、包装对象或需要工厂转换的值。
- `source/nativeGameplayTags.ts` 独占原生 Int32/CRC 和 ID→路径解析；公共编译出口解析一次。未知 ID 或缺少目录必须阻断，不能输出数字串、占位符或静默丢掉条件。
- 契约、产物、项目、事件和运行时全程使用同一字符串；运行编译直接传递标签/数组，不再逐次 map、CRC、反查或包装。仅在导入/自定义编辑等数据边界校验路径。
- `tags / buffTags / applyTags / extendTags / allowedRecoveryTags / ultimateRecoveryTag` 取代数字 ID 字段。旧数字定义不再是合法输入，不在运行时加兼容哈希转换。
- 非 exact 查询由“相同路径或以祖先路径加斜杠为前缀”执行，四种空查询语义不变。伤害标签/伤害特征仍是另一套语义，不混并。
- 时间膨胀槽位使用路径，优先级使用已解析的比较数值；原生空槽位 0 明确表示为 `unassigned`，保留同槽互斥语义，它不是未知 ID 的兜底。
- 能力实体来源 JSON 的数字出生标签只供转换器读取；`generate:game-data:ability-entity-templates` 输出 60 份只含可读标签的模板。此字段仍是证据元数据，不表示新增运行时出生标签安装行为。

### 全局标签预定义配置的下载与生成

`game-data-sources.json.jsonFiles` 维护 Endaxis 需要的精确全局 JSON，不依赖 combat-spec 选择资源。
`--json-file` 只能选择清单内资源，不刷新其他表/集合；
单文件来源保存为相邻 `.provenance.json`，不覆盖整批下载账本。全量下载包含这些配置，
`--tables-only` 不包含；两种选择开关不能同时使用。

```powershell
npm run download:game-data:sources -- --json-file GameplayConfig/GameplayTagPredefineTable.json --vfs-base http://desktop:8765/api/endaxis-data
npm run generate:game-data:tag-predefine -- tmp/game-data-sources/GameplayConfig/GameplayTagPredefineTable.json src/next/data/combat/gameplayTagPredefine.generated.ts combat-1.4.4 src/next/data/combat/gameplayTagCatalog.generated.ts
npm run generate:game-data:tag-predefine -- tmp/game-data-sources/GameplayConfig/GameplayTagPredefineTable.json src/next/data/combat/gameplayTagPredefine.generated.ts combat-1.4.4 src/next/data/combat/gameplayTagCatalog.generated.ts --check
```

完整目录不再只读单份 652 条配置，而是严格连接 ConfigSet 的全部 26 个引用：

```powershell
npm run generate:game-data:gameplay-tags -- tools/game-data-compiler/gameplay-tag-config-set-1.4.4.sources.json src/next/data/combat/gameplayTagCatalog.generated.ts --source-set --source-root tmp/game-data-sources/GameplayTagConfigSet --check
```

原始 6842 条记录中有 1 条原生无效空串、35 条跨配置重复路径，明确统计后生成 6806 条。
所有预定义引用均已解析，包括 `Category/Interactive`。清单、子文件哈希和 CAB/Int64 对象身份
在输出前验证；漏件、半截导出或未知 ID 仍严格失败。下载器尚未自动编排这 27 个 Unity 对象
及 CABMap，本次使用既有 VFS 通用能力的离线精确导出，不宣称新增了 HTTP 配置集接口。

本轮 CDN 返回 404。fallback 目录的相对路径必须为 `GameplayConfig/GameplayTagPredefineTable.json`。
实际文件来自台式机 VFS 既有 `tools/extract_indexed_file.py` 的精确记录 694613，逻辑路径
`JsonData/Data/Json/GameplayConfig/GameplayTagPredefineTable.json`；40,260 字节，SHA-256
`c87176401ac351c74cd75b92bb9a2f48c70ba5f4062bb004f5f07d848328e3d5`。
记录 ID 属于本次索引，不是跨版本稳定身份；换数据源先核对逻辑路径与哈希。
当前 VFS HTTP 兼容路由未开放 GameplayConfig，本轮使用离线同构导出；不要写成 HTTP 已可用。

`source/gameplayTagPredefineTable.ts` 保留原生三个字典；缓存查询的数字枚举和动作 JSON 的名称
分开严格读取，标签都检查 Int32。`compiler/gameplayTagPredefine.ts` 通过同版本来源目录解析为路径，
保留空查询并拒绝哈希冲突、未知路径，不按名称补免疫。公共契约 `gameplayTags.ts` 不持有索引/运行状态，
本体 `GameplayTagPredefine` 复用原有实体标签计数及非精确层级查询，不另造标签容器。
物理状态 Buff 准入与组件 KnockDown 标签准入独立；实际安装还须重查免疫。起身配置、实体时钟、
根事件/返回值和整技能运行仍须继续落实，未因标签可生成就放开根动作。

### 前序击倒链检查点

最新检查点：公共 KnockDown 来源与隐式 Buff 引用已接入，但根操作尚未正式编译。
combat-spec `docs/knockdown-action.md` 已纠正旧规格：首层只加破防、Always 与控制成功分离、
duration 不写入状态 Buff、专属击倒事件不在动作入口代发。来源结构在公共
`source/physicalInflictionActions.ts`，不归 `stumpControlActions`，不新增同形正式协议。
真实五 Buff 闭包现已 **5/5 可编译**：Shatter（134217728）已接入公共伤害投影与执行回归，
保留物理类型、结晶异常增伤和 Ignite 分类，不把 Shatter 单独归为 PhysicalInfliction。
主动 **171/309**、完整 **5 名**、余烬 **7/9** 不变；联合 **338 文件 / 4028 项**、四套类型
检查及五名完整定义重建检查通过。闭包编译通过不等于根击倒和余烬已能完整模拟。
正式技能编译现在保留伤害 features 和即时属性修正；即时修正的属性键、公式槽和单位元分别
复用公共 `attributeModifier` 与本体 `attributeModifierValues`，禁止另写一份同形映射。
伊冯的 Atk 错误身份已通过重新生成修正，不手工维护产物。即时禁暴击与完整面板的合成边界
已修复：完整暴击率/暴伤进入同一属性公式，技能快捷加成仅在当前命中只读求值；公共生成到
实际执行及旁路回归通过。最新联合 **338 文件 / 4035 项**、四套类型检查和五名重建检查通过。
组件准入/事件及普通击倒成功→起身→退出已在 combat-spec 实现。最新新增 18 项生命周期回归，
相关 84 项通过；保留二次标签免疫、独立起身计时与重复击倒重入。不能把 BeforeKnockDown 的
Success 当作完整控制成功。外围、起身时长 getter 和实体时钟仍需显式生产绑定；浮空落地未实现。
下一步按普通成功切片接 Endaxis 标签/起身/时钟及根击倒执行，不补造敌人主动行为。原生证据见 combat-spec
`docs/knockdown-action.md`，其 SkillWeaknessInterrupted 标签不能在无敌人主动行为场景中伪造。
下方为前序迁移记录，不代表 KnockDown 已完成；完整证据与待办以当前交接文档为准。

本机已恢复台式机的 120 份投射物缓存，并复现五名完整定义的 `--complete --check`。
最新严格主动矩阵为 **171/309**：公共 DoOnce 资源回复投影新增余烬普攻四、卡契尔普攻四、
昼雪普攻三；完整干员仍为 **5 名**。投影只接受技能时间轴内同步资源子序列，复用正式 once
及实例级去重，不开放 Buff reset/任意持续子行为。原生证据见 combat-spec `docs/do-once-action.md`。
余烬 **7/9** 的下一阻塞是击倒公共 Buff/事件链，不能仅输出标记或删除倒地伤害、失衡和破防层。
续作已接入公共 Ignite 调用和 `OnBuffAfterTryEnhanced` 投影，并修正叠层者身份、点燃施法传递、
结束原因及结束后停遍历；余烬整链仍未闭合，矩阵仍为 **170/309 / 5 名完整定义**。
续作已补齐 DamageAction 的已证明敌人 Owner、Environment 当前 Buff 层数和 Tag 黑板读取，
Hp/Poise 共同拒绝把敌人 Owner 当施术者；击倒/破防载体可以独立编译。公共 Switch 与命名曲线
实体时间膨胀已让结晶破坏载体也能独立编译；弭弗普攻一新增 compiled，但余烬仍 **7/9**。
根 KnockDownAction 的准入/免疫/事件/引用装配和点燃响应映射整体仍严格阻断。
最新联合回归 **336 文件 / 4001 项**、四套类型检查、五名整名重建检查通过；重跑审计为
**171/309 / 5 名完整定义**。全索引下载计划仍有无关 Buff 的
GodEntityFinder 解析阻塞；资源恢复细节和 provenance 边界见 `docs/handoff/current-context.md`。

### Switch 公共控制流（已接入，2026-08-28）

依据 combat-spec `docs/switch-action.md` 与 `Actions/SwitchAction.cs`。原始来源层保留
choice/options/alwaysNext 及子引用；公共投影生成独立契约中的 `switch`，不按干员或 Buff ID 写特例。

| 层次       | 接入要求                                                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 独立契约   | 多分支选择属于 `actions.ts`，复用 `ActionValueOperand` 与 `ActionSequence`；不能在转换器、本体各造一份近似定义                                |
| 公共投影   | 分支继承入口目标组事实、相互隔离；保留 option 顺序、重复标签和空分支，不能按值排序、按索引选择或提前去重                                      |
| 执行器     | choice 每次 Execute 只读取一次；各 option 按配置顺序读取，双方和减法均按 float32，绝对差不大于 `1e-5f` 时命中第一个；缺黑板键报错，NaN 不匹配 |
| 生命周期   | 全部子序列在实例阶段建立，Reset 依序重置全部选项，Tick/End 只传给选中的分支；下一次 Execute 重新选择                                          |
| 返回值     | `selectedSequenceResult                                                                                                                       |     | alwaysNext`；无匹配的内部结果为 false；alwaysNext 不取消子序列内部短路，不能删除被消费的尾条件 |
| 共同消费者 | 校验、正式编译、格式输出、递归遍历、兼容性检查和编辑器同步支持；不能只让生成器类型检查通过                                                    |

conditional 也已依据 `IfElseAction.cs` 改为持久分支实例、Reset 两支；普通 actionValueCompare
仍使用 double 比较，不能据此将 Switch 简单拼成 IfElse 链。若未来选择有边界的降级方案，必须证明
choice 求值次数和所有子动作生命周期等价，不能因为当前标签为整数就假定等价。
`switchProjection.test.ts`、`switchActionRuntime.test.ts` 和真实伤害执行器回归覆盖重复标签、
单精度边界、动态选项、无匹配、两种 alwaysNext、内部短路、未选分支快照及跨次执行重新选择。
共同消费者回归覆盖 options 中的伤害 key/hit ID、兼容性与结构校验、导图和命中点投影。

结晶破坏的真实 options 含 TimeDilationAction。命名曲线开启时内嵌曲线不参与执行；敌方 Buff 的
`[Owner, Source]` 仅在 Owner 与施术者身份均已证明时映射为 enemy/caster，未知来源不放宽。
该 Buff 独立探针通过不代表 KnockDown 整链完成：仍须接准入、免疫、事件、载体与传递引用装配，
再验证余烬战技/连携实际数值，不能跳过它们去直接发布 outputKnockDown。

以下为前序整名交付检查点：

Xaihi 与 Wulfgard 均已从固定 1.4.4 来源完整生成并切入产品稳定导出；统一 TS 整名定义现为 5 名。最新严格主动
审计为 **167/309**，Xaihi、Yvonne、Avywenna、Akekuri、Wulfgard 共 5 名主动全可编译。
Wulfgard 的中断门禁、冷却清零、Tag Buff 结束、智能目标组和能力实体子技能已进入公共投影；两级
天赋附着 Buff 的黑板输入按养成等级解析，不能只保留首级。公共 `takeAtkSnapshot=true` 已在动作
Reset 阶段按技能施法/Buff 实例冻结攻击计算，并按动作实例隔离、在周期触发间复用；燃烧的
Burning/Dot 分类和禁暴击即时修正也已保留。Wulfgard 完整输出含 9 技能、2 天赋、5 潜能、
1 能力实体、2 私有 Buff 与 7 公共 Buff，整名检查及逐技能模拟通过。当前回归为 game-data
93 文件 / 709 项、Next 237 文件 / 3246 项，四套类型检查通过。

### 前一架构检查点（2026-08-27）

架构及类型归属检查点已提交 `9d9fb195`；后续以第二名完整干员检验公共链路，不继续扩建中间层。
主动矩阵现为 86/309，完整生成仍为艾维文娜 1 名。秋栗 7/9、埃特拉 6/9 主动可编译，
但潜能 AddBuff、跨等级天赋 Buff 初始化及主动动作闭包仍有缺口，不能把主动比例当成整名完成度。

续作补齐公共 `StoreAttributeValue(Sub)`：按 combat-spec `compound-status-action-contracts.md`
和 `StoreAttributeValueAction` 选择施术者副属性，不使用此路径残留的 `attributeType=Level`。
复用正式动态属性读取步骤；保留非转换阶段、取整标志及黑板操作数，不新增干员专用快照算法。
秋栗连携随后已通过转换及隔离旧技能/养成的本地生产模拟探针。公共伤害投影依据
`target-resolution.md` 仅对 InstantSearch 执行选择器；Context 必须绑定已证明的敌人组。
未缩放失衡依据 `definite-value-calculation.md` 不读取残留倍率，启用缩放的形状仍严格阻断。

时间轴运行投影的 `blackboard` 直接消费正式初值契约，保留数值动态声明，补丁同名键后覆盖；
主动技能与实体子技能共用。静态求值的 `ResolvedSkillBlackboardSource` 仍排除动态初值，
不得将运行初值反灌成常量证据。此边界依据 combat-spec `skill-blackboard.md`；不是改写本体
的动态/静态键复位生命周期，也未启用黑板活性删除。艾维文娜已重建补回 9 个动态初值。
最新检查为 327 文件 / 3907 项、四套类型检查及艾维文娜整名 `--check`，完整生成数量未增加。

## 数据契约与依赖边界（2026-08-27）

生成数据的唯一正式结构现位于 [`packages/game-data-contract`](../../packages/game-data-contract/README.md)。
该文档固定模块依赖图、数据转换图、字段归属、等级轴与引用边界；后续修改必须先遵守这些约定。
转换器和 Endaxis 本体都消费独立契约，禁止互相导入，包括 type-only 导入。
本体原 `operatorDefinition.ts` / `equipmentDefinition.ts` 仅保留兼容转导出；Buff 的纯数据属性
也已脱离运行类，不再从执行器类型裁剪 `SkillBuffDefinition`。生成文件暂保持原 import 路径，
经兼容入口消费同一契约，不因此重写已有产物。

独立契约迁移完成后，已沿既定模型收敛静态属性链路：一份结构与等级参数列直接投影，
不再逐等级展开属性对象、投影后比较身份、再聚合回列。此前被撤回的试改没有直接恢复；
本次不加连续等级限制，不调整运行条件选择。真实不同的等级效果、缺档、默认回退及覆盖顺序不能删除。
不把公共契约的建立计为新增完整干员；完整生成与正式注册仍为艾维文娜 1 名。

独立门禁：`npm run type-check:game-data-contract`、`npm run type-check:game-data-production`，以及
`test/dataContractBoundaries.test.ts`。生产图只允许编译器、契约和既有无本体依赖的 `src/shared` 工具；
跨端集成测试单独允许消费本体。契约自身不允许运行类、回调字段或包外依赖。
完整结构 validator 仍暂留本体，后续纯校验迁移必须先拆掉与 Buff 执行器的耦合，不能复制一套近似实现。

### 静态属性链路的固定分工

1. 来源层保留原生目标、属性和公式槽；`SkillPatch` 保留真实等级 ID 与参数列。
2. `passiveSkillInstallation.ts` 负责等级选择和输入覆盖。定义编译时武器直接取整列；套装按原生固定
   等级取值，缺档或 nativeDefault 仍用 SkillData 默认值。输入黑板在补丁后覆盖为单值。
3. `cardSkillBuildModifiers.ts` 是武器/套装共同的 CardSkill 参数绑定入口：字面量保持单值，
   黑板引用直接传列。`attributeModifier.ts` 规范化原生身份，`buildAttributeProjection.ts` 只投影一次。
   单件装备精锻也传整列，干员养成的单值继续使用同一个公共投影，不另建算法。
4. `CompiledBuildModifierDefinitionSource<Value>` 只约束独立契约中的已支持贡献种类；
   `ProjectedBuildModifierSource<Value>` 仅额外包含待提升的 `baseDefense`。除这个特例外，投影结果
   就是正式修正，无需 `toFormalModifier` 再搬字段。类型可表示不等于已取得转换证据。
5. 装备装配只处理基础防御提升、attrIndex 分组和精锻档数；武器装配只处理词条与领域身份。
   CardSkill 不允许设置装备顶层基础防御，返回 blocked 诊断；缺黑板不补零。

`Value` 使用独立契约的 `LevelValues`。不折叠原生等级列中的重复数值；这里只是不再为字面常量
和固定等级套装制造重复数组。已有数值数组仍合法，不要求为表示变化批量重写正式数据。
机械门禁禁止领域读取 `cardAttributeModifiers` 自行绑定参数，回归检查整列引用未复制、原生槽位
边界未放宽、默认回退/输入覆盖未变，以及本体构筑解析中单值与原重复数组等价。

### 武器运行安装链路（2026-08-27）

`CompiledWeaponTraitRuntimeDependencySource` 现在保留一次原始请求、等级 ID 列、黑板列、启动 Buff、
Toggle 组和动作图。旧 `CompiledWeaponTraitLevelRuntimeDependencySource` 已删除，不再为每一等级
复制整个安装上下文和 Buff 参数。静态修正与运行安装共用同一份已处理输入覆盖的黑板。

- `materializePassiveBuffInstallation<Value>` 是单值/整列通用的参数绑定器；引用沿用原列，直接赋值
  保持单值/字符串，缺失的服务端参数保留 unresolved 身份。套装仍使用固定等级的单值调用。
- `compileTraitPlans` 逐档求值真正依赖等级的条件，只选择安装对象的引用；它不是逐档重新编译 Buff。
  必须在闭包场景省略之后，比较最终安装顺序、Buff ID 与参数键。不同 Toggle 组跨档交替成立，
  只要最终结构相同就可以保留，不能要求每个组跨档启用状态一致。
- `selectInstallationValues` 对同一参数来源直接沿用单值/原列；只有跨档选中了不同参数来源，
  才按各自下标组成结果列，例如 `[A[0], B[1]]`。缺失/非数字值仍按 Buff 实际读集阻断或明确省略。
- 事件黑板、Deck 初始化黑板直接使用同一批参数列，不再从每级安装对象倒收集。
  绑定参数列需覆盖来源等级轴；本次未新增原生等级连续性限制或改变缺档回退。

真实 77 把武器的 78 个生成文件与静态重构后的基线逐字一致，2034 个词条等级的对象级差分为零。
针对交替 Toggle、最终结构变化、表现省略、必读/未读服务端参数的回归独立于本机 tmp，
并通过本体 validator 与构筑编译器检查生成列的实际解析。

### 默认值、补丁列与运行引用（2026-08-27）

默认值链路已去掉“先包单元素数组、再按等级扩列”：`numericDeclaredBlackboard` 直接返回单值，
`resolveSkillBlackboardSource` 只做默认值与原生 Patch 列的覆盖合并。技能、Buff、主动与被动入口
共用这个数值模型，不在各领域入口补回重复数组。

| 数据字段                               | 形式与边界                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `DeclaredBlackboardValueSource.value`  | 原始单个声明的数值/字符串，保留动态标记。                                                                     |
| `SkillPatchSource.blackboard`          | 原生补丁等级列，与 `levels` 的真实等级 ID 一一对应；相等值的列也不在这里折叠。                                |
| `ResolvedSkillBlackboardSource.values` | 默认值为单值，补丁值保留原列引用；动态声明默认不纳入，Patch 可以另行提供同名值。                              |
| `ScalarSource.levelValues`             | `LevelValues \| null`：上层已知数值或未知输入。保留原字段名，但不再只表示数组；只是解析上下文，不是常量传播。 |

`selectSkillBlackboardLevel` 仅在请求等级精确命中时按列下标取值，单值直接沿用；null/缺档仍只回到
声明默认值，不泄漏 Patch-only 键。额外输入黑板的覆盖仍在此后。Buff 局部声明可以覆盖继承上下文，
即使调用方显式纳入动态初值，动作和寿命参数也仍按 `blackboardKey` 编译成运行引用，不能冻结为初值。
主动技能正式装配沿用既有输出折叠规则，只新增对单值的直接传递；费用/冷却的单位转换不变。

真实武器候选输出有 10 份文件从重复默认数组改为单值，2034 个词条等级的对象级比较无差异。
它们只生成到 tmp，未覆盖正式目录；因此正式武器 `--check` 现在除既有 `wpn_funnel_0016` 的行为来源
陈旧项外，还会看到这些预期表示差异。不能再宣称正式武器目录只有一个 stale。艾维文娜整名产物未变。

**尚未完成**：这不等于生成器所有等级化数据、优化与表示都已整理完毕。
公共动作/Buff 的输出子集已集中到契约派生模块；其他编译模块的类型仍须逐项按证据收敛，
不能将这次整理称为整个生成器已统一。类型兼容检查也不等于外部 JSON 的运行时结构校验。
武器 Buff 挂首词条、纯 validator 独立化另行处理，不混入本批等级链路重构。

### 公共动作/Buff 的输出类型边界（2026-08-27）

- 显示信息、属性修正、伤害/治疗/失衡修正从独立契约派生，只附加当前已支持的字段和条件子集。
  不重写槽位、乘区、处理器字段；叠加类型映射的值必须是契约枚举，不能放宽成 string。
- 原生曲线关键帧仍保留整数 weightedMode，输出关键帧使用契约定义；投影只接受 0/1/2/3，
  未支持的值带原始动作路径阻断，不断言、不截位、不补默认值。依据为 combat-spec 的
  AnimationCurveEvaluator（WeightedIn=1 / WeightedOut=2）；合法关键帧数据不变。
- 治疗参数是属性公式与固定值公式的互斥联合，不能把 amount/attribute/multiplier/addition 全写成
  独立可选字段。Buff 动作赋值当前只支持数值操作数；CreateBuff 与 Aura 共用投影入口，字符串直写
  在转换时阻断，套装安装也返回 blocked，而不是生成本体无法执行的常量。
  原生字符串仍完整保留；引用分支不读取残留直接值，已证明纯表现的整项仍先省略。
  Buff 定义的字符串默认值及动态 buffId 字符串读取不受影响；不要为了赋值而拓宽数值运算操作数。
- `test/compiledCombatContract.test.ts` 由 `type-check:game-data` 检查整个公共 Buff、条件、
  步骤、序列和武器输出是否可赋给契约（不是只检查某个 JSON 样本）。跨端测试直接使用这些输出，
  不允许借助 unknown/as 绕过不兼容；现有运行时 validator 仍正常执行。

该批联合 326 文件 / 3852 项、四套类型检查、艾维文娜整名及 77 把武器临时基线的生成检查通过。

### 公共输出类型的固定归属（2026-08-27）

| 模块                                                    | 责任与依赖                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| `combatActionProjectionTypes.ts`                        | 条件、动作值、步骤、序列与简单伤害输出的已支持子集，只依赖独立契约。 |
| `buffProjectionTypes.ts`                                | Buff 根字段、显示与修正器输出，依赖契约及上述动作类型。              |
| `buffRuntimeProjection.ts` / `simpleDamageOperation.ts` | 原生语义投影；旧类型入口仅转导出，不再声明副本。                     |

窄子集不代表新协议：公共字段由 Pick/Extract 等派生，只保留现有目标、枚举、必需字段和递归子树
限制。例如事件技能类型不含处决，实体时间膨胀只接受命名曲线，Buff 查询尚未输出同施法过滤位；
复用契约时不得顺便放开这些限制。支持判断仍由投影执行，不以类型代替来源证据或场景审计。

`dataContractBoundaries.test.ts` 机械检查 12 个公共输出类型只声明一次，两个类型模块不得反向导入
来源、编译实现或领域模块，也不得放入可执行语句。`compiledCombatContract.test.ts` 同时检查
契约兼容与未支持形状的排除（递归条件、目标、必需字段、曲线和运算）。

迁移前后 12 个类型双向可赋值；擦除类型、移除注释后的两个投影模块 JavaScript 完全一致。
主文件从 3709 行降到 3166 行，两个类型文件为 277/152 行，相关生产代码合计净减 132 行。
联合 **326 文件 / 3856 项**、四套类型检查、艾维文娜整名及 77 把武器临时基线检查通过；
没有更新正式产物、游戏规则或完整干员数。

实现随后已按公共职责分离：`combatConditionProjection.ts` 负责条件，
`combatActionLeafProjection.ts` 负责普通动作叶子，`combatEntityAndTimeProjection.ts` 负责
实体/时间动作，`combatProjectionCommon.ts` 负责共享上下文及操作数。主文件保留 Buff 装配
和控制流编排，从 3166 行降到 1199 行；57 个函数及常量初始化器的 AST 与拆分前一致。
类型消费者直接引用所属模块，传递依赖门禁包含 type-only import，禁止经其他模块绕回上层。
联合 **326 文件 / 3858 项**、四套类型检查、整名及武器临时基线检查通过，正式产物不变。
不为文件拆分制造新框架，不启动尚未批准的激进优化。架构边界收敛后回到第二名完整 Operator 纵向迁移。

### 阶段输出与真正中间态的归属（2026-08-27）

类型准入规则见[独立契约的类型归属](../../packages/game-data-contract/README.md#类型归属与中间表示)。
新增中间类型必须说明生产者、消费者、额外信息、不变量以及退出阶段；仅仅重命名、转交字段
不构成创建第二套 schema 的理由。编译工具类型不必进入契约，原生类型也不得因外形相同合并。

| 当前类型/模块                                                                        | 类别与处理                                                                    |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `weaponType.ts` / `ProjectedWeaponTypeSource`                                        | 正式身份直接使用 `OperatorWeaponType`，旧名只转导出；原生到正式的映射保留     |
| `CompiledWeaponStaticDefinitionSource` / `CompiledWeaponTraitStaticDefinitionSource` | 正式阶段输出，从 Weapon/词条契约派生，修正器仍取已支持子集                    |
| `CompiledWeaponRuntimeDefinitionSource`                                              | 静态候选补齐行为后的正式输出，资源字段及初始化黑板来自契约；不是优化 IR       |
| `CompiledWeaponEventHandlerSource`                                                   | 公共事件协议的已支持子集，priority/blackboard 必填；两种触发入口互斥          |
| `CompiledWeaponTraitRuntimeDependencySource`                                         | 静态编译→运行装配的依赖计划，保留原生请求、动作图、等级身份与资源引用；不输出 |
| `CompiledWeaponToggleConditionSource` / Toggle 组                                    | 安装判定中间态，原生比较名及未解析值保留到场景装配；不能冒充正式条件          |
| `CompiledGearDefinitionSource` / 词条                                                | 正式输出子集，槽位与字段来自契约，assetSlug 和 modifiers 保持必填             |
| `ProjectedModifierLevels`                                                            | 装配用的修正结果及原生 origin，保留索引和来源；进入正式装备后不再携带 origin  |
| 各种 Batch / Diagnostic / Request                                                    | 编译工具数据，不是正式游戏 schema，也不是为优化新增的 IR                      |

本轮已收敛武器星级、武器类型、Ability 事件和装备槽位四组身份；语义战斗事件仍保留当前三类
及物理异常四项/装备者范围。契约拥有更多形状不代表转换器自动支持，映射之外的原生值仍阻断。
`dataContractBoundaries.test.ts` 对这四组已确认身份扫描重复联合与校验集合，也检查已迁移的
阶段输出不再手写契约字段；`compiledCombatContract.test.ts` 验证兼容性、必填项及不支持形状。
这些是明确范围的门禁，不宣称已经证明全转换器没有任何同义类型。

本轮联合 **326 文件 / 3868 项**、四套类型检查、艾维文娜整名及 77 把武器临时基线 `--check`
通过。生成行为及正式产物不变，未新增完整干员；正式武器此前的陈旧差异仍未覆盖。

后续切片已收敛干员角色/星级、头部/成长/信赖、套装及主动技能调度输出：

| 类型/模块                                            | 本轮归属与约束                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `OperatorCharacterTableSource`                       | 原生记录与投影身份的关联中间态；原生 profession/rarity 保留，角色和星级直接使用契约  |
| `CompiledOperatorDefinitionHeaderSource`             | 正式字段由 Operator 契约派生；sourceCharacterId 供编译追踪，装配时删除               |
| `CompiledOperatorAttributeGrowthSource`              | 直接取只读 AttributeGrowthDefinition；关键帧选择与截断算法不变                       |
| `OperatorPanelMilestoneSource`                       | 精确 level/breakStage 查询输入，不是正式成长表                                       |
| `CompiledTrustAttributeBonusSource`                  | values 来自契约；attributes 仍限具体四维，默认数值复用契约常量                       |
| 套装静态输出/运行依赖                                | 静态身份来自 GearSetDefinition；运行入口用 Pick/Partial 消费已有计划，不复制安装字段 |
| `CompiledActiveSkillTimelineSequenceSource`          | ScheduledSequence 子集，endFrame 必填，步骤限公共已支持投影                          |
| `CompiledOperatorActiveSkillRuntimeDefinitionSource` | 字段与费用派生契约，sourceSkillId/blackboard/costFrame 必填，复用公共调度项          |
| `CompiledActiveSkillRuntimeProjectionSource`         | 保留原生时长与等级黑板的装配中间态，供主动技能和实体子技能分别消费                   |
| 实体蓝图及子技能                                     | 已直接使用契约，不新增同形类型；删除子技能返回断言，直接检查输出                     |

前序切片将枚举门禁扩至六组、阶段字段门禁扩至十二类，实体输出入口禁止类型断言。
不为已有契约直出的实体再建 IR，不把来源、等级选择和未解析安装计划误并入正式定义。

本切片联合 **326 文件 / 3878 项**、四套类型检查通过；艾维文娜整名及 77 把武器临时基线
`--check` 一致。正式文件未更新，未新增完整干员，未改变场景或原生支持范围。

### 技能组、养成与元素边界（后续切片）

- `OperatorSkillIdentitySource`、技能组/变体计划和主动入口的正式分类字段改由契约派生；
  `nativeGroupType`、有序 `skillKeys`、源文件及旧投影配置仍是有用途的链接输入，不直接输出。
  技能分类与等级来源不是同一枚举：处决/下落攻击可作为技能，但不能作为独立养成等级来源。
  配置入口按契约校验两者，变体也校验；错误包含精确字段路径，不再等装配时用断言掩盖。
- 主动技能旧公共支持列表保留原有顺序，类型直接转导出 `SkillType`，列表以契约约束并有值域/
  顺序回归。该列表兼有当前支持边界和兼容顺序职责，不把它升级为第二套游戏类型。
- 整名装配删除 SkillDefinition、SkillGroupDefinition 及私有/公共 Buff 的四处输出断言，
  Buff 分桶始终保留公共投影类型，分组使用 satisfies 校验；既有变体装配阻塞没有放开。
- `ProjectedDamageElementSource` 只转导出契约 `DamageElement`；原生枚举、别名及映射保持。
  旧公开数组从唯一映射取值，仍按 physical/heat/electric/cryo/nature 排列，不跟随契约展示顺序重排。
- 简单伤害的五类 damageType 从伤害协议用 Extract 取支持子集，不因值相同改用角色元素类型。
  门禁区分独立联合声明和 Extract/Exclude 的范围选择，不能凭集合相同判定同一语义身份。
- `CompiledOperatorProgressionEntrySource` 保留：它携带来源路径、原生 skillId、overwrite、
  字符串值和构筑条件。正式养成编译才绑定技能组、将 overwrite 转为 assign、拒绝未支持项，
  并直接输出 UpgradeModifier/OperatorUpgrade 契约；本轮没有改变这套算法或强行合并两层。

当前门禁覆盖八组枚举、十六类派生字段，输出断言检查覆盖实体和整名装配。
这批明确归属已收敛，下一步回到第二名完整干员的纵向迁移，以真实闭包检验公共契约；
不继续无界扫描并为每个临时对象创建新 IR，后续发现的问题按同一准入规则就地处理。

本切片联合 **326 文件 / 3888 项**、四套类型检查及艾维文娜/77 把武器临时基线 `--check`
通过。合法产物不变；配置中的非法技能分类或等级来源现在更早带字段路径阻断。

## 0. 当前唯一交付目标

在新版能够对象级生成并运行验证旧版已支持的完整干员前，唯一优先目标是恢复完整 Operator
纵向链路。以下规则是机械门禁，不是建议：

1. 以整名干员为提交单位：主动技能、Buff、能力实体、投射物、天赋、潜能、技能组和正式注册必须
   同时闭环；只增加一种 Action 支持不算完成进度；
2. 每轮先运行全干员主动技能迁移矩阵，选择“距离完整闭环最近且阻塞具有公共价值”的干员；不能
   因当前手上恰好打开了某个文件便继续追逐其下一个未知动作；
3. Operator 对象级等价和生产模拟门禁完成前，冻结武器、装备及非必要下载/审计功能扩张；只允许
   修复会直接阻塞当前完整干员的公共来源或编译能力；
4. 旧 Python 实现与运行时差分 oracle 已退役；迁移时验证过的对象级结果保存在 TS 测试快照中，
   规则语义仍只来自 combat-spec 和原生数据；
5. 新增公共代码必须同时删除替代掉的旧入口或证明不存在重复实现。若代码量增加但完整干员计数
   不增加，必须在迁移矩阵中明确显示阻塞减少，否则停止扩张并调整设计；
6. `buffRuntimeProjection.ts` 等公共核心不得继续吸收无边界逻辑。新增行为应进入对应来源模块和
   独立语义投影；公共控制流文件只负责编排，不承载具体领域规则。

迁移矩阵由 `audit:game-data:operator-active-skills` 生成到 `tmp/`，正式生成仍使用整干员原子入口
`generate:game-data:operator-active-skills`。矩阵只负责选择工作，不得用“可解析技能数”冒充完整干员。

### 当前纵向切片：艾维文娜

- 首名整名迁移已完成并正式注册：**完整 Operator 为 1**。原始表、主动技能、养成、Buff 与实体
  由同一入口生成，正式定义不再叠加旧 Operator。10 技能、6 技能组、2 天赋、5 潜能、2 实体及子技能、
  5 私有 Buff、5 公共 Buff；整名 `--check` 与实际排轴回归通过。
- `domains/operator/progressionDefinition.ts` 直接组装正式 `OperatorUpgradeDefinition`，不再复制
  一套近似的养成协议。按 `passiveSkillNodeInfo.index/level` 聚合天赋；潜能按原生解锁级别生成
  独立项，由正式构筑层累计启用。数值属性解释复用 `projectBuildAttributeModifier`。
- 艾维文娜 5 档潜能、第二天赋的两个等级已从原生表切片编译并与旧产物对象级比较一致。
  回归夹具 `test/fixtures/avywenna-progression.json` 保存原表版本及 SHA-256；旧产物只作差分基准。
- 第一天赋的直接附加 Buff 已补齐首次挂载证据：`CharMiscFeature.Start → RefreshTalentBuff`
  以角色自身同时作为来源和目标调用 AddBuff；不是隐藏被动技能。输出正式 `initializationSequence`，
  不继承技能施放信息。证据见 combat-spec `docs/talent-attached-buffs.md`。两个天赋及五档潜能
  均可组装；真实 BuffData 经公共编译器进入生产模拟，验证天赋 0 级不安装、1/2 级只在第 0 帧安装一次。
- 潜能 AddBuff 的收集、带条件的直接 Buff、跨等级变化的初始化仍明确拒绝；没有用该首次安装
  切片冒充原生完整刷新/卸载流程。
- 养成已装入正式干员，没有新增片段 CLI。原先 4 个干员根 Buff 均通过公共编译器，完整动作闭包
  另纳入 lance_becalled_ready。因此最终私有定义为 5 个，而不是只复制此前探针的 4 个根。
  lance_pulse_check 保留原始自身层数守卫和 `target: buffOwner`，
  生产模拟覆盖首次附着、Unique 防重及到期重施；按 combat-spec `docs/buff-lifecycle.md` 修正了
  “先启动、后登记容器”的顺序，不能仿照旧生成器删守卫。
- ultimate_skill_debuff 的 `VulnerableAction` 已有公共严格来源切片；载体 ID 由原生
  GetKeywordBuffName 的跳转表和匹配元数据字符串证明，不按名称推断。引用扫描保留载体、
  child 覆盖及增强匹配；动态 ID 即使携带非空字面残留也不能当静态依赖。
  combat-spec 已接入原始四 Buff 链和共享添加事件协议，确定成功事件先于已有关键词增强，
  新关键词在返回后登记；敌人部件仍未复刻，不声称覆盖所有目标。TS 的 Start/Enable 已分离
  生命周期身份，不借能力事件；Finish/EnhanceChanged 的外部触发者需另审计。
  `applyBuff` 已在正式协议与公共执行器支持动态 `{ blackboardKey }` 身份，每次实际施加重新查表，
  不携带默认回退 ID。公共 `buffReferenceClosure.ts` 现支持有证明的无覆盖关键词默认 child：
  载体不能是外部根，声明非动态、来路仅为无 child 覆盖的关键词，载体只含 Enable 创建/表现动作；
  新发现子图后重新检查来路。不改写动态动作，不进行跨 Buff 常量传播，未知覆盖继续阻塞。
  CLI 资源读取复用同一闭包按需回调，不再另写静态遍历。
  空增强名单关键词复用通用 applyBuff，非空增强或 child 覆盖尚不开放。公共容器已改为
  Added → Output → 已有关键词增强，Refresh 同样执行成功尾部，Unique 拒绝不执行。
  原始四链经自动闭包和生产 ScenarioSimulationService 验证：电伤乘 1.3、默认十秒到期恢复，
  子 Buff 来源与父子清理一致。敌方区间属性现从同一运行时集合冻结，不再硬填零；VFX 显式省略。
  前序四根探针读取七个来源、生成六个定义、零 blocked；现整名闭包读取 11 来源、生成 10 定义，
  另按公共策略省略一个纯表现来源。公共定义经全局只读目录注册，不进入可编辑干员私有定义。
  `chr_0012_avywen_combo_skill_lance` 和 `chr_0012_avywen_ultimate_skill_lance` 两个实体子技能
  已复用公共 SkillData 编译并通过生产生命周期/召回探针。保留原始 `potential_2 < 1` 的 900 帧
  结束守卫（旧产物遗漏）、1500 帧结束、持续召回检查和死亡后下一次 advance 释放。
  整名候选已正式注册，回归从 40 份版本化原始输入独立重建，并在潜能 0..5 验证实际连携→战技、
  终结技→战技，以及普攻链/处决/下落攻击。联合 321 文件 / 3806 项通过。
  最新主动矩阵为 83/309；两个含未支持根 Buff 的技能不再误计入。下一步选择第二名整名切片，
  不得用“来源可解析”替代“完整可模拟”，也不得把 Buff 宿主无条件视为敌人或忽略易伤。

### 整名生成与检查

仍使用既有批量入口；`--complete` 才会生成包括养成和附属定义的 Operator。以下命令为只读校验，
移除最后的 `--check` 才写入。`source-root` 是资源总目录，不是它的 `SkillData` 子目录。

```powershell
npm run generate:game-data:operator-active-skills -- --complete `
  --manifest tools/game-data-compiler/config/operators.json `
  --source-root tmp/game-data-sources `
  --table-root tmp/game-data-sources/TableCfg-current `
  --skill-patch-table tmp/game-data-sources/TableCfg-current/SkillPatchTable.json `
  --buff-data-root tmp/game-data-sources/BuffData `
  --ability-entity-catalog src/next/data/ability-entities/ability-entity-templates-1.4.4.json `
  --projectile-blackboard-catalog src/next/data/projectiles/projectile-entity-blackboards-1.4.4.json `
  --gameplay-tag-catalog src/next/data/combat/gameplayTagCatalog.generated.ts `
  --time-dilation-catalog src/next/data/combat/timeDilationCatalog.ts `
  --global-buff-catalog src/next/data/global-buffs/global-buff-templates-1.4.4.json `
  --skill-setting-catalog src/next/data/combat/skill-setting.combat-1.4.4.json `
  --slug avywenna `
  --output src/next/data/operators/generated-definitions/avywenna `
  --audit-output tmp/game-data-audit/operator-definitions/avywenna `
  --check
```

- `planOperatorDefinition.ts` 负责编排 IO；来源基础复用 `compileOperatorFoundationSource`，
  `domains/operator/definition.ts` 装配技能组、养成和附属引用。公共 Action/Buff 不在领域内重写。
- 主动规划直接提供结构化定义、实际 Buff 依赖和生成实体的原始子技能 ID，不解析已渲染的 TS，
  不从实体名称猜子技能。同一模板不同子技能身份目前拒绝；实体缺源、未支持寿命或 Owner 操作报错。
- 完整模式从动作及养成请求自动建立 Buff 闭包，不接受 `--supplemental-buff`。隐藏被动 SkillData、
  技能变体、未投影技能根 Buff/面板修饰等必须阻塞，不能只因时间轴成功就标记整名完成。
- 角色模板携带的实体黑板和原生连携条件通过 manifest 的 `runtimeTemplate` 显式接入：`sourceFile`
  必须位于 `source-root` 内，`sourceSha256` 固定原始 Unity 对象身份，`skillGroupKey` 必须是实际连携组；
  角色 ID、原生连携 SkillData ID、RID 类型与字段、标签路径及黑板启用状态均由公共解析器校验。
  这类 CharacterTemplate 工件来自 VFS/解包，不属于 AKEDB 下载闭包；缺文件时生成应失败，不能回退
  已生成 TS。Arcane 当前约定路径为
  `CharacterData/chr_0032_lizhiyan.runtime-template.json`，源 SHA-256 为
  `33934515ea8b90efdf35f3fae4901124ed54fc16c087a9755574d8db58dca0bc`。
- 单干员命令一次原子写入一个 `<slug>.operator.generated.ts`，只包含干员定义、私有 `buff_chr_*`
  和对公共 Buff ID 的引用。它不得导出 `commonBuffDefinitions`，也不得反向决定公共资源内容。
- 公共 Buff 使用独立 `generate:game-data:common-buffs` 命令扫描全部正式来源闭包，原子生成
  `src/next/data/buffs/generated/commonBuffDefinitions.generated.ts`。相同 ID 在多个闭包中出现时必须
  得到深度一致的定义，否则生成失败；不能再靠干员 import 或对象展开顺序选择“规范版本”。产品只
  通过 `src/next/data/buffs/commonDefinitions.ts` 的稳定只读入口注册该目录。
- 输出目录严格限定为上述父目录下的 slug 子目录；未知文件拒绝覆盖。审计写入 tmp，正式数据不带
  本机路径。`--check` 忽略 CRLF/LF，仍严格核对内容；文件存在数与注册/可模拟计数不能混用。
- 伤害 key 按技能身份与最终结构路径确定，展开后的独立回调步骤各有唯一 key；不随机、不取绝对路径。
  结构校验与模拟必须使用正式产品 validator/ScenarioSimulationService，不复制近似协议。

生产配置 `tsconfig.production.json` 启用 `erasableSyntaxOnly`，并证明依赖图不加载本体。
完整测试配置仍包含使用本体执行器的集成探针；`architectureBoundaries.test.ts` 将可擦除语法要求
施加到工具与测试自身。运行引擎中的类只属于集成测试依赖，不再是生成结构的间接类型依赖。

## 1. 不可越过的证据边界

### 1.1 事实来源

证据优先级固定如下：

1. `combat-spec` 中由反编译代码确认的原生类型、字段和运行行为；
2. AKEDB、游戏解包文件及其他可追溯的原生导出数据；
3. 可重复的游戏内实验，仅用于补足静态证据无法回答的问题；
4. 旧版 Endaxis 只可帮助定位文件和提出待验证问题，不能证明游戏行为。

`combat-spec` 必须严格描述原生行为；Endaxis 必须以 `combat-spec` 为依据，再显式执行
适合当前模拟场景的简化。发现证据缺口时，应先更新或记录 `combat-spec` 侧的待办，不能在
转换器里猜测规则。

禁止从以下内容反推语义：

- 中文、英文或罗马音显示名称；
- ID 的拼写、前后缀或编号规律；
- 旧版 Endaxis 的实现结果；
- “这个效果按常理应该如此”的领域经验；
- 当前模拟器恰好观察不到某项行为这一事实本身。

无法确认的结构必须保留原始身份、字段路径和阻塞原因。不得静默丢弃，不得为了提高
“可转换率”而把未知结构标成已支持。

## 2. 总体架构

依赖方向固定为：

```text
原生导出数据
    ↓
严格数据读取层 source
    ↓
保留证据的公共源 IR
    ↓
公共控制流与行为编译器 compiler
    ↓
Endaxis 场景投影 projection
    ↓
领域适配器 domains/operator | weapon | equipment
    ↓
正式定义渲染、审计报告和黄金输出
```

各层只能依赖其上方的稳定抽象，不能反向依赖具体干员、武器、装备或 UI。

### 2.1 严格数据读取层

负责：

- 校验原生对象、数组、数字、布尔值、枚举和必需字段；
- 解析序列化类型名、黑板值、目标引用、Tag 查询、时间轴和动作载荷；
- 在错误中报告完整源文件、对象 ID 和字段路径；
- 保留原生直接值、黑板键、逐等级值及其来源；
- 严格复现原生单精度计算的截断边界。

GameplayTag ID 是原生有符号 CRC-32 位模式，负数是合法身份；不能把它当作非负数据库主键，
也不能脱离同版本 GameplayTag 目录为裸 ID 猜测语义。

这一层只陈述“数据是什么”，不判断该行为对 Endaxis 是否有价值。

### 2.2 公共源 IR

干员技能、天赋、潜能、武器效果和装备套装效果若使用相同的原生 `SkillData`、
`BuffData`、Action、Condition、Target、Blackboard 或 AbilityEntity 结构，就必须进入
同一套 IR，禁止复制成三套近似模型。

IR 必须能够追溯到原生证据，至少保留：

- 来源文件、原生对象 ID 和稳定字段路径；
- 原生动作类型、`serverActionIndex`、时间帧及嵌套顺序；
- 数值来源：直接值、黑板键、SkillPatch 逐等级值或运行时写入；
- Buff、能力实体、子技能、投射物之间的引用关系和所有权；
- 已确认的语义、尚未支持的结构和场景投影时省略的结构。

不得在读取阶段直接生成 TypeScript DSL 字符串。先形成结构化 IR，再做编译、优化和渲染。

### 2.3 公共编译器

实体子技能入口 `compiler/abilityEntityChildSkill.ts` 只绑定宿主上下文、校验接入条件并装配正式
子技能协议；动作/条件/时间轴必须复用公共入口。不得复制一份实体专用的动作分发器。
`timelineControlProjection.ts` 负责已取证的 JumpTo/FinishOwner；跳转保留 Execute/Tick 重试，
只开放整个活动区间向前的目标和无副作用条件。实体 Owner 不得借用 caster 的资源或 Buff 来源。
现阶段有费用/冷却、多充能、根 Buff 安装或面板修饰的子技能必须报阻塞。
公共来源编译入口须可由原生 Node 执行，不得为了调用 validator 引入浏览器运行模块链；正式协议
校验在集成门禁调用产品实现，编译器保持纯来源约束和类型化输出，不另写一份运行时 validator。

`skillPresentationTargets.ts` 只处理整张 SkillData 中可证明仅服务于表现的无过滤来源/固定点查询。
所有消费者及重复写入者都安全才可省略；混合序列还要保留查询失败的短路影响。依赖来源层保留的
目标引用（包括方向 contextKey），不能绕过 IR 偷读原 JSON，也不能扩大为通用黑板死代码消除。

公共编译器负责原生行为，与内容属于干员、武器还是装备无关，包括但不限于：

- Sequence、Branch、Switch、DoOnce、循环及跳转等控制流；
- 条件、目标选择、目标组写入和上下文传递；
- 伤害、治疗、失衡、资源、元素附着及关键词行为；
- Buff 的应用、结束、层数、黑板、生命周期、事件和属性修饰；
- AbilityEntity、子技能、投射物、Aura 和时间膨胀；
- SkillPatch、逐等级黑板及被动技能中的操作序列。

同一种原生结构只能有一个解析器和一个语义编译入口。领域差异通过配置或外层适配器表达，
不能复制公共编译逻辑后分别演化。

连携技是这条规则的强制样例。游戏语义只引用 combat-spec
`docs/combo-skill-lifecycle.md`。已证实存在两类原生触发位置，转换器必须分别走以下单向数据流：

```text
CharacterData.SkillDataBundle
  -> source/operatorRuntimeTemplate.ts（槽位、优先级、条件、条件黑板）
  -> source/comboSkillConditions.ts + 公共 Action IR
  -> compiler/comboSkillConditions.ts
  -> 干员级连携运行时定义

SkillData / BuffData / AbilityEntityData 的动作树
  -> 各领域来源读取器
  -> 公共 Action IR 中的 TriggerComboSkillAction
  -> 公共动作编译器生成 openComboWindow
  -> 同一个连携候选窗口运行时
```

两类来源不是两套产品语义：前者负责事件常驻注册与条件求值，后者在动作执行到该节点时直接提交候选。
例如 Xaihi 的 CharacterTemplate `comboSkillConditions=[]`，真实条件由支援晶体内部
`buff_chr_0011_seraph_combo_count` 在第二次治疗后执行 `TriggerComboSkillAction` 表达。模板条件数只能
用于该专项审计，不能代替整名动作闭包的连携覆盖审计。

`operators.json` 不得逐条声明伤害标签、附着类型或 Buff 条件来代替上述转换。旧
`comboSkillRegistrations` 是已经删除的手写捷径，不是另一类原生来源；其契约、解析器、编译与运行时
均不得恢复，产品定义只接受上游生成的 `comboSkillConditions`。Unity RID 仍为 raw、事件目标绑定未取证或公共 Action 尚不支持时，
必须报告来源路径与阻塞类型，不能退回手写语义规则，也不能静默省略该干员的连携条件。

这里的“同一种”不能根据字段相似、输出相同或代码长相判断。原生归属必须从对应版本 schema
的类型引用图计算：以 Operator、Equipment、Weapon 等顶层 schema 为根，按原生类型身份递归遍历
字段引用；只被一个根引用的类型归该领域，被多个根引用的同一个类型节点归公共来源层。字段完全
相同但类型身份不同的节点仍是两个类型，不能合并。

在当前 SparkBuffer TableCfg 中，Bean/Enum 的 `type_hash` 和字段引用 hash 构成这张图的身份与边；
类型名称和字段签名只用于审计 hash 冲突，不能替代身份。MemoryPack/JsonData 应使用对应版本的
formatter/runtime schema 类型身份建立同样的引用图。字符串 ID 指向另一类数据文件时，必须记录为
跨 schema 引用边，不能因当前文件内没有嵌套对象而误判为领域私有。

公共化还必须满足：

1. schema 引用图与 `combat-spec` 证明来源是同一个原生类型、枚举或运行入口；
2. 公共 IR 保留的是同一个原生语义身份，而不是两个恰好同形的对象；
3. 投影目标也是同一个 Endaxis 运行时概念。若只满足前两项，公共解析可以复用，但不同投影仍应分开。

确认身份后，该语义的原生解释能力只由 `source/` 和对应的唯一 `compiler/` 入口持有。领域层不得
直接导入公共原生解释模块，只能消费其规范化 IR 或调用公开投影。这是依赖能力边界，不是靠搜索
相似常量或要求开发者记住已有实现。

类型引用图只决定“来源 schema 属于谁”，不直接决定“Endaxis 投影属于谁”。同一个公共来源 IR
若分别写入 OperatorDefinition、GearDefinition 和 WeaponDefinition，三个外层组装仍留在各自领域；
只有投影目标本身也是同一个 Next 运行时概念时，投影实现才进入公共 compiler。

当前 1.4.4 证据中的属性修正是这条规则的基准样例：Operator TableCfg
`AttributeModifierData` 与 Equipment `EquipAttributeModifierData` 是不同 type hash，分别读取；两者
引用的 `AttributeType`、`ModifierType`、`ModifyAttributeType` 是相同 hash，公共定义。MemoryPack
`SkillData.cardAttributeModifier` 与 `BuffData.attributeModifier` 则确实都引用同一个
`Beyond.Gameplay.AttributeModifierData`，必须共享来源解析器。三类来源经原生 loader 语义求值后
才能汇入公共 Attribute Modifier IR。

同一报告还证明 CharacterTable、CharGrowthTable 与 WeaponBasicTable 的 `weaponType` 都引用
type hash `0x8DD3BF94` 的 `Beyond.GEnums.WeaponType`。因此原生枚举只在 `source/weaponType.ts`
定义一次，干员与武器兼容性分类只通过 `compiler/weaponType.ts` 的同一投影进入 Next；原生已定义但
Next 尚无语义的成员必须失败关闭，不能由任一领域自行补映射。

### 2.4 场景投影层

场景投影把完整原生行为简化成 Endaxis 当前模拟器需要的行为。每一种简化都必须：

- 有明确的适用前提；
- 能与“尚未支持”区分；
- 在审计中留下分类和原始证据路径；
- 不改变仍可观察的战斗结果。

当前已经确认的场景边界：

- 敌人没有主动行为；
- 优先闭合会影响对敌伤害和必要轴上表现的行为；不因原生存在某系统便扩展模拟范围。
  标准木桩连携资格明确采用“干员存活且未被沉默”，不建立死亡/敌方沉默系统；若将来支持
  对应外部事实，再替换资格投影，不从 HP 或未知标签推导。
- 连携智能目标目前只归约普通选敌设置、零距离、有效唯一木桩候选；保留 input/trigger 身份。
  不实现镜头/锁定菜单/dummy 坐标。非敌人智能候选和未审计评分保持明确边界；不要求为当前
  已闭合的木桩连携链继续调查不可观察的客户端细节。
- 依赖敌人主动攻击而触发的干员受伤、伤害免疫和类似防御效果，在当前场景中没有实际输出；
- 只有敌人正在施放可打断的红圈技能时，打断才有结果；当前未建模敌人的该状态，因此
  `interrupt` 可以保留证据，但不应伪造模拟效果；
- 上述省略只说明“当前场景不可观察”，不说明原生行为不存在，也不能从公共 IR 删除证据。

时间膨胀是否影响敌方 Buff 流速等尚未确认的规则，必须保持为明确待证事项；在取得
`combat-spec` 或反编译证据前不得自行决定。

### 2.5 可执行的代码归属规则

判断代码归属时不能看“第一个使用者是谁”，必须看“它描述的概念属于哪一层”：

| 概念                                              | 唯一归属                      | 禁止出现的位置                                            |
| ------------------------------------------------- | ----------------------------- | --------------------------------------------------------- |
| 原生字段、枚举、Action/Condition/Target 载荷      | `source/`                     | 各领域自行解析同一原生类型                                |
| 公共控制流、战斗步骤、Buff/能力实体运行时定义投影 | `compiler/`                   | `domains/operator`、`domains/weapon`、`domains/equipment` |
| 当前固定木桩场景的省略与归约                      | 公共 projection/compiler 策略 | 按干员、武器或套装 ID 散落特判                            |
| 干员技能槽、面板、天赋和潜能组装                  | `domains/operator`            | 公共层或其他领域                                          |
| 武器入口、成长和词条安装                          | `domains/weapon`              | 公共行为编译器                                            |
| 单件装备、套装门槛和正式文件布局                  | `domains/equipment`           | 公共行为编译器                                            |
| TypeScript 文本、索引、审计文件                   | 各领域 renderer/writer        | 解析器和语义编译器                                        |

以下信号一旦出现，必须停止扩展功能并先修复边界：

- 领域文件声明不含领域字段的 `Step`、`Condition`、`Sequence`、`BuffDefinition` 联合类型；
- 领域文件开始按原生 Action 类型、`$type` 或 Condition 类型再次分派；
- 公共文件导入 `domains/`；
- 同一原生字段或运行语义在两个领域目录中各有一份映射表；
- 为了接通某个装备、武器或干员样本而给公共行为加入内容 ID 判断。

`architectureBoundaries.test.ts` 固定依赖能力和声明门禁，例如领域层不能直接取得公共原生
`AttributeType` 的解析入口。它不把“出现相似字符串”当作语义身份判据。新增公共语义时，提交说明
或交接文档必须指出对应的 `combat-spec` 文档、代码或工件；缺少证据时保持 `blocked`，不能引用
旧 Python 输出补足规则。

## 3. 领域适配器的职责

领域适配器只处理公共原生行为之外的差异：

- 原生入口表和对象发现方式；
- 定义 ID、归属和引用闭包；
- SkillPatch、技能等级、潜能或精炼等成长来源；
- 被动效果的安装、激活、卸载和持有者；
- 正式输出的文件布局和注册方式。

### 3.1 干员

干员适配器负责技能槽、天赋、潜能、基础面板和干员附属对象的组装。它不能拥有第二套
Action、Buff 或 AbilityEntity 编译器。

`CharacterPotentialTable`、`CharGrowthTable.talentNodeMap` 与
`PotentialTalentEffectTable` 是三个不同的 Operator 私有来源入口。前两者分别保留潜能解锁顺序和
天赋节点顺序，再通过有原生代码证据的效果 ID 边引用第三者。`PotentialTalentEffectData` 的
`None/AddPassiveSkill/ChangeSkillParam/ChangeSkillBlackboard/ModifyAttr/AddBuff` 联合载荷只能由
`source/operatorProgressionEffects.ts` 读取一次；天赋与潜能领域组装分别保持自身顺序和启用条件，
不能各自重复解析效果表，也不能虚构两条原生路径之间的统一先后顺序。

### 3.2 武器与装备

武器和装备必须复用干员已经使用的 SkillData、BuffData、条件、动作及被动编译能力，
只实现自身的入口、成长和激活特性。严禁手写套装效果代替转换。

正式文件继续按内容类型拆分：

- 武器按武器类型分目录、分文件；
- 装备按套装分目录、单件分文件；
- 套装效果与静态装备条目分离，但共享公共被动程序类型。

不得生成一个包含全部武器或装备行为的巨型文件。

## 4. Buff、能力实体与共享对象的归属

归属由原生引用和所有权证据决定，不由当前从哪个领域发现它决定。

- `buff_chr_*` 等有证据表明属于特定干员的 Buff，生成到干员定义层；
- `buff_common_*` 等公共 Buff 生成到只读的公共定义集合，不允许在单个干员编辑器中复制编辑；
- 干员生成配置可显式屏蔽在当前模拟场景中无输出的 Buff；屏蔽项必须进入审计，不能静默消失；
- 技能只通过 ID 引用所属 Buff，并传入本次施放的可变黑板值；
- Buff 定义本身不得偷偷依赖“当前技能等级”，除非原生证据明确表明这种耦合存在；
- AbilityEntity 使用同样的公共、领域所属和技能局部归属规则；
- 引用闭包必须自动收集，不能靠内容作者手工补齐隐式依赖。

编辑器中的“完整干员定义”可以统一编辑基础面板、技能、技能组、Buff 和能力实体，但这是
编辑体验的聚合，不代表这些对象在编译器中失去独立身份或被内联进每个技能。

## 5. 控制流与优化边界

优化必须在结构化 IR 上执行，并保持稳定、可解释、可关闭。所有树形优化都应自叶子向根，
先规范化子节点，再比较或折叠父节点。

公共 `actionSequenceProgram` 的静态分支预选不能绕过该顺序：预选成功仍只编译可达分支；
预选失败则暂存原错误，先投影两侧末端。仅当条件已证明为纯读取、两侧投影等价或都为空，
才随无效分支一并消去条件及该错误；仍有行为差异、条件存在副作用或返回值控制未支持时继续
失败关闭。来源解析和有效子树的错误不在这个暂存范围内。不能为了删空分支而给空间/屏幕条件
补虚假的恒真结果，也不为不同条件类型重复维护例外列表。

条件槽本身也可能包含 IfElse。仅对“alwaysNext=true、两个源分支无启用动作、内部条件
已证明无副作用”的窄结构，按原生 `alwaysNext || 分支结果` 将整个 IfElse 的返回值投影为 true；
并非将其内部的角度/数量等条件判成 true。有效分支、写回条件或 alwaysNext=false 仍不走该规则。

当前允许的保守优化：

- 展开只起容器作用的单层 Sequence；
- 清除过滤后为空的容器；
- 若 Branch 两侧经过场景过滤和子树规范化后实际执行逻辑完全相同，删除 Branch，只保留一份；
- 仅在能证明顺序和时序不变时合并相邻结构；
- 根 SequenceAction 的释放条件不能作为运行时根守卫，使条件失败时整项技能消失；
- 非根守卫失败后若仍有剩余行为，应保留可执行部分，以符合“技能必然可以释放”的模拟方针。

根守卫如何转换成第 0 帧条件、哪些条件属于技能释放条件，必须依据已统计的原生结构和
既有证据逐类实现，不能笼统假设所有根条件都可忽略。

以下属于已记录但暂不实施的激进优化：

- 把只为给黑板写入不同常量而展开的完整分支，重写成条件值表达式；
- 进行黑板活性分析：若某个黑板值的所有读取行为都已被场景投影删除，再连带删除其写入、
  只服务于该写入的分支和中间计算；
- 跨 Buff、子技能或能力实体边界的常量传播。

实施激进优化前必须先建立读写图、控制流等价证明和优化前后差分测试，不能靠文本相似度。

## 6. 正式输出要求

- 定义中不写中文或其他显示名称，只保存稳定 ID；显示文本统一通过 i18n 查询；
- 输出必须确定性排序，相同输入重复运行不得产生差异；
- 所有生成先写入独立临时区域，全部成功后再整体原子替换正式数据；
- 单次生成或模拟的中间状态不得泄漏到全局变量；
- 支持 `--check`：发现输出过期时失败，但不修改文件；
- 生成器不得覆盖手工内容；生成文件必须有明确标记和固定边界；
- 不生成无语义的占位 ID、猜测名称或手写行为；
- 优先级、槽位等枚举只有在证据明确时才转换为正式数值，未知值保留原生身份并阻塞编译；
- 输出文件不能依赖运行时才存在的审计生成文件，避免 Vite 因缺失生成产物无法启动。

## 7. 审计与诊断

每个领域都使用同一套审计分类，至少区分：

- `supported`：已由公共编译器完整转换；
- `scenario-omitted`：原生行为存在，但在明确的当前场景前提下不可观察；
- `presentation-only`：只有表现层输出，当前战斗模拟不消费；
- `blocked`：发现了影响战斗的结构，但缺少证据或编译能力；
- `invalid-source`：原生数据形状与证据模型冲突或引用缺失。

诊断信息必须包含领域入口、对象 ID、源文件、完整字段路径、原生类型和阻塞原因。统计既要
覆盖技能，也要覆盖天赋、潜能、武器、装备、Buff、能力实体及它们的引用闭包。

“已生成文件”不等于“可完整模拟”。完整度应分别报告：发现、解析、编译、场景投影、正式
注册和运行验证，避免用一个模糊百分比掩盖阻塞。

## 8. 代码风格

- 代码注释、架构文档和非原生诊断说明使用中文；原生字段名和类型名保持原样；
- 注释解释证据、边界和“为什么”，不逐行复述代码；
- 类型和函数名称应描述原生概念或明确的编译阶段，避免 `helper`、`misc`、`data2` 等名称；
- 函数保持单一职责；解析、语义编译、场景投影、优化和渲染不得混在一个函数中；
- 优先使用不可变数据和显式返回值，不使用保存单次编译状态的模块级可变变量；
- 领域差异使用有类型的适配器接口，不使用散落的 ID 特判；
- 未支持结构使用带路径的显式错误或审计结果，不使用宽泛 `catch` 后继续；
- 不建立巨型文件，也不为了形式拆出大量只有一两个函数的碎文件；按稳定职责组织模块；
- 公共层不得导入 `domains/operator`、`domains/weapon` 或 `domains/equipment`；
- 渲染器不得重新解释游戏语义，只负责把已确认 IR 稳定地写成正式定义；
- 原生帧、秒、单精度数值和 Endaxis 时间单位之间的转换必须集中实现并写明依据。

## 9. 测试与迁移门禁

迁移期间保留 Python 干员生成器作为 oracle，但不再向其中增加新架构。每项迁移至少包含：

1. TypeScript 单元测试，覆盖正常输入、边界值和严格失败；
2. 通过 JSON 调用 Python 实现的对象级差分测试；
3. 来自真实导出数据的最小固定样本；
4. 正式定义的语义黄金测试，而非只比较格式化文本；
5. 确定性输出与 `--check` 测试。

迁移顺序也是功能推进门禁：前一阶段没有完成对象级差分和正式运行验证时，不得为了扩大后续
领域数量而在后续领域补建缺失的公共行为编译器。特别是 Operator 领域适配器尚未达到旧 Python
正式输出等价前，武器和装备只能维护已经取得的来源证据与回归样本，不继续扩展正式行为覆盖。

最终删除 Python 前必须满足：

- 现有 Python 干员生成器测试全部继续通过；
- 已有正式干员的生成结果通过对象级或运行语义等价检查；
- 已确认装备套装黄金样本通过等价检查；
- 全量干员、武器和装备源数据完成统一审计；
- Next 类型检查、核心模拟测试和正式数据仓库测试通过；
- 不再存在只供 Python 生成器消费、且没有归档价值的中间格式。

当前门禁命令：

```sh
npm run type-check:game-data
npm run test:game-data
```

### 来源融合与 VFS 替代门禁（2026-09-03，当前权威规则）

唯一入口为 `scripts/downloadGameDataSources.ts`，默认 `hybrid`：
AKEDB CDN 优先，VFS 补齐欠缺。所需资源只由 `game-data-sources.json` 声明；
combat-spec 提供反编译依据，不能充当资源清单、隐式缓存或下载配置。

- AKEDB manifest 与 asset-sync-index 使用刷新参数、no-cache 请求，避免缓存仍返回旧版本。
  默认选择 latest，也可显式传完整 `--version 1.5.3@9885010-4`。注意版本只固定 TableCfg：
  JSON 与图片仍是共享当前快照，逐项 version 表示该文件记录版本，不能声称已支持历史全资源重建。
- 集合使用 AKEDB 索引和 VFS manifest 的并集；同名文件优先完整读取 AKEDB，
  **不按字段混合两份对象**。AKEDB 未收录或 HTTP 404 才补 VFS；
  超时、500、坏 JSON、索引大小/MD5 不符均阻断，不用换源掩盖错误。
  连接重置、暂时 DNS 错误和超时只对原 URL 做最多三次传输尝试（包含响应体读取）；
  重试仍失败时报告 URL 与底层原因。HTTP 状态、来源身份头和内容校验错误不重试。
- VFS 补取仍须有 `X-Endaxis-Source: vfs-index-browser`。该头是协议标记，不是密码学认证。
  VFS 清单不可达而 AKEDB 有该集合时只取得 AKEDB 已知覆盖，并在账本标记 inventory unavailable；
  没有任何可用清单、坏清单或身份头错误不能当成空集合。
- 全量输出必须选择**尚不存在**的目录。先写相邻 `.partial-*`，结束时重新核对 AKEDB 清单哈希，
  再一次 rename 发布；失败中间目录保留供检查，不覆盖上一批输入。不要提交这些目录。
  下载与生成目录共用 `src/io.ts` 的原子 rename 占用重试，不各自维护 Windows 特例。
  该层只处理文件系统传输，不承载游戏数据类型、来源选择或覆盖策略。
- `source-provenance.json` 保存所选表版本、资产 revision、清单 SHA-256、
  逐文件 provider/URL/version/字节数/SHA-256/补缺原因及内容快照哈希。
  `--vfs-version` 只是调用方声明，账本始终标记 versionVerified=false；
  未声明则为 null，不能伪装成已证明与 AKEDB 同版本。
- `--json-file` 仍只补清单中指定的一份全局 JSON，另写相邻 provenance；
  `--tables-only` 只取表，不能与它组合。目录仍为 TableCfg-current、SkillData、BuffData、
  ProjectileData、AbilityEntityData、CharacterData；编译器不根据 provider 再走一套生成实现。
- 图片入口 `export:game-icons` 同样默认 AKEDB 优先，复用同一资产索引/校验实现；
  名称匹配忽略大小写，真正请求保留索引中的原始路径大小写。缺图/404 才查询 VFS，
  歧义、哈希错误不自动换源。保留输出隔离、占位图和 WebP 转换，并记录 provider/version/URL/hash。
  图片仍逐张写入，完整审计后才能人工发布隔离输出，不声称具备全目录原子发布。
  `--workers` 控制有界并发（默认 6），与来源下载共用调度器；审计结果固定按资源路径排序。
- `--source-mode vfs-only` 仅用于独立复现和差异审计，**不是生产默认来源**。

当前 AKEDB 已覆盖 18 张需求表、2621 SkillData、2872 BuffData、724 张引用图片；
ProjectileData、AbilityEntityData、角色模板和部分全局配置仍需 VFS。文件名覆盖不等于逐字段一致。
VFS 按以下顺序逐渐补能力：metadata 自动枚举名称 → 共享结构字段/默认值 →
角色及全局配置闭包 → Sprite 裁切与图片 → 全量对照。
只有同版本资源集合、字段值、枚举名称、数值表示、图片内容和可复现导出全部对齐，
才考虑提出用 VFS 替代 AKEDB；不能以下载成功、文件数相同或局部门禁通过提前替换。
已发现武器 Buff 的 useMaxStackCntKey 两端 true/false 差异，必须追查解码/版本，
不得修改原生规则迁就任何一端。

```powershell
npm run download:game-data:sources -- --output tmp/game-data-hybrid-20260903 --vfs-base http://desktop:8765/api/endaxis-data
npm run download:game-data:sources -- --tables-only --version 1.5.3@9885010-4 --output tmp/tables-1.5.3
npm run download:game-data:sources -- --source-mode vfs-only --output tmp/vfs-comparison --vfs-base http://desktop:8765/api/endaxis-data
npm run export:game-icons -- --overwrite --output-root tmp/game-icons-hybrid
```

角色模板仍需要提供 decodeCharacterTemplate 的 VFS worker（0.15.0 起），
保持有界解码与 partial 标记；下载成功不等于字段可模拟或完整定义可生成。

### 新来源字段迁移：投射物目标控制边界

原生权威依据见 combat-spec `docs/launch-projectile-skill-routing.md` 的 2026-09-03 小节。
公共 `referenceActions.ts` 读取 `targetFilterMode`、`targetFilterSettings`、
`alsoLaunchToHittableTarget`，只允许旧结构整组缺失或新结构完整存在；模式只接受名称，
不在转换器新增数值映射。过滤配置在关闭状态也保留于来源 IR，不下放到运行时数据契约。

公共零距离投射物投影仅接受原生已证明不会开启新路径的 `None + false`；
`OnlyHit/NeverHit` 或额外发射开启时明确失败，不能因“所有攻击命中”而忽略过滤资格或发射数量。
已证明完全无战斗回调的发射仍先剔除。旧/新关闭结构必须输出等价结果，公开底层投影入口
必须与扩展工厂共用同一守卫，避免绕过工厂后丢失新增语义。

迁移进度与整批预检记录在 `docs/handoff/current-context.md`；来源解析通过不代表生成完成，
使用旧派生目录的预检也不能冒充同批来源的端到端重生成。

### 新来源字段迁移：实体子技能的多输入目标

`SpawnAbilityEntity.allowMultiInputTarget` 的原生依据与 C# 实现在 combat-spec
`docs/spawn-ability-entity.md`。它只影响子技能保存输入目标，**不控制生成数量**。
公共来源解析保留严格布尔字段，旧结构缺失表示默认选项；Endaxis 对无子技能、无目标或
已证明的单一敌人/施术者/当前实体输入消去差异，不给运行时再加无效配置。
开启且输入为未证明单项的空间点组或其他目标组时仍失败；不能用“零距离”代替目标基数证明。

## 10. 迁移顺序

当前输入版本的 Selector 后处理迁移：`PriorityFilter.processTargetType` 仅开放旧结构缺失
或新结构显式 `Targets`。证据集中于 combat-spec `docs/selector-pipeline.md` 的 2026-09-03
小节；该字段真实选择候选列表，不能无条件忽略。普通目标两种编码共享同一来源结构，
`parsePriorityFilterSource` 是唯一单项解析入口，队伍选择器识别也复用它。
ExcludeTarget/ShuffleTarget 已分别追踪当前镜像消费者，三者通过
`requireOrdinaryTargetProcessor` 共用缺失/显式 Targets 的严格结构校验；其他同名字段不自动放行。
排除设置只由 `parseExcludeTargetSource` 解析，随机筛选仍保存限量值，不在来源层模拟随机或删操作。
`HittableTargets`、数字/未知枚举仍拒绝。C# 只接入前两种处理器，ShuffleTarget 尚无执行适配器。
此迁移不新增契约或运行时开关，不等于新版本全干员整批生成完成。

1. 迁移严格读取原语、数值来源、类型名和原生单精度行为；
2. 迁移 Target、Tag、Blackboard、SkillPatch 等公共叶子结构；
3. 迁移 Condition、Action 和控制流，建立统一公共 IR；
4. 迁移 Buff、AbilityEntity、Projectile、Aura 等引用图；
5. 迁移被动 SkillData，使干员天赋/潜能、武器和装备共用同一入口；
6. 接入干员领域适配器，与 Python 正式干员输出逐个对照；
7. 接入武器和装备适配器，复用公共被动及引用闭包；
8. 切换正式生成命令，归档黄金证据，删除被替代的 Python 和装备专用编译器。

旧脏工作区中的装备身份映射、AKEDB 获取、静态条目生成、引用所有权、黄金导出和原子写入
能力可以按证据逐项迁移；装备专用的效果 IR、行为 IR、语义渲染器和旧版适配器不进入新主干。

## 11. 当前迁移状态

### 逐能力实体目标的有界公共投影

`compileCombatActionSequenceSource` 现在可注入同版本 `abilityEntityQueries` 目录/标签表，
沿既有公共查询编译器生成 `findOwnerSpawnedAbilityEntities`，并把已知 Context 的 ForEach
编为逐实际实例执行；数量守卫继续使用公共条件。目录 ID 只是候选，不能制造实例或跨 owner。
当前只覆盖施法者 Owner/Source、已确认不动态增删的 born-tag 筛选及同施法验证器；连续查询、
其他 anchor、排序/距离后处理、动态标签和死亡中间态不在此入口内。

循环内 `Target=currentAbilityEntity`，不改变 Owner/Source 或黑板。固定 Target 的 CreateBuff
不消费残留 targetGroupKey；Source 仍为施法者，无需虚构事件。Owner→当前枪的无半径距离条件
按项目零空间投影，并保留原生 <= / > 边界。复刻库先补 ForEach/CheckDistanceCondition 证据与
运行时；Next 修复逐项 false 抛错，保留局部短路、目标快照及正常后继，不吞运行异常。

两类原战技标记切片经过公共编译、实体/Buff 联合测试和正式场景装配。新增 29 项，Next+统一
编译器全量 305 文件/3643 项通过，两侧类型检查、武器 --check 77/78 通过。正式干员定义未变，
原连续排轴仍缺键；JumpTo/FinishOwner/退出及投射物调度仍是下一项，不把标记成功冒充整技能修复。
精确源路径、排除动作序号及测试边界见 `docs/research/avywenna-return-projectile-blackboard.md`。

### 投射物回调黑板的有界公共投影

`compileSynchronousProjectileCallbackScopesSource` 只包装外层已经证明可同步执行的回调切片，
不推导 hit/reach 顺序或命中次数。必须给出精确模板身份及实体黑板证据；每次发射独立，
各回调 direct 从自身声明和发射快照建立，同投射物共享实体层。重复子技能、实体赋值等未闭合路径
明确拒绝，独立 SkillPatch/extra 和异步调度尚未接入。不能把该入口误当完整 LaunchProjectile 编译器。

艾维文娜真实写入/潜能伤害分支/到达资源守卫已从公共源 IR 接至真实 Next 场景模拟。
公共伤害保留实时倍率、NormalSkill/CanBreakWeakness 位与后置 Poise；普通 AtkScaleCalculation
读嵌套倍率，简单公式不读序列化的残留公式。其他掩码/公式、施法攻击快照仍严格拒绝。
公共动作可显式绑定 `Target=enemy` 而不虚构 Buff 事件；回调未绑定的 Owner 标为 unavailable，
不能代用发射者。这个窄入口不放行未覆盖的目标组、循环或事件条件。
两类枪已验证真实伤害、潜能差分、Buff 守卫、资源账本和重复发射；仍未纳入整条回收/附着/时间
膨胀链，测试提供的 hit/reach 顺序不是原生调度证据。正式技能尚未替换，
详见 `docs/research/avywenna-return-projectile-blackboard.md`。不得修改旧 Python 或手补生成产物绕过边界。

### 已退役：角色模板常驻运行覆盖层

早期 `operator-runtime` 入口只在旧 Python 角色产物上覆盖实体初值、连携条件及施法元数据。
统一 TS 整名生成器现已直接生成这些字段，因此该中间产物、安装器和生成命令已删除。
历史证据仍保留在 `docs/research/arcane-next-evidence.md`；当前正式入口是完整干员原子生成。

已完成：

- 诀正式模板运行定义已生成和注册；原来的 8 场交叉阻塞清零，**966/966 成功、0 豁免**。
  真实战技→连携与关闭条件的同构筑对照产生不同元素及伤害；全技能上轴 301/301 继续通过。
  该批全量 294 文件/3097 项及两侧类型检查通过。后续默认武器库/迁移 UI 已切换，完整干员迁移仍待推进。
- 公共 compileComboSmartTargetSource 将已审计连携目标策略头投影为 comboSmartTarget，保留
  来源及固定木桩投影分类。定义/存档/编译已接入；Pending 经现有窗口进入 afterCastStart，
  实际诀连携的四元素/两构筑隔离回归已有真实伤害；正式模板运行定义也已接入。
- 公共连携来源可投影到正式 comboSkillConditions，显式绑定 key/连携组，审计来源与定义分开。
  项目模板结构校验/存档往返与正式场景编译已接入，引用/等级在编译阶段严格解析。
  五条真实条件走此链路及连续附着回归；资格与 Pending 施法已接木桩投影，正式诀常驻数据已安装，
  不能称完整角色转换或图形编辑入口已完成。
- 正式场景编译从已解析等级/养成的完整定义提取静态冷却目录，空轴/未放置连携与变体也有账本，
  但不安装未放置动作。设置/减少与槽位继承操作使用完整目录，重复放置不重复推进。
  正式诀交叉回归通过；缺确认帧/多充能等边界不变。
- Next 编译程序 comboConditionPrograms 已由 assembly 自动安装到标准环境真实事件阶段，
  复用角色共享板和当前槽单充能冷却。五条真实来源通过正式定义/场景的实际技能附着回归；
  正式诀常驻数据已切换，但不能把此称为完整干员编译器迁移完成。标准场景提供资格简化，Pending 由
  assembly 自动入窗口；外部接收回调仅作可选观察者，afterCastStart 保留独立目标与 direct 快照。
- VFS 已解码 Unity 连携 RID 的有界规范化适配，五种已审计叶子仍复用公共 Action/Condition 解析；
  真实 14 条来源核对一致，五条条件可编译。Context 对象类型及 ByTag 首目标增强层数进入 Next。
  DebugPrint/关闭动作不再被残留 Target 假阻塞；真正的 InputTarget、非空子 RID 和 BuffIdCount
  仍是显式边界。诀常驻产物已切换，不等同完整干员迁移完成；木桩资格和 Pending 施法已接通。
- 公共连携条件来源读取与四类附着事件、afterTakePhysicalInfliction、OnAddedBuff、OnTakeDamage
  条件编译，复用公共事件上下文、条件/序列
  而不另写叶子；布尔结果被消费时保留纯尾条件。`comboSkillConditionImmediately` 和
  `comboSkillPriorityType` 已转换成可读正式字段，不能因当前样本均为 Pending 或单敌人而丢弃；
  立即 TryCast 的目标感知运行端仍显式阻塞。连携只另加 owner/沉默/冷却门禁、每注册 direct 板和
  Pending 生命周期，不另写 Buff/伤害事件或条件叶。原始 RID 未展开、主控/支援过滤、未审计事件仍拒绝；
  InputTarget 尚未投影时禁止把 Target 编成 Buff 的物理 eventTarget。证据见 combat-spec 的
  combo-condition-environment.md、combo-event-gates-and-pending.md；正式定义到场景生成已接通。
- 安塔尔、萤石、诀、狼卫、Last Rite 与汤汤已由各自 `SkillDataBundle` 整体生成常驻条件。汤汤模板
  经桌面端 VFS 从实际角色资产重导后，`CheckBuffIdInContextAdvanced` 等 4/4 条条件引用均完整；事件
  12 生成 Burst 伤害条件，事件 9 生成 SpellBurst Buff 标签条件，事件 121 生成寒冷附着条件。重导
  前后根 `sourceSha256` 一致，证明只补全了解码结果。生成器仍要求整个 Bundle 完整，不允许只选可
  编译子集。Pending 过期使用原生 `remainTime < 0`，剩余时间恰好为零时仍保留候选。
- 佩丽卡同样整体生成事件 101 `OnBeforeTakeDamage` 条件。VFS 重导闭合零载荷
  `CharacterTeamFinder + MainCharacterValidator` selector RID；公共事件投影保留“伤害来源 input / 承伤
  方 trigger”，生成末段普攻标签、input 为当前主控及 trigger 为 Enemy 三重条件。manifest 中手写
  连携注册数量为零。
- AbilitySystemData 两层黑板的公共安装投影：实体字面值与启用/禁用的条件局部板分离，动态声明
  不当作编译期常量；Next 实体初值随场景装配进入共享运行板，正式诀常驻条件生成已切换。
- CheckSpellInflictionType 的原生数值/命名/零 mask 与 savedKey 写回投影；有写入副作用的尾条件
  保留执行及前置守卫，不能按“没有后继步骤”省略。证据见 combat-spec/docs/check-spell-infliction-type.md。
- 独立 TypeScript 工具链、类型检查和测试命令；
- 严格对象、数组、数值、字符串、布尔值和字段集合读取；
- 原生 Action 类型名与 Selector 嵌套类型名读取；
- 原生单精度 TickInterval 帧投影；
- ScalarSource、GameplayTag 查询和完整 TargetSettings 读取；
- SkillData 黑板声明、引用收集和 SkillPatch 逐等级读取；
- SimpleCalcBBAction 与 ModifyDynamicBlackboard 的完整来源读取；后者将合法的间接 HpRatio 路径
  与 Endaxis 当前只支持的直接值投影分开；
- RandomAction 的范围来源、随机类型与输出黑板键；来源层不猜测随机算法或上下界包含性；
- StoreAttributeValue 的目标属性身份、基础/最终未转换取值、除数、乘数、基值、取整开关与输出黑板键；
  来源层只建立属性到黑板的数据流，不提前求值角色面板；
- TargetGroup 的 Find、ContinuousFind、Merge、Pick 纯动作来源读取，以及单独附加时间轴位置和
  相邻数量写回关联的动作树收集器；
- CharacterTeam、ExcludeTarget、DistanceValidator、PriorityFilter、SmartTarget 和
  CircularOrderSort 等已取证选择器事实；
- 不携带场景 `supported` 结论的公共 Condition 叶子 IR；
- 浮点、主控、距离、目标数、Buff 层数、Tag、标记、生命、概率、技能类型、目标身份和
  对象类型等 14 类高频条件；
- 角度、霸体、失衡、敌人等级、构筑属性，以及伤害、治疗、Buff、技能命中、能力实体时长等
  事件上下文条件；
- 干员持有的 Buff 在 OnBeforeDamageAction、OnBeforeOutputDamage、OnOutputDamage 中，
  动作 Target 统一绑定输出伤害的受击敌人，生命条件与 InputTarget 查询共用这一上下文；
  生命条件仍读取实时值，不按“干员不会受伤”省略。依据为 combat-spec 的
  origin-skill-event-context 与 buff-and-damage；不得推广到承伤事件或其他宿主。
  Buff 的 limitSkillCastId 另涉及 affix 身份，不能借事件目标绑定就证明普通来源 cast id 等价。
- `OrConditionAction` 的“组内全部满足、组间任一满足”结构，以及只反转下一项的
  `NotNextCheckAction`；
- `ObtainCostAction`、`CreateTimedMarker` 和 `AddGlobalCDTimer` 的公共来源载荷；资源动作
  保留完整来源/目标与表现开关，TimedMarker 保留动态 ID 和局部/共享计时基准；
- `CreateBuffAction`、`FinishBuffAction`、`FinishBuffAdvanced` 和 `HealAction` 的公共来源载荷；
  Buff 动作保留动态身份字段、黑板赋值、来源/目标和生命周期，治疗动作保留原生计算公式，
  不在来源层限制 healer、valueSource 或定值缩放形状；
- Heal 与 Damage 共用的四类原生 Calculation，以及 `DamageAction`/DamageUnit 的伤害公式、
  处理器、资源载荷、免疫/格挡与伤害数字合并事实；
- 投射物、能力实体和技能调用共用的子实体黑板赋值、空间参数与引用槽位来源 IR；投射物回调
  同时保留启用位和残留 ID，能力实体保留关闭状态下的编辑器空占位，不在来源层擅自打开引用；
- 公共定义引用图：动作节点保留完整来源路径，SkillData 根附属/条件切换/换技 Buff 与动作中的
  Buff、投射物、能力实体、子技能引用统一输出 `active/inactive/dynamic/empty` 边；纯闭包求解器只沿
  活动静态边遍历，并检测重复定义、循环和缺失目标；
- 公共递归控制流来源树：Sequence 保留主控/Guard 两类容器守卫和关闭动作，IfElse、Switch、
  ForEach、Channeling、JumpTo、TickInterval、TickIntervalV2 保留各自子序列；NotNext 作为只影响下一项的执行
  策略保存。解析阶段不选择分支、不展开循环、触发 Tick/跳转，也不执行根守卫优化；
- FinishOwnerAction 的完整目标与死亡表现开关；实体结束和普通 AbilitySystem 归零差异留给投影；
- TimeDilationAction 与 UltimateTimeAction 的层级、标签、持续时间、曲线关键帧、目标、冷却影响窗口
  和终结技恒定缩放来源；时间缩放仲裁、曲线求值与时钟投影仍以后续公共运行语义为准；
- 已迁移 Action 叶子的单一公共分派入口；控制流递归调用同一入口，领域适配器不得再按原生
  类型各自实现一套解析；未知 Action 携带完整字段路径明确阻塞；
- SkillData 动作图切片：严格校验根字段签名，读取声明黑板、39529 个时间轴区间及强制动画
  同步事实，并保留 112 个被动事件及其多 Sequence 结构；
- 领域无关的被动 SkillData 入口：严格区分 `castType=Passive`，复用公共黑板、根 Buff 赋值、
  Toggle 条件、CardSkill 属性修正、动作图和定义引用，不携带干员/武器/装备归属；
- 被动定义公共编译入口：先合并静态声明与 SkillPatch 逐等级值，再把同一份黑板来源注入条件、
  动作和 Buff 安装；动态声明不在导入时冻结，Patch 可提供原 SkillData 未声明的运行键；
- 公共 SkillPatch 选级：保留 SkillData 定义等级与静态默认黑板；只有请求等级精确命中补丁时才
  切换等级并合并该行，未指定等级或缺失补丁行均复现原生行为、继续使用定义默认值；
- 公共 SkillData 输入与批量编排：主动、被动及后续子技能入口共用声明黑板、SkillPatch 查找、
  缺失引用诊断、内嵌 skillId 校验和按定义 ID 去重；普通 Skill 与 Passive 只在原生运行形态分派后
  进入各自特有载荷，不能由 Operator 领域重新实现一套主动技能读取；
- 干员养成发现入口：按 `PotentialTalentEffectTable` 联合载荷中的 `AddPassiveSkill` 产生公共编译
  请求，保留效果包 ID、条目路径、运行时输入黑板和原生未指定的技能等级；
- 构筑属性条件：按 combat-spec 严格读取 `SkillConditionTable` 的 `CompareCharDeckAttr (14010)`
  与六种原生比较运算；养成条目按原生规则跳过空条件 ID，并把非空数组保留为有序短路 AND。
  当前 Next `BuildCondition` 只能容纳单个比较，因此多条件投影会明确阻塞，绝不截断；
- 干员 `CharacterTable` 入口：按 combat-spec 严格读取角色 ID、原始元素字符串、完整原生职业枚举、
  稀有度、主副属性、默认武器和属性关键帧；职业成员来自 SparkBuffer type hash `0xABF873A2`，
  稀有度在来源层只保留 schema 已证明的整数身份；
  原生查找保持 `(level, breakStage)` 精确首项匹配，Next 的六档整数面板由显式里程碑投影产生，
  不把产品展示档位伪装成原生插值规则；
- 公共元素身份投影：CharacterTable、DamageAction 和条件数据共用同一个原生元素归一入口，
  `Physical/Fire/Pulse/Cryst/Natural` 只维护一份到 Next 稳定身份的映射；来源层不得反向依赖
  compiler，也不得由三个消费者各复制一份字典；
- OperatorDefinition 静态头部：从同一个严格来源闭包组装稀有度、武器、元素、职业、主副属性、
  六档面板和非默认好感属性。`slug/gameId` 是 Endaxis 产品身份，不从 CharacterTable 的显示字段猜测；
  技能、天赋和潜能行为未装配前，该头部不能单独注册成完整干员定义；
- 干员天赋节点入口：按 combat-spec 严格读取 `CharGrowthTable.talentNodeMap` 的节点类型、属性
  Modifier 和被动效果 ID；好感属性只投影 `Attr(3)` 节点，默认主属性规则省略、双属性例外保留，
  不把 `PassiveSkill(4)` 的条件属性路径混入属性节点；
- 武器发现入口：按 `WeaponBasicTable.weaponSkillList` 的原生顺序产生相同的公共请求，等级来源只
  保存槽位及突破/潜能模板 ID，具体等级必须由 combat-spec 已确认的武器等级算法解析；
- 武器技能等级解析：严格按突破槽位边界、潜能额外边界、一级 SkillPatch `tagId` 与基质词条
  `tagId` 依次计算并限制上限；缺突破行返回空、缺潜能行保留突破结果，不按星级或槽位猜规则；
  原生按技能列表索引读取边界，因此边界不足明确失败，而三星模板中未被技能列表引用的尾部
  `(0, 0)` 占位允许保留并忽略；
- 武器基础攻击成长：被动发现和成长读取共用同一 `WeaponBasicTable` 严格源行；成长只沿声明的
  `levelTemplateId` 读取 `WeaponUpgradeTemplateTable`，保留导出值和原生 float 运行值，只有精确等级
  行产生 `Specific/Atk/BaseAddition`，缺行返回空且不插值；
- 武器静态正式定义：以原生 `weaponId` 作为尚未引入产品身份表时的稳定候选身份，
  只接受 1/20/40/60/80/90 级六个精确基础攻击节点和 Next 可表达的稀有度/武器类型；
  CardSkill 属性按 SkillPatch 的完整等级黑板物化为逐档词条，而 Buff、Toggle 和动作闭包作为
  显式运行依赖保留，不因静态定义已生成而冒充动态行为已闭环；
- 公共构筑属性投影：武器与装备共用 `compiler/buildAttributeProjection.ts` 中的原生属性语义，
  正式修正与诊断类型也归入公共编译层；两个领域不互相导入，装备旧公开名称只保留为薄兼容导出；
- 装备套装发现入口：按 `EquipSuitTable.list` 的原生顺序产生相同的公共请求，保留每个阈值的
  `equipCnt`、`skillID` 和 `skillLv`；当前数据碰巧都是三件套一级技能，但实现不固化这些值；
- 公共 Attribute Modifier 枚举身份：Buff/CardSkill 的字符串枚举和表格中的数字枚举进入同一套
  `ModifyAttributeType`、`AttributeType`、`ModifierType` 身份；表格 IR 仍保留原始数字与完整路径，
  未知枚举失败而不是降级成裸数字；
- 单件装备来源入口：联合 `ItemTable` 的物品身份与 `EquipTable` 的战斗属性，严格保留每条
  `attrIndex` 和逐精锻档 `attrValues`；实例缺少某索引时选择第 0 档，等级越界直接失败，不读取
  展示修正、不插值也不夹取；
- 原生装备槽位枚举：由当前客户端 metadata 精确恢复 `Body/Hand/EDC/EndNum/Head/Ring = 0..5`；
  来源 IR 同时保留名称与原始数值，产品层只将 `Body/Hand/EDC` 映射为已有三类正式槽位；
- 单件装备正式定义组装：基础防御从公共属性程序提升为独立字段，其余修正按 `attrIndex` 保持逐档
  能力；十类已确认伤害倍率使用统一 `damageScale` 身份进入伤害快照，木桩模型不可观察的玩家承伤
  修正只进入 `scenario-omitted` 诊断；
- 单件装备确定性文件计划：按套装身份分目录、每件装备单文件，并生成稳定索引与 JSON 审计；渲染器
  不重新解释语义，输入顺序不影响内容，重复 ID、不安全路径和 blocked 诊断均直接失败；
- 公共被动批量编排：保留领域请求的顺序和重复安装来源，同时按 SkillData ID 去重编译共享定义；
  等级来源与运行时黑板留在请求上，公共定义保留完整 SkillPatch，不替武器或套装提前选级；
- 被动安装实例化：套装使用表内 `skillLv`，天赋/潜能保持原生默认等级，武器要求调用方提供已由
  突破/潜能/基质算法解析的实例等级；选级后再应用请求额外黑板，复现同名值最终覆盖顺序；
- 由已验证迁移结果固化的 TS 对象快照及真实 SkillPatch 导出切片。

当前 30 名干员、301 个技能已达到逐项模拟 301/301。武器来源和候选生成达到 **77/77**、226 条
运行依赖；117 个唯一被动中的 64 个事件程序现已进入公共 Action/AbilityEvent 编译层。
`CheckConsumeBuffLayer`、`SaveCharTypeId` 和 `CreateBuffAttachingSkill` 已有 combat-spec 证据；
此前 67/77 的来源阻塞统计已过期。

正式生成必须包含 startup、Toggle 和动作图的全部活动 Buff 引用；不能只跟随安装根。修正闭包后
实际生成 108 个 Buff 定义。`CreateBuffAttachingSkill` 的 `lifetimeOwner=currentCastSkill` 必须
完整传入正式步骤；生产端已按精确技能实例附着并在结束/中断时清理，不静默丢弃寿命。
截至 2026-08-27，真实四技能生产门禁 **77/77 成功**，全兼容干员/两端构筑交叉 **966/966 成功、
0 失败豁免**（早期 65/77、12 阻塞口径已过期）；已进入 v2 默认库，详见
`src/next/application/generatedWeaponsSimulation.test.ts`。全量运行和关键被动数值/寿命差分满足前，
不能把“生成成功”升级为“全武器模拟完成”。

公共事件程序投影必须遵守以下不可退化规则：

- 一个原生 AbilityEvent 下的每条 `SequenceAction` 都是独立注册项，禁止为了少生成对象而拼接成
  一条步骤序列；否则条件短路、优先级和同级注册顺序都会改变。
- 来源事件数组和 `actions` 数组的顺序就是注册顺序。禁止按事件名、武器 ID、Buff ID 或生成 key
  重排；空程序可以删除，其余程序不能合并。
- 原生队列按整数优先级降序，同级按注册顺序执行。当前来源只确认 `Default + priorityOffset 0`
  对应运行优先级 0；完整枚举映射进入 combat-spec 前，生成器遇到其他组合必须失败关闭。
- Buff、武器、装备只负责提供各自的安装与生命周期输入。AbilityEvent 编排、Action/Condition 投影
  和顺序规则属于公共编译层，不允许在三个领域内各复制一套 switch。

正式生成命令不会在第一把失败时中断审计：它逐把收集来源错误，再合并运行投影诊断，全部通过后
才渲染并原子替换目录。正式目录只保存 78 个 TypeScript 文件；机器审计写入被忽略的
`tmp/generated-next-weapons`，`--check` 不读取也不修改审计文件。生成目录已接入唯一最新仓库，
revision 标记为 `endaxis-next-definitions-latest`。Next 尚未发布首个稳定数据版本，不保存旧武器定义，
也不为每次生成差异建立迁移边；差异必须通过来源审计、生成 `--check`、聚焦模拟和代码评审证明。
当前策略见 docs/next/weapon-data-migration.md。

此前第二轮审计修正两把反应光环的接收侧事件身份。`OnBeforeAddedBuff` 在监听 Buff 中的 Source 是监听器
创建者，Owner 是接收敌人，Target 是当前施加者；依据 combat-spec 的 before-output-buff.md、
check-targets-equal.md 和 Buff.BindAbilityEventEnvironment，不得混成物理事件 sourceId/targetId。
公共投影保留 buffSource/buffOwner；当前 205 未审计动作/条件仍阻塞，不能顺手扩大其他事件。
元素适配器已补同一前置事件，真实反应的正反分支、等级两端与伤害差分见
docs/research/weapon-reaction-aura-branches.md。旧哈希只作为审计记录，不对应可运行历史目录。

随后一轮审计修正公共 BuffCount：按增强层数求和，Tag 条件显式保留 Source/Owner/Target，
Save 不再输出 instance；ID 列表按项求和而非去重。旧显式实例数 DSL 保留历史语义。
五把武器重新生成；证据与数值回归见
docs/research/weapon-buff-count-r3.md。已有 966 交叉场景通过不等于全连续排轴通过：
艾维文娜三连携后战技回收枪的 EntityBB_talent0 传递仍缺失，是下一阶段完整干员迁移优先项。

```powershell
npm run generate:game-data:weapons -- --tables tmp/game-data-sources/TableCfg-current `
  --skill-data tmp/game-data-sources/SkillData --buff-data tmp/game-data-sources/BuffData
# 同参数追加 --check 校验确定性输出；审计可通过 --audit-output 指定临时目录。
```

武器静态审计不写中间产物；某把武器失败时仍继续报告其余身份：

```powershell
npm run audit:game-data:weapons -- --tables tmp/game-data-sources/TableCfg-current `
  --skill-data tmp/game-data-sources/SkillData --buff-data tmp/game-data-sources/BuffData `
  --gameplay-tag-catalog src/next/data/combat/gameplayTagCatalog.generated.ts
```

Operator 主动技能库可用以下命令批量审计；任何干员失败都会保留逐项诊断并使进程返回非零：

```powershell
npm run audit:game-data:operators -- --manifest tools/game-data-compiler/config/operators.json `
  --skill-data tmp/game-data-sources/SkillData --buff-data tmp/game-data-sources/BuffData `
  --projectile-data tmp/game-data-sources/ProjectileData `
  --ability-entity-data tmp/game-data-sources/AbilityEntityData `
  --gameplay-tag-catalog src/next/data/combat/gameplayTagCatalog.generated.ts `
  --tables tmp/game-data-sources/TableCfg-current
```

资源获取遵循上文“来源融合与 VFS 替代门禁”的唯一规则，领域编译器再证明实际引用闭包。
不得把 combat-spec 工件目录接成隐式下载来源，也不得在 Operator 配置中手写欠缺模板清单。

ProjectileData 目前提供已解码 `ProjectileComponentData`；AbilityEntityData 只提供已由
反编译和样本共同证实的 `AbilityEntityTemplateData` 逻辑前缀。引用闭包能据此证明模板身份存在，
但不代表未知组件行为已经完成投影；后续领域编译器必须继续显式处理或失败关闭。
AbilityEntity 公共目录会严格保存动态寿命/叠层黑板和 born tags，并只建立精确 tag 倒排索引；
来源父子匹配使用 `source/nativeGameplayTags.ts`，编译出口统一解析为可读路径；本体运行时不依赖此原生索引。
来源审计也兼容 `--gameplay-tag-dump`，但它与 `--gameplay-tag-catalog` 互斥，单份旧 dump 不能代替完整配置集。
`GameplayTagConfig` TypeTree dump 的路径读取、CRC 目录编译、确定性模块渲染和 `--check` 也已进入
本工具；旧 Python 脚本不再参与生成。下载 provenance 同时保存实际内容的字节数与
SHA-256；provider 名称或同一个 URL 不能代替内容版本身份。

`compiler/abilityEntityQuery.ts` 是 owner-spawned AbilityEntity 查询的公共唯一投影入口。它严格区分：

- finder 只从 selector owner 的原生 children 中按 ObjectType 掩码建立候选，不能推导施法身份；
- TagValidator 按同版本 GameplayTag 层级过滤模板 born tags；
- SkillCastIdValidator 单独保留“同一次施法”约束；
- 静态 `candidateTemplateIds` 只是模板目录候选，不能当成场上已经存在的实体实例。

Operator、Weapon、Equipment 若消费相同 selector 结构，必须复用该入口；领域适配器不得再次按
finder 名称、Tag ID 或验证器列表实现自己的查询编译。当前严格切片只接受已闭环的 owner 距离
PriorityFilter、AbilityEntity 掩码和上述 validator；唯一对象掩码例外是已由原生位运算证明恒不命中的
零掩码，它显式投影为空集合而不是 AbilityEntity。后续只能在 combat-spec 已闭环的公共行为基础上逐项扩大。

Selector 后处理器不能只保存类型名或 `maxNum`。公共来源层现通过
`source/selectorComponents.ts` 完整读取 PriorityFilter 的 `filterType`、最高优先级保留开关、显式数量
限制、最大数量，以及 Buff ID/Tag/叠层筛选载荷，并在 TargetSettings、目标组写入和 Merge 输入中
保留同一结构。完整读取不代表已经支持执行：combat-spec 已从原生函数体闭环
`DistanceFromOwnerAsc/Des` 的三维距离权重、降序负权重、显式数量限制和 128 硬上限；公共查询投影
因此按原 post-processor 顺序保存 `distanceFromOwner + order + maxTargets`。该排序只能作用于运行时
children 实例，不能拿静态模板 ID 预先排序。非空 Buff 筛选、最高优先级裁剪和其他排序枚举仍失败关闭。

`ShuffleTarget` 的完整 `BlackboardInt targetNumLimit` 也由公共来源层保存。combat-spec 已证明它先对
普通目标执行正向 Fisher-Yates 全量洗牌，再仅在限量值大于零时保留前 N 项；零和负数不裁剪，
hit-reaction 不参与。公共查询 IR 保留 `shuffle + targetNumLimit`，但不会在静态模板目录上执行随机化；
Unity Random 状态仍是后续运行时边界。

当前 2459 份真实 SkillData 中共收集到 58 个 owner-spawned 目标组写入，公共查询投影严格接受 58 个。
最后一个庄方宜样本还包含 DistanceValidator；来源层现保存完整阈值、比较符与 XZ 开关，不能只因
项目距离投影为零就在 parser 中删除。这个数字只衡量查询 IR 完整，不代表对应技能整体可编译。
主动 SkillData 的公共编译结果现直接保存这些 `targetGroupWrites`，
`compiler/activeSkillAbilityEntityQueries.ts` 只消费该 IR 并生成查询切片，不再扫描原始动作树。
Operator 下载计划允许模板目录为空以发现引用；正式来源闭包若遇到 owner-spawned 查询，则必须显式
提供由同一份 AbilityEntityData 编译的目录和同版本 GameplayTag 注册表，不能导入 Next 生成目录或
隐藏全局状态。定义图中的 AbilityEntity 节点也从这份已编译目录派生，正式审计不会为不同消费者
重复解析原始模板表。
目标组写入自身保存完整 SkillData `sourcePath`；连接器会用公共控制流遍历器验证该路径存在于同一份
已编译动作图，再生成查询切片。调用方不再提供路径前缀，避免把 manifest 项路径和原生动作路径混用。

引用闭包不再维护第二套原生 Action `switch`。`source/actionLeaf.ts` 提供唯一分派和带 scope 的尝试
入口：严格动作编译启用全部已迁移类型，引用闭包只启用会形成定义边的类型；后者对其他动作保留
`untracked` 身份，但引用相关已知动作的字段错误仍失败关闭。目标组不是定义引用，主动 SkillData
通过独立的公共数据流收集阶段保存其时序与动作路径。

当前 `1.4.4@9433094-12` 与现有 manifest 的结果为 30/30 名、309/309 份主动 SkillData 完成
`manifest key → sourceFile → 原生 skillId → 公共定义 → CharGrowthTable.skillGroupMap` 身份闭合；
这只证明主动定义和等级组来源完整，不等于时间轴行为已正式投影。

当前 2459 份 `skill-data-cdn` 真实导出扫描结果：MergeTargetAction 138/138、
PickTargetAction 20/20、SimpleCalcBBAction 159/159 解析成功；ModifyDynamicBlackboard
来源解析为 787/787，其中 785 项是当前可投影的直接写入，另有 2 项敌人技能使用
`directValue=false + calculateType=HpRatio`。后两项是合法来源事实，但执行语义尚未闭环，必须在
投影阶段标为 `blocked`，不能在来源阶段误报 `invalid-source`。
TargetGroup 整树收集的最新 TS 全量结果为 2455 个文件成功、4 个文件阻塞、6558 项写入；
剩余阻塞来自尚未完整闭环的 `InteractiveKeyValidator` 和 `TargetPriorityFilter`。
`ConvertToPosition` 已由静态类型和两个无载荷真实样本确认只需保留处理器身份。
`OwnerPartsFinder` 已根据 1.4.4 静态字段和 6 个同形真实样本保留
`partQuery` 的查询类型与原始 Tag ID；来源层仍不解释部件含义或场景目标。
Condition 的 29 种已取证原生类型均已建立公共 IR；其中 28 种出现在当前真实数据中。
2459 份 SkillData 的 6539 个条件节点全部严格解析成功，0 个字段或形状错误；7 个
`OrConditionAction` 也连同嵌套条件和局部取反闭合。源 IR 仍只保存原生事实，能否在 Endaxis
单敌人场景执行由后续投影层判定，不能把“已解析”误写成“已支持模拟”。未知条件类型继续
携带原生类型和字段路径明确阻塞，不能退化成恒真或恒假条件。
第一批基础 Action 的真实扫描结果为 457/457 成功：`ObtainCostAction` 377 项、
`CreateTimedMarker` 72 项、`AddGlobalCDTimer` 8 项，字段签名均只有一种且全部通过精确字段校验。
Buff 动作在干员 SkillData 中 871/871、武器 SkillData 中 106/106 全部解析成功；全库在补齐
`ShapeFinder` 与 `OwnerPartsFinder` 来源事实后为 2493/2493。`HealAction` 当前 41/41 全部解析成功。这里的闭合只说明来源事实
可读，不代表相关 Buff 或治疗已经能在 Endaxis 场景中执行。
DamageUnit 的 2940/2940 个真实实例已全部严格解析。汤汤水体的 3 个简单计算单元带有不会被
原生简单公式读取的旧 `atkCalculation`，来源 IR 会记录该字段存在，但不会错误读取其中“启用
黑板且 key 为空”的失效值。`ShapeFinderData` 的字段布局和 Sphere/Capsule/Box 参数已有
combat-spec 与反编译证据，因此来源 IR 会保留其 190 个真实实例；但碰撞查询尚未闭环，后续
场景投影仍不得宣称可执行。由此完整 DamageAction 也达到 2620/2620 来源解析成功。TargetGroup
整树收集当前为 2455/2459 文件成功；剩余类型是
`InteractiveKeyValidator` 和 `TargetPriorityFilter`，
与 ShapeFinder 无关。
引用闭包动作的全库来源扫描为：`LaunchProjectile` 2064/2064、`SpawnAbilityEntity` 981/981、
`CastSkill` 92/92。当前 92 个技能调用均使用直接 ID；动态字符串包装仍由公共类型完整表达。
投射物的 block/finish/reach 槽位存在“关闭但残留非空 ID”，引用闭包只允许跟随启用槽位；另有
29 个敌方护盾投射物是“hit 启用但 ID 为空”，来源层原样记录，后续投影必须审计，不能伪造
技能引用。能力实体中 1 个关闭的实体黑板赋值带编辑器空占位，也仅作为非活动序列化事实保留。
全库共有 63791 个 `SequenceActionData`，字段签名完全一致；其中 191 个启用
`onlyExecuteWhenSourceIsMainChar`，9 个启用 `onlyExecuteWhenSourceIsGuard`，没有两者同时启用的
样本。递归控制节点扫描为 `IfElseAction` 4578/4578、`SwitchAction` 48/48、`ForEachAction`
225/225、`ChannelingAction` 1239/1239。Channeling 保留目标、逐帧开关、全局间隔、每目标次数/
间隔及 Tick 子序列，具体触发帧仍由后续时间投影依据 combat-spec 证据计算。这里的成功只证明
来源树可无损读取；尤其根 Sequence 守卫仍必须在场景投影中与普通
子序列短路分开处理，不能让根守卫失败导致整个技能从时间轴消失。
`JumpToAction` 436/436、`TickIntervalAction` 44/44、`NotNextCheckAction` 35/35 也已进入公共
控制流来源树；`TickIntervalActionV2` 9/9 保留三态模式、动态间隔、固定次数、总次数、总时长和
递归 Tick 序列。当前真实 V2 样本只有 8 个 `Interval` 和 1 个 `EachFrame`，`FixedCount` 与动态
黑板路径依据 combat-spec 的机器码证据保留，不能伪称已有资源样本验证。RandomAction 293/293、
FinishOwnerAction 273/273 进入统一叶子入口。跳转方向、随机算法和 Tick 触发帧均未在来源解析阶段
擅自求值。`InterruptCurSkillAction` 虽有 147 个同形
样本，但 combat-spec 尚无对应严格证据入口，因此本轮没有照旧生成器猜写其语义。
统一 Action 叶子入口仍由单一公共分派驱动。此前 23700/23726 的快照包含已被
`OwnerPartsFinder` 取证消除的阻塞，因此不再作为当前门禁数字；剩余已知来源阻塞只落在
`InteractiveKeyValidator` 和 `TargetPriorityFilter`，不是公共分派产生的新差异。
该统计包含 6539 个条件、1259 个黑板/随机/属性快照动作、6688 个 TargetGroup、2620 个伤害、2493 个
Buff、41 个治疗、457 个资源/标记/CD、3137 个投射物/能力实体/技能调用，以及 273 个实体/
Owner 生命周期动作和 219 个时间膨胀动作。
当前导出中的 187 个普通时间膨胀动作把 `timeScaleCurve` 直接保存为关键帧数组，共 288 个关键帧；
反编译字段确认其运行时类型是 `UnityEngine.AnimationCurve`。combat-spec 已同步支持当前关键帧数组与
旧导出器的 `FAnimationCurve` 包装表示，并统一进入同一求值结构。来源 IR 已按当前字段签名
187/187 严格读取；Endaxis 的时间缩放仲裁、时钟与曲线执行投影仍需单独接入，不能把来源可读
误写成模拟执行已完成。

艾维文娜回收枪现建立了第一个严格投射物运行投影：`source/projectileRuntime.ts` 读取 partial
ProjectileComponentData 的首帧相关字段，`compiler/projectileRuntimeProjection.ts` 只接受
combat-spec 已证明的“首帧重叠碰撞 → 同帧 Reach、hitOnReach=false”形状。公共动作序列默认仍拒绝
LaunchProjectile；正式宿主必须显式提供扩展，并从完整 hit/reach SkillData 动作图、模板实体黑板和
版本化时间膨胀优先级目录建立每次发射的独立作用域。该入口不是通用移动/碰撞模拟器，任何延迟回调、
其他移动段或 hitOnReach 形状都继续失败关闭。
2459/2459 份 SkillData 均通过动作图根结构读取，共包含 39529 个时间轴项和 112 个被动事件。
其中 5 个敌方被动事件把 `abilityEvent` 序列化为未命名数值 0，来源层保留该数值而不猜测事件名；
该动作图统计只证明容器、时间和叶子身份可读，叶子进入正式公共 IR 仍以上述统一入口结果为准。
引用图切片当前 2459/2459 份 SkillData 完整成功，共生成 14970 条引用边：8998 条活动静态边、
5902 条关闭残留边、70 条启用但空 ID 的边。技能根引用也保留在同一节点中，活动边指向 1807 个
唯一的带类型定义身份。以 Skill 与 Buff 联合定义仓递归求解时，全部 2459 个 Skill 根可带入
1112 个 Buff；仍缺 3 个 Skill 与 6 个 Buff 定义，继续作为 `missing` 诊断，不能按 ID 拼写补定义。
AbilityEntity 与 Projectile 的定义索引尚未接入，因此本阶段只保存其引用身份，不宣称闭包完整。
BuffData 现已复用同一 Sequence、Action 叶子和引用边入口，而不是建立 Buff 专用动作编译器。
2678 份 `buff-data-current` 已全部完整读取，包含 624 个时间轴项和 3109 个 Buff/能力/点燃事件；
其中数值型能力事件继续保留原始整数，不猜测枚举名称。共收集 2338 条引用边：1909 条活动静态边、
383 条关闭残留边、24 条动态边和 22 条启用但空 ID 的边；按类型为 Buff 1588、Skill 539、
AbilityEntity 110、Projectile 101。
SkillData 与 BuffData 已可转换为同一种定义节点并交给纯闭包求解器，下一步接入 AbilityEntity 与
Projectile 定义容器，随后才能对选定干员、武器或装备根给出完整且可解释的递归闭包。
当前本地证据只有 `AbilityEntityTable`/`AbilityEntityTemplateData` 的静态字段与运行时查表链，尚无
模板资产；Projectile 定义资产同样未导出。联合闭包因此明确报告 144 个唯一 AbilityEntity 目标和
359 个唯一 Projectile 目标缺定义，而不会拿旧版模板、SkillData 文件名或 ID 命名规律伪造节点。
完整 SkillData 中的 295 个被动定义已全部通过同一公共入口：282 个 `AddBuff`、13 个
`ToggleBuff`，合计 176 个启动 Buff、92 个条件 Buff 组、96 个时间轴和 112 个被动事件。
其中 136 个定义携带 180 项 `cardAttributeModifier`；公共 IR 保留修正目标、属性、公式槽和
黑板数值来源，不把 CardSkill 静态面板路径与战斗被动 Buff 生命周期混为一谈。
`ToggleBuff` 使用的 25 个 `CheckCurHpRatio` 均保留比较枚举与 Scalar 来源；生命比例读取和比较执行
尚未在场景投影闭环，因此这里只能标记来源可读，不能标记模拟已支持。
当前 278 个 `PotentialTalentEffectTable` 效果包的 603 个联合载荷可由发现入口扫描，得到 36 条
`AddPassiveSkill` 请求、15 个唯一被动 SkillData；其中 28 条请求携带输入黑板。一个效果包可按表内
顺序产生多条请求，`levelSource=nativeDefault` 保留原生没有设置 CreateSkillOptions.level 的事实。
当前 77 个 `WeaponBasicTable` 武器产生 226 条请求、117 个唯一 SkillData，全部能在完整 SkillData
仓中找到定义。发现层不根据 ID 前缀区分属性词条或武器特效，也不提前解析其行为。
全量武器成长审计覆盖 31 条基质定义、1925 组真实突破与潜能组合、5650 个技能槽结果，当前
0 失败。5 件三星武器的两项技能合法消费三项模板边界中的前两项，尾部 `(0, 0)` 是未引用占位；
该边界已同步回 combat-spec 并由两边测试固定。
基础攻击成长另覆盖 77 把武器、9 条实际引用模板和 6930 个等级行，精确等级修正 6930/6930 成功；
77 个 91 级缺行探针全部返回空。当前基础攻击运行值范围 29–510 仅作为 1.4.4 审计事实记录。
当前 23 个 `EquipSuitTable` 套装产生 23 条阈值请求、23 个唯一 SkillData，全部能在完整 SkillData
仓中找到定义。发现层不使用显示名，不把当前样本中的 `equipCnt=3` 或 `skillLv=1` 当成固定规则。
当前固定版本的 243 个 `EquipTable` 单件装备与对应 `ItemTable` 身份全部严格读取，合计 1012 条属性修正；
`attrIndex` 为 0–3，当前值表均为四档，目标模式为 `Specific/Main/Sub`，公式槽为四类基础槽。
这些只作为 1.4.4 全量审计结果记录，解析器不把当前取值集合固化为规则。
正式定义组装同样达到 243/243、0 blocked：73 件护甲、65 件手套、105 件配件，共 672 条可见词条、
721 个正式修正；另有 48 条只影响玩家承伤的原生修正按当前木桩模型记录为 `scenario-omitted`。
三类入口联合后共有 285 条安装请求、155 个唯一被动 SkillData；公共批量入口已在真实 1.4.4 数据上
完成 155/155 编译。共享定义中 125 个携带 169 项 CardSkill 属性修正，另有 46 个启动 Buff 和
85 个 Toggle 组；这些是同一 SkillData 的不同原生消费路径，后续投影不能只保留其中一类。
