# 结果边界复现

本页为[核心架构排查](core-architecture-audit.md)中的 H1/H2 提供可重复实验。基线为 `399dfd56b563ef701f32ddf44f5c6c891bb9a565`；实验只读取 Endaxis 模块，构建输出放在系统临时目录，不修改仓库源码。

## 方法与限制

在已安装锁定依赖的仓库根目录执行以下命令。使用已有 esbuild 打包原生模块，真实空场景执行 2 帧，然后检查协议边界。Worker 替身仅保存发送的请求，手动触发真实 `onmessage` 回调；这不是浏览器调度、页面卡死或异常事件上报的端到端实验。

H1 注入一个抛错的性能观察者，发送合法成功结果。检查微任务执行后 Promise 是否结算，以及 dispose 能否补救；不依赖“等了几毫秒仍未完成”来推断永久挂起。处理函数先删除 active 且没有后续结算路径才是主要证据。

H2 对真实模拟结果使用标准 `structuredClone`，检查原本冻结的曲线点和生命账本；不使用伪造的战斗数值作为结果证据。

```sh
node --input-type=module <<'NODE'
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const directory = await mkdtemp(join(tmpdir(), 'endaxis-audit-'));
try {
  const outfile = join(directory, 'reproduce.mjs');
  await build({
    stdin: {
      resolveDir: process.cwd(),
      loader: 'ts',
      contents: `
import { createScenarioSimulationService } from './src/application/simulation/createScenarioSimulationService';
import { createGameDataRepository } from './src/data/createGameDataRepository';
import { createEmptyScenario } from './src/core/project/createProject';
import { WorkerScenarioSimulationService } from './src/application/simulation/workerScenarioSimulationService';
import { fromSimulationWorkerResult, toSimulationWorkerResult } from './src/application/simulation/scenarioSimulationWorkerProtocol';

const scenario = createEmptyScenario('audit', 'audit');
const repository = createGameDataRepository({ revision: 'audit', operators: [], commonDefinitionSources: [] });
const localService = createScenarioSimulationService(repository);
const local = await localService.simulate(scenario, 2);
const wire = structuredClone(toSimulationWorkerResult(local));
const restored: any = fromSimulationWorkerResult(wire);
console.log('H2 frozen', {
  localPoint: Object.isFrozen(local.resourceCurves.sp.points[0]),
  workerPoint: Object.isFrozen(restored.resourceCurves.sp.points[0]),
  localVitals: Object.isFrozen(local.enemyVitals),
  workerVitals: Object.isFrozen(restored.enemyVitals),
});
const allowed = Reflect.set(restored.resourceCurves.sp.points[0], 'value', 987);
console.log('H2 write', { allowed, value: restored.resourceCurves.sp.points[0].value });
localService.clearCache();

const sent: unknown[] = [];
const worker: any = { postMessage: (request: unknown) => sent.push(request), terminate() {}, onmessage: null };
const gameData: any = {
  revision: 'audit', selectionKey: '', commonDefinitionSources: [], operators: [],
  weapons: [], gears: [], gearSets: [], enemies: [], mechanics: [], consumables: [], globalEffects: [],
};
const bridge = new WorkerScenarioSimulationService(worker, () => gameData);
let first = 'pending', second = 'pending';
bridge.subscribePerformance(() => { throw new Error('observer failed'); });
bridge.simulate(scenario, 2).then(() => first = 'resolved', () => first = 'rejected');
bridge.simulate(scenario, 3).then(() => second = 'resolved', () => second = 'rejected');
try {
  worker.onmessage({ data: {
    id: 1, ok: true, result: structuredClone(toSimulationWorkerResult(local)),
    samples: [{ totalMs: 1, simulationMs: 1, projectionMs: 0, outcome: 'completed', endFrame: 2, receiptCount: local.receiptHistory.length }],
  }});
} catch (error) { console.log('H1 callback throws', (error as Error).message); }
await Promise.resolve();
console.log('H1 before dispose', { first, second, sent: sent.length });
bridge.dispose();
await Promise.resolve();
console.log('H1 after dispose', { first, second });
`,
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile,
  });
  await import(pathToFileURL(outfile).href);
} finally {
  await rm(directory, { recursive: true, force: true });
}
NODE
```

## 基线输出

- H2：`localPoint: true, workerPoint: false, localVitals: true, workerVitals: false`；写入结果为 `allowed: true, value: 987`
- H1：回调抛出 `observer failed`；dispose 前 `first: pending, second: pending, sent: 1`；dispose 后 `first: pending, second: rejected`

修复后不能把这些基线输出直接作为通过条件。原生回归测试应断言观察错误不会悬空任务或阻止后续任务；跨线程结果保持本地同等的不可变保证。浏览器端还需检查 busy/stale 状态能正常结束。

## H1 整改后的预期

H1 的正式回归现位于 Worker 桥接、本地模拟服务和自适应服务的原生测试中。整改后，上述实验仍打印观察错误到控制台，但 `onmessage` 不再向调用者抛出该错误；dispose 前应为 `first: resolved, second: pending, sent: 2`，dispose 后为 `first: resolved, second: rejected`。第二请求已被发送，只因实验没有提供第二个响应而保持 pending，并能由 dispose 正常结算。

在 H1 提交中，H2 的嵌套冻结差异仍保留。后续 H2 整改只恢复显式发布保证：本实验的四个 frozen 标记均应为 true，写入结果为 `allowed: false, value: 200`。其他原来可变的字段不由这项整改深冻结。
