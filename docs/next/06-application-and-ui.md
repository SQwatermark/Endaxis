# Endaxis Next 应用层与 UI

## 1. 迁移目标

Next UI 的目标不是重新设计 Endaxis，而是在底层数据差异允许的范围内，尽量保持旧版时间轴的布局、视觉层级和交互习惯。用户应能继续使用熟悉的干员槽、技能库、时间轴、资源曲线、编辑面板和快捷键。

旧组件可以作为视觉和交互参考，但新页面不能依赖旧 Pinia Store、旧 Simulator 或旧 TimelineAction 对象。

## 2. 应用层

`src/next/application` 将 core 能力组合成可供 UI 调用的用例。

### 项目加载

`openProject.ts` 组合版本识别、旧格式迁移和目录校验。UI 只处理明确结果，不解析 JSON 细节。

### 编辑会话

`ScenarioEditorSession` 保存当前场景、撤销/重做历史和订阅者。每次命令接收旧文档并返回新文档，避免 Watcher 无条件抓取整棵响应式状态。

历史保存用户文档，不保存面板、模拟结果和 UI 选择。撤销后所有派生值重新由当前项目计算。

### 模拟入口

- `runScenarioSimulation.ts`：通用“编译并执行”入口，并提供唯一的编译后执行阶段。
- `runStandardPlayerDamageScenarioSimulation.ts`：当前标准伤害能力配置适配器。

专用入口可以装配环境和预检能力，但不能复制时钟推进、结果冻结和资源投影。

## 3. 时间轴 UI 结构

主要页面是 `ui/timeline/NextTimelineEditor.vue`，组件按职责拆分：

- `TimelineWorkbenchShell.vue`：工作台布局。
- `TimelineHeaderToolbar.vue`、`TimelineCornerToolbar.vue`：顶部和角落工具区。
- `TimelineRuler.vue`：时间标尺。
- `TimelineTrackHeader.vue`：干员槽、轨道选择与顺序。
- `SkillLibraryCard.vue`：技能库块。
- `TimelineActionBlock.vue`：时间轴动作块。
- `TimelineActionContextMenu.vue`、`TimelineActionInspector.vue`：动作编辑。
- `TimelineResourceCurves.vue`：资源投影。
- 各类 Dialog：干员、武器、装备、敌人和面板编辑。

## 4. UI 数据边界

组件不应直接拼装领域对象。典型链路是：

```text
Component event
  -> composable / ViewModel
  -> pure document command
  -> ScenarioEditorSession.commit
  -> new project snapshot
  -> recompute view model / simulation
```

重要文件：

- `timelineEditorViewModel.ts`
- `loadoutBuildViewModel.ts`
- `useTimelineLoadoutEditor.ts`
- `useTimelineEnemyEditor.ts`
- `timelineDocumentCommands.ts`
- `timelineActionSelection.ts`

## 5. 选择、剪贴板和拖拽

选择状态与项目文档分离。复制时读取选中技能并生成剪贴板模型，粘贴时分配新的项目实例 ID。技能库使用拖放或明确放置动作，不能因单击就改变时间轴。

轨道顺序、动作位置和构筑修改都通过文档命令进入历史；鼠标框选、右键菜单和当前轨道属于瞬时 UI 状态。

## 6. 快捷键作用域

`ui/keyboard/keyboardShortcutRouter.ts` 提供页面级作用域路由：

- 高优先级活动作用域先处理；
- 处理后阻止穿透；
- 弹窗可阻止更低层时间轴快捷键；
- 文本输入保留浏览器原生编辑键；
- Vue scope 销毁时自动注销。

新增快捷键不得再次直接散落 `window.addEventListener`。详细规则见[按键交互架构](../architecture/endaxis-next-keyboard-interaction.md)。

## 7. i18n

领域层只保存稳定身份和数值。界面文本与游戏内容文本都在渲染层解析：

- UI 文本走 Vue i18n；
- 游戏名称和描述按文本族、语言和稳定 slug 查询；
- 路由按需加载需要的文本族；
- 项目、编译产物和 receipt 不保存翻译结果。

旧数据过渡适配集中在 `ui/legacy/legacyGameText.ts`、`legacyPresentation.ts` 和 `legacyProgression.ts`，不能扩散到 core。

## 8. 主题

主题由 `ui/theme/themeRegistry.ts` 的完整语义 token 定义。组件使用 `--ea-*` 变量，不把具体深色值写进领域数据。

主题是设备/UI 偏好，不进入项目文档、编译缓存键或模拟结果。战斗元素颜色和 UI 主题色是不同概念。

## 9. 旧版兼容策略

必须尽量保持：

- 页面区域和信息层级；
- 技能库、轨道和动作块的主要视觉身份；
- 干员/武器/装备选择流程；
- 常用拖拽、复制粘贴、选择和快捷键；
- 时间轴投影的含义。

允许变化：

- 因新领域模型而更准确的名称、分段和诊断；
- 尚未迁移功能的明确不可用提示；
- 为消除旧架构耦合而产生的内部组件边界。

视觉回归和迁移清单见[时间轴 UI 兼容迁移计划](../architecture/endaxis-next-ui-compatibility-plan.md)。
