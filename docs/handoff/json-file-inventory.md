# JSON 用途与剩余清理

2026-09-15 检查。按实际读取者判断用途，文件扩展名或版本后缀不是删除依据。

| 类别                                 | 用途与处理                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| package、锁文件、tsconfig 与工具配置 | 工程输入，保留                                                                |
| 运行时数据                           | 两份 combat-1.4.4 Buff 配方、SkillSetting、危机合约目录仍被模拟/UI 读取，保留 |
| 语言资源                             | 17 份经动态加载使用；枚举翻译配置是生成输入，不等于应用输出                   |
| 转换器配置                           | 干员、装备身份、来源目录与显示映射等输入，保留                                |
| 固定测试夹具                         | 15 份有测试消费者，保留；不能当作编译中间产物删除                             |
| 旧轴映射                             | 实际转换输入及使用示例，保留                                                  |
| 装备审计快照                         | 5 份 JSON 及过期 Markdown 已删除；两个审计 CLI 默认输出改到 tmp               |
| 敌人分类                             | 仓库副本已删，重建期间临时生成，成功或失败均清理                              |

## 剩余项

1. `src/data/ability-entities/ability-entity-templates.generated.json` 只经包装被自身测试使用。
   删除前一起检查包装、自测和旧生成 CLI，不能只删数据留下命令失效。
2. `src/data/global-buffs/global-buff-templates.generated.json` 是编译输入，不是运行时数据。
   需统一传入同次候选，并在最后一个编译/审计消费者结束后清理，包含失败路径。
3. `tools/game-data-compiler/gameplay-tag-config-set-1.4.4.sources.json` 是旧来源清单；当前重建导出新清单。
   清理旧兼容命令和示例后删除。
4. `src/data/ability-entities/ability-entity-templates-1.4.4.json` 仍可能被兼容单技能入口读取。
   整名测试传路径不等于实际读取；先去掉无效参数，再决定兼容入口去留。
5. `tools/game-data-compiler/legacy/evidence/projectile-entity-blackboards-1.4.4.json` 有实际旧版回退读者，
   已移出本体。当前原始数据优先，不能把它误判为无人读取。
