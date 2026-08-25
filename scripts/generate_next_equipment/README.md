# Endaxis Next 装备生成前审计

本目录为武器、单件装备和套装迁移到 Endaxis Next DSL 建立严格、可重复的结构审计基础。候选报告仍不直接生成正式定义；已由 SkillPatch、SkillData、BuffData 和运行时语义闭环的新增武器身份登记在 `formal_weapon_identities.json`，由 Next 正式定义单独承载。

版本化 AKEDB 输入由仓库根目录的 `scripts/download_akedb_next_sources.py` 统一下载。除干员生成所需表外，下载器还固定获取 `WeaponBasicTable`、`WeaponUpgradeTemplateTable`、`EquipTable`、`ItemTable` 与 `EquipSuitTable`；后续 AKEDB Adapter 必须从这些版本配对的表建立正式身份、成长、静态属性与 SkillPatch 引用，旧 TypeScript 快照只作为迁移对照，不能继续充当最终游戏事实源。默认工件目录是独立仓库 `D:/Projects/combat-spec/artifacts`，不是 vfs-index-browser 中的旧内嵌目录。

## 数据流

1. `export_legacy_equipment.mjs` 使用 Vite SSR 真实加载 `src/data/weapons`、`src/data/gearpieces` 和 `src/data/gearsets` 下的 TypeScript 模块。
2. Node 导出器递归检查所有值是否能无损表示为 JSON；函数、`undefined`、非有限数值、特殊对象和循环引用会立即报错。
3. `equipment_audit.py` 按明确白名单校验来源、技能槽、effect、modifier、trigger、condition 和 target，并保存每次出现的完整数据路径。
4. `generate_audit.py` 只有在全量校验成功后才原子更新 JSON 与 Markdown 报告。
5. `migration_ir.py` 在同一严格审计之后，为每个 effect 生成无损迁移记录和后续能力需求。
6. `candidate_definition_ir.py` 逐条核对构筑期静态贡献，并额外严格审计 33 条常驻战斗修正的静态/Buff 目的地；无法无歧义映射时只输出结构化缺口，不生成 raw 兜底。
7. 新 TypeScript 编译器把 `EquipTable` 静态修正投影为正式 `GearDefinition`，再由纯渲染器按套装
   目录生成单件文件、索引和审计。写盘器在同级暂存目录完成整个批次后原子替换目标目录，避免
   生成失败时留下新旧文件混杂的半成品；Next 注册层再负责旧 slug 到原生 ID 的稳定别名迁移。

这条路线不使用正则或字符串拼接解析 TypeScript。旧数据新增字段或类别时，审计会失败，维护者必须先确认语义并显式更新白名单。

## 运行

在仓库根目录执行：

```powershell
python -m scripts.generate_next_equipment.generate_audit
python -m scripts.generate_next_equipment.generate_migration_matrix
python -m scripts.generate_next_equipment.generate_candidate_coverage
python -m scripts.generate_next_equipment.generate_akedb_source_audit
node scripts/generate_next_equipment/generate_formal_gear_definitions.ts --tables <TableCfg目录>
node scripts/generate_next_equipment/generate_suit_source_audit.ts --tables <TableCfg目录> --skills <套装SkillData目录> --buffs <套装BuffData闭包目录> --client-version <版本>
node scripts/generate_next_equipment/generate_suit_static_definition_audit.ts --tables <TableCfg目录> --skills <套装SkillData目录> --client-version <版本>
node scripts/generate_next_equipment/generate_formal_suit_definitions.ts --tables <TableCfg目录> --skills <套装SkillData目录> --buffs <套装BuffData闭包目录>
```

最后一条命令默认原子更新 `src/next/data/equipment/generated`。输入必须是同一固定客户端版本配对
下载的 `EquipTable.json` 与 `ItemTable.json`；生成目录内的单件文件、索引和审计视为一个完整批次。
原生 `ItemTable.iconId` 不是物品主键：当前版本存在 6 组重复图标。旧 slug 迁移必须先按图标建立
候选，再由槽位、等级、防御与词条语义唯一消解；不能按图标把多个物品折叠成一件。

套装审计命令只接受由固定 `EquipSuitTable` 精确枚举的 SkillData，以及沿活动静态引用递归下载的
BuffData 闭包。它要求目录不多不少、所有阈值均为当前 Next 能表达的三件套，并保存两类来源文件
闭包哈希；不能用一整个无版本公共缓存掩盖缺失依赖。

套装静态定义审计会把 CardSkill 中构筑期已确定的属性编译成正式 DSL 候选，同时把启动 Buff、
ToggleBuff 和动作图引用保留为独立运行时依赖。候选只有在这些依赖完成后才能注册为完整套装，
因此不会因“静态部分已通过”而静默少算战斗效果。

正式套装生成器只读取 `formal_suit_identities.json` 中已完成运行时闭包的身份。每个身份单独严格
编译；任一已登记套装重新出现未知动作、事件或字段漂移时，整个原子生成批次都会失败。尚未闭环
的套装不会因为与已完成套装共处同一来源闭包而阻塞生成，也不会被自动登记为正式定义。

默认生成：

- `tmp/equipment-generation-audit.json`：机器可读全量路径与统计；它是本地中间产物，不进入 Git；
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
