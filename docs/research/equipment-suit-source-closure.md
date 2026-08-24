# 装备套装来源闭包审计

- 客户端版本：`1.4.4@9433094-12`
- 套装：23
- 被动 SkillData：23
- 闭包 BuffData：49
- 触发阈值：3 件
- SkillData 闭包 SHA256：`210a5afade12af113f6e0640725442ef17203f9b67f7059589b9ccbc0d3de667`
- BuffData 闭包 SHA256：`2ac287a0c2fb7435880b050b03d7eb0614951175d32da63dc00b559e711485f0`

全部套装均已沿 `EquipSuitTable → SkillData → BuffData` 的活动静态引用闭合；动态、关闭或空引用不参与定义遍历。
