# 元素附着状态链展示

旧版依据：只读工作树 Endaxis-upstream-main，4dadc55f；
projectEnemyEffects.ts 的附着切段，以及 ResourceMonitor.vue 的
afflictionConnectionItems / reactedAttachmentKeys。

## 已接入：同实例叠层与刷新

- 持续段仍唯一来自 projectBuffTimelineViz 的真实 Buff 生命周期，不另造状态或图标定义。
- 附着定义身份从现有 elementalAttachments 数据的 elementalAttachment role 取得，
  不根据图标、中文名称或 showInHeadBarAttached 猜测（后者也包含物理状态）。
- 同一 targetId / buffId / instanceId 的相邻切段构成延续关系；层数不变的刷新也延续。
- 有延续的前段以流动虚线和光点代替条纹条，图标和层数保留；最后一段仍为条纹条。
  自然结束、不同实例、不同目标及无关 Buff 不产生连接。
- 未修改模拟层数、持续时间、刷新或消耗规则。颜色继续消费现有显示偏好。

## 未接入：跨元素消耗与反应转换

旧版按段末同一时刻出现的状态猜后继，存在误连风险，新版不能照搬。
当前 ElementalInflictionApplied 有前后元素/层数、请求元素及分支，但尚未把这次
执行消费的具体 Buff 实例、产生的可见反应实例绑定为展示关系。下一步应在执行端
补齐明确身份/关联，覆盖嵌套 Buff 回调与同帧多次施加，不能只凭时间或来源技能匹配。

触发元素仅参与反应而未留下附着时只应显示瞬时节点；爆发与反应伤害继续与持续段
区分。转换渐变线、附着专用行与瞬时标记排版尚未整体完成。

## 验证

纯投影测试覆盖 3→4→4 的叠层/刷新、不同实例/定义/目标及时间间隙不连接。
正式佩丽卡连续两次战技测试得到同实例 1→2 层并连接前段，使用实际导出图标。
Vue 模板、脚本、样式编译通过。尚未做浏览器视觉验收，不能宣称完整复刻。
