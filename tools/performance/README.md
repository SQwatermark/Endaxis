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

## 被动 UI 回执压缩验收

回执删减会改变完整输出哈希，必须用[专门的语义与性能验收](../../docs/research/passive-ui-receipt-compression.md)，不能直接套用逐位相等结论。

```sh
node tools/performance/verify-passive-ui-receipts.mjs <优化前仓库> tmp/passive-ui-verification tools/performance/fixtures/public-timelines/*.project.json
```

两个仓库均需已安装依赖，当前仓库作为候选。输出目录必须尚不存在。工具分别构建两份源码，在独立进程中通过正式入口运行每份项目的首个方案；只允许相同目标、来源与原始有限数值的普通被动 UI 回执删减。它逐项核对保留事实、回执引用、完整结果与状态、逐帧 HUD、被动 UI 与 Buff 曲线。另报收集器重建前缀索引的微测量，不代表完整切面恢复时间。原始二进制结果及构建文件只留本机，不能自动上传。

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

仅测首个独立方案。输出目录必须尚不存在，避免覆盖证据；默认每模式 12 次测量、5 次热身，上限分别 50、20。每个子进程硬超时 600 秒。工具构建生产 SSR，并对 control、CPU、allocation 各运行两次独立进程，第二轮反向排列模式；所有进程串行。CPU 间隔 1000 µs，分配采样间隔 32768 字节，包含采样期间已被 minor/major GC 回收的对象，不强制 GC。

每次 `simulate` 前启用、返回后立即停止采样，然后才写文件、生成 Worker 结果和检查哈希；构建、加载、热身、清缓存、哈希、复制与输出不属于目标区间。Inspector 自身启停/异步边界仍会落入 trace：按 CPU sample count 统计热点，不能把原始 timeDelta 权重之和当模拟耗时。正式服务计时来自同样运行的 control 对照，分配采样尤其会大幅扰动耗时。哈希在采样外产生的对象也可能影响后续 GC，不能把 GC 全部归因于生产模拟。

每轮禁用切面并清空结果缓存，验证完整结果/有序回执/输入不变，模式和进程间结果也必须相同。保留定义级正常缓存寿命。原始 `.cpuprofile`、`.heapprofile`、SSR bundle 和 source map 保存在本机输出目录，可载入 DevTools；不要把其中可能含源码、路径或输入资料的文件自动提交或上传。`report.json` 是按 source map 归并的摘要；源位置是函数入口，不是精确语句位置，JIT 内联可能改变归属。

self 是当前叶帧采样数或采样估算分配字节；inclusive 是包含后代且同一调用链去重后的值，各行互相重叠，严禁求和。分配不是对象精确计数、峰值或存活内存，不能证明泄漏。完整结果见 [两条真实轴的热点报告](../../docs/research/simulation-profile-hotspots.md)。
