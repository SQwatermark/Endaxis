/** 由专用验收命令分别绑定优化前/后的源码，验证不计入性能计时。 */
import { readFileSync, writeFileSync } from 'node:fs';
import { serialize } from 'node:v8';
import { createHash } from 'node:crypto';
import { createScenarioSimulationService } from '../../src/application/simulation/createScenarioSimulationService';
import { toSimulationWorkerResult } from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import {
  createProjectGameDataRepository as overlay,
  getProjectDefinitionLibrary,
} from '../../src/core/project/projectDefinitionLibrary';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { projectCombatHudSnapshot } from '../../src/core/projection/combatHudSnapshot';
import { projectOperatorPassiveUiTimelineViz } from '../../src/core/projection/operatorPassiveUiTimelineViz';
import { projectBuffTimelineViz } from '../../src/core/projection/buffTimelineViz';
import { CombatReceiptCollector } from '../../src/core/combat/receipt/combatReceipt';
import { resolveControlTimeline } from '../../src/core/project/resolveControlTimeline';

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('expected input and output');
const parsed = parseProjectDocument(readFileSync(input, 'utf8'));
if (!parsed.ok) throw new Error(JSON.stringify(parsed));
const project = parsed.value;
const scenario = project.scenarios[0]!;
const repository = overlay(
  await createProjectGameDataRepository(project),
  getProjectDefinitionLibrary(project),
);
const service = createScenarioSimulationService(repository, false);
const endFrame = scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
const run = await service.simulate(scenario, endFrame);
const session = service.createCombatSession(scenario, endFrame);
session.advanceToFrame(endFrame);
const state = session.runtime.readState();
const operatorPassiveUis = scenario.tracks.flatMap(track => {
  if (!track?.operator) return [];
  const definition = repository.getOperator(track.operator.operatorSlug)?.passiveUi;
  return definition ? [{ operatorId: track.id, definition }] : [];
});
const operatorSkillSlots = scenario.tracks.flatMap(track => {
  if (!track?.operator) return [];
  return [
    {
      operatorId: track.id,
      slots: (repository.getOperator(track.operator.operatorSlug)?.skillSlots ?? []).map(slot => ({
        skillSlotKey: slot.key,
        currentSkillKey: slot.baseSkillKey,
      })),
    },
  ];
});
const controlTimeline = resolveControlTimeline(
  scenario.tracks,
  scenario.battle.controlSwitches,
  -scenario.battle.prepFrames,
);
const hud = createHash('sha256');
for (let frame = -scenario.battle.prepFrames; frame <= endFrame; frame++) {
  hud.update(
    JSON.stringify(
      projectCombatHudSnapshot({
        ...run,
        frame,
        endFrame,
        receiptEntries: run.receiptEntries,
        operatorPassiveUis,
        operatorSkillSlots,
        controlTimeline,
      }),
    ),
  );
}
const collectorRestoreMs: number[] = [];
let observedHistoryLength = 0;
for (let batch = 0; batch < 23; batch++) {
  const started = performance.now();
  for (let iteration = 0; iteration < 20; iteration++)
    observedHistoryLength += new CombatReceiptCollector(run.receiptHistory).history.length;
  if (batch >= 3) collectorRestoreMs.push((performance.now() - started) / 20);
}
if (observedHistoryLength !== run.receiptHistory.length * 23 * 20)
  throw new Error('collector prefix reconstruction changed history length');
writeFileSync(
  output,
  serialize({
    result: toSimulationWorkerResult(run),
    state,
    collectorRestoreMs,
    hudSha256: hud.digest('hex'),
    hudFrames: endFrame + scenario.battle.prepFrames + 1,
    passiveUiTimeline: projectOperatorPassiveUiTimelineViz(
      run.receiptEntries,
      endFrame,
      operatorPassiveUis,
    ),
    buffTimeline: projectBuffTimelineViz(run.receiptEntries, endFrame),
  }),
);
