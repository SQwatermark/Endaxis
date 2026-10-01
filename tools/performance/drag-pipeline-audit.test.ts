/** 离线调度审计：真实手势/编辑会话/模拟/Worker 协议；不测浏览器布局或绘制。 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { effectScope, nextTick, shallowRef, watch } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { ScenarioEditorSession } from '../../src/application/editor/scenarioEditorSession';
import { createEditorSimulationService } from '../../src/application/simulation/editorSimulationService';
import { AdaptiveTimelineSimulationService } from '../../src/application/simulation/adaptiveTimelineSimulationService';
import { WorkerScenarioSimulationService } from '../../src/application/simulation/workerScenarioSimulationService';
import { captureScenarioSimulationGameData } from '../../src/application/simulation/scenarioSimulationGameData';
import * as workerProtocol from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import type {
  SimulationWorkerRequest,
  SimulationWorkerResponse,
} from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import { useScenarioSimulation } from '../../src/ui/timeline/useScenarioSimulation';
import { usePublishedSimulationDisplay } from '../../src/ui/timeline/results/usePublishedSimulationDisplay';
import { useTimelineCastMove } from '../../src/ui/timeline/interaction/useTimelineCastMove';
import { createEmptyTimelineActionSelection } from '../../src/ui/timeline/interaction/timelineActionSelection';
import { createInteractionSession } from '../../src/ui/interaction/interactionSession';
import type { TrackIndex } from '../../src/core/project/schema';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const directory = 'tools/performance/fixtures/public-timelines';
const flush = async () => {
  for (let i = 0; i < 12; i++) await nextTick();
};

it('审计公开轴的真实拖动调度链并验证最终落点与撤销', async () => {
  const reports: Array<{
    fixture: string;
    mode: string;
    castId: string;
    startFrame: number;
    counts: Record<string, Record<string, number>>;
    timeline: Array<Record<string, unknown>>;
  }> = [];
  let recordProtocol: (kind: string, details: Record<string, unknown>) => void = () => {};
  const encode = workerProtocol.toSimulationWorkerResult;
  const decode = workerProtocol.fromSimulationWorkerResult;
  vi.spyOn(workerProtocol, 'toSimulationWorkerResult').mockImplementation(result => {
    const started = performance.now();
    const encoded = encode(result);
    recordProtocol('worker-encode', { durationMs: performance.now() - started });
    return encoded;
  });
  vi.spyOn(workerProtocol, 'fromSimulationWorkerResult').mockImplementation(result => {
    const started = performance.now();
    const decoded = decode(result);
    recordProtocol('main-restore', { durationMs: performance.now() - started });
    return decoded;
  });
  // 手动推进运输时钟；真正的 Worker 入口执行模拟和投影，消息两边仍做结构化克隆。
  const workerGlobal = {
    onmessage: undefined as unknown as (
      event: MessageEvent<SimulationWorkerRequest>,
    ) => Promise<void>,
    postMessage: (_response: SimulationWorkerResponse) => {},
  };
  vi.stubGlobal('self', workerGlobal);
  await import('../../src/application/simulation/scenarioSimulation.worker');
  const files = readdirSync(directory).filter(name => name.endsWith('.project.json'));
  const selectedFiles = files.filter(
    name => !process.env.DRAG_AUDIT_FIXTURE || name.startsWith(process.env.DRAG_AUDIT_FIXTURE),
  );
  if (selectedFiles.length === 0) throw new Error('No matching public fixture');
  for (const file of selectedFiles) {
    const parsed = parseProjectDocument(readFileSync(`${directory}/${file}`, 'utf8'));
    if (!parsed.ok) throw new Error(JSON.stringify(parsed));
    const repository = await createProjectGameDataRepository(parsed.value);
    for (const mode of ['settled-worker', 'burst-worker', 'settled-local'] as const) {
      const base = structuredClone(parsed.value.scenarios[0]!);
      const inputHash = JSON.stringify(base);
      const trackIndex = base.tracks.findIndex(track =>
        track?.skillCasts.some(
          cast => cast.placement.startFrame !== undefined && !cast.presentation?.locked,
        ),
      ) as TrackIndex;
      const cast = base.tracks[trackIndex]!.skillCasts.find(
        cast => cast.placement.startFrame !== undefined && !cast.presentation?.locked,
      )!;
      const start = cast.placement.startFrame!;
      const scenario = shallowRef(base);
      const session = new ScenarioEditorSession(base);
      session.subscribe(snapshot => {
        scenario.value = snapshot.scenario;
      });
      const timeline: Array<Record<string, unknown>> = [];
      let phase = 'initial';
      const frameOf = (value = scenario.value) =>
        value.tracks[trackIndex]!.skillCasts.find(value => value.id === cast.id)!.placement
          .startFrame;
      const origin = performance.now();
      const record = (kind: string, details: Record<string, unknown> = {}) =>
        timeline.push({
          order: timeline.length,
          atMs: performance.now() - origin,
          phase,
          kind,
          ...details,
        });
      recordProtocol = record;
      let sendStarted = 0;
      const requests: SimulationWorkerRequest[] = [];
      const transport = {
        onmessage: null as ((event: MessageEvent<SimulationWorkerResponse>) => void) | null,
        onerror: null,
        onmessageerror: null,
        postMessage(request: SimulationWorkerRequest) {
          record('worker-send', {
            frame: frameOf(request.scenario),
            gameData: request.gameData !== undefined,
          });
          record('main-prepare-request', { durationMs: performance.now() - sendStarted });
          const started = performance.now();
          requests.push(structuredClone(request));
          record('request-clone', { durationMs: performance.now() - started });
        },
        terminate() {},
      };
      workerGlobal.postMessage = response => {
        record('worker-response', { id: response.id, ok: response.ok });
        const started = performance.now();
        const data = structuredClone(response);
        record('response-clone', { durationMs: performance.now() - started });
        transport.onmessage?.({ data } as MessageEvent<SimulationWorkerResponse>);
      };
      const worker = new WorkerScenarioSimulationService(
        transport as unknown as Worker,
        candidate => captureScenarioSimulationGameData(candidate, repository),
      );
      const workerSimulate = worker.simulate.bind(worker);
      worker.simulate = (...args) => {
        sendStarted = performance.now();
        return workerSimulate(...args);
      };
      const local = createEditorSimulationService(repository);
      const originalSimulate = local.simulate.bind(local);
      local.simulate = (...args) => {
        record('local-start', { frame: frameOf(args[0]) });
        return originalSimulate(...args);
      };
      // 固定两个既有策略分支，避免机器快慢改变调度计数；不作为默认 200ms 分界的测量。
      const service = new AdaptiveTimelineSimulationService(
        worker,
        () => local,
        mode === 'settled-local' ? Number.MAX_SAFE_INTEGER : Number.MIN_VALUE,
      );
      service.subscribePerformance(sample => record('simulation-complete', { ...sample }));
      const scope = effectScope();
      const selection = shallowRef(createEmptyTimelineActionSelection());
      const events = new EventTarget();
      class Lane {
        dataset = { trackIndex: String(trackIndex) };
        closest() {
          return this;
        }
        getBoundingClientRect() {
          return { left: 0 };
        }
      }
      vi.stubGlobal('window', events);
      vi.stubGlobal('Element', Lane);
      vi.stubGlobal('document', { elementFromPoint: () => new Lane() });
      vi.stubGlobal('requestAnimationFrame', () => 1);
      vi.stubGlobal('cancelAnimationFrame', () => {});
      const simulation = scope.run(() => useScenarioSimulation({ scenario, service }))!;
      scope.run(() => {
        watch(scenario, value => record('scenario', { frame: frameOf(value) }), { flush: 'sync' });
        watch(
          simulation.published,
          value => {
            if (value)
              record('publication', {
                frame: frameOf(value.scenario),
                current: value.scenario === scenario.value,
              });
          },
          { flush: 'sync' },
        );
        const display = usePublishedSimulationDisplay(
          simulation.published,
          repository,
          () => repository.getWeapons(),
          { skill: value => value.id, operator: value => value.slug ?? '' },
          () => repository.getGears(),
          () => repository.getGearSets(),
        );
        watch(display.battleLogSnapshot, () => record('display-capture'), { flush: 'sync' });
      });
      const resolved = new Map(
        base.tracks.flatMap(
          track =>
            track?.skillCasts.flatMap(cast =>
              cast.placement.startFrame === undefined
                ? []
                : [[cast.id, cast.placement.startFrame] as const],
            ) ?? [],
        ),
      );
      const movement = scope.run(() =>
        useTimelineCastMove({
          scenario,
          actionSelection: selection,
          interactionSession: createInteractionSession(),
          simulationService: service,
          resolvedSkillCastStartFrames: shallowRef(resolved),
          timelineScroll: shallowRef(null),
          pxPerFrame: shallowRef(1),
          snapFrames: shallowRef(1),
          cursorFrame: shallowRef(0),
          minimumInputFrame: shallowRef(-base.battle.prepFrames),
          trackHeaderWidth: 180,
          rulerHeight: 60,
          timelineFramePx: frame => frame + base.battle.prepFrames,
          alignSelectedCastToTarget: () => false,
          applyActionSelection: value => {
            selection.value = value;
          },
          commitScenario: (name, command) => session.commit(name, command),
          ensureCurrentSimulation: simulation.ensureCurrentSimulation,
          warnLocked: () => {},
        }),
      )!;
      const drain = async () => {
        await flush();
        for (let guard = 0; requests.length; guard++) {
          if (guard > 20) throw new Error('unexpected request loop');
          const request = requests.shift()!;
          record('worker-start', { frame: frameOf(request.scenario) });
          await workerGlobal.onmessage({ data: request } as MessageEvent<SimulationWorkerRequest>);
          await flush();
        }
        expect(simulation.running.value).toBe(false);
      };
      try {
        await drain();
        phase = 'drag';
        const x = start + base.battle.prepFrames;
        movement.beginCastMove(
          {
            button: 0,
            pointerId: 1,
            clientX: x,
            clientY: 100,
            currentTarget: { getBoundingClientRect: () => ({ left: x }) },
            preventDefault() {},
            stopPropagation() {},
          } as unknown as PointerEvent,
          trackIndex,
          cast.id,
        );
        for (const delta of [12, 12, 12, 18, 18, 18, 24, 24, 24, 30, 30, 30]) {
          record('pointermove', { delta });
          const pointerStarted = performance.now();
          events.dispatchEvent(
            Object.assign(new Event('pointermove'), {
              pointerId: 1,
              buttons: 1,
              clientX: x + delta,
              clientY: 100,
            }),
          );
          record('pointer-handler-return', { durationMs: performance.now() - pointerStarted });
          if (mode !== 'burst-worker') await drain();
        }
        phase = 'release';
        events.dispatchEvent(
          Object.assign(new Event('pointerup'), { pointerId: 1, clientX: x + 30, clientY: 100 }),
        );
        await drain();
        expect(movement.castMoveGesture.value).toBeNull();
        expect(frameOf()).toBe(start + 30);
        expect(simulation.published.value?.scenario).toBe(scenario.value);
        expect(simulation.stale.value).toBe(false);
        expect(JSON.stringify(base)).toBe(inputHash);
        const final = simulation.run.value!;
        phase = 'independent-check';
        const checkService = createEditorSimulationService(repository);
        const check = await checkService.simulate(
          scenario.value,
          scenario.value.battle.simulationRange?.endFrame ?? scenario.value.battle.durationFrames,
        );
        expect(encode(final)).toEqual(encode(check));
        checkService.clearCache();
        phase = 'undo';
        expect(session.undo()).toBe(true);
        expect(scenario.value).toBe(base);
        expect(session.canUndo).toBe(false);
        await drain();
        if (file === selectedFiles[0] && mode === 'settled-worker') {
          phase = 'identical-idle-request';
          const forced = simulation.simulateNow();
          await drain();
          expect(await forced).toBe(true);
          phase = 'editor-only';
          scenario.value = {
            ...scenario.value,
            editor: { ...scenario.value.editor, prepExpanded: !scenario.value.editor.prepExpanded },
          };
          await drain();
          phase = 'graph-only';
          scenario.value = {
            ...scenario.value,
            tracks: scenario.value.tracks.map(
              track =>
                track && {
                  ...track,
                  skillCasts: track.skillCasts.map(item =>
                    item.id !== cast.id
                      ? item
                      : {
                          ...item,
                          presentation: {
                            ...item.presentation,
                            graph: {
                              main: {
                                nodePositions: { audit: { x: 1, y: 2 } },
                                entryPositions: {},
                              },
                            },
                          },
                        },
                  ),
                },
            ) as typeof base.tracks,
          };
          await drain();
        }
        const kinds = [
          'pointermove',
          'scenario',
          'worker-send',
          'worker-start',
          'local-start',
          'simulation-complete',
          'publication',
          'display-capture',
        ];
        const counts = Object.fromEntries(
          [
            'initial',
            'drag',
            'release',
            'undo',
            'identical-idle-request',
            'editor-only',
            'graph-only',
          ].map(phase => [
            phase,
            Object.fromEntries(
              kinds.map(kind => [
                kind,
                timeline.filter(event => event.phase === phase && event.kind === kind).length,
              ]),
            ),
          ]),
        );
        const dragWork = timeline.filter(
          event =>
            (event.phase === 'drag' || event.phase === 'release') &&
            (event.kind === 'worker-start' || event.kind === 'local-start'),
        );
        expect(dragWork.map(event => event.frame)).toEqual(
          (mode === 'burst-worker' ? [12, 30] : [12, 18, 24, 30]).map(delta => start + delta),
        );
        expect(counts.release!.scenario).toBe(0);
        expect(counts.drag!.publication! + counts.release!.publication!).toBe(
          mode === 'burst-worker' ? 2 : 4,
        );
        reports.push({ fixture: file, mode, castId: cast.id, startFrame: start, counts, timeline });
      } finally {
        scope.stop();
        service.dispose();
      }
    }
  }
  if (process.env.DRAG_AUDIT_OUTPUT)
    writeFileSync(
      process.env.DRAG_AUDIT_OUTPUT,
      JSON.stringify({ browserMeasurement: false, reports }, null, 2),
      { flag: 'wx' },
    );
  console.log(
    JSON.stringify(reports.map(({ fixture, mode, counts }) => ({ fixture, mode, counts }))),
  );
}, 180_000);
