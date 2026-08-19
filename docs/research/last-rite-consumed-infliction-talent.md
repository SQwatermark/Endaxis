# Last Rite 天赋 1：法术附着消费事件证据

## 结论

1.4.4 的 `buff_chr_0026_lastrite_talent_1` 监听 `OnConsumeBuff`，只接受 GameplayTag
`-193971080` 对应的法术附着集合。事件携带的实际消费层数写入 `infliction_num`，随后计算
`crystal_vul = infliction_num * crystal_up`，并给事件目标施加 15 秒晶体易伤。

Next 不保存这个原生 Tag，也不把监听 Buff 注册成共享模板。元素附着适配器在不同元素生成复合状态、
实际移除旧附着后，同步发布 `elementalAttachmentConsumed`，携带来源干员、目标、旧元素和实际层数；
养成事件程序用事件层数覆盖动态黑板，再执行内联的计算与易伤 Buff。

## Tag 集合边界

当前数据没有可直接读取的 Tag 名称字典，因此不声称恢复了原生符号名。集合身份由同版本语料交叉闭合：

- `buff_chr_0026_lastrite_talent_1`：`OnConsumeBuff` 查询该 Tag 后读取消费层数；
- `buff_gambling_dispel_spellinf`：按该 Tag 结束 `spellinf`；
- `buff_train_check_any_inflict`：训练逻辑用该 Tag 判断任意法术附着；
- 庄方宜、乌尔夫加德连携 SkillData：用该 Tag 作为法术附着智能选敌条件；
- 四种真实附着 Buff 分别使用各自元素子 Tag，Next 仍以已生成的 `elementalAttachment` 角色识别实例，
  不实现未经证明的通用 Tag 父子匹配。

因此本次只发布“已被元素附着状态机实际消费”的事实，不把 `-193971080` 推广成通用 Buff 查询规则。

## 数值与生命周期

- 天赋等级 1/2：`crystal_up = 0.02 / 0.04`；
- `duration = 15` 秒；
- 子 Buff：`HighPriority`，优先级读取 `crystal_vul`，仅寒冷伤害进入易伤区间；
- `SaveBuffLifeTime -> VulnerableAction(Crystal)` 在 Next 中等价为随宿主 Buff 生命周期注册的寒冷易伤修正，
  不创建额外计时实体。

原始来源为本地 AKEDB/VFS 1.4.4 `PotentialTalentEffectTable` 与对应两份 BuffData。
