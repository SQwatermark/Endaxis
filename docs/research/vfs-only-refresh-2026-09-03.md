# VFS-only 来源刷新实机验证（2026-09-03）

> 本文是 VFS-only 历史对照实验，不是当前生产来源策略。2026-09-03 用户已决定恢复
> AKEDB 优先、VFS 补缺；当前权威规则见编译器 README。下文的转换器数字枚举适配也是历史步骤，
> 后续目标是由 VFS 从同版本 metadata 自动导出名称，转换器直接读取名称。

## 验证边界

正式定义仍以 `3b187292` 恢复的可信基线为准。本次验证来源获取、角色模板接口和全量图片导出，
不把成功下载等同于干员可完整生成或可模拟；未覆盖正式定义，也未修改游戏规则。

台式机 `Admin@100.64.0.64` 在线且公钥认证成功。此前会话/传输超时不能解释为密钥失效。
VFS 的 `1f6cb60` 加本机接口及 float32 补丁在独立工作树
`D:\Temp\vfs-character-validation-20260903` 构建，以 localhost:8766 验证；原有 8765 服务未替换。
两轮验证使用不同输出目录、不同缓存目录和 8 / 3 workers，服务均在任务结束后关闭。

## 完整来源快照

两轮目录：`D:\Temp\endaxis-vfs-character-20260903`、
`D:\Temp\endaxis-vfs-character-20260903-repeat2`。第一次 repeat 因未等服务 ready 而连接被拒绝，
没有完整 provenance；补上 readiness 检查后用新的 repeat2 目录重跑，不复用失败输出。

| 集合 | 条目数 |
| --- | ---: |
| TableCfg-current | 18 |
| SkillData | 2621 |
| BuffData | 2872 |
| ProjectileData | 471 |
| AbilityEntityData | 215 |
| CharacterData | 32 |
| GameplayConfig 固定文件 | 1 |

合计 **6230 条受管输入**。两轮完整快照哈希一致：

`a430238c373b9a137f7d17345837907e9b4911a431e07f2f3978294cd71b7e9c`

首轮 ZIP SHA-256：`f7abbb1c4fbfb0308869e4cdf27d638a08cb9348684532c7fba2d546a9387934`。
32 份角色模板独立打包 SHA-256：
`a4a852a21e0f27253f3bdc7b2602342dff471a19e65066548427fcc70ac8f9f8`。
完整 ZIP 已取回本机并验证，解包到
`tmp/vfs-current-verified-20260903/endaxis-vfs-character-20260903`；6230 文件大小、SHA 和整批哈希
均在本机再次通过。后者也已取回验证，进入隔离的 `tmp/vfs-character-fields-20260903`。

## float32 差异核验

与此前真实 VFS 快照 `f0a06f7a77aee8ae555e3a969ec46d6f13e4bd0850f4883cd334aecb7f84702d`
逐文件比较：3253 个文件字节不变，2945 个文件变化，新增 32 份角色模板，没有移除文件。
2945 个变化文件的 **87,749 处数值变化重新编码为 binary32 后全部一致**，没有其他结构或数值差异。
这验证了该批 f32 修复的表示变化范围，不能推广为任意新版本数据都不会改变规则。

检查同时重算首轮 6230 个文件的大小/SHA-256 和有序条目清单哈希。远端机器报告：
`D:\Temp\vfs-character-refresh-audit.json`，本机取证脚本：`tmp/verify-vfs-refresh.ts`。

## CharacterTemplate 并非自动放行

新模板已由现有 Endaxis 解析器完成 30 名正式干员的解析（按各自配置决定是否读取连携条件），
未增加新的条件解释器。但 30 名干员的原始资源 SHA 均不同于当前生成配置的锁定值，必须继续审计。

本机旧 CharacterData 工件虽然 SHA 匹配配置，却有 21 名的条件引用仍为旧的未完整解码形态，
不能拿这些本机旧工件冒充可完整复现的基线。其余 9 名中，剥离类型明确分离的 `referenceSources`
取证表后，8 名的已解析行为字段一致；汤汤有实际字段差异：新增
`chr_0027_tangtang_normal_skill_abilityentitymove` 主动技能登记，旧模板中的第三条连携条件不再存在，
另有 serverActionIndex 变化。这里仅记录原始差异，不据此推断游戏含义或修改连携规则。

不得只批量替换配置 SHA 来消除门禁；后续应使用临时候选 manifest 诊断生成变化，保留正式 pin，
再逐类核对有影响的字段和完整 Next 回归。

## 公共来源适配恢复进度

真实快照的 30 名整名 `--check` 首先全部停在 `castType: expected string`，尚未到模板 pin 门禁。
整批回退同时撤掉了 b821 中必要的原生格式适配；不能因此重新引入该提交的全部语义变化。

本轮直接从 1.4.4 metadata 核实两个工厂判别枚举，并在 combat-spec
`docs/passive-skill-dispatch.md` 补齐常量、字段 token、metadata SHA 和提取命令。
Endaxis `source/skillDispatch.ts` 是这两个判别值唯一读取点，主动入口、被动入口和根 Buff 引用
闭包共用；数字与命名表示产生相同结果，未知值失败关闭。活动技能不解释无效的被动类型残留。
未改运行时、生成定义或 Buff 静态上限规则。

该阶段回归：编译器 **117 文件 / 1130 项全绿**，`type-check:game-data` 通过。重新诊断 30 名，首个
阻塞统一前进到 SkillData 字段集合检查：新来源比当前字段白名单增加 `buffInputBase`、
`canCastInWater`。下一步要按原生字段及消费者证据分别判断，不能仅加白名单忽略行为。
报告 `tmp/vfs-operator-after-dispatch-check.json`；该诊断沿用已检入派生目录，报告显式标记
`endToEndVfsOnly: false`，不能声称新源 30 名已经生成通过。

### 后续：根字段与公共动作头已恢复

已远程读取当前客户端的 Normal dump 和运行时模块，并按当前 RVA 核对 `Skill.CheckState` 主函数
与异地分支。证据统一保存在 combat-spec `docs/skill-state-checks.md`，不是从字段名推断水中规则。

- `buffInputBase`：独立多态字段，当前 2621 份均为空。来源 IR 保留显式 null，旧来源缺字段仍保持
  缺字段；任何非空载荷都阻断，不猜成 `buffs` 的另一个写法。
- `canCastInWater`：严格布尔值，来源 IR 保留 true/false。已检查的当前 CheckState 没有读取该字段，
  不代表全游戏没有消费者；未新增水中模拟或水中施法拒绝规则。
- 其余未知/缺失字段仍由精确结构门禁拒绝，不开放任意扩展字段。
- `Outer.Data / Outer.OuterData` 与 `Outer+Data` 在公共动作名读取器归一化，原始 nativeType 仍保留；
  不把任意 `*Data` 都当成某个已支持动作。
- 当前 79749 个 SkillData 动作的 priorityLevel 都是 0，恢复 `0 → Default`。旧 metadata 的非零常量
  实为 `High=100 / Low=-100`，当前版本尚未核实，未恢复 b821 的 `-1/1` 映射；非零整数仍拒绝。
  精确常量及 token 见 combat-spec `docs/ability-event-action-ordering.md`。

最新回归：编译器 **117 文件 / 1143 项全绿**，`type-check:game-data` 通过。
30 名整名诊断均越过根结构/动作头，首个阻塞分布如下（不是所有深层问题的总数）：

| 首个阻塞类型 | 干员数 |
| --- | ---: |
| LaunchProjectile 新字段 | 10 |
| Selector 嵌套类型名格式 | 10 |
| TargetSource 数字枚举 | 5 |
| SpawnAbilityEntity 新字段 | 2 |
| 黑板 directValueType 数字枚举 | 2 |
| deadOption 数字枚举 | 1 |

报告：`tmp/vfs-operator-after-action-header-check.json`。下一步按公共来源类型逐类恢复，优先纯格式
归一化，再核对新增载荷消费者；不按干员加特判。不批量更新 CharacterData pin，也未覆盖正式产物。

另发现当前 CheckState 的 `canCastInAir` 会跳过 readyToAir 区间，与 C# 所依据旧版行为不同。
已记录为版本化迁移待办，未在来源恢复时夹带运行时语义变更。

### 后续：目标来源编码归一化

已复核 metadata 精确常量和字段类型归属，依据保存在 combat-spec `docs/target-resolution.md`。
公共 `source/targetEnums.ts` 统一持有 TargetSource、ActionTargetType、DirectionType、FactionTarget
和 HitBoxFinder.TargetObjectType；目标引用、FindTarget/ContinuousFindTarget、CreateBuff 与 Unity
连携 RID 适配复用，不新增第二套目标解释器。泛型读取原语移至 `primitives.requireNativeEnum`，
Skill 工厂判别也复用同一实现。

- Selector 的 `Selector+Finder+Data` 和 `Selector.Finder.Data` 统一，但必须保留 Selector 宿主身份，
  未知类型和未知枚举仍失败。
- 非搜索目标中 `finderData:null` 与省略形式统一；InstantSearch 缺少 finder 仍失败，不能变成空候选。
- HitBoxFinder 对象类型的 1/2/4 是其独有枚举，不能与通用 Entity ObjectType 混用。
- 纠正测试中的非原生 Group/SkillOwner、FactionTarget=Enemy、HitBoxTarget=Character；非法名称
  新增拒绝回归，合法样本改为 Owner、Anti、Normal。不是修改正式游戏数据来迁就测试。

最新真实整名诊断 `tmp/vfs-operator-after-shared-targets-check.json`，30 名仍未完整通过：

| 首个阻塞类型 | 干员数 |
| --- | ---: |
| Buff 图标时长来源缺少旧导出的 m_* 说明字段 | 13 |
| LaunchProjectile 新字段 | 11 |
| SpawnAbilityEntity 新字段 | 2 |
| 黑板 directValueType 数字枚举 | 2 |
| deadOption 数字枚举 | 2 |

这些是第一失败点分组，不是未支持行为总数。下一步先核对旧导出说明字段与原生载荷的区别、
黑板/生命周期枚举，再处理投射物和实体新增载荷。正式定义、角色模板 pin 和图片仍未覆盖。

本阶段门禁：编译器 **118 文件 / 1162 项通过**，`type-check:game-data` 通过。新增测试覆盖完整
目标引用/查找动作/Buff 来源的数字与命名等价、非连续枚举、未知类型、null finder 与非法名称。

### 后续：Buff 赋值、图标来源与控制枚举

公共来源解析已恢复下列编码，不变更正式数据、运行时规则或 CharacterData pin：

- `DataPair.ValueType` 按精确 metadata 读取 Numeric=0 / String=1；已知 Any=2 继续明确阻断，
  不是把枚举存在当成当前协议已支持任意对象值。
- `BuffIconDurationSourceSetting` 的 MemoryPack wrapper 确认只有两个公开字段，旧 JSON 还附带
  两个私有说明字段。统一接受已核对的两种完整布局；未知字段、只出现一个说明字段、非法值仍失败。
  Unity 连携 RID 适配改用同一解析器，删除手工补造的说明文本和重复枚举表。
- ControlledStateDeadOption / AbilityAction.ReturnTrueMethod 归 `source/controlEnums.ts`，
  物理异常与木桩控制动作共享读取，不混同各动作的真实执行/返回策略。测试中非原生 `NotDead`
  改为确切的 `OnlyAlive`；未知枚举的拒绝另有回归。

证据位于 combat-spec `docs/buff-assignment-source-encoding.md` 与既有 `docs/knockdown-action.md`。
最新真实整名诊断：`tmp/vfs-operator-after-buff-encoding-check.json`，30 名仍未完整通过：

| 首个阻塞类型 | 干员数 |
| --- | ---: |
| LaunchProjectile 新字段 | 13 |
| DirectionSettings.DirectionType 数字枚举 | 10 |
| SpawnAbilityEntity 新字段 | 2 |
| BuffSettings.checkType 数字枚举 | 2 |
| rootMotionDirectionType 数字枚举 | 1 |
| operationType 数字枚举 | 1 |
| Aura 新字段 | 1 |

这是逐干员第一失败点，不是全量剩余缺口统计。下一步先按完整原生类型补齐枚举读取，
再追踪投射物/实体/Aura 新载荷。特别是 `Core.DirectionSettings.DirectionType(+0x10)`，
其原生嵌套类型不同于已接入的 `Gameplay.DirectionType`，不得因字段同名复用常量。

本阶段门禁：编译器 **119 文件 / 1196 项全绿**，`type-check:game-data` 通过。
新增数字/名称完整 IR 等价、旧/新图标布局、未知枚举、Any 拒绝与木桩控制共用读取回归；
本轮没有修改 Next 运行时或覆盖正式产物，不能把来源回归计为新版资产模拟已通过。

### 后续：空间方向与挂点编码

已依据 combat-spec `docs/spatial-source-encoding.md` 恢复：

- 高级方向独立六项枚举，不与普通方向五项混用；MountPoint 支持精确非连续常量。
- SelfRotate 的 RotateType、RotateDirectionType、RootMotionDirectionType 分开读取，后两者
  使用有符号 -1/1，根运动不支持 Free=0。没有改变旋转动作的既有场景投影。
- 未自定义方向的显式 null 引用与省略引用统一；启用自定义方向仍必须有完整有效引用。
- TargetPostProcessor 的重复方向类型/解析代码删除，复用 `AdvancedDirectionSource` 和公共解析器。

最新报告 `tmp/vfs-operator-after-spatial-encoding-check.json`：30 名仍未完整通过，但已全部越过
上轮首个方向/旋转枚举阻塞。首个失败分布：LaunchProjectile 新字段 15、SpawnAbilityEntity 新字段 3、
Aura 新字段 3、operationType 数字枚举 3、BuffSettings.checkType 数字枚举 2、RootMotion 新字段 2、
Selector PriorityFilter 新字段 1、目标组合 mergeHittableTargets 新字段 1。

下一步按完整原生字段类型核对剩余查询/操作枚举，再审计新增字段消费者；不能因为当前场景保证
命中，就在来源解析时无条件丢掉字段。仍沿用基线派生目录，不是端到端 VFS-only 生成结论。

本阶段门禁：编译器 **120 文件 / 1229 项全绿**，`type-check:game-data` 通过；新增 33 项测试
覆盖不同枚举身份隔离、非连续/负数值、空引用边界以及目标后处理的完整 IR 编码等价。
正式干员定义、CharacterData pin、Next 运行时与图片未改。

### 后续：Buff 查询与目标转换编码

- 新 `source/buffFindSettings.ts` 是 BuffFindSettings 的唯一结构/枚举解析入口。Buff 动作、条件、
  Selector 和智能选目标共用；旧 `buffActions.ts` 导出仅转发。条件滤空与筛选非空 ID 限制保持不变。
  Unity RID 的同类型 CheckType 映射改用公共读取器；其他同名但不同原生类型的条件字段没有批量替换。
- ConvertToTargetContext 按原生完整 0–7 映射后仍检查既有支持子集；已知 TranslatePosition 等
  未支持操作保持报错。translationRef/excludeTarget 复用 ActionTargetType，None 分支的未消费
  参数仍校验和保留。combat-spec 同步枚举 token，并纠正旧文 excludeTarget 字段偏移 +0x30→+0x40。

新报告 `tmp/vfs-operator-after-query-encoding-check.json`：30 名仍未完整通过，已越过上一轮
BuffSettings.checkType 和目标转换 operationType 首错。首错分布：投射物新字段 16、实体新字段 3、
Aura 新字段 3、RootMotion 新字段 2、Selector 后处理新字段 2、目标组合新字段 1、条件内目标
来源编码 2、spellStatusType 编码 1。不是所有深层缺口的计数，也不是端到端 VFS-only 生成通过。

下一步核对剩余条件来源编码及 Selector 新字段的继承归属，再集中处理投射物新增载荷，
不以通用忽略未知字段代替原生消费者审计。正式定义、模板 pin 与 Next 运行时未修改。

本阶段门禁：编译器 **121 文件 / 1255 项全绿**，`type-check:game-data` 通过。新增 26 项测试
覆盖 Buff 查询四种模式的完整载荷、条件滤空与筛选非空边界、非连续目标转换编码、未支持空间
操作拒绝和 None 分支未消费参数保留。生产依赖边界门禁也已重新通过。

### 后续：条件编码与当前 Selector 字段取证

- 条件的精简目标字段改用已有 TargetSource 读取器；实体数量/Buff 数量比较与 Unity RID 适配
  共用 Beyond.CompareType。BuffStackNumType 在条件、读取动作、Selector 与 RID 适配中统一。
  没有扩大条件目标 IR 字段或改变目标选择策略。
- ForceSpellStatus 的 spellStatusType 确认为 EnergyShardType，按 Fire=0/Pulse=1/Cryst=2/Natural=3
  读取，不与 Physical 起始的 DamageType 混用；Enum=4 仍拒绝。
- 台式机 SSH 可用，已读取当前原生 Selector 声明及 PriorityFilter 机器码。processTargetType
  分别属于 PriorityFilter、ExcludeTarget、ShuffleTarget 的具体 Data，不是基类字段；当前 PriorityFilter
  在 `0x03E2A770` 实际读取它并传给后续过滤参数。不能忽略。精确枚举数值、普通/可受击集合分支
  尚待继续取证，来源白名单未放开。证据同步至 combat-spec `docs/selector-pipeline.md`。
  当前 runtime 镜像位于 `D:/Projects/vfs-index-browser/tmp/il2cpp-current/IL2CPP_GameAssembly.runtime.bin`，
  不在 dump 的 `IL2CPP_Dump_Normal` 子目录中；本轮仅远程只读诊断，未启动或替换服务。

最新 `tmp/vfs-operator-after-condition-encoding-check.json`：30 名仍未完整生成；首错为投射物新字段
16、实体新字段 3、Aura 新字段 3、RootMotion 新字段 2、Selector 新字段 2、目标组合新字段 1、
teleportType 编码 3。已越过上一轮条件目标来源与 spellStatusType 首错；仍不是深层缺口总量。

下一步追踪 Selector 的目标集合分支，并核对瞬移枚举；之后集中恢复投射物新载荷。
原生新字段是否可省略须在消费行为证据闭环后判断，不把“模型保证命中”当作来源解析放行条件。

本阶段编译器 **122 文件 / 1283 项全绿**，`type-check:game-data` 通过；新增 28 项测试覆盖
条件完整 IR 的编码等价、未知枚举拒绝、EnergyShardType 与 DamageType 隔离。正式数据未覆盖。

## 全量引用图片

在 `D:\Temp\endaxis-icons-validation-20260903` 的隔离 Endaxis 工作树（`b8212cb3`，仅用于覆盖
包括 Typhoeus 在内的全部引用）运行当前图片导出器，指定 `--overwrite` 和独立 `--output-root`。
**724 张原生图片强制重导 + 4 张本地占位图，0 失败**，并非跳过已有图片。

结果：`D:\Temp\endaxis-icons-reexport-20260903/public`，逐图来源/原图哈希/WebP 哈希见同目录的
`audit.json`。ZIP SHA-256：`d9867f15741adb2ae8331e39375daf0bc7ca6dbc86d26b0c1a9fe0742c0ac9d8`。
ZIP 已取回并验证，解包到 `tmp/icons-verified-20260903/endaxis-icons-reexport-20260903/public`，
728 项输出逐图核对审计。与本机 public 比较：80 项字节相同（含 4 占位）、5 项仅编码不同、
640 项像素不同、3 项本机缺失。其中 602 项尺寸不同，例如旧 256×256 装备图变为 Sprite 裁切尺寸，
不能声称只是编码噪声。诀立绘抽查也有可见内容变化。导出器本身只无损转 WebP，没有 resize。

缺失的三项是 `icon_battle_buff_wpn_funnel_0019.webp`、`wpn_artsunit_0019.webp`、
`wpn_artsunit_0020.webp`。像素/尺寸报告：`tmp/icons-pixel-verification.json`。
新图片仍隔离保存，尚未批量发布：先验证原始 Sprite 裁切语义和现有 UI 固定尺寸布局的兼容性。
不能把这次图片成功当作 Typhoeus 定义通过门禁，也不复制隔离工作树的运行时代码。

## 尚未闭环

- 新来源对 30 名干员的整名生成差分、来源锁定更新和全量模拟回归。
- GameplayTagConfigSet、SkillSetting、GlobalBuff 等独立 Unity 配置是否完整进入同批受管输入。
- 本地化 Python 导出仍读取 AKEDB；图片任务用 `--skip-rich-text-refresh` 仅生成本地图标清单，
  没有联网刷新该入口，但完整本地化还不能算作 VFS-only。
- 新接口及修复的正式版本发布；当前只部署了独立验证服务。
- Typhoeus 的生成膨胀与非正静态 Buff 上限冲突，继续遵循既有证据边界。
