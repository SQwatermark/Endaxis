# 原生技能已输出伤害条件

## 结论

`CheckSkillHasHit` 不检查 SkillData 中是否配置了 `DamageAction`，而是读取当前 `Skill` 实例的运行时属性 `hasOutputDamageBattle`。该属性直接返回字段 `m_hasOutputDamageBattle`，表示本次技能施放此前是否已经对战斗目标输出过伤害。

当条件动作无法取得所属 `Skill` 实例时，原生实现会记录错误并返回 `false`。

## 反编译依据

- `CheckSkillHasHit.ExecuteInternal`：RVA `0x06D44684`
- `Skill.hasOutputDamageBattle`：RVA `0x06CA81D8`
- `Skill.m_hasOutputDamageBattle`：对象偏移 `0xB4`

`ExecuteInternal` 先由当前 Ability 取得所属 Skill，再调用 `Skill.hasOutputDamageBattle`。这说明该条件属于单次技能实例状态，不能被解释成静态的“技能包含伤害动作”。

## Endaxis Next 映射

Endaxis 当前固定为单敌人模型，并约定已排入模拟的伤害必然命中。因此生成器可以在以下条件全部成立时，将该运行时条件折叠为恒成立的单敌人条件：

1. 条件属于根技能实例，而不是投射物或能力实体触发的独立子技能。
2. 统一调度表中已经存在同一根技能的伤害项。
3. 该伤害项按 `(frame, actionOrder)` 严格早于条件项。

无法证明以上事实时，生成器拒绝编译，不会仅凭 SkillData 中存在伤害配置就猜测条件成立。

当前全量数据中该条件只用于米芙连携技。其第 31 帧 `serverActionIndex=71` 的伤害早于 `serverActionIndex=72` 的条件，因此条件成立，随后执行终结技能量回复。
