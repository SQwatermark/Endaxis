# 项目与工具总览

本文说明整个工作区里每个项目的职责、输入输出和边界。路径以当前 Windows 工作区 `C:\Users\sqwat\Projects\zmd` 为基准。

## 1. Endaxis

- 路径：`C:\Users\sqwat\Projects\zmd\Endaxis`
- 主要远端：`https://github.com/SQwatermark/Endaxis.git`
- 上游远端：`https://github.com/Lieyuan621/Endaxis.git`
- 当前任务：开发 `src/next` 中的新项目模型、编译器、战斗运行时、投影和并行 UI。

Endaxis 是最终面向用户的应用。它不负责直接解密游戏文件，也不应在运行时依赖 AnimeStudio 或 IL2CPP Dumper。研究工具的结论必须先转化为稳定数据、DSL、适配器和测试，才能进入生产应用。

主要目录：

- `src/next/core`：框架无关的领域模型、编译器、模拟器和投影；
- `src/next/data`：新 DSL、目录和旧数据适配；
- `src/next/application`：打开项目、运行场景等用例；
- `src/next/ui`：Vue 页面、组件、ViewModel、快捷键和主题；
- `scripts/generate_next_operators`：从原始数据生成干员 DSL 和审计文件；
- `docs/next`：长期架构文档；
- `docs/research`：具体机制和生成覆盖率证据；
- `docs/handoff`：跨项目交接总览。

## 2. AKEDatabase 与 AKEDB CDN

- 本地参考前端：`C:\Users\sqwat\Projects\zmd\AKEDatabase`
- 仓库：`https://github.com/NagiYume/AKEDatabase.git`
- CDN：`https://data.akedata.wiki`
- 当前本地参考版本：`31c3b875`，README 标注含 Baker 模块。

AKEDatabase 是一个浏览和解释终末地数据的前端项目；真正用于当前导出的结构化数据已迁移到 CDN。克隆仓库主要用于研究：

- TableCfg 和 v3 数据的请求路径；
- 干员、武器、装备、敌人、技能和 Buff 的字段映射；
- 游戏富文本标签、术语、图标和本地化规则；
- SkillData、BuffData、Baker 等模块的展示和解析方式。

典型 CDN 入口：

- `/manifest.json`：数据版本和总清单；
- `/public/Json/SkillData/manifest.json`：SkillData 文件清单；
- `/public/Json/BuffData/manifest.json`：BuffData 文件清单；
- TableCfg 及本地化文件由清单和版本路由决定具体路径。

边界：AKEDB 是高价值静态数据源，但不是客户端完整运行时。某个技能可能只有 CharacterTable、SkillPatch 和 BuffData，没有根 SkillData；客户端通用代码、热更逻辑和帧执行顺序也不一定能从它单独证明。

## 3. vfs-index-browser

- 路径：`C:\Users\sqwat\Projects\zmd\vfs-index-browser`
- 当前分支：`master`
- 当前提交：`e5a59c4 Research : 添加Buff标签生命周期探针`
- 远程服务历史端口：`8765`

这是独立的本地游戏文件浏览与研究平台，不属于 Endaxis 页面。它的核心目标是：只要机器安装了游戏，就能按逻辑路径浏览、按需提取、预览和下载资源，而不依赖远程 CDN。

它将资源读取拆为三层：

1. VFS 物理读取：知道加密压缩块、文件边界和按索引读取方法；
2. Manifest 逻辑目录：解析 `manifest.hgmmap`，把逻辑资源路径映射到具体 Bundle；
3. 内容解析：按类型调用 SparkBuffer、MemoryPack、AnimeStudio、Wwise 等解析器。

主要能力包括：

- `manifest.hgmmap` 逻辑目录浏览，无需先用 AnimeStudio 全扫所有 AB；
- AB/Container 二级内容按需展开和同路径聚合；
- TableCfg/SparkBuffer 解密；
- MemoryPack 二进制 JSON schema 研究和部分解码；
- 模型、材质、纹理、动画、Shader 的组合预览和导出；
- PCK、WEM、WAV、HIRC、AudioDialog 的索引与播放；
- IL2CPP 类型索引、RVA 反汇编和运行时探针分析；
- 战斗系统研究文档与 C# Combat Spec。

当前仓库包含大量研究修改，不能为了 Endaxis 任务随意清理或回退。生产模块、实验产物和研究证据应保持边界：正式服务不能依赖某个临时 `.blend`、截图或手工缓存才能工作。

## 4. AnimeStudio

- 路径：`C:\Users\sqwat\Projects\zmd\AnimeStudio`
- 当前分支：`feature/endfield-animation-acl`
- 当前提交：`8cdec96 feat: resolve shader resource bindings`

AnimeStudio 是 C# 编写的 Unity 资源解析和导出工具。在本项目中，它不是一次性第三方命令，而是经过修改、需要版本管理和测试的底层组件。

目前承担的专门任务包括：

- 导出 GameObject / Transform 对象快照；
- 解析 Mesh、Material、Texture 和资源引用；
- 解析普通角色 Prefab 与 NPC AvatarMesh 所需对象；
- 解码 ACL 动画、骨骼、BlendShape 和动画片段；
- 导出 Shader 程序容器、变体、参数记录和资源绑定信息；
- 为 vfs-index-browser 提供结构化中间产物，而不是直接控制网页业务。

边界：

- AnimeStudio 负责正确读取 Unity/终末地资源格式；
- vfs-index-browser 负责定位资源、组合语义对象、缓存、提供 API 和网页；
- Blender/GLB 输出策略属于上层模型管线；
- 修改 AnimeStudio 源码后必须记录原因和回归样本，不能临时重编译后丢失功能。

## 5. IL2CPP-Dumper

- 路径：`C:\Users\sqwat\Projects\zmd\IL2CPP-Dumper`
- 仓库：`https://github.com/DeftSolutions-dev/IL2CPP-Dumper.git`
- 当前分支：`feature/comprehensive-runtime-dump`
- 当前提交：`64685c3 Add safe IFix patch probes`

该工具用于从终末地 IL2CPP 客户端获取静态与运行时证据。当前分支增加了面向战斗系统的批量方法探针、IFix 热更新分支和更完整的 dump 能力。

它能提供：

- IL2CPP 类型、字段、方法和枚举信息；
- 指定 MethodInfo/RVA 的代码与元数据；
- 游戏运行时加载后的模块和热更入口；
- 批量探针清单对应的二进制与 JSON 快照；
- 原生实现与 IFix 补丁分支的对照线索。

运行时采集通常需要用户启动游戏或 Dumper，并可能需要管理员权限。历史上出现过 `WinError 5`、无法启动第二客户端和 `fatal error in gc collecting from unknown thread`，因此探针应尽量批量、只读、版本化，避免反复注入和高风险扫描。

## 6. combat-runtime-dumps

- 路径：`C:\Users\sqwat\Projects\zmd\combat-runtime-dumps`
- 当前主要版本目录：`1.4.4`

这里保存已经从远程主机拉回本地的运行时证据，包括：

- 原始 runtime bin/json；
- MethodProbes 清单；
- 技力、终结技能量、技能可用性、Buff、伤害处理器、事件和条件等分析 JSON；
- IFix 相关快照。

这些文件通常较大，不应直接进入 Endaxis 浏览器包，但它们是研究可复现性的关键输入。任何从中得出的结论都应标明游戏版本和具体分析文件。

## 7. Endfield Combat Spec

- 路径：`C:\Users\sqwat\Projects\zmd\vfs-index-browser\combat-spec`
- 解决方案：`EndfieldCombatSpec.sln`

这是独立的 C# 可执行战斗规格，目标是根据反编译、运行时探针和原始配置，尽可能 1:1 复刻客户端后端战斗行为。它不是“把旧 Endaxis 翻译成 C#”，也不是为 UI 定制的简化模拟器。

它的价值是：

- 让文字结论变成可执行代码和测试；
- 明确 `Confirmed`、`Inferred`、`Unknown` 的证据等级；
- 用 trace 验证同帧动作的先后顺序；
- 严格解析 TableCfg、SkillData、BuffData，遇到未知结构即失败；
- 为 Endaxis Next 提供行为参照，但不要求 Next 复制其内部结构。

已覆盖的测试模块非常广，包括资源、技能生命周期、时间轴动作、Buff、属性、伤害、元素附着、连携、事件、条件、天赋潜能、装备套装和面板计算。具体完成度见本仓库 README 和 `docs`，不能仅凭测试文件名认定行为已完全闭环。

## 8. vfs-index-browser-audio 与 audio-dialog 工作区

- `C:\Users\sqwat\Projects\zmd\vfs-index-browser-audio`
- `C:\Users\sqwat\Projects\zmd\vfs-index-browser-audio-dialog`

这两个是从 VFS 浏览器分出的专题工作区，用于并行研究而避免主线冲突：

- Wwise PCK/HIRC/Media 关系；
- AudioDialog 从逻辑台词路径到音频媒体 ID 的映射；
- 其他音乐、音效的语义索引；
- 模型、材质、Shader 和 Blender 导出的部分专题实验。

它们不是三个需要永久并存的产品。合并成果时应提取清晰模块和测试回主仓库，避免长期产生三份实现。

## 9. 外部参考仓库

### Variante/endfield_research_kit

- 本地浅克隆：`C:\Users\sqwat\Projects\zmd\.tmp-endfield-research-kit`
- 仓库：`https://github.com/Variante/endfield_research_kit.git`

用于参考终末地资源格式、故事恢复、角色模型和动画工具链。它是参考资料，不是当前服务运行依赖。

### SpectrumQT/EFMI-Package

用于对照终末地包格式和现有解析路线。需要以代码和真实样本验证可复用部分，不能因为仓库能播放或导出某类资源就假设其覆盖所有版本。

### ShiyumeMeguri 相关仓库

- `RuriRipperImporter`：模型、材质和 Blender 组装流程参考；
- `FractalMiner/Assets/Project/EndField`：终末地 Shader 和材质语义参考；
- `Ruri.ShaderDecompiler`、`RuriRipperPyBridge`、`AnimationRetarget` 等：Shader 解包、跨语言桥接和动画重定向参考。

项目倾向于学习数据结构和算法，自行实现适合当前架构的组件；是否直接引用必须单独评估许可证、版本和维护成本。

## 10. 远程 Windows 主机与游戏

游戏和完整资源位于远程 Windows 台式机。历史地址包括：

- 家庭局域网：`192.168.199.183`；
- DHCP 变化后：`192.168.149.17`；
- Tailscale：`100.64.0.64`；
- OpenSSH 用户：`Admin`。

游戏可执行文件历史路径为：

`D:\Hypergryph Launcher\games\Endfield Game\Endfield.exe`

远程研究项目历史上位于 `D:\Projects`，包括 `combat-probe`、AnimeStudio 构建产物和 VFS 服务。地址和服务是否可达不能靠历史记录推断，应先测试 SSH 和端口。服务一般运行在 `8765`，Endaxis 本地开发常用 `5173`。

## 11. 临时目录与搁置内容

工作区包含 `.tmp-*`、旧基线、临时 SkillData 和大型导出。它们可能是版本对照或尚未归档的证据，不应看到名称像临时文件就直接删除。

当前 Endaxis 中此前关于梨诺、新武器、本地化、导出脚本和两份架构文档的修改由用户主动搁置。接手时先检查 `git status`、stash/shelf 和分支，不要把它们重新实现一遍，也不要声称文件丢失。
