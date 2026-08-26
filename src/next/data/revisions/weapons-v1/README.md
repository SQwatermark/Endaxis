# v1 武器迁移快照

此目录是正式存档兼容数据，不是生成中间产物。不要随当前生成器更新或删除。

- 来源：Endaxis `083f95c2` 的 `sharedWeaponDefinitions` 完整运行定义，77 把。
- 方法：在该提交通过 Vite SSR 加载适配入口，捕获纯数据输出，按武器类型拆成五份只读 TS。
- 身份：`endaxis-next-definitions-v1`；新库为 `endaxis-next-definitions-v2-weapons-1.4.4-r1`。
- 校验：按 slug 的 `localeCompare` 排序后对 `JSON.stringify` 输出计算 SHA-256：
  `07fcf18abfd172525e3ce087b96a55cfbdceb92ea241807b9f738e408edf8aa7`。
  `application/defaultWeaponMigration.test.ts` 锁定哈希并逐把验证来源定义和迁移。

该目录保留旧词条身份、容量、武器类型和原定义内容，供迁移校验及备份使用；不参与新版战斗计算。
`weaponV1MigrationSource` 的干员、装备和其他数据仍采用当前仓库，它不是整个历史游戏库的快照，
不能承诺重现历史伤害结果。v1 期间未逐次变更 revision 的历史变动也不在本次追溯范围内。

不得因为当前生成结果改变而重写本快照或测试哈希。若发现旧来源有误，应保留原文档，新增明确的
修复/迁移边及其证据；不能按目标库猜测旧数组下标含义。
