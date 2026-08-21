<script setup lang="ts">
import { computed, nextTick, onScopeDispose, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getEnemyGameName,
  getGearPieceGameName,
  getGearSetGameName,
  getOperatorCombatSkillName,
  getOperatorGameName,
  getWeaponGameName,
} from '../legacy/legacyGameText';
import SkillLibraryCard from './components/SkillLibraryCard.vue';
import GearSelectionDialog from './components/GearSelectionDialog.vue';
import NextGearLoadoutBuildDialog from './components/NextGearLoadoutBuildDialog.vue';
import GearDefinitionWorkspaceDialog from './components/GearDefinitionWorkspaceDialog.vue';
import GearSetDefinitionWorkspaceDialog from './components/GearSetDefinitionWorkspaceDialog.vue';
import NextOperatorPanelDialog from './components/NextOperatorPanelDialog.vue';
import NextOperatorBuildDialog from './components/NextOperatorBuildDialog.vue';
import OperatorDefinitionWorkspaceDialog from './components/OperatorDefinitionWorkspaceDialog.vue';
import NextWeaponBuildDialog from './components/NextWeaponBuildDialog.vue';
import WeaponDefinitionWorkspaceDialog from './components/WeaponDefinitionWorkspaceDialog.vue';
import OperatorSelectionDialog from './components/OperatorSelectionDialog.vue';
import WeaponSelectionDialog from './components/WeaponSelectionDialog.vue';
import TimelineActionBlock from './components/TimelineActionBlock.vue';
import TimelineActionContextMenu from './components/TimelineActionContextMenu.vue';
import TimelineActionInspector from './components/TimelineActionInspector.vue';
import SkillDefinitionEditorDialog from './components/SkillDefinitionEditorDialog.vue';
import TimelineCornerToolbar from './components/TimelineCornerToolbar.vue';
import TimelineConnectionLayer from './components/TimelineConnectionLayer.vue';
import TimelineHeaderToolbar from './components/TimelineHeaderToolbar.vue';
import TimelineRuler from './components/TimelineRuler.vue';
import TimelineTrackHeader from './components/TimelineTrackHeader.vue';
import TimelineWorkbenchShell from './components/TimelineWorkbenchShell.vue';
import TimelineResourceCurves from './components/TimelineResourceCurves.vue';
import TimelineTrackGauge from './components/TimelineTrackGauge.vue';
import TimelineTimeDilationBands from './components/TimelineTimeDilationBands.vue';
import TimelineEnemyEffects from './components/TimelineEnemyEffects.vue';
import SimulationPerformanceAudit from './components/SimulationPerformanceAudit.vue';
import NextEnemySettingsPanel from './components/NextEnemySettingsPanel.vue';
import NextGlobalResourcePanel from './components/NextGlobalResourcePanel.vue';
import {
  ActiveScenarioEditorSession,
  ProjectEditorSession,
} from '../../application/editor/projectEditorSession';
import { ScenarioSimulationService } from '../../application/scenarioSimulationService';
import { useScenarioSimulation } from './useScenarioSimulation';
import { sampleStepCurve } from '../../core/projection/curveSampling';
import { projectEnemyEffectViz } from '../../core/projection/enemyEffectViz';
import type { OperatorUltimateEnergyCurve } from '../../core/projection/resourceCurves';
import {
  PROJECT_FPS,
  type ProjectDefinitionLibraryDocument,
  type ScenarioDocument,
  type TrackIndex,
} from '../../core/project/schema';
import {
  allocateProjectTemplateId,
  deriveProjectGearTemplate,
  deriveProjectGearSetTemplate,
  deriveProjectOperatorTemplate,
  deriveProjectWeaponTemplate,
  getProjectDefinitionLibrary,
  replaceProjectGearTemplateDefinition,
  replaceProjectGearSetTemplateDefinition,
  replaceProjectWeaponTemplateDefinition,
  switchTrackToCompatibleOperatorTemplate,
  switchTrackToCompatibleGearTemplate,
  switchTrackToCompatibleWeaponTemplate,
} from '../../core/project/projectDefinitionLibrary';
import { createEmptyProject } from '../../core/project/createProject';
import { serializeProjectDocument } from '../../core/project/serialization';
import { openProject, type OpenProjectResult } from '../../application/openProject';
import { nextGameDataRepository } from '../../data/gameDataRepository';
import { diffSkillDefinition } from '../../core/game-data/diffSkillDefinition';
import { resolveSkillTemplateDefinition } from '../../core/compiler/resolveSkillDefinition';
import type { OperatorDefinition, SkillDefinition } from '../../core/game-data/operatorDefinition';
import type {
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../../core/game-data/equipmentDefinition';
import { placeSkillGroup } from './placeSkillGroup';
import { createProjectDocumentIdAllocator } from './projectDocumentIdAllocator';
import {
  projectTimelineEditor,
  type TimelineSkillLibraryEntryViewModel,
} from './timelineEditorViewModel';
import {
  frameToTimelinePx,
  resolveTimelineCursorGuidePosition,
  timelineTotalWidth,
} from './timelineGeometry';
import {
  projectCastTimeDilationSegments,
  projectSkillCastActualDurationFrames,
  projectSkillCastActualStartFrames,
  projectTimelineTimeDilationBands,
} from './timelineDisplayTime';
import { useTimelineLoadoutEditor } from './useTimelineLoadoutEditor';
import { useTimelineEnemyEditor } from './useTimelineEnemyEditor';
import {
  createEmptyTimelineActionSelection,
  deleteSelectedTimelineActions,
  reconcileTimelineActionSelection,
  selectTimelineAction,
  type TimelineActionSelection,
} from './timelineActionSelection';
import {
  copyTimelineActions,
  pasteTimelineActions,
  type TimelineActionClipboard,
} from './timelineClipboard';
import {
  moveSkillCasts,
  swapTimelineTracks,
  setSkillCastLocked,
  setSkillCastDisabled,
  setSkillCastColor,
  setSkillCastCameraTargetAngle,
  setSkillCastCustomDefinition,
  resetSkillCastToTemplate,
  updateBattleResourceRule,
  type EditableBattleResourceRule,
  updateTrackInitialUltimateEnergy,
  type TrackGearSlot,
} from './timelineDocumentCommands';
import { isTextEditingTarget, useKeyboardShortcutScope } from '../keyboard/keyboardShortcutRouter';
import { basicAttackSegmentLabel } from './timelineSkillLabels';
import { useTimelineMarqueeGesture } from './useTimelineMarqueeGesture';
import { useTimelineViewportPan } from './useTimelineViewportPan';
import { handleTimelineEditorShortcut } from './timelineKeyboardShortcuts';
import {
  COARSE_TIMELINE_SNAP_FRAMES,
  PRECISE_TIMELINE_SNAP_FRAMES,
  snapTimelineFrame,
} from './timelineSnap';
import { findAdjacentOccupiedTrack } from './timelineTrackSelection';
import { resolveTimelineCastMoveFrame } from './timelineCastMoveGeometry';
import { normalizeTimelineZoomPercent, timelinePxPerFrame } from './timelineZoom';
import {
  createSkillCastConnection,
  createDamageHitConnection,
  removeTimelineConnection,
  type TimelineConnectionPort,
} from './timelineConnections';
import {
  shouldDisplayTimelineHitMarker,
  type TimelineHitMarkerView,
} from './timelineHitProjection';
import {
  projectHitEffectsByCast,
  projectTimelineHitActualFrames,
  projectTimelineHitDetailEntries,
  type TimelineHitEffectLabel,
} from './timelineHitEffects';
import TimelineHitDetailDialog from './components/TimelineHitDetailDialog.vue';
import {
  ABILITY_ENTITY_SAMPLE_CAST_ID,
  ABILITY_ENTITY_SAMPLE_TRACK_INDEX,
  createTimelineSampleScenario,
} from './timelineSampleScenario';

const { t, locale } = useI18n({ useScope: 'global' });
const TIMELINE_TRACK_HEADER_WIDTH = 180;
const TIMELINE_RULER_HEIGHT = 76;
/** 拖动投影以约 30Hz 更新；技能块本身仍逐 pointermove 跟手。 */
const LIVE_SIMULATION_RATE_HZ = 30;
const LIVE_SIMULATION_INTERVAL_MS = 1000 / LIVE_SIMULATION_RATE_HZ;
const timelineZoomPercent = ref(100);
const pxPerFrame = computed(() => timelinePxPerFrame(timelineZoomPercent.value));
const showCursorGuide = ref(true);
const connectionToolEnabled = ref(false);
const selectedTrack = ref<TrackIndex>(ABILITY_ENTITY_SAMPLE_TRACK_INDEX);
const selectedCastId = ref<string | null>(ABILITY_ENTITY_SAMPLE_CAST_ID);
const showSkillDefinitionEditor = ref(false);
const showOperatorDefinitionWorkspace = ref(false);
const showWeaponDefinitionWorkspace = ref(false);
const gearDefinitionWorkspaceSlot = ref<TrackGearSlot | null>(null);
const gearSetDefinitionWorkspaceId = ref<string | null>(null);
const projectDefinitionLibrary = shallowRef<ProjectDefinitionLibraryDocument>({
  operators: {},
  weapons: {},
  gears: {},
  gearSets: {},
});
const operatorDefinitionRevision = ref(0);
const actionSelection = shallowRef<TimelineActionSelection>(createEmptyTimelineActionSelection());
const hoveredCastId = ref<string | null>(null);
const timelineClipboard = shallowRef<TimelineActionClipboard | null>(null);
const projectFileInput = ref<HTMLInputElement | null>(null);
const cursorFrame = ref(30);
const cursorGuide = ref<{ leftPx: number; sampleFrame: number } | null>(null);
const snapFrames = ref<number>(PRECISE_TIMELINE_SNAP_FRAMES);
const timelineSurface = ref<HTMLElement | null>(null);
const timelineScroll = ref<HTMLElement | null>(null);
const timelineScrollLeft = ref(0);
const connectionDrag = ref<{
  skillCastId: string;
  port: TimelineConnectionPort;
  pointer: { x: number; y: number };
} | null>(null);
type TimelineDragPayload =
  | { kind: 'librarySkill'; skillGroupKey: string; skillKey?: string }
  | { kind: 'trackOrder'; trackIndex: TrackIndex };

const dragPayload = ref<TimelineDragPayload | null>(null);
interface TimelineCastMoveGesture {
  readonly pointerId: number;
  readonly trackIndex: TrackIndex;
  readonly skillCastId: string;
  readonly skillCastIds: readonly string[];
  readonly pointerOffsetActualFrames: number;
  /** 按下时已发布的实际开始帧，只用于平移该技能自己的时间膨胀预览。 */
  readonly anchorActualFrame: number;
  readonly baseScenario: ScenarioDocument;
  previewFrame: number;
  previewActualFrame: number;
  /** 松手后保留预览，直到对应场景的新模拟快照发布。 */
  readonly committed: boolean;
  moved: boolean;
}
const castMoveGesture = shallowRef<TimelineCastMoveGesture | null>(null);
let stopCastMoveGesture: (() => void) | null = null;
let lastCastMoveSimulationAt = 0;
let suppressedCastClickId: string | null = null;
const contextMenuTarget = ref<{
  x: number;
  y: number;
  trackIndex: TrackIndex;
  skillCastId: string;
} | null>(null);

const initialScenario = createTimelineSampleScenario();
const initialProject = createEmptyProject({
  projectId: 'next-sample',
  createdWith: 'endaxis-next',
  gameDataRevision: nextGameDataRepository.revision,
});
initialProject.activeScenarioId = initialScenario.id;
initialProject.scenarios = [initialScenario];
const projectSession = new ProjectEditorSession(initialProject);
const scenarioSession = new ActiveScenarioEditorSession(projectSession);
const ids = createProjectDocumentIdAllocator(() => projectSession.snapshot.project);
const savedProjectSnapshot = shallowRef(initialProject);
const projectDirty = ref(false);
const scenario = shallowRef(scenarioSession.snapshot.scenario);
const canUndo = ref(scenarioSession.canUndo);
const canRedo = ref(scenarioSession.canRedo);
const unsubscribeScenarioSession = scenarioSession.subscribe(snapshot => {
  scenario.value = snapshot.scenario;
  canUndo.value = scenarioSession.canUndo;
  canRedo.value = scenarioSession.canRedo;
  applyActionSelection(reconcileTimelineActionSelection(actionSelection.value, snapshot.scenario));
});
const unsubscribeProjectSession = projectSession.subscribe(snapshot => {
  projectDirty.value = snapshot.project !== savedProjectSnapshot.value;
  const library = getProjectDefinitionLibrary(snapshot.project);
  if (library === projectDefinitionLibrary.value) return;
  projectDefinitionLibrary.value = library;
  operatorDefinitionRevision.value += 1;
});
onScopeDispose(() => {
  unsubscribeScenarioSession();
  unsubscribeProjectSession();
  scenarioSession.dispose();
  cancelConnectionDrag();
  cancelCastMove();
  window.removeEventListener('beforeunload', protectUnsavedProject);
});

function protectUnsavedProject(event: BeforeUnloadEvent): void {
  if (!projectDirty.value) return;
  event.preventDefault();
  event.returnValue = '';
}
window.addEventListener('beforeunload', protectUnsavedProject);

function commitScenario(
  commandName: string,
  command: (current: ScenarioDocument) => ScenarioDocument,
): boolean {
  return scenarioSession.commit(commandName, command);
}

function projectOpenFailureMessage(result: Exclude<OpenProjectResult, { ok: true }>): string {
  if (result.kind === 'parse-failed') {
    if (result.cause.kind === 'invalid-document') {
      const first = result.cause.issues[0];
      return first === undefined
        ? '项目文档校验失败'
        : `项目文档校验失败：${first.path} ${first.message}`;
    }
    if (result.cause.kind === 'unsupported-version') {
      return `不支持项目版本 ${result.cause.schemaVersion}`;
    }
    if (result.cause.kind === 'migration-failed') {
      return `旧项目迁移失败：${result.cause.errors[0] ?? '未知错误'}`;
    }
    return result.cause.message;
  }
  if (result.kind === 'definition-validation-failed') {
    const first = result.issues[0];
    return first === undefined
      ? '项目定义引用校验失败'
      : `项目定义引用校验失败：${first.path} ${first.message}`;
  }
  if (result.kind === 'game-data-revision-mismatch') {
    return `游戏数据版本不匹配：项目 ${result.projectRevision}，当前 ${result.repositoryRevision}`;
  }
  if (result.kind === 'game-data-migration-available') {
    return '项目需要先执行明确的游戏数据迁移，当前编辑器不会自动改写';
  }
  return '项目迁移器声明与项目版本不一致';
}

async function requestOpenProject(): Promise<void> {
  if (projectDirty.value) {
    try {
      await ElMessageBox.confirm('当前项目有尚未导出的修改。继续加载会替换整个项目。', '加载项目', {
        confirmButtonText: '继续加载',
        cancelButtonText: '取消',
        type: 'warning',
      });
    } catch {
      return;
    }
  }
  projectFileInput.value?.click();
}

async function handleProjectFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (file === undefined) return;
  try {
    const result = openProject(await file.text(), { gameDataRepository: nextGameDataRepository });
    if (!result.ok) {
      ElMessage.error(projectOpenFailureMessage(result));
      return;
    }
    showSkillDefinitionEditor.value = false;
    showOperatorDefinitionWorkspace.value = false;
    showWeaponDefinitionWorkspace.value = false;
    gearDefinitionWorkspaceSlot.value = null;
    gearSetDefinitionWorkspaceId.value = null;
    projectSession.replaceProject(result.project);
    savedProjectSnapshot.value = result.project;
    projectDirty.value = false;
    selectedTrack.value = 0;
    selectedCastId.value = null;
    actionSelection.value = createEmptyTimelineActionSelection();
    timelineClipboard.value = null;
    simulationService.clearCache();
    await nextTick();
    void simulateNow();
    ElMessage.success(`已打开项目：${scenarioSession.snapshot.scenario.name}`);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '打开项目失败');
  }
}

function exportProject(): void {
  try {
    const project = projectSession.snapshot.project;
    const content = serializeProjectDocument(project, true);
    const blobUrl = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    const activeScenario = project.scenarios.find(value => value.id === project.activeScenarioId);
    const fileBase = (activeScenario?.name ?? project.activeScenarioId)
      .replace(/[^A-Za-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    anchor.download = `${fileBase || 'endaxis-project'}.json`;
    anchor.click();
    URL.revokeObjectURL(blobUrl);
    savedProjectSnapshot.value = project;
    projectDirty.value = false;
    ElMessage.success('项目 JSON 已导出');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '导出项目失败');
  }
}

/** 项目模板库与版本化数据的联合查询端口；实例只保存模板 ID 和养成/配装状态。 */
const editorGameDataRepository = {
  ...nextGameDataRepository,
  getOperator: (slug: string) =>
    projectDefinitionLibrary.value.operators[slug]?.definition ??
    nextGameDataRepository.getOperator(slug),
  getOperators: () => [
    ...nextGameDataRepository.getOperators(),
    ...Object.values(projectDefinitionLibrary.value.operators).map(value => value.definition),
  ],
  getWeapon: (slug: string) =>
    projectDefinitionLibrary.value.weapons[slug]?.definition ??
    nextGameDataRepository.getWeapon(slug),
  getWeapons: () => [
    ...nextGameDataRepository.getWeapons(),
    ...Object.values(projectDefinitionLibrary.value.weapons).map(value => value.definition),
  ],
  getGear: (slug: string) =>
    projectDefinitionLibrary.value.gears[slug]?.definition ?? nextGameDataRepository.getGear(slug),
  getGears: () => [
    ...nextGameDataRepository.getGears(),
    ...Object.values(projectDefinitionLibrary.value.gears).map(value => value.definition),
  ],
  getGearSet: (slug: string) =>
    projectDefinitionLibrary.value.gearSets[slug]?.definition ??
    nextGameDataRepository.getGearSet(slug),
  getGearSets: () => [
    ...nextGameDataRepository.getGearSets(),
    ...Object.values(projectDefinitionLibrary.value.gearSets).map(value => value.definition),
  ],
};

const {
  operatorDialogTrack,
  weaponDialogTrack,
  gearDialogTarget,
  showOperatorBuildDialog,
  showWeaponBuildDialog,
  showGearBuildDialog,
  panelDialogTrack,
  loadoutModels,
  selectedLoadoutModel,
  selectedWeaponSlug,
  selectableWeapons,
  selectedGearSlug,
  selectableGears,
  selectedGearBuild,
  panelResolution,
  selectedPanel,
  openOperatorDialog,
  selectTrack,
  selectOperator,
  clearOperator,
  openWeaponDialog,
  openPanelDialog,
  selectWeapon,
  clearWeapon,
  openGearDialog,
  selectGear,
  clearGear,
  changeGearRefineTier,
  updateWeaponBuild,
  updateOperatorBuild,
  updateGearBuild,
} = useTimelineLoadoutEditor({
  scenario,
  session: scenarioSession,
  selectedTrack,
  clearTimelineSelection,
  gameData: editorGameDataRepository,
  definitionRevision: operatorDefinitionRevision,
  ids,
});
const {
  enemies,
  selectedDefinition: selectedEnemyDefinition,
  selectDefinitionEnemy,
  selectCustomEnemy,
  saveEnemyValues,
} = useTimelineEnemyEditor({
  scenario,
  session: scenarioSession,
  gameData: editorGameDataRepository,
  fps: PROJECT_FPS,
});
const viewModel = computed(() => {
  void operatorDefinitionRevision.value;
  return projectTimelineEditor(scenario.value, editorGameDataRepository);
});
const selectedTrackModel = computed(() => viewModel.value.tracks[selectedTrack.value]!);
const simulationService = new ScenarioSimulationService({
  index: editorGameDataRepository,
  repositoryRevision: nextGameDataRepository.revision,
  resources: {
    sharedSpGain: { baseGainEfficiency: 1 },
    spRecoveryPauseDuration: 1.5,
    ultimateEnergySystemUnlocked: true,
    // SkillSetting 构造函数默认值：atbConsumedDefaultUspGainSelf/Other = 0.065。
    normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
  },
});
const {
  run: simulationRun,
  running: simulationRunning,
  stale: simulationStale,
  error: simulationError,
  performanceSamples: simulationPerformanceSamples,
  diagnosticsByCastId,
  simulateNow,
} = useScenarioSimulation({
  scenario,
  service: simulationService,
});
const selectedOperatorBaseDefinition = computed(() => {
  const slug = selectedLoadoutModel.value.operator?.operatorSlug;
  if (slug === undefined) return null;
  const template = projectDefinitionLibrary.value.operators[slug];
  return nextGameDataRepository.getOperator(template?.origin?.templateId ?? slug);
});
const selectedOperatorCustomDefinition = computed(() => {
  const slug = selectedLoadoutModel.value.operator?.operatorSlug;
  return slug === undefined
    ? undefined
    : projectDefinitionLibrary.value.operators[slug]?.definition;
});
const selectedOperatorDefinitionSkillLevel = computed(() =>
  Math.max(1, ...Object.values(selectedLoadoutModel.value.operator?.skillLevels ?? {})),
);
const selectedWeaponBaseDefinition = computed(() => {
  const slug = selectedLoadoutModel.value.weapon?.weaponSlug;
  if (slug === undefined) return null;
  const template = projectDefinitionLibrary.value.weapons[slug];
  return nextGameDataRepository.getWeapon(template?.origin?.templateId ?? slug);
});
const selectedWeaponCustomDefinition = computed(() => {
  const slug = selectedLoadoutModel.value.weapon?.weaponSlug;
  return slug === undefined ? undefined : projectDefinitionLibrary.value.weapons[slug]?.definition;
});
const selectedGearDefinition = computed(() => {
  const slot = gearDefinitionWorkspaceSlot.value;
  return slot === null ? null : (selectedLoadoutModel.value.gears[slot]?.definition ?? null);
});
const selectedGearBaseDefinition = computed(() => {
  const current = selectedGearDefinition.value;
  if (current === null) return null;
  const template = projectDefinitionLibrary.value.gears[current.slug];
  return nextGameDataRepository.getGear(template?.origin?.templateId ?? current.slug);
});
const selectedGearCustomDefinition = computed(() => {
  const slug = selectedGearDefinition.value?.slug;
  return slug === undefined ? undefined : projectDefinitionLibrary.value.gears[slug]?.definition;
});
const customGearDefinitionSlugs = computed(() => Object.keys(projectDefinitionLibrary.value.gears));
const gearSetIds = computed(() => editorGameDataRepository.getGearSets().map(value => value.slug));
const gearSetNames = computed<Readonly<Record<string, string>>>(() =>
  Object.fromEntries(
    editorGameDataRepository
      .getGearSets()
      .map(definition => [
        definition.slug,
        definition.displayName ?? getGearSetGameName(definition.slug, locale.value),
      ]),
  ),
);
const gearSetTextSlugs = computed<Readonly<Record<string, string>>>(() =>
  Object.fromEntries(
    Object.values(projectDefinitionLibrary.value.gearSets).map(template => [
      template.id,
      template.origin?.templateId ?? template.id,
    ]),
  ),
);
const selectedGearSetCustomDefinition = computed(() => {
  const id = gearSetDefinitionWorkspaceId.value;
  return id === null ? undefined : projectDefinitionLibrary.value.gearSets[id]?.definition;
});
const selectedGearSetBaseDefinition = computed(() => {
  const id = gearSetDefinitionWorkspaceId.value;
  if (id === null) return null;
  const template = projectDefinitionLibrary.value.gearSets[id];
  return nextGameDataRepository.getGearSet(template?.origin?.templateId ?? id);
});

function openOperatorDefinitionWorkspace(): void {
  const track = scenario.value.tracks[selectedTrack.value];
  const current = selectedLoadoutModel.value.operator?.definition ?? null;
  if (track?.operator === null || track === null || current === null) return;
  // 定义工作区取代构筑弹窗，不在其上再叠一个同尺寸模态框。
  showOperatorBuildDialog.value = false;
  if (projectDefinitionLibrary.value.operators[current.slug] !== undefined) {
    showOperatorDefinitionWorkspace.value = true;
    return;
  }

  const templateId = allocateProjectTemplateId(projectDefinitionLibrary.value, 'operator');
  const displayName = `${getOperatorGameName(current.slug, locale.value)}（自定义）`;
  const changed = projectSession.commit('deriveProjectOperatorTemplate', project => {
    const nextProject = deriveProjectOperatorTemplate(project, {
      id: templateId,
      name: displayName,
      baseTemplateId: current.slug,
      definition: current,
    });
    const nextDefinition =
      getProjectDefinitionLibrary(nextProject).operators[templateId]!.definition;
    return {
      ...nextProject,
      scenarios: nextProject.scenarios.map(value =>
        value.id === nextProject.activeScenarioId
          ? switchTrackToCompatibleOperatorTemplate(
              value,
              selectedTrack.value,
              current,
              templateId,
              nextDefinition,
            )
          : value,
      ),
    };
  });
  if (!changed) return;
  simulationService.clearCache();
  showOperatorDefinitionWorkspace.value = true;
}

function saveOperatorDefinition(definition: OperatorDefinition): void {
  const template = projectDefinitionLibrary.value.operators[definition.slug];
  if (template === undefined)
    throw new Error(`missing project operator template '${definition.slug}'`);
  projectSession.commit('saveProjectOperatorTemplate', project => ({
    ...project,
    definitionLibrary: {
      ...getProjectDefinitionLibrary(project),
      operators: {
        ...getProjectDefinitionLibrary(project).operators,
        [definition.slug]: {
          ...template,
          name: definition.displayName ?? template.name,
          definition: structuredClone({ ...definition, slug: template.id }),
        },
      },
    },
  }));
  simulationService.clearCache();
  void simulateNow();
}

function resetOperatorDefinition(): void {
  const slug = selectedLoadoutModel.value.operator?.operatorSlug;
  if (slug === undefined) return;
  const template = projectDefinitionLibrary.value.operators[slug];
  const base = selectedOperatorBaseDefinition.value;
  if (template === undefined || base === null) return;
  projectSession.commit('resetProjectOperatorTemplate', project => ({
    ...project,
    definitionLibrary: {
      ...getProjectDefinitionLibrary(project),
      operators: {
        ...getProjectDefinitionLibrary(project).operators,
        [slug]: {
          ...template,
          definition: structuredClone({
            ...base,
            slug,
            displayName: template.name,
            assetSlug: base.assetSlug ?? base.slug,
          }),
        },
      },
    },
  }));
  showOperatorDefinitionWorkspace.value = false;
  simulationService.clearCache();
  void simulateNow();
}

function openWeaponDefinitionWorkspace(): void {
  const track = scenario.value.tracks[selectedTrack.value];
  const current = selectedLoadoutModel.value.weapon?.definition ?? null;
  if (track?.weapon === null || track === null || current === null) return;
  showWeaponBuildDialog.value = false;
  if (projectDefinitionLibrary.value.weapons[current.slug] !== undefined) {
    showWeaponDefinitionWorkspace.value = true;
    return;
  }

  const templateId = allocateProjectTemplateId(projectDefinitionLibrary.value, 'weapon');
  const displayName = `${getWeaponGameName(current.slug, locale.value)}（自定义）`;
  const changed = projectSession.commit('deriveProjectWeaponTemplate', project => {
    const nextProject = deriveProjectWeaponTemplate(project, {
      id: templateId,
      name: displayName,
      baseTemplateId: current.slug,
      definition: current,
    });
    const nextDefinition = getProjectDefinitionLibrary(nextProject).weapons[templateId]!.definition;
    return {
      ...nextProject,
      scenarios: nextProject.scenarios.map(value =>
        value.id === nextProject.activeScenarioId
          ? switchTrackToCompatibleWeaponTemplate(
              value,
              selectedTrack.value,
              templateId,
              nextDefinition,
            )
          : value,
      ),
    };
  });
  if (!changed) return;
  simulationService.clearCache();
  showWeaponDefinitionWorkspace.value = true;
}

function saveWeaponDefinition(definition: WeaponDefinition): void {
  projectSession.commit('saveProjectWeaponTemplate', project =>
    replaceProjectWeaponTemplateDefinition(project, definition.slug, definition),
  );
  simulationService.clearCache();
  void simulateNow();
}

function resetWeaponDefinition(): void {
  const slug = selectedLoadoutModel.value.weapon?.weaponSlug;
  const base = selectedWeaponBaseDefinition.value;
  const template = slug === undefined ? undefined : projectDefinitionLibrary.value.weapons[slug];
  if (slug === undefined || template === undefined || base === null) return;
  const definition = structuredClone({
    ...base,
    slug,
    displayName: template.name,
    assetSlug: base.assetSlug ?? base.slug,
  });
  projectSession.commit('resetProjectWeaponTemplate', project =>
    replaceProjectWeaponTemplateDefinition(project, slug, definition),
  );
  showWeaponDefinitionWorkspace.value = false;
  simulationService.clearCache();
  void simulateNow();
}

function openGearDefinitionWorkspace(slot: TrackGearSlot): void {
  const track = scenario.value.tracks[selectedTrack.value];
  const current = selectedLoadoutModel.value.gears[slot]?.definition ?? null;
  if (track === null || track?.gears[slot] === null || current === null) return;
  showGearBuildDialog.value = false;
  gearDefinitionWorkspaceSlot.value = slot;
  if (projectDefinitionLibrary.value.gears[current.slug] !== undefined) return;

  const templateId = allocateProjectTemplateId(projectDefinitionLibrary.value, 'gear');
  const displayName = `${getGearPieceGameName(current.slug, locale.value)}（自定义）`;
  const changed = projectSession.commit('deriveProjectGearTemplate', project => {
    const nextProject = deriveProjectGearTemplate(project, {
      id: templateId,
      name: displayName,
      baseTemplateId: current.slug,
      definition: current,
    });
    const nextDefinition = getProjectDefinitionLibrary(nextProject).gears[templateId]!.definition;
    return {
      ...nextProject,
      scenarios: nextProject.scenarios.map(value =>
        value.id === nextProject.activeScenarioId
          ? switchTrackToCompatibleGearTemplate(
              value,
              selectedTrack.value,
              slot,
              templateId,
              nextDefinition,
            )
          : value,
      ),
    };
  });
  if (!changed) return;
  simulationService.clearCache();
}

function saveGearDefinition(definition: GearDefinition): void {
  projectSession.commit('saveProjectGearTemplate', project =>
    replaceProjectGearTemplateDefinition(project, definition.slug, definition),
  );
  simulationService.clearCache();
  void simulateNow();
}

function resetGearDefinition(): void {
  const slug = selectedGearDefinition.value?.slug;
  const base = selectedGearBaseDefinition.value;
  const template = slug === undefined ? undefined : projectDefinitionLibrary.value.gears[slug];
  if (slug === undefined || template === undefined || base === null) return;
  const definition = structuredClone({
    ...base,
    slug,
    displayName: template.name,
    assetSlug: base.assetSlug ?? base.slug,
  });
  projectSession.commit('resetProjectGearTemplate', project =>
    replaceProjectGearTemplateDefinition(project, slug, definition),
  );
  gearDefinitionWorkspaceSlot.value = null;
  simulationService.clearCache();
  void simulateNow();
}

function openGearSetDefinitionWorkspace(gearDefinition: GearDefinition): void {
  const sourceSetId = gearDefinition.gearSetSlug;
  const gearTemplate = projectDefinitionLibrary.value.gears[gearDefinition.slug];
  if (sourceSetId === undefined || gearTemplate === undefined) return;

  const existingSet = projectDefinitionLibrary.value.gearSets[sourceSetId];
  if (existingSet !== undefined) {
    projectSession.commit('saveProjectGearBeforeEditingSet', project =>
      replaceProjectGearTemplateDefinition(project, gearDefinition.slug, gearDefinition),
    );
    gearDefinitionWorkspaceSlot.value = null;
    gearSetDefinitionWorkspaceId.value = sourceSetId;
    simulationService.clearCache();
    void simulateNow();
    return;
  }

  const baseSet = nextGameDataRepository.getGearSet(sourceSetId);
  if (baseSet === null) {
    ElMessage.error(`找不到套装定义：${sourceSetId}`);
    return;
  }
  const templateId = allocateProjectTemplateId(projectDefinitionLibrary.value, 'gearSet');
  const displayName = `${getGearSetGameName(sourceSetId, locale.value)}（自定义）`;
  const changed = projectSession.commit('deriveProjectGearSetTemplate', project => {
    let nextProject = replaceProjectGearTemplateDefinition(
      project,
      gearDefinition.slug,
      gearDefinition,
    );
    nextProject = deriveProjectGearSetTemplate(nextProject, {
      id: templateId,
      name: displayName,
      baseTemplateId: sourceSetId,
      definition: baseSet,
    });
    return replaceProjectGearTemplateDefinition(nextProject, gearDefinition.slug, {
      ...gearDefinition,
      gearSetSlug: templateId,
    });
  });
  if (!changed) return;
  gearDefinitionWorkspaceSlot.value = null;
  gearSetDefinitionWorkspaceId.value = templateId;
  simulationService.clearCache();
  void simulateNow();
}

function saveGearSetDefinition(definition: GearSetDefinition): void {
  projectSession.commit('saveProjectGearSetTemplate', project =>
    replaceProjectGearSetTemplateDefinition(project, definition.slug, definition),
  );
  simulationService.clearCache();
  void simulateNow();
}

function resetGearSetDefinition(): void {
  const id = gearSetDefinitionWorkspaceId.value;
  const base = selectedGearSetBaseDefinition.value;
  const template = id === null ? undefined : projectDefinitionLibrary.value.gearSets[id];
  if (id === null || base === null || template === undefined) return;
  projectSession.commit('resetProjectGearSetTemplate', project =>
    replaceProjectGearSetTemplateDefinition(project, id, {
      ...structuredClone(base),
      slug: id,
      displayName: template.name,
    }),
  );
  gearSetDefinitionWorkspaceId.value = null;
  simulationService.clearCache();
  void simulateNow();
}
const panelDialogOperator = computed(() => {
  const trackIndex = panelDialogTrack.value;
  return trackIndex === null
    ? null
    : (loadoutModels.value[trackIndex]?.operator?.definition ?? null);
});
const panelDialogOperatorName = computed(() =>
  operatorName(panelDialogOperator.value?.slug ?? null),
);
const selectedCastModel = computed(() => {
  if (selectedCastId.value === null) return null;
  for (const trackModel of viewModel.value.tracks) {
    const castModel = trackModel.skillCasts.find(cast => cast.id === selectedCastId.value);
    const cast = scenario.value.tracks[trackModel.trackIndex]?.skillCasts.find(
      candidate => candidate.id === selectedCastId.value,
    );
    if (castModel !== undefined && cast !== undefined) {
      const operator = editorGameDataRepository.getOperator(trackModel.operatorSlug ?? '');
      let template: SkillDefinition | null = null;
      if (operator !== null) {
        try {
          template = resolveSkillTemplateDefinition(cast, operator).definition;
        } catch {
          // 模板内部 key 可自由编辑；失配由技能块原地诊断，不删除时间轴内容。
        }
      }
      const diffCount =
        cast.customDefinition === undefined || template === null
          ? 0
          : diffSkillDefinition(template, cast.customDefinition).length;
      const source = cast.source;
      const skillLevel =
        source.kind === 'operatorSkill'
          ? (trackModel.skillLibrary.find(entry => entry.skillGroupKey === source.skillGroupKey)
              ?.level ?? 1)
          : 1;
      return {
        trackIndex: trackModel.trackIndex,
        cast,
        skillType: castModel.skillType,
        label: timelineCastLabel(castModel, trackModel),
        edited: cast.customDefinition !== undefined,
        diffCount,
        templateDefinition: template,
        currentDefinition: cast.customDefinition ?? template,
        skillLevel,
      };
    }
  }
  return null;
});
const commonAbilityEntityDefinitions =
  nextGameDataRepository.getCommonAbilityEntityDefinitions?.() ?? {};
const selectedCastAbilityEntityIds = computed(() => {
  const selected = selectedCastModel.value;
  if (selected === null) return Object.keys(commonAbilityEntityDefinitions).sort();
  const track = scenario.value.tracks[selected.trackIndex];
  const operator =
    track?.operator === null || track?.operator === undefined
      ? null
      : editorGameDataRepository.getOperator(track.operator.operatorSlug);
  return Object.keys({
    ...commonAbilityEntityDefinitions,
    ...(operator?.abilityEntityDefinitions ?? {}),
  }).sort();
});
const skillCastActualStartFrames = computed(() =>
  simulationRun.value === null
    ? new Map<string, number>()
    : projectSkillCastActualStartFrames(simulationRun.value.receiptEntries),
);
const skillCastActualDurationFrames = computed(() =>
  simulationRun.value === null
    ? new Map<string, number>()
    : projectSkillCastActualDurationFrames(simulationRun.value.receiptEntries),
);
const timeDilationBands = computed(() => {
  if (simulationRun.value === null) return [];
  const bands = projectTimelineTimeDilationBands(
    simulationRun.value.receiptEntries,
    simulationRun.value.frame,
  );
  const gesture = castMoveGesture.value;
  if (gesture === null) return bands;
  const publishedActualFrame =
    skillCastActualStartFrames.value.get(gesture.skillCastId) ?? gesture.anchorActualFrame;
  const deltaFrames = gesture.previewActualFrame - publishedActualFrame;
  if (deltaFrames === 0) return bands;
  return bands.map(band =>
    band.sourceCastId === gesture.skillCastId
      ? Object.freeze({
          ...band,
          startFrame: band.startFrame + deltaFrames,
          endFrame: band.endFrame + deltaFrames,
        })
      : band,
  );
});
const highlightedTimeDilationSourceIds = computed<ReadonlySet<string>>(() => {
  const ids = new Set(actionSelection.value.selectedIds);
  if (hoveredCastId.value !== null) ids.add(hoveredCastId.value);
  return ids;
});
const timelineWidth = computed(() =>
  timelineTotalWidth(
    scenario.value.battle.prepFrames,
    scenario.value.battle.durationFrames,
    pxPerFrame.value,
  ),
);

function castTimeDilationSegments(
  castId: string,
  placementFrame: number,
  durationFrames: number,
): readonly { readonly left: number; readonly width: number }[] {
  const castStartFrame = castActualStartFrame(castId, placementFrame);
  return projectCastTimeDilationSegments(
    timeDilationBands.value,
    castId,
    castStartFrame,
    durationFrames,
  ).map(segment => ({
    left: segment.offsetFrames * pxPerFrame.value,
    width: segment.durationFrames * pxPerFrame.value,
  }));
}

function setCastHovered(castId: string, hovered: boolean): void {
  if (hovered) hoveredCastId.value = castId;
  else if (hoveredCastId.value === castId) hoveredCastId.value = null;
}

function castActualStartFrame(castId: string, placementFrame: number): number {
  const gesture = castMoveGesture.value;
  if (gesture?.skillCastId === castId) {
    return gesture.previewActualFrame;
  }
  return skillCastActualStartFrames.value.get(castId) ?? placementFrame;
}

function castActualDurationFrame(castId: string, definitionDurationFrames: number): number {
  return skillCastActualDurationFrames.value.get(castId) ?? definitionDurationFrames;
}

function castActualDurationPending(castId: string, definitionDurationFrames: number): boolean {
  return (
    definitionDurationFrames > 0 &&
    skillCastActualStartFrames.value.has(castId) &&
    !skillCastActualDurationFrames.value.has(castId)
  );
}

function timelinePointerActualFrame(pointerPx: number): number {
  return Math.round(Math.max(0, pointerPx / pxPerFrame.value - scenario.value.battle.prepFrames));
}
function formatGuideNumber(value: number | null): string {
  if (value === null) return '--';
  return String(Math.round(value * 100) / 100);
}

function castWarningTitle(castId: string): string {
  const reasons = diagnosticsByCastId.value.get(castId);
  return reasons === undefined || reasons.length === 0 ? '' : reasons.join(', ');
}

const castHitEffects = computed(() => {
  const current = simulationRun.value;
  if (current === null) {
    return new Map<string, ReadonlyMap<string, TimelineHitEffectLabel>>();
  }
  const byCastId = new Map<string, ReadonlyMap<string, TimelineHitEffectLabel>>();
  for (const track of scenario.value.tracks) {
    if (track === null) continue;
    for (const cast of track.skillCasts) {
      const castModel = viewModel.value.tracks
        .flatMap(trackModel => trackModel.skillCasts)
        .find(candidate => candidate.id === cast.id);
      byCastId.set(
        cast.id,
        projectHitEffectsByCast(
          scenario.value,
          current.receiptEntries,
          cast.id,
          castModel?.hitMarkers ?? [],
        ),
      );
    }
  }
  return byCastId;
});
const hitActualFrames = computed(() =>
  simulationRun.value === null
    ? new Map<string, number>()
    : projectTimelineHitActualFrames(simulationRun.value.receiptEntries),
);

/** 敌人效果面板数据：附着段与爆发/反应标记，全部来自同一份回执。 */
const enemyEffectViz = computed(() => {
  const current = simulationRun.value;
  if (current === null) {
    return { segments: [], markers: [] };
  }
  // 拖动草稿会立即把模拟标脏，但上一份成功回执仍是比空白更稳定的视觉占位；
  // 新模拟完成后 simulationRun 会整体替换，效果条随之原子更新，避免来回闪烁。
  return projectEnemyEffectViz(current.receiptEntries, current.frame);
});

function damageElementLabel(element: string): string {
  const key = `hitEditor.elements.${element}`;
  const translated = t(key);
  return translated === key ? element : translated;
}

/** 各干员元素的轨道充能曲线颜色（与旧版 gauge 的干员元素色一致）。 */
const GAUGE_ELEMENT_COLORS: Readonly<Record<string, string>> = {
  electric: '#ffec3d',
  heat: '#ff5a5f',
  cryo: '#69c0ff',
  nature: '#52c41a',
  physical: '#a5a5a8',
};

function gaugeColorFor(trackIndex: TrackIndex): string {
  const operatorSlug = viewModel.value.tracks[trackIndex]?.operatorSlug ?? null;
  const element =
    operatorSlug === null ? null : editorGameDataRepository.getOperator(operatorSlug)?.element;
  return element === undefined || element === null
    ? '#00e5ff'
    : (GAUGE_ELEMENT_COLORS[element] ?? '#00e5ff');
}

function gaugeCurveFor(trackIndex: TrackIndex): OperatorUltimateEnergyCurve | null {
  const current = simulationRun.value;
  const track = viewModel.value.tracks[trackIndex];
  if (current === null || track === undefined || track.operatorInstanceId === null) return null;
  return (
    current.resourceCurves.ultimateEnergy.find(
      curve => curve.operatorId === track.operatorInstanceId,
    ) ?? null
  );
}
function reactionName(reaction: string): string {
  const key = `effects.name.${reaction}`;
  const translated = t(key);
  return translated === key ? reaction : translated;
}

function inflictionOutcomeLabel(outcome: string): string {
  if (outcome === 'attachmentOnly') return t('nextTimeline.hitInflictionSuffix');
  if (outcome === 'burst') return t('nextTimeline.effect.burst');
  if (outcome === 'compoundStatus') return t('nextTimeline.effect.reaction');
  return outcome;
}

function hitMarkerTitle(label: TimelineHitEffectLabel | undefined): string {
  if (label === undefined) return '';
  const parts: string[] = [];
  for (const damage of label.damage) {
    parts.push(
      `${Math.round(damage.value)}${damage.isCritical ? '!' : ''} ${damageElementLabel(damage.damageType)}`,
    );
  }
  for (const infliction of label.infliction) {
    parts.push(`${damageElementLabel(infliction.element)}${t('nextTimeline.hitInflictionSuffix')}`);
  }
  for (const reaction of label.reactions) {
    const name = reactionName(reaction.reaction);
    parts.push(
      reaction.applied
        ? `${name} Lv${reaction.level}`
        : `${name}${t('nextTimeline.hitReactionConsumed')}`,
    );
  }
  return parts.join(' · ');
}

function castHitMarkers(trackIndex: TrackIndex, castId: string): TimelineHitMarkerView[] {
  const castModel = viewModel.value.tracks[trackIndex]?.skillCasts.find(
    candidate => candidate.id === castId,
  );
  if (castModel === undefined) return [];
  const effects = castHitEffects.value.get(castId);
  const publishedStartFrame = skillCastActualStartFrames.value.get(castId) ?? castModel.startFrame;
  return castModel.hitMarkers
    .filter(marker =>
      shouldDisplayTimelineHitMarker(marker, simulationRun.value !== null, hitActualFrames.value),
    )
    .map(marker => ({
      stepKey: marker.stepKey,
      hitId: marker.hitId,
      leftPx:
        ((hitActualFrames.value.get(marker.hitId) ?? publishedStartFrame + marker.frameOffset) -
          publishedStartFrame) *
        pxPerFrame.value,
      ...(effects === undefined ? {} : { title: hitMarkerTitle(effects.get(marker.hitId)) }),
    }));
}

const hitDetailTarget = ref<{ trackIndex: TrackIndex; castId: string; hitId: string } | null>(null);
const hitDetail = computed(() => {
  const target = hitDetailTarget.value;
  const current = simulationRun.value;
  if (target === null || current === null) return null;
  const track = scenario.value.tracks[target.trackIndex];
  const cast = track?.skillCasts.find(candidate => candidate.id === target.castId);
  if (track === null || cast === undefined || track.operator === null) return null;
  const castModel = viewModel.value.tracks[target.trackIndex]?.skillCasts.find(
    candidate => candidate.id === target.castId,
  );
  const marker = castModel?.hitMarkers.find(candidate => candidate.hitId === target.hitId) ?? null;
  if (marker === null) return null;
  const entries = projectTimelineHitDetailEntries(current.receiptEntries, cast.id, marker.hitId);
  return { cast, marker, entries };
});
const hitDetailTitle = computed(() => {
  const detail = hitDetail.value;
  const target = hitDetailTarget.value;
  if (detail === null || target === null) return '';
  const trackModel = viewModel.value.tracks[target.trackIndex];
  const castModel = trackModel?.skillCasts.find(cast => cast.id === target.castId);
  if (trackModel === undefined || castModel === undefined) {
    return `${target.castId} · ${detail.marker.frameOffset}f`;
  }
  const actualStart = skillCastActualStartFrames.value.get(target.castId) ?? castModel.startFrame;
  const actualOffset =
    (hitActualFrames.value.get(detail.marker.hitId) ?? actualStart + detail.marker.frameOffset) -
    actualStart;
  return `${timelineCastLabel(castModel, trackModel)} · ${actualOffset}f`;
});

const cursorGuideLines = computed(() => {
  const frame = cursorGuide.value?.sampleFrame ?? 0;
  const lines = [`TIME ${Number((frame / PROJECT_FPS).toFixed(2))}s`];
  const current = simulationRun.value;
  if (current !== null) {
    const sp = sampleStepCurve(current.resourceCurves.sp.points, frame);
    lines.push(
      `SP ${formatGuideNumber(sp.value)}/${formatGuideNumber(current.resourceCurves.sp.maxValue)}`,
    );
    const health = sampleStepCurve(current.enemyHealthCurve.points, frame);
    lines.push(
      `${t('nextTimeline.simGuide.enemyHp')} ${formatGuideNumber(health.value)}/${formatGuideNumber(current.enemyHealthCurve.maxValue)}`,
    );
    if (current.poiseCurve.maxValue > 0) {
      const poise = sampleStepCurve(current.poiseCurve.points, frame);
      lines.push(
        `${t('nextTimeline.simGuide.poise')} ${formatGuideNumber(poise.value)}/${formatGuideNumber(current.poiseCurve.maxValue)}`,
      );
    }
    for (const curve of current.resourceCurves.ultimateEnergy) {
      const sampled = sampleStepCurve(curve.points, frame);
      lines.push(
        `${curve.operatorId} ${formatGuideNumber(sampled.value)}/${formatGuideNumber(curve.maxValue)}`,
      );
    }
  }
  return lines;
});
const cursorGuideText = computed(() => cursorGuideLines.value.join('\n'));

function operatorName(slug: string | null): string {
  if (slug === null) return t('nextTimeline.emptyTrack');
  const definition = editorGameDataRepository.getOperator(slug);
  return (
    definition?.displayName ?? getOperatorGameName(definition?.assetSlug ?? slug, locale.value)
  );
}

function enemyName(enemyId: string): string {
  return getEnemyGameName(enemyId, locale.value);
}

function skillName(groupKey: string, slug: string | null): string {
  if (slug === null) return groupKey;
  const definition = editorGameDataRepository.getOperator(slug);
  return getOperatorCombatSkillName(definition?.assetSlug ?? slug, groupKey, locale.value);
}

function skillTypeLabel(skillType: string): string {
  const displayType =
    skillType === 'basicAttack'
      ? 'attack'
      : skillType === 'battleSkill'
        ? 'skill'
        : skillType === 'comboSkill'
          ? 'link'
          : skillType === 'finisher'
            ? 'execution'
            : skillType === 'plungingAttack'
              ? 'dive'
              : skillType;
  return t(`skillType.${displayType}`);
}

function timelineCastLabel(
  cast: (typeof viewModel.value.tracks)[number]['skillCasts'][number],
  track: (typeof viewModel.value.tracks)[number],
): string {
  const source = cast.source;
  if (source.kind === 'custom') return source.name;
  const entry = track.skillLibrary.find(
    candidate => candidate.skillGroupKey === source.skillGroupKey,
  );
  const segmentLabel =
    entry === undefined
      ? null
      : basicAttackSegmentLabel(entry, source.skillKey, t('skillType.heavyAttack'));
  return (
    segmentLabel ?? (cast.skillType === null ? source.skillKey : skillTypeLabel(cast.skillType))
  );
}

function skillAccentColor(skillType: string): string {
  return (
    {
      basicAttack: '#aaaaaa',
      battleSkill: '#ffffff',
      comboSkill: '#fdd900',
      ultimate: '#00e5ff',
      finisher: '#a61d24',
      plungingAttack: '#69c0ff',
    }[skillType] ?? '#8c8c8c'
  );
}

function skillDisplayIcon(skillType: string, operatorSlug: string | null): string {
  if (operatorSlug === null) return '';
  const operator = editorGameDataRepository.getOperator(operatorSlug);
  const assetSlug = operator?.assetSlug ?? operatorSlug;
  if (skillType === 'battleSkill') return `/operators/${assetSlug}/battle.webp`;
  if (skillType === 'comboSkill') return `/operators/${assetSlug}/combo.webp`;
  if (skillType === 'ultimate') return `/operators/${assetSlug}/ultimate.webp`;
  const weaponType = operator?.weaponType ?? 'sword';
  return (
    {
      sword: '/icons/icon_attack_sword.webp',
      greatsword: '/icons/icon_attack_claym.webp',
      polearm: '/icons/icon_attack_lance.webp',
      handcannon: '/icons/icon_attack_pistol.webp',
      'arts-unit': '/icons/icon_attack_funnel.webp',
    }[weaponType] ?? '/icons/default_icon.webp'
  );
}

function skillDurationSeconds(entry: TimelineSkillLibraryEntryViewModel): number {
  const frames = entry.skills.reduce((total, skill) => total + skill.timelineBlockFrames, 0);
  return Math.round((frames / 30) * 1000) / 1000;
}

function applyActionSelection(selection: TimelineActionSelection): void {
  actionSelection.value = selection;
  selectedCastId.value = selection.primaryId;
}

function clearTimelineSelection(): void {
  applyActionSelection(createEmptyTimelineActionSelection());
}

function pointerInTimelineSurface(event: PointerEvent): { x: number; y: number } | null {
  const surface = timelineSurface.value;
  if (surface === null) return null;
  const rect = surface.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function updateConnectionDrag(event: PointerEvent): void {
  const pointer = pointerInTimelineSurface(event);
  if (pointer === null || connectionDrag.value === null) return;
  connectionDrag.value = { ...connectionDrag.value, pointer };
}

function cancelConnectionDrag(): void {
  connectionDrag.value = null;
  window.removeEventListener('pointermove', updateConnectionDrag);
  window.removeEventListener('pointerup', finishConnectionDrag);
  window.removeEventListener('pointercancel', cancelConnectionDrag);
}

function finishConnectionDrag(event: PointerEvent): void {
  const drag = connectionDrag.value;
  cancelConnectionDrag();
  if (drag === null) return;

  const target = document
    .elementsFromPoint(event.clientX, event.clientY)
    .map(element =>
      element.closest<HTMLElement>('[data-connection-action-id][data-connection-port]'),
    )
    .find((element): element is HTMLElement => element !== null);
  const targetSkillCastId = target?.dataset.connectionActionId;
  const targetPortValue = target?.dataset.connectionPort;
  if (targetSkillCastId === undefined || targetPortValue === undefined) return;

  if (targetPortValue.startsWith('hit:')) {
    const toStepKey = targetPortValue.slice('hit:'.length);
    const targetMarkers =
      viewModel.value.tracks
        .flatMap(track => track.skillCasts)
        .find(castModel => castModel.id === targetSkillCastId)?.hitMarkers ?? [];
    commitScenario('createDamageHitConnection', current =>
      createDamageHitConnection(current, {
        id: ids.allocate('connection'),
        fromSkillCastId: drag.skillCastId,
        fromPort: drag.port,
        toSkillCastId: targetSkillCastId,
        toStepKey,
        targetMarkers,
      }),
    );
    return;
  }
  commitScenario('createTimelineConnection', current =>
    createSkillCastConnection(current, {
      id: ids.allocate('connection'),
      fromSkillCastId: drag.skillCastId,
      fromPort: drag.port,
      toSkillCastId: targetSkillCastId,
      toPort: targetPortValue as TimelineConnectionPort,
    }),
  );
}

function beginConnectionDrag(
  event: PointerEvent,
  skillCastId: string,
  port: TimelineConnectionPort,
): void {
  if (!connectionToolEnabled.value) return;
  const pointer = pointerInTimelineSurface(event);
  if (pointer === null) return;
  connectionDrag.value = { skillCastId, port, pointer };
  window.addEventListener('pointermove', updateConnectionDrag);
  window.addEventListener('pointerup', finishConnectionDrag);
  window.addEventListener('pointercancel', cancelConnectionDrag);
}

function toggleConnectionTool(): boolean {
  connectionToolEnabled.value = !connectionToolEnabled.value;
  if (!connectionToolEnabled.value) cancelConnectionDrag();
  return true;
}

function deleteTimelineConnection(connectionId: string): void {
  commitScenario('removeTimelineConnection', current =>
    removeTimelineConnection(current, connectionId),
  );
}

function handleActionSelection(event: MouseEvent, skillCastId: string): void {
  if (suppressedCastClickId === skillCastId) {
    suppressedCastClickId = null;
    return;
  }
  applyActionSelection(
    selectTimelineAction(actionSelection.value, skillCastId, event.ctrlKey || event.metaKey),
  );
}

function skillSegments(entry: TimelineSkillLibraryEntryViewModel) {
  return entry.skills.map((skill, index) => ({
    id: skill.skillKey,
    label:
      basicAttackSegmentLabel(entry, skill.skillKey, t('skillType.heavyAttack')) ?? `A${index + 1}`,
    selected: false,
    disabled: false,
  }));
}

function selectTimelinePosition(event: MouseEvent): void {
  const lane = event.currentTarget as HTMLElement;
  cursorFrame.value = Math.max(
    0,
    Math.min(
      scenario.value.battle.durationFrames,
      timelinePointerActualFrame(event.clientX - lane.getBoundingClientRect().left),
    ),
  );
  clearTimelineSelection();
}

const { marqueeStyle, beginMarqueeGesture, consumeLaneClickSuppression } =
  useTimelineMarqueeGesture({
    surface: timelineSurface,
    getSelection: () => actionSelection.value,
    applySelection: applyActionSelection,
  });
const { isPanning, beginViewportPan } = useTimelineViewportPan({ viewport: timelineScroll });

function handleTimelineLanePointerDown(event: PointerEvent): void {
  if (!beginViewportPan(event)) beginMarqueeGesture(event);
}

function handleTimelineLaneClick(event: MouseEvent): void {
  if (consumeLaneClickSuppression()) return;
  selectTimelinePosition(event);
}

function updateCursorGuide(event: MouseEvent): void {
  const surface = timelineSurface.value;
  if (surface === null || !showCursorGuide.value) {
    cursorGuide.value = null;
    return;
  }
  const surfaceRect = surface.getBoundingClientRect();
  if (event.clientY < surfaceRect.top + TIMELINE_RULER_HEIGHT) {
    cursorGuide.value = null;
    return;
  }
  const pointerPx = event.clientX - surfaceRect.left - TIMELINE_TRACK_HEADER_WIDTH;
  const guide = resolveTimelineCursorGuidePosition(
    pointerPx,
    scenario.value.battle.prepFrames,
    scenario.value.battle.durationFrames,
    pxPerFrame.value,
  );
  cursorGuide.value = {
    ...guide,
  };
}

function hideCursorGuide(): void {
  cursorGuide.value = null;
}

function placeGroup(
  skillGroupKey: string,
  skillKey?: string,
  startFrame = cursorFrame.value,
  trackIndex = selectedTrack.value,
): void {
  const operatorSlug = viewModel.value.tracks[trackIndex]?.operatorSlug ?? null;
  const operator =
    operatorSlug === null ? null : editorGameDataRepository.getOperator(operatorSlug);
  if (operator === null) return;
  const result = placeSkillGroup({
    scenario: scenario.value,
    trackIndex,
    operator,
    skillGroupKey,
    ...(skillKey === undefined ? {} : { skillKey }),
    startFrame,
    ids,
  });
  commitScenario('placeSkillGroup', () => result.scenario);
  const lastPlacedId = result.skillCastIds.at(-1);
  if (lastPlacedId === undefined) clearTimelineSelection();
  else applyActionSelection(selectTimelineAction(actionSelection.value, lastPlacedId, false));
  const placed = result.scenario.tracks[trackIndex]?.skillCasts ?? [];
  const last = placed.at(-1);
  if (last !== undefined) {
    const lastSkillDuration = resolvePlacedSkillDurationFrames(operator, skillGroupKey, skillKey);
    cursorFrame.value = last.placement.startFrame + lastSkillDuration;
  }
}
function resolvePlacedSkillDurationFrames(
  operator: ReturnType<typeof nextGameDataRepository.getOperator>,
  skillGroupKey: string,
  skillKey?: string,
): number {
  if (operator === null) return 0;
  const group = operator.skillGroups.find(g => g.key === skillGroupKey);
  if (group === undefined) return 0;
  const skills: readonly { timelineBlockFrames: number; key: string }[] = Array.isArray(
    group.skills,
  )
    ? group.skills
    : [group.skills];
  const filtered = skillKey === undefined ? skills : skills.filter(s => s.key === skillKey);
  const lastSkill = filtered.at(-1);
  return lastSkill?.timelineBlockFrames ?? 0;
}

function beginSkillDrag(event: DragEvent, skillGroupKey: string, skillKey?: string): void {
  dragPayload.value = {
    kind: 'librarySkill',
    skillGroupKey,
    ...(skillKey === undefined ? {} : { skillKey }),
  };
  if (event.dataTransfer !== null) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', skillKey ?? skillGroupKey);
  }
}

function beginCastMove(event: PointerEvent, trackIndex: TrackIndex, skillCastId: string): void {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  cancelCastMove();
  const selection = actionSelection.value.selectedIds.has(skillCastId)
    ? { ...actionSelection.value, primaryId: skillCastId }
    : selectTimelineAction(actionSelection.value, skillCastId, false);
  const block = event.currentTarget as HTMLElement;
  const pointerOffsetActualFrames = Math.max(
    0,
    (event.clientX - block.getBoundingClientRect().left) / pxPerFrame.value,
  );
  const cast = scenario.value.tracks[trackIndex]?.skillCasts.find(
    candidate => candidate.id === skillCastId,
  );
  if (cast === undefined) return;
  const initialActualFrame =
    skillCastActualStartFrames.value.get(skillCastId) ?? cast.placement.startFrame;
  castMoveGesture.value = {
    pointerId: event.pointerId,
    trackIndex,
    skillCastId,
    skillCastIds: [...selection.selectedIds],
    pointerOffsetActualFrames,
    anchorActualFrame: initialActualFrame,
    baseScenario: scenario.value,
    previewFrame: cast.placement.startFrame,
    previewActualFrame: initialActualFrame,
    committed: false,
    moved: false,
  };
  // 首次产生有效位移时立即模拟，不继承上一轮拖动的节流窗口。
  lastCastMoveSimulationAt = performance.now() - LIVE_SIMULATION_INTERVAL_MS;
  const onMove = (moveEvent: PointerEvent) => updateCastMove(moveEvent);
  const onFinish = (finishEvent: PointerEvent) => finishCastMove(finishEvent);
  const onCancel = () => cancelCastMove();
  const onKeyDown = (keyEvent: KeyboardEvent) => {
    if (keyEvent.key !== 'Escape') return;
    keyEvent.preventDefault();
    cancelCastMove();
  };
  stopCastMoveGesture = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onFinish);
    window.removeEventListener('pointercancel', onCancel);
    window.removeEventListener('keydown', onKeyDown, true);
    stopCastMoveGesture = null;
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onFinish);
  window.addEventListener('pointercancel', onCancel);
  window.addEventListener('keydown', onKeyDown, true);
}

function castMoveFrame(
  event: PointerEvent,
  gesture: TimelineCastMoveGesture,
): { readonly placementFrame: number; readonly actualFrame: number } | null {
  const pointed = document.elementFromPoint(event.clientX, event.clientY);
  const lane = pointed instanceof Element ? pointed.closest<HTMLElement>('.track-lane') : null;
  if (lane?.dataset.trackIndex !== String(gesture.trackIndex)) return null;
  const pointerActualFrame = Math.max(
    0,
    Math.min(
      scenario.value.battle.durationFrames,
      (event.clientX - lane.getBoundingClientRect().left) / pxPerFrame.value -
        scenario.value.battle.prepFrames,
    ),
  );
  return resolveTimelineCastMoveFrame({
    pointerActualFrame,
    pointerOffsetActualFrames: gesture.pointerOffsetActualFrames,
    snapFrames: snapFrames.value,
    actualMaximumFrame: scenario.value.battle.durationFrames,
  });
}

function updateCastMove(event: PointerEvent): void {
  const gesture = castMoveGesture.value;
  if (gesture === null || gesture.pointerId !== event.pointerId) return;
  const frame = castMoveFrame(event, gesture);
  if (frame === null) return;
  if (
    frame.placementFrame === gesture.previewFrame &&
    frame.actualFrame === gesture.previewActualFrame
  ) {
    return;
  }
  if (!gesture.moved) {
    gesture.moved = true;
    applyActionSelection({
      selectedIds: new Set(gesture.skillCastIds),
      primaryId: gesture.skillCastId,
    });
  }
  castMoveGesture.value = {
    ...gesture,
    previewFrame: frame.placementFrame,
    previewActualFrame: frame.actualFrame,
  };
  if (frame.placementFrame !== gesture.previewFrame) {
    scenario.value = moveSkillCasts(
      gesture.baseScenario,
      new Set(gesture.skillCastIds),
      gesture.trackIndex,
      gesture.skillCastId,
      frame.placementFrame,
    );
  }
  cursorFrame.value = frame.placementFrame;

  // 连续拖动时节流而不是防抖：鼠标不停移动，模拟也会持续得到中间位置。
  const now = performance.now();
  if (now - lastCastMoveSimulationAt >= LIVE_SIMULATION_INTERVAL_MS) {
    lastCastMoveSimulationAt = now;
    void nextTick(simulateNow);
  }
}

async function finishCastMove(event: PointerEvent): Promise<void> {
  let gesture = castMoveGesture.value;
  if (gesture === null || gesture.pointerId !== event.pointerId) return;
  updateCastMove(event);
  gesture = castMoveGesture.value;
  if (gesture === null) return;
  const finalScenario = scenario.value;
  const moved = gesture.moved;
  stopCastMoveGesture?.();
  if (!moved) {
    castMoveGesture.value = null;
    scenario.value = gesture.baseScenario;
    return;
  }
  const settlingGesture = { ...gesture, committed: true };
  castMoveGesture.value = settlingGesture;
  suppressedCastClickId = gesture.skillCastId;
  setTimeout(() => {
    if (suppressedCastClickId === gesture.skillCastId) suppressedCastClickId = null;
  }, 0);
  commitScenario('moveSkillCasts', () => finalScenario);
  await nextTick();
  const published = await simulateNow();
  // 只清理仍属于本次松手的预览；失败时保留实际落点，避免回退到不匹配的旧回执。
  if (published && castMoveGesture.value === settlingGesture) castMoveGesture.value = null;
}

function cancelCastMove(): void {
  const gesture = castMoveGesture.value;
  stopCastMoveGesture?.();
  castMoveGesture.value = null;
  if (gesture !== null && !gesture.committed) scenario.value = gesture.baseScenario;
}

function beginTrackOrderDrag(event: DragEvent, trackIndex: TrackIndex): void {
  dragPayload.value = { kind: 'trackOrder', trackIndex };
  if (event.dataTransfer !== null) event.dataTransfer.effectAllowed = 'move';
}

function swapTrackOrder(fromIndex: TrackIndex, toIndex: TrackIndex): void {
  if (fromIndex === toIndex) return;
  commitScenario('swapTimelineTracks', current => swapTimelineTracks(current, fromIndex, toIndex));
  if (selectedTrack.value === fromIndex) selectedTrack.value = toIndex;
  else if (selectedTrack.value === toIndex) selectedTrack.value = fromIndex;
}

function dropTrackOrder(event: DragEvent, trackIndex: TrackIndex): void {
  const payload = dragPayload.value;
  if (payload?.kind !== 'trackOrder') return;
  event.preventDefault();
  dragPayload.value = null;
  swapTrackOrder(payload.trackIndex, trackIndex);
}

function dropTimelinePayload(event: DragEvent, trackIndex: TrackIndex): void {
  const payload = dragPayload.value;
  dragPayload.value = null;
  if (payload === null) return;
  if (payload.kind === 'trackOrder') {
    swapTrackOrder(payload.trackIndex, trackIndex);
    return;
  }
  const lane = event.currentTarget as HTMLElement;
  const pointerFrame = Math.max(
    0,
    Math.min(
      scenario.value.battle.durationFrames,
      timelinePointerActualFrame(event.clientX - lane.getBoundingClientRect().left),
    ),
  );
  const frame = snapTimelineFrame(
    pointerFrame,
    snapFrames.value,
    scenario.value.battle.durationFrames,
  );
  cursorFrame.value = frame;
  placeGroup(payload.skillGroupKey, payload.skillKey, frame, trackIndex);
}

function resetScenario(): void {
  commitScenario('resetScenario', () => createTimelineSampleScenario());
  selectedTrack.value = 0;
  clearTimelineSelection();
  cursorFrame.value = 30;
  contextMenuTarget.value = null;
}

function restoreEditorHistory(direction: 'undo' | 'redo'): boolean {
  const restored = direction === 'undo' ? scenarioSession.undo() : scenarioSession.redo();
  if (!restored) return false;
  clearTimelineSelection();
  contextMenuTarget.value = null;
  return true;
}

function openCastContextMenu(event: MouseEvent, trackIndex: TrackIndex, skillCastId: string): void {
  if (actionSelection.value.selectedIds.has(skillCastId)) {
    applyActionSelection({ ...actionSelection.value, primaryId: skillCastId });
  } else {
    applyActionSelection(selectTimelineAction(actionSelection.value, skillCastId, false));
  }
  contextMenuTarget.value = { x: event.clientX, y: event.clientY, trackIndex, skillCastId };
}

function toggleContextCastField(field: 'locked' | 'disabled'): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  const cast = scenario.value.tracks[target.trackIndex]?.skillCasts.find(
    candidate => candidate.id === target.skillCastId,
  );
  if (cast === undefined) return;
  const currentValue = cast.presentation?.[field] ?? false;
  const command = field === 'locked' ? setSkillCastLocked : setSkillCastDisabled;
  commitScenario(`toggleSkillCast${field.charAt(0).toUpperCase() + field.slice(1)}`, current =>
    command(current, target.trackIndex, target.skillCastId, !currentValue),
  );
  contextMenuTarget.value = null;
}

function deleteContextCast(): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  const selection = actionSelection.value.selectedIds.has(target.skillCastId)
    ? actionSelection.value
    : selectTimelineAction(actionSelection.value, target.skillCastId, false);
  deleteSelectedTimelineActions(scenarioSession, selection);
  clearTimelineSelection();
  contextMenuTarget.value = null;
}

function copyContextSelection(): void {
  copySelectedActions();
  contextMenuTarget.value = null;
}

function pasteClipboardAtCursor(): void {
  const clipboard = timelineClipboard.value;
  if (clipboard === null) return;
  const pasteFrame = snapTimelineFrame(
    cursorFrame.value,
    snapFrames.value,
    scenario.value.battle.durationFrames,
  );
  const result = pasteTimelineActions(scenario.value, clipboard, pasteFrame, ids);
  if (result.skillCastIds.length === 0) return;
  commitScenario('pasteSkillCasts', () => result.scenario);
  applyActionSelection({
    selectedIds: new Set(result.skillCastIds),
    primaryId: result.skillCastIds.at(-1) ?? null,
  });
}

function copySelectedActions(): boolean {
  if (actionSelection.value.selectedIds.size === 0) return false;
  timelineClipboard.value = copyTimelineActions(scenario.value, actionSelection.value.selectedIds);
  return timelineClipboard.value !== null;
}

function deleteSelectedActions(): boolean {
  const deleted = deleteSelectedTimelineActions(scenarioSession, actionSelection.value);
  if (deleted) clearTimelineSelection();
  return deleted;
}

function nudgeSelectedActions(deltaFrames: -1 | 1): boolean {
  const selection = actionSelection.value;
  const anchorSkillCastId = selection.primaryId ?? selection.selectedIds.values().next().value;
  if (anchorSkillCastId === undefined) return false;
  for (const [trackIndex, track] of scenario.value.tracks.entries()) {
    const anchor = track?.skillCasts.find(cast => cast.id === anchorSkillCastId);
    if (anchor === undefined) continue;
    return commitScenario('moveSkillCasts', current =>
      moveSkillCasts(
        current,
        selection.selectedIds,
        trackIndex as TrackIndex,
        anchorSkillCastId,
        Math.max(0, anchor.placement.startFrame + deltaFrames * snapFrames.value),
      ),
    );
  }
  return false;
}

function toggleSnapPrecision(): boolean {
  snapFrames.value =
    snapFrames.value === PRECISE_TIMELINE_SNAP_FRAMES
      ? COARSE_TIMELINE_SNAP_FRAMES
      : PRECISE_TIMELINE_SNAP_FRAMES;
  return true;
}

function toggleCursorGuide(): boolean {
  showCursorGuide.value = !showCursorGuide.value;
  return true;
}

async function updateTimelineZoomPercent(percent: number, anchorClientX?: number): Promise<void> {
  const nextPercent = normalizeTimelineZoomPercent(percent);
  if (nextPercent === timelineZoomPercent.value) return;

  const viewport = timelineScroll.value;
  const anchorOffset =
    viewport === null
      ? null
      : anchorClientX === undefined
        ? viewport.clientWidth / 2
        : anchorClientX - viewport.getBoundingClientRect().left;
  const anchorContentX =
    viewport === null || anchorOffset === null ? null : viewport.scrollLeft + anchorOffset;
  const anchorFrame =
    anchorContentX === null
      ? null
      : (anchorContentX - TIMELINE_TRACK_HEADER_WIDTH) / pxPerFrame.value -
        scenario.value.battle.prepFrames;

  timelineZoomPercent.value = nextPercent;
  if (viewport === null || anchorFrame === null || anchorOffset === null) return;

  await nextTick();
  viewport.scrollLeft = Math.max(
    0,
    TIMELINE_TRACK_HEADER_WIDTH +
      (anchorFrame + scenario.value.battle.prepFrames) * pxPerFrame.value -
      anchorOffset,
  );
}

function handleTimelineWheel(event: WheelEvent): void {
  if (!event.ctrlKey) return;
  event.preventDefault();
  const direction = event.deltaY < 0 ? 1 : -1;
  const step = Math.max(1, Math.round(timelineZoomPercent.value * 0.15));
  void updateTimelineZoomPercent(timelineZoomPercent.value + direction * step, event.clientX);
}

function cycleOccupiedTrack(direction: -1 | 1): boolean {
  const nextTrackIndex = findAdjacentOccupiedTrack(
    scenario.value.tracks,
    selectedTrack.value,
    direction,
  );
  if (nextTrackIndex === null) {
    ElMessage.warning(t('timeline.shortcut.cycleNeedsOperator'));
    return true;
  }
  if (nextTrackIndex !== selectedTrack.value) {
    selectedTrack.value = nextTrackIndex;
    clearTimelineSelection();
  }
  return true;
}

const hasModalPanel = computed(
  () =>
    operatorDialogTrack.value !== null ||
    weaponDialogTrack.value !== null ||
    gearDialogTarget.value !== null ||
    showOperatorBuildDialog.value ||
    showOperatorDefinitionWorkspace.value ||
    showWeaponDefinitionWorkspace.value ||
    gearDefinitionWorkspaceSlot.value !== null ||
    gearSetDefinitionWorkspaceId.value !== null ||
    showSkillDefinitionEditor.value ||
    showWeaponBuildDialog.value ||
    showGearBuildDialog.value ||
    panelDialogTrack.value !== null,
);

useKeyboardShortcutScope({
  id: 'next-timeline-overlay',
  priority: 100,
  active: () => hasModalPanel.value || contextMenuTarget.value !== null,
  handle: () => false,
  blockLowerScopes: true,
});

useKeyboardShortcutScope({
  id: 'next-timeline-editor',
  priority: 10,
  active: () => !hasModalPanel.value && contextMenuTarget.value === null,
  handle: event => {
    if (isTextEditingTarget(event.target)) return false;
    return handleTimelineEditorShortcut(event, {
      undo: () => restoreEditorHistory('undo'),
      redo: () => restoreEditorHistory('redo'),
      copy: copySelectedActions,
      paste: () => {
        if (timelineClipboard.value === null) return false;
        pasteClipboardAtCursor();
        return true;
      },
      delete: deleteSelectedActions,
      nudgeLeft: () => nudgeSelectedActions(-1),
      nudgeRight: () => nudgeSelectedActions(1),
      toggleSnapPrecision,
      toggleCursorGuide,
      toggleConnectionTool,
      cycleTrack: cycleOccupiedTrack,
    });
  },
});

function moveTrack(trackIndex: TrackIndex, direction: -1 | 1): void {
  const targetIndex = (trackIndex + direction) as TrackIndex;
  if (targetIndex < 0 || targetIndex > 3) return;
  swapTrackOrder(trackIndex, targetIndex);
}

function setTrackInitialUltimateEnergy(trackIndex: TrackIndex, value: number): void {
  const maximum = viewModel.value.tracks[trackIndex]?.maxUltimateEnergy ?? null;
  if (maximum === null) return;
  commitScenario('updateTrackInitialUltimateEnergy', current =>
    updateTrackInitialUltimateEnergy(current, trackIndex, value, maximum),
  );
}

function setBattleResourceRule(field: EditableBattleResourceRule, value: number): void {
  commitScenario('updateBattleResourceRule', current =>
    updateBattleResourceRule(current, field, value),
  );
}

function setContextCastColor(color: string | null): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  commitScenario('setSkillCastColor', current =>
    setSkillCastColor(current, target.trackIndex, target.skillCastId, color),
  );
  contextMenuTarget.value = null;
}

function setSelectedCastCameraTargetAngle(angleDegrees: number | null): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('setSkillCastCameraTargetAngle', current =>
    setSkillCastCameraTargetAngle(current, selected.trackIndex, selected.cast.id, angleDegrees),
  );
}

function resetSelectedCastDefinition(): void {
  const selected = selectedCastModel.value;
  if (selected === null || !selected.edited) return;
  commitScenario('resetSkillCastToTemplate', current =>
    resetSkillCastToTemplate(current, selected.trackIndex, selected.cast.id),
  );
  showSkillDefinitionEditor.value = false;
}

/**
 * 保存技能逻辑编辑：把完整草稿交给统一命令入口做最后校验后写入场景。
 * 校验失败时命令抛错，场景保持不变。
 */
function saveSelectedCastDefinition(draft: SkillDefinition): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('setSkillCastCustomDefinition', current =>
    setSkillCastCustomDefinition(current, selected.trackIndex, selected.cast.id, draft),
  );
  showSkillDefinitionEditor.value = false;
}

function setPanelDialogVisible(visible: boolean): void {
  if (!visible) panelDialogTrack.value = null;
}
</script>

<template>
  <input
    ref="projectFileInput"
    class="project-file-input"
    type="file"
    accept="application/json,.json"
    @change="handleProjectFileChange"
  />
  <TimelineWorkbenchShell
    :labels="{
      library: t('timeline.activityBar.library'),
      globalConfig: t('timeline.activityBar.globalConfig'),
      contract: t('timeline.activityBar.contract'),
      resourceMonitor: t('timeline.activityBar.resourceMonitor'),
      inspector: t('timeline.activityBar.inspector'),
      battleLog: t('timeline.activityBar.battleLog'),
    }"
  >
    <template #left>
      <section class="skill-sidebar">
        <button class="operator-heading" type="button" @click="openOperatorDialog()">
          <span class="operator-heading__mark"></span>
          <strong>{{ operatorName(selectedTrackModel.operatorSlug) }}</strong>
        </button>
        <div class="sidebar-tabs">
          <button
            class="active"
            type="button"
            :disabled="selectedLoadoutModel.operator === null"
            @click="showOperatorBuildDialog = true"
          >
            {{ t('nextTimeline.operatorTab') }}
          </button>
          <button
            type="button"
            :disabled="selectedLoadoutModel.weapon === null"
            @click="showWeaponBuildDialog = true"
          >
            {{ t('nextTimeline.weaponTab') }}
          </button>
          <button
            type="button"
            :disabled="!Object.values(selectedLoadoutModel.gears).some(Boolean)"
            @click="showGearBuildDialog = true"
          >
            {{ t('nextTimeline.gearTab') }}
          </button>
        </div>
        <div class="library-heading">
          <strong>{{ t('nextTimeline.skillLibrary') }}</strong>
          <span>Lv.{{ selectedTrackModel.skillLibrary[0]?.level ?? 0 }}</span>
        </div>
        <div class="skill-list">
          <SkillLibraryCard
            v-for="entry in selectedTrackModel.skillLibrary"
            :key="entry.skillGroupKey"
            :name="skillName(entry.skillGroupKey, selectedTrackModel.operatorSlug)"
            :type-label="skillTypeLabel(entry.skillType)"
            :duration="skillDurationSeconds(entry)"
            :icon="skillDisplayIcon(entry.skillType, selectedTrackModel.operatorSlug)"
            :accent-color="skillAccentColor(entry.skillType)"
            :segments="skillSegments(entry)"
            @dragstart="beginSkillDrag($event, entry.skillGroupKey)"
            @dragstart-segment="beginSkillDrag($event.event, entry.skillGroupKey, $event.skillKey)"
          />
        </div>
      </section>
    </template>

    <template #left-bottom="{ tool }">
      <NextEnemySettingsPanel
        v-if="tool === 'enemy'"
        :enemy="scenario.enemy"
        :definition="selectedEnemyDefinition"
        :enemies="enemies"
        :fps="PROJECT_FPS"
        :name-of="enemyName"
        :labels="{
          all: t('common.all'),
          close: t('common.close'),
          confirm: t('common.confirm'),
          custom: t('resourceMonitor.enemy.custom'),
          customDescription: t('resourceMonitor.enemy.customDesc'),
          unknown: t('resourceMonitor.enemy.unknown'),
          clickToChange: t('resourceMonitor.enemy.clickToChange'),
          selectTitle: t('resourceMonitor.enemy.dialogTitle'),
          searchPlaceholder: t('resourceMonitor.enemy.searchPlaceholder'),
          level: t('resourceMonitor.enemy.level'),
          empty: t('resourceMonitor.enemy.empty'),
          editStats: t('resourceMonitor.enemy.editStats'),
          editStatsTitle: t('resourceMonitor.enemy.editStatsTitle'),
          enemyHp: t('resourceMonitor.labels.enemyHp'),
          defense: t('statDetail.defense'),
          finisherMultiplier: `${t('skillType.execution')}${t('hitDetail.multipliers')}`,
          maximumStagger: t('resourceMonitor.labels.maxStagger'),
          staggerNodes: t('resourceMonitor.labels.staggerNodes'),
          nodeDuration: t('resourceMonitor.labels.nodeDuration'),
          brokenDuration: t('resourceMonitor.labels.breakDuration'),
          finisherRecovery: t('resourceMonitor.labels.executionRecovery'),
          superArmor: t('resourceMonitor.labels.superArmor'),
          resistances: t('resourceMonitor.labels.resistanceTitle'),
          resistance: {
            physical: t('resourceMonitor.resistance.physical'),
            heat: t('resourceMonitor.resistance.heat'),
            cryo: t('resourceMonitor.resistance.cryo'),
            electric: t('resourceMonitor.resistance.electric'),
            nature: t('resourceMonitor.resistance.nature'),
          },
          tier: {
            normal: t('enemyTier.normal'),
            advanced: t('enemyTier.advanced'),
            elite: t('enemyTier.elite'),
            boss: t('enemyTier.boss'),
            leader: t('enemyTier.leader'),
          },
        }"
        @select-index="selectDefinitionEnemy"
        @select-custom="selectCustomEnemy"
        @save="saveEnemyValues"
      />
      <div v-else class="empty-panel">{{ tool }}</div>
    </template>

    <template #header>
      <TimelineHeaderToolbar
        :scenario-name="scenario.name"
        :cursor-text="t('nextTimeline.cursorFrame', { frame: cursorFrame })"
        :can-undo="canUndo"
        :can-redo="canRedo"
        :can-paste="timelineClipboard !== null"
        :project-dirty="projectDirty"
        :labels="{
          undo: t('timeline.shortcuts.items.undo'),
          redo: t('timeline.shortcuts.items.redo'),
          paste: t('common.paste'),
          rename: t('timeline.scenario.renameTooltip'),
          duplicate: t('timeline.scenario.duplicateTooltip'),
          add: t('timeline.scenario.addTooltip'),
          analysis: t('timeline.analysis.button'),
          open: t('common.load'),
          export: t('common.export'),
          more: t('timeline.header.more'),
          reset: t('common.reset'),
        }"
        @undo="restoreEditorHistory('undo')"
        @redo="restoreEditorHistory('redo')"
        @paste="pasteClipboardAtCursor"
        @open="requestOpenProject"
        @export="exportProject"
        @reset="resetScenario"
      />
    </template>

    <div class="timeline-workspace">
      <div
        ref="timelineScroll"
        class="timeline-scroll"
        :class="{ 'is-panning': isPanning }"
        @wheel="handleTimelineWheel"
        @scroll="timelineScrollLeft = timelineScroll?.scrollLeft ?? 0"
      >
        <div
          ref="timelineSurface"
          class="timeline-surface"
          :style="{ width: `${180 + timelineWidth}px` }"
          @mousemove="updateCursorGuide"
          @mouseleave="hideCursorGuide"
        >
          <div class="corner-placeholder">
            <TimelineCornerToolbar
              :snap-label="snapFrames === PRECISE_TIMELINE_SNAP_FRAMES ? '1f' : '0.1s'"
              :zoom-percent="timelineZoomPercent"
              :cursor-guide-enabled="showCursorGuide"
              :connection-tool-enabled="connectionToolEnabled"
              :labels="{
                initialGauge: t('timelineGrid.toolbar.initialGauge'),
                cursorGuide: t('timelineGrid.toolbar.cursorGuide'),
                boxSelect: t('timelineGrid.toolbar.boxSelect'),
                snapPrecision: t('timelineGrid.toolbar.snapPrecision'),
                connectionTool: t('timelineGrid.toolbar.connectionTool'),
                buffLayout: t('timelineGrid.toolbar.buffLayoutMode', {
                  mode: t('timelineGrid.toolbar.buffLayoutCompact'),
                }),
                zoom: 'SCALE',
              }"
              @toggle-snap-precision="toggleSnapPrecision"
              @toggle-cursor-guide="toggleCursorGuide"
              @toggle-connection-tool="toggleConnectionTool"
              @update-zoom-percent="updateTimelineZoomPercent"
            />
          </div>
          <TimelineRuler
            class="timeline-ruler"
            :style="{ width: `${timelineWidth}px` }"
            :prep-frames="scenario.battle.prepFrames"
            :duration-frames="scenario.battle.durationFrames"
            :cursor-frame="cursorFrame"
            :px-per-frame="pxPerFrame"
            @seek="cursorFrame = $event"
          />
          <TimelineConnectionLayer
            :scenario="scenario"
            :tracks="viewModel.tracks"
            :px-per-frame="pxPerFrame"
            :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
            :cast-actual-start-frames="skillCastActualStartFrames"
            :cast-actual-duration-frames="skillCastActualDurationFrames"
            :hit-actual-frames="hitActualFrames"
            :preview="connectionDrag"
            @remove="deleteTimelineConnection"
          />
          <div
            v-if="showCursorGuide && cursorGuide !== null"
            class="cursor-guide"
            :style="{ left: `${TIMELINE_TRACK_HEADER_WIDTH + cursorGuide.leftPx}px` }"
          >
            <div class="cursor-guide-label">{{ cursorGuideText }}</div>
          </div>
          <TimelineTimeDilationBands
            :bands="timeDilationBands"
            :source-cast-ids="highlightedTimeDilationSourceIds"
            :prep-frames="scenario.battle.prepFrames"
            :px-per-frame="pxPerFrame"
            :horizontal-offset="TIMELINE_TRACK_HEADER_WIDTH"
          />

          <div
            v-for="track in viewModel.tracks"
            :key="track.trackIndex"
            class="track-row"
            :class="{ selected: selectedTrack === track.trackIndex }"
          >
            <TimelineTrackHeader
              class="track-identity"
              :track="track"
              :name="operatorName(track.operatorSlug)"
              :selected="selectedTrack === track.trackIndex"
              :can-move-up="track.trackIndex > 0"
              :can-move-down="track.trackIndex < 3"
              :stat-details-available="panelResolution.panels.has(track.trackIndex)"
              :stat-details-error="panelResolution.error"
              :weapon-icon="loadoutModels[track.trackIndex]?.weapon?.definition.iconPath ?? null"
              :gear-icons="{
                armor: loadoutModels[track.trackIndex]?.gears.armor?.definition.iconPath ?? null,
                gloves: loadoutModels[track.trackIndex]?.gears.gloves?.definition.iconPath ?? null,
                accessory1:
                  loadoutModels[track.trackIndex]?.gears.accessory1?.definition.iconPath ?? null,
                accessory2:
                  loadoutModels[track.trackIndex]?.gears.accessory2?.definition.iconPath ?? null,
              }"
              :labels="{
                weapon: t('timelineGrid.track.selectWeaponTooltip'),
                armor: t('timelineGrid.equipmentSlot.armor'),
                gloves: t('timelineGrid.equipmentSlot.gloves'),
                accessory1: t('timelineGrid.equipmentSlot.accessory1'),
                accessory2: t('timelineGrid.equipmentSlot.accessory2'),
              }"
              @select="selectTrack(track.trackIndex)"
              @operator="openOperatorDialog(track.trackIndex)"
              @move-up="moveTrack(track.trackIndex, -1)"
              @move-down="moveTrack(track.trackIndex, 1)"
              @reorder-drag-start="beginTrackOrderDrag($event, track.trackIndex)"
              @reorder-drop="dropTrackOrder($event, track.trackIndex)"
              @stats="openPanelDialog(track.trackIndex)"
              @weapon="openWeaponDialog(track.trackIndex)"
              @gear="openGearDialog(track.trackIndex, $event)"
              @update-initial-ultimate-energy="
                setTrackInitialUltimateEnergy(track.trackIndex, $event)
              "
            />
            <div
              class="track-lane"
              :data-track-index="track.trackIndex"
              :style="{ width: `${timelineWidth}px` }"
              @pointerdown="handleTimelineLanePointerDown"
              @click="handleTimelineLaneClick"
              @dragover.prevent
              @drop.prevent="dropTimelinePayload($event, track.trackIndex)"
            >
              <TimelineTrackGauge
                :curve="gaugeCurveFor(track.trackIndex)"
                :color="gaugeColorFor(track.trackIndex)"
                :prep-frames="scenario.battle.prepFrames"
                :duration-frames="scenario.battle.durationFrames"
                :px-per-frame="pxPerFrame"
              />
              <div
                class="prep-zone"
                :style="{ width: `${scenario.battle.prepFrames * pxPerFrame}px` }"
              ></div>
              <div
                class="battle-start-line"
                :style="{ left: `${scenario.battle.prepFrames * pxPerFrame}px` }"
              ></div>
              <TimelineActionBlock
                v-for="cast in track.skillCasts"
                :key="cast.id"
                :action-id="cast.id"
                :label="timelineCastLabel(cast, track)"
                :skill-type="cast.skillType"
                :left="
                  frameToTimelinePx(
                    castActualStartFrame(cast.id, cast.startFrame),
                    scenario.battle.prepFrames,
                    pxPerFrame,
                  )
                "
                :width="castActualDurationFrame(cast.id, cast.durationFrames) * pxPerFrame"
                :duration-pending="castActualDurationPending(cast.id, cast.durationFrames)"
                :selected="actionSelection.selectedIds.has(cast.id)"
                :moving="
                  !castMoveGesture?.committed && castMoveGesture?.skillCastIds.includes(cast.id)
                "
                :disabled="cast.disabled"
                :locked="cast.locked"
                :edited="cast.edited"
                :color="cast.color"
                :connection-tool-enabled="connectionToolEnabled"
                :warning="diagnosticsByCastId.has(cast.id) || cast.resolutionIssue !== undefined"
                :warning-text="cast.resolutionIssue ?? castWarningTitle(cast.id)"
                :hits="castHitMarkers(track.trackIndex, cast.id)"
                :time-dilation-segments="
                  castTimeDilationSegments(
                    cast.id,
                    cast.startFrame,
                    castActualDurationFrame(cast.id, cast.durationFrames),
                  )
                "
                @select="handleActionSelection($event, cast.id)"
                @hit-click="
                  hitDetailTarget = {
                    trackIndex: track.trackIndex,
                    castId: cast.id,
                    hitId: $event,
                  }
                "
                @connection-pointer-down="
                  (event, port) => beginConnectionDrag(event, cast.id, port)
                "
                @move-pointer-down="beginCastMove($event, track.trackIndex, cast.id)"
                @hover-change="setCastHovered(cast.id, $event)"
                @contextmenu="openCastContextMenu($event, track.trackIndex, cast.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="marqueeStyle" class="timeline-marquee" :style="marqueeStyle"></div>

    <template #bottom="{ tool }">
      <NextGlobalResourcePanel
        v-if="tool === 'global'"
        :rules="scenario.battle.resourceRules"
        :labels="{
          title: t('timeline.activityBar.globalConfig'),
          maximum: t('nextTimeline.maxSp'),
          initial: t('resourceMonitor.labels.initialSp'),
          recovery: t('resourceMonitor.labels.spPerSecond'),
        }"
        @update="setBattleResourceRule"
      />
      <section v-else-if="tool === 'enemy'" class="simulation-panel">
        <div class="simulation-status">
          <span
            v-if="simulationRunning"
            class="simulation-status__item simulation-status__item--running"
          >
            {{ t('nextTimeline.simulating') }}
          </span>
          <span
            v-else-if="simulationStale && simulationRun !== null"
            class="simulation-status__item simulation-status__item--muted"
          >
            …
          </span>
          <span
            v-if="simulationError !== null"
            class="simulation-status__item simulation-status__item--error"
          >
            {{ t('nextTimeline.simulationFailed') }}：{{ simulationError }}
          </span>
          <button class="simulation-status__button" type="button" @click="simulateNow">
            {{ t('nextTimeline.reSimulate') }}
          </button>
        </div>
        <SimulationPerformanceAudit
          :samples="simulationPerformanceSamples"
          :budget-ms="LIVE_SIMULATION_INTERVAL_MS"
          :labels="{
            title: t('nextTimeline.performance.title'),
            latest: t('nextTimeline.performance.latest'),
            p95: t('nextTimeline.performance.p95'),
            cacheHit: t('nextTimeline.performance.cacheHit'),
            cacheLookup: t('nextTimeline.performance.cacheLookup'),
            simulation: t('nextTimeline.performance.simulation'),
            projection: t('nextTimeline.performance.projection'),
            budget: t('nextTimeline.performance.budget'),
            noSamples: t('nextTimeline.performance.noSamples'),
          }"
        />
        <div v-if="simulationRun !== null" class="simulation-curves">
          <TimelineEnemyEffects
            :viz="enemyEffectViz"
            :timeline-width="timelineWidth"
            :prep-frames="scenario.battle.prepFrames"
            :px-per-frame="pxPerFrame"
            :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
            :scroll-left="timelineScrollLeft"
            :labels="{
              burst: t('nextTimeline.effect.burst'),
              reaction: t('nextTimeline.effect.reaction'),
              reactionConsumed: t('nextTimeline.effect.reactionConsumed'),
            }"
          />
          <TimelineResourceCurves
            :sp-curve="simulationRun.resourceCurves.sp"
            :enemy-health-curve="simulationRun.enemyHealthCurve"
            :poise-curve="simulationRun.poiseCurve"
            :enemy-health-label="t('nextTimeline.simGuide.enemyHp')"
            :poise-label="t('nextTimeline.simGuide.poise')"
            :timeline-width="timelineWidth"
            :duration-frames="scenario.battle.durationFrames"
            :prep-frames="scenario.battle.prepFrames"
            :px-per-frame="pxPerFrame"
            :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
            :scroll-left="timelineScrollLeft"
          />
        </div>
        <div v-else class="simulation-panel__empty">—</div>
      </section>
      <div v-else class="empty-panel">{{ tool }}</div>
    </template>
    <template #right="{ tool }">
      <TimelineActionInspector
        v-if="tool === 'inspector'"
        :cast="selectedCastModel?.cast ?? null"
        :label="selectedCastModel?.label ?? ''"
        :skill-type="selectedCastModel?.skillType ?? null"
        :edited="selectedCastModel?.edited ?? false"
        :diff-count="selectedCastModel?.diffCount ?? 0"
        :template-definition="selectedCastModel?.templateDefinition ?? null"
        :current-definition="selectedCastModel?.currentDefinition ?? null"
        @edit-definition="showSkillDefinitionEditor = true"
        @reset-definition="resetSelectedCastDefinition"
        @set-camera-target-angle="setSelectedCastCameraTargetAngle"
      />
      <div v-else class="empty-panel">{{ tool }}</div>
    </template>
  </TimelineWorkbenchShell>
  <TimelineActionContextMenu
    :visible="contextMenuTarget !== null"
    :x="contextMenuTarget?.x ?? 0"
    :y="contextMenuTarget?.y ?? 0"
    :label="selectedCastModel?.label ?? ''"
    :locked="selectedCastModel?.cast.presentation?.locked ?? false"
    :disabled="selectedCastModel?.cast.presentation?.disabled ?? false"
    :color="selectedCastModel?.cast.presentation?.color ?? null"
    @close="contextMenuTarget = null"
    @copy="copyContextSelection"
    @delete="deleteContextCast"
    @toggle-lock="toggleContextCastField('locked')"
    @toggle-disabled="toggleContextCastField('disabled')"
    @set-color="setContextCastColor"
  />
  <OperatorSelectionDialog
    :visible="operatorDialogTrack !== null"
    :operators="editorGameDataRepository.getOperators()"
    :selected-slugs="
      viewModel.tracks.flatMap(track => (track.operatorSlug === null ? [] : [track.operatorSlug]))
    "
    @close="operatorDialogTrack = null"
    @select="selectOperator"
    @clear="clearOperator"
  />
  <WeaponSelectionDialog
    :visible="weaponDialogTrack !== null"
    :weapons="selectableWeapons"
    :selected-slug="selectedWeaponSlug"
    :labels="{
      title: t('nextTimeline.weaponDialog.title'),
      searchPlaceholder: t('nextTimeline.weaponDialog.searchPlaceholder'),
      unequip: t('common.unequip'),
      close: t('common.close'),
      empty: t('nextTimeline.weaponDialog.empty'),
      partialSupport: t('nextTimeline.weaponDialog.partialSupport'),
    }"
    @close="weaponDialogTrack = null"
    @select="selectWeapon"
    @clear="clearWeapon"
  />
  <GearSelectionDialog
    :visible="gearDialogTarget !== null"
    :gears="selectableGears"
    :selected-slug="selectedGearSlug"
    :selected-artificing-levels="selectedGearBuild?.artificingLevels ?? []"
    :active-slot-key="gearDialogTarget?.slot ?? 'armor'"
    :gear-set-names="gearSetNames"
    :labels="{
      title: t('timelineGrid.equipmentDialog.title', {
        slot: t(`timelineGrid.equipmentSlot.${gearDialogTarget?.slot ?? 'armor'}`),
      }),
      searchPlaceholder: t('timelineGrid.equipmentDialog.searchPlaceholder'),
      unequip: t('common.unequip'),
      close: t('common.close'),
      empty: t('timelineGrid.equipmentDialog.empty'),
      partialSupport: t('nextTimeline.gearDialog.partialSupport'),
      defense: t('nextTimeline.gearDialog.defense'),
      noSet: t('nextTimeline.gearDialog.noSet'),
    }"
    @close="gearDialogTarget = null"
    @select="selectGear"
    @clear="clearGear"
    @change-refine-tier="changeGearRefineTier"
  />
  <NextWeaponBuildDialog
    :visible="showWeaponBuildDialog"
    :weapon="selectedLoadoutModel.weapon"
    :custom-definition="selectedWeaponCustomDefinition"
    @update:visible="showWeaponBuildDialog = $event"
    @change="updateWeaponBuild"
    @edit-definition="openWeaponDefinitionWorkspace"
  />
  <WeaponDefinitionWorkspaceDialog
    v-if="selectedWeaponBaseDefinition && selectedWeaponCustomDefinition"
    :visible="showWeaponDefinitionWorkspace"
    :base-definition="selectedWeaponBaseDefinition"
    :custom-definition="selectedWeaponCustomDefinition"
    @update:visible="showWeaponDefinitionWorkspace = $event"
    @save="saveWeaponDefinition"
    @reset="resetWeaponDefinition"
  />
  <NextOperatorBuildDialog
    :visible="showOperatorBuildDialog"
    :operator="selectedLoadoutModel.operator"
    :custom-definition="selectedOperatorCustomDefinition"
    @update:visible="showOperatorBuildDialog = $event"
    @change="updateOperatorBuild"
    @edit-definition="openOperatorDefinitionWorkspace"
  />
  <OperatorDefinitionWorkspaceDialog
    v-if="selectedOperatorBaseDefinition"
    :visible="showOperatorDefinitionWorkspace"
    :base-definition="selectedOperatorBaseDefinition"
    :custom-definition="selectedOperatorCustomDefinition"
    :common-ability-entity-definitions="commonAbilityEntityDefinitions"
    :skill-level="selectedOperatorDefinitionSkillLevel"
    @update:visible="showOperatorDefinitionWorkspace = $event"
    @save="saveOperatorDefinition"
    @reset="resetOperatorDefinition"
  />
  <NextGearLoadoutBuildDialog
    :visible="showGearBuildDialog"
    :gears="selectedLoadoutModel.gears"
    :custom-definition-slugs="customGearDefinitionSlugs"
    :gear-set-names="gearSetNames"
    :gear-set-text-slugs="gearSetTextSlugs"
    @update:visible="showGearBuildDialog = $event"
    @update="updateGearBuild"
    @edit-definition="openGearDefinitionWorkspace"
  />
  <GearDefinitionWorkspaceDialog
    v-if="selectedGearBaseDefinition && selectedGearCustomDefinition"
    :visible="gearDefinitionWorkspaceSlot !== null"
    :base-definition="selectedGearBaseDefinition"
    :custom-definition="selectedGearCustomDefinition"
    :gear-set-ids="gearSetIds"
    @update:visible="gearDefinitionWorkspaceSlot = $event ? gearDefinitionWorkspaceSlot : null"
    @save="saveGearDefinition"
    @reset="resetGearDefinition"
    @edit-gear-set="openGearSetDefinitionWorkspace"
  />
  <GearSetDefinitionWorkspaceDialog
    v-if="selectedGearSetBaseDefinition && selectedGearSetCustomDefinition"
    :visible="gearSetDefinitionWorkspaceId !== null"
    :base-definition="selectedGearSetBaseDefinition"
    :custom-definition="selectedGearSetCustomDefinition"
    @update:visible="gearSetDefinitionWorkspaceId = $event ? gearSetDefinitionWorkspaceId : null"
    @save="saveGearSetDefinition"
    @reset="resetGearSetDefinition"
  />
  <NextOperatorPanelDialog
    :visible="panelDialogTrack !== null"
    :panel="selectedPanel"
    :operator="panelDialogOperator"
    :operator-name="panelDialogOperatorName"
    @update:visible="setPanelDialogVisible"
  />
  <SkillDefinitionEditorDialog
    :visible="showSkillDefinitionEditor"
    :title="selectedCastModel?.label ?? ''"
    :template-definition="selectedCastModel?.templateDefinition ?? null"
    :custom-definition="selectedCastModel?.cast.customDefinition"
    :skill-level="selectedCastModel?.skillLevel ?? 1"
    :ability-entity-ids="selectedCastAbilityEntityIds"
    @update:visible="showSkillDefinitionEditor = $event"
    @save="saveSelectedCastDefinition"
    @reset="resetSelectedCastDefinition"
  />
  <TimelineHitDetailDialog
    :visible="hitDetailTarget !== null"
    :title="hitDetailTitle"
    :entries="hitDetail?.entries ?? []"
    :damage-type-label="damageElementLabel"
    :reaction-label="reactionName"
    :outcome-label="inflictionOutcomeLabel"
    :labels="{
      dialogTitle: t('hitDetail.title'),
      context: t('hitDetail.context'),
      result: t('hitDetail.result'),
      multipliers: t('hitDetail.multipliers'),
      effects: `${t('nextTimeline.hitDetail.element')} / ${t('nextTimeline.hitDetail.reaction')}`,
      frame: t('nextTimeline.hitDetail.frame'),
      damage: t('nextTimeline.hitDetail.damage'),
      actualDamage: t('nextTimeline.hitDetail.actualDamage'),
      remainingHealth: t('nextTimeline.hitDetail.remainingHealth'),
      damageType: t('nextTimeline.hitDetail.damageType'),
      isCritical: t('nextTimeline.hitDetail.isCritical'),
      criticalMultiplier: t('nextTimeline.hitDetail.criticalMultiplier'),
      defenseMultiplier: t('nextTimeline.hitDetail.defenseMultiplier'),
      resistanceMultiplier: t('nextTimeline.hitDetail.resistanceMultiplier'),
      element: t('nextTimeline.hitDetail.element'),
      outcome: t('nextTimeline.hitDetail.outcome'),
      reaction: t('nextTimeline.hitDetail.reaction'),
      reactionConsumed: t('nextTimeline.hitDetail.reactionConsumed'),
      level: t('nextTimeline.hitDetail.level'),
      close: t('common.close'),
    }"
    @close="hitDetailTarget = null"
  />
</template>

<style scoped>
.project-file-input {
  display: none;
}

button {
  height: 28px;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-soft);
  color: inherit;
  padding: 0 9px;
  font: inherit;
  cursor: pointer;
}

button:hover:not(:disabled) {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.skill-sidebar {
  height: 100%;
  min-height: 0;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
}

.operator-heading {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 18px;
  text-align: left;
}

.operator-heading__mark {
  width: 4px;
  height: 18px;
  background: var(--ea-gold);
}

.sidebar-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.sidebar-tabs button.active {
  color: var(--ea-gold);
  border-color: var(--ea-gold);
}

.library-heading {
  display: flex;
  justify-content: space-between;
  margin: 22px 4px 10px;
  color: var(--ea-fg-muted);
  font-size: 12px;
}

.skill-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.timeline-workspace,
.timeline-scroll {
  min-width: 0;
  min-height: 0;
}

.timeline-workspace {
  width: 100%;
  height: 100%;
}

.timeline-marquee {
  position: fixed;
  z-index: 100;
  box-sizing: border-box;
  border: 1px solid var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 14%, transparent);
  pointer-events: none;
}

.timeline-scroll {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.timeline-scroll.is-panning {
  cursor: grabbing;
  user-select: none;
}

.timeline-surface {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background-image: linear-gradient(to right, var(--ea-grid-line) 1px, transparent 1px);
  background-size: 60px 100%;
}

.corner-placeholder {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 12;
  width: 180px;
  height: 76px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 5px 8px;
  border-right: 1px solid var(--ea-border);
  border-bottom: 1px solid var(--ea-border);
  background: var(--ea-workbench-header);
}

.timeline-ruler {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-top: -76px;
  margin-left: 180px;
}

.cursor-guide {
  position: absolute;
  top: 76px;
  bottom: 0;
  width: 1px;
  background: color-mix(in srgb, var(--ea-gold) 80%, transparent);
  box-shadow: 0 0 6px var(--ea-gold);
  z-index: 9;
  pointer-events: none;
}

.cursor-guide-label {
  width: fit-content;
  padding: 3px 6px;
  border: 1px solid var(--ea-border);
  background: var(--ea-tooltip-bg);
  color: var(--ea-fg);
  box-shadow: 0 2px 8px var(--ea-shadow);
  white-space: pre;
  font-family: monospace;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
}

.simulation-panel {
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.simulation-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--ea-border-soft);
  font-size: 11px;
}

.simulation-status__item--running {
  color: var(--ea-gold);
}

.simulation-status__item--muted {
  color: var(--ea-fg-muted);
}

.simulation-status__item--error {
  color: #f5222d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.simulation-status__button {
  margin-left: auto;
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-soft);
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.simulation-curves {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.simulation-panel__empty {
  flex: 1;
  display: grid;
  place-items: center;
  color: var(--ea-fg-muted);
}

.track-row {
  position: relative;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  height: 160px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.track-identity {
  position: sticky;
  left: 0;
  z-index: 6;
}

.track-lane {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.track-lane::before {
  content: '';
  position: absolute;
  z-index: 0;
  top: 53px;
  right: 0;
  left: 0;
  height: 54px;
  box-sizing: border-box;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  background: var(--ea-grid-wash, rgba(255, 255, 255, 0.025));
  pointer-events: none;
}

.track-row.selected .track-lane::before {
  border-color: var(--ea-border-strong);
  border-style: dashed;
}

.prep-zone {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--ea-prep-fill);
  pointer-events: none;
}

.battle-start-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--ea-mark-strong);
  pointer-events: none;
}

.empty-panel {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--ea-fg-muted);
  font-size: 12px;
}
</style>
