# 当前全部干员模板刷新检查点

## 范围与来源

本轮遵循 AKEDB 优先、VFS 补缺，不发布资源、不改正式模板 pin、不恢复已回退的 VFS-only 批次。
复验输入为 `tmp/game-data-rebuild/run-dYAF19/sources`，AKEDB 版本 `1.5.3@9885010-4`，
6230 文件，整批 SHA256 `3c85bb1596f73d384403bdfe35f576b1ffb00beafcb13fe502fdc8154fd3331c`。
标签使用此前完整导出的 `run-KjA4Lw` 候选，并重新用其 source-set 做严格生成 `check`；
输入复验前后快照一致。报告 `tmp/operator-refresh-20260903/refresh-verified.json`。
这证明本地字节与来源记录一致，不证明 AKEDB 与 VFS 来自同一客户端/热修版本。

## 实际发现与处理

- 当前全部 32 份 CharacterData 的已解码前缀、黑板和连携条件可编译；它们仍是 partial 模板，
  没有声称完整原生模板解析成功。已有 30 名的 pin 全部变化，但不代表 30 名效果都变了。
- `chr_0034_typhoea` 的两个原生条件事件为 `addedBuff` 与 `beforeOutputDamage`。
  第二条依次取反检查 Pending、比较 trigger 与主控、检查箭能量 Buff 数量、比较 EntityBB。
  原先首先卡在 `CheckComboSkillPending`，补齐后暴露 Context/主控搜索比较，现均由公共链处理。
- `casterComboPending` 是参数为空的公共条件；来源严格限定已证明为 caster 的普通 Owner/Source，
  未证明目标和带筛选目标继续拒绝。模拟读取该角色候选数，不检查队首、技能阶段、CD 或 canCast，
  暂停计时不影响存在性，消费/过期后变 false。条件编辑器和三语名称同步接入。
- Context 比较复用 `contextTargetIdentityMatch`；只接已经绑定的单目标事件 `trigger` 与
  `CharacterTeamFinder + MainCharacterValidator`。未绑定 Context 继续拒绝：原生相等检查对
  任意列表执行全组合比较，空列表返回 true，不能随意降成首目标比较。
- 未配置的另一份模板是 `chr_0002_endminm`；管理员仍以女版生成唯一一套技能，不因此新增男版干员。
- 30 名现有干员技能库共 310 个配置技能，29 名通过。庄方宜唯一阻塞为
  `chr_0030_zhuangfy_ultimate_skill_end` 不在新版 CharGrowthTable 等级组。角色模板仍将它登记
  为主动技能，原 SkillData 也存在；尚未改配置，应核查内部结束技能/运行替换路由。

## 证据与实现边界

复刻库已具备两项语义，不需要复制研究或新增虚构规则：

- `combat-spec/docs/combo-skill-lifecycle.md`：CheckComboSkillPending RVA `0x060382C8` →
  HasPendingComboSkill RVA `0x060601F0`，只看该角色候选列表 Count > 0；空目标 false。
- `combat-spec/docs/check-targets-equal.md` 与 `selector-pipeline.md`：比较解析后的目标，
  CharacterTeamFinder 后由 MainCharacterValidator 保留当前主控 Entity。

这是既有 1.4.4 原生回退路径证据与当前 1.5.3 资源的适配，没有重新核验本版本机器码或 IFix。
复刻库 ComboSkill 定向 60/60 已通过，本轮不修改复刻库。
Endaxis 回归覆盖 JSON/RID 共用解析、错误目标拒绝、Pending 生命周期与实际装配条件短路。
编译器 139 文件 / 1575 项、Next 304 文件 / 4079 项及四套类型检查通过。

统一重建命令新增干员刷新阶段，不再只列角色身份；每名失败单独收集，并将 pin 变化、未配置身份
保留为需要审阅的阻塞。单独刷新检查已实际通过来源复验；完整命令本轮重跑 `run-8PfnvM`
在标签重新获取时 `fetch failed`，后续阶段正确标为 blocked，未借旧标签冒充本次网络导出。
因此不能声称本次完整命令贯通，`fullRebuild=false`、`published=false` 保持不变。

## 后续优先级

1. 核对庄方宜内部结束技能的等级/运行路由；技能库审计的 `parseValidationOptions` 尚未传递
   生成器已支持的 `runtimeReplacementSkillKeys`，修复时需做一致性回归，不靠配置绕过未知规则。
2. 推进同批能力实体、投射物黑板与全局配置输入，隔离更新候选 pin，完整编译新旧干员。
   不能从旧聚合生成物复制依赖来声称“全部删除后重建”。
3. 旧干员效果差异以 [已有字段差异审计](operator-refresh-differences-2026-09-03.md) 为线索：
   洛茜 Buff 时钟、赛希/别礼/莱万汀事件先后、诀同次施法过滤与时长、梨诺回调闭包、重击资源变化。
   需要同轴比较，不以源哈希或格式变化代替效果结论。
4. 新干员尚未正式配置或完整模拟；按四类技能原生路由安排技能库，不能仅按 ID 后缀猜技能连段。
   全武器仍有 `wpn_funnel_0020` 的 `OnBuffEnhanceChanged` 阻塞，不能漏记但也不能盖过干员刷新。
