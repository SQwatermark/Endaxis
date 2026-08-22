# Next 能力实体模板提取

该工具从当前桌面（handoff 文档中的“远程”）所连接的 VFS manifest 定位
`AbilityEntityTemplateData`，再用 AnimeStudio 导出原始 MonoBehaviour。输出只包含
零空间模型需要、且已由当前 IL2CPP 字段顺序验证的前缀：模板身份、出生标签、默认
生命周期、堆叠上限及其黑板参数。

空间、碰撞、模型和导航字段不会进入输出；子技能身份继续以 AKEDB
`SpawnAbilityEntity` 动作为准。`LifeType` 的 `0=Limited, 1=Infinity` 来自当前 IL2CPP
枚举声明顺序，并由 54 个模板中“53 个有限时长、1 个 99999 哨兵时长”的分布交叉核对；
未知原生值仍会在适配时被拒绝。

默认扫描 AKEDB `skill-data-cdn` 中 `chr_*.json` 与 `BuffData` 中 `buff_chr_*.json`
实际引用的模板。Buff 事件也能直接生成能力实体，不能只从技能入口建立引用闭包：

```powershell
python scripts/extract_next_ability_entities/extract_ability_entities.py
python -m unittest scripts/extract_next_ability_entities/test_extract_ability_entities.py
```

原始导出只存在于系统临时目录，不写入仓库；正式证据输出位于
`src/next/data/ability-entities/ability-entity-templates-1.4.4.json`。AKEDB 引用了但
当前 manifest 不存在的模板会进入 `unresolvedReferences`，不会被猜测性映射到近似名称。
