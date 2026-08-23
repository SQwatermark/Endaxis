# Endaxis Next 装备 AKEDB 来源覆盖审计

数据版本：`1.4.4@9433094-12`。本报告只证明身份和 SkillPatch 引用覆盖；不把旧效果解释等同于正式战斗语义。

## 结论

- 审计执行：`complete`
- 来源覆盖：`partial`
- AKEDB 武器：77；旧迁移目录：76；Next 正式补充：1；已映射：77
- AKEDB 套装：23；旧真实套装：23；已映射：23
- 旧单件装备定义：242；唯一 AKEDB Item 身份：241
- 非游戏套装哨兵：1（不计入 AKEDB 套装总量）

## 覆盖缺口

### AKEDB 中尚无本地正式身份的武器

- 无

### 无法回指 AKEDB 的旧武器 slug

- 无

### AKEDB 中尚无本地套装映射的身份

- 无

### 无法回指 AKEDB 的旧套装 slug

- 无

### 多个旧定义共用同一 AKEDB Item 身份

- `item_equip_t4_suit_usp02_hand_01`：`eternal-xiranite-gloves`、`eternal-xiranite-gloves-t1`

## 证据边界

- `WeaponBasicTable` 证明武器身份、星级、类型和词条 SkillPatch 引用。
- `ItemTable` 连接游戏 ID 与图标资源身份；少数武器的 Item ID 与图标 ID 不同，审计按显式别名和 Item 行匹配。
- `EquipSuitTable` 证明真实套装身份、三件激活规则和套装 SkillPatch 引用。
- 当前旧 TypeScript 快照仅用于 slug 与历史效果解释对照；正式生成仍需逐项核对 SkillPatch、SkillData、BuffData 和运行时语义。
- `formal_weapon_identities.json` 只登记完成上述闭环并进入 Next 正式仓库的新增身份，不携带或推断效果。
