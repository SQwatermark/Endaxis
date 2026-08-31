<script setup lang="ts">
import { computed, nextTick, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAppearance } from '../../../composables/useAppearance';
import { createLegacyProjectImporter } from '../../application/legacy/legacyProjectImporter';
import { ALL_GAME_TEXT_FAMILIES, setLocale } from '../../../i18n';
import {
  getEnemyGameName,
  getGearPieceGameName,
  getGearSetGameName,
  getOperatorCombatSkillName,
  getOperatorGameName,
  getWeaponGameName,
} from '../legacy/legacyGameText';
import SkillLibraryCard from './components/SkillLibraryCard.vue';
import {
  createLibraryDragGhost,
  getDefaultLibraryDragOffsets,
  removeLibraryDragGhost,
} from '../../../utils/libraryDragGhost';
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
import TimelineExternalEventInspector from './components/TimelineExternalEventInspector.vue';
import TimelineDocumentMarkerInspector from './components/TimelineDocumentMarkerInspector.vue';
import SkillDefinitionEditorDialog from './components/SkillDefinitionEditorDialog.vue';
import TimelineCornerToolbar from './components/TimelineCornerToolbar.vue';
import TimelineConnectionLayer from './components/TimelineConnectionLayer.vue';
import TimelineCursorGuide, {
  type TimelineCursorGaugeRow,
} from './components/TimelineCursorGuide.vue';
import TimelineHeaderToolbar from './components/TimelineHeaderToolbar.vue';
import TimelineRuler from './components/TimelineRuler.vue';
import TimelineTrackHeader from './components/TimelineTrackHeader.vue';
import TimelineWorkbenchShell from './components/TimelineWorkbenchShell.vue';
import TimelineResourceCurves from './components/TimelineResourceCurves.vue';
import TimelineTrackGauge from './components/TimelineTrackGauge.vue';
import TimelineTimeDilationBands from './components/TimelineTimeDilationBands.vue';
import TimelineEnemyEffects from './components/TimelineEnemyEffects.vue';
import TimelineBuffBands from './components/TimelineBuffBands.vue';
import {
  projectTimelineTrackEffectLayout,
  resizeTimelineTrackPair,
  TIMELINE_TRACK_BASE_HEIGHT,
  TIMELINE_TRACK_MIN_HEIGHT,
} from './timelineTrackEffectLayout';
import TimelineComboWindowBands from './components/TimelineComboWindowBands.vue';
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
import { resolveTimelineWheelIntent } from './timelineWheel';
import { projectActiveGearSetLabels } from './activeGearSetHint';
import { passedTimelineDragThreshold } from './timelineDragThreshold';
import { projectTimelineEdgeAutoScrollDelta } from './timelineEdgeAutoScroll';
import { projectEnemyEffectViz } from '../../core/projection/enemyEffectViz';
import { projectComboWindowTimelineViz } from '../../core/projection/comboWindowTimelineViz';
import { projectSkillCooldownTimelineViz } from '../../core/projection/skillCooldownTimelineViz';
import { projectSkillEnhancementTimelineViz } from '../../core/projection/skillEnhancementTimelineViz';
import { projectCombatStatusIndicators } from '../../core/projection/combatStatusIndicators';
import { resolveControlTimeline } from '../../core/project/resolveControlTimeline';
import { resolveControlledOperator } from '../../core/combat/runtime/operatorControlTimeline';
import {
  layoutBuffTimelineSegments,
  projectBuffTimelineViz,
  type BuffTimelineSegment,
  type PositionedBuffTimelineSegment,
} from '../../core/projection/buffTimelineViz';
import type { OperatorUltimateEnergyCurve } from '../../core/projection/resourceCurves';
import {
  PROJECT_FPS,
  type EndaxisProjectDocument,
  type EditableBarDocument,
  type ExternalCombatEventDocument,
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
import { downloadProjectJson } from './downloadProjectJson';
import { nextGameDataRepository } from '../../data/gameDataRepository';
import { skillSettings } from '../../data/combat/skillSettings';
import { diffSkillDefinition } from '../../core/game-data/diffSkillDefinition';
import { resolveSkillTemplateDefinition } from '../../core/compiler/resolveSkillDefinition';
import type {
  OperatorDefinition,
  SkillDefinition,
  SkillType,
} from '../../core/game-data/operatorDefinition';
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
  clearTimelineEditorSelection,
  createTimelineEditorSelection,
  selectTimelineActionsIdentity,
  selectTimelineMarkerIdentity,
  selectTimelineTrackIdentity,
  type TimelineMarkerKind,
} from './timelineEditorSelection';
import {
  copyTimelineActions,
  pasteTimelineActions,
  type TimelineActionClipboard,
} from './timelineClipboard';
import {
  moveSkillCasts,
  moveSkillCast,
  swapTimelineTracks,
  setSkillCastLocked,
  setSkillCastDisabled,
  setSkillCastColor,
  setSkillCastCustomBars,
  setSkillCastCameraTargetAngle,
  setSkillCastForcedCritical,
  setSkillCastCustomDefinition,
  resetSkillCastToTemplate,
  updateBattleResourceRule,
  setBattleDurationFrames,
  setBattlePrepFrames,
  setGlobalOperatorStatModifiers,
  type EditableBattleResourceRule,
  updateTrackInitialUltimateEnergy,
  applyInitialUltimateEnergyPreset,
  resolveInitialUltimateEnergyPresetMode,
  setUnifiedInitialUltimateEnergy,
  type TrackGearSlot,
  addCycleBoundary,
  moveCycleBoundary,
  removeCycleBoundary,
  addControlSwitch,
  moveControlSwitch,
  setControlSwitchTrack,
  removeControlSwitch,
  addExternalEventMarker,
  moveExternalEventMarker,
  updateExternalEventMarker,
  removeExternalEventMarker,
  setSimulationRangeBoundary,
  clearSimulationRangeBoundary,
} from './timelineDocumentCommands';
import {
  isKeyboardShortcutIsolationTarget,
  useKeyboardShortcutScope,
} from '../keyboard/keyboardShortcutRouter';
import {
  skillLibrarySegmentLabel,
  timelineSkillSegmentLabel,
  type TimelineSkillSegmentLabels,
} from './timelineSkillLabels';
import {
  MAX_PROJECT_SCENARIOS,
  addProjectScenario,
  deleteActiveScenario,
  duplicateActiveScenario,
  renameActiveScenario,
  scenariosDependingOn,
  switchProjectScenario,
} from './scenarioProjectCommands';
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
import {
  resolveTimelineCastAlignmentFrame,
  type TimelineCastAlignmentMode,
} from './timelineCastAlignment';
import { normalizeTimelineZoomPercent, timelinePxPerFrame } from './timelineZoom';
import type { TimelineOperationMarkerInput } from './timelineOperationMarkers';
import { projectPerfectComboCastIds } from './timelinePerfectComboEvidence';
import {
  canCreateSkillCastConnection,
  createSkillCastConnection,
  createDamageHitConnection,
  removeTimelineConnection,
  updateTimelineConnection,
  type TimelineConnectionPort,
  type UpdateTimelineConnectionInput,
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
import NextDamageAnalysisDialog from './components/NextDamageAnalysisDialog.vue';
import NextBattleLogPanel from './components/NextBattleLogPanel.vue';
import TimelineShortcutHelpDialog from './components/TimelineShortcutHelpDialog.vue';
import TimelineMarkerContextMenu from './components/TimelineMarkerContextMenu.vue';
import { projectTimelineDamageAnalysis } from './timelineDamageAnalysis';
import {
  NEXT_TIMELINE_VIEW_LAYER_IDS,
  normalizeNextTimelineViewLayers,
  toggleNextTimelineViewLayer,
  type NextTimelineViewLayerId,
} from './timelineViewLayers';
import {
  normalizeTimelineOperatorEffectsVisibility,
  toggleTimelineOperatorEffectsVisibility,
} from './timelineOperatorEffectsVisibility';
import {
  ABILITY_ENTITY_SAMPLE_CAST_ID,
  ABILITY_ENTITY_SAMPLE_TRACK_INDEX,
  createTimelineSampleScenario,
} from './timelineSampleScenario';

const { t, locale } = useI18n({ useScope: 'global' });
const { appearance, setAppearance } = useAppearance();
const TIMELINE_TRACK_HEADER_WIDTH = 180;
const TIMELINE_RULER_HEIGHT = 76;
/** 拖动投影以约 30Hz 更新；技能块本身仍逐 pointermove 跟手。 */
const LIVE_SIMULATION_RATE_HZ = 30;
const LIVE_SIMULATION_INTERVAL_MS = 1000 / LIVE_SIMULATION_RATE_HZ;
const timelineZoomPercent = ref(100);
const pxPerFrame = computed(() => timelinePxPerFrame(timelineZoomPercent.value));
const showCursorGuide = ref(false);
const boxSelectEnabled = ref(false);
const connectionToolEnabled = ref(false);
const BUFF_LAYOUT_STORAGE_KEY = 'endaxis-next:timeline-buff-layout:v1';
const TRACK_HEIGHTS_STORAGE_KEY = 'endaxis-next:timeline-compact-track-heights:v1';
const buffLayoutMode = ref<'compact' | 'loose'>(
  window.localStorage.getItem(BUFF_LAYOUT_STORAGE_KEY) === 'loose' ? 'loose' : 'compact',
);
watch(buffLayoutMode, mode => window.localStorage.setItem(BUFF_LAYOUT_STORAGE_KEY, mode));
function loadCompactTrackHeights(): readonly number[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(TRACK_HEIGHTS_STORAGE_KEY) ?? '[]',
    );
    if (!Array.isArray(parsed) || parsed.length !== 4) throw new Error('invalid track heights');
    return parsed.map(value =>
      typeof value === 'number' && Number.isFinite(value)
        ? Math.max(TIMELINE_TRACK_MIN_HEIGHT, Math.round(value))
        : TIMELINE_TRACK_BASE_HEIGHT,
    );
  } catch {
    return Array.from({ length: 4 }, () => TIMELINE_TRACK_BASE_HEIGHT);
  }
}
const compactTrackHeights = ref(loadCompactTrackHeights());
watch(compactTrackHeights, heights =>
  window.localStorage.setItem(TRACK_HEIGHTS_STORAGE_KEY, JSON.stringify(heights)),
);
const VIEW_LAYERS_STORAGE_KEY = 'endaxis-next:timeline-view-layers:v1';
function loadTimelineViewLayers() {
  try {
    const raw = window.localStorage.getItem(VIEW_LAYERS_STORAGE_KEY);
    return normalizeNextTimelineViewLayers(raw === null ? null : JSON.parse(raw));
  } catch {
    return normalizeNextTimelineViewLayers(null);
  }
}
const timelineViewLayers = ref(loadTimelineViewLayers());
watch(
  timelineViewLayers,
  layers => window.localStorage.setItem(VIEW_LAYERS_STORAGE_KEY, JSON.stringify(layers)),
  { deep: true },
);
function toggleTimelineViewLayer(layerId: NextTimelineViewLayerId): void {
  timelineViewLayers.value = toggleNextTimelineViewLayer(timelineViewLayers.value, layerId);
}
const OPERATOR_EFFECTS_STORAGE_KEY = 'endaxis-next:timeline-operator-effects:v1';
function loadTimelineOperatorEffectsVisibility() {
  try {
    const raw = window.localStorage.getItem(OPERATOR_EFFECTS_STORAGE_KEY);
    return normalizeTimelineOperatorEffectsVisibility(raw === null ? null : JSON.parse(raw));
  } catch {
    return normalizeTimelineOperatorEffectsVisibility(null);
  }
}
const operatorEffectsVisibility = ref(loadTimelineOperatorEffectsVisibility());
watch(operatorEffectsVisibility, visibility =>
  window.localStorage.setItem(OPERATOR_EFFECTS_STORAGE_KEY, JSON.stringify(visibility)),
);
function isOperatorEffectsVisible(trackIndex: TrackIndex): boolean {
  return operatorEffectsVisibility.value[trackIndex] !== false;
}
function toggleOperatorEffectsVisibility(trackIndex: number): void {
  if (!Number.isInteger(trackIndex) || trackIndex < 0 || trackIndex > 3) return;
  operatorEffectsVisibility.value = toggleTimelineOperatorEffectsVisibility(
    operatorEffectsVisibility.value,
    trackIndex as TrackIndex,
  );
}
async function selectTimelineLocale(next: 'zh-CN' | 'en' | 'ru'): Promise<void> {
  if (locale.value === next) return;
  await setLocale(next, ALL_GAME_TEXT_FAMILIES);
}
const timelineSelection = shallowRef(
  createTimelineEditorSelection(ABILITY_ENTITY_SAMPLE_TRACK_INDEX, {
    selectedIds: new Set([ABILITY_ENTITY_SAMPLE_CAST_ID]),
    primaryId: ABILITY_ENTITY_SAMPLE_CAST_ID,
  }),
);
const selectedTrack = computed<TrackIndex>({
  get: () => timelineSelection.value.activeTrackIndex,
  set: trackIndex => {
    timelineSelection.value = selectTimelineTrackIdentity(timelineSelection.value, trackIndex);
  },
});
const actionSelection = computed(() => timelineSelection.value.actions);
const selectedCastId = computed(() => actionSelection.value.primaryId);
const showSkillDefinitionEditor = ref(false);
const showDamageAnalysis = ref(false);
const showShortcutHelp = ref(false);
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
const hoveredCastId = ref<string | null>(null);
const timelineClipboard = shallowRef<TimelineActionClipboard | null>(null);
const projectFileInput = ref<HTMLInputElement | null>(null);
const cursorFrame = ref(30);
const cursorGuide = ref<{ leftPx: number; sampleFrame: number } | null>(null);
const snapFrames = ref<number>(PRECISE_TIMELINE_SNAP_FRAMES);
const timelineSurface = ref<HTMLElement | null>(null);
const timelineScroll = ref<HTMLElement | null>(null);
const timelineHorizontalScrollbar = ref<HTMLElement | null>(null);
const timelineScrollLeft = ref(0);
const timelineViewportWidth = ref(1200);
const timelineVerticalScrollbarWidth = ref(0);
let timelineResizeObserver: ResizeObserver | null = null;
const connectionDrag = ref<{
  skillCastId: string;
  port: TimelineConnectionPort;
  pointer: { x: number; y: number };
} | null>(null);
type TimelineDragPayload =
  | {
      kind: 'librarySkill';
      entryKey: string;
      skillGroupKey: string;
      variantKey?: string;
      skillKey?: string;
      dragOffsetX: number;
    }
  | { kind: 'trackOrder'; trackIndex: TrackIndex };

const dragPayload = ref<TimelineDragPayload | null>(null);
const trackOrderDropTarget = ref<TrackIndex | null>(null);
interface TimelineLibraryPlacement {
  readonly entryKey: string;
  readonly skillGroupKey: string;
  readonly skillType: SkillType;
  readonly variantKey?: string;
  readonly skillKey?: string;
}
const libraryPlacement = ref<TimelineLibraryPlacement | null>(null);
const placementPointer = ref<{ x: number; y: number } | null>(null);
const alignmentGuide = ref<{
  readonly targetCastId: string;
  readonly left: number;
  readonly top: number;
  readonly height: number;
  readonly mode: TimelineCastAlignmentMode;
  readonly label: string;
  readonly color: string;
} | null>(null);
interface TimelineCastMoveGesture {
  readonly pointerId: number;
  readonly trackIndex: TrackIndex;
  readonly skillCastId: string;
  readonly skillCastIds: readonly string[];
  readonly pointerOffsetActualFrames: number;
  readonly initialPointerX: number;
  readonly initialPointerY: number;
  latestPointerX: number;
  latestPointerY: number;
  /** 按下时已发布的实际开始帧，只用于平移该技能自己的时间膨胀预览。 */
  readonly anchorActualFrame: number;
  readonly baseScenario: ScenarioDocument;
  previewFrame: number;
  previewActualFrame: number;
  /** 松手后保留预览，直到对应场景的新模拟快照发布。 */
  readonly committed: boolean;
  dragStarted: boolean;
  moved: boolean;
}
const castMoveGesture = shallowRef<TimelineCastMoveGesture | null>(null);
let stopCastMoveGesture: (() => void) | null = null;
let castMoveAutoScrollFrame: number | null = null;
let lastCastMoveSimulationAt = 0;
let suppressedCastClickId: string | null = null;
const contextMenuTarget = ref<{
  x: number;
  y: number;
  trackIndex: TrackIndex;
  skillCastId: string;
} | null>(null);
const selectedMarker = computed<{ kind: TimelineMarkerKind; id: string } | null>({
  get: () => {
    const primary = timelineSelection.value.primary;
    return primary.kind === 'marker' ? { kind: primary.markerKind, id: primary.id } : null;
  },
  set: marker => {
    timelineSelection.value =
      marker === null
        ? clearTimelineEditorSelection(timelineSelection.value)
        : selectTimelineMarkerIdentity(timelineSelection.value, marker.kind, marker.id);
  },
});
const markerContextTarget = ref<{
  x: number;
  y: number;
  frame: number;
  trackIndex: TrackIndex;
  existing?: { kind: TimelineMarkerKind; id: string; label: string };
} | null>(null);
const markerMoveGesture = shallowRef<{
  pointerId: number;
  initialPointerX: number;
  initialPointerY: number;
  dragStarted: boolean;
  kind: TimelineMarkerKind;
  id: string;
  initialFrame: number;
  previewFrame: number;
} | null>(null);
let stopMarkerMove: (() => void) | null = null;

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
const projectRevision = ref(0);
const projectScenarios = computed(() => {
  projectRevision.value;
  return projectSession.snapshot.project.scenarios;
});
const activeProjectScenarioId = computed(() => {
  projectRevision.value;
  return projectSession.snapshot.project.activeScenarioId;
});
const damageAnalysis = computed(() =>
  projectTimelineDamageAnalysis(
    simulationRun.value?.receiptEntries ?? [],
    scenario.value,
    trackIndex => {
      const track = viewModel.value.tracks[trackIndex];
      return track === undefined ? `Operator ${trackIndex + 1}` : operatorName(track.operatorSlug);
    },
    damageElementLabel,
  ),
);
const ids = createProjectDocumentIdAllocator(() => projectSession.snapshot.project);
const savedProjectSnapshot = shallowRef(initialProject);
const projectDirty = ref(false);
const scenario = shallowRef(scenarioSession.snapshot.scenario);
const timelinePrepPreviewFrames = ref<number | null>(null);
const displayedTimelinePrepFrames = computed(
  () => timelinePrepPreviewFrames.value ?? scenario.value.battle.prepFrames,
);
let stopTimelinePrepResize: (() => void) | null = null;
const canUndo = ref(scenarioSession.canUndo);
const canRedo = ref(scenarioSession.canRedo);
const unsubscribeScenarioSession = scenarioSession.subscribe(snapshot => {
  scenario.value = snapshot.scenario;
  canUndo.value = scenarioSession.canUndo;
  canRedo.value = scenarioSession.canRedo;
  if (timelineSelection.value.primary.kind === 'actions') {
    applyActionSelection(
      reconcileTimelineActionSelection(actionSelection.value, snapshot.scenario),
    );
  }
});
const unsubscribeProjectSession = projectSession.subscribe(snapshot => {
  projectRevision.value = snapshot.revision;
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
  finishCompactTrackResize();
  cancelConnectionDrag();
  cancelCastMove();
  stopMarkerMove?.();
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
  return '无法打开项目';
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
  const editingProject = projectSession.snapshot.project;
  try {
    const result = openProject(await file.text(), {
      gameDataRepository: nextGameDataRepository,
      legacyImporter: createLegacyProjectImporter(nextGameDataRepository),
    });
    if (projectSession.snapshot.project !== editingProject)
      throw new Error('读取文件期间当前项目已变化，请重新加载');
    if (!result.ok) {
      ElMessage.error(projectOpenFailureMessage(result));
      return;
    }
    await acceptOpenedProject(result.project, result.gameDataRevisionUpdated);
    if (result.migrationWarnings !== undefined) {
      ElMessage.warning({
        message: `旧项目已迁移，但有 ${result.migrationWarnings.length} 项输入未能完整保留：${result.migrationWarnings[0]}`,
        duration: 8000,
        showClose: true,
      });
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '打开项目失败');
  }
}

async function acceptOpenedProject(
  project: EndaxisProjectDocument,
  gameDataRevisionUpdated: boolean,
): Promise<void> {
  showSkillDefinitionEditor.value = false;
  showOperatorDefinitionWorkspace.value = false;
  showWeaponDefinitionWorkspace.value = false;
  gearDefinitionWorkspaceSlot.value = null;
  gearSetDefinitionWorkspaceId.value = null;
  projectSession.replaceProject(project);
  if (!gameDataRevisionUpdated) savedProjectSnapshot.value = project;
  projectDirty.value = gameDataRevisionUpdated;
  selectedTrack.value = 0;
  clearTimelineSelection();
  timelineClipboard.value = null;
  simulationService.clearCache();
  await nextTick();
  void simulateNow();
  ElMessage.success(
    gameDataRevisionUpdated
      ? '已按最新游戏数据打开，请重新导出项目。原文件未修改。'
      : `已打开项目：${scenarioSession.snapshot.scenario.name}`,
  );
}

function exportProject(): void {
  try {
    const project = projectSession.snapshot.project;
    const content = serializeProjectDocument(project, true);
    const activeScenario = project.scenarios.find(value => value.id === project.activeScenarioId);
    const fileBase = (activeScenario?.name ?? project.activeScenarioId)
      .replace(/[^A-Za-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    downloadProjectJson(content, `${fileBase || 'endaxis-project'}.json`);
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
const initialUltimateEnergyPresetMode = computed(() =>
  resolveInitialUltimateEnergyPresetMode(scenario.value),
);
const maximumUltimateEnergyByTrack = computed(() =>
  viewModel.value.tracks.map(track => track.maxUltimateEnergy),
);
const selectedTrackModel = computed(() => viewModel.value.tracks[selectedTrack.value]!);
const placementLibraryEntry = computed(() => {
  const placement = libraryPlacement.value;
  if (placement === null) return null;
  return (
    selectedTrackModel.value.skillLibrary.find(entry => entry.entryKey === placement.entryKey) ??
    null
  );
});
const placementLabel = computed(() => {
  const entry = placementLibraryEntry.value;
  const placement = libraryPlacement.value;
  if (entry === null || placement === null) return '';
  if (placement.skillKey !== undefined) {
    return (
      skillLibrarySegmentLabel(entry, placement.skillKey, skillSegmentLabels()) ??
      skillName(placement.skillKey, selectedTrackModel.value.operatorSlug)
    );
  }
  return skillLibraryEntryName(entry);
});
watch(selectedTrack, () => {
  const placement = libraryPlacement.value;
  if (placement === null) return;
  const replacement = selectedTrackModel.value.skillLibrary.find(
    entry =>
      entry.skillType === placement.skillType &&
      entry.variantKey === undefined &&
      entry.placementSkillKey === undefined,
  );
  if (replacement === undefined) {
    libraryPlacement.value = null;
    placementPointer.value = null;
    return;
  }
  libraryPlacement.value = {
    entryKey: replacement.entryKey,
    skillGroupKey: replacement.skillGroupKey,
    skillType: replacement.skillType,
    ...(replacement.variantKey === undefined ? {} : { variantKey: replacement.variantKey }),
  };
});
const battleLogCastOwners = computed(() =>
  viewModel.value.tracks.flatMap(track =>
    track.skillCasts.map(cast => ({
      castId: cast.id,
      label: timelineCastLabel(cast, track),
      operatorLabel: operatorName(track.operatorSlug),
      sourceId: track.operatorInstanceId,
    })),
  ),
);
const simulationService = new ScenarioSimulationService({
  index: editorGameDataRepository,
  repositoryRevision: nextGameDataRepository.revision,
  spellInflictionSettings: skillSettings,
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
const activeGearSetLabelsByTrack = computed(() =>
  loadoutModels.value.map(loadout =>
    projectActiveGearSetLabels(loadout, gearSetNames.value).join(' / '),
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
          ? (trackModel.skillLibrary.find(
              entry =>
                entry.skillGroupKey === source.skillGroupKey &&
                entry.skills.some(skill => skill.skillKey === source.skillKey),
            )?.level ?? 1)
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
const selectedExternalEventMarker = computed(() => {
  if (selectedMarker.value?.kind !== 'externalEvent') return null;
  return (
    (scenario.value.battle.externalEventMarkers ?? []).find(
      marker => marker.id === selectedMarker.value?.id,
    ) ?? null
  );
});
const selectedExternalEventTargetLabel = computed(() => {
  const marker = selectedExternalEventMarker.value;
  if (marker === null) return '';
  if (marker.target.scope === 'team') return t('nextTimeline.markerInspector.teamTarget');
  const track = scenario.value.tracks[marker.target.trackIndex];
  return track === null || track.operator === null
    ? t('nextTimeline.emptyTrack')
    : operatorName(track.operator.operatorSlug);
});
const selectedDocumentMarker = computed(() => {
  const selection = selectedMarker.value;
  if (selection === null || selection.kind === 'externalEvent') return null;
  if (selection.kind === 'cycleBoundary') {
    const marker = scenario.value.battle.cycleBoundaries.find(item => item.id === selection.id);
    return marker === undefined ? null : { ...marker, kind: selection.kind };
  }
  if (selection.kind === 'controlSwitch') {
    const marker = scenario.value.battle.controlSwitches.find(item => item.id === selection.id);
    return marker === undefined ? null : { ...marker, kind: selection.kind };
  }
  const frame =
    selection.kind === 'simulationStart'
      ? scenario.value.battle.simulationRange?.startFrame
      : scenario.value.battle.simulationRange?.endFrame;
  return frame === undefined ? null : { id: selection.id, kind: selection.kind, frame };
});
const occupiedTrackOptions = computed(() =>
  scenario.value.tracks.flatMap((track, index) =>
    track === null || track.operator === null
      ? []
      : [
          {
            trackIndex: index as TrackIndex,
            label: t('nextTimeline.documentMarkerInspector.trackOption', {
              index: index + 1,
              name: operatorName(track.operator.operatorSlug),
            }),
          },
        ],
  ),
);
function connectionPort(value: string | undefined, fallback: TimelineConnectionPort) {
  return value === 'top' || value === 'right' || value === 'bottom' || value === 'left'
    ? value
    : fallback;
}

function timelineCastLabelById(skillCastId: string): string {
  for (const track of viewModel.value.tracks) {
    const cast = track.skillCasts.find(candidate => candidate.id === skillCastId);
    if (cast !== undefined) return timelineCastLabel(cast, track);
  }
  return skillCastId;
}

const selectedCastConnections = computed(() => {
  const selected = selectedCastModel.value;
  if (selected === null) return [];
  return scenario.value.connections
    .filter(
      connection =>
        connection.from.skillCastId === selected.cast.id ||
        connection.to.skillCastId === selected.cast.id,
    )
    .map(connection => {
      const outgoing = connection.from.skillCastId === selected.cast.id;
      const other = outgoing ? connection.to : connection.from;
      return {
        id: connection.id,
        outgoing,
        otherLabel: timelineCastLabelById(other.skillCastId),
        targetKind: connection.to.kind,
        ...(connection.to.kind === 'damageHit' ? { targetStepKey: connection.to.stepKey } : {}),
        fromPort: connectionPort(connection.from.port, 'right'),
        toPort: connectionPort(connection.to.port, 'left'),
        consumption: connection.consumption,
      } as const;
    });
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
const selectedCastBuffIds = computed(() => {
  const selected = selectedCastModel.value;
  const common = editorGameDataRepository.getCommonBuffDefinitions?.() ?? {};
  if (selected === null) return Object.keys(common).sort();
  const track = scenario.value.tracks[selected.trackIndex];
  const operator =
    track?.operator === null || track?.operator === undefined
      ? null
      : editorGameDataRepository.getOperator(track.operator.operatorSlug);
  return Object.keys({ ...common, ...(operator?.buffDefinitions ?? {}) }).sort();
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
const perfectComboCastIds = computed(() =>
  simulationRun.value === null
    ? new Set<string>()
    : projectPerfectComboCastIds(simulationRun.value.receiptEntries),
);
const rulerOperations = computed<TimelineOperationMarkerInput[]>(() => {
  const operations: TimelineOperationMarkerInput[] = [];
  for (const track of viewModel.value.tracks) {
    for (const cast of track.skillCasts) {
      const kind =
        cast.skillType === 'battleSkill'
          ? 'skill'
          : cast.skillType === 'comboSkill'
            ? 'combo'
            : cast.skillType === 'ultimate'
              ? 'ultimate'
              : null;
      if (kind === null) continue;
      operations.push({
        id: `cast:${cast.id}`,
        kind,
        trackIndex: track.trackIndex,
        frame: castActualStartFrame(cast.id, cast.startFrame),
        ...(kind === 'combo' && perfectComboCastIds.value.has(cast.id) ? { perfect: true } : {}),
        ...(kind === 'ultimate'
          ? { durationFrames: castActualDurationFrame(cast.id, cast.durationFrames) }
          : {}),
      });
    }
  }
  for (const marker of scenario.value.battle.controlSwitches) {
    operations.push({
      id: `switch:${marker.id}`,
      kind: 'switch',
      trackIndex: marker.trackIndex,
      frame: displayedMarkerFrame('controlSwitch', marker.id, marker.frame),
    });
  }
  return operations;
});
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
  const visibleCastIds = new Set(
    viewModel.value.tracks.flatMap(track =>
      isOperatorEffectsVisible(track.trackIndex) ? track.skillCasts.map(cast => cast.id) : [],
    ),
  );
  const ids = new Set(
    [...actionSelection.value.selectedIds].filter(castId => visibleCastIds.has(castId)),
  );
  if (hoveredCastId.value !== null && visibleCastIds.has(hoveredCastId.value)) {
    ids.add(hoveredCastId.value);
  }
  return ids;
});
const timelineWidth = computed(() =>
  timelineTotalWidth(
    displayedTimelinePrepFrames.value,
    scenario.value.battle.durationFrames,
    pxPerFrame.value,
  ),
);
const timelineSurfaceStyle = computed<Record<string, string>>(() => ({
  width: `${TIMELINE_TRACK_HEADER_WIDTH + timelineWidth.value}px`,
  '--timeline-grid-step': `${PROJECT_FPS * pxPerFrame.value}px`,
  '--timeline-grid-origin': `${
    TIMELINE_TRACK_HEADER_WIDTH + displayedTimelinePrepFrames.value * pxPerFrame.value
  }px`,
}));

function updateTimelineViewportMetrics(): void {
  const viewport = timelineScroll.value;
  if (viewport === null) return;
  timelineScrollLeft.value = viewport.scrollLeft;
  timelineViewportWidth.value = viewport.clientWidth;
  timelineVerticalScrollbarWidth.value = Math.max(0, viewport.offsetWidth - viewport.clientWidth);
  const scrollbar = timelineHorizontalScrollbar.value;
  if (scrollbar !== null && Math.abs(scrollbar.scrollLeft - viewport.scrollLeft) > 0.5) {
    scrollbar.scrollLeft = viewport.scrollLeft;
  }
}

function updateTimelineHorizontalScroll(event: Event): void {
  const viewport = timelineScroll.value;
  const scrollbar = event.currentTarget as HTMLElement | null;
  if (viewport === null || scrollbar === null) return;
  if (Math.abs(viewport.scrollLeft - scrollbar.scrollLeft) > 0.5) {
    viewport.scrollLeft = scrollbar.scrollLeft;
  }
}

onMounted(() => {
  updateTimelineViewportMetrics();
  if (typeof ResizeObserver === 'undefined' || timelineScroll.value === null) return;
  timelineResizeObserver = new ResizeObserver(updateTimelineViewportMetrics);
  timelineResizeObserver.observe(timelineScroll.value);
});

onScopeDispose(() => {
  timelineResizeObserver?.disconnect();
  timelineResizeObserver = null;
});

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
  else {
    if (hoveredCastId.value === castId) hoveredCastId.value = null;
    if (alignmentGuide.value?.targetCastId === castId) alignmentGuide.value = null;
  }
}

function alignmentMode(event: PointerEvent, block: HTMLElement): TimelineCastAlignmentMode {
  const leftHalf = event.clientX < block.getBoundingClientRect().left + block.offsetWidth / 2;
  if (event.shiftKey) return leftHalf ? 'alignStart' : 'alignEnd';
  return leftHalf ? 'snapBefore' : 'snapAfter';
}

function alignmentPresentation(mode: TimelineCastAlignmentMode): {
  label: string;
  result: string;
  color: string;
} {
  if (mode === 'snapBefore') {
    return {
      label: t('timelineGrid.alignGuide.snapFront'),
      result: t('timelineGrid.alignResult.snappedFront'),
      color: '#00e5ff',
    };
  }
  if (mode === 'snapAfter') {
    return {
      label: t('timelineGrid.alignGuide.snapBack'),
      result: t('timelineGrid.alignResult.snappedBack'),
      color: '#00e5ff',
    };
  }
  if (mode === 'alignStart') {
    return {
      label: t('timelineGrid.alignGuide.alignLeft'),
      result: t('timelineGrid.alignResult.alignedLeft'),
      color: '#ff4fd8',
    };
  }
  return {
    label: t('timelineGrid.alignGuide.alignRight'),
    result: t('timelineGrid.alignResult.alignedRight'),
    color: '#ff4fd8',
  };
}

function updateAlignmentGuide(event: PointerEvent, targetCastId: string): void {
  const sourceCastId = actionSelection.value.primaryId;
  const surface = timelineSurface.value;
  const block = event.currentTarget as HTMLElement;
  if (!event.altKey || sourceCastId === null || sourceCastId === targetCastId || surface === null) {
    alignmentGuide.value = null;
    return;
  }
  const mode = alignmentMode(event, block);
  const presentation = alignmentPresentation(mode);
  const blockRect = block.getBoundingClientRect();
  const surfaceRect = surface.getBoundingClientRect();
  const useLeftEdge = mode === 'snapBefore' || mode === 'alignStart';
  alignmentGuide.value = {
    targetCastId,
    left: (useLeftEdge ? blockRect.left : blockRect.right) - surfaceRect.left,
    top: blockRect.top - surfaceRect.top,
    height: blockRect.height,
    mode,
    label: presentation.label,
    color: presentation.color,
  };
}

function alignSelectedCastToTarget(event: PointerEvent, targetCastId: string): boolean {
  const sourceCastId = actionSelection.value.primaryId;
  if (!event.altKey || sourceCastId === null || sourceCastId === targetCastId) return false;
  event.preventDefault();
  event.stopPropagation();
  const block = event.currentTarget as HTMLElement;
  const mode = alignmentMode(event, block);
  let source:
    | { trackIndex: TrackIndex; startFrame: number; durationFrames: number; locked: boolean }
    | undefined;
  let target: { startFrame: number; durationFrames: number } | undefined;
  for (const track of viewModel.value.tracks) {
    for (const cast of track.skillCasts) {
      if (cast.id === sourceCastId) {
        source = {
          trackIndex: track.trackIndex,
          startFrame: castActualStartFrame(cast.id, cast.startFrame),
          durationFrames: castActualDurationFrame(cast.id, cast.durationFrames),
          locked: cast.locked,
        };
      }
      if (cast.id === targetCastId) {
        target = {
          startFrame: castActualStartFrame(cast.id, cast.startFrame),
          durationFrames: castActualDurationFrame(cast.id, cast.durationFrames),
        };
      }
    }
  }
  if (source === undefined || target === undefined || source.locked) return true;
  const frame = resolveTimelineCastAlignmentFrame({
    mode,
    targetStartFrame: target.startFrame,
    targetDurationFrames: target.durationFrames,
    sourceDurationFrames: source.durationFrames,
    snapFrames: snapFrames.value,
    maximumFrame: scenario.value.battle.durationFrames,
  });
  const changed = commitScenario('alignSkillCast', current =>
    moveSkillCast(current, source.trackIndex, sourceCastId, frame),
  );
  alignmentGuide.value = null;
  if (changed) ElMessage.success(alignmentPresentation(mode).result);
  else ElMessage.warning(t('timelineGrid.alignResult.unchanged'));
  return true;
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
  if (reasons === undefined || reasons.length === 0) return '';
  return reasons
    .map(reason => {
      if (reason === 'resourceUnavailable') return '资源不足：时间轴仍会强制执行该技能';
      if (reason === 'cooldownUnavailable') return '技能尚在冷却：时间轴仍会强制执行该技能';
      if (reason === 'skillInputMismatch') return '该操作当前不会触发这个技能';
      if (reason.startsWith('skillInputMismatch:')) {
        const mismatch = /^skillInputMismatch: expected '(.+)', actual '(.+)'$/.exec(reason);
        return mismatch === null
          ? '操作实际会触发其他技能；时间轴仍执行已放置技能'
          : `操作实际会触发 '${mismatch[2]}'，不是已放置的 '${mismatch[1]}'；时间轴仍执行已放置技能`;
      }
      if (reason === 'skillInputUnknown') return '缺少该操作的原生技能路由证据';
      if (reason.startsWith('skillInputUnknown:'))
        return `无法确定该操作会触发哪个技能：${formatPlayerInputEvidenceDetail(reason.slice('skillInputUnknown: '.length))}`;
      if (reason === 'skillInterruptUnavailable') return '当前技能尚不能被该操作中断';
      if (reason.startsWith('skillInterruptUnavailable:'))
        return `当前技能尚不能被该操作中断（${reason.slice('skillInterruptUnavailable: '.length)}）；时间轴仍执行已放置技能`;
      if (reason === 'skillInterruptUnknown') return '缺少当前技能的中断判定证据';
      if (reason.startsWith('skillInterruptUnknown:'))
        return `无法确定当前技能能否被中断：${formatPlayerInputEvidenceDetail(reason.slice('skillInterruptUnknown: '.length))}`;
      return reason;
    })
    .join('\n');
}

function formatPlayerInputEvidenceDetail(detail: string): string {
  if (detail === 'multiple active command mappings have unresolved priority')
    return '同时生效的同优先级命令映射尚无可证明的仲裁顺序';
  if (detail === 'active command mapping has no direct skill route')
    return '当前命令映射没有直接技能路由';
  if (detail === 'current skill has conditional input actions')
    return '当前技能的输入路由位于未闭环的条件分支';
  if (detail === 'special basic-attack selection state is not modelled')
    return '处决或下落攻击所需的特殊普攻选择状态尚未建模';
  if (detail === 'current skill has no recovered interrupt boundary')
    return '当前技能缺少已恢复的不可中断边界';
  if (detail === 'current skill has conditional next-skill actions')
    return '当前技能的接续白名单位于未闭环的条件分支';
  const mappingTarget = /^command mapping target '(.+)' is not unique$/.exec(detail);
  if (mappingTarget !== null) return `命令映射目标 '${mappingTarget[1]}' 无法唯一对应到技能模板`;
  const missingDefault = /^input '(.+)' has no default skill slot$/.exec(detail);
  if (missingDefault !== null) return `操作 '${missingDefault[1]}' 没有默认技能槽位`;
  return detail;
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

/** 普通 Buff 与元素效果共用模拟回执，但分别投影，避免 UI 反推运行时状态。 */
const buffTimelineSegments = computed(() => {
  const current = simulationRun.value;
  return current === null ? [] : projectBuffTimelineViz(current.receiptEntries, current.frame);
});

/** 光标快照只消费已经生成的生命周期段，不回查或重算 Buff 运行时。 */
const combatStatusIndicators = computed(() =>
  projectCombatStatusIndicators(buffTimelineSegments.value, cursorFrame.value),
);

const controlledOperatorIdAtCursor = computed(() =>
  resolveControlledOperator(
    resolveControlTimeline(scenario.value.tracks, scenario.value.battle.controlSwitches),
    cursorFrame.value,
  ),
);

function statusIndicatorsForTarget(targetId: string | null) {
  return targetId === null
    ? []
    : combatStatusIndicators.value.filter(indicator => indicator.targetId === targetId);
}

const comboWindowSegments = computed(() => {
  const current = simulationRun.value;
  return current === null
    ? []
    : projectComboWindowTimelineViz(current.receiptEntries, current.frame);
});

const skillCooldownSegments = computed(() => {
  const current = simulationRun.value;
  return current === null
    ? []
    : projectSkillCooldownTimelineViz(current.receiptEntries, current.frame);
});

const skillEnhancementSegments = computed(() => {
  const current = simulationRun.value;
  if (current === null) return [];
  return projectSkillEnhancementTimelineViz(
    current.receiptEntries,
    current.frame,
    viewModel.value.tracks.flatMap(track =>
      track.operatorInstanceId === null
        ? []
        : track.skillCasts.flatMap(cast =>
            cast.enhancementStateBuffId === undefined
              ? []
              : [
                  {
                    castId: cast.id,
                    targetId: track.operatorInstanceId!,
                    buffId: cast.enhancementStateBuffId,
                  },
                ],
          ),
    ),
  );
});

function cooldownBarsForCast(castId: string, castStartFrame: number) {
  return skillCooldownSegments.value
    .filter(segment => segment.castId === castId)
    .map(segment => ({
      offsetFrames: segment.startFrame - castStartFrame,
      durationFrames: Math.max(0, segment.endFrame - segment.startFrame),
      completed: segment.completed,
    }))
    .filter(segment => segment.durationFrames > 0);
}

function enhancementBarsForCast(castId: string, castStartFrame: number) {
  return skillEnhancementSegments.value
    .filter(segment => segment.castId === castId)
    .map(segment => ({
      offsetFrames: segment.startFrame - castStartFrame,
      durationFrames: Math.max(0, segment.endFrame - segment.startFrame),
      completed: segment.completed,
    }))
    .filter(segment => segment.durationFrames > 0);
}

function comboWindowSegmentsFor(operatorId: string | null) {
  return operatorId === null
    ? []
    : comboWindowSegments.value.filter(segment => segment.operatorId === operatorId);
}

const positionedBuffsByTarget = computed(() => {
  const grouped = new Map<string, BuffTimelineSegment[]>();
  for (const segment of buffTimelineSegments.value) {
    const list = grouped.get(segment.targetId) ?? [];
    list.push(segment);
    grouped.set(segment.targetId, list);
  }
  const positioned = new Map<string, PositionedBuffTimelineSegment[]>();
  for (const [targetId, segments] of grouped) {
    positioned.set(targetId, [
      ...layoutBuffTimelineSegments(segments.filter(segment => segment.placement === 'upper')),
      ...layoutBuffTimelineSegments(segments.filter(segment => segment.placement === 'lower')),
    ]);
  }
  return positioned;
});

function buffSegmentsForTarget(
  targetId: string | null,
  placement?: BuffTimelineSegment['placement'],
): readonly PositionedBuffTimelineSegment[] {
  if (targetId === null) return [];
  const segments = positionedBuffsByTarget.value.get(targetId) ?? [];
  return placement === undefined
    ? segments
    : segments.filter(segment => segment.placement === placement);
}

function trackEffectLayout(trackIndex: TrackIndex, targetId: string | null) {
  const laneCount = (placement: BuffTimelineSegment['placement']): number => {
    if (targetId === null || !isOperatorEffectsVisible(trackIndex)) return 0;
    return Math.max(
      0,
      ...buffSegmentsForTarget(targetId, placement).map(segment => segment.lane + 1),
    );
  };
  return projectTimelineTrackEffectLayout({
    mode: buffLayoutMode.value,
    upperLaneCount: laneCount('upper'),
    lowerLaneCount: laneCount('lower'),
    compactHeight: compactTrackHeights.value[trackIndex],
  });
}

interface CompactTrackResizeGesture {
  readonly dividerIndex: TrackIndex;
  readonly startY: number;
  readonly initialHeights: readonly number[];
}

const compactTrackResizeGesture = ref<CompactTrackResizeGesture | null>(null);

function finishCompactTrackResize(): void {
  if (compactTrackResizeGesture.value === null) return;
  compactTrackResizeGesture.value = null;
  document.documentElement.classList.remove('is-next-track-resizing');
  window.removeEventListener('pointermove', updateCompactTrackResize);
  window.removeEventListener('pointerup', finishCompactTrackResize);
  window.removeEventListener('pointercancel', finishCompactTrackResize);
}

function updateCompactTrackResize(event: PointerEvent): void {
  const gesture = compactTrackResizeGesture.value;
  if (gesture === null) return;
  compactTrackHeights.value = resizeTimelineTrackPair(
    gesture.initialHeights,
    gesture.dividerIndex,
    event.clientY - gesture.startY,
  );
}

function beginCompactTrackResize(event: PointerEvent, dividerIndex: TrackIndex): void {
  if (
    buffLayoutMode.value !== 'compact' ||
    event.button !== 0 ||
    dividerIndex >= compactTrackHeights.value.length - 1
  ) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  finishCompactTrackResize();
  compactTrackResizeGesture.value = {
    dividerIndex,
    startY: event.clientY,
    initialHeights: compactTrackHeights.value,
  };
  document.documentElement.classList.add('is-next-track-resizing');
  window.addEventListener('pointermove', updateCompactTrackResize);
  window.addEventListener('pointerup', finishCompactTrackResize);
  window.addEventListener('pointercancel', finishCompactTrackResize);
}

function resetCompactTrackPair(dividerIndex: TrackIndex): void {
  if (dividerIndex >= compactTrackHeights.value.length - 1) return;
  const next = [...compactTrackHeights.value];
  next[dividerIndex] = TIMELINE_TRACK_BASE_HEIGHT;
  next[dividerIndex + 1] = TIMELINE_TRACK_BASE_HEIGHT;
  compactTrackHeights.value = next;
}

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

const operatorEffectsOptions = computed(() =>
  viewModel.value.tracks.flatMap(track =>
    track.operatorInstanceId === null
      ? []
      : [
          {
            trackIndex: track.trackIndex,
            name: operatorName(track.operatorSlug),
            color: gaugeColorFor(track.trackIndex),
            visible: isOperatorEffectsVisible(track.trackIndex),
          },
        ],
  ),
);
const visibleEffectTrackIndices = computed(() =>
  viewModel.value.tracks
    .filter(track => isOperatorEffectsVisible(track.trackIndex))
    .map(track => track.trackIndex),
);

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
  const cast = scenario.value.tracks[trackIndex]?.skillCasts.find(
    candidate => candidate.id === castId,
  );
  if (castModel === undefined || cast === undefined) return [];
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
      forcedCritical: (cast.simulationInputs?.forcedCriticalStepKeys ?? []).includes(
        marker.stepKey,
      ),
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
const hitDetailForceCritical = computed(() => {
  const detail = hitDetail.value;
  return (
    detail !== null &&
    (detail.cast.simulationInputs?.forcedCriticalStepKeys ?? []).includes(detail.marker.stepKey)
  );
});

function toggleHitDetailForceCritical(forced: boolean): void {
  const target = hitDetailTarget.value;
  const detail = hitDetail.value;
  if (target === null || detail === null) return;
  const changed = commitScenario('setSkillCastForcedCritical', current =>
    setSkillCastForcedCritical(
      current,
      target.trackIndex,
      target.castId,
      detail.marker.stepKey,
      forced,
    ),
  );
  if (changed) void simulateNow();
}
function formatGuideFrame(frame: number): string {
  const seconds = Math.floor(frame / PROJECT_FPS);
  return `${seconds}s${frame % PROJECT_FPS}f`;
}

const cursorGuideMetrics = computed(() => {
  const frame = cursorGuide.value?.sampleFrame ?? 0;
  let sp: string | null = null;
  let poise: string | null = null;
  let enemyHealth: string | null = null;
  const gauges: TimelineCursorGaugeRow[] = [];
  const current = simulationRun.value;
  if (current !== null) {
    const sampledSp = sampleStepCurve(current.resourceCurves.sp.points, frame);
    sp = formatGuideNumber(sampledSp.value);
    const health = sampleStepCurve(current.enemyHealthCurve.points, frame);
    enemyHealth = `${formatGuideNumber(health.value)}/${formatGuideNumber(current.enemyHealthCurve.maxValue)}`;
    if (current.poiseCurve.maxValue > 0) {
      const sampledPoise = sampleStepCurve(current.poiseCurve.points, frame);
      poise = `${formatGuideNumber(sampledPoise.value)}/${formatGuideNumber(current.poiseCurve.maxValue)}`;
    }
    for (const curve of current.resourceCurves.ultimateEnergy) {
      const sampled = sampleStepCurve(curve.points, frame);
      const trackIndex = viewModel.value.tracks.findIndex(
        track => track.operatorInstanceId === curve.operatorId,
      );
      const track = trackIndex < 0 ? undefined : viewModel.value.tracks[trackIndex];
      if (track === undefined) continue;
      gauges.push({
        id: curve.operatorId,
        name: operatorName(track.operatorSlug),
        current: formatGuideNumber(sampled.value),
        max: formatGuideNumber(curve.maxValue),
        color: gaugeColorFor(trackIndex as TrackIndex),
        isFull: sampled.value !== null && sampled.value >= curve.maxValue,
      });
    }
  }
  return { time: formatGuideFrame(frame), sp, poise, enemyHealth, gauges };
});

const cursorGuideLabelAlign = computed<'left' | 'right'>(() => {
  const guide = cursorGuide.value;
  if (guide === null) return 'right';
  const viewportX = TIMELINE_TRACK_HEADER_WIDTH + guide.leftPx - timelineScrollLeft.value;
  return viewportX > timelineViewportWidth.value - 190 && viewportX > 190 ? 'left' : 'right';
});

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

function skillLibraryEntryName(entry: TimelineSkillLibraryEntryViewModel): string {
  const assetSlug = selectedTrackModel.value.operatorAssetSlug;
  if (assetSlug === null) return entry.placementSkillKey ?? entry.variantKey ?? entry.skillGroupKey;
  if (entry.placementSkillKey !== undefined) {
    return getOperatorCombatSkillName(assetSlug, entry.placementSkillKey, locale.value);
  }
  const nameEntry =
    entry.skillType === 'finisher' || entry.skillType === 'plungingAttack'
      ? (selectedTrackModel.value.skillLibrary.find(
          candidate => candidate.skillType === 'basicAttack' && candidate.variantKey === undefined,
        ) ?? entry)
      : entry;
  return getOperatorCombatSkillName(
    assetSlug,
    nameEntry.skillGroupKey,
    locale.value,
    undefined,
    nameEntry.variantKey,
  );
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

function skillSegmentLabels(): TimelineSkillSegmentLabels {
  return {
    heavyAttack: t('skillType.heavyAttack'),
    battleSkill: t('skillType.skill'),
    comboSkill: t('skillType.link'),
  };
}

function skillLibraryTypeLabel(entry: TimelineSkillLibraryEntryViewModel): string {
  const type = skillTypeLabel(entry.skillType);
  return entry.enhanced ? t('skillType.enhanced', { type }) : type;
}

function battleReceiptEventLabel(event: string): string {
  const receiptKey = `battleLog.receiptTypes.${event}`;
  const receiptTranslated = t(receiptKey);
  if (receiptTranslated !== receiptKey) return receiptTranslated;
  const key = `battleLog.types.${event}`;
  const translated = t(key);
  return translated === key ? event : translated;
}

function timelineCastLabel(
  cast: (typeof viewModel.value.tracks)[number]['skillCasts'][number],
  track: (typeof viewModel.value.tracks)[number],
): string {
  const source = cast.source;
  if (source.kind === 'custom') return source.name;
  const entry = track.skillLibrary.find(
    candidate =>
      candidate.skillGroupKey === source.skillGroupKey &&
      candidate.skills.some(skill => skill.skillKey === source.skillKey),
  );
  const segmentLabel =
    entry === undefined
      ? null
      : timelineSkillSegmentLabel(entry, source.skillKey, skillSegmentLabels());
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
  const frames = entry.skills
    .filter(skill => entry.groupPlacementSkillKeys.includes(skill.skillKey))
    .reduce((total, skill) => total + skill.timelineBlockFrames, 0);
  return Math.round((frames / 30) * 1000) / 1000;
}

function applyActionSelection(selection: TimelineActionSelection): void {
  let activeTrackIndex = timelineSelection.value.activeTrackIndex;
  const primaryId = selection.primaryId;
  if (primaryId !== null) {
    const ownerIndex = scenario.value.tracks.findIndex(track =>
      track?.skillCasts.some(cast => cast.id === primaryId),
    );
    if (ownerIndex >= 0) activeTrackIndex = ownerIndex as TrackIndex;
  }
  timelineSelection.value = selectTimelineActionsIdentity(
    timelineSelection.value,
    selection,
    activeTrackIndex,
  );
}

function clearTimelineSelection(): void {
  timelineSelection.value = clearTimelineEditorSelection(timelineSelection.value);
}

function isTrackIdentitySelected(trackIndex: TrackIndex): boolean {
  const primary = timelineSelection.value.primary;
  return primary.kind === 'track' && primary.trackIndex === trackIndex;
}

function locateBattleLogEntry(frame: number, castId: string | null): void {
  const targetFrame = Math.max(0, Math.min(scenario.value.battle.durationFrames, frame));
  cursorFrame.value = targetFrame;
  if (castId !== null) {
    for (const track of viewModel.value.tracks) {
      if (!track.skillCasts.some(cast => cast.id === castId)) continue;
      selectedTrack.value = track.trackIndex;
      applyActionSelection(
        selectTimelineAction(createEmptyTimelineActionSelection(), castId, false),
      );
      break;
    }
  }
  void nextTick(() => {
    const viewport = timelineScroll.value;
    if (viewport === null) return;
    const targetLeft =
      TIMELINE_TRACK_HEADER_WIDTH +
      frameToTimelinePx(targetFrame, scenario.value.battle.prepFrames, pxPerFrame.value) -
      viewport.clientWidth / 2;
    viewport.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  });
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
  if (targetSkillCastId === drag.skillCastId) return;

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

function isConnectionTargetValid(targetSkillCastId: string): boolean {
  const drag = connectionDrag.value;
  return (
    drag === null ||
    canCreateSkillCastConnection(scenario.value, drag.skillCastId, targetSkillCastId)
  );
}

function toggleConnectionTool(): boolean {
  connectionToolEnabled.value = !connectionToolEnabled.value;
  if (!connectionToolEnabled.value) cancelConnectionDrag();
  return true;
}

function toggleBuffLayout(): void {
  buffLayoutMode.value = buffLayoutMode.value === 'compact' ? 'loose' : 'compact';
}

function deleteTimelineConnection(connectionId: string): void {
  commitScenario('removeTimelineConnection', current =>
    removeTimelineConnection(current, connectionId),
  );
}

function beginSelectedCastConnection(): void {
  if (selectedCastModel.value === null) return;
  connectionToolEnabled.value = true;
}

function updateSelectedCastConnection(
  connectionId: string,
  patch: UpdateTimelineConnectionInput,
): void {
  commitScenario('updateTimelineConnection', current =>
    updateTimelineConnection(current, connectionId, patch),
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
  return entry.skills.map(skill => ({
    id: skill.skillKey,
    label:
      skillLibrarySegmentLabel(entry, skill.skillKey, skillSegmentLabels()) ??
      skillName(skill.skillKey, selectedTrackModel.value.operatorSlug),
    selected:
      libraryPlacement.value?.entryKey === entry.entryKey &&
      libraryPlacement.value?.skillKey === skill.skillKey,
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
  const trackIndex = Number((event.currentTarget as HTMLElement).dataset.trackIndex) as TrackIndex;
  if (placePendingLibrarySkill(event, trackIndex)) return;
  if (beginViewportPan(event)) return;
  if (boxSelectEnabled.value) {
    beginMarqueeGesture(event, false);
    return;
  }
  if (event.ctrlKey || event.metaKey) beginMarqueeGesture(event, true);
}

function handleTimelineLaneClick(event: MouseEvent): void {
  if (consumeLaneClickSuppression()) return;
  selectTimelinePosition(event);
}

function pointerMarkerFrame(clientX: number): number {
  const surface = timelineSurface.value;
  if (surface === null) return cursorFrame.value;
  const frame = timelinePointerActualFrame(
    clientX - surface.getBoundingClientRect().left - TIMELINE_TRACK_HEADER_WIDTH,
  );
  return snapTimelineFrame(frame, snapFrames.value, scenario.value.battle.durationFrames);
}

function openMarkerContextMenu(event: MouseEvent, trackIndex: TrackIndex): void {
  if (libraryPlacement.value !== null) {
    event.preventDefault();
    event.stopPropagation();
    cancelLibraryPlacement();
    return;
  }
  if ((event.target as HTMLElement).closest('.timeline-action-block, .timeline-marker')) return;
  event.preventDefault();
  markerContextTarget.value = {
    x: event.clientX,
    y: event.clientY,
    frame: pointerMarkerFrame(event.clientX),
    trackIndex,
  };
  contextMenuTarget.value = null;
}

function cancelPlacementFromContextMenu(event: MouseEvent): void {
  if (libraryPlacement.value === null) return;
  event.preventDefault();
  event.stopPropagation();
  cancelLibraryPlacement();
}

function openExistingMarkerContextMenu(
  event: MouseEvent,
  kind: TimelineMarkerKind,
  id: string,
  frame: number,
  trackIndex: TrackIndex,
  label: string,
): void {
  event.preventDefault();
  event.stopPropagation();
  markerContextTarget.value = {
    x: event.clientX,
    y: event.clientY,
    frame,
    trackIndex,
    existing: { kind, id, label },
  };
}

function addMarkerFromContext(
  kind:
    | 'cycle'
    | 'simulationStart'
    | 'simulationEnd'
    | 'switch'
    | 'operatorHit'
    | 'operatorWeakness'
    | 'teamHit',
): void {
  const target = markerContextTarget.value;
  if (target === null || target.existing !== undefined) return;
  if (kind === 'cycle') {
    commitScenario('addCycleBoundary', current =>
      addCycleBoundary(current, ids.allocate('cycleBoundary'), target.frame),
    );
  } else if (kind === 'simulationStart' || kind === 'simulationEnd') {
    const boundary = kind === 'simulationStart' ? 'start' : 'end';
    const hasBoundary = scenario.value.battle.simulationRange?.[`${boundary}Frame`] !== undefined;
    commitScenario(
      hasBoundary ? 'clearSimulationRangeBoundary' : 'setSimulationRangeBoundary',
      current =>
        hasBoundary
          ? clearSimulationRangeBoundary(current, boundary)
          : setSimulationRangeBoundary(current, boundary, target.frame),
    );
  } else if (kind === 'switch') {
    commitScenario('addControlSwitch', current =>
      addControlSwitch(current, ids.allocate('controlSwitch'), target.frame, target.trackIndex),
    );
  } else {
    const event: ExternalCombatEventDocument =
      kind === 'operatorWeakness'
        ? { kind: 'operatorWeaknessTriggeredOutput' }
        : { kind: 'operatorHit', tags: [], features: [] };
    const eventTarget =
      kind === 'teamHit'
        ? ({ scope: 'team' } as const)
        : ({ scope: 'operator', trackIndex: target.trackIndex } as const);
    commitScenario('addExternalEventMarker', current =>
      addExternalEventMarker(
        current,
        ids.allocate('externalEvent'),
        target.frame,
        eventTarget,
        event,
      ),
    );
  }
  markerContextTarget.value = null;
}

function removeSelectedMarker(kind: TimelineMarkerKind, id: string): boolean {
  const changed = commitScenario('removeTimelineMarker', current =>
    kind === 'cycleBoundary'
      ? removeCycleBoundary(current, id)
      : kind === 'controlSwitch'
        ? removeControlSwitch(current, id)
        : kind === 'externalEvent'
          ? removeExternalEventMarker(current, id)
          : clearSimulationRangeBoundary(current, kind === 'simulationStart' ? 'start' : 'end'),
  );
  if (changed) selectedMarker.value = null;
  return changed;
}

function removeMarkerFromContext(): void {
  const existing = markerContextTarget.value?.existing;
  if (existing === undefined) return;
  removeSelectedMarker(existing.kind, existing.id);
  markerContextTarget.value = null;
}

function setSelectedExternalEventFrame(frame: number): void {
  const marker = selectedExternalEventMarker.value;
  if (marker === null) return;
  commitScenario('moveExternalEventMarker', current =>
    moveExternalEventMarker(current, marker.id, frame),
  );
}

function setSelectedExternalEvent(event: ExternalCombatEventDocument): void {
  const marker = selectedExternalEventMarker.value;
  if (marker === null) return;
  commitScenario('updateExternalEventMarker', current =>
    updateExternalEventMarker(current, marker.id, { event }),
  );
}

function removeSelectedExternalEvent(): void {
  const marker = selectedExternalEventMarker.value;
  if (marker !== null) removeSelectedMarker('externalEvent', marker.id);
}

function setSelectedDocumentMarkerFrame(frame: number): void {
  const marker = selectedDocumentMarker.value;
  if (marker === null) return;
  commitScenario('moveTimelineMarker', current =>
    marker.kind === 'cycleBoundary'
      ? moveCycleBoundary(current, marker.id, frame)
      : marker.kind === 'controlSwitch'
        ? moveControlSwitch(current, marker.id, frame)
        : setSimulationRangeBoundary(
            current,
            marker.kind === 'simulationStart' ? 'start' : 'end',
            frame,
          ),
  );
}

function setTimelinePrepFrames(frames: number): void {
  commitScenario('setBattlePrepFrames', current => setBattlePrepFrames(current, frames));
}

function beginTimelinePrepResize(event: PointerEvent): void {
  if (event.button !== 0) return;
  const surface = timelineSurface.value;
  if (surface === null) return;
  event.preventDefault();
  event.stopPropagation();
  stopTimelinePrepResize?.();
  const update = (moveEvent: PointerEvent) => {
    const localPx =
      moveEvent.clientX - surface.getBoundingClientRect().left - TIMELINE_TRACK_HEADER_WIDTH;
    const frame = Math.max(
      0,
      Math.round(localPx / pxPerFrame.value / snapFrames.value) * snapFrames.value,
    );
    timelinePrepPreviewFrames.value = frame;
  };
  const teardownPrepResize = () => {
    window.removeEventListener('pointermove', update);
    window.removeEventListener('pointerup', finishPrepResize);
    window.removeEventListener('pointercancel', cancelPrepResize);
    stopTimelinePrepResize = null;
  };
  const finishPrepResize = () => {
    const frames = timelinePrepPreviewFrames.value;
    teardownPrepResize();
    if (frames !== null && frames !== scenario.value.battle.prepFrames) {
      setTimelinePrepFrames(frames);
    }
    timelinePrepPreviewFrames.value = null;
  };
  const cancelPrepResize = () => {
    teardownPrepResize();
    timelinePrepPreviewFrames.value = null;
  };
  stopTimelinePrepResize = cancelPrepResize;
  timelinePrepPreviewFrames.value = scenario.value.battle.prepFrames;
  window.addEventListener('pointermove', update);
  window.addEventListener('pointerup', finishPrepResize);
  window.addEventListener('pointercancel', cancelPrepResize);
}

onScopeDispose(() => stopTimelinePrepResize?.());

function setTimelineDurationFrames(frames: number): void {
  const boundedFrames = Math.max(PROJECT_FPS * 30, Math.min(PROJECT_FPS * 600, frames));
  commitScenario('setBattleDurationFrames', current =>
    setBattleDurationFrames(current, boundedFrames),
  );
}

function setSelectedControlSwitchTrack(trackIndex: TrackIndex): void {
  const marker = selectedDocumentMarker.value;
  if (marker?.kind !== 'controlSwitch') return;
  commitScenario('setControlSwitchTrack', current =>
    setControlSwitchTrack(current, marker.id, trackIndex),
  );
}

function removeSelectedDocumentMarker(): void {
  const marker = selectedDocumentMarker.value;
  if (marker !== null) removeSelectedMarker(marker.kind, marker.id);
}

function displayedMarkerFrame(kind: TimelineMarkerKind, id: string, frame: number): number {
  const gesture = markerMoveGesture.value;
  return gesture?.kind === kind && gesture.id === id ? gesture.previewFrame : frame;
}

function beginMarkerMove(
  event: PointerEvent,
  kind: TimelineMarkerKind,
  id: string,
  frame: number,
  trackIndex: TrackIndex = selectedTrack.value,
): void {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  stopMarkerMove?.();
  if (trackIndex !== selectedTrack.value) selectedTrack.value = trackIndex;
  clearTimelineSelection();
  selectedMarker.value = { kind, id };
  markerMoveGesture.value = {
    pointerId: event.pointerId,
    initialPointerX: event.clientX,
    initialPointerY: event.clientY,
    dragStarted: false,
    kind,
    id,
    initialFrame: frame,
    previewFrame: frame,
  };
  const move = (moveEvent: PointerEvent) => {
    const gesture = markerMoveGesture.value;
    if (gesture === null || gesture.pointerId !== moveEvent.pointerId) return;
    if (
      !gesture.dragStarted &&
      !passedTimelineDragThreshold(
        gesture.initialPointerX,
        gesture.initialPointerY,
        moveEvent.clientX,
        moveEvent.clientY,
      )
    ) {
      return;
    }
    markerMoveGesture.value = {
      ...gesture,
      dragStarted: true,
      previewFrame: pointerMarkerFrame(moveEvent.clientX),
    };
  };
  const cleanup = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', cancel);
    window.removeEventListener('keydown', keydown, true);
    stopMarkerMove = null;
  };
  const cancel = (cancelEvent?: PointerEvent) => {
    const gesture = markerMoveGesture.value;
    if (cancelEvent !== undefined && gesture?.pointerId !== cancelEvent.pointerId) return;
    markerMoveGesture.value = null;
    cleanup();
  };
  const keydown = (keyEvent: KeyboardEvent) => {
    if (keyEvent.key !== 'Escape') return;
    keyEvent.preventDefault();
    cancel();
  };
  const finish = (finishEvent: PointerEvent) => {
    const gesture = markerMoveGesture.value;
    if (gesture === null || gesture.pointerId !== finishEvent.pointerId) return;
    markerMoveGesture.value = null;
    cleanup();
    if (gesture.previewFrame === gesture.initialFrame) return;
    commitScenario('moveTimelineMarker', current =>
      gesture.kind === 'cycleBoundary'
        ? moveCycleBoundary(current, gesture.id, gesture.previewFrame)
        : gesture.kind === 'controlSwitch'
          ? moveControlSwitch(current, gesture.id, gesture.previewFrame)
          : gesture.kind === 'externalEvent'
            ? moveExternalEventMarker(current, gesture.id, gesture.previewFrame)
            : setSimulationRangeBoundary(
                current,
                gesture.kind === 'simulationStart' ? 'start' : 'end',
                gesture.previewFrame,
              ),
    );
  };
  stopMarkerMove = cancel;
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', cancel);
  window.addEventListener('keydown', keydown, true);
}

function updateCursorGuide(event: MouseEvent): void {
  const surface = timelineSurface.value;
  if (surface === null) {
    cursorGuide.value = null;
    placementPointer.value = null;
    return;
  }
  placementPointer.value =
    libraryPlacement.value === null ? null : { x: event.clientX, y: event.clientY };
  if (!showCursorGuide.value) {
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
  placementPointer.value = null;
}

function beginLibraryPlacement(entry: TimelineSkillLibraryEntryViewModel, skillKey?: string): void {
  const placedSkillKey = skillKey ?? entry.placementSkillKey;
  libraryPlacement.value = {
    entryKey: entry.entryKey,
    skillGroupKey: entry.skillGroupKey,
    skillType: entry.skillType,
    ...(entry.variantKey === undefined ? {} : { variantKey: entry.variantKey }),
    ...(placedSkillKey === undefined ? {} : { skillKey: placedSkillKey }),
  };
  clearTimelineSelection();
}

function cancelLibraryPlacement(): boolean {
  if (libraryPlacement.value === null) return false;
  libraryPlacement.value = null;
  placementPointer.value = null;
  return true;
}

function libraryEntrySelected(entry: TimelineSkillLibraryEntryViewModel): boolean {
  const drag = dragPayload.value;
  if (drag?.kind === 'librarySkill' && drag.entryKey === entry.entryKey) {
    return true;
  }
  const placement = libraryPlacement.value;
  return placement !== null && placement.entryKey === entry.entryKey;
}

function placePendingLibrarySkill(event: PointerEvent, trackIndex: TrackIndex): boolean {
  const placement = libraryPlacement.value;
  if (placement === null || event.button !== 0) return false;
  event.preventDefault();
  event.stopPropagation();
  if (trackIndex !== selectedTrack.value) {
    ElMessage.warning(t('timeline.shortcut.placeActiveTrackOnly'));
    return true;
  }
  const lane = event.currentTarget as HTMLElement;
  const frame = snapTimelineFrame(
    timelinePointerActualFrame(event.clientX - lane.getBoundingClientRect().left),
    snapFrames.value,
    scenario.value.battle.durationFrames,
  );
  cursorFrame.value = frame;
  placeGroup(placement.skillGroupKey, placement.skillKey, frame, trackIndex, placement.variantKey);
  cancelLibraryPlacement();
  return true;
}

function placeGroup(
  skillGroupKey: string,
  skillKey?: string,
  startFrame = cursorFrame.value,
  trackIndex = selectedTrack.value,
  variantKey?: string,
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
    ...(variantKey === undefined ? {} : { variantKey }),
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
    const lastSkillDuration = resolvePlacedSkillDurationFrames(
      operator,
      skillGroupKey,
      skillKey,
      variantKey,
    );
    cursorFrame.value = last.placement.startFrame + lastSkillDuration;
  }
}

const LEGACY_SKILL_HOTKEY_TYPES: Readonly<Record<1 | 2 | 3 | 4 | 5 | 6, SkillType>> = {
  1: 'basicAttack',
  2: 'battleSkill',
  3: 'comboSkill',
  4: 'ultimate',
  5: 'plungingAttack',
  6: 'finisher',
};

function selectTrackByShortcut(trackIndex: TrackIndex): boolean {
  selectTrack(trackIndex);
  return true;
}

function placeSkillByShortcut(slot: 1 | 2 | 3 | 4 | 5 | 6): boolean {
  const skillType = LEGACY_SKILL_HOTKEY_TYPES[slot];
  const entry =
    selectedTrackModel.value.skillLibrary.find(
      candidate =>
        candidate.skillType === skillType &&
        candidate.variantKey === undefined &&
        candidate.placementSkillKey === undefined,
    ) ?? selectedTrackModel.value.skillLibrary.find(candidate => candidate.skillType === skillType);
  if (entry === undefined) return false;
  beginLibraryPlacement(entry);
  return true;
}

function resolvePlacedSkillDurationFrames(
  operator: ReturnType<typeof nextGameDataRepository.getOperator>,
  skillGroupKey: string,
  skillKey?: string,
  variantKey?: string,
): number {
  if (operator === null) return 0;
  const group = operator.skillGroups.find(g => g.key === skillGroupKey);
  if (group === undefined) return 0;
  if (skillKey !== undefined) {
    const candidates = [
      ...(Array.isArray(group.skills) ? group.skills : [group.skills]),
      ...(group.variants ?? []).flatMap(variant =>
        Array.isArray(variant.skills) ? variant.skills : [variant.skills],
      ),
      ...(group.replacementSkills ?? []),
      ...(group.routedReplacementSkills ?? []).map(replacement => replacement.skill),
    ];
    return candidates.find(skill => skill.key === skillKey)?.timelineBlockFrames ?? 0;
  }
  const variant = group.variants?.find(candidate => candidate.key === variantKey);
  const selectedSkills = variant?.skills ?? group.skills;
  let skills: readonly { timelineBlockFrames: number; key: string }[] = Array.isArray(
    selectedSkills,
  )
    ? selectedSkills
    : [selectedSkills];
  if (variant === undefined && group.placementSequenceSkillKeys !== undefined) {
    const candidates = [
      ...skills,
      ...(group.replacementSkills ?? []),
      ...(group.routedReplacementSkills ?? []).map(replacement => replacement.skill),
    ];
    skills = group.placementSequenceSkillKeys.flatMap(skillKey => {
      const skill = candidates.find(candidate => candidate.key === skillKey);
      return skill === undefined ? [] : [skill];
    });
  }
  const filtered = skillKey === undefined ? skills : skills.filter(s => s.key === skillKey);
  const lastSkill = filtered.at(-1);
  return lastSkill?.timelineBlockFrames ?? 0;
}

function beginSkillDrag(
  event: DragEvent,
  entry: TimelineSkillLibraryEntryViewModel,
  skillKey?: string,
): void {
  const placedSkillKey = skillKey ?? entry.placementSkillKey;
  cancelLibraryPlacement();
  const offsets = getDefaultLibraryDragOffsets();
  dragPayload.value = {
    kind: 'librarySkill',
    entryKey: entry.entryKey,
    skillGroupKey: entry.skillGroupKey,
    ...(entry.variantKey === undefined ? {} : { variantKey: entry.variantKey }),
    ...(placedSkillKey === undefined ? {} : { skillKey: placedSkillKey }),
    dragOffsetX: offsets.dragOffsetX,
  };
  const draggedSkill =
    placedSkillKey === undefined
      ? undefined
      : entry.skills.find(skill => skill.skillKey === placedSkillKey);
  const durationSeconds =
    draggedSkill === undefined
      ? skillDurationSeconds(entry)
      : Math.round((draggedSkill.timelineBlockFrames / PROJECT_FPS) * 1000) / 1000;
  const label =
    placedSkillKey === undefined
      ? skillLibraryEntryName(entry)
      : (skillLibrarySegmentLabel(entry, placedSkillKey, skillSegmentLabels()) ??
        skillName(placedSkillKey, selectedTrackModel.value.operatorSlug));
  const ghost = createLibraryDragGhost(
    { name: label, duration: durationSeconds },
    pxPerFrame.value * PROJECT_FPS,
    () => skillAccentColor(entry.skillType),
  );
  if (event.dataTransfer !== null) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', placedSkillKey ?? entry.skillGroupKey);
    event.dataTransfer.setDragImage(ghost, offsets.dragOffsetX, offsets.dragOffsetY);
  }
}

function finishSkillDrag(): void {
  if (dragPayload.value?.kind === 'librarySkill') dragPayload.value = null;
  removeLibraryDragGhost();
}

function beginCastMove(event: PointerEvent, trackIndex: TrackIndex, skillCastId: string): void {
  if (event.button !== 0) return;
  if (alignSelectedCastToTarget(event, skillCastId)) return;
  event.preventDefault();
  event.stopPropagation();
  cancelCastMove();
  const selection = actionSelection.value.selectedIds.has(skillCastId)
    ? { ...actionSelection.value, primaryId: skillCastId }
    : selectTimelineAction(actionSelection.value, skillCastId, false);
  const selectedCasts = scenario.value.tracks.flatMap(track =>
    track === null
      ? []
      : track.skillCasts.filter(candidate => selection.selectedIds.has(candidate.id)),
  );
  if (selectedCasts.some(candidate => candidate.presentation?.locked ?? false)) {
    event.preventDefault();
    event.stopPropagation();
    ElMessage.warning(t('timelineGrid.action.locked'));
    return;
  }
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
    initialPointerX: event.clientX,
    initialPointerY: event.clientY,
    latestPointerX: event.clientX,
    latestPointerY: event.clientY,
    anchorActualFrame: initialActualFrame,
    baseScenario: scenario.value,
    previewFrame: cast.placement.startFrame,
    previewActualFrame: initialActualFrame,
    committed: false,
    dragStarted: false,
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
    if (castMoveAutoScrollFrame !== null) cancelAnimationFrame(castMoveAutoScrollFrame);
    castMoveAutoScrollFrame = null;
    stopCastMoveGesture = null;
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onFinish);
  window.addEventListener('pointercancel', onCancel);
  window.addEventListener('keydown', onKeyDown, true);
}

function castMoveFrame(
  clientX: number,
  clientY: number,
  gesture: TimelineCastMoveGesture,
): { readonly placementFrame: number; readonly actualFrame: number } | null {
  const pointed = document.elementFromPoint(clientX, clientY);
  const lane = pointed instanceof Element ? pointed.closest<HTMLElement>('.track-lane') : null;
  if (lane?.dataset.trackIndex !== String(gesture.trackIndex)) return null;
  const pointerActualFrame = Math.max(
    0,
    Math.min(
      scenario.value.battle.durationFrames,
      (clientX - lane.getBoundingClientRect().left) / pxPerFrame.value -
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

function updateCastMoveAt(
  pointerId: number,
  clientX: number,
  clientY: number,
  fromAutoScroll = false,
): void {
  let gesture = castMoveGesture.value;
  if (gesture === null || gesture.pointerId !== pointerId) return;
  if (!fromAutoScroll) {
    gesture.latestPointerX = clientX;
    gesture.latestPointerY = clientY;
  }
  if (!gesture.dragStarted) {
    if (
      !passedTimelineDragThreshold(
        gesture.initialPointerX,
        gesture.initialPointerY,
        clientX,
        clientY,
      )
    ) {
      return;
    }
    gesture = { ...gesture, dragStarted: true };
    castMoveGesture.value = gesture;
  }
  if (!fromAutoScroll) scheduleCastMoveAutoScroll();
  const frame = castMoveFrame(clientX, clientY, gesture);
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

function updateCastMove(event: PointerEvent): void {
  updateCastMoveAt(event.pointerId, event.clientX, event.clientY);
}

function scheduleCastMoveAutoScroll(): void {
  if (castMoveAutoScrollFrame !== null) return;
  const tick = () => {
    castMoveAutoScrollFrame = null;
    const gesture = castMoveGesture.value;
    const viewport = timelineScroll.value;
    if (gesture === null || viewport === null || gesture.committed || !gesture.dragStarted) return;
    const rect = viewport.getBoundingClientRect();
    const delta = projectTimelineEdgeAutoScrollDelta({
      pointerX: gesture.latestPointerX,
      pointerY: gesture.latestPointerY,
      left: rect.left + TIMELINE_TRACK_HEADER_WIDTH,
      right: rect.right,
      top: rect.top + TIMELINE_RULER_HEIGHT,
      bottom: rect.bottom,
    });
    if (delta.x === 0 && delta.y === 0) return;
    const previousLeft = viewport.scrollLeft;
    const previousTop = viewport.scrollTop;
    viewport.scrollLeft += delta.x;
    viewport.scrollTop += delta.y;
    if (viewport.scrollLeft === previousLeft && viewport.scrollTop === previousTop) return;
    updateCastMoveAt(gesture.pointerId, gesture.latestPointerX, gesture.latestPointerY, true);
    castMoveAutoScrollFrame = requestAnimationFrame(tick);
  };
  castMoveAutoScrollFrame = requestAnimationFrame(tick);
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
  trackOrderDropTarget.value = null;
  if (event.dataTransfer !== null) event.dataTransfer.effectAllowed = 'move';
}

function finishTrackOrderDrag(): void {
  if (dragPayload.value?.kind === 'trackOrder') dragPayload.value = null;
  trackOrderDropTarget.value = null;
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
  trackOrderDropTarget.value = null;
  swapTrackOrder(payload.trackIndex, trackIndex);
}

function allowTimelinePayloadDrop(event: DragEvent): void {
  event.preventDefault();
  if (event.dataTransfer !== null) {
    event.dataTransfer.dropEffect = dragPayload.value?.kind === 'librarySkill' ? 'copy' : 'move';
  }
}

function dropTimelinePayload(event: DragEvent, trackIndex: TrackIndex): void {
  const payload = dragPayload.value;
  dragPayload.value = null;
  if (payload === null) return;
  event.preventDefault();
  trackOrderDropTarget.value = null;
  if (payload.kind === 'trackOrder') {
    swapTrackOrder(payload.trackIndex, trackIndex);
    return;
  }
  removeLibraryDragGhost();
  if (trackIndex !== selectedTrack.value) return;
  const lane = event.currentTarget as HTMLElement;
  const pointerFrame = timelinePointerActualFrame(
    event.clientX - lane.getBoundingClientRect().left - payload.dragOffsetX,
  );
  const frame = snapTimelineFrame(
    pointerFrame,
    snapFrames.value,
    scenario.value.battle.durationFrames,
  );
  cursorFrame.value = frame;
  placeGroup(payload.skillGroupKey, payload.skillKey, frame, trackIndex, payload.variantKey);
}

function resetScenario(): void {
  commitScenario('resetScenario', current => {
    const reset = createTimelineSampleScenario();
    return { ...reset, id: current.id, name: current.name, inheritance: current.inheritance };
  });
  selectedTrack.value = 0;
  clearTimelineSelection();
  cursorFrame.value = 30;
  contextMenuTarget.value = null;
  cancelLibraryPlacement();
}

function resetTransientScenarioUi(): void {
  selectedTrack.value = 0;
  clearTimelineSelection();
  cursorFrame.value = 30;
  contextMenuTarget.value = null;
  cancelLibraryPlacement();
  hitDetailTarget.value = null;
  showSkillDefinitionEditor.value = false;
  showOperatorDefinitionWorkspace.value = false;
  showWeaponDefinitionWorkspace.value = false;
  gearDefinitionWorkspaceSlot.value = null;
  gearSetDefinitionWorkspaceId.value = null;
}

function renameScenario(name: string): void {
  projectSession.commit('renameScenario', project => renameActiveScenario(project, name));
}

function selectScenario(scenarioId: string): void {
  const changed = projectSession.commit('switchScenario', project =>
    switchProjectScenario(project, scenarioId),
  );
  if (changed) resetTransientScenarioUi();
}

function addScenario(): void {
  const project = projectSession.snapshot.project;
  if (project.scenarios.length >= MAX_PROJECT_SCENARIOS) {
    ElMessage.warning(t('timeline.scenario.limit', { max: MAX_PROJECT_SCENARIOS }));
    return;
  }
  const changed = projectSession.commit('addScenario', current =>
    addProjectScenario(
      current,
      t('timeline.scenario.defaultName', { index: current.scenarios.length + 1 }),
    ),
  );
  if (changed) resetTransientScenarioUi();
}

function duplicateScenario(): void {
  const project = projectSession.snapshot.project;
  if (project.scenarios.length >= MAX_PROJECT_SCENARIOS) {
    ElMessage.warning(t('timeline.scenario.limit', { max: MAX_PROJECT_SCENARIOS }));
    return;
  }
  const changed = projectSession.commit('duplicateScenario', current =>
    duplicateActiveScenario(current, t('timeline.scenario.copySuffix')),
  );
  if (!changed) return;
  resetTransientScenarioUi();
  ElMessage.success(t('timeline.scenario.duplicated'));
}

async function removeScenario(): Promise<void> {
  const project = projectSession.snapshot.project;
  const dependents = scenariosDependingOn(project, project.activeScenarioId);
  if (dependents.length > 0) {
    ElMessage.warning(
      `该方案被 ${dependents.map(value => value.name).join('、')} 继承，不能删除。`,
    );
    return;
  }
  try {
    await ElMessageBox.confirm(
      t('timeline.scenario.deleteConfirm'),
      t('timeline.scenario.deleteTitle'),
      {
        confirmButtonText: t('common.delete'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      },
    );
  } catch {
    return;
  }
  const changed = projectSession.commit('deleteScenario', deleteActiveScenario);
  if (!changed) return;
  resetTransientScenarioUi();
  ElMessage.success(t('timeline.scenario.deleted'));
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
  if (selectedMarker.value !== null) {
    return removeSelectedMarker(selectedMarker.value.kind, selectedMarker.value.id);
  }
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

function toggleBoxSelect(): boolean {
  boxSelectEnabled.value = !boxSelectEnabled.value;
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
  const intent = resolveTimelineWheelIntent(event);
  if (intent.kind === 'nativeVerticalScroll') return;
  event.preventDefault();
  if (intent.kind === 'horizontalPan') {
    const viewport = timelineScroll.value;
    if (viewport !== null) viewport.scrollLeft += intent.deltaPx;
    return;
  }
  const step = Math.max(1, Math.round(timelineZoomPercent.value * 0.15));
  void updateTimelineZoomPercent(
    timelineZoomPercent.value + intent.direction * step,
    event.clientX,
  );
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
    panelDialogTrack.value !== null ||
    hitDetailTarget.value !== null ||
    showDamageAnalysis.value ||
    showShortcutHelp.value,
);

useKeyboardShortcutScope({
  id: 'next-timeline-overlay',
  priority: 100,
  active: () =>
    hasModalPanel.value || contextMenuTarget.value !== null || markerContextTarget.value !== null,
  handle: () => false,
  blockLowerScopes: true,
});

useKeyboardShortcutScope({
  id: 'next-timeline-editor',
  priority: 10,
  active: () =>
    !hasModalPanel.value && contextMenuTarget.value === null && markerContextTarget.value === null,
  handle: event => {
    if (isKeyboardShortcutIsolationTarget(event.target)) return false;
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
      toggleBoxSelect,
      toggleConnectionTool,
      cycleTrack: cycleOccupiedTrack,
      selectTrack: selectTrackByShortcut,
      placeSkill: placeSkillByShortcut,
      cancelPlacement: cancelLibraryPlacement,
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

function cycleInitialUltimateEnergyPreset(): void {
  const modes = ['empty', 'full', 'custom'] as const;
  const currentIndex = modes.indexOf(initialUltimateEnergyPresetMode.value);
  const mode = modes[(currentIndex + 1) % modes.length]!;
  commitScenario('applyInitialUltimateEnergyPreset', current =>
    applyInitialUltimateEnergyPreset(current, mode, maximumUltimateEnergyByTrack.value),
  );
}

function setUnifiedTrackInitialUltimateEnergy(value: number): void {
  commitScenario('setUnifiedInitialUltimateEnergy', current =>
    setUnifiedInitialUltimateEnergy(current, value, maximumUltimateEnergyByTrack.value),
  );
}

function setBattleResourceRule(field: EditableBattleResourceRule, value: number): void {
  commitScenario('updateBattleResourceRule', current =>
    updateBattleResourceRule(current, field, value),
  );
}

function setGlobalModifiers(modifiers: Parameters<typeof setGlobalOperatorStatModifiers>[1]): void {
  commitScenario('setGlobalOperatorStatModifiers', current =>
    setGlobalOperatorStatModifiers(current, modifiers),
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

function setSelectedCastStartFrame(frame: number): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('moveSkillCast', current =>
    moveSkillCast(current, selected.trackIndex, selected.cast.id, frame),
  );
}

function setSelectedCastLocked(locked: boolean): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('setSkillCastLocked', current =>
    setSkillCastLocked(current, selected.trackIndex, selected.cast.id, locked),
  );
}

function setSelectedCastDisabled(disabled: boolean): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('setSkillCastDisabled', current =>
    setSkillCastDisabled(current, selected.trackIndex, selected.cast.id, disabled),
  );
}

function setSelectedCastColor(color: string | null): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('setSkillCastColor', current =>
    setSkillCastColor(current, selected.trackIndex, selected.cast.id, color),
  );
}

function addSelectedCastCustomBar(): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  const bars = selected.cast.presentation?.customBars ?? [];
  commitScenario('addSkillCastCustomBar', current =>
    setSkillCastCustomBars(current, selected.trackIndex, selected.cast.id, [
      ...bars,
      {
        id: ids.allocate('customBar'),
        text: '',
        offsetFrames: 0,
        durationFrames: PROJECT_FPS,
      },
    ]),
  );
}

function setSelectedCastCustomBars(bars: readonly EditableBarDocument[]): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('setSkillCastCustomBars', current =>
    setSkillCastCustomBars(current, selected.trackIndex, selected.cast.id, bars),
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
      contractUnavailable: t('timeline.activityBar.contractUnavailable'),
      resourceMonitor: t('timeline.activityBar.resourceMonitor'),
      inspector: t('timeline.activityBar.inspector'),
      battleLog: t('timeline.activityBar.battleLog'),
      resetPanel: t('common.reset'),
      collapsePanel: t('common.close'),
    }"
  >
    <template #left>
      <section class="skill-sidebar">
        <div class="library-header">
          <div class="library-header__main">
            <button class="operator-heading" type="button" @click="openOperatorDialog()">
              <span class="operator-heading__mark"></span>
              <strong>{{ operatorName(selectedTrackModel.operatorSlug) }}</strong>
            </button>
          </div>
          <div class="library-header__divider"></div>
          <div class="library-section-title library-section-title--status">
            <strong>{{ t('actionLibrary.section.operatorStatusAdjust') }}</strong>
            <span>{{ t('actionLibrary.hints.adjustOperatorStatus') }}</span>
          </div>
          <div class="sidebar-tabs" role="group">
            <button
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
        </div>
        <div class="skill-section">
          <div class="library-section-title">
            <strong>{{ t('actionLibrary.section.operatorSkillLibrary') }}</strong>
            <span>{{ t('actionLibrary.hints.clickOrDrag') }}</span>
          </div>
          <div class="skill-list">
            <SkillLibraryCard
              v-for="entry in selectedTrackModel.skillLibrary"
              :key="entry.entryKey"
              :name="skillLibraryEntryName(entry)"
              :tooltip="skillLibraryEntryName(entry)"
              :type-label="skillLibraryTypeLabel(entry)"
              :duration="skillDurationSeconds(entry)"
              :icon="skillDisplayIcon(entry.skillType, selectedTrackModel.operatorSlug)"
              :accent-color="skillAccentColor(entry.skillType)"
              :selected="libraryEntrySelected(entry)"
              :segments="skillSegments(entry)"
              @dragstart="beginSkillDrag($event, entry)"
              @dragstart-segment="beginSkillDrag($event.event, entry, $event.skillKey)"
              @dragend="finishSkillDrag"
            />
          </div>
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
        :scenarios="projectScenarios"
        :active-scenario-id="activeProjectScenarioId"
        :max-scenarios="MAX_PROJECT_SCENARIOS"
        :project-dirty="projectDirty"
        :view-layers="timelineViewLayers"
        :view-layer-ids="NEXT_TIMELINE_VIEW_LAYER_IDS"
        :operator-effects="operatorEffectsOptions"
        :locale="locale"
        :appearance="appearance"
        :labels="{
          rename: t('timeline.scenario.renameTooltip'),
          duplicate: t('timeline.scenario.duplicateTooltip'),
          delete: t('timeline.scenario.deleteTooltip'),
          add: t('timeline.scenario.addTooltip'),
          analysis: t('timeline.analysis.button'),
          open: t('common.load'),
          export: t('common.export'),
          more: t('timeline.header.more'),
          reset: t('common.reset'),
          view: t('timeline.header.sectionViewLayers'),
          viewLayers: {
            upperEffects: t('timeline.header.viewLayers.upperEffects'),
            lowerBuffs: t('timeline.header.viewLayers.lowerBuffs'),
            gauge: t('timeline.header.viewLayers.gauge'),
            skillDecorations: t('timeline.header.viewLayers.skillDecorations'),
            hitMarkers: t('timeline.header.viewLayers.hitMarkers'),
            comboWindows: t('timeline.header.viewLayers.comboWindows'),
            switchMarkers: t('timeline.header.viewLayers.switchMarkers'),
            effectLinks: t('timeline.header.viewLayers.effectLinks'),
          },
          viewOperators: t('timeline.header.sectionViewOperators'),
          viewOperatorsEmpty: t('timeline.header.hideEffectsEmpty'),
          shortcuts: t('timeline.header.shortcutsLabel'),
          preferences: t('timeline.header.sectionPrefs'),
          appearance: t('common.appearance'),
          appearanceLight: t('common.appearanceLight'),
          appearanceDark: t('common.appearanceDark'),
          projectDirty: t('timeline.header.projectDirty'),
          locales: {
            zhCN: t('locale.zhCNShort'),
            en: t('locale.enShort'),
            ru: t('locale.ruShort'),
          },
        }"
        @analysis="showDamageAnalysis = true"
        @shortcuts="showShortcutHelp = true"
        @rename="renameScenario"
        @duplicate="duplicateScenario"
        @delete="removeScenario"
        @add="addScenario"
        @select="selectScenario"
        @open="requestOpenProject"
        @export="exportProject"
        @reset="resetScenario"
        @toggle-view-layer="toggleTimelineViewLayer"
        @toggle-operator-effects="toggleOperatorEffectsVisibility"
        @set-locale="selectTimelineLocale"
        @set-appearance="setAppearance"
        @clear-selection="clearTimelineSelection"
      />
    </template>

    <div class="timeline-workspace">
      <div
        ref="timelineScroll"
        class="timeline-scroll"
        :class="{ 'is-panning': isPanning }"
        @wheel="handleTimelineWheel"
        @scroll="updateTimelineViewportMetrics"
      >
        <div
          ref="timelineSurface"
          class="timeline-surface"
          :class="{ 'is-library-placing': libraryPlacement !== null }"
          :style="timelineSurfaceStyle"
          @mousemove="updateCursorGuide"
          @mouseleave="hideCursorGuide"
          @contextmenu.capture="cancelPlacementFromContextMenu"
        >
          <div class="corner-placeholder">
            <TimelineCornerToolbar
              :snap-label="snapFrames === PRECISE_TIMELINE_SNAP_FRAMES ? '1f' : '0.1s'"
              :zoom-percent="timelineZoomPercent"
              :cursor-guide-enabled="showCursorGuide"
              :box-select-enabled="boxSelectEnabled"
              :connection-tool-enabled="connectionToolEnabled"
              :initial-gauge-mode="initialUltimateEnergyPresetMode"
              :buff-layout-mode="buffLayoutMode"
              :labels="{
                initialGauge: t('timelineGrid.toolbar.initialGauge'),
                cursorGuide: t('timelineGrid.toolbar.cursorGuide'),
                boxSelect: t('timelineGrid.toolbar.boxSelect'),
                snapPrecision: t('timelineGrid.toolbar.snapPrecision'),
                connectionTool: t('timelineGrid.toolbar.connectionTool'),
                buffLayout: t('timelineGrid.toolbar.buffLayoutMode', {
                  mode: t(
                    buffLayoutMode === 'compact'
                      ? 'timelineGrid.toolbar.buffLayoutCompact'
                      : 'timelineGrid.toolbar.buffLayoutLoose',
                  ),
                }),
                zoom: 'SCALE',
              }"
              @toggle-snap-precision="toggleSnapPrecision"
              @cycle-initial-gauge="cycleInitialUltimateEnergyPreset"
              @set-unified-initial-gauge="setUnifiedTrackInitialUltimateEnergy"
              @toggle-cursor-guide="toggleCursorGuide"
              @toggle-box-select="toggleBoxSelect"
              @toggle-connection-tool="toggleConnectionTool"
              @toggle-buff-layout="toggleBuffLayout"
              @update-zoom-percent="updateTimelineZoomPercent"
            />
          </div>
          <TimelineRuler
            class="timeline-ruler"
            :style="{ width: `${timelineWidth}px` }"
            :prep-frames="displayedTimelinePrepFrames"
            :duration-frames="scenario.battle.durationFrames"
            :cursor-frame="cursorFrame"
            :px-per-frame="pxPerFrame"
            :snap-frames="snapFrames"
            :operations="rulerOperations"
            :visible-left-px="Math.max(0, timelineScrollLeft - TIMELINE_TRACK_HEADER_WIDTH)"
            :visible-width-px="timelineViewportWidth"
            @seek="cursorFrame = $event"
            @set-prep-frames="setTimelinePrepFrames"
            @set-duration-frames="setTimelineDurationFrames"
          />
          <div
            class="timeline-battle-start-boundary"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + displayedTimelinePrepFrames * pxPerFrame}px`,
            }"
            :title="t('timelineGrid.prep.setDurationTitle')"
            @pointerdown="beginTimelinePrepResize"
          ></div>
          <TimelineConnectionLayer
            v-if="timelineViewLayers.effectLinks || connectionDrag !== null"
            :scenario="scenario"
            :tracks="viewModel.tracks"
            :px-per-frame="pxPerFrame"
            :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
            :cast-actual-start-frames="skillCastActualStartFrames"
            :cast-actual-duration-frames="skillCastActualDurationFrames"
            :hit-actual-frames="hitActualFrames"
            :visible-track-indices="visibleEffectTrackIndices"
            :preview="connectionDrag"
            @remove="deleteTimelineConnection"
          />
          <div
            v-if="showCursorGuide && cursorGuide !== null"
            class="cursor-guide"
            :style="{ left: `${TIMELINE_TRACK_HEADER_WIDTH + cursorGuide.leftPx}px` }"
          >
            <TimelineCursorGuide
              :time="cursorGuideMetrics.time"
              :sp="cursorGuideMetrics.sp"
              :poise="cursorGuideMetrics.poise"
              :enemy-health="cursorGuideMetrics.enemyHealth"
              :gauges="cursorGuideMetrics.gauges"
              :align="cursorGuideLabelAlign"
            />
          </div>
          <div
            v-if="alignmentGuide !== null"
            class="alignment-guide"
            :style="{
              left: `${alignmentGuide.left}px`,
              top: `${alignmentGuide.top}px`,
              height: `${alignmentGuide.height}px`,
              color: alignmentGuide.color,
            }"
          >
            <span>{{ alignmentGuide.label }}</span>
          </div>
          <TimelineTimeDilationBands
            :bands="timeDilationBands"
            :source-cast-ids="highlightedTimeDilationSourceIds"
            :prep-frames="scenario.battle.prepFrames"
            :px-per-frame="pxPerFrame"
            :horizontal-offset="TIMELINE_TRACK_HEADER_WIDTH"
          />
          <div
            v-if="scenario.battle.simulationRange?.startFrame !== undefined"
            class="simulation-range-dim simulation-range-dim--start"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH}px`,
              width: `${frameToTimelinePx(displayedMarkerFrame('simulationStart', 'simulationStart', scenario.battle.simulationRange.startFrame), scenario.battle.prepFrames, pxPerFrame)}px`,
            }"
          ></div>
          <div
            v-if="scenario.battle.simulationRange?.endFrame !== undefined"
            class="simulation-range-dim simulation-range-dim--end"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + frameToTimelinePx(displayedMarkerFrame('simulationEnd', 'simulationEnd', scenario.battle.simulationRange.endFrame), scenario.battle.prepFrames, pxPerFrame)}px`,
            }"
          ></div>
          <div
            v-if="scenario.battle.simulationRange?.startFrame !== undefined"
            class="timeline-marker simulation-range-marker simulation-range-marker--start"
            :class="{ selected: selectedMarker?.kind === 'simulationStart' }"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + frameToTimelinePx(displayedMarkerFrame('simulationStart', 'simulationStart', scenario.battle.simulationRange.startFrame), scenario.battle.prepFrames, pxPerFrame)}px`,
            }"
            @pointerdown="
              beginMarkerMove(
                $event,
                'simulationStart',
                'simulationStart',
                scenario.battle.simulationRange.startFrame,
              )
            "
            @contextmenu="
              openExistingMarkerContextMenu(
                $event,
                'simulationStart',
                'simulationStart',
                scenario.battle.simulationRange.startFrame,
                selectedTrack,
                t('nextTimeline.markerLabels.simulationStart'),
              )
            "
          >
            <span
              >{{
                displayedMarkerFrame(
                  'simulationStart',
                  'simulationStart',
                  scenario.battle.simulationRange.startFrame,
                )
              }}f</span
            >
            <b>{{ t('nextTimeline.markerLabels.simulationStart') }}</b>
          </div>
          <div
            v-if="scenario.battle.simulationRange?.endFrame !== undefined"
            class="timeline-marker simulation-range-marker simulation-range-marker--end"
            :class="{ selected: selectedMarker?.kind === 'simulationEnd' }"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + frameToTimelinePx(displayedMarkerFrame('simulationEnd', 'simulationEnd', scenario.battle.simulationRange.endFrame), scenario.battle.prepFrames, pxPerFrame)}px`,
            }"
            @pointerdown="
              beginMarkerMove(
                $event,
                'simulationEnd',
                'simulationEnd',
                scenario.battle.simulationRange.endFrame,
              )
            "
            @contextmenu="
              openExistingMarkerContextMenu(
                $event,
                'simulationEnd',
                'simulationEnd',
                scenario.battle.simulationRange.endFrame,
                selectedTrack,
                t('nextTimeline.markerLabels.simulationEnd'),
              )
            "
          >
            <span
              >{{
                displayedMarkerFrame(
                  'simulationEnd',
                  'simulationEnd',
                  scenario.battle.simulationRange.endFrame,
                )
              }}f</span
            >
            <b>{{ t('nextTimeline.markerLabels.simulationEnd') }}</b>
          </div>
          <div
            v-for="boundary in scenario.battle.cycleBoundaries"
            :key="boundary.id"
            class="timeline-marker cycle-boundary-marker"
            :class="{
              selected:
                selectedMarker?.kind === 'cycleBoundary' && selectedMarker.id === boundary.id,
            }"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + frameToTimelinePx(displayedMarkerFrame('cycleBoundary', boundary.id, boundary.frame), scenario.battle.prepFrames, pxPerFrame)}px`,
            }"
            @pointerdown="beginMarkerMove($event, 'cycleBoundary', boundary.id, boundary.frame)"
            @contextmenu="
              openExistingMarkerContextMenu(
                $event,
                'cycleBoundary',
                boundary.id,
                boundary.frame,
                selectedTrack,
                t('nextTimeline.markerLabels.cycleBoundary'),
              )
            "
          >
            <span>{{ displayedMarkerFrame('cycleBoundary', boundary.id, boundary.frame) }}f</span>
            <b>{{ t('nextTimeline.markerLabels.cycleBoundary') }}</b>
          </div>
          <div
            v-for="marker in (scenario.battle.externalEventMarkers ?? []).filter(
              item => item.target.scope === 'team',
            )"
            :key="marker.id"
            class="timeline-marker team-event-marker"
            :class="{
              selected: selectedMarker?.kind === 'externalEvent' && selectedMarker.id === marker.id,
            }"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + frameToTimelinePx(displayedMarkerFrame('externalEvent', marker.id, marker.frame), scenario.battle.prepFrames, pxPerFrame)}px`,
            }"
            @pointerdown="beginMarkerMove($event, 'externalEvent', marker.id, marker.frame)"
            @contextmenu="
              openExistingMarkerContextMenu(
                $event,
                'externalEvent',
                marker.id,
                marker.frame,
                selectedTrack,
                t('nextTimeline.markerLabels.teamExternalEvent'),
              )
            "
          >
            <span>{{ displayedMarkerFrame('externalEvent', marker.id, marker.frame) }}f</span>
            <b>{{ t('nextTimeline.markerLabels.teamHit') }}</b>
          </div>

          <div class="track-stack">
            <div
              v-for="track in viewModel.tracks"
              :key="track.trackIndex"
              class="track-row"
              :class="{ selected: isTrackIdentitySelected(track.trackIndex) }"
              :style="{
                height: `${trackEffectLayout(track.trackIndex, track.operatorInstanceId).height}px`,
              }"
            >
              <TimelineTrackHeader
                class="track-identity"
                :track="track"
                :name="operatorName(track.operatorSlug)"
                :selected="isTrackIdentitySelected(track.trackIndex)"
                :reorder-source="
                  dragPayload?.kind === 'trackOrder' && dragPayload.trackIndex === track.trackIndex
                "
                :reorder-target="
                  trackOrderDropTarget === track.trackIndex &&
                  !(
                    dragPayload?.kind === 'trackOrder' &&
                    dragPayload.trackIndex === track.trackIndex
                  )
                "
                :can-move-up="track.trackIndex > 0"
                :can-move-down="track.trackIndex < 3"
                :stat-details-available="panelResolution.panels.has(track.trackIndex)"
                :stat-details-error="panelResolution.error"
                :weapon-icon="loadoutModels[track.trackIndex]?.weapon?.definition.iconPath ?? null"
                :gear-icons="{
                  armor: loadoutModels[track.trackIndex]?.gears.armor?.definition.iconPath ?? null,
                  gloves:
                    loadoutModels[track.trackIndex]?.gears.gloves?.definition.iconPath ?? null,
                  accessory1:
                    loadoutModels[track.trackIndex]?.gears.accessory1?.definition.iconPath ?? null,
                  accessory2:
                    loadoutModels[track.trackIndex]?.gears.accessory2?.definition.iconPath ?? null,
                }"
                :active-gear-set-label="activeGearSetLabelsByTrack[track.trackIndex] ?? ''"
                :status-indicators="statusIndicatorsForTarget(track.operatorInstanceId)"
                :status-slot="
                  controlledOperatorIdAtCursor === track.operatorInstanceId
                    ? 'mainCharacterHpBarCommon'
                    : 'squadIcon'
                "
                :cursor-frame="cursorFrame"
                :labels="{
                  operator: t('timelineGrid.track.changeOperatorTooltip'),
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
                @reorder-drag-end="finishTrackOrderDrag"
                @reorder-drag-enter="
                  trackOrderDropTarget =
                    dragPayload?.kind === 'trackOrder' ? track.trackIndex : null
                "
                @reorder-drag-leave="
                  trackOrderDropTarget =
                    trackOrderDropTarget === track.trackIndex ? null : trackOrderDropTarget
                "
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
                :style="{
                  width: `${timelineWidth}px`,
                  height: `${trackEffectLayout(track.trackIndex, track.operatorInstanceId).height}px`,
                  '--timeline-action-top': `${trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop}px`,
                  '--timeline-action-guide-top': `${trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop - 2}px`,
                }"
                @pointerdown="handleTimelineLanePointerDown"
                @click="handleTimelineLaneClick"
                @contextmenu="openMarkerContextMenu($event, track.trackIndex)"
                @dragover="allowTimelinePayloadDrop"
                @drop.prevent="dropTimelinePayload($event, track.trackIndex)"
              >
                <TimelineTrackGauge
                  v-if="timelineViewLayers.gauge && isOperatorEffectsVisible(track.trackIndex)"
                  :curve="gaugeCurveFor(track.trackIndex)"
                  :color="gaugeColorFor(track.trackIndex)"
                  :prep-frames="scenario.battle.prepFrames"
                  :duration-frames="scenario.battle.durationFrames"
                  :px-per-frame="pxPerFrame"
                />
                <TimelineBuffBands
                  v-if="
                    timelineViewLayers.upperEffects && isOperatorEffectsVisible(track.trackIndex)
                  "
                  :segments="buffSegmentsForTarget(track.operatorInstanceId, 'upper')"
                  :prep-frames="scenario.battle.prepFrames"
                  :px-per-frame="pxPerFrame"
                  placement="upper"
                  :action-top="
                    trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop
                  "
                />
                <TimelineBuffBands
                  v-if="timelineViewLayers.lowerBuffs && isOperatorEffectsVisible(track.trackIndex)"
                  :segments="buffSegmentsForTarget(track.operatorInstanceId, 'lower')"
                  :prep-frames="scenario.battle.prepFrames"
                  :px-per-frame="pxPerFrame"
                  placement="lower"
                  :action-top="
                    trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop
                  "
                />
                <TimelineComboWindowBands
                  v-if="
                    timelineViewLayers.comboWindows && isOperatorEffectsVisible(track.trackIndex)
                  "
                  :segments="comboWindowSegmentsFor(track.operatorInstanceId)"
                  :prep-frames="scenario.battle.prepFrames"
                  :px-per-frame="pxPerFrame"
                  :color="gaugeColorFor(track.trackIndex)"
                  :label="t('timeline.header.viewLayers.comboWindows')"
                />
                <div
                  class="prep-zone"
                  :style="{ width: `${displayedTimelinePrepFrames * pxPerFrame}px` }"
                ></div>
                <div
                  class="battle-start-line"
                  :style="{ left: `${displayedTimelinePrepFrames * pxPerFrame}px` }"
                ></div>
                <div
                  v-if="
                    timelineViewLayers.switchMarkers && isOperatorEffectsVisible(track.trackIndex)
                  "
                  v-for="marker in scenario.battle.controlSwitches.filter(
                    item => item.trackIndex === track.trackIndex,
                  )"
                  :key="marker.id"
                  class="timeline-marker track-switch-marker"
                  :class="{
                    selected:
                      selectedMarker?.kind === 'controlSwitch' && selectedMarker.id === marker.id,
                  }"
                  :style="{
                    left: `${frameToTimelinePx(displayedMarkerFrame('controlSwitch', marker.id, marker.frame), scenario.battle.prepFrames, pxPerFrame)}px`,
                  }"
                  @pointerdown="
                    beginMarkerMove(
                      $event,
                      'controlSwitch',
                      marker.id,
                      marker.frame,
                      track.trackIndex,
                    )
                  "
                  @contextmenu="
                    openExistingMarkerContextMenu(
                      $event,
                      'controlSwitch',
                      marker.id,
                      marker.frame,
                      track.trackIndex,
                      t('nextTimeline.markerLabels.controlSwitch'),
                    )
                  "
                >
                  <img
                    v-if="track.operatorSlug"
                    :src="`/operators/${track.operatorAssetSlug ?? track.operatorSlug}/avatar.webp`"
                    alt=""
                  />
                  <span>{{ displayedMarkerFrame('controlSwitch', marker.id, marker.frame) }}f</span>
                </div>
                <div
                  v-for="marker in (scenario.battle.externalEventMarkers ?? []).filter(
                    item =>
                      item.target.scope === 'operator' &&
                      item.target.trackIndex === track.trackIndex,
                  )"
                  :key="marker.id"
                  class="timeline-marker operator-event-marker"
                  :class="{
                    selected:
                      selectedMarker?.kind === 'externalEvent' && selectedMarker.id === marker.id,
                  }"
                  :style="{
                    left: `${frameToTimelinePx(displayedMarkerFrame('externalEvent', marker.id, marker.frame), scenario.battle.prepFrames, pxPerFrame)}px`,
                  }"
                  @pointerdown="
                    beginMarkerMove(
                      $event,
                      'externalEvent',
                      marker.id,
                      marker.frame,
                      track.trackIndex,
                    )
                  "
                  @contextmenu="
                    openExistingMarkerContextMenu(
                      $event,
                      'externalEvent',
                      marker.id,
                      marker.frame,
                      track.trackIndex,
                      marker.event.kind === 'operatorHit'
                        ? t('nextTimeline.markerContext.operatorHit')
                        : t('nextTimeline.markerLabels.operatorWeakness'),
                    )
                  "
                >
                  <span>{{
                    marker.event.kind === 'operatorHit'
                      ? t('nextTimeline.markerLabels.hitShort')
                      : t('nextTimeline.markerLabels.weaknessShort')
                  }}</span>
                  <b>{{ displayedMarkerFrame('externalEvent', marker.id, marker.frame) }}f</b>
                </div>
                <TimelineActionBlock
                  v-for="(cast, castIndex) in track.skillCasts"
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
                  :stack-order="castIndex"
                  :duration-pending="castActualDurationPending(cast.id, cast.durationFrames)"
                  :selected="actionSelection.selectedIds.has(cast.id)"
                  :perfect="perfectComboCastIds.has(cast.id)"
                  :moving="
                    !castMoveGesture?.committed &&
                    castMoveGesture?.dragStarted &&
                    castMoveGesture?.skillCastIds.includes(cast.id)
                  "
                  :disabled="cast.disabled"
                  :locked="cast.locked"
                  :edited="cast.edited"
                  :color="cast.color"
                  :connection-tool-enabled="connectionToolEnabled"
                  :connection-dragging="connectionDrag !== null"
                  :connection-source-action-id="connectionDrag?.skillCastId ?? null"
                  :connection-target-valid="isConnectionTargetValid(cast.id)"
                  :warning="diagnosticsByCastId.has(cast.id) || cast.resolutionIssue !== undefined"
                  :warning-text="cast.resolutionIssue ?? castWarningTitle(cast.id)"
                  :warning-fallback-text="t('common.warning')"
                  :hits="
                    timelineViewLayers.hitMarkers && isOperatorEffectsVisible(track.trackIndex)
                      ? castHitMarkers(track.trackIndex, cast.id)
                      : []
                  "
                  :time-dilation-segments="
                    timelineViewLayers.skillDecorations &&
                    isOperatorEffectsVisible(track.trackIndex)
                      ? castTimeDilationSegments(
                          cast.id,
                          cast.startFrame,
                          castActualDurationFrame(cast.id, cast.durationFrames),
                        )
                      : []
                  "
                  :custom-bars="
                    timelineViewLayers.skillDecorations &&
                    isOperatorEffectsVisible(track.trackIndex)
                      ? cast.customBars
                      : []
                  "
                  :cooldown-bars="
                    timelineViewLayers.skillDecorations &&
                    isOperatorEffectsVisible(track.trackIndex)
                      ? cooldownBarsForCast(cast.id, cast.startFrame)
                      : []
                  "
                  :enhancement-bars="
                    timelineViewLayers.skillDecorations &&
                    isOperatorEffectsVisible(track.trackIndex)
                      ? enhancementBarsForCast(
                          cast.id,
                          castActualStartFrame(cast.id, cast.startFrame),
                        )
                      : []
                  "
                  :px-per-frame="pxPerFrame"
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
                  @pointermove="updateAlignmentGuide($event, cast.id)"
                  @hover-change="setCastHovered(cast.id, $event)"
                  @contextmenu="openCastContextMenu($event, track.trackIndex, cast.id)"
                />
              </div>
              <div
                v-if="
                  buffLayoutMode === 'compact' && track.trackIndex < viewModel.tracks.length - 1
                "
                class="track-row-resizer"
                :aria-label="t('timelineGrid.toolbar.resizeTrack')"
                role="separator"
                aria-orientation="horizontal"
                @pointerdown="beginCompactTrackResize($event, track.trackIndex)"
                @dblclick.stop="resetCompactTrackPair(track.trackIndex)"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref="timelineHorizontalScrollbar"
        class="timeline-horizontal-scrollbar"
        :aria-label="t('timelineGrid.toolbar.horizontalScroll')"
        :style="{ marginRight: `${timelineVerticalScrollbarWidth}px` }"
        tabindex="0"
        @scroll="updateTimelineHorizontalScroll"
      >
        <div
          class="timeline-horizontal-scrollbar__spacer"
          :style="{ width: `${timelineWidth}px` }"
        ></div>
      </div>
    </div>
    <div
      v-if="libraryPlacement !== null && placementPointer !== null"
      class="library-placement-ghost"
      :style="{ left: `${placementPointer.x + 12}px`, top: `${placementPointer.y + 18}px` }"
    >
      <strong>{{ placementLabel }}</strong>
      <span>{{ t('timeline.shortcut.placeCancelHint') }}</span>
    </div>
    <div v-if="marqueeStyle" class="timeline-marquee" :style="marqueeStyle"></div>

    <template #bottom="{ tool }">
      <NextGlobalResourcePanel
        v-if="tool === 'global'"
        :rules="scenario.battle.resourceRules"
        :modifiers="scenario.globalConfig.modifiers"
        :labels="{
          title: t('timeline.activityBar.globalConfig'),
          maximum: t('nextTimeline.maxSp'),
          initial: t('resourceMonitor.labels.initialSp'),
          recovery: t('resourceMonitor.labels.spPerSecond'),
        }"
        @update="setBattleResourceRule"
        @set-modifiers="setGlobalModifiers"
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
            :buffs="buffSegmentsForTarget('enemy')"
            :timeline-width="timelineWidth"
            :prep-frames="scenario.battle.prepFrames"
            :px-per-frame="pxPerFrame"
            :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
            :scroll-left="timelineScrollLeft"
            :status-indicators="statusIndicatorsForTarget('enemy')"
            :cursor-frame="cursorFrame"
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
      <TimelineExternalEventInspector
        v-if="tool === 'inspector' && selectedExternalEventMarker !== null"
        :marker="selectedExternalEventMarker"
        :maximum-frame="scenario.battle.durationFrames"
        :target-label="selectedExternalEventTargetLabel"
        @set-frame="setSelectedExternalEventFrame"
        @set-event="setSelectedExternalEvent"
        @remove="removeSelectedExternalEvent"
      />
      <TimelineDocumentMarkerInspector
        v-else-if="tool === 'inspector' && selectedDocumentMarker !== null"
        :kind="selectedDocumentMarker.kind"
        :id="selectedDocumentMarker.id"
        :frame="selectedDocumentMarker.frame"
        :maximum-frame="scenario.battle.durationFrames"
        :track-index="
          selectedDocumentMarker.kind === 'controlSwitch'
            ? selectedDocumentMarker.trackIndex
            : undefined
        "
        :track-options="occupiedTrackOptions"
        @set-frame="setSelectedDocumentMarkerFrame"
        @set-track-index="setSelectedControlSwitchTrack"
        @remove="removeSelectedDocumentMarker"
      />
      <TimelineActionInspector
        v-else-if="tool === 'inspector'"
        :cast="selectedCastModel?.cast ?? null"
        :label="selectedCastModel?.label ?? ''"
        :skill-type="selectedCastModel?.skillType ?? null"
        :edited="selectedCastModel?.edited ?? false"
        :diff-count="selectedCastModel?.diffCount ?? 0"
        :template-definition="selectedCastModel?.templateDefinition ?? null"
        :current-definition="selectedCastModel?.currentDefinition ?? null"
        :maximum-frame="scenario.battle.durationFrames"
        :connections="selectedCastConnections"
        :connection-tool-enabled="connectionToolEnabled"
        @edit-definition="showSkillDefinitionEditor = true"
        @reset-definition="resetSelectedCastDefinition"
        @set-camera-target-angle="setSelectedCastCameraTargetAngle"
        @set-start-frame="setSelectedCastStartFrame"
        @set-locked="setSelectedCastLocked"
        @set-disabled="setSelectedCastDisabled"
        @set-color="setSelectedCastColor"
        @add-custom-bar="addSelectedCastCustomBar"
        @set-custom-bars="setSelectedCastCustomBars"
        @begin-connection="beginSelectedCastConnection"
        @remove-connection="deleteTimelineConnection"
        @update-connection="updateSelectedCastConnection"
      />
      <NextBattleLogPanel
        v-else
        :entries="simulationRun?.receiptEntries ?? []"
        :event-label="battleReceiptEventLabel"
        :damage-type-label="damageElementLabel"
        @locate="locateBattleLogEntry"
        :cast-owners="battleLogCastOwners"
      />
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
  <TimelineMarkerContextMenu
    :visible="markerContextTarget !== null"
    :x="markerContextTarget?.x ?? 0"
    :y="markerContextTarget?.y ?? 0"
    :frame="markerContextTarget?.frame ?? 0"
    :can-target-track="scenario.tracks[markerContextTarget?.trackIndex ?? selectedTrack] !== null"
    :has-simulation-start="scenario.battle.simulationRange?.startFrame !== undefined"
    :has-simulation-end="scenario.battle.simulationRange?.endFrame !== undefined"
    :existing-label="markerContextTarget?.existing?.label"
    :labels="{
      title: t('nextTimeline.markerContext.title'),
      deleteMarker: t('nextTimeline.markerContext.deleteMarker'),
      addCycle: t('nextTimeline.markerContext.addCycle'),
      addSimulationStart: t('nextTimeline.markerContext.addSimulationStart'),
      removeSimulationStart: t('nextTimeline.markerContext.removeSimulationStart'),
      addSimulationEnd: t('nextTimeline.markerContext.addSimulationEnd'),
      removeSimulationEnd: t('nextTimeline.markerContext.removeSimulationEnd'),
      switchOperator: t('nextTimeline.markerContext.switchOperator'),
      restrictedHint: t('nextTimeline.markerContext.restrictedHint'),
      operatorHit: t('nextTimeline.markerContext.operatorHit'),
      operatorWeakness: t('nextTimeline.markerContext.operatorWeakness'),
      teamHit: t('nextTimeline.markerContext.teamHit'),
    }"
    @close="markerContextTarget = null"
    @add-cycle="addMarkerFromContext('cycle')"
    @toggle-simulation-start="addMarkerFromContext('simulationStart')"
    @toggle-simulation-end="addMarkerFromContext('simulationEnd')"
    @add-switch="addMarkerFromContext('switch')"
    @add-operator-hit="addMarkerFromContext('operatorHit')"
    @add-operator-weakness="addMarkerFromContext('operatorWeakness')"
    @add-team-hit="addMarkerFromContext('teamHit')"
    @delete="removeMarkerFromContext"
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
    :buff-ids="selectedCastBuffIds"
    @update:visible="showSkillDefinitionEditor = $event"
    @save="saveSelectedCastDefinition"
    @reset="resetSelectedCastDefinition"
  />
  <TimelineHitDetailDialog
    :visible="hitDetailTarget !== null"
    :force-critical="hitDetailForceCritical"
    :entries="hitDetail?.entries ?? []"
    :damage-type-label="damageElementLabel"
    :skill-type-label="skillTypeLabel"
    :labels="{
      dialogTitle: t('hitDetail.title'),
      context: t('hitDetail.context'),
      result: t('hitDetail.result'),
      base: t('hitDetail.base'),
      multipliers: t('hitDetail.multipliers'),
      skillType: t('hitDetail.skillType'),
      element: t('hitDetail.element'),
      expectedDamage: t('hitDetail.expectedDamage'),
      forcedDamage: t('hitDetail.forcedDamage'),
      forceCrit: t('hitDetail.forceCrit'),
      criticalDamage: t('hitDetail.critDamage'),
      nonCriticalDamage: t('hitDetail.nonCritDamage'),
      attack: t('hitDetail.attack'),
      basicTotal: t('statDetail.basicTotal'),
      baseAttack: t('statDetail.baseAtk'),
      operatorAttack: t('statDetail.operatorAtk'),
      weaponAttack: t('statDetail.weaponAtk'),
      attackBonus: t('statDetail.atkBonus'),
      flatAttack: t('statDetail.flatAtk'),
      percentageAttack: t('statDetail.percentageAtk'),
      attributeBonus: t('statDetail.attributeBonus'),
      attributeLabel: (attribute: string) => t(`stats.${attribute}`),
      fromSource: (name: string) => t('statDetail.fromSource', { name }),
      skillMultiplier: t('hitDetail.multiplier'),
      baseDamage: t('hitDetail.baseDamage'),
      damageBonus: t('hitDetail.dmgBonus'),
      criticalExpectation: t('hitDetail.critMult'),
      directMultiplier: t('hitDetail.directMult'),
      damageTaken: t('hitDetail.dmgTaken'),
      defenseMultiplier: t('hitDetail.defMult'),
      resistanceMultiplier: t('hitDetail.resMult'),
      defenseDetail: (value: number) => t('hitDetail.defDetail', { def: value }),
    }"
    @close="hitDetailTarget = null"
    @toggle-force-critical="toggleHitDetailForceCritical"
  />
  <NextDamageAnalysisDialog
    :visible="showDamageAnalysis"
    :analysis="damageAnalysis"
    :locale="locale"
    :labels="{
      title: t('timeline.analysis.dialogTitle'),
      warning: t('timeline.analysis.warning'),
      noData: t('timeline.analysis.noData'),
      damageByOperator: t('timeline.analysis.damageByOperator'),
      contributionByOperator: t('timeline.analysis.contributionByOperator'),
      damageByElement: t('timeline.analysis.damageByElement'),
      totalDamage: t('timeline.analysis.totalDamage'),
      rotationTime: t('timeline.analysis.rotationTime'),
      dps: t('timeline.analysis.dps'),
      unattributedDamage: (value: string) => t('timeline.analysis.unattributedDamage', { value }),
      contributionUnavailable: t('timeline.analysis.contributionUnavailable'),
    }"
    @update:visible="showDamageAnalysis = $event"
  />
  <TimelineShortcutHelpDialog
    :visible="showShortcutHelp"
    @update:visible="showShortcutHelp = $event"
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
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  scrollbar-width: none;
}

.skill-sidebar::-webkit-scrollbar {
  display: none;
}

.library-header {
  display: flex;
  flex-direction: column;
}

.library-header__main {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.operator-heading {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 18px;
  text-align: left;
}

.library-header__divider {
  height: 2px;
  margin-top: 3px;
  background: linear-gradient(90deg, var(--ea-gold) 0%, transparent 100%);
  opacity: 0.3;
}

.operator-heading__mark {
  width: 4px;
  height: 18px;
  background: var(--ea-gold);
}

.sidebar-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 6px;
}

.sidebar-tabs button {
  min-width: 0;
  padding: 0 4px;
  font-size: 12px;
  white-space: nowrap;
}

.library-section-title {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  border-left: 2px solid #444;
}

.library-section-title strong {
  color: var(--ea-fg);
  font-size: 14px;
}

.library-section-title span {
  color: var(--ea-fg-secondary);
  font-size: 10px;
}

.library-section-title--status {
  margin-top: 12px;
}

.skill-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  display: grid;
  grid-template-rows: minmax(0, 1fr) 12px;
  overflow: hidden;
}

.timeline-marquee {
  position: fixed;
  z-index: 100;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 50%);
  --marquee-horizontal: linear-gradient(to right, rgb(255 255 255 / 90%) 60%, transparent 60%);
  --marquee-vertical: linear-gradient(to bottom, rgb(255 255 255 / 90%) 60%, transparent 60%);
  background-image:
    var(--marquee-horizontal), var(--marquee-horizontal), var(--marquee-vertical),
    var(--marquee-vertical);
  background-position: top, bottom, left, right;
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size:
    10px 1px,
    10px 1px,
    1px 10px,
    1px 10px;
  pointer-events: none;
}

.timeline-scroll {
  grid-row: 1;
  width: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.timeline-horizontal-scrollbar {
  grid-row: 2;
  min-width: 0;
  height: 12px;
  margin-left: 180px;
  overflow-x: auto;
  overflow-y: hidden;
  opacity: 0.7;
  transition: opacity 200ms ease;
}

.timeline-horizontal-scrollbar:hover,
.timeline-horizontal-scrollbar:focus-visible {
  opacity: 1;
}

.timeline-horizontal-scrollbar__spacer {
  height: 1px;
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
  background-position-x: var(--timeline-grid-origin);
  background-size: var(--timeline-grid-step) 100%;
}

.timeline-surface.is-library-placing .track-lane {
  cursor: copy;
}

.library-placement-ghost {
  position: fixed;
  z-index: 10001;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 130px;
  padding: 7px 9px;
  border: 1px solid var(--ea-gold);
  background: rgb(20 20 22 / 94%);
  box-shadow: 0 5px 16px rgb(0 0 0 / 55%);
  color: var(--ea-fg);
  font-size: 11px;
  pointer-events: none;
}

.library-placement-ghost span {
  color: var(--ea-fg-muted);
  font-size: 9px;
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

.timeline-battle-start-boundary {
  position: absolute;
  z-index: 11;
  top: 76px;
  bottom: 0;
  width: 14px;
  margin-left: -7px;
  cursor: ew-resize;
  touch-action: none;
}

.timeline-battle-start-boundary::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6px;
  width: 2px;
  background: var(--ea-mark-strong, rgba(255, 255, 255, 0.38));
  pointer-events: none;
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

.alignment-guide {
  position: absolute;
  z-index: 20;
  width: 1px;
  border-left: 2px solid currentColor;
  box-shadow: 0 0 7px currentColor;
  pointer-events: none;
}

.alignment-guide::after {
  content: '';
  position: absolute;
  inset: 0 -6px;
  border-top: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  background: color-mix(in srgb, currentColor 9%, transparent);
}

.alignment-guide span {
  position: absolute;
  left: 6px;
  top: -21px;
  padding: 2px 5px;
  border: 1px solid currentColor;
  background: var(--ea-tooltip-bg);
  color: currentColor;
  font-size: 10px;
  white-space: nowrap;
}

.timeline-marker {
  position: absolute;
  z-index: 8;
  box-sizing: border-box;
  user-select: none;
  cursor: ew-resize;
}

.simulation-range-dim {
  position: absolute;
  z-index: 7;
  top: 76px;
  bottom: 0;
  background: rgb(0 0 0 / 38%);
  pointer-events: none;
}

.simulation-range-dim--end {
  right: 0;
}

.simulation-range-marker {
  top: 76px;
  bottom: 0;
  width: 1px;
  border-left: 2px solid #5b9bd5;
  box-shadow: 0 0 5px rgb(91 155 213 / 55%);
}

.simulation-range-marker--end {
  border-left-color: #d46b5f;
  box-shadow: 0 0 5px rgb(212 107 95 / 55%);
}

.simulation-range-marker::after {
  content: '';
  position: absolute;
  inset: 0 -6px;
}

.simulation-range-marker > span,
.simulation-range-marker > b {
  position: absolute;
  left: 5px;
  padding: 2px 4px;
  background: rgb(12 34 52 / 94%);
  color: #b9dcff;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

.simulation-range-marker--end > span,
.simulation-range-marker--end > b {
  background: rgb(58 24 20 / 94%);
  color: #ffc1ba;
}

.simulation-range-marker > span {
  top: 40px;
}

.simulation-range-marker > b {
  top: 58px;
}

.cycle-boundary-marker,
.team-event-marker {
  top: 76px;
  bottom: 0;
  width: 1px;
  border-left: 1px solid rgb(0 0 0 / 82%);
  box-shadow: -1px 0 rgb(255 255 255 / 8%);
}

.team-event-marker {
  border-left: 1px dashed #ff7875;
  box-shadow: none;
}

.cycle-boundary-marker::after,
.team-event-marker::after {
  content: '';
  position: absolute;
  inset: 0 -5px;
}

.cycle-boundary-marker > span,
.cycle-boundary-marker > b,
.team-event-marker > span,
.team-event-marker > b {
  position: absolute;
  left: 4px;
  padding: 2px 4px;
  background: rgb(0 0 0 / 82%);
  color: #ddd;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
}

.cycle-boundary-marker > span,
.team-event-marker > span {
  top: 2px;
}
.cycle-boundary-marker > b,
.team-event-marker > b {
  top: 20px;
}
.team-event-marker > span,
.team-event-marker > b {
  background: rgb(80 16 20 / 92%);
  color: #ffccc7;
}

.track-switch-marker {
  top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 5px 2px 2px;
  border: 1px solid var(--ea-border-strong);
  border-radius: 14px 3px 3px 14px;
  background: rgb(16 16 18 / 92%);
  color: var(--ea-fg-secondary);
  font-size: 10px;
  transform: translateX(-12px);
}

.track-switch-marker::after {
  content: '';
  position: absolute;
  left: 11px;
  top: 100%;
  height: 20px;
  border-left: 1px solid var(--ea-border-strong);
}

.track-switch-marker img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.operator-event-marker {
  top: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 5px;
  border: 1px solid #a61d24;
  border-radius: 3px;
  background: rgb(64 12 16 / 92%);
  color: #ffccc7;
  font-size: 10px;
  transform: translateX(-50%);
}

.operator-event-marker::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  height: 14px;
  border-left: 1px dashed #ff7875;
}

.timeline-marker.selected {
  outline: 2px solid var(--ea-gold);
  outline-offset: 2px;
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

.track-stack {
  width: fit-content;
  min-width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
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
  height: var(--timeline-track-height, 160px);
  overflow: hidden;
}

.track-lane::before {
  content: '';
  position: absolute;
  z-index: 0;
  top: var(--timeline-action-guide-top, 53px);
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

.track-row-resizer {
  position: absolute;
  z-index: 40;
  right: 0;
  bottom: -5px;
  left: 0;
  height: 10px;
  cursor: ns-resize;
  touch-action: none;
}

.track-row-resizer::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 0;
  left: 0;
  height: 1px;
  background: var(--ea-active-fill);
  opacity: 0;
  transition: opacity 120ms ease;
}

.track-row-resizer:hover::after,
.track-row-resizer:focus-visible::after {
  opacity: 1;
}

:global(html.is-next-track-resizing),
:global(html.is-next-track-resizing *) {
  cursor: ns-resize !important;
  user-select: none !important;
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
  width: 2px;
  background: var(--ea-mark-strong);
  transform: translateX(-1px);
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
