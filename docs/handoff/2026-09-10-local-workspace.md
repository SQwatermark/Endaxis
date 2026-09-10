# 笔记本环境：本机接续入口与目录地图（2026-09-10）

本页针对当前这台 **Windows 笔记本（本机）**，根目录为 `C:\Users\sqwat\Projects\zmd`。
台式机另见[台式机环境](desktop-environment.md)，不能把其中路径作为本机路径。
下文相对目录均相对此根。以本轮实际 `git status`、`git worktree list` 和目录检查为准；
未 fetch/pull，分支与远端的关系只是本地已知状态，不代表 GitHub 此刻没有新提交。
**新会话直接打开 `Endaxis-game-data-refactor`，不要按名称打开 `Endaxis`。**

## 1. 仓库与工作树

| 目录 | 本机分支 / HEAD | 作用与使用边界 |
| --- | --- | --- |
| `Endaxis-game-data-refactor` | `refactor/common-game-data` / `cf6f7efc` | **当前 Endaxis 开发工作树**。有大量未提交实现、生成文件、测试、文档及新增文件；接续原状，不回退、不重做。 |
| `Endaxis` | `codex/time-dilation-curve-editor` / `0e008e66` | Endaxis 主工作树，但不是当前开发主线。保留旧 Python/装备迁移等大量未提交内容；不能清理、自动合并或把它当当前实现。 |
| `Endaxis-legacy-reference` | detached / `4dadc55f` | 本机旧版只读对照，检查排轴/UI与旧实现；不是游戏规则权威。当前干净。 |
| `Endaxis-operator-completion` | `refactor/operator-completion` / `30c52d9f` | 历史干员恢复工作树，当前干净；不要在这里继续本轮。 |
| `Endaxis-harness-next` | `feature/harness-actual-skill-width` / `9d1f0791` | 历史 harness/技能宽度工作树，当前干净；不是当前主线。 |
| `.tmp-endaxis-b821` | detached / `b8212cb3` | 历史生成基线。有未跟踪 Typhoeus 图片，不能按 tmp 名字直接删除。 |
| `combat-spec-operator-completion` | `refactor/operator-completion` / `73bb51e` | **当前 C# 原生规格工作树**。本轮未提交修改为 `docs/launch-projectile-skill-routing.md`。 |
| `vfs-index-browser/combat-spec` | `main` / `e5f3a4c` | 同一个 combat-spec 仓库的旧主工作树，当前干净。不要误以为 main 就是当前研究分支，也不要自行合并。 |
| `vfs-index-browser` | `master` / `8c1d09d` | 游戏资源定位、解码、导出与研究工具。顶层有未跟踪 `.tmp-*`、`tmp/`；本轮未改正式代码。 |
| `vfs-index-browser-audio` | `codex/audio-hirc` / `e5207ec` | VFS 音频专题工作树，有未提交音频模块、测试、文档，属于其他工作，保留。 |
| `vfs-index-browser-audio-dialog` | `feature/audio-dialog-index` / `457f890` | VFS 台词/音频索引专题工作树，当前干净。 |
| `AnimeStudio` | `feature/endfield-animation-acl` / `8cdec96` | 历史独立 Unity 资源工具，当前干净；不能仅因存在就假定当前 VFS 必须调用它。 |
| `IL2CPP-Dumper` | `feature/comprehensive-runtime-dump` / `1acf87d` | 类型、方法、运行时模块与探针采集工具，当前干净；新采集需核对游戏和权限。 |
| `AKEDatabase` | `main` / `a67d4157` | 第三方数据前端参考，研究字段、CDN、富文本；不是下载数据全集。有未跟踪 `.idea/`。 |
| `.tmp-endfield-research-kit` | `master` / `80ad383` | 外部格式/研究工具参考克隆，有 Python 缓存；不是生产依赖。 |

Endaxis 各工作树共享 Git 对象、分支与远端，但不共享未提交文件和 `tmp/`。
combat-spec 的两个目录同理；它是独立仓库，不会随 Endaxis 提交自动提交。
VFS 的三个工作树也是同一仓库，不是三个独立产品。

远端注意：Endaxis 的 `origin` 为 SQwatermark/Endaxis，另有上游 Lieyuan621、SQwatermark、zmd。
combat-spec 与 VFS 的 `origin` 分别为 SQwatermark/combat-spec、SQwatermark/vfs-index-browser。
AnimeStudio 的 `origin` 是历史临时 `.bundle` 路径，GitHub 远端名是 `private`；
IL2CPP-Dumper 的 `origin` 是 DeftSolutions-dev 上游，个人 GitHub 也是 `private`。
不要对所有仓库机械执行同一条 push 命令。

## 2. 当前 Endaxis 内部目录

- `src/core`：正式领域模型、编译与模拟；`src/ui`：正式界面；`src/application`：用例。
- `src/data`、`public`：正式生成数据及图片；不是源端解包文件暂存区。
- `packages/game-data-contract`：转换器与本体共同依赖的独立数据契约，结构唯一权威。
- `tools/game-data-compiler`：统一 TS 来源下载、解析、编译、生成和审计入口；先读其 README。
- `tools/inspector-schema`：契约驱动 Inspector 工具；`tools/legacy-timeline`：旧轴转换工具。
- `docs/handoff`：接续状态；`docs/next`：长期设计；`docs/research`：专题证据。
- `tmp`：本工作树的来源缓存、候选输出和审计文件，不是其他工作树 tmp 的别名，不能提交。
- `node_modules`、`dist`：依赖和构建产物，不是待编辑源码。不要因文件存在就认定服务使用最新代码。

当前正式源码已经提升到 `src`，不是旧 `src/next`。旧 Python 生成器在其他旧工作树仍存在，
不代表当前需要维护第二套生成器。页面当前入口以路由为准，使用 `/timeline`，不要照抄旧 `/next/timeline`。

## 3. 本机证据与临时文件

### 当前实际存在

- `combat-runtime-dumps/1.4.4/IL2CPP_GameAssembly.runtime.bin`：历史内存模块，virtual-rva，
  SHA256 `7E7377FB52D82B925D010BEF1B66C1441EBDED94BB9711F632C5AD87EEF82038`。
  同目录 `.json`、`IL2CPP_MethodProbes.json` 及 `static/Gameplay.Beyond.dll.cs` 用于核对布局和符号。
- `combat-runtime-dumps/1.4.4/runtime-1/IL2CPP_GameAssembly.runtime.runtime-1.bin`：另一份历史快照，
  SHA256 `DB718A753850ED03D4DB596301A811D84EAE5AC6F6C0198C4D9C70D02ED8CBC7`。
  不同快照的地址/字段布局不能混用。
- `vfs-index-browser/data/research-artifacts/combat-1.4.4`：历史 binaries、derived、dumps、logs、samples。
  `binaries/GameAssembly.dll` 是 PE 文件，不应当作上述内存布局直接按 RVA 文件偏移读取。
- `Endaxis-game-data-refactor/tmp/game-data-hybrid-full-20260903`：本机融合来源，含 SkillData、BuffData、
  AbilityEntityData、CharacterData、ProjectileData、GameplayConfig、TableCfg-current。
  目录存在不等于与之后冻结来源逐字节一致；不能拿它冒充 20260905。
- `Endaxis-game-data-refactor/tmp/game-data-sources`：另一批来源缓存，含旧表与 skill-data-cdn 等；
  `tmp/real-axis-sources/TableCfg-1.4.4-9433094-12` 是历史真实轴表数据。
- `Endaxis-game-data-refactor/tmp/converted-real-axes-20260908*`、`legacy-axis-audit`、
  `legacy-axis-inventory-20260908`：旧轴转换/对照产物；需要先看各自报告确认敌人和来源版本。
- 用户原始旧轴：`C:\Users\sqwat\Downloads\Endaxis_Timeline_2026-08-31.json`，本轮确认存在。
- `tmp/game-data-rebuild/run-*`、各种 `*-candidate`、`*-audit`、`*-before/after`：候选和专项审计，
  不自动等于当前正式产物；`*.partial-*` 是下载中间目录，不能冒充完整来源。

### 历史文档提到，但本机当前未找到

- `Endaxis/tmp/game-data-sources-hybrid-20260905`；
- `Endaxis-game-data-refactor/tmp/game-data-sources-hybrid-20260905`；
- `Endaxis-game-data-refactor/tmp/event-unification-candidates-mz38x5`；
- `Endaxis-game-data-refactor/tmp/audit-reachable-projectile-callbacks.mjs` 和 `reachable-projectile-callbacks.json`；
- `combat-spec-operator-completion/artifacts`，所以历史提到的 SkillData/BuffData junction 在本机不可直接使用。

上述为精确路径存在性检查，不声称文件在所有磁盘上都不存在。
文档中的当前包 A7D3F59A… 内存快照此前在本机未定位，不能以历史 7E7377… 代替它声称当前包已验证。
历史“109回调”“四轴一致”及报告路径保留为历史记录，不代表本机能立即重跑；先找回相同输入或
重新建立带版本/哈希的候选来源，不要创建空目录掩盖缺失，更不要覆盖正式数据来凑测试通过。

### 其他顶层目录

- `.tmp`：混合研究下载、探针、反汇编、日志及外部参考工具，版本需逐件确认；其中另一个
  `Gameplay.Beyond.dll.cs` 不能仅凭名字替代同批 static 符号。
- `.tmp-old-baseline-decoded`、`.tmp-old-baseline-missing-20260809`、`.tmp-liino-skilldata-20260809`：
  历史基线/缺项/梨诺数据暂存，本轮未逐文件审计，不自动清理。
- `.idea`：工作区 IDE 配置；`fear-value-rpg`：其他项目，本任务不涉及，未审计内部内容。
- `C:\Users\sqwat\AppData\Local\Temp`、`.codex/attachments`：用户图片/粘贴文件等会话输入；
  它们不是持久证据仓库，后续关键结论需写入版本化文档。

## 4. 新会话接什么，不接什么

当前主任务是**投射物完整回调技能宿主迁移**，服务于真实旧轴对照，不是重新做编辑器。
先读 `current-context.md` 顶部、`docs/next/projectile-callback-host-design.md`，再读当前
combat-spec 工作树的 `docs/launch-projectile-skill-routing.md`、`Runtime/Skill.cs`、`Runtime/AbilitySystem.cs`
（代码位于 `src/EndfieldCombatSpec.Core` 下）。

未提交成果包括：回调费用元数据贯通、显式宿主身份、共享实例ID与来源目录、可选玩家技能分类、
SkillResourceAccount 端口，以及对象类型从数字掩码改为可读集合。旧原生过滤样本是从
`src/data/projectiles` 移到转换器 `test/fixtures`，不是误删证据。

尚未完成：真实实体账户、初值/上限及池化边界、非干员资源回执、完整释放准入，以及删除
`ProjectileCallbackActionRuntime`。不能把测试假账户或公共接口完成当成正式路径迁移完成。
最近数轮只取证并补文档：已确认历史回收顺序“中断技能→reset通知→ClearSource”，
以及Setter不限角色；**没有证明投射物初始能量或复用时恒为零**。不要反复扫描相同历史入口。

接续可做：补实际分配/复用调用链与同版本当前包输入；或先整改支付回执仍绑定operator的结构，
明确它不解决初值缺口。最终须回到正式装配和真实轴验收，不能长期停留在接口与文档上。

必须保留的边界：原生事实先进入combat-spec，Endaxis按单敌人/敌人无主动行为/全部命中场景归约；
不猜游戏规则，不引入无关空间模拟。数值对象类型编码只在来源解析边界，契约和运行时用可读名称。
转换器与本体不互相依赖，不重复实现公共逻辑；**不得再改技能块文字**。

## 5. 验证与操作

本轮没有提交、推送、拉取、迁移工作树或清理文件。新会话先查看状态，勿 `git reset/clean`。

```powershell
Set-Location C:\Users\sqwat\Projects\zmd\Endaxis-game-data-refactor
git status --short --branch
git log -10 --oneline
git worktree list
git -C C:\Users\sqwat\Projects\zmd\combat-spec-operator-completion status --short --branch
git -C C:\Users\sqwat\Projects\zmd\combat-spec-operator-completion log -10 --oneline
```

按改动选用 `npm run type-check`、`type-check:game-data-contract`、`type-check:game-data-production`、
`type-check:game-data`。定向运行例如：

```powershell
npx vitest run src/core/combat/runtime/projectileLifecycleRuntime.test.ts src/core/combat/runtime/projectileFinishCallbackRuntime.test.ts
```

最近实际验证：上述2文件17项通过；此前对象类型收尾的运行时/事件及源类型88文件1185项通过，
四项类型检查通过。全量转换器首次1780通过/5失败/2跳过；超时对应3文件24项单worker重跑通过，
仍有一项 Windows symlink EPERM，不能称全绿。以上是历史执行结果，本轮仅文档检查。
资产依赖测试先解决本机缺失来源，不许跳过或伪造数据掩盖问题。

反汇编工具在 **combat-spec工作树**，不在Endaxis：

```powershell
Set-Location C:\Users\sqwat\Projects\zmd\combat-spec-operator-completion
python tools/disassemble_method.py C:\Users\sqwat\Projects\zmd\combat-runtime-dumps\1.4.4\IL2CPP_GameAssembly.runtime.bin 0x03418F00 --layout virtual-rva --size 0x19C
```

地址是该历史快照的已知入口。不要从指令中间开始、混用版本、把全文件字节匹配当完整调用图。
本轮没有启动或核对Vite/VFS服务；5173、8765是历史常用端口，不保证正服务于这些工作树。
SSH补充验证见第7节，不等于核验远端数据或服务。

## 6. 可直接给新会话的提示词

> 当前环境是 Windows 笔记本（本机），不是台式机。Shell是PowerShell，工作区根目录是
> C:\Users\sqwat\Projects\zmd。D:\Projects属于台式机记录，不是本机命令路径；
> 不要因同步来的历史文档写了台式机就切换环境，也不要未经核对假定远程服务可达。
> 在本机接续 Endaxis。工作树是 C:\Users\sqwat\Projects\zmd\Endaxis-game-data-refactor，
> 分支 refactor/common-game-data；规格工作树是 C:\Users\sqwat\Projects\zmd\combat-spec-operator-completion，
> 分支 refactor/operator-completion。先读 docs/handoff/2026-09-10-local-workspace.md、
> current-context.md、docs/next/projectile-callback-host-design.md、编译器和独立契约README，
> 再核对两个工作树git状态。保留全部未提交修改。先总结本机可用输入和剩余任务，再继续
> 投射物完整回调宿主迁移；不要重复取证，不猜能量初值，不修改技能块文本，不清理其他旧工作树。
> 本机可通过Tailscale和OpenSSH连接台式机，详见第7节；不要默认远端不可访问，
> 不要把本机缺少文件等同于台式机也缺少。

## 7. 笔记本连接台式机的能力

### 本轮实测

2026-09-10，本机Tailscale身份laptop-t9r4og3d，地址100.64.0.29；台式机
desktop-icrc4fk，地址100.64.0.64，SSH用户Admin。以下短时只读命令成功、退出0，
返回DESKTOP-ICRC4FK，无需口令交互：

```powershell
ssh -o BatchMode=yes -o ConnectTimeout=8 -o ConnectionAttempts=1 -o StrictHostKeyChecking=yes Admin@100.64.0.64 hostname
```

OpenSSH的ssh/scp/sftp位于`C:\WINDOWS\System32\OpenSSH`，Tailscale位于
`C:\Program Files\Tailscale\tailscale.exe`。本机`.ssh`存在默认id_ed25519、对应公钥和
known_hosts；没有自定义config。本轮只检查文件名，未读取私钥。不要复制或提交凭据。
这是普通OpenSSH经Tailscale网络连接，不代表已经验证Tailscale SSH产品功能、RDP或图形远控。

### 远程命令

可通过SSH只读检查台式机仓库、文件、哈希、进程、服务；在用户任务授权内执行构建或导出。
优先显式调用远端PowerShell，不猜默认shell；长脚本可用EncodedCommand避免多层转义，
但编码不是加密，不能把秘密放入命令或日志。连接成功不授权任意改远端文件、注入或提权。

```powershell
# 只显示相关两台设备，避免输出整个网络的其他设备信息
tailscale status | Select-String '100\.64\.0\.(29|64)\s'
# 只读命令形式示例，明确远端使用PowerShell
ssh -o BatchMode=yes -o ConnectTimeout=8 Admin@100.64.0.64 powershell.exe -NoProfile -NonInteractive -Command Get-Date
```

### VFS端口转发（本轮未建立）

先核实远端服务真实端口、本机端口空闲，再使用SSH转发访问远端localhost，不必把VFS公开到公网。
例如远端VFS为8765、本机选18765时：

```powershell
ssh -N -o BatchMode=yes -o ExitOnForwardFailure=yes -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -L 127.0.0.1:18765:127.0.0.1:8765 Admin@100.64.0.64
```

该进程持续占用终端，本机`http://127.0.0.1:18765`转到台式机8765；结束该SSH会话关闭转发。
转发不会启动VFS，SSH成功也不代表VFS就绪。后台启动须隐藏窗口并记录准确PID，避免误杀其他服务。
此处是能力说明，不代表本轮已建立隧道或验证API。

### 文件传输与大文件

本机scp/sftp可拉取已核实路径的文件，命令形式如
`scp 'Admin@100.64.0.64:D:/Projects/<已核实文件>' '<本机新目标路径>'`。
占位符不是现存路径；含空格路径需妥善引用，复杂情况使用sftp核对。
保存到本任务独立tmp目录，校验SHA256并记录版本、符号及模块布局，不覆盖冻结来源。
大量碎文件可在授权范围内远端打包后传输；不要打包整个用户目录、密钥或其他无关数据。

用户此前偏好大文件尽量走更快的公网，并提出远端打包上传百度网盘、本机下载。
该路线可作为备选，但本轮未验证网盘账号、上传工具或下载接口，不能声称已有自动网盘能力。
需要时先核实登录与工具，只传授权证据包，不创建公开分享、不上传凭据。

### 故障分层

- Tailscale目标是否可见，连接是直连还是中继；需要时先看`tailscale ping --help`再短时探测。
- SSH超时/连接拒绝：区分网络、sshd和防火墙，不能直接写成关机或密钥未授权。
- `Permission denied (publickey)`：才进入用户/授权排查，不自动换钥匙或改authorized_keys。
- 主机密钥变化：单独核验，不删除known_hosts或禁用校验来掩盖告警。
- SSH成功但VFS失败：查远端监听、服务版本和隧道，不能归咎SSH认证。

历史有中继/会话不稳定导致超时的记录；短命令成功不保证大文件传输速度。
记录每次实际验证范围，不把一次成功永久写成在线，也不把一次失败当成能力不存在。
