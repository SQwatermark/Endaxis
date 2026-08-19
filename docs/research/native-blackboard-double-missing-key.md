# `BlackboardDouble.GetValue` 缺键语义（1.4.4）

## 结论

`BlackboardDouble.GetValue` 在 `useBlackboardKey = true` 时不会把序列化字段 `value`
当作缺键回退值。黑板查询失败会记录错误并返回 `0.0`。因此生成器不得用动作 JSON 中的
`value` 掩盖缺失的动态键来源。

这不等于动态声明没有初值。SkillData `blackboard` 中明确存在的数值声明会创建该技能实例的
黑板项；递归投射物/能力实体子 SkillData 在继承黑板和显式赋值覆盖之前，应保留自己的声明
初值。两条规则必须分开：

- 键未声明、未继承且未写入：原生缺键路径，生成器继续失败关闭；
- 子 SkillData 明确声明动态数值键，且没有更晚来源覆盖：可使用声明初值；
- 动作同时保存的 `BlackboardDouble.value`：在启用黑板键时不是回退证据。

## 版本与文件

- 游戏版本基线：`1.4.4@9433094-12`
- `GameAssembly.dll` SHA-256：
  `0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`
- 元数据：`IL2CPP_Dump_Normal/Gameplay.Beyond.dll.cs`
- `BlackboardDouble.GetValue` RVA：`0x03D6EBB0`
- 本地虚拟 RVA 映像 SHA-256：
  `48356792A3A9A57F90ACBBE0EBC898817A1CB8CF4135B6249563B78AF519C28B`

## 原生控制流

`GetValue` 先把输出槽清零，再调用黑板查询帮助函数。查询成功时返回输出槽；失败时跳到
`0x051E1CE6`。失败块取得键名、调用日志路径，随后执行：

```text
051E1D2C  xorps xmm0, xmm0
051E1D2F  jmp   0x03D6EC49
```

返回寄存器因此是 `0.0`。该路径没有读取 `BlackboardParamBase.value`。空黑板和初始化异常另走
错误路径，也没有出现序列化字面量回退。

## Tangtang 样本

`chr_0027_tangtang_normal_skill_water_projhit_damage` 的伤害倍率启用键
`tornado_atk_scale01`，动作字面量为 `0.9`；同一 SkillData 的 `blackboard` 明确声明该动态键
初值为 `0.0`。因此连携调用链可以证明的值是声明初值 `0.0`，不是 `0.9`。

启用这条严格声明初值规则后，Tangtang 连携的下一阻塞推进到水体 Aura 的进出区域行为；
这证明动态标量问题已被独立消除，但不代表整条连携已经闭环。
