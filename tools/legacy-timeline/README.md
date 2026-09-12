# 旧时间轴离线转换工具

当前阶段：独立转换入口及映射配置已建立，多条真实轴已转换并通过运行检查，
不是完整旧格式兼容器，也没有接回产品打开入口。

## 使用

在仓库根目录执行：

```powershell
npm run convert:legacy-timeline -- "C:\Users\sqwat\Downloads\Endaxis_Timeline_2026-08-31.json" tmp/converted-axis --mappings tools/legacy-timeline/mappings.example.json
```

输出目录必须不存在，父目录须存在。只写新目录，不覆盖旧存档。
成功输出 project.json 和 report.json；有遗漏/目标校验失败只输出报告并以非零状态结束。
示例配置只演示字段。旧版 2026-08-31 数据快照统一使用 mappings.2026-08-31.json；
依据、告警与未验证边界见 [映射及运行检查](mapping-evidence.md)。
同一映射文件也包含官网“别赛羊诀”扩样；筛选、身份依据和未解决差异见
[公开轴检查记录](public-share-evidence.md)。成功转换不等于新旧模拟结果一致。
未传配置可用来发现未映射内容。

## 模拟审计

伤害对照可使用正式模拟入口生成离线审计（输出请放入被忽略的 tmp）：

```powershell
node --experimental-strip-types tools/legacy-timeline/auditSimulation.ts tmp/converted-axis/project.json > tmp/simulation-audit.json
```

分别重算存档结束线和完整时长，输出总期望伤害、完整 sourceId 分账及结束线后的命中。
逐条伤害保留技能类型、伤害类型、法术爆发类型、Buff ID、动作来源及回执已有的攻击力、技能
倍率、基础伤害、最终攻击值、计算路径、伤害乘区、抗性乘区、暴击率、暴击伤害、暴击结果、
期望与实际伤害；分账包含零伤害、无 castId 和无来源
（null）的公共伤害，不把不同轨道或能力实体猜成同一来源。复合状态等后续伤害可能没有 castId，应使用
`buffId` 和 `sourceActionId` 继续核对，不能据此断言原施法漏伤害。
`diagnostics.castIssues` 按完整 `castId` 汇总旧坐标直接换算后在当前原生门禁下失败的输入。
公开分享轴能够在旧版完成，原则上应视为可行排布；这些提示通常说明两版动画长度、命中停顿、
时间膨胀或窗口精度不同，不能据此判定旧轴错误。比较伤害前应先对提示附近的输入做小范围时间
校准，再比较相同衔接下的命中和状态。未经校准的后续输入还可能替换同模板能力实体，截断此前
技能的长时产物，因此不能把未列入 `castIssues` 自动视为可直接比较。
这些是当前模拟回执的账目，不是新旧命中已一一对应或游戏行为已经核实的证明。

## 映射配置

`mappings.2026-08-31.json` 是针对旧版数据快照一次性生成、再人工核对少量例外后的完整目录，
不是随着每条待转换时间轴逐项补充的清单。它目前覆盖 30 名干员、77 把武器、243 件装备、
82 个敌人和 299 种可直接转换的技能存档身份。转换新时间轴时应先直接使用这份文件；只有旧版
数据定义本身发生变化，才需要重新整理整份映射。

批量配对依据如下：干员使用稳定 slug；武器优先使用图标中的原生资源 ID；装备使用英文原生
名称并以资源 ID 复核；敌人使用 gameId；技能从旧版技能定义枚举实际存档身份，再按新版技能组
和技能 key 匹配。资源 ID 重复、技能改名或技能结构改变时才人工指定目标。

伊冯旧版 `enhancedBasicAttack` 是一个包含整套强化普攻的技能块，新版对应可递归分叉的技能
序列，单条映射无法无损表达。它故意不在目录中，遇到时转换会阻塞，后续应由专门的结构转换
处理，不能填成 `ultimateAttack1` 来绕过检查。

- operators：旧干员 ID → 当前 operatorSlug。
- weapons：旧武器 slug → 当前原生武器 ID。
- gears：旧单件装备 ID → 当前单件装备 ID；不按套装名或图片相似度猜测。
- enemies：旧敌人 ID → 当前定义 ID，按定义的 gameId 核对；未知敌人禁止静默降级为普通敌人。
  保留存档战斗数值覆盖，但身份、图标与战斗分类取已匹配定义。
- skills：按**旧干员 ID**分组的规则数组，每条包含 source 和 target。
  source 精确匹配 skillId、sourceSkillKey、type、segmentIndex、variantKey；
  缺省字段表示旧动作中也未提供，不是通配符。target 是当前项目的技能引用。
  段号和变体必须逐项确认，不能将换槽、强化、自定义动作默认为基础技能。
- actions：按“方案ID/轨道下标/动作下标”的单动作覆盖，优先于 skills；
  仅供明确核对后的例外映射，不依赖可能重复的旧 action.id。
- guardedActions：当方案ID是default_sc等通用值时，同时精确匹配path、旧operator、
  instanceId和source技能身份，再使用target。实例ID不是单独的匹配依据；不匹配时
  仍走普通技能映射，多条命中或与actions冲突显式报错，避免污染其他分享轴。

不得把缺失身份自动变成默认配装或删除技能后宣称成功。
映射只解决身份，不证明新旧版本行为或数值相同。

## 边界与实现来源

projectConversion.ts 的输入字段搬运以历史提交 9ec608cc 的迁移器为起点，
仅保留在本工具内；不恢复旧游戏代码或运行时。
sourcePreparation.ts 单独规格化时间及映射；convert.ts 调用当前正式项目/游戏数据校验。
CLI 用无监听、无 HTTP 服务的 Vite 模块加载当前仓库。

- 支持 version=1.0.0 的 scenarioList，frame 单位必须有有效 fps；
  未标单位按旧 timeSerialization.ts 的秒存档约定处理。
- 只量化实际搬运字段：直接由源帧换算到当前 PROJECT_FPS，报告保留误差。
  绝对时刻先减去原始 prepDuration，以开战为 0；时长不平移。报告 sourceOrigin 记录这一变换。
  `logicalStartTime` 是旧编辑器保存的手工排布时刻，`startTime` 是经过全局停帧平移后用于
  旧编译和模拟的时刻。两者不同时保留并分别换算，迁移技能落点采用 `startTime`；这项结论
  只说明旧存档格式，不作为当前战斗时间规则的证据。
- 养成、配装、输入坐标和场景配置转换；旧 hits、Buff、面板及伤害快照不搬运。
- 转换完成前使用当前干员定义、养成和构筑编译终结技能量上限；旧初值超过当前上限时阻塞，
  不静默截断，也不生成无法运行的项目。
- 旧连接只迁移两端都能唯一对应技能块的 action-to-action 连接。引用 Hit、效果或缺失技能块的
  连接显式阻塞；不根据旧派生 ID 猜测当前内部节点。
- 非空覆盖定义、继承状态、合约、全局修正暂不支持，显式阻塞。
- 切入标记按旧 characterId 唯一匹配源轨道后再转换身份；未知或冲突目标阻塞，不能静默丢弃。
  准备期切入目前不受当前项目支持，负帧会明确阻塞，不夹到开战时刻。
- 使用当前游戏定义重算；这不是旧版本模拟器复刻，不证明最终屏幕时间一致。
- 多条真实轴已完成显式身份映射；伤害、Buff 寿命仍需逐 cast 对照。
- 旧格式的其他变体、字段缺省规则和异常输入仍需扩展审计，不宣称任意旧存档均可保真转换。

验证：

```powershell
npx vitest run tools/legacy-timeline --maxWorkers=1 --silent
npx tsc -p tools/legacy-timeline/tsconfig.json
```

下一步调查映射记录中的路由/衔接告警，再推进旧快照与当前回执逐 cast 对照。
完整源存档和运行报告留在 tmp，不提交私人存档或派生结果。

## 重跑伤害基线：必须同时记录截止帧

```powershell
node --experimental-strip-types tools/legacy-timeline/auditSimulation.ts tmp/converted-axis/project.json
```

只读正式转换项目，通过与编辑器相同的服务及项目定义库，分别计算存档结束线和完整战斗时长。
输出输入文件 SHA256、两种截止帧、伤害记录数、期望伤害和结束线之后的伤害明细；不修改输入，
不根据旧结果补发伤害。没有 castId 的 DamageApplied 也计入，缺失 expectedDamage 则明确失败。
统计的是各次运行产生的全部伤害回执，不另按展示区间过滤，也不代表旧版同口径总伤害。

每种截止范围同时输出 diagnostics：availability、comboWindow、execution 直接复用正式
投影，evidence 保留其引用的原始回执（含局部技能帧、期望路由等字段）。强制输入成功或
有伤害不意味着没有告警；审计器不另造游戏检查、不修改输入以消除告警。

2026-09-08 台式机复现发现：方案 6 的存档结束线为 2231 帧，而白天 1906578.3956401418
采用完整 3600 帧。诀连携能力实体在第 2237 帧还有一次 30146.527165223935 期望伤害；
按存档结束线为 264 条 / 1876431.868474918，完整时长为 265 条 / 1906578.3956401418。
两者都是相应运行范围的结果，不是平台或转换差异。不得移动结束线让数字相等；新旧对照应先统一统计范围。
