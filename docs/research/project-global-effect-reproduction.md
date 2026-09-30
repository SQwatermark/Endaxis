# 项目全局效果的查询与导出缺口复现

对应[逐模块审查 D06](module-architecture-review.md#d06页面联合查询遗漏项目全局效果)及 D07 当前方案导出缺口。检查基线为 `8bcc46b97e03dedd7fb84480dbee7c0fcda43d93`；后续到本记录的提交只改文档。

## 实际入口链

1. `TimelineEditor.vue:1867–1882` 把内置和项目全局效果放入资产工作区。`WorkspaceAssetSession` 支持从内置效果创建项目副本；`saveWorkspaceAsset`（`:1920–1934`）通过 `saveProjectTemplateDefinition` 保存项目库。
2. `globalEffectChoices`（`:1902–1918`）明确把项目库条目提供给 `GlobalResourcePanel`。面板的 `set-config` 经 `updateGlobalConfig` 写入场景的 effectId 引用（`:7172–7180`）。因此项目全局效果不是只有手工造 JSON 才能出现的对象。
3. 路由（`src/router/index.ts:35–41,69–78`）传入异步内置装载器建立的仓库。项目打开校验可以组合项目定义；它不把这些定义写回传给页面的基础仓库。
4. 页面另有手写 `editorGameDataRepository`（`:1234–1262`），覆盖角色、武器、装备、套装的查询与枚举，却继承基础仓库的 getGlobalEffect/getGlobalEffects。模拟服务与 Worker 数据捕获实际使用这份页面查询对象（`:1553–1564`）。
5. 共享的 `core/project/projectDefinitionLibrary.ts:578–663` 组合器实现了项目全局效果查询。使用它的单元测试通过，不能证明页面手写组合器也覆盖了相同类型。

## 无浏览器复现

下面在仓库根目录运行，不修改源码、存档或正式数据。它使用真实内置效果、工作区会话、保存命令和项目打开入口；页面查询对象的初始化表达式从当前 SFC 的 TypeScript AST 提取并执行，而不是重新手写一份类似对象。

它只执行该查询对象初始化，不挂载 Vue 页面、不操作浏览器，也不宣称完成整条浏览器端到端测试。原生保存、打开、选择入口的源代码链和查询/数据捕获失败共同构成这里的证据。

```sh
node <<'NODE'
const fs = require('node:fs');
const ts = require('typescript');
const esbuild = require('esbuild');
const { parse } = require('@vue/compiler-sfc');
const source = parse(fs.readFileSync('src/ui/timeline/TimelineEditor.vue', 'utf8'))
  .descriptor.scriptSetup.content;
const ast = ts.createSourceFile('TimelineEditor.ts', source, ts.ScriptTarget.Latest, true);
let initializer;
function visit(node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) &&
      node.name.text === 'editorGameDataRepository') initializer = node.initializer.getText(ast);
  ts.forEachChild(node, visit);
}
visit(ast);
if (!initializer) throw new Error('UI repository initializer missing');
const js = esbuild.transformSync(
  `const create = (gameDataRepository, projectDefinitionLibrary) => (${initializer});`,
  { loader: 'ts', target: 'es2023' },
).code;
const createUiRepository = new Function(js + ';return create;')();
const code = esbuild.buildSync({
  stdin: {
    resolveDir: process.cwd(), loader: 'ts',
    contents: `
      export { createGameDataRepository } from './src/data/createGameDataRepository';
      export { createEmptyProject } from './src/core/project/createProject';
      export { WorkspaceAssetSession } from './src/ui/asset-workspace/workspaceSession';
      export { saveProjectTemplateDefinition } from './src/application/editor/projectTemplateCommands';
      export { GLOBAL_EFFECT_PRESETS } from './src/data/globalEffectPresets';
      export { openProject } from './src/application/openProject';
      export { selectProjectExportScope } from './src/ui/timeline/projectFileSession';
      export { serializeProjectDocument } from './src/core/project/serialization';
      export { createProjectGameDataRepository } from './src/core/project/projectDefinitionLibrary';
      export { captureScenarioSimulationGameData } from './src/application/simulation/scenarioSimulationGameData';
    `,
  },
  bundle: true, platform: 'node', format: 'cjs', write: false,
}).outputFiles[0].text;
const loaded = { exports: {} };
new Function('module', 'exports', 'require', code)(loaded, loaded.exports, require);
const api = loaded.exports;
const builtin = api.GLOBAL_EFFECT_PRESETS[0];
const base = api.createGameDataRepository({ revision: 'repro', globalEffects: api.GLOBAL_EFFECT_PRESETS });
const id = 'project:globalEffect:repro';
const session = new api.WorkspaceAssetSession({
  id: 'globalEffect:' + builtin.id, kind: 'globalEffect', kindName: '全局效果',
  name: 'repro', custom: false, edit: { kind: 'globalEffect', definition: builtin },
}, id);
const request = session.saveRequest();
const project = api.saveProjectTemplateDefinition(
  api.createEmptyProject({ createdWith: 'repro' }), request.draft.edit,
  request.sourceId, request.targetId, request.draft.name, request.replace,
  request.draft.graphPresentations,
);
const library = project.definitionLibrary;
const scenario = project.scenarios[0];
scenario.globalConfig.effects = [{ effectId: id, enabled: true }];
console.log('native project open', api.openProject(project, { gameDataRepository: base }).ok);
const actualUi = createUiRepository(base, { value: library });
const shared = api.createProjectGameDataRepository(base, library);
console.log('UI lookup', actualUi.getGlobalEffect(id));
console.log('shared lookup', shared.getGlobalEffect(id).id);
try {
  api.captureScenarioSimulationGameData(scenario, actualUi);
  console.log('unexpected success');
} catch (error) { console.log('UI capture failure', error.message); }
console.log('shared capture', api.captureScenarioSimulationGameData(scenario, shared)
  .globalEffects.map(effect => effect.id));
const current = api.selectProjectExportScope(project, 'current');
const serialized = api.serializeProjectDocument(current);
console.log('all effect keys', Object.keys(api.selectProjectExportScope(project, 'all').definitionLibrary.globalEffects));
console.log('current saved library keys', Object.keys(JSON.parse(serialized).definitionLibrary));
console.log('current effect references', current.scenarios[0].globalConfig.effects);
console.log('current reopened', api.openProject(serialized, { gameDataRepository: base }).ok);
try {
  api.captureScenarioSimulationGameData(current.scenarios[0],
    api.createProjectGameDataRepository(base, current.definitionLibrary));
  console.log('unexpected current capture success');
} catch (error) { console.log('current shared capture failure', error.message); }
console.log('original retained', Object.hasOwn(project.definitionLibrary.globalEffects, id));
NODE
```

## 基线输出与整改验收

输出依次为：项目打开 `true`；页面查询 `null`；共享查询返回项目效果 ID；页面捕获抛出 `global effect definition 'project:globalEffect:repro' does not exist`；共享捕获包含该 ID。

最小建议是让页面联合查询复用同一项目组合规则，并保留定义提交/撤销时的缓存换代。不要只在捕获失败处回退到内置效果，那会改变用户选择的定义。验收应通过真实保存/打开后的项目视图，同时覆盖选择目录、主线程模拟、Worker 捕获，以及保存修改/撤销后的新定义；还需浏览器确认选择项目全局效果后的实际界面结果。

## D07：当前方案导出丢失定义

`projectFileSession.ts:12–51` 的裁剪只收集角色、武器、装备与套装，返回的 definitionLibrary 不包含 globalEffects，但保留场景 effectId。导出对话框的真实 scope 枚举是 `current | all`，当前方案按钮会发出 current；`TimelineEditor.vue:1180–1189` 的当前方案分享码也使用 current，PNG 导出复用该分享码。

上述新增输出为：all 仍含项目效果；current 序列化后的库只有 operators/weapons/gears/gearSets，引用仍为项目 effectId；openProject 对该缺失定义的文件仍返回 true，但经正确的共享组合器捕获数据时失败。原项目保留定义（`original retained: true`），因此丢失发生在当前方案导出载荷，不是删除了原项目资产。这个缺口独立于 D06 的页面查询错误。

后续应补齐当前方案导出的依赖闭包，并使打开校验能识别缺失的项目全局效果引用。验收比较 all/current 保存内容，检查重新打开后主线程与 Worker 使用相同项目效果；覆盖启用和保存但禁用的引用，并确认未引用的模板仍可裁剪。不要把静默回退内置效果或忽略该引用当成修复。
