# `CheckTargetAngle` 原生语义与 Next 投影边界

日期：2026-08-22

## 结论

`CheckTargetAngle` 不是“配置 180 度即恒真”。`Gameplay.Beyond.dll` 中
`CheckTargetAngle.ExecuteInternal`（1.4.4 转储 RVA `0x071C31A0`，token
`0x0601587E`）及当前 `GameAssembly.dll` 的对应机器码共同证明其流程为：

1. 先解析 `target`，再解析 `origin`；任一目标不存在即返回 false；
2. 在 XZ 平面归一化 `origin.position - target.position`；
3. 在 XZ 平面归一化目标朝向；`TargetBackward` 会将朝向取反；
4. 计算两向量绕 `Vector3.up` 的有符号夹角并取绝对值；
5. 判断 `abs(angle) <= configuredAngle * 0.5 + 1e-5`。

两点重合时方向向量为零，Unity 角度结果为 0，因此会通过非负阈值；但项目的
“所有距离为 0”抽象没有给一般目标定义朝向，不能据此把任意角度条件编译成恒真。
完整原生复刻、测试和反汇编记录先落在同级 `combat-spec` 仓库的
`docs/target-angle-condition.md`。

## 当前语料与安全投影

当前 320 个干员入口技能中，Snowshine 与 Catcher 的普通战技各出现两次该条件。
四处载荷均为 `TargetForward + 180`，成功/失败分支在过滤旋转、Context 转换和镜头
动作后只剩 `is_cam = 1/0`；全目录消费者也仅为相机控制动作，没有进入伤害、失衡、
附着、Buff、资源、冷却或调度。

因此 Next 做的是表现投影，而不是角度求值：

- parser 严格保留 origin、target、angleType 和动态 angle；未知字段及角度类型失败关闭；
- 只有条件树含 `CheckTargetAngle`，且所有剩余分支叶子都只是已审计的字面量
  `is_cam = 0/1` 时，整棵树才可省略；
- 任意新黑板键、动态值、其他操作或战斗叶子都会继续阻塞；
- 条件可与主控身份等额外守卫并列，因为被省略的是已证明纯表现的整个分支副作用，
  不是把额外守卫推断为恒真。

该边界让 Snowshine 与 Catcher 退出阻塞列表，同时没有向模拟器引入虚构的统一空间
朝向。
