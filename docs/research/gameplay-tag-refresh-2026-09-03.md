# 新版完整标签与装备重建（2026-09-03）

## 结果与复跑

`rebuild:game-data` 在隔离输出中接通完整 GameplayTagConfigSet 自动导出、标签目录、
预定义表、全部套装和全部武器试编译。没有发布正式资源，没有修改旧版代码。
AKEDB 仍为主源；当前索引不存在 GameplayTagConfig，才使用 VFS 的通用 Unity 导出能力。
如果以后 AKEDB 出现对应配置，本入口阻断并要求核对其结构，不继续无条件走 VFS。

```powershell
npm run rebuild:game-data -- --source-root tmp/game-data-rebuild/run-dYAF19/sources --unity-worker D:/Projects/vfs-index-browser/unity-worker/src/Vfs.UnityWorker/bin/Release/net9.0-windows/Vfs.UnityWorker.exe
```

不传 `--source-root` 会重新 hybrid 下载。`--unity-worker` 指定本机已有的 VFS worker，支持
exe 或 dll；不执行 HTTP 返回的命令，不启动可见窗口，不自动安装/构建 worker。
无 worker 时仍可跑表与单件装备，标签后续阶段明确受阻，不借旧生成目录。

最终报告：`tmp/game-data-rebuild/run-KjA4Lw/report.json`，首次报告 `run-6897KA/report.json`。
完整命令仍返回失败：79 把武器中 `wpn_funnel_0020` 使用未支持的 `OnBuffEnhanceChanged`，
整批武器不写盘。其他阶段及两类来源的生成后复验通过。

| 内容            | 当前结果                                                    |
| --------------- | ----------------------------------------------------------- |
| 单件装备        | 258 件，重复生成检查通过                                    |
| 完整配置集      | 26 份配置，6956 条唯一有效路径                              |
| 标签变更        | 比正式基线增加 150 条，移除 0 条                            |
| 原始重复/无效项 | 重复 54 项、空串 0 项，显式计数                             |
| 全局预定义      | 179 个标签、67 个查询、37 条免疫规则，无未解析引用          |
| 套装            | 24 套 / 43 份 Buff / 25 项木桩省略诊断，重复生成检查通过    |
| 套装变更        | 新增 suit_spellburst；suit_phy01 冷却协议与索引改变，无删除 |
| 武器            | 79 项整批检查，1 个编译阻塞，不宣称其余武器已完成运行验证   |

## 来源与校验

- JSON 快照仍为 `3c85bb1596f73d384403bdfe35f576b1ffb00beafcb13fe502fdc8154fd3331c`，
  AKEDB 选定 `1.5.3@9885010-4`，6230 项来源。原快照不修改、不夹带新增文件。
- 同次任务新导出的 Unity Bundle、worker 请求/响应、TypeTree dump、CABMap、
  `source-set.json` 与 `provenance.json` 位于本次 `unity-sources/GameplayTagConfigSet`。
- 当前 VFS manifestId=456952，worker=0.15.0；来源集 SHA-256 为
  `8f9339886b6d1d70dccc864e57739c0ea2d89b4646de07aa84792043d83af955`。
- 按逻辑路径定位；动态枚举当前配置目录，不复用旧 assetIndex/Bundle 编号或旧 26 项名单。
  导出逐容器要求唯一对象、完整消费字节、SHA-256 与长度匹配。
- 公共连接器按 `PPtr.fileId → CAB dependencies → sourceFile + Int64 pathId` 严格连接。
  多余对象、重复对象引用、缺件、路径穿越、链接和 ADS 路径仍拒绝。
- 导出前后比较 manifest 发现结果，重新读取全部 Bundle 核对字节，防止运行中客户端更新。
  生成后再次核对 JSON 快照及 Unity 来源集/标签候选。
- 完整性检查**不证明 VFS 客户端与 AKEDB 游戏版本一致**。`versionVerified=false` 保留，
  跨来源版本审核仍是正式发布前条件。当前编排仅支持现有逻辑配置目录与 Windows Bundle 布局；
  成员迁出目录或共享 Bundle 引起 CAB 重复时显式失败，不按旧名单补齐。

## 单配置内部重复项

当前 `data_tag_npc_avatarmesh` 的活动 `_keyData` 声明 175 项，其中 10 条重复，不是
`obsoletes` 误读或截断配平。完整 dump SHA-256：
`8ff47a35a82fba022de1c86e05b436b88ff0b5463eb8a253859343feb86109cb`。
对象 `CAB-24ec308f4176fefcd8cee193f0f925b5 / -6518040243829459979`。

此前解析器额外禁止单配置内部重复，而配置集投影早已处理跨配置重复。复刻库
`docs/gameplay-tags.md` 的 `_Build` 证据、`GameplayTagConfigSet.AddTag` 及已有
`ConfigSetKeepsEmptyNameInvalidAndReusesRepeatedFullPaths` 支持同路径复用节点。
本轮先复跑 C# 标签测试 **16/16**，无需修改已有机制。Endaxis 来源层现在保留全部项，
由既有配置集投影统一计数和去重；数量、编码、PPtr 身份及不同路径 CRC 冲突门禁不放开。
这不是重新验证 1.5.3 机器码/IFix 的结论。

## 验证与下一步

编译器 **139 文件 / 1570 项**通过，compiler/production 两套类型检查通过。
套装审计环境变量 `ENDAXIS_GEAR_SET_REBUILD_REPORT` 指向新报告后，使用本批标签候选并复验
来源与确定性内容。24 个套装装配/爆发、新套装寒冷/自然触发、电磁不触发、冷却及伤害差分
共 **28/28**。仍使用基线测试干员和公共战斗设置，不是全资源空目录模拟证明。
历史无标签阶段的定位报告仍显式使用旧基线，不可冒充新报告。

下一步优先处理 `sk_wpn_funnel_0020.actionGroupData.passiveEventActions[1]`：
`OnBuffEnhanceChanged` 监听检查 intensityup 的 BuffCount 是否仍 >=4，否则结束 maxup。
这是 AbilitySystem 事件（原生 209），不是 Buff 内部生命周期回调（同名原生枚举 6）。
复刻库已有部分消耗/结束广播，增层/普通扣层链仍需核对；不能只增加事件名字映射。
先补证据/复刻库缺项，再统一 Endaxis 事件生产、监听、转换和真实武器效果回归。
其后继续新干员及 SkillSetting/GlobalBuff/模板等全局输入自动重建。
