# GameplayTag 完整配置集恢复（2026-08-28）

## 结论与边界

之前的 652 条目录只是 `GameplayTagConfigSet.configs` 引用的 26 份配置之一，不是完整标签树。
原生配置集、全部引用对象及 CAB 外部表现已从同一客户端 VFS 导出并逐项链接。
26 份配置共 6842 条原始记录，含 1 条空串、35 条跨配置重复路径，得到 **6806 条唯一非空路径**。
全局表的 **175 个预定义标签、61 个查询、36 条免疫规则**均可严格转成可读路径，未知引用为 0。

这次解决的是标签目录/全局配置生成阻塞，不是根 KnockDown 的执行、起身配置或完整干员接入。
`GameplayTag = string` 的公开边界不变：CRC 和原生数字身份只用于来源解析，不进入运行时。

## 引用证据

配置集逻辑资产：`assets/beyond/dynamicassets/gamedata/gameplayconfig/gameplaytagconfigset.asset`。
本次索引中的 assetIndex=79932，Bundle 记录=24700，Bundle=`main/1986a88adc7dd9cba04224f7.ab`。
这些索引编号不是跨版本身份；复现必须重新按逻辑路径定位。

- 配置集 Bundle SHA-256：`39053ebbcfd11036064b0c95356699370f58966b2eab60eb6083451c00c2fbc0`。
- 配置集 combined dump SHA-256：`09fe0f2f9a46add5749b839e1d0519731c471ca8a7b7b8f9616f961d8a58edf9`。
- 27 Bundle 的 CABMap SHA-256：`2802d7d2150c089c729abf749c51f37176617f6a4a91a795cf50ee35e6a5f4c3`。
- 稳定来源清单 SHA-256：`5d6901da5e6139aafbc88f8c71de4de50563fbbb0db69c3de7f258ba92d4789a`。
- 全局预定义原表 SHA-256：`c87176401ac351c74cd75b92bb9a2f48c70ba5f4062bb004f5f07d848328e3d5`。

配置集 CAB=`CAB-240598bb3b3ca3b28a7a266f40d0d986`，对象 pathId=`7180852545050936290`。
来源连接按 `PPtr.fileId → CABMap.dependencies[fileId-1] → (sourceFile, pathId)` 查找对象，
fileId=0 才引用当前 SerializedFile；Int64 pathId 全程用十进制字符串，不经 JS number。
不只比较 pathId，不按文件名猜引用，不把目录中未引用的配置混入结果。

每个 worker artifact 的 `complete=true` 且 consumedByteCount=serializedByteCount；
原始对象身份、每份 dump 的校验和及完整成员列表见
[`gameplay-tag-config-set-1.4.4.sources.json`](../../tools/game-data-compiler/gameplay-tag-config-set-1.4.4.sources.json)。
元数据中的 sourceFile/container 还必须与校验过的 CABMap 对应，不能跨 Bundle 冒配。

例如原来缺失的 888050036 在 `data_tag_int_category.asset` 中恢复为 `Category/Interactive`；
这是原始路径和 CRC 校验得到的结果，不是把枚举名 `Interactive` 当标签名。

## 原始结构的特殊情况

- `data_tag_earmorph_emotion` 的活动列表为空，是合法来源，不能因没有条目报截断。
- `data_tag_earmorph_avatar` 第 29 条是空串，来源层保留；原生 UTF-8 CRC-32 对空串为 0，
  `GameplayTag.IsValid` 为 false。Endaxis 投影明确统计后不输出这条无效标签，不发明占位路径。
- 跨配置重复路径按首次出现顺序去重；单配置内部唯一要求已在 2026-09-03 修正：新版活动列表
  实际存在重复项，来源层保留，配置集投影统一统计/去重，见[新版自动重建](gameplay-tag-refresh-2026-09-03.md)。
- `obsoletes` 不属于活动 `_keyData`。不能拿它补齐缺失活动记录，也不能用 slice 隐藏超额活动项。
- 读取、连接和输出分别负责数量/编码校验、引用闭包、路径及 CRC 冲突校验。

## 重建与数据流

来源清单由 Endaxis 维护；VFS 提供通用 TypeTree/CAB 导出能力，不从 combat-spec 获取生产输入。
原始 dump、Bundle、worker 元数据和下载缓存放在忽略的 `tmp/`，不提交游戏原始 Bundle。

```powershell
npm run generate:game-data:gameplay-tags -- tools/game-data-compiler/gameplay-tag-config-set-1.4.4.sources.json src/next/data/combat/gameplayTagCatalog.generated.ts --source-set --source-root tmp/game-data-sources/GameplayTagConfigSet
npm run generate:game-data:tag-predefine -- tmp/game-data-sources/GameplayConfig/GameplayTagPredefineTable.json src/next/data/combat/gameplayTagPredefine.generated.ts combat-1.4.4 src/next/data/combat/gameplayTagCatalog.generated.ts
# 两条命令分别追加 --check，只比较现有产物，不写入。
```

`--source-set` 表示第一位置参数是导出清单；`--source-root` 指定清单相对文件的根目录，
省略时使用清单所在目录。旧单 dump 入口仍可用于有界检查，但不能拿旧 652 条目录覆盖完整生产目录。
新版本必须先审核来源并更新固定摘要；`--allow-new-source` 仅放开清单/单 dump 顶层摘要门禁，
不会绕过每份文件摘要、对象完整性、引用数量、重复身份或缺失路径检查。

清单 v1 的稳定形状：

- 顶层：`schemaVersion:1`、`revision`、`configSet`、`configs[]`、`cabMap`。
- 配置集及配置对象：`container`、`sourceFile`、`pathId`、`complete`、`dump:{file,sha256}`。
- `cabMap:{file,sha256}` 指向 VFS worker 原始 `buildCabMap` 产物。
- 文件引用须位于指定来源目录内；缺件、哈希不符或半截导出在写入任何正式文件前失败。

重新取源使用现有 VFS 的 `exportMonoBehaviourTypeTreeDump` 与 `buildCabMap`：按清单 container
定位当前 manifest 的实际 Bundle，再保存 worker 原始产物及完整性信息。清单不是另一份 Unity 解析器。
本轮使用离线精确导出；**下载器尚未自动编排这 27 个 Unity 对象及 CABMap**，不宣称已有 CDN 或
VFS HTTP 的配置集集合端点。本机缓存已具备完整重建条件；跨机缺缓存时需按清单重导。

Operator 来源审计可改用 `--gameplay-tag-catalog src/next/data/combat/gameplayTagCatalog.generated.ts`，
与旧 `--gameplay-tag-dump` 互斥；主动生成、完整定义及全局配置都消费同一份路径目录。
