/** 从实际 SFC 提取命中标记读取路径，比较修复前后的输出与工作量。不是组件/paint 基准。 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { parse } from '@vue/compiler-sfc';
import ts from 'typescript';
import { computed, shallowRef } from 'vue';
import { expect, it } from 'vitest';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { createEditorSimulationService } from '../../src/application/simulation/editorSimulationService';
import { projectTimelineEditor } from '../../src/ui/timeline/timelineEditorViewModel';
import {
  matchingPublishedSkillCastIds,
  projectCompatibleHitFrames,
} from '../../src/ui/timeline/interaction/skillCastGroupInteraction';
import { projectSkillCastActualStartFrames } from '../../src/core/projection/timelineDisplayTime';
import {
  projectHitEffectsByCast,
  projectTimelineHitOccurrences,
  projectTimelineHitReceipts,
} from '../../src/ui/timeline/results/timelineHitEffects';
import {
  shouldDisplayTimelineHitMarker,
  type TimelineHitMarkerView,
} from '../../src/ui/timeline/results/timelineHitProjection';
import { i18n } from '../../src/i18n';
import { skillFixture } from '../../src/test/skillFixture';
import { resolveEffectiveSkillDefinition } from '../../src/core/compiler/resolveSkillDefinition';
import type { ScenarioDocument, TrackIndex } from '../../src/core/project/schema';
import type { ScenarioSimulationRun } from '../../src/application/simulation/scenarioSimulationService';

const text = parse(readFileSync('src/ui/timeline/TimelineEditor.vue', 'utf8')).descriptor
  .scriptSetup!.content;
const source = ts.createSourceFile(
  'TimelineEditor.ts',
  text,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const needed = new Set(['castHitMarkers', 'hitMarkerTitle', 'reactionName', 'damageElementLabel']);
const snippets: string[] = [];
for (const node of source.statements) {
  if (ts.isFunctionDeclaration(node) && node.name && needed.has(node.name.text)) {
    snippets.push(node.getText(source));
    needed.delete(node.name.text);
  } else if (ts.isVariableStatement(node)) {
    for (const declaration of node.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && needed.has(declaration.name.text)) {
        snippets.push(`let ${declaration.getText(source)};`);
        needed.delete(declaration.name.text);
      }
    }
  }
}
if (needed.size) throw new Error(`UI audit entry points changed: ${[...needed].join(', ')}`);
const executable = ts.transpileModule(snippets.join('\n'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

const baselineExecutable = ts.transpileModule(
  readFileSync('tools/performance/fixtures/hit-marker-read-before-cleanup.ts.txt', 'utf8'),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } },
).outputText;

it('真实轴命中标记与修复前完全相等，且不再执行未消费的效果投影', async () => {
  const reports: unknown[] = [];
  for (const file of readdirSync('tools/performance/fixtures/public-timelines').filter(file =>
    file.endsWith('.project.json'),
  )) {
    const parsed = parseProjectDocument(
      readFileSync(`tools/performance/fixtures/public-timelines/${file}`, 'utf8'),
    );
    if (!parsed.ok) throw new Error(JSON.stringify(parsed));
    const repository = await createProjectGameDataRepository(parsed.value);
    const base = parsed.value.scenarios[0]!;
    const service = createEditorSimulationService(repository);
    const run = await service.simulate(
      base,
      base.battle.simulationRange?.endFrame ?? base.battle.durationFrames,
    );
    service.clearCache();
    function harness(
      initial: ScenarioDocument,
      result: ScenarioSimulationRun | null,
      baseline: boolean,
    ) {
      let projectionCalls = 0;
      let projectionMs = 0;
      let viewCalls = 0;
      let viewMs = 0;
      let effectsGetterMs = 0;
      let occurrencesMs = 0;
      let receiptsMs = 0;
      let readMs = 0;
      const scenario = shallowRef(initial);
      const simulationRun = shallowRef(result);
      const compatibleSkillCastReceiptIds = computed(() =>
        matchingPublishedSkillCastIds(scenario.value, result ? base : undefined),
      );
      const viewModel = computed(() => {
        viewCalls++;
        const started = performance.now();
        const value = projectTimelineEditor(scenario.value, repository);
        viewMs += performance.now() - started;
        return value;
      });
      const publishedReceiptEntries = computed(() => simulationRun.value?.receiptEntries ?? []);
      const hitReceipts = computed(() => {
        const started = performance.now();
        const value = projectTimelineHitReceipts(publishedReceiptEntries.value);
        receiptsMs += performance.now() - started;
        return value;
      });
      const publishedHitOccurrences = computed(() => {
        const started = performance.now();
        const value = projectTimelineHitOccurrences(publishedReceiptEntries.value);
        occurrencesMs += performance.now() - started;
        return value;
      });
      const dependencies = {
        computed: <T>(getter: () => T) =>
          computed(() => {
            const started = performance.now();
            const value = getter();
            effectsGetterMs += performance.now() - started;
            return value;
          }),
        simulationRun,
        scenario,
        viewModel,
        compatibleSkillCastReceiptIds,
        publishedReceiptEntries,
        hitReceipts,
        skillCastActualStartFrames: computed(() =>
          projectSkillCastActualStartFrames(publishedReceiptEntries.value),
        ),
        hitActualFrames: computed(() =>
          projectCompatibleHitFrames(
            hitReceipts.value.damages,
            compatibleSkillCastReceiptIds.value,
          ),
        ),
        hitOccurrences: computed(
          () =>
            new Map(
              [...publishedHitOccurrences.value].filter(([id]) =>
                compatibleSkillCastReceiptIds.value.has(id),
              ),
            ),
        ),
        publishedRandomMode: computed(() =>
          result ? (base.battle.random?.mode ?? 'expected') : 'expected',
        ),
        shouldDisplayTimelineHitMarker,
        timelineFramePx: (frame: number) => frame,
        t: i18n.global.t,
        projectHitEffectsByCast: (...args: Parameters<typeof projectHitEffectsByCast>) => {
          projectionCalls++;
          const started = performance.now();
          const value = projectHitEffectsByCast(...args);
          projectionMs += performance.now() - started;
          return value;
        },
      };
      // 生产入口与修复前冻结的最小读取路径对比，完整比较标记和提示内容。
      const factory = new Function(
        ...Object.keys(dependencies),
        `${baseline ? baselineExecutable : executable}\nreturn castHitMarkers;`,
      );
      const markers = factory(...Object.values(dependencies)) as (
        trackIndex: TrackIndex,
        castId: string,
      ) => TimelineHitMarkerView[];
      const read = () => {
        const started = performance.now();
        const value = viewModel.value.tracks.flatMap(track =>
          track.skillCasts.map(cast => ({
            id: cast.id,
            markers: markers(track.trackIndex, cast.id),
          })),
        );
        readMs += performance.now() - started;
        return value;
      };
      return {
        scenario,
        read,
        viewModel,
        counts: () => ({
          projectionCalls,
          projectionMs,
          viewCalls,
          viewMs,
          effectsGetterMs,
          occurrencesMs,
          receiptsMs,
          readMs,
        }),
      };
    }
    for (const state of [
      'published',
      'stale',
      'no-run',
      'custom-no-run',
      'custom-published',
    ] as const) {
      const candidate = structuredClone(base);
      const cast = candidate.tracks
        .flatMap(track => track?.skillCasts ?? [])
        .find(cast => cast.placement.startFrame !== undefined)!;
      if (state === 'stale') cast.placement.startFrame! += 30;
      if (state === 'custom-no-run' || state === 'custom-published') {
        const track = candidate.tracks.find(track => track?.skillCasts.includes(cast))!;
        const operator = repository.getOperator(track.operator!.operatorSlug)!;
        const originalDefinition = resolveEffectiveSkillDefinition(cast, operator).definition;
        const fixtureDefinition = skillFixture({
          key: cast.source.kind === 'operatorSkill' ? cast.source.skillKey : 'audit',
          timelineBlockFrames: 30,
          scheduledSequences: [{ startFrame: 0, sequence: { $sequence: 'direct' } }],
          actionGraph: {
            main: {
              nodes: {
                direct: {
                  action: {
                    kind: 'dealDamage',
                    parameters: { damageType: 'electric', attackScale: 1, tags: [] },
                  },
                  next: 'conditional',
                },
                conditional: {
                  action: {
                    kind: 'conditional',
                    parameters: { condition: { kind: 'combatActive' } },
                    whenTrue: { $sequence: 'hidden' },
                  },
                  next: null,
                },
                hidden: {
                  action: {
                    kind: 'dealDamage',
                    key: 'conditional-hit',
                    parameters: { damageType: 'electric', attackScale: 1, tags: [] },
                  },
                  next: null,
                },
              },
            },
            macros: {},
          },
        });
        cast.customDefinition = {
          ...originalDefinition,
          scheduledSequences: fixtureDefinition.scheduledSequences,
          actionGraph: {
            ...originalDefinition.actionGraph,
            main: {
              ...originalDefinition.actionGraph.main,
              nodes: {
                ...originalDefinition.actionGraph.main.nodes,
                ...fixtureDefinition.actionGraph.main.nodes,
              },
            },
          },
        };
      }
      const result =
        state === 'custom-published'
          ? await service.simulate(
              candidate,
              candidate.battle.simulationRange?.endFrame ?? candidate.battle.durationFrames,
            )
          : state === 'published' || state === 'stale'
            ? run
            : null;
      service.clearCache();
      const current = harness(candidate, result, false);
      const beforeCleanup = harness(candidate, result, true);
      const output = current.read();
      expect(beforeCleanup.read()).toEqual(output);
      const before = current.viewModel.value;
      // 修改一个 placement，不替换未动轨道的文档引用，观察实际全轨投影的身份变化。
      const moved = {
        ...candidate,
        tracks: candidate.tracks.map(track =>
          track && track.skillCasts.some(item => item.id === cast.id)
            ? {
                ...track,
                skillCasts: track.skillCasts.map(item =>
                  item.id === cast.id
                    ? {
                        ...item,
                        placement: {
                          ...item.placement,
                          startFrame: item.placement.startFrame! + 1,
                        },
                      }
                    : item,
                ),
              }
            : track,
        ) as ScenarioDocument['tracks'],
      };
      current.scenario.value = moved;
      beforeCleanup.scenario.value = moved;
      expect(beforeCleanup.read()).toEqual(current.read());
      expect(current.counts().projectionCalls).toBe(0);
      if (result !== null) expect(beforeCleanup.counts().projectionCalls).toBeGreaterThan(0);
      const after = current.viewModel.value;
      reports.push({
        fixture: file,
        state,
        castCount: output.length,
        markerCount: output.reduce((n, row) => n + row.markers.length, 0),
        current: current.counts(),
        beforeCleanup: beforeCleanup.counts(),
        changedModelTracks: after.tracks.filter((track, index) => track !== before.tracks[index])
          .length,
      });
    }
  }
  if (process.env.UI_HIT_AUDIT_OUTPUT)
    writeFileSync(process.env.UI_HIT_AUDIT_OUTPUT, JSON.stringify(reports, null, 2), {
      flag: 'wx',
    });
  console.log(JSON.stringify(reports));
}, 120_000);
