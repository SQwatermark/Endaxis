# Endaxis Next 专题文档索引

- [武器与装备定义结构蓝图](./14-equipment-definition-blueprint.md)：配装定义、项目实例、静态贡献和事件能力的统一结构。

主干文档解释稳定架构；本页索引更深入、变化更频繁的专题设计和研究材料。

## 1. 项目、仓库与路线图

- [构筑编译调用链](../architecture/endaxis-next-build-compilation-flow.md)
- [模拟流水线、活动机制与性能](../architecture/endaxis-next-simulation-pipeline.md)
- [功能迁移矩阵](../architecture/endaxis-next-feature-matrix.md)
- [架构整改路线图](../architecture/endaxis-next-remediation-roadmap.md)
- [现状审计与迁移路线图](../architecture/endaxis-next-roadmap.md)

其中路线图记录阶段判断，可能随实现变化；主干职责以本目录为准。

## 2. 战斗系统

- [技能全生命周期与编辑语义](./11-skill-lifecycle.md)
- [SkillDefinition 数据结构蓝图](./12-skill-definition-blueprint.md)
- [时间冻结与时间投影](./13-time-freeze-and-projection.md)
- [玩家主动伤害流水线](../architecture/endaxis-next-damage-pipeline.md)
- [通用语义状态运行时](../architecture/endaxis-next-semantic-status-runtime.md)
- [处决和下落攻击](../research/finisher-and-plunging-attacks.md)
- [生命条件运行时语义](../research/check-hp-condition-runtime-semantics.md)
- [定时 Marker 研究](../research/native-timed-marker-runtime.md)
- [DoOnce 运行时语义](../research/do-once-action-runtime-semantics.md)
- [元素运行时阻断项](../research/next-elemental-runtime-blockers.md)

## 3. 武器、装备和套装

- [武器、装备与套装 DSL 设计](../architecture/endaxis-next-equipment-dsl-design.md)
- [装备常驻效果扩展方案](../architecture/endaxis-next-equipment-persistent-effects-extension-plan.md)
- [装备生成器 IR](../research/equipment-generation-ir-design.md)
- [装备生成覆盖审计](../research/equipment-generation-audit.md)
- [装备战斗期持久效果审计](../research/equipment-battle-persistent-modifier-audit.md)
- [静态候选覆盖](../research/equipment-static-candidate-coverage.md)

## 4. 干员建模

- [诀的双形态模型](../architecture/arcane-form-model.md)
- [庄方宜建模](../architecture/zhuang-fangyi-next-model.md)
- [佩丽卡定义说明](../architecture/perlica-next-definition.md)
- [诀证据](../research/arcane-next-evidence.md)
- [庄方宜证据](../research/zhuang-fangyi-next-evidence.md)
- [佩丽卡证据](../research/perlica-next-evidence.md)

架构文档讲 Endaxis 如何表达机制，research 文档讲该表达的游戏依据。二者不能合并为一份干员 TS 注释。

## 5. 数据生成审计

- [全干员生成审计](../research/all-operator-generation-audit.md)
- [全干员递归机制审计](../research/all-operator-recursive-mechanism-audit.md)
- [潜能静态属性转换审计](../research/operator-static-attribute-potential-audit.md)
- `docs/research/*.json`：机器可读覆盖结果
- `scripts/generate_next_operators/README.md`：生成器使用方式

## 6. UI、i18n 与交互

- [时间轴 UI 兼容迁移计划](../architecture/endaxis-next-ui-compatibility-plan.md)
- [按键交互架构](../architecture/endaxis-next-keyboard-interaction.md)
- [本地化与主题边界](../architecture/endaxis-next-localization-and-theme.md)

## 7. 原生行为研究

`docs/research/native-*` 保存从反编译中提取的单项规则，例如 Buff 标签查询、事件监听生命周期和全局冷却。这些文件是实现依据，不是对外功能说明。

## 8. 旧文档处置原则

- 仍支持当前实现的专题：保留并从本索引引用。
- 已被主干文档完整替代的总览：改为导航页或归档，不继续双份维护。
- 只有阶段性价值的方案：保留日期和适用版本，完成后标记结果，不把计划语气留作当前事实。
- 原始审计 JSON：保留机器生成，不手工编辑。
