# `CheckSkillCameraMotionFree` 条件盘点（1.4.4）

## 结论

1. 1.4.4 的干员 `SkillData` 中共有 **7 个启用的 `CheckSkillCameraMotionFree`**，分布在 4 名干员的终结技内；没有发现禁用实例，也没有在其他技能类型中发现实例。
2. 7 个条件的直接分支只执行以下几类行为：
   - 播放或切换技能镜头；
   - 写入镜头状态黑板值；
   - 调整动态镜头控制、瞄准锁定；
   - 选择仅有资源名、挂点和跟随方式差异的视觉特效。
3. 两个由分支写入的黑板键分别是 `isWall` 和 `camera_blocked`。对整个本地 `SkillData` 目录检索后，它们的后续消费者仍然只控制镜头或视觉特效；没有消费者进入伤害、失衡、附着、Buff、资源、冷却、事件触发或技能时间轴调度。
4. 因此，**对 Endaxis 的单敌人后端战斗模拟而言，当前 7 个使用点都可以作为纯表现条件忽略**。忽略时必须连同其纯表现分支一起忽略，不能把成功或失败分支中的镜头状态值当作战斗黑板值保留下来。
5. 该结论建立在“全部使用点及其黑板消费者”的数据流闭环上，不依赖对条件名称的猜测。条件本身的原生 `ExecuteInternal` 尚未完成完整反编译，因此本文不宣称已经还原“镜头可自由运动”的底层判定公式。

## 数据范围与证据

主要数据源：

- `vfs-index-browser/combat-spec/artifacts/SkillData/*.json`
- `combat-runtime-dumps/1.4.4/static/Gameplay.Beyond.dll.cs`
- `combat-runtime-dumps/1.4.4/runtime-1/runtime-1-full.analysis.json`
- `Endaxis/docs/research/all-operator-recursive-mechanism-audit.json`

审计索引记录为 7 个启用条件、4 名干员覆盖；随后直接检索完整 `SkillData`，得到相同数量和文件集合：

| 干员                      | 角色 ID           | 技能文件                              | 使用数 |
| ------------------------- | ----------------- | ------------------------------------- | -----: |
| 陈千语                    | `chr_0005_chen`   | `chr_0005_chen_ultimate_skill.json`   |      2 |
| 安塔尔（英文名 Arclight） | `chr_0007_ikut`   | `chr_0007_ikut_ultimate_skill.json`   |      1 |
| 萤石（内部名 Fluorite）   | `chr_0022_bounda` | `chr_0022_bounda_ultimate_skill.json` |      2 |
| 洛茜（内部名 Rossi）      | `chr_0028_wulfa`  | `chr_0028_wulfa_ultimate_skill.json`  |      2 |

> 名称采用当前 Endaxis 全干员审计表中的映射；判断依据始终使用稳定的角色 ID 与技能文件名。

## 条件字段与原生实现边界

所有实例都只有一个与条件语义直接相关的配置字段：

```json
{
  "$type": "Beyond.Gameplay.Core.Conditions.CheckSkillCameraMotionFree+Data, Gameplay.Beyond",
  "cameraAnimKey": "UltimateSkillCamera"
}
```

不同实例的 `cameraAnimKey` 为：

- `UltimateSkillCamera`
- `UltimateSkillCamera1`
- `UltCam_attack`

静态类型信息确认：

- `CheckSkillCameraMotionFree` 是返回布尔结果的条件型 `AbilityAction`；
- 核心方法为 `ExecuteInternal(TargetHandleView)`；
- 数据对象除通用动作字段外只携带 `cameraAnimKey`。

现有运行时快照只覆盖 `ExecuteInternal` 开头 512 字节，且大多数被调用目标尚未命名，不能据此严谨复原底层相机管理器的完整判定流程。因此本文只采用以下两项有闭环的数据结论：

1. 条件以某个 `cameraAnimKey` 为输入；
2. 它的全部实际分支与后续黑板消费者均属于镜头或视觉表现。

## 7 个使用点

### 陈千语：2 个

#### 使用点 1

- 时间轴：`timelineActions[21]`，帧区间 `0..134`
- 条件：`CheckMainCharacterCondition` 与 `CheckSkillCameraMotionFree(UltimateSkillCamera1)`
- 成功分支：播放 `AnimatedCameraAction(UltimateSkillCamera1)`，时长约 `4.466667s`
- 失败分支：空
- 黑板写入：无

该条件只决定主控干员能否播放第一套终结技镜头。

#### 使用点 2

- 时间轴：`timelineActions[22]`，帧区间 `0..51`
- 条件：`CheckSkillCameraMotionFree(UltimateSkillCamera1)`
- 成功分支：空
- 失败分支：播放备用 `AnimatedCameraAction(UltimateSkillCamera)`，时长 `1.7s`
- 黑板写入：无

该条件只决定第一套镜头不可用时是否启用备用镜头。

### 安塔尔：1 个

- 时间轴：`timelineActions[3]`，帧区间 `0..0`
- 条件：`CheckMainCharacterCondition` 与 `CheckSkillCameraMotionFree(UltimateSkillCamera)`
- 成功分支：空
- 失败分支：将动态黑板 `isWall` 赋值为 `1`
- 黑板初值：`isWall = 0`

`isWall` 的命名不足以证明它表示墙体碰撞，因此不能仅按名称解释。其全部消费者如下：

| 时间轴                          | 判断          | 成功分支                        | 失败分支                          |
| ------------------------------- | ------------- | ------------------------------- | --------------------------------- |
| `timelineActions[8]`，`0..54`   | `isWall <= 0` | 播放一套 `AnimatedCameraAction` | 播放另一套 `AnimatedCameraAction` |
| `timelineActions[10]`，`54..85` | `isWall <= 0` | `AddDynamicCcsAction`           | 空                                |
| `timelineActions[11]`，`63..85` | `isWall <= 0` | `LockCameraAimAction`           | 空                                |

文件内没有其他 `isWall` 读取点；全量 `SkillData` 检索也没有跨文件消费者。该键实际承担“终结技镜头条件失败”的局部状态传递，只影响镜头控制。

### 萤石：2 个

#### 使用点 1

- 时间轴：`timelineActions[6]`，帧区间 `0..77`
- 条件：`CheckMainCharacterCondition` 与 `CheckSkillCameraMotionFree(UltimateSkillCamera)`
- 成功分支：播放 `AnimatedCameraAction(UltimateSkillCamera)`
- 失败分支：空
- 黑板写入：无

#### 使用点 2

- 时间轴：`timelineActions[7]`，帧区间 `0..56`
- 条件：`CheckMainCharacterCondition` 与 `CheckSkillCameraMotionFree(UltimateSkillCamera)`
- 成功分支：空
- 失败分支：播放 `AnimatedCameraAction(UltimateSkillCamera)`
- 黑板写入：无

两个位置处于不同的外层分支。单独看内层条件时，一个在成功分支播放镜头，另一个在失败分支播放镜头；但两者都没有任何战斗动作或战斗黑板写入。

### 洛茜：2 个

#### 使用点 1

- 时间轴：`timelineActions[9]`，帧区间 `57..150`
- 条件：`CheckSkillCameraMotionFree(UltCam_attack)`
- 成功分支：播放 `AnimatedCameraAction(UltCam_attack)`，并执行一条 `DebugPrintAction`
- 失败分支：空
- 黑板写入：无

#### 使用点 2

- 时间轴：`timelineActions[10]`，帧区间 `57..111`
- 条件：`CheckSkillCameraMotionFree(UltCam_attack)`
- 成功分支：空
- 失败分支：
  - 将动态黑板 `camera_blocked` 赋值为 `1`；
  - 执行 `AddDynamicCcsAction`；
  - 执行 `LockCameraAimAction`。
- 黑板初值：`camera_blocked = 0`

`camera_blocked` 的全部消费者如下：

| 时间轴                            | 判断                         | 分支结果                                                        |
| --------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `timelineActions[68]`，`134..198` | 主控且 `camera_blocked == 0` | 创建 `P_fxbat_wulfa_camera`，跟随镜头                           |
| `timelineActions[69]`，`65..114`  | `camera_blocked == 0`        | 在两组挂点特效间切换；资源均为 `P_fxbat_wulfa_feidao_zidan_gua` |
| `timelineActions[70]`，`79..117`  | `camera_blocked == 0`        | 在 `P_fxbat_wulfa_pifeng_dimian` 与 `_01` 间切换                |
| `timelineActions[71]`，`61..236`  | `camera_blocked == 0`        | 在 `P_fxbat_wulfa_pifeng` 与 `_01` 间切换                       |
| `timelineActions[72]`，`63..112`  | `camera_blocked == 0`        | 在 `P_fxbat_wulfa_pifeng_attack_a` 与 `_01` 间切换              |
| `timelineActions[74]`，`120..250` | 主控且 `camera_blocked == 0` | 创建 `P_fxbat_wulfa_dao_post_pp`                                |
| `timelineActions[75]`，`63..115`  | 主控且 `camera_blocked == 0` | 创建跟随镜头的 `P_fxbat_wulfa_pifeng_attack_a_camera`           |

上述消费者全是 `EffectAction`。其配置只包含特效资源名、挂点、武器挂点、跟随方式、旋转方式和生命周期等表现字段；没有伤害、Buff、资源或事件行为，也没有把特效 ID 保存到新的战斗黑板键。

## 战斗相关性分类

### 可确定为纯镜头/表现：7 个

| 角色   | 使用点数 | 直接影响               | 间接影响                             |
| ------ | -------: | ---------------------- | ------------------------------------ |
| 陈千语 |        2 | 动画镜头选择           | 无                                   |
| 安塔尔 |        1 | 写入镜头状态           | 动画镜头、动态镜头控制、瞄准锁定     |
| 萤石   |        2 | 动画镜头选择           | 无                                   |
| 洛茜   |        2 | 动画镜头或写入镜头状态 | 动态镜头控制、瞄准锁定、特效资源选择 |

### 可能影响战斗数值或调度：0 个

未发现以下任一链路：

- 条件分支直接执行 `DamageAction`、失衡或附着动作；
- 创建、结束或修改 Buff；
- 修改技力、终结技能量或其他战斗资源；
- 修改技能冷却；
- 触发、抑制或替换技能；
- 控制投射物、能力实体或命中时间；
- 写入后续被战斗动作读取的黑板键；
- 改变 `AllowNextSkillAction`、中断窗口或其他排轴时序。

## 对生成器与模拟器的建议

### 当前可采用的规则

对 1.4.4 干员数据，可以将 `CheckSkillCameraMotionFree` 归入“表现条件”：

1. 若其所在 `IfElseAction` 的两侧递归展开后都只含镜头、UI、声音、特效或调试动作，则整个条件树不进入战斗 DSL；
2. 若分支写入黑板键，还需证明该键的全部消费者同样属于表现动作；本次的 `isWall` 与 `camera_blocked` 已满足该要求；
3. 不应把该条件编译为固定 `true` 或固定 `false`，因为这样会错误保留某一套表现分支；后端模拟应直接删除整条纯表现数据流。

### 不应泛化的规则

不能仅凭动作类型名称，在未来版本中无条件忽略所有 `CheckSkillCameraMotionFree`：

- 新版本可能把镜头条件结果复用于位移、锁定目标或其他战斗逻辑；
- 黑板键名称不是可靠的语义边界；
- `EffectAction` 目前是纯表现，但条件树中未来可能同时混入战斗动作。

因此，稳妥实现应以“条件分支及黑板消费者均为表现动作”的数据流证明为准。若出现未识别消费者或战斗动作，应 fail-closed 并重新审计。

## 生成器落地

生成器不为 `CheckSkillCameraMotionFree` 构造运行时条件，而是在正式 DSL 编译边界验证整棵条件树是否属于本报告证明过的纯表现形状：

- 条件组必须包含 `CheckSkillCameraMotionFree`；
- 解析器过滤镜头、特效和调试动作后，剩余分支必须为空，或仅包含 `ModifyDynamicBlackboard`；
- 黑板写入只允许 `isWall = 1` 或 `camera_blocked = 1`，且必须是字面量赋值；
- 任何新键、动态值、其他运算或战斗动作都会拒绝消隐，并继续作为生成缺口报告。

该规则让安塔尔终结技进入正式 DSL，同时保留完整审计树。它不会把镜头条件固定折叠为真或假，因此也不会误选某一套镜头分支。

阿列什处决的 `CheckTwoDirectionAngle(CameraForward, SourceToTarget)` 是另一份已审计样本：
成功/失败只把动态黑板 `camera` 写成 `1/2`，该键唯一的后续消费者是
`SwitchAction -> LockCameraAimAction` 的左右镜头参数，未进入伤害、资源、状态或目标选择。
生成器因此只对白名单值 `{1, 2}` 消去这棵条件树；其他写入值或其他消费者仍必须保留。

## 尚未完成的底层研究

本次任务已经回答“现有数据使用点是否影响战斗”，但没有完整回答原生条件内部如何判定。若后续需要复刻游戏镜头系统，还需：

1. 获取 `CheckSkillCameraMotionFree.ExecuteInternal` 的完整函数体，而不是当前截断的 512 字节快照；
2. 为其未命名调用目标恢复符号，确认检查了哪些相机管理器状态；
3. 确认 `cameraAnimKey` 的匹配、占用和碰撞规则；
4. 通过运行时样本验证条件返回值与 `isWall`、`camera_blocked` 的实际变化。

这些缺口不影响当前“7 个使用点对后端战斗模拟均为纯表现”的结论。
