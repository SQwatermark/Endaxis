# 离线游戏数据生产

离线工具把原始游戏资源变成应用可直接消费的定义与资源。它在开发或版本更新时运行，不接收用户排轴输入，也不参与每一帧战斗。公共类型和运行时装载见[游戏数据](game-data.md)；命令、环境和操作顺序见[工具说明](../../tools/game-data-compiler/README.md)。

## 责任链

```text
来源清单与版本选择
  → 下载到隔离目录，记录逐文件来源和哈希
  → 核对快照身份、文件集合与完整性
  → 来源解析与公共动作投影
  → 领域定义、优化、候选文件
  → 候选校验与独立重编译
  → 登记产物的可恢复发布事务
```

下载、解释和发布是三个不同的成功条件。取到了合法 JSON 不代表当前转换器理解它；理解了单个动作也不代表完整版本已有足够来源；候选通过验证后才允许修改正式目录。

## 来源获取与快照准入

[downloadGameDataSources](../../tools/game-data-compiler/scripts/downloadGameDataSources.ts) 读取项目维护的来源清单。完整下载先检查输出目录不存在，再在隔离目录写文件与来源账本，最后安装到输出位置；失败清理暂存，不覆盖上一份可用快照。

正常重建使用 hybrid 来源：AKEDB 为主，允许补缺的文件由 VFS 获取并记录补缺原因。BuffData 的正式来源只允许 AKEDB。网络或响应体的暂时失败重试同一 URL，不借重试换来源；哈希/大小或来源身份错误必须失败，不能按“缺文件”处理。

下载器仍有定向单文件和 vfs-only 能力，但它们不是正式重建的准入承诺。单文件操作有独立来源记录；正式重建通过 [verifyGameDataSnapshot](../../tools/game-data-compiler/scripts/verifyGameDataSnapshot.ts) 要求 schemaVersion 2 的 hybrid 快照，并复核：

- 根目录与内容不能借符号链接越过来源边界
- 逻辑路径必须在声明清单内，目标路径、来源身份不能重复或越界
- 实际文件集合与账本完全对应，逐文件字节数、哈希和 JSON 都有效
- BuffData 来源为 AKEDB，其他 VFS 补缺有被接受的原因
- 必需表、单文件和集合清单齐全；缺件在 `missingInputs` 中明确返回，由重建编排阻断完整发布

快照哈希回答“本轮读的是哪些字节”，不回答“不同提供者是否来自同一客户端版本”。报告保留 `vfsVersionVerified: false`，不能把用户声明版本或下载成功改写成已经验证的同源证据。

## 来源读取、缓存与解析

[SourceFileCache](../../tools/game-data-compiler/src/source/sourceFileCache.ts) 由一次规划或验收调用创建，按规范化文件路径缓存原文，并在首次需要时解析 JSON。同次返回的 text/json 必须对应同一次读盘；解析结果递归冻结，消费者不能借共享缓存修改另一个消费者的来源。

缓存按最近使用次序和原文 UTF-8 字节容量淘汰。容量不是 JavaScript 堆限制：解析对象、索引和字符串还有额外开销。超大文件可以读取但不保留，也不驱逐已缓存小文件；零容量不保留缓存。读盘失败不入缓存，JSON 解析失败会移除原文，下次重新读取。

缓存命中不会检查文件修改时间。这是冻结来源条件下的有意复用，不是通用实时文件监视器。独立确定性验收必须使用独立缓存或清空后重新读盘，不能拿前一次解析对象证明第二次编译一致。`clear` 释放保留数据，但累计统计仍保留。

`src/source` 只把特定原生结构解析成明确的来源描述；公共动作投影和领域组装在后续编译层。基础 `requireRecord`、`requireNumber` 等只承担各自检查，单位、有效范围、完整字段集合和原生默认值由具体解析器确认，不能从 TypeScript 类型或通用数字检查推断这些语义都已验证。

新增来源字段时，应明确它属于哪份原生结构、是否版本敏感、未知值是否拒绝、由哪个后续编译器消费。需要严格完整字段匹配时使用现有 `requireExactFields`；不能把未知字段静默填零后继续进入正式数据。

## 代码与验证入口

- [gameDataProviders](../../tools/game-data-compiler/scripts/gameDataProviders.ts)：来源身份、响应字节、完整性及同一 URL 重试
- [downloadGameDataSources](../../tools/game-data-compiler/scripts/downloadGameDataSources.ts)：来源选择、集合清单和隔离快照
- [verifyGameDataSnapshot](../../tools/game-data-compiler/scripts/verifyGameDataSnapshot.ts)：正式重建的来源准入与缺件报告
- [sourceFileCache](../../tools/game-data-compiler/src/source/sourceFileCache.ts)：原文/JSON 配对、冻结、容量及释放
- [source/primitives](../../tools/game-data-compiler/src/source/primitives.ts)：路径化错误、原生枚举和数值解析基础

`gameDataProviders`、`downloadGameDataSources`、`hybridSourceDownload`、`sourceFileCache` 的原生测试覆盖替身来源、损坏内容、补缺限制和缓存行为。它们不能替代真实版本资源的完整重建与同版本原生证据核对。
