# 新套装与公共全局冷却、爆发 Context 补齐

## 来源与边界

- 来源仍为 AKEDB 优先、VFS 补缺，使用 `run-dYAF19` 的完整 hybrid 快照
  `3c85bb1596f73d384403bdfe35f576b1ffb00beafcb13fe502fdc8154fd3331c`。
- 整批选定版本为 `1.5.3@9885010-4`；AKEDB 资产索引中的单文件版本独立记录。
  `buff_equipsuit_spellburst_01.json` 来自 AKEDB，资产版本为 `1.5.3@9764758-3`，SHA-256 为
  `9637c59c3095ac626d544d802e154b9ddb6021ce0042a2378b09fea2e1b1eda9`。
- 运行事实依据 combat-spec 的 `global-timed-marker.md`、`check-spell-infliction-type.md` 与
  `origin-skill-event-context.md`。后两份已确认爆发前事件也使用 SpellInflictionContext。
  证据属于 1.4.4 未补丁主干，本次没有重做 1.5.3 机器码或 IFix 取证。
- 候选试编译和模拟显式借用可信基线 GameplayTag、公共 Buff/SkillSetting；不等于全资源同批重建，
  不发布候选，不恢复此前回退的 VFS-only 资产。

## 修复的公共问题

1. 全局冷却检查把 Owner 无条件写成 caster，动作写入却要求固定 BuffOwner，两者不一致。
   现由同一 `projectGlobalCooldownTarget` 解析 Owner/Source，保存 caster、buffOwner、buffSource；
   带目标组、未知宿主及已知非角色目标仍阻塞，不写领域特例。
2. 原先把 AddGlobalCDTimer 转为普通 CreateTimedMarker，混用了命名空间及重复 ID 行为。
   公共协议新增 `setGlobalCooldown` / `globalCooldownPresent`，运行时全场共用独立目录，按角色/ID
   刷新剩余时间。使用未受角色膨胀影响的战斗帧时钟，不随动作结束移除；普通标记行为不改。
   期限比较复用已取证 epsilon，零时长新项同帧存在、下次时钟推进清理；仍是 Endaxis 帧离散投影。
3. 候选可生成后，真实模拟发现新套装始终不触发：元素条件只识别附着事件，不接受爆发前事件。
   先修复 combat-spec 的 `CheckSpellInflictionTypeAction`，再让 Endaxis 共用同一 mask 匹配及
   savedKey 的严格读取、epsilon 比较和写回；不另造爆发专用条件。

新协议同时接入严格校验、技能编译、标准模拟装配和编辑器。编辑器明确区分“设置全局冷却”与
“创建定时标记”，提供角色/持有者/来源选择；不改变技能库卡片文案或旧版行为。

## 候选与实际模拟

- 24 个套装候选、43 份 Buff 定义、25 项木桩省略诊断；相比正式基线，新增
  `suit_spellburst`，旧套装只有 `suit_phy01` 因全局冷却公共协议改变，另有索引变化，无删除。
- 实机定向测试 28 项：一个编辑器工厂契约检查、24 个真实三件套装配/爆发场景、三个新套装元素差分。
- 新套装 Cryst/Natural 路径触发，Pulse 不触发；四个时刻各作同帧重复附着，只发生四次增益施加。
  第四次挤掉最早的 Stack 实例，剩余三个独立实例各存活 20 秒，不是一个 enhanceCount=3 的实例。
  第一次爆发伤害就高于移除该套装运行效果后的对照，确认前置事件收益参与本次结算。
- 通用冷却回归覆盖刷新延长/缩短、不同角色/ID 隔离、普通标记同名隔离、动态时长、动作结束、
  未推进的角色局部时钟及到期 epsilon。源侧/持有者不靠事件 target 或 caster 回退。

复跑（需已有完整来源；无环境变量时只运行便携工厂检查）：

```powershell
$env:ENDAXIS_GEAR_SET_REBUILD_REPORT = 'D:\Projects\Endaxis\tmp\game-data-rebuild\run-dYAF19\report.json'
npx vitest run tools/game-data-compiler/test/rebuiltGearSetCandidate.test.ts --maxWorkers=2
Remove-Item Env:ENDAXIS_GEAR_SET_REBUILD_REPORT
```

## 后续

下一阶段优先将同批 GameplayTag/模板输入接入重建入口，再推进 79 把武器、新干员和其余公共依赖。
既有正式产物中的旧冷却协议要随已审计的重生成替换，不能靠运行时猜 ID 或批量文本替换迁移。
本轮没有修改正式生成目录，故新套装尚不出现在用户配装列表里。
