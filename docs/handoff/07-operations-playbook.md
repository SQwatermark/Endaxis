# 操作与恢复手册

## 1. 新会话开始时

按顺序执行：

```powershell
Set-Location C:\Users\sqwat\Projects\zmd\Endaxis
git status --short
git branch --show-current
git log -10 --oneline
```

然后阅读：

1. `docs/handoff/README.md`；
2. `docs/handoff/current-context.md`；
3. 与当前任务对应的 `docs/next` 或 `docs/research`；
4. 最近提交 diff。

不要根据长对话中的旧状态直接修改代码。用户可能已切分支、提交、搁置或合并上游。

## 2. Endaxis 本地开发

安装依赖后启动：

```powershell
Set-Location C:\Users\sqwat\Projects\zmd\Endaxis
npm.cmd install
npm.cmd run dev -- --host 0.0.0.0
```

常用入口：

- 旧版：`http://127.0.0.1:5173/timeline`
- Next：`http://127.0.0.1:5173/next/timeline`

若端口被占用，Vite 会选择其他端口；应读取终端输出，不要假定仍是 5173。

验证命令：

```powershell
npm.cmd run type-check:next
npm.cmd run test:next
npm.cmd run bench:next
npm.cmd run format:check
```

修改跨层核心逻辑时运行全量 Next 测试；局部 UI helper 可先跑相关测试，但结束前仍应至少执行类型检查。UI 修改必须在浏览器实测，尤其检查不同缩放、准备区、战斗区、弹窗和快捷键作用域。

## 3. 干员生成器

目录：

`C:\Users\sqwat\Projects\zmd\Endaxis\scripts\generate_next_operators`

先阅读该目录 README，再运行其 unittest。典型操作以当前 README 为准，不要硬编码已过期参数。通用测试方式：

```powershell
Set-Location C:\Users\sqwat\Projects\zmd\Endaxis
python -m unittest discover scripts\generate_next_operators -p "test_*.py"
```

生成器约束：

- 输出直接进入 `src/next/data/operators/generated`；
- 审计 JSON/Markdown 不应删除，便于比较自动与手写定义；
- 生成前固定 AKEDB/CDN 版本；
- 未知数据报错；
- 不读取旧 TS 弥补缺值；
- 人工规则写独立配置，不藏在 renderer；
- 修改解析规则后对所有干员跑审计，不只看庄方宜样本。

## 4. Combat Spec

```powershell
Set-Location C:\Users\sqwat\Projects\zmd\vfs-index-browser
dotnet test combat-spec\EndfieldCombatSpec.sln
dotnet run --project combat-spec\src\EndfieldCombatSpec.Cli
```

常用严格验证入口包括：

- `validate-potential-talent`
- `validate-loadout-tables`
- `calculate-client-deck`
- `validate-buffs`

参数和输入格式以 `combat-spec/README.md` 与 `combat-spec/docs` 为准。

新增行为时：

1. 找到版本化证据；
2. 在 `CombatEvidence` 标注等级；
3. 写最小可观察 trace 测试；
4. 保留未知分支；
5. 再决定 Endaxis Next 的等价映射。

## 5. AKEDB CDN 检查

首先访问：

```text
https://data.akedata.wiki/manifest.json
```

SkillData/BuffData 清单：

```text
https://data.akedata.wiki/public/Json/SkillData/manifest.json
https://data.akedata.wiki/public/Json/BuffData/manifest.json
```

检查新干员时至少核对：

- CharacterTable；
- 展示技能和本地化；
- SkillPatchTable；
- CharacterPotential/Talent；
- SkillData 清单；
- BuffData 清单。

只有 BuffData 没有 SkillData 时，可以研究 Buff 效果和逐级参数，但不能断言完整技能时序。

本地 `AKEDatabase` 用于查前端如何拼 URL、解释字段和渲染富文本。当前导出脚本不应再依赖本地 AKEDatabase 的 TableCfg 文件。

## 6. VFS 浏览器

本地仓库：

`C:\Users\sqwat\Projects\zmd\vfs-index-browser`

先读 `README.md` 和 `docs/README.md`。服务入口和参数以仓库 README 为准。历史上远程服务为：

`http://<remote-host>:8765/`

VFS 工作流：

1. 读取本地游戏 VFS 索引；
2. 将 `manifest.hgmmap` 暴露为虚拟逻辑目录；
3. 点击逻辑资源时定位对应 AB；
4. 按需读取 Container 内对象；
5. 按文件类型调用解密/解析器；
6. 通过 API 预览或下载。

性能原则：只读当前路径所需元数据，后台缓存逻辑目录，不在打开文件夹时全量调用 AnimeStudio 扫描全部 AB。

## 7. AnimeStudio

仓库：

`C:\Users\sqwat\Projects\zmd\AnimeStudio`

修改前必须检查分支和已有文档：

```powershell
git -C C:\Users\sqwat\Projects\zmd\AnimeStudio status --short
git -C C:\Users\sqwat\Projects\zmd\AnimeStudio log -5 --oneline
```

它是底层解析库，修改后至少应：

- 保留真实资源样本的回归；
- 检查旧的 GameObject/Transform、模型、材质和动画导出没有消失；
- 更新对应 `docs/endfield-*`；
- 编译产物与源码提交一致；
- 不在 vfs-index-browser 中保留一个不可用的旧回退路径。

## 8. IL2CPP 运行时采集

远程 Windows 常用游戏路径：

`D:\Hypergryph Launcher\games\Endfield Game\Endfield.exe`

历史探针项目：

`D:\Projects\combat-probe`

典型探针命令曾为：

```powershell
python -m tools.probe_runtime_rvas docs\combat-runtime-probes.json --bytes 64 --output runtime-probes.json
```

但当前更完整的采集使用 IL2CPP-Dumper 的版本化 MethodProbes；运行前应阅读当前 README，不能照抄旧命令。

注意事项：

- 需要管理员权限才能枚举或读取某些进程模块；
- Dumper 可能自己启动游戏，已运行客户端时不一定能启动第二实例；
- 先确认进程名和模块名，不要仅凭窗口存在；
- 尽量一次批量 dump 多个低风险目标；
- 崩溃后检查 bin/json 是否已生成，再决定是否重跑；
- 采集结束立即复制到 `combat-runtime-dumps/<version>`；
- 记录探针清单、客户端版本和哈希。

## 9. 远程主机连接

历史地址：

- `192.168.199.183`
- `192.168.149.17`
- `100.64.0.64`（Tailscale）

用户：`Admin`。

连接前先测试：

```powershell
Test-NetConnection 100.64.0.64 -Port 22
ssh Admin@100.64.0.64
```

若不通，可能是：

- 当前不在同一 Wi-Fi；
- DHCP 地址变化；
- Tailscale 未上线；
- Windows OpenSSH 服务未启动；
- 防火墙未放行。

不要在文档里把某个历史 IP 写成永久目标。家庭路由器可通过 DHCP 静态租约为设备固定局域网 IP，但 Tailscale 地址是更适合跨网络访问的稳定入口。

## 10. Git 工作方式

- 先检查 dirty worktree；
- 不回退用户修改；
- 独立成果精确暂存、独立提交；
- 研究文档、底层工具和 Endaxis 功能不要混成一个提交；
- 用户说“不要提交”时只修改和验证；
- 创建上游贡献分支时基于明确上游提交，避免连带本地研究内容；
- AKEDatabase 和音频等大资源必须通过 `.gitignore` 排除，不推到 Endaxis 仓库。

## 11. 排障索引

### 页面一直显示加载中

检查应用层 Promise 是否 resolve、目录加载是否异常、Vue 控制台错误和是否请求了不存在的生成干员。不要用静态占位绕过错误。

### 曲线和合法性警告不一致

确认二者是否来自同一个 simulation receipt。禁止在 warning 模块维护第二份 SP/能量账本。

### 撤销只能一次

检查项目快照中是否包含每次恢复都会生成新 UID 的派生对象，尤其匿名 patchHit/effect。历史栈只保存稳定项目输入，恢复后确定性重算派生对象。

### 新干员生成缺内容

先检查 AKEDB 是否缺根 SkillData，再查 VFS 本地数据和版本。不要用旧 TS 补齐后声称自动生成完整。

### AnimeStudio 突然无法导出 Prefab

确认使用的构建是否来自当前分支、是否保留 GameObject/Transform snapshot 功能、VFS 是否传入正确 Bundle/CAB map。不要留一个明确无效的兼容回退。

### 远程服务 502/无法连接

先 SSH，确认进程、端口和日志；远程主机重启后服务不会自动存在。读取当前启动命令，不要盲目重复浏览器刷新。

## 12. 任务结束检查

1. `git diff --check`；
2. 运行对应类型检查和测试；
3. UI 工作做浏览器实测；
4. 更新状态和证据文档；
5. 检查没有误改旧版或其他工作区；
6. 向用户说明改了什么、验证了什么、未完成什么；
7. 若提交，列出提交哈希和范围。
