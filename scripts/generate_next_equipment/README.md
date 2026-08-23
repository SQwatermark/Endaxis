# Endaxis Next 装备生成前审计

本目录为武器、单件装备和套装迁移到 Endaxis Next DSL 建立严格、可重复的结构审计基础。候选报告仍不直接生成正式定义；已由 SkillPatch、SkillData、BuffData 和运行时语义闭环的新增武器身份登记在 `formal_weapon_identities.json`，由 Next 正式定义单独承载。

版本化 AKEDB 输入由仓库根目录的 `scripts/download_akedb_next_sources.py` 统一下载。除干员生成所需表外，下载器还固定获取 `WeaponBasicTable`、`ItemTable` 与 `EquipSuitTable`；后续 AKEDB Adapter 必须从这三张表建立正式身份与 SkillPatch 引用，旧 TypeScript 快照只作为迁移对照，不能继续充当最终游戏事实源。

## 数据流

1. `export_legacy_equipment.mjs` 使用 Vite SSR 真实加载 `src/data/weapons`、`src/data/gearpieces` 和 `src/data/gearsets` 下的 TypeScript 模块。
2. Node 导出器递归检查所有值是否能无损表示为 JSON；函数、`undefined`、非有限数值、特殊对象和循环引用会立即报错。
3. `equipment_audit.py` 按明确白名单校验来源、技能槽、effect、modifier、trigger、condition 和 target，并保存每次出现的完整数据路径。
4. `generate_audit.py` 只有在全量校验成功后才原子更新 JSON 与 Markdown 报告。
5. `migration_ir.py` 在同一严格审计之后，为每个 effect 生成无损迁移记录和后续能力需求。
6. `candidate_definition_ir.py` 逐条核对构筑期静态贡献，并额外严格审计 33 条常驻战斗修正的静态/Buff 目的地；无法无歧义映射时只输出结构化缺口，不生成 raw 兜底。

这条路线不使用正则或字符串拼接解析 TypeScript。旧数据新增字段或类别时，审计会失败，维护者必须先确认语义并显式更新白名单。

## 运行

在仓库根目录执行：

```powershell
python -m scripts.generate_next_equipment.generate_audit
python -m scripts.generate_next_equipment.generate_migration_matrix
python -m scripts.generate_next_equipment.generate_candidate_coverage
python -m scripts.generate_next_equipment.generate_akedb_source_audit
```

默认生成：

- `docs/research/equipment-generation-audit.json`：机器可读全量路径与统计；
- `docs/research/equipment-generation-audit.md`：便于评审的中文摘要。
- `docs/research/equipment-generation-migration-matrix.json`：逐 effect 迁移 IR；
- `docs/research/equipment-generation-migration-matrix.md`：迁移类别、代表样本和能力阻塞汇总。
- `docs/research/equipment-static-candidate-coverage.json`：可直接构造的候选定义、分组统计与 DSL 缺口。
- `docs/research/equipment-static-candidate-coverage.md`：静态定义覆盖审计的中文结论。
- `docs/research/equipment-battle-persistent-modifier-audit.md`：33 条常驻战斗修正的旧执行链、语义纠正和 Next 能力证据。
- `docs/research/equipment-akedb-source-coverage.json` / `.md`：版本化 AKEDB 武器、Item 与套装身份覆盖；它与旧效果迁移覆盖分开统计。

也可以复用已有 Node 快照排查 Python 审计问题：

```powershell
node scripts/generate_next_equipment/export_legacy_equipment.mjs --output snapshot.json
python -m scripts.generate_next_equipment.generate_audit --input snapshot.json
```

快照是中间产物，不应提交。

## 测试

```powershell
python -m unittest scripts.generate_next_equipment.test_equipment_audit
python -m unittest scripts.generate_next_equipment.test_migration_ir
python -m unittest scripts.generate_next_equipment.test_candidate_definition_ir
python -m unittest scripts.generate_next_equipment.test_akedb_source_audit
node --test scripts/generate_next_equipment/test_export_legacy_equipment.mjs
```

测试重点验证分类结果和“未知数据必须失败”的契约。全量审计命令同时承担所有真实旧数据模块的集成测试。

## 边界

- 本工具不修改 `src/next`、旧数据或干员生成器。
- 审计成功只表示旧结构被完整识别，不表示战斗语义已完整迁移。
- “构筑期可确定”不等于“角色面板可见”，也不等于“当前静态 DSL 可表达”；候选定义审计专门负责后两项判断。
- “没有 duration”不等于“可以静态化”；生命值、敌方状态、失衡状态和 Buff 层数条件必须由战斗运行时实时判断。
- 在 Next 的事件、Buff 和静态属性编译边界闭环前，不批量生成可能少算效果的 DSL。
