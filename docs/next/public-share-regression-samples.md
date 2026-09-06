# 公开真实轴回归样本

采样日期：2026-09-06。目的为检验新版编辑/显示遗漏，不将旧模拟结果当作游戏规则。
存档升级只是可选辅助工具，本阶段不新增正式导入入口或持续维护旧格式兼容层。

## 已实际读取的样本

| 公开项目                                                                         | 方案 / 技能块 | 时间表示                 | 优先验证                               |
| -------------------------------------------------------------------------------- | ------------- | ------------------------ | -------------------------------------- |
| [庄方宜Maa](https://www.end-axis.com/shares/6a1be443fcf0bc1eebab6d48)            | 1 / 35        | `timeUnit=frame, fps=60` | 强化重击分段、终结技演出、能力实体状态 |
| [开荒低星碎冰队](https://www.end-axis.com/shares/6960d9afaf72c0e43d122dfb)       | 1 / 35        | `timeUnit=frame, fps=60` | 普攻链、冻结/碎冰与物理状态            |
| [0+1莱万汀短轴93s罗丹](https://www.end-axis.com/shares/697c86319b5c55801918f23c) | 2 / 48 + 47   | 无时间单位元数据         | 强化变体、燃烧、切入与跨轴演出         |

合计 4 个方案、165 个块；55 个块 ID 含 `_variant_`，31 个块的
`logicalStartTime` 与 `startTime` 不同；两个莱万汀方案各有 3 个切入事件。
这 4 个方案没有负时间块或循环分界线，不能替代这两类回归。
列表接口本次返回总数 147，仅选取上述样本，没有全站批量下载。

下载 JSON 保存在忽略目录 `tmp/public-shares/<share-id>.json`，不提交完整用户存档、
账号信息或游戏资源。临时采样脚本 `tmp/inspect-public-shares.mjs`，不作为产品依赖。
本次完成读取与结构审计，尚未在旧版浏览器重放，也未转入新版模拟。

## 读取链路与证据

- 页面及公开构建模块可正常 GET；前次浏览器超时不代表没有公开数据。
- 页面构建 `index-Vz8no3YH.js` 引用 ShareSquare/ShareDetail，二者引用
  `shareStore-DZiF7CCR.js`，明确使用 `GET /api/shares` 和 `GET /api/shares/:id`。
  本次只调用公开读取路径，没有登录、点赞、复制到账号或发布。
- 详情的 `shareCode` 是 base64url + gzip + JSON；依据旧源码
  `src/utils/gzipUtils.ts` 与 `src/stores/timeline/persistence.ts`，不是猜测压缩格式。
- 上游只读工作树 `D:/Projects/Endaxis-upstream-main`：
  `src/utils/timeSerialization.ts` 仅在 `timeUnit === 'frame'` 时按存档 FPS 还原秒；
  没有标记则保持旧值。新版 `src/core/project/schema.ts` 使用 30 FPS。
- 旧 `src/stores/timeline/shifts.ts:refreshAllActionShifts` 从 logicalStartTime
  和连携/终结技演出推导 startTime；还有 compiled timeContext，不能仅比较字段名就
  宣称已经还原屏幕真实时间。样本中庄方宜终结技为 343 / 413（60 FPS），说明差异实际存在。
- 新 `src/core/project/serialization.ts` 目前识别并拒绝直接加载 legacy 文档。
  本次不改变该边界。

## 下一步使用顺序

1. 先重放低星碎冰轴，按旧源码定位普通技能身份及显示时间；抽取一个短片段在新版
   原生模板下重建，检查状态转换、伤害节点和操作衔接。比较流程和可见事实，不要求总伤害一致。
2. 再使用莱万汀与庄方宜样本检验强化入口、连续分段和演出占用。历史 `_variant_` ID
   可能对应人工修改内容，不能按名称或 ID 尾号直接映射原生技能。
3. 若抽取自动化有价值，先做只读审计/显式映射的测试夹具构建器，输出未映射清单。
   只有能保留放置语义、养成和配装身份时才考虑用户可用的升级组件。

旧存档中的 damageTicks、physicalAnomaly、stats、weaponAppliedDeltas 等是旧定义或
派生/编辑数据，不能整体塞入新版模拟。应使用当前游戏模板重算，人工自定义与未识别
内容必须单独标明，不能静默丢弃后仍称“完整转换”。
