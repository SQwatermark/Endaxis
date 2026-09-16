# Buff 生成数据

仓库只保存统一游戏数据重建流程发布的最终 TypeScript 产物。原生 BuffData、取证目录和
跨工具交换数据只能写入当次 `tmp/game-data-rebuild-*` 运行目录；不得把 JSON 中间产物复制到
`src/data`，也不得在应用启动时重新解析生成 JSON。

四色附着、同色爆发和异色反应组合属于模拟器的底层规则，直接由
`elementalAttachments.ts` 与 `compoundStatusFactories.ts` 定义，不属于版本导出产物。实际反应
倍率、减抗量和持续时间仍从统一重建发布的 `SkillSetting` TypeScript 子集读取。
