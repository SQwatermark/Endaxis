# 原生全局冷却计时器映射

## 结论

终末地的 `GlobalTimedMarker` 与角色 `AbilitySystem` 上的普通 `TimedMarker` 是两套原生容器：

- 普通标记由 `AbilitySystem` 持有，按字符串 ID 查询；
- 全局标记由 `BattleManager` 持有，按 `(id, charServerId)` 查询；
- `CheckGlobalCDTimerAction` 在对应全局标记不存在时返回成功；
- `AddGlobalCDTimer` 以 `buffId` 作为 ID，并以目标角色的 `charServerId` 区分拥有者。

Endaxis Next 当前模拟单场战斗，且干员实体在战斗期间身份稳定。因此生成器可以把 `(buffId, 当前施法者)` 行为等价地映射为施法者实体上的 `timedMarkerPresent/createTimedMarker`，无需增加第二套运行时容器。中间审计层仍保留独立的 `GlobalCooldownConditionSource` 和 `GlobalCooldownApplicationPayload`，避免掩盖原生结构差异。

## 证据

1. `Gameplay.Beyond.dll.cs` 中 `BattleManager` 持有 `List<GlobalTimedMarker>`，并暴露：
   - `AddGlobalTimedMarker(string id, ulong charServerId, float lifeTime)`；
   - `ModifyGlobalTimedMarker(string id, ulong charServerId, float deltaTime)`；
   - `HasGlobalTimedMarker(string id, ulong charServerId)`；
   - `_TickGlobalTimedMarker(float deltaTime)`。
2. IL2CPP 方法探针确认：
   - `CheckGlobalCDTimerAction.ExecuteInternal` 调用 `HasGlobalTimedMarker`，并对存在结果取反；
   - `AddGlobalCDTimer.ExecuteInternal` 调用 `AddGlobalTimedMarker`；
   - 两者都从目标实体取得角色服务器 ID。
3. 米芙连携 `chr_0031_mifu_combo_skill` 使用同一个 `buff_chr_0031_mifu_shield`：
   - 条件先检查该角色是否没有对应全局冷却；
   - 成功分支创建护盾相关 Buff；
   - 随后以黑板值 `talent_shield_cd` 写入全局冷却。

## 生成器行为

当前仅编译以下闭环形状：

- 目标来源为根技能的 `Owner`，或嵌套来源的 `Source`；
- 目标组为空；
- `buffId` 为非空固定字符串；
- `cdTime` 能由字面量或已解析的动作黑板值表达。

生成结果使用：

```ts
branch(
  { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: buffId } },
  sequence(
    step('createTimedMarker', {
      target: 'caster',
      markerId: buffId,
      durationSeconds: cdTime,
      autoFinishByAction: false,
    }),
  ),
);
```

`AddGlobalCDTimer` 同时进入有状态战斗动作审计。出现在 Buff 事件或其他尚未编译容器中的实例会继续阻断完整生成，而不会因本轮支持了米芙的技能条件就被静默放行。

## 尚未覆盖

- `ModifyGlobalCDTimer` 尚未接入；在确认正负增量、缺失项行为和过期边界前不能近似实现。
- 跨战斗、跨场景或角色实体重建时的全局标记生命周期不属于当前 Endaxis 单场模拟范围。
- 若未来同一角色在模拟中可能对应多个临时实体，必须恢复稳定角色身份键，不能继续仅按实体容器区分。
