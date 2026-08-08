# CheckHp 条件的运行时语义

## 结论

原生 `CheckHp` 读取目标的当前生命值与最大生命值。`isRatio` 为 `true` 时比较
`currentHealth / maxHealth`，否则直接比较当前生命值；比较符和阈值分别来自
`compare` 与 `value`。阈值可以引用动作黑板，不能在生成阶段一律折叠成常量。

Next 将它表达为通用 `healthCompare` 条件：

```ts
{
  kind: 'healthCompare',
  target: 'enemy',
  valueType: 'ratio',
  operator: 'greater',
  value: { kind: 'constant', value: 0 },
}
```

运行时从本场模拟的 `CombatVitals` 读取生命值，不能使用角色面板快照代替，因为受伤后
当前生命值会持续变化。

## 证据

- `combat-spec/docs/buff-and-damage.md` 记录的 `CheckHp`（RVA `0x07190100`）会读取首个
  目标的当前生命和最大生命，并根据 `isRatio` 选择比例值或当前值。
- `chr_0028_wulfa_combo_2_skill.json` 中的条件目标为
  `Context/smart_target`，比较方式为 `GT`，`isRatio` 为 `true`，阈值为 `0`。
  在 Endaxis 的单敌人模型中，这一目标可确定折叠为敌人。

## 当前边界

生成器目前只编译已确认的 `Context/smart_target` 目标。`InstantSearch/CureTarget`、
`Context/maintar` 等其他原生目标仍保留在解析结果中，但会在 DSL 编译时显式失败；在
这些目标的选择与排序语义进入单敌人模型前，不应把它们猜成敌人或施法者。

本次规则使全干员审计中的罗西第二段连携由阻塞变为完整 DSL 编译，同时没有为罗西
加入任何专用配置。
