# 原生 CheckBuffStackNum 语义审计

## 结论

`CheckBuffStackNum` 是固定单个 Buff ID 的层数条件。它不是按实例数量判断，也不是
`CheckBuffStackNumAdvanced` 的标签查询别名：

1. 通过通用 `TargetSettings` 取得首个目标；无目标时以 `0` 进入比较。
2. 若目标是不可直接附加 Buff 的敌人部位，先归并到主体。
3. 调用 `AbilitySystem.GetBuffCountById`，累计所有未结束同 ID Buff 的增强层数。
4. 在执行时从当前动作黑板解析 `value`。
5. 使用原生 `CompareType` 和 `1e-5` 容差比较计数与阈值。

因此它可以复用 Next 已有的 `buffIdStackCompare` 运行时语义；区别只在导入形状固定为一个
Buff ID，而且阈值允许引用动作黑板。

## 证据

1.4.4 类型索引中：

- `CheckBuffStackNum.ExecuteInternal`：RVA `0x0718ED58`；
- `AbilityActionUtils.GetFirstTarget`：调用 RVA `0x033C18B0`；
- `AbilitySystemUtils.ResolvePartBuffSource`：调用 RVA `0x03550CD0`；
- `AbilitySystem.GetBuffCountById`：调用 RVA `0x06CADE10`；
- `ActionBlackboardExtensions.GetValue`：调用 RVA `0x0307A180`。

执行函数把 `GetBuffCountById` 返回的整数转成单精度浮点数，再与运行时解析的
`BlackboardDouble` 一起传给和高级版本相同的比较路径。当前 SkillData 缓存中的 67 个实例
拥有同一字段形状：`checkTarget`、单个 `buffId`、`compareType` 和 `value`。

## Endaxis 映射边界

解析器统一生成：

```ts
{
  kind: 'buffIdStackCompare',
  target: 'caster' | 'enemy',
  buffIds: ['...'],
  operator: '...',
  value: ActionValueOperand,
}
```

只有目标来源能由当前动作上下文证明为施法者或固定单敌人时才编译。目标组或嵌套实体来源
尚未闭环的样本继续报错，不根据 Buff 名称或干员身份猜测。
