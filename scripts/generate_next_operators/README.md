# 旧 Python 干员生成器已退役

本目录不再包含可执行生成器。旧 Python 实现、测试和重复目录数据已在 TS 正式链完成
30 名干员、310 个主动技能的生成与模拟覆盖后删除；需要追溯旧实现时请使用 Git 历史。

当前权威入口：

- 编译器说明：`tools/game-data-compiler/README.md`
- 干员生成 manifest：`tools/game-data-compiler/config/operators.json`
- 正式干员定义：`src/next/data/operators/generated-definitions/`
- 可重建来源与审计输出：`tmp/game-data-sources/`、`tmp/game-data-audit/`

正式输出不得写回本目录，也不得恢复 `src/next/data/operators/generated/`、
`generated-active-skills/` 或 `generated-runtime/`。`tmp/` 仍不得提交。
