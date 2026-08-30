# 天赋阵列属性节点审计

> 本文随旧 Python 生成器退役迁入研究文档；正式实现由 TS 游戏数据编译器负责。

## 结论

`trustAttributeBonus` 可以直接从 AKEDB 提供的 `CharGrowthTable` 取得，不需要从旧版 Endaxis 配置反推，也不需要在 `operators.json` 中人工填写。

数据路径为：

```text
CharGrowthTable[charId]
  .talentNodeMap[*]
  .nodeType == 3
  .attributeNodeInfo
    .breakStage
    .attributeModifiers[*]
      .attrType
      .attrValue
      .modifierType
      .modifyAttributeType
```

AKEDB 前端 `plugin/js/v2-character.js` 同样通过 `nodeType === 3` 读取并展示这些属性节点，因此该路径不是 Endaxis 对字段的猜测。

## 全量结果

审计了生成器当前锁定的 `1.4.4@8764515-7` 表：

- `CharGrowthTable` 与 `CharacterTable` 各有 31 条干员记录；
- 每条记录均有且仅有四个属性节点；
- `breakStage` 严格覆盖 `1、2、3、4`；
- 所有修正均为 `modifierType = 5`、`modifyAttributeType = 0`；
- 除 `chr_0032_lizhiyan`（诀）外，所有记录均给主属性增加 `10、15、15、20`。

同时核对了 AKEDB 在 2026-08-10 提供的最新 `1.4.4@9163343-11` 表：

- 两张表各有 32 条记录，所有记录仍满足上述结构约束；
- 新增的 `chr_0035_liino` 也采用通用规则，对主属性意志增加 `10、15、15、20`；
- 唯一例外仍是诀。

诀的四次节点同时修改智识（`attrType = 41`）与意志（`attrType = 42`），每个节点对两种属性使用相同数值：

```text
8、10、10、15
```

表中还包含 `chr_0002_endminm`、`chr_0003_endminf` 和正式管理员 `chr_9000_endmin`。三者都符合通用规则；是否把废案角色纳入目录属于角色身份筛选问题，不影响属性节点解析规则。

## 生成规则

生成器现在始终解析并验证源节点，但只在偏离默认规则时输出字段：

```ts
trustAttributeBonus: {
  values: [8, 10, 10, 15],
  attributes: ['intellect', 'will'],
}
```

普通干员省略该字段，由 Next 的全局默认值表达 `[10, 15, 15, 20]` 主属性规则。这样既避免每名干员重复相同数据，也不会让默认规则绕过源数据校验。

以下变化会使生成器直接失败，不会静默回退：

- 缺少任一突破阶段或同一阶段重复；
- 属性类型不是四维属性；
- 修正模式不再是当前确认的模式；
- 同一节点的多个目标使用不同加点数值；
- 四个节点修改的目标属性不一致。

最后两项是当前 `TrustAttributeBonusDefinition` 不能无损表达的结构。如果未来源数据出现这种变化，应先扩展目标模型，再更新生成器。
