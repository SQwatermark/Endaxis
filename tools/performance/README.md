# 模拟性能与切面检查

这些离线工具只读项目，通过正式模拟入口测量耗时并检查保存恢复一致性，不参与网页打包，也不覆盖存档。

## 无缓存完整重算基线

使用已提交的[公开轴夹具](fixtures/public-timelines/README.md)或正式项目 JSON：

```sh
node --experimental-strip-types tools/performance/benchmark-baseline.ts tools/performance/fixtures/public-timelines/6aba2a13c9fb961339acd766.project.json 0 --repetitions 20 --warmups 3 --decompose > tmp/baseline.json
```

在仓库根运行，先创建输出所需的 `tmp` 目录。方案序号从 0 起，也可传 `all`，此时每个方案独立进程并各输出一行 JSON。默认每方案硬超时 600 秒，可用 `--timeout-seconds` 调整；`--help` 列出输入大小、帧数和重复次数的上限。失败、不确定结果、输入变化、恢复缓存命中或继承方案都使工具以非零退出。

工具先用 Vite 生产 SSR 构建，再启动 Node 子进程，不通过开发服务器或测试运行器。首次模拟单列，随后丢弃指定热身轮次，再计算测量轮次的中位数、nearest-rank p95 和最小/最大值。p95 在 20 次时只是第 19 个排序样本，不能作为稳定尾延迟保证。首次计时不含模块/仓库加载和构建，因此不是用户首次打开页面的总耗时。

正式服务 `simulationMs` 包含编译、装配、推进及核心结果/资源投影；`projectionMs` 是其后敌人生命、失衡和诊断投影。另报进程 CPU user/system 耗时，不能与墙钟时间混用。每轮禁用切面复用并清空服务缓存；不可变定义编译缓存保留产品正常寿命，首次模拟展示首次使用成本。

`--decompose` 在正式计时完成后，另外运行公开会话入口：单独输入计划编译、含编译的会话装配、推进、结果收集。输入计划探针不被装配复用，不能把四列相加，也不能把这些独立运行的值从正式服务耗时相减。没有增加生产内核计时点。

每轮核对输入不变、截止帧、无恢复点、完整可传输结果与有序回执的 SHA-256；阶段分解的回执必须与正式入口一致。非有限数在摘要中保留类型标记，避免无限生命和 null 混淆。另测正式 Worker 可传输结果的 `structuredClone`，不包含进程内 history 视图；这是复制成本，不是 Worker 往返延迟。

原始输出包含每轮计时、诊断、命中与伤害统计、事件计数、输入摘要、引擎/游戏数据版本、Node/V8/操作系统/CPU、可读的容器资源限制和测量时刻。报告可能含输入名称和本机路径，默认保存在忽略目录。可复现的公开结论见[公开时间轴性能基线](../../docs/research/public-timeline-performance.md)。

首次同规则生产优化、逐项对照及未保留的实验见[模拟热路径第一轮优化](../../docs/research/simulation-optimization-campaign.md)。

Buff 周期触发的调用计数、两个未接受候选及相同基线的噪声对照见 [Buff 周期触发实验](../../docs/research/buff-trigger-experiments.md)。小幅变化必须先与 A/A 波动比较，不能把单轮下降当作优化收益。

## 小幅变化的独立进程配对校准

先用相同源码校准能否分辨 3% 的差异，再考虑候选。下例只做 A/A；两标签使用同一个生产 SSR bundle 路径及完全相同的可执行字节，每个标签重新启动进程，不在一个进程中加载两个版本：

```sh
node tools/performance/benchmark-paired.mjs . tmp/paired-calibration \
  tools/performance/fixtures/public-timelines/6aba2a13c9fb961339acd766.project.json \
  tools/performance/fixtures/public-timelines/6a91c4241854aefb13172209.project.json
node --test tools/performance/benchmark-paired.test.mjs
```

第一参数是基线仓库，当前工具所在仓库是候选；`calibration` 模式要求两树生产源码及依赖指纹一致，只构建基线。不要在校准时保留候选补丁。输出目录必须尚不存在、父目录须存在。默认种子 `20261001`、每轴六对进程、每进程固定五次正式测量；`--help` 列出上限。每轴三组 AB 顺序、三组 BA 顺序，种子随机打散轴和组顺序；A/A 中 A、B 只是标签，都指向同一构建。

冷首跑单独保留，不参与暖态统计；它不含 Node 启动、模块加载和仓库加载，不能解释为用户首次打开的耗时。之后至少八次、最多二十次热身：比较末尾两个相邻四次窗口，墙钟和 CPU 的窗口中位数比都须落在 `[1/1.03, 1.03]`，每个窗口的 MAD/中位数不超过 5%，连续两次判定通过才提前结束热身。相邻两次判定会重用大部分窗口样本，因此“连续两次”不是两个独立确认。这是明确、有界的稳定性启发式，不是 JIT 已完全稳定的证明。到上限仍未通过时记录 `warmup-exhausted`，照常完成五次测量并标为不可用于通过校准；整批仍完成预声明的六对，不重试、不延长预算、不丢弃失败进程。

`wallMs` 是围绕 `await service.simulate` 的外层墙钟区间，`cpuMs` 是同一区间进程 user+system CPU；两者分开报告，不相减。原有服务 `totalMs`、`simulationMs`、`projectionMs` 也保留。每轮关闭切面复用、清空服务缓存，保留正常寿命的不可变定义缓存。没有强制 GC、采样器或单线程/JIT 参数；工具拒绝额外 Node 参数及非空 `NODE_OPTIONS`。构建、热身、Worker 结果投影、结果/输入哈希、每轮报告写入和源码核验不在服务计时内，但会影响后续堆/GC 和系统状态，不能称为完全隔离的纯引擎计时。

推断单位是“一对独立进程各自的五次测量中位数”。每对计算 `log(B/A)`，报告平均对数比及双侧近似 95% Student-t 区间，不把进程内五次测量当作五个独立进程。六对样本的区间依赖近似正态、组间独立等假设，未证明这些假设，也未做多轴多指标的同时覆盖校正。原始顺序、所有冷/暖/正式样本、每次暖态判定及每对比值均保留。

预声明的校准门槛是：每轴墙钟与 CPU 的 A/A 区间均包含 1 且完全落在 `[1/1.03, 1.03]`，所有进程都达到暖态规则。达到时状态为 `calibrated`；完成整批但未达到时为 `sensitivity-unresolved`、退出码 2，即尚不能可靠分辨该量级，不能据此继续试候选。失败进程的区间仍作为诊断展示，明确标为不合格。输入、源码、结果、构建或超时等验证失败为 `invalid`、退出码 1；保留已有证据，不将其混同为计时噪声。

校准通过后，才能由研究者明确启动候选对照：在同样输入和预算上使用 `--mode comparison`，第一参数指定未改动基线仓库。每轴另加入六对 A/B，并与六对同 bundle 的 A/A 组随机交错；每组仍为紧邻的两个新进程。嵌入 A/A 或任一暖态检查失败时仍报告敏感度未建立。`comparison-completed` 只表示测量完成，绝不表示优化被接受；候选区间和实际收益仍需审阅。

工具分别记录文档 HEAD、最近引擎/数据提交、工作树差异摘要、生产文件清单、实际打包模块来源和哈希、可执行 bundle 清单。入口识别按宿主平台归一化 Vite/native 路径分隔符，不混淆不同根、卷或虚拟模块；实际模块仍通过 realpath 核验。构建时拒绝跨源码树混用，运行中反复检查输入、工具、生产源码、依赖模块及 bundle 不变。每次通过正式普通回执服务核对截止帧、无恢复点、输入、完整 Worker 可传输结果和有序回执的精确值哈希，保留非有限数、负零和 undefined。此哈希不证明对象别名关系、完整战斗状态或切面恢复等价；接受候选仍须另做对应语义验收。

每个构建/测量进程默认硬超时 600 秒，整批预算默认 3600 秒；剩余预算也限制下一个子进程的超时。单文件上限 32 MiB、首个独立方案上限 108000 帧和 10000 技能块。工具不自动增加预算。原始 JSON、日志、构建与 source map 留在本机输出目录，可能含项目名称、源码及路径，不自动上传或提交。源码层调用计数与实际分配采样是不同证据，不能由少调用次数直接声称相同数量的对象分配已经省去。

## 被动 UI 回执压缩验收

回执删减会改变完整输出哈希，必须用[专门的语义与性能验收](../../docs/research/passive-ui-receipt-compression.md)，不能直接套用逐位相等结论。

```sh
node tools/performance/verify-passive-ui-receipts.mjs <优化前仓库> tmp/passive-ui-verification tools/performance/fixtures/public-timelines/*.project.json
```

两个仓库均需已安装依赖，当前仓库作为候选。输出目录必须尚不存在。工具分别构建两份源码，在独立进程中通过正式入口运行每份项目的首个方案；只允许相同目标、来源与原始有限数值的普通被动 UI 回执删减。它逐项核对保留事实、回执引用、完整结果与状态、逐帧 HUD、被动 UI 与 Buff 曲线。另报收集器重建前缀索引的微测量，不代表完整切面恢复时间。原始二进制结果及构建文件只留本机，不能自动上传。

## 可选执行跟踪验收

普通模式省略四类内部执行跟踪，完整结果哈希会变化；使用[身份映射与语义验收](../../docs/research/optional-execution-receipts.md)，不能直接比较普通和详细输出哈希。常规模拟入口及战斗日志默认普通收集，打开日志不额外重跑；本工具为对照研究显式运行普通和详细两种模式。

```sh
node tools/performance/verify-optional-execution-receipts.mjs \
  tmp/optional-receipts \
  tools/performance/fixtures/public-timelines/*.project.json \
  --allow-known-projectile-reset-failure
```

输出目录必须尚不存在。工具只读各项目首个独立方案，构建一次生产 SSR，再以普通/详细两种模式分进程串行运行；默认每进程冷首跑一次、热身三次、正式二十次，共两轮，第二轮反向输入和模式顺序。`--repetitions`、`--warmups`、`--rounds` 可用于快速烟测，低重复结果不能作为正式性能结论。每进程硬超时 600 秒，单文件上限 32 MiB、单方案上限 108000 帧和 10000 技能块。

第一轮在计时外核对完整结果、完整状态、逐帧 HUD、被动 UI 和 Buff 时间段，以及选定事件边界/轴中点的切面分叉。比较器只允许四类执行跟踪缺席及真实回执身份映射，不能重写连携内部序号或忽略伤害来源字段。第二轮继续核对输入、模式内结果和回执哈希的跨进程确定性。正式计时关闭切面复用并清缓存；构建、加载、验证、哈希和输出均不在服务计时内。

默认恢复失败使命令失败。示例中的选项仅用于显式承认已知 `missing projectile reset handler 0`；其轴/帧/消息仍写为失败，不能称为切面通过。普通/详细出现不同恢复结果仍立即失败。若新输入存在该故障，应先查清原因，不用选项掩盖新的回归。

`summary.json` 和每进程 JSON 包含计时、计数、诊断、输入/源码摘要及验证状态；`.bin` 保留本机完整证据，`build/` 保留 bundle/source map。工具检测运行中输入及生产源码变化，拒绝混合版本；原始证据可能含项目内容和路径，不自动上传或提交。仅通过这些输出不能证明“没有构造对象”，须结合源端观察者选择与低层行为回归。

## 编辑落点与缓存对照

下面保留已有开发态对照工具。它会改变首个技能位置并复用编辑器服务缓存；不能用其结果代替上述无缓存基线。

## 输入与运行

使用正式项目 JSON。旧存档先经过[旧轴转换](../legacy-timeline/README.md)。在仓库根目录执行：

```sh
node --experimental-strip-types tools/performance/benchmark-real-timelines.ts '<项目JSON路径>'
```

末尾可附加重复次数，例如 `4` 表示执行四轮，每轮包含四个落点。比较稳定耗时可排除第一轮热身，并分别报告首次耗时。输出包含完整结果和回执的 SHA-256 摘要，便于确认优化前后同一落点的结果一致；摘要不替代切面状态验收。

每个方案比较原位置及首技能后移 1、2、3 帧的计算，分别报告模拟、服务投影和结构化复制耗时。空轴可能命中缓存，不能当作一次新模拟的基线。

## 验证保存恢复

```sh
npm run verify:real-timeline-checkpoints -- '<项目JSON路径>' [方案序号] [随机种子]
```

方案序号从 0 开始，默认首个方案；种子默认 `123`。工具比较完整排程、逐帧输入和多个事件边界分支续算的状态、回执及结果，不一致时失败。

输出保留输入摘要、模式、保存帧和结果摘要。跨提交比较应使用同一输入、定义版本和种子；不能修改结束线使结果相等。

## 怎样解读性能

这是 Node 模块环境的计算测量，不是浏览器 FPS。首次运行含热身成本，模拟入口耗时包含编译和记录整理，不能称为纯内核耗时。

浏览器需另测主线程、Worker、数据传输、Vue 更新和布局绘制。内存区分存活对象、历史、定义、缓存与进程峰值；单次 RSS 或 GC 前后数字不能证明泄漏。

重型测量串行运行，记录输入规模、环境、重复次数和限制。报告可能包含项目名称和身份，应保存到忽略目录，不提交私人数据。

工具类型检查：

```sh
npx tsc -p tools/performance/tsconfig.json
```

## v3 重构前后对照

`benchmark-compare-versions.mjs` 使用真实旧版 store 导入流程及原模拟 composable，对照现有生产 SSR 基线入口。对应分析见 [v3 前后对比报告](../../docs/research/pre-v3-performance-comparison.md)。原始公开存档仍只保存在本机，不随工具提交；工具要求其 SHA-256 与夹具清单一致。

```sh
# 真正重构提交 861bda8c 的直接父提交，独立工作树不会切换当前分支。
git worktree add -b perf/pre-v3-13b6905c ../Endaxis-pre-v3 13b6905ca767579f018512de1f1fa646a375a0cc
(cd ../Endaxis-pre-v3 && HUSKY=0 npm ci --ignore-scripts --no-audit --no-fund --cache /tmp/endaxis-npm-cache)
node tools/performance/benchmark-compare-versions.mjs \
  ../Endaxis-pre-v3 ../endaxis-real-samples ../endaxis-version-comparison
```

- 每轴分别运行旧版原生截止、旧版同截止、新版；每组独立 Node 进程，串行且按轴交替版本顺序。默认冷首跑一次、热身 3 次、正式 20 次。可用 `BENCH_REPETITIONS=1 BENCH_WARMUPS=0 BENCH_SMOKE=1` 做首轴烟测；这些低重复结果不能替代正式报告
- 旧版同截止组只在适配器传给正式 composable 的 `simulationEndline` 引用中补截止：原结束线优先，否则准备期加配置战斗时长。不会回写存档。原生组保留原始无结束线行为，两组分别计量，不能称为完全未变输入的同一组
- 旧版 store 的导入、数据初始化、配装/被动装配及 200 ms 的 watcher 稳定等待在计时外。只替换构建时的一个 import，捕获实际依赖后原样委托生产 composable；每轮新建 composable 强制重新编译、模拟、投影，不修改旧生产文件
- 新版复用正式基线入口，禁用切面和结果缓存。两版不可变定义、旧版已装配的 store 数据保持正常寿命。没有强制 GC
- 输出 `comparison.json`、每轴每版本 JSON 和本机 SSR bundle；JSON 不带本机输入路径或原始存档。旧版结果摘要涵盖正式投影及日志，并保留 Map/Set/非有限数；不声称序列化了含方法的完整状态实例
- 时间上限是相同的，不意味着游戏规则、事件粒度、数据版本或结果投影相同。数字伤害与实际命中数必须一起检查；不能由版本耗时比推导等语义内核回归

## 暖态 CPU / 分配采样

```sh
node tools/performance/profile-simulation.mjs \
  tools/performance/fixtures/public-timelines/6aba2a13c9fb961339acd766.project.json \
  tmp/profile-dense 12 5
```

仅测首个独立方案。末尾可增加 `standard` 或 `detailed` 选择回执收集级别，缺省 `standard`；研究内部执行追踪时必须显式传入 `detailed`，例如 `... tmp/profile-dense-detailed 12 5 detailed`。比较两级别应分别使用新输出目录；采样不代替上面的无采样配对计时。输出目录必须尚不存在，避免覆盖证据；默认每模式 12 次测量、5 次热身，上限分别 50、20。每个子进程硬超时 600 秒。工具构建生产 SSR，并对 control、CPU、allocation 各运行两次独立进程，第二轮反向排列模式；所有进程串行。CPU 间隔 1000 µs，分配采样间隔 32768 字节，包含采样期间已被 minor/major GC 回收的对象，不强制 GC。

每次 `simulate` 前启用、返回后立即停止采样，然后才写文件、生成 Worker 结果和检查哈希；构建、加载、热身、清缓存、哈希、复制与输出不属于目标区间。Inspector 自身启停/异步边界仍会落入 trace：按 CPU sample count 统计热点，不能把原始 timeDelta 权重之和当模拟耗时。正式服务计时来自同样运行的 control 对照，分配采样尤其会大幅扰动耗时。哈希在采样外产生的对象也可能影响后续 GC，不能把 GC 全部归因于生产模拟。

每轮禁用切面并清空结果缓存，验证完整结果/有序回执/输入不变，模式和进程间结果也必须相同。保留定义级正常缓存寿命。原始 `.cpuprofile`、`.heapprofile`、SSR bundle 和 source map 保存在本机输出目录，可载入 DevTools；不要把其中可能含源码、路径或输入资料的文件自动提交或上传。`report.json` 是按 source map 归并的摘要；源位置是函数入口，不是精确语句位置，JIT 内联可能改变归属。

self 是当前叶帧采样数或采样估算分配字节；inclusive 是包含后代且同一调用链去重后的值，各行互相重叠，严禁求和。分配不是对象精确计数、峰值或存活内存，不能证明泄漏。完整结果见 [两条真实轴的热点报告](../../docs/research/simulation-profile-hotspots.md)。

## 图节点规模与执行次数

[节点数量研究](../../docs/research/graph-node-count-impact.md)将静态编译节点、实例内binding、Execute/Reset/Tick/End访问、条件装饰器转发和时间轴扫描分开；计数不能相加当作机器指令数。

```sh
node tools/performance/graph-node-diagnostics.mjs tmp/graph-node-diagnostics both
node --experimental-strip-types --test tools/performance/graph-node-probe.test.ts
node tools/performance/benchmark-graph-node-scaling.mjs tmp/graph-node-scaling
```

输出目录必须尚不存在，父目录须存在。首条固定读取六份已提交公开夹具，诊断通过构建期源码转换，仅聚合计数；无插桩对照分别构建、分进程运行，全部保持普通回执。诊断对象保留会改变内存及耗时，不能以诊断进程做性能或分配结论。第三条使用真实图执行器与空操作host做合成缩放，不能将结果称作完整服务提速。重型测量应串行，详情及全部口径见研究报告。
