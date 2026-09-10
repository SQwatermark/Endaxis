# 台式机环境（远程历史记录）

**2026-09-10 本轮在笔记本编辑此文，仅通过SSH确认远端hostname为DESKTOP-ICRC4FK，
未核验远端仓库、游戏或服务。** 以下路径从既有交接拆出，
用于识别台式机环境，不是台式机的实时状态。当前笔记本请使用
[笔记本目录地图](2026-09-10-local-workspace.md)。两个环境不得互相覆盖或仅凭日期推断。

## 台式机历史路径

| 项目 | 历史路径 | 记录边界 |
| --- | --- | --- |
| Endaxis正式开发 | `D:\Projects\Endaxis` | 先前记录分支refactor/common-game-data；当前HEAD、脏状态未核验。 |
| Combat Spec | `D:\Projects\combat-spec` | 旧总览记录main；用户曾要求台式机合并分支，不能凭历史记录决定当前应操作哪个分支。先查status/worktree/log。 |
| VFS | `D:\Projects\vfs-index-browser` | 先前记录master；服务端口历史为8765，不保证运行或使用最新代码。 |
| AnimeStudio | `D:\Projects\AnimeStudio` | 先前记录feature/endfield-animation-acl；是否仍为VFS运行依赖需以当前配置核实。 |
| IL2CPP-Dumper | `D:\Projects\IL2CPP-Dumper` | 先前记录feature/comprehensive-runtime-dump；当前构建/采集权限未核验。 |
| 旧版Endaxis参考 | `D:\Projects\Endaxis-upstream-main` | 仅旧实现/UI参考，不是原生规则权威。 |
| 研究工具 | `D:\Projects\combat-probe` | 历史探针目录，存在性和内容待核验。 |
| 游戏 | `D:\Hypergryph Launcher\games\Endfield Game\Endfield.exe` | 历史安装路径；先核对当前游戏版本与进程。 |

## 连接与证据

历史SSH用户为Admin，Tailscale地址100.64.0.64；局域网曾使用192.168.199.183及
192.168.149.17。本轮Admin@100.64.0.64无交互SSH成功，局域网地址未验证。不记录私钥或口令。
笔记本侧连接、转发、传输与故障排查统一见[笔记本环境第7节](2026-09-10-local-workspace.md#7-笔记本连接台式机的能力)。
不能因一次失败就断定主机关机或密钥被改；需区分网络、认证和服务状态。

当前包A7D3F59A…模块、水弹完整前缀导出、hybrid-20260905和mz38x5审计结果见历史
研究文档。其台式机具体保存路径和现存状态需远程核验，**不能因笔记本没有就断言远程也没有**。
也不能将笔记本1.4.4历史模块替换成当前包证据。原始文件按版本、哈希配套传输，
不要把两个来源根静默覆盖合并。

## 在台式机新开会话时使用的提示词

> 当前运行环境是Windows台式机，不是笔记本。先核对D:\Projects下Endaxis、combat-spec、
> vfs-index-browser是否存在，以及各自git status、worktree和最近提交；上表分支只是历史记录，
> 不要擅自checkout或合并main。阅读docs/handoff/desktop-environment.md和current-context.md。
> C:\Users\sqwat\Projects\zmd的目录地图属于笔记本，不要复制成台式机命令。
> 明确本机游戏版本、来源缓存和运行时快照的实际位置，再继续当前任务；保留未提交内容。

此提示词仅用于真正切到台式机的会话。当前笔记本会话使用另一份文档中的提示词。
