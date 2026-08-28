# 2026-08-28 同步交接检查点

## 从哪里接手

| 仓库 | 本机工作树 | 分支／远端 |
| --- | --- | --- |
| Endaxis | `C:\Users\sqwat\Projects\zmd\Endaxis-game-data-refactor` | `refactor/common-game-data` → `origin/refactor/common-game-data` |
| combat-spec | `C:\Users\sqwat\Projects\zmd\vfs-index-browser\combat-spec` | `main` → `origin/main`，独立仓库 |
| vfs-index-browser | `C:\Users\sqwat\Projects\zmd\vfs-index-browser` | `master` → `origin/master`，本轮无正式代码改动，核对基线 `21b88d1` |

本批配套 combat-spec 提交为
[`b807d7f`](https://github.com/SQwatermark/combat-spec/commit/b807d7f9768d701e199b9271ac0be20358dfdf15)。
Endaxis 检查点由包含本文的提交标识，接手时将两端一起同步，不用旧规格验收新转换行为。

本批提交覆盖 Endaxis 与 combat-spec 多轮累积修改，不只是最后一次目标查询修正。
VFS 的 `.tmp-*`、Endaxis 的 `tmp/` 和大型 runtime dump 均不提交、不删除。
AnimeStudio、IL2CPP-Dumper 本轮没有源码修改；其他专题工作树不在本次提交范围。

先阅读本文、[当前上下文](current-context.md)、[编译器契约](../../tools/game-data-compiler/README.md)、
[独立数据契约](../../packages/game-data-contract/README.md)，再看最近 diff。
历史记录中的“未提交”“当前分支”“最新数字”只描述当时，不能覆盖本检查点。

## 已经做了什么

- 标签完成单向迁移：转换器 source 层解析原生数字，正式契约、运行时与编辑器使用可读字符串路径，
  不来回哈希／反查。完整配置集有 6806 条唯一非空路径；预定义 175 标签、61 查询、36 免疫规则。
- 公共 Action 管线补齐 Switch、DoOnce 的已证实切片、Buff 层数／黑板读取、物理异常相关依赖。
  编译器、契约与标准运行入口同步接线；不是为单个干员单独实现一套动作系统。
- 无效分支自叶到根删除，纯条件随空分支一并回收；有效副作用、黑板写入与被消费的返回值保留。
  未实施通用黑板死写删除或未经证实的分支值提升。
- 普通根倒地、隐式状态 Buff、消费者门禁及标准模拟装配已接通。固定木桩不模拟攻击、红圈、
  移动与起身动画，但保留伤害、破防、Buff、免疫、标签和干员事件的可观察结果。
- 余烬战技的角度范围分支按固定命中边界裁剪；庇护载体及父子闭包保留。真实战技两次施放探针通过，
  覆盖首次破防、再次倒地和庇护开关；探针手动注入天赋开关，不等于原始养成装配验收。
- combat-spec 已复刻余烬连携的排除 Context 与最低 HP 比例筛选，并验证保存身份后的治疗。
  Endaxis 来源层保留实际排除引用，不再把 `Main` 名称猜成主控，也不把 Owner 直接猜成 caster。

## 完成度与尚未解决的阻塞

主动技能矩阵 **172/309，5 名整名定义完成**：秋栗、艾维文娜、狼卫、赛希、伊冯。
余烬 **8/9**，未发布完整定义；不能把底层能力或战技探针通过计成整名完成。

下一步只推进同一条纵向闭环：

1. 按[队友目标快照](../research/character-team-target-snapshots.md)接公共契约查询操作和
   TargetContextOperationExecutor，实际保存实例集合；同时替换主控查询“只记录编译期别名”的快捷路径。
2. 治疗读取 Context，复用公共治疗结算；不调用旧的治疗时最低血量重选枚举。
   明确近似等权时 Next 的可复现身份／并列策略，不冒充游戏进程对象哈希，不默认队伍首项。
3. 真实连携及闭包通过后，处理物理公共 Buff 归属、原始天赋／潜能装配、余烬整名生成，再重跑全量矩阵。

继续遵守：原生规则以 combat-spec 同版本证据为准；工具与本体不相互依赖；公共定义归属唯一；
注释中文；不修改旧版业务代码；不因为来源形状已识别就宣称运行时已支持。

## 可复验结果与命令

最近验收：Next／转换器 **349 文件、4175 项全部通过**；四套类型检查通过。
combat-spec **1531 通过、14 项既有失败**，目标查询相关 **108 项通过**。
既有失败的分类和恢复方式见该仓库 `docs/handoff-2026-08-28.md`，未放宽或跳过。

从 Endaxis 工作树执行：

```powershell
npm run type-check:game-data
npm run type-check:game-data-production
npm run type-check:game-data-contract
npm run type-check:next
npx vitest run tools/game-data-compiler src/next --maxWorkers 4 --testTimeout 60000
```

完整矩阵复验（只写忽略目录，不覆盖正式定义）：

```powershell
npm run audit:game-data:operator-active-skills -- --manifest scripts/generate_next_operators/operators.json --source-root tmp/game-data-sources --skill-patch-table tmp/game-data-sources/TableCfg-1.4.4-9433094-12/SkillPatchTable.json --buff-data-root tmp/game-data-sources/BuffData --ability-entity-catalog src/next/data/ability-entities/ability-entity-templates-1.4.4.json --projectile-blackboard-catalog src/next/data/projectiles/projectile-entity-blackboards-1.4.4.json --gameplay-tag-catalog src/next/data/combat/gameplayTagCatalog.generated.ts --time-dilation-catalog src/next/data/combat/timeDilationCatalog.ts --legacy-generated-root src/next/data/operators/generated --formal-active-skill-root src/next/data/operators/generated-active-skills --audit-output tmp/operator-active-skill-audit
```

源码和正式产物由 Git 同步；原始资源缓存须另行复制或按编译器 README 的下载入口恢复。
资源清单由 Endaxis 的 `tools/game-data-compiler/akedb-sources.json` 管理，优先 AKEDB，
缺失时显式配置 VFS fallback；不要把自动升级到最新 CDN 当作当前版本复现。
原生运行镜像使用 virtual-rva 布局，版本、SHA-256 和方法 RVA 已记录在各研究专题中。
