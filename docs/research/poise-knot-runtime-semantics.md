# 失衡节点原生语义

## 结论

- 敌人是否拥有失衡值只取决于 `maxPoise > 1e-5`，与节点数量无关。
- `poiseKnotPctList` 不是失衡条数量，而是已损失失衡值占上限的递增阈值。
- `m_nextKnotIndex` 在重置失衡时归零。失衡伤害跨过一个或多个阈值时，索引逐项递增；失衡恢复越过阈值时，索引会反向回退。
- 每个阈值与 `poiseKnotBuffList` 同位置对应。跨过阈值后，原生逻辑会触发节点事件并施加对应 Buff。
- 失衡归零走独立的 `OnPoiseZero` 流程，不应把最后一个中间节点当作完整破防。

因此，Endaxis Next 使用一条连续的失衡账本，并把中间节点保存为阈值列表。节点数量只能由阈值列表长度派生，不能反过来用于判断是否存在失衡账本。

## 数据依据

AKEDB `EnemyAttributeTemplateTable` 中存在：

- `poiseKnotPctList`：如 `[0.5]`、`[0.33, 0.66]`、`[0.25, 0.5, 0.75]`；
- `poiseKnotBuffList`：与非空阈值列表等长；
- `breakingAttackedAtbObtain`：处决命中后玩家获得的技力，不是敌人失衡恢复值。

敌人数据生成器同时保留原生阈值列表和供旧版使用的派生数量。Next 只读取阈值列表。

## 反编译依据

1. `AbilitySystem.get_hasPoise` 最终比较最大失衡值与 `1e-5`，不读取节点列表。
2. `PoiseController.ResetPoise` 将 `m_nextKnotIndex` 写为 `0`。
3. `PoiseController.ModifyPoise` 用 `1 - currentPoise / maxPoise` 得到已损失比例：
   - 失衡伤害跨过 `poiseKnotPctList[m_nextKnotIndex]` 时递增索引；
   - 恢复失衡并退回阈值以内时递减索引；
   - 节点 Buff 通过相同索引从 `poiseKnotBuffList` 读取。
4. `ModifyPoise` 与 `ModifyTransferredPoise` 都在归零时调用 `OnPoiseZero`，节点分支与归零分支彼此独立。

对应运行时快照分析位于相邻研究工作区：

```text
combat-runtime-dumps/1.4.4/runtime-1/poise-controller.analysis.json
combat-runtime-dumps/1.4.4/runtime-1/IL2CPP_GameAssembly.runtime.runtime-1.bin
combat-runtime-dumps/1.4.4/static/Gameplay.Beyond.type-index.json
```

关键原生字段位于 `PoiseController`：

```text
m_poiseKnotPctList  0x80
m_poiseKnotBuffList 0x88
m_nextKnotIndex     0x90
```

## 当前实现边界

已经完成：

- 敌人定义保存真实节点阈值；
- 项目实例允许编辑阈值列表；
- 编译器校验阈值严格递增且位于 `(0, 1)`；
- 所有最大失衡值大于零的敌人创建同一条完整失衡账本。

尚未完成：

- 节点 Buff 定义尚未导出；
- `OnPoiseKnotBreak` 尚未接入统一事件中心和回执；
- 节点短暂硬直计时器尚未进入运行时；
- 节点 Buff 的施加、移除及与归零事件的完整顺序仍需落地测试。

在这些内容接入前，节点阈值只能作为已保真的运行时输入，不能宣称节点效果已经完整模拟。
