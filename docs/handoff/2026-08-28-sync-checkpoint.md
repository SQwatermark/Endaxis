# 2026-08-28 同步交接检查点

> **历史快照。** 本文用于追溯 2026-08-28 当时的证据、阻塞和决策，不再是推荐的当前接手入口。
> 当前有效覆盖率、分支和下一步以 [当前任务快照](current-context.md) 为准；目前生成基线已达到
> 30/30 名干员、310/310 个声明为主动的技能和 30/30 份完整正式定义。

## 从哪里接手

| 仓库              | 本机工作树                                                  | 分支／远端                                                         |
| ----------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| Endaxis           | `C:\Users\sqwat\Projects\zmd\Endaxis-game-data-refactor`    | `refactor/common-game-data` → `origin/refactor/common-game-data`   |
| combat-spec       | `C:\Users\sqwat\Projects\zmd\vfs-index-browser\combat-spec` | `main` → `origin/main`，独立仓库                                   |
| vfs-index-browser | `C:\Users\sqwat\Projects\zmd\vfs-index-browser`             | `master` → `origin/master`，本轮无正式代码改动，核对基线 `21b88d1` |

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
- Endaxis 已进一步将该来源事实贯通为公共 Context 查询步骤、运行时身份快照及 Context 治疗。
  0.001 容差内采用稳定实例 ID 作为产品决胜投影，不冒充原生对象哈希。余烬 9 项主动技能已
  全部编译并逐项排轴模拟，正式整名产物已注册为第六名完整干员。

## 完成度与尚未解决的阻塞

主动技能矩阵 **173/309，6 名整名定义完成**：秋栗、艾维文娜、狼卫、赛希、伊冯、余烬。
余烬 **9/9**，完整定义含 2 天赋、5 潜能、5 私有 Buff 和 11 公共 Buff，已经正式注册。

本检查点原定的余烬纵向闭环已经完成；下一步恢复横向覆盖：

1. 从主动审计中选择接近完整的干员，先处理会改变敌方伤害、失衡、元素状态、资源或技能可用性的阻塞。
2. 每补一项公共机制就重跑 30 名 / 309 技能审计；达成整名候选后继续验证天赋、潜能、私有／公共
   Buff 闭包，并将全部技能逐项放上时间轴模拟。
3. 只依赖敌人主动行为或对当前木桩结果不可见的护盾、霸体、移动等机制先记录；不为完整复刻表象
   扩张模型。继续保持公共定义唯一归属和未知语义失败关闭。

继续遵守：原生规则以 combat-spec 同版本证据为准；工具与本体不相互依赖；公共定义归属唯一；
注释中文；不修改旧版业务代码；不因为来源形状已识别就宣称运行时已支持。

## 可复验结果与命令

最近验收：Next／转换器 **349 文件、4181 项全部通过**；四套类型检查通过。
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
npm run audit:game-data:operator-active-skills -- --manifest scripts/generate_next_operators/operators.json --source-root tmp/game-data-sources --skill-patch-table tmp/game-data-sources/TableCfg-1.4.4-9433094-12/SkillPatchTable.json --skill-setting-catalog src/next/data/combat/skill-setting.combat-1.4.4.json --buff-data-root tmp/game-data-sources/BuffData --ability-entity-catalog src/next/data/ability-entities/ability-entity-templates-1.4.4.json --projectile-blackboard-catalog src/next/data/projectiles/projectile-entity-blackboards-1.4.4.json --gameplay-tag-catalog src/next/data/combat/gameplayTagCatalog.generated.ts --time-dilation-catalog src/next/data/combat/timeDilationCatalog.ts --legacy-generated-root src/next/data/operators/generated --formal-active-skill-root src/next/data/operators/generated-active-skills --audit-output tmp/operator-active-skill-audit
```

源码和正式产物由 Git 同步；原始资源缓存须另行复制或按编译器 README 的下载入口恢复。
资源清单由 Endaxis 的 `tools/game-data-compiler/akedb-sources.json` 管理，优先 AKEDB，
缺失时显式配置 VFS fallback；不要把自动升级到最新 CDN 当作当前版本复现。
原生运行镜像使用 virtual-rva 布局，版本、SHA-256 和方法 RVA 已记录在各研究专题中。
