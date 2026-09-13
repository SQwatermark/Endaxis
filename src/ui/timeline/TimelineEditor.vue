<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onScopeDispose,
  provide,
  ref,
  shallowRef,
  watch,
  toRaw,
} from 'vue';
import { durationBarColorKey } from './durationBarColorContext';
import {
  provideInteractionSession,
  useInteractionBarrier,
} from '../interaction/interactionSessionContext';
import type { InteractionLease } from '../interaction/interactionSession';
import { observeNativeDragLifetime } from '../interaction/nativeDragLifecycle';
import { useAsyncModalBoundary } from '../interaction/useAsyncModalBoundary';
import { isInsideTimelineDropRegion } from './timelineDropRegion';
import { normalizeDurationBarColorPrefs } from './durationBarColor';
import { useI18n } from 'vue-i18n';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { EaButton } from '@/design-system';
import { useAppearance } from '../../composables/useAppearance';
import { formatTimeWithFrames } from '../../utils/time';
import { ELEMENT_COLORS } from '../../utils/theme';
import { ALL_GAME_TEXT_FAMILIES, setLocale } from '../../i18n';
import {
  getEnemyGameName,
  getGearPieceGameName,
  getGearSetGameName,
  getOperatorCombatSkillName,
  getOperatorFormName,
  getOperatorGameName,
  getOperatorPotentialName,
  getOperatorTalentName,
  getWeaponGameName,
} from '../gameText';
import SkillLibraryCard from './components/SkillLibraryCard.vue';
import {
  createLibraryDragGhost,
  getDefaultLibraryDragOffsets,
  removeLibraryDragGhost,
} from '../../utils/libraryDragGhost';
import GearSelectionDialog from './components/GearSelectionDialog.vue';
import GearLoadoutBuildDialog from './components/GearLoadoutBuildDialog.vue';
import GearDefinitionWorkspaceDialog from './components/GearDefinitionWorkspaceDialog.vue';
import GearSetDefinitionWorkspaceDialog from './components/GearSetDefinitionWorkspaceDialog.vue';
import OperatorPanelDialog from './components/OperatorPanelDialog.vue';
import OperatorBuildDialog from './components/OperatorBuildDialog.vue';
import OperatorDefinitionWorkspaceDialog from './components/OperatorDefinitionWorkspaceDialog.vue';
import WeaponBuildDialog from './components/WeaponBuildDialog.vue';
import WeaponDefinitionWorkspaceDialog from './components/WeaponDefinitionWorkspaceDialog.vue';
import OperatorSelectionDialog from './components/OperatorSelectionDialog.vue';
import WeaponSelectionDialog from './components/WeaponSelectionDialog.vue';
import TimelineActionBlock from './components/TimelineActionBlock.vue';
import TimelineSkillCastGroupMarker from './components/TimelineSkillCastGroupMarker.vue';
import TimelineActionContextMenu from './components/TimelineActionContextMenu.vue';
import TimelineActionInspector from './components/TimelineActionInspector.vue';
import TimelineLibrarySkillInspector from './components/TimelineLibrarySkillInspector.vue';
import TimelineExternalEventInspector from './components/TimelineExternalEventInspector.vue';
import TimelineDocumentMarkerInspector from './components/TimelineDocumentMarkerInspector.vue';
import SkillDefinitionEditorDialog from './components/SkillDefinitionEditorDialog.vue';
import TimelineCornerToolbar from './components/TimelineCornerToolbar.vue';
import TimelineConnectionLayer from './components/TimelineConnectionLayer.vue';
import TimelineCursorGuide, {
  type TimelineCursorGaugeRow,
} from './components/TimelineCursorGuide.vue';
import TimelineHeaderToolbar from './components/TimelineHeaderToolbar.vue';
import TimelineExportDialog from './components/TimelineExportDialog.vue';
import TimelineSmallImageExportDialog from './components/TimelineSmallImageExportDialog.vue';
import type { TimelineShareTrack } from './components/TimelineShareCard.vue';
import TimelineRuler from './components/TimelineRuler.vue';
import TimelineTrackHeader from './components/TimelineTrackHeader.vue';
import OperatorAvatar from '../components/OperatorAvatar.vue';
import TimelineWorkbenchShell from './components/TimelineWorkbenchShell.vue';
import TimelineResourceCurves from './components/TimelineResourceCurves.vue';
import TimelineSimulationErrorNotice from './components/TimelineSimulationErrorNotice.vue';
import TimelineTrackGauge from './components/TimelineTrackGauge.vue';
import TimelineTimeDilationBands from './components/TimelineTimeDilationBands.vue';
import TimelineEnemyEffects from './components/TimelineEnemyEffects.vue';
import TimelineEnemyStatusSections from './components/TimelineEnemyStatusSections.vue';
import TimelineBuffBands from './components/TimelineBuffBands.vue';
import TimelineBuffDetailDialog from './components/TimelineBuffDetailDialog.vue';
import type { BuffDetailTarget } from './buffDetail';
import TimelineOperatorPassiveUiBands from './components/TimelineOperatorPassiveUiBands.vue';
import {
  projectTimelineTrackEffectLayout,
  resizeTimelineTrackPair,
  resolveCompactTrackHeights,
  TIMELINE_TRACK_BASE_HEIGHT,
  TIMELINE_TRACK_MIN_HEIGHT,
} from './timelineTrackEffectLayout';
import TimelineComboWindowBands from './components/TimelineComboWindowBands.vue';
import SimulationPerformanceAudit from './components/SimulationPerformanceAudit.vue';
import EnemySettingsPanel from './components/EnemySettingsPanel.vue';
import GlobalResourcePanel from './components/GlobalResourcePanel.vue';
import ContingencyContractPanel from './components/ContingencyContractPanel.vue';
import { CONTINGENCY_CONTRACT_MECHANIC_PREFIX } from '../../data/mechanics/contingencyContractAdapter';
import { contingencyContractMechanicId } from '../../data/mechanics/contingencyContractCatalog';
import {
  formatContingencyContractBuffSourceName,
  localizedContingencyContractTagName,
  resolveContingencyContractBuffPresentation,
} from './contingencyContractBuffPresentation';
import {
  ActiveScenarioEditorSession,
  ProjectEditorSession,
} from '../../application/editor/projectEditorSession';
import { AdaptiveTimelineSimulationService } from '../../application/adaptiveTimelineSimulationService';
import { createEditorSimulationService } from '../../application/editorSimulationService';
import { WorkerScenarioSimulationService } from '../../application/workerScenarioSimulationService';
import { useScenarioSimulation } from './useScenarioSimulation';
import { projectCombatHudSnapshot } from '../../core/projection/combatHudSnapshot';
import { resolveTimelineWheelIntent } from './timelineWheel';
import { projectActiveGearSetLabels } from './activeGearSetHint';
import { passedTimelineDragThreshold } from './timelineDragThreshold';
import { projectTimelineEdgeAutoScrollDelta } from './timelineEdgeAutoScroll';
import { resolveTimelineMarkerPointerFrame } from './timelineMarkerMoveGeometry';
import { resolveOperatorPanelContributionSourceLabel } from './operatorPanelContributionPresentation';
import type { OperatorPanelContributionReceipt } from '../../core/compiler/resolveOperatorPanel';
import { projectEnemyEffectViz } from '../../core/projection/enemyEffectViz';
import { elementalAttachments } from '../../data/buffs/elementalAttachments';

import { SINGLE_ENEMY_TARGET_ID } from '../../core/projection/enemyHealthChangePoints';
import { projectPoiseBrokenSegments } from '../../core/projection/poiseCurves';
import { projectComboWindowTimelineViz } from '../../core/projection/comboWindowTimelineViz';
import { projectSkillCooldownTimelineViz } from '../../core/projection/skillCooldownTimelineViz';
import { projectTimelineComboCooldowns } from '../../core/projection/timelineComboCooldowns';
import { projectSkillEnhancementTimelineViz } from '../../core/projection/skillEnhancementTimelineViz';
import { resolveControlTimeline } from '../../core/project/resolveControlTimeline';
import {
  getSkillCastPlacementAnchor,
  getSkillCastPlacementChains,
  resolveSkillCastStartFrames,
} from '../../core/project/skillCastPlacement';
import {
  layoutBuffTimelineSegments,
  mergeOverlappingBuffTimelineSegments,
  projectBuffTimelineViz,
  type BuffTimelineSegment,
  type PositionedDisplayBuffTimelineSegment,
} from '../../core/projection/buffTimelineViz';
import {
  layoutOperatorPassiveUiTimelineSegments,
  projectOperatorPassiveUiTimelineViz,
  type OperatorPassiveUiTimelineSegment,
  type PositionedOperatorPassiveUiTimelineSegment,
} from '../../core/projection/operatorPassiveUiTimelineViz';
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
  replaceProjectOperatorTemplateDefinition,
  replaceProjectWeaponTemplateDefinition,
  switchTrackToCompatibleOperatorTemplate,
  switchTrackToCompatibleGearTemplate,
  switchTrackToCompatibleWeaponTemplate,
} from '../../core/project/projectDefinitionLibrary';
import { createEmptyProject } from '../../core/project/createProject';
import convertedLegacyDefaultProject from '../../../tmp/public-6aa244-sim-retimed-20260913/project.json';
import { parseProjectDocument, serializeProjectDocument } from '../../core/project/serialization';
import { openProject } from '../../application/openProject';
import { downloadProjectJson } from './downloadProjectJson';
import {
  captureTimelineLongImage,
  compressProjectCode,
  downloadBlob,
  imageFilename,
  projectFilename,
} from './timelineExport';
import { createProjectFileReader } from './projectFileReader';
import { projectOpenFailureMessage } from './projectOpenFailureMessage';
import { gameDataRepository } from '../../data/gameDataRepository';
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
import {
  getIconAssetPath,
  getOperatorAvatarPath,
  getOperatorSkillIconPath,
  getWeaponActionIconPath,
} from '../gameAssetPaths';
import { groupPlacedSkillSequence, placeLibrarySkillGroup } from './placeSkillGroup';
import { resolveOperatorPresentationFormKey } from './operatorFormPresentation';
import { SkillPlacementTransaction } from './skillPlacementTransaction';
import {
  resolveCompactSkillSelection,
  compactSkillSelectionByWidths,
} from './compactSkillSelection';
import {
  layoutSkillGroupPlacement,
  resolveSkillGroupPlacementSkills,
  skillPlacementDisplayFrames,
} from './skillGroupPlacement';
import { createProjectDocumentIdAllocator } from './projectDocumentIdAllocator';
import {
  projectTimelineEditor,
  type TimelineSkillLibraryEntryViewModel,
} from './timelineEditorViewModel';
import {
  COLLAPSED_PREP_WIDTH_PX,
  frameToTimelinePx,
  resolveTimelineCursorGuidePosition,
  timelinePxToExactFrame,
  timelinePxToFrame,
  timelineTotalWidth,
} from './timelineGeometry';
import {
  projectCastTimeDilationSegments,
  projectSkillCastActualDurationFrames,
  projectSkillCastActualStartFrames,
  projectSkillCastInterruptionFrames,
  projectTimelineTimeDilationBands,
} from './timelineDisplayTime';
import { useTimelineLoadoutEditor } from './useTimelineLoadoutEditor';
import { timelineVisibleSkillEnds } from './timelineVisibleSkillEnds';
import {
  expandSkillCastGroupSelection,
  matchingPublishedSkillCastIds,
  projectCompatibleHitFrames,
  projectMovingSkillCastStartFrames,
  projectSkillCastInputFacts,
  resolveSkillCastGroupSelection,
} from './skillCastGroupInteraction';
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
  createSkillCastGroup,
  dissolveSkillCastGroups,
  moveSkillCasts,
  moveSkillCast,
  swapTimelineTracks,
  setSkillCastLocked,
  setSkillCastDisabled,
  setSkillCastColor,
  setSkillCastCustomBars,
  setSkillCastCameraTargetAngle,
  setSkillCastRandomSeed,
  setSkillCastForcedCritical,
  setSkillCastCustomDefinition,
  resetSkillCastToTemplate,
  updateBattleResourceRule,
  setBattleDurationFrames,
  setBattlePrepFrames,
  setTimelinePrepExpanded,
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
  useKeyboardInputRegion,
} from '../keyboard/keyboardShortcutRouter';
import {
  skillLibrarySegmentLabel,
  timelineSkillBlockLabel,
  timelineSkillSegmentLabel,
  type TimelineSkillSegmentLabels,
} from './timelineSkillLabels';
import {
  MAX_PROJECT_SCENARIOS,
  resetProjectScenarios,
  type TimelineResetMode,
  addProjectScenario,
  deleteActiveScenario,
  duplicateActiveScenario,
  renameActiveScenario,
  scenariosDependingOn,
  switchProjectScenario,
} from './scenarioProjectCommands';
import TimelineResetDialog from './components/TimelineResetDialog.vue';
import { useTimelineMarqueeGesture } from './useTimelineMarqueeGesture';
import { useTimelineViewportPan } from './useTimelineViewportPan';
import { handleTimelineEditorShortcut } from './timelineKeyboardShortcuts';
import {
  COARSE_TIMELINE_SNAP_FRAMES,
  PRECISE_TIMELINE_SNAP_FRAMES,
  snapTimelineFrame,
} from './timelineSnap';
import { findAdjacentOccupiedTrack } from './timelineTrackSelection';
import { resolveTimelineCastMovePointerFrame } from './timelineCastMoveGeometry';
import { resolveTimelineLibraryDropFrame } from './timelineLibraryDropGeometry';
import {
  resolveTimelineCastAlignmentFrame,
  type TimelineCastAlignmentMode,
} from './timelineCastAlignment';
import {
  normalizeTimelineZoomPercent,
  timelinePxPerFrame,
  wheelTimelineZoomPercent,
} from './timelineZoom';
import type { TimelineOperationMarkerInput } from './timelineOperationMarkers';
import { projectRossiComboSuccessCastIds } from '../operators/rossi/comboSuccessEvidence';
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
  projectTimelineHitReceipts,
  projectTimelineHitOccurrences,
  type TimelineHitEffectLabel,
} from './timelineHitEffects';
import TimelineHitDetailDialog from './components/TimelineHitDetailDialog.vue';
import { projectPublishedHitDetail } from './publishedHitDetail';
import { layoutEnemyDamageHits } from './enemyDamageHitLayout';
import { useSimulationReceiptSelection } from './useSimulationReceiptSelection';
import { resolveBuffDisplayName } from './buffDisplayName';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import DamageAnalysisDialog from './components/DamageAnalysisDialog.vue';
import BattleLogPanel from './components/BattleLogPanel.vue';
import type { TimelineBattleLogSnapshot } from './timelineBattleLogProjection';
import { capturePublishedBattleLog } from './publishedBattleLog';
import { capturePublishedWeaponSources, resolvePublishedBuffSource } from './publishedBuffSource';
import { isEnemyTimelineBuffVisible } from './enemyStatusRows';
import {
  capturePublishedOperatorMetadata,
  type PublishedOperatorMetadata,
} from './publishedOperatorMetadata';
import TimelineShortcutHelpDialog from './components/TimelineShortcutHelpDialog.vue';
import TimelineMarkerContextMenu from './components/TimelineMarkerContextMenu.vue';
import { projectPublishedTimelineDamageAnalysis } from './timelineDamageAnalysis';
import {
  TIMELINE_VIEW_LAYER_IDS,
  normalizeTimelineViewLayers,
  toggleTimelineViewLayerState,
  type TimelineViewLayerId,
} from './timelineViewLayers';
import {
  normalizeTimelineOperatorEffectsVisibility,
  toggleTimelineOperatorEffectsVisibility,
} from './timelineOperatorEffectsVisibility';
import {
  ABILITY_ENTITY_SAMPLE_CAST_ID,
  ABILITY_ENTITY_SAMPLE_TRACK_INDEX,
} from './timelineSampleScenario';

const { t, te, locale } = useI18n({ useScope: 'global' });
const { appearance, setAppearance } = useAppearance();
const TIMELINE_TRACK_HEADER_WIDTH = 180;
const TIMELINE_RULER_HEIGHT = 60;
const INTERACTIVE_SIMULATION_BUDGET_MS = 1000 / 60;
const timelineZoomPercent = ref(100);
const pxPerFrame = computed(() => timelinePxPerFrame(timelineZoomPercent.value));
const CURSOR_GUIDE_STORAGE_KEY = 'endaxis:timeline-cursor-guide:v1';
const showCursorGuide = ref(window.localStorage.getItem(CURSOR_GUIDE_STORAGE_KEY) === 'true');
watch(showCursorGuide, visible =>
  window.localStorage.setItem(CURSOR_GUIDE_STORAGE_KEY, String(visible)),
);
const boxSelectEnabled = ref(false);
const connectionToolEnabled = ref(false);
const AUTO_GROUP_BASIC_ATTACK_STORAGE_KEY = 'endaxis:timeline-auto-group-basic-attack-sequences:v1';
const autoGroupBasicAttackSequences = ref(
  window.localStorage.getItem(AUTO_GROUP_BASIC_ATTACK_STORAGE_KEY) !== 'false',
);
watch(autoGroupBasicAttackSequences, enabled =>
  window.localStorage.setItem(AUTO_GROUP_BASIC_ATTACK_STORAGE_KEY, String(enabled)),
);
const BUFF_LAYOUT_STORAGE_KEY = 'endaxis:timeline-buff-layout:v1';
const TRACK_HEIGHTS_STORAGE_KEY = 'endaxis:timeline-compact-track-heights:v1';
const buffLayoutMode = ref<'compact' | 'loose'>(
  window.localStorage.getItem(BUFF_LAYOUT_STORAGE_KEY) === 'loose' ? 'loose' : 'compact',
);
watch(buffLayoutMode, mode => {
  window.localStorage.setItem(BUFF_LAYOUT_STORAGE_KEY, mode);
  if (mode !== 'compact') return;
  void nextTick(() => {
    if (timelineScroll.value !== null) timelineScroll.value.scrollTop = 0;
    timelineScrollTop.value = 0;
  });
});
const DURATION_COLOR_STORAGE_KEY = 'endaxis:timeline-duration-bar-color:v1';
const durationBarColor = ref(
  normalizeDurationBarColorPrefs(
    (() => {
      try {
        return JSON.parse(window.localStorage.getItem(DURATION_COLOR_STORAGE_KEY) ?? 'null');
      } catch {
        return undefined;
      }
    })(),
  ),
);
provide(durationBarColorKey, durationBarColor);
watch(
  durationBarColor,
  value => {
    try {
      window.localStorage.setItem(DURATION_COLOR_STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* Display settings remain usable when browser storage is unavailable. */
    }
  },
  { deep: true },
);
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
const VIEW_LAYERS_STORAGE_KEY = 'endaxis:timeline-view-layers:v1';
function loadTimelineViewLayers() {
  try {
    const raw = window.localStorage.getItem(VIEW_LAYERS_STORAGE_KEY);
    return normalizeTimelineViewLayers(raw === null ? null : JSON.parse(raw));
  } catch {
    return normalizeTimelineViewLayers(null);
  }
}
const timelineViewLayers = ref(loadTimelineViewLayers());
watch(
  timelineViewLayers,
  layers => window.localStorage.setItem(VIEW_LAYERS_STORAGE_KEY, JSON.stringify(layers)),
  { deep: true },
);
function toggleTimelineViewLayer(layerId: TimelineViewLayerId): void {
  timelineViewLayers.value = toggleTimelineViewLayerState(timelineViewLayers.value, layerId);
}
const OPERATOR_EFFECTS_STORAGE_KEY = 'endaxis:timeline-operator-effects:v1';
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
const showExportDialog = ref(false);
const showSmallImageExport = ref(false);
const smallImageExportInitial = ref({ filename: '', duration: 60 });
const showShortcutHelp = ref(false);
const buffDetailTarget = ref<BuffDetailTarget | null>(null);
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
const timelineScrollTop = ref(0);
const timelineViewportWidth = ref(1200);
const timelineViewportHeight = ref(0);
const displayedCompactTrackHeights = computed(() =>
  resolveCompactTrackHeights(
    compactTrackHeights.value,
    timelineViewportHeight.value - TIMELINE_RULER_HEIGHT,
  ),
);
const timelineVerticalScrollbarWidth = ref(0);
let timelineResizeObserver: ResizeObserver | null = null;
const connectionDrag = ref<{
  pointerId: number;
  lease: InteractionLease;
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
const workbenchInputRegion = useKeyboardInputRegion({
  label: 'timeline-workbench',
  parent: null,
  active: () => true,
});
const interactionSession = provideInteractionSession(workbenchInputRegion);
const serviceModalBoundary = useAsyncModalBoundary(interactionSession, workbenchInputRegion);
let libraryDragLease: InteractionLease | null = null;
let disposeLibraryDragLifetime: (() => void) | null = null;
const trackDropRegions = new Map<TrackIndex, HTMLElement>();
function registerTrackDropRegion(trackIndex: TrackIndex, element: unknown): void {
  if (element instanceof HTMLElement) trackDropRegions.set(trackIndex, element);
  else trackDropRegions.delete(trackIndex);
}
let libraryPlacementLease: InteractionLease | null = null;
let trackOrderLease: InteractionLease | null = null;
const selectedLibrarySkill = ref<{ entryKey: string; skillKey?: string } | null>(null);
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
  readonly pointerCastId: string;
  readonly skillCastIds: readonly string[];
  readonly baseStartFrames: ReadonlyMap<string, number>;
  readonly pointerOffsetActualFrames: number;
  readonly initialPointerX: number;
  readonly initialPointerY: number;
  latestPointerX: number;
  latestPointerY: number;
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
  latestPointerX: number;
  latestPointerY: number;
  dragStarted: boolean;
  kind: TimelineMarkerKind;
  id: string;
  initialFrame: number;
  previewFrame: number;
} | null>(null);
let stopMarkerMove: (() => void) | null = null;
let markerMoveAutoScrollFrame: number | null = null;

/** 初始方案只在挂载时读取；编辑会话不回写调用方传入的对象。 */
const props = defineProps<{ initialScenario?: ScenarioDocument; initialProject?: unknown }>();
const convertedDefault = parseProjectDocument(convertedLegacyDefaultProject, {
  gameDataRepository,
});
if (!convertedDefault.ok) throw new Error('临时默认转换轴未通过项目校验');
const suppliedProject =
  props.initialProject === undefined
    ? undefined
    : parseProjectDocument(props.initialProject, { gameDataRepository });
if (suppliedProject !== undefined && !suppliedProject.ok)
  throw new Error('临时预览轴未通过项目校验');
const initialProject = suppliedProject?.ok
  ? structuredClone(suppliedProject.value)
  : props.initialScenario === undefined
    ? structuredClone(convertedDefault.value)
    : createEmptyProject({
        projectId: 'sample',
        createdWith: 'endaxis',
        gameDataRevision: gameDataRepository.revision,
      });
if (props.initialScenario !== undefined) {
  const initialScenario = structuredClone(toRaw(props.initialScenario));
  initialProject.activeScenarioId = initialScenario.id;
  initialProject.scenarios = [initialScenario];
}
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
  projectPublishedTimelineDamageAnalysis(
    publishedSimulation.value,
    publishedOperatorName,
    damageElementLabel,
    slug => {
      const element = slug === null ? undefined : publishedOperators.value.get(slug)?.element;
      return element === 'physical' ? '#c9c9c9' : (ELEMENT_COLORS[element ?? ''] ?? '#888888');
    },
    damageType =>
      damageType === 'physical' ? '#c9c9c9' : (ELEMENT_COLORS[damageType] ?? '#888888'),
  ),
);
const publishedRandomMode = computed(
  () => publishedSimulation.value?.scenario.battle.random?.mode ?? 'expected',
);
const publishedGlobalRandomSeed = computed(
  () => publishedSimulation.value?.scenario.battle.random?.globalSeed ?? 0,
);
const ids = createProjectDocumentIdAllocator(() => projectSession.snapshot.project);
const savedProjectSnapshot = shallowRef(initialProject);
const projectFileReader = createProjectFileReader(() => projectSession.snapshot.revision);
onScopeDispose(() => projectFileReader.dispose());
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
  // 复制方案可以保留内部ID；切换、撤销和重做都按方案身份清理，不能靠技能ID变化碰巧清空。
  if (snapshot.scenario.id !== scenario.value.id) resetTransientScenarioUi();
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
  finishSkillDrag();
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

async function requestOpenProject(): Promise<void> {
  if (projectDirty.value) {
    try {
      await serviceModalBoundary.run(() =>
        ElMessageBox.confirm('当前项目有尚未导出的修改。继续加载会替换整个项目。', '加载项目', {
          confirmButtonText: '继续加载',
          cancelButtonText: '取消',
          type: 'warning',
        }),
      );
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
    const content = await projectFileReader.read(file);
    if (content === null) return;
    const result = openProject(content, {
      gameDataRepository: gameDataRepository,
    });
    if (!result.ok) {
      ElMessage.error(projectOpenFailureMessage(result));
      return;
    }
    await acceptOpenedProject(result.project, result.gameDataRevisionUpdated);
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
  resetSimulationPublication();
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

function exportProject(filename?: string): void {
  try {
    const project = projectSession.snapshot.project;
    const content = serializeProjectDocument(project, true);
    const activeScenario = project.scenarios.find(value => value.id === project.activeScenarioId);
    const fileBase = (activeScenario?.name ?? project.activeScenarioId)
      .replace(/[^A-Za-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    downloadProjectJson(
      content,
      filename === undefined ? `${fileBase || 'endaxis-project'}.json` : projectFilename(filename),
    );
    savedProjectSnapshot.value = project;
    projectDirty.value = false;
    showExportDialog.value = false;
    ElMessage.success(t('timeline.export.exportJson'));
  } catch (error) {
    ElMessage.error(
      t('timeline.export.failed', {
        msg: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}

async function copyProjectCode(): Promise<void> {
  try {
    const json = serializeProjectDocument(projectSession.snapshot.project);
    await navigator.clipboard.writeText(await compressProjectCode(json));
    ElMessage.success(t('timeline.share.copied'));
  } catch (error) {
    ElMessage.error(
      t('timeline.share.copyFailed', {
        msg: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}

function openSmallImageExport(options: { filename: string; duration: number }): void {
  smallImageExportInitial.value = options;
  showExportDialog.value = false;
  showSmallImageExport.value = true;
}

async function exportTimelineLongImage(options: {
  filename: string;
  duration: number;
}): Promise<void> {
  showExportDialog.value = false;
  const loading = ElLoading.service({
    lock: true,
    text: t('timeline.export.rendering', { seconds: options.duration }),
    background: 'rgba(0, 0, 0, 0.9)',
  });
  try {
    await nextTick();
    const timelineMain = document.querySelector<HTMLElement>('.timeline-main');
    if (timelineMain === null) throw new Error('timeline workspace missing');
    const prepWidth = scenario.value.editor.prepExpanded
      ? scenario.value.battle.prepFrames * pxPerFrame.value
      : COLLAPSED_PREP_WIDTH_PX;
    const filename = imageFilename(options.filename);
    const blob = await captureTimelineLongImage(timelineMain, {
      durationSeconds: options.duration,
      pxPerFrame: pxPerFrame.value,
      prepWidth,
      trackHeaderWidth: TIMELINE_TRACK_HEADER_WIDTH,
    });
    downloadBlob(blob, filename);
    ElMessage.success(t('timeline.export.imageExported', { filename }));
  } catch (error) {
    ElMessage.error(
      t('timeline.export.failed', {
        msg: error instanceof Error ? error.message : String(error),
      }),
    );
  } finally {
    loading.close();
  }
}

/** 项目模板库与版本化数据的联合查询端口；实例只保存模板 ID 和养成/配装状态。 */
const editorGameDataRepository = {
  ...gameDataRepository,
  getOperator: (slug: string) =>
    projectDefinitionLibrary.value.operators[slug]?.definition ??
    gameDataRepository.getOperator(slug),
  getOperators: () => [
    ...gameDataRepository.getOperators(),
    ...Object.values(projectDefinitionLibrary.value.operators).map(value => value.definition),
  ],
  getWeapon: (slug: string) =>
    projectDefinitionLibrary.value.weapons[slug]?.definition ?? gameDataRepository.getWeapon(slug),
  getWeapons: () => [
    ...gameDataRepository.getWeapons(),
    ...Object.values(projectDefinitionLibrary.value.weapons).map(value => value.definition),
  ],
  getGear: (slug: string) =>
    projectDefinitionLibrary.value.gears[slug]?.definition ?? gameDataRepository.getGear(slug),
  getGears: () => [
    ...gameDataRepository.getGears(),
    ...Object.values(projectDefinitionLibrary.value.gears).map(value => value.definition),
  ],
  getGearSet: (slug: string) =>
    projectDefinitionLibrary.value.gearSets[slug]?.definition ??
    gameDataRepository.getGearSet(slug),
  getGearSets: () => [
    ...gameDataRepository.getGearSets(),
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
const exportShareTracks = computed<readonly TimelineShareTrack[]>(() =>
  viewModel.value.tracks
    .filter(track => track.operatorInstanceId !== null)
    .map(track => ({
      id: track.operatorInstanceId!,
      name: operatorName(track.operatorSlug),
      avatar:
        track.operatorAssetSlug === null ? null : getOperatorAvatarPath(track.operatorAssetSlug),
      actions: track.skillCasts.map(cast => ({
        id: cast.id,
        label: timelineCastLabel(cast, track),
        skillType: cast.skillType,
        startFrame: cast.startFrame,
        durationFrames: cast.durationFrames,
        disabled: cast.disabled,
        color: cast.color,
        icon:
          track.operatorAssetSlug === null || cast.skillType === null
            ? null
            : getOperatorSkillIconPath(track.operatorAssetSlug, cast.skillType),
      })),
    })),
);
const initialUltimateEnergyPresetMode = computed(() =>
  resolveInitialUltimateEnergyPresetMode(scenario.value),
);
const initialUltimateEnergyDisplayValue = computed(() => {
  const mode = initialUltimateEnergyPresetMode.value;
  if (mode === 'empty') return t('timelineGrid.toolbar.initialGaugeEmptyShort');
  if (mode === 'full') return t('timelineGrid.toolbar.initialGaugeFullShort');
  const values = scenario.value.tracks.flatMap(track =>
    track === null ? [] : [track.initialState.ultimateEnergy],
  );
  return values.length > 0 && values.every(value => value === values[0])
    ? String(values[0])
    : t('timelineGrid.toolbar.initialGaugeCustomShort');
});
const maximumUltimateEnergyByTrack = computed(() =>
  viewModel.value.tracks.map(track => track.maxUltimateEnergy),
);
const selectedTrackModel = computed(() => viewModel.value.tracks[selectedTrack.value]!);
const selectedLibraryEntry = computed(() => {
  const selection = selectedLibrarySkill.value;
  if (selection === null) return null;
  return (
    selectedTrackModel.value.skillLibrary.find(entry => entry.entryKey === selection.entryKey) ??
    null
  );
});
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
  selectedLibrarySkill.value = null;
  const placement = libraryPlacement.value;
  if (placement === null) return;
  const replacement = selectedTrackModel.value.skillLibrary.find(
    entry =>
      entry.skillType === placement.skillType &&
      entry.variantKey === undefined &&
      entry.placementSkillKey === undefined,
  );
  if (replacement === undefined) {
    cancelLibraryPlacement();
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
const battleLogSnapshot = shallowRef<TimelineBattleLogSnapshot | null>(null);
const publishedOperators = shallowRef<ReadonlyMap<string, PublishedOperatorMetadata>>(new Map());
const publishedWeaponSources = shallowRef<ReturnType<typeof capturePublishedWeaponSources>>(
  new Map(),
);
const simulationService = new AdaptiveTimelineSimulationService(
  new WorkerScenarioSimulationService(
    new Worker(new URL('../../application/scenarioSimulation.worker.ts', import.meta.url), {
      type: 'module',
    }),
    () => projectDefinitionLibrary.value,
  ),
  () => createEditorSimulationService(projectDefinitionLibrary.value),
);
onScopeDispose(() => simulationService.dispose());
const skillPlacementTransaction = new SkillPlacementTransaction(
  simulationService,
  () => projectRevision.value,
);
onScopeDispose(() => skillPlacementTransaction.cancel());
const {
  published: publishedSimulation,
  run: simulationRun,
  error: simulationError,
  performanceSamples: simulationPerformanceSamples,
  diagnosticsByCastId,
  simulateNow,
  resetPublication: resetSimulationPublication,
} = useScenarioSimulation({
  scenario,
  service: simulationService,
});
watch(
  publishedSimulation,
  published => {
    if (published === null) {
      battleLogSnapshot.value = null;
      publishedOperators.value = new Map();
      publishedWeaponSources.value = new Map();
      return;
    }
    publishedOperators.value = capturePublishedOperatorMetadata(
      published.scenario,
      editorGameDataRepository,
    );
    publishedWeaponSources.value = capturePublishedWeaponSources(
      editorGameDataRepository.getWeapons(),
    );
    battleLogSnapshot.value = capturePublishedBattleLog(
      published,
      editorGameDataRepository,
      publishedOperators.value,
      {
        skill: timelineCastLabel,
        operator: name =>
          name.displayName ??
          (name.assetSlug === null
            ? t('timeline.emptyTrack')
            : getOperatorGameName(name.assetSlug, locale.value)),
      },
    );
  },
  { flush: 'sync' },
);
const selectedOperatorBaseDefinition = computed(() => {
  const slug = selectedLoadoutModel.value.operator?.operatorSlug;
  if (slug === undefined) return null;
  const template = projectDefinitionLibrary.value.operators[slug];
  return gameDataRepository.getOperator(template?.origin?.templateId ?? slug);
});
const selectedOperatorCustomDefinition = computed(() => {
  const slug = selectedLoadoutModel.value.operator?.operatorSlug;
  return slug === undefined
    ? undefined
    : projectDefinitionLibrary.value.operators[slug]?.definition;
});
const selectedLibraryInspectorModel = computed(() => {
  const entry = selectedLibraryEntry.value;
  if (entry === null) {
    return {
      name: '',
      operatorName: '',
      typeLabel: '',
      skillGroupKey: '',
      level: 1,
      durationFrames: 0,
      segments: [] as readonly string[],
      customOperatorDefinition: false,
    };
  }
  return {
    name: selectedLibrarySkillName(),
    operatorName: operatorName(selectedTrackModel.value.operatorSlug),
    typeLabel: skillLibraryTypeLabel(entry),
    skillGroupKey: entry.skillGroupKey,
    level: entry.level,
    durationFrames: selectedLibrarySkillDurationFrames(),
    segments: skillSegments(entry).map(segment => segment.label),
    customOperatorDefinition: selectedOperatorCustomDefinition.value !== undefined,
  };
});
const selectedOperatorRequiredSkillReferences = computed(() => {
  projectRevision.value;
  const slug = selectedLoadoutModel.value.operator?.operatorSlug;
  if (slug === undefined) return [];
  return projectSession.snapshot.project.scenarios.flatMap(projectScenario =>
    projectScenario.tracks.flatMap(track => {
      if (track?.operator?.operatorSlug !== slug) return [];
      return track.skillCasts.flatMap(cast =>
        cast.source.kind === 'operatorSkill'
          ? [
              {
                skillGroupKey: cast.source.skillGroupKey,
                skillKey: cast.source.skillKey,
                castId: cast.id,
              },
            ]
          : [],
      );
    }),
  );
});
const selectedOperatorDefinitionSkillLevel = computed(() =>
  Math.max(1, ...Object.values(selectedLoadoutModel.value.operator?.skillLevels ?? {})),
);
const selectedWeaponBaseDefinition = computed(() => {
  const slug = selectedLoadoutModel.value.weapon?.weaponSlug;
  if (slug === undefined) return null;
  const template = projectDefinitionLibrary.value.weapons[slug];
  return gameDataRepository.getWeapon(template?.origin?.templateId ?? slug);
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
  return gameDataRepository.getGear(template?.origin?.templateId ?? current.slug);
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
  return gameDataRepository.getGearSet(template?.origin?.templateId ?? id);
});
const operatorBuildPanel = computed(() => {
  return panelResolution.value.panels.get(selectedTrack.value) ?? null;
});
const operatorFormNamesByTrack = computed<readonly (string | null)[]>(() =>
  viewModel.value.tracks.map(track => {
    const operator = loadoutModels.value[track.trackIndex]?.operator ?? null;
    const panel = panelResolution.value.panels.get(track.trackIndex) ?? null;
    if (operator === null || panel === null) return null;
    const formKey = resolveOperatorPresentationFormKey(operator.definition, panel.attributes);
    if (formKey === null) return null;
    return getOperatorFormName(
      operator.definition.assetSlug ?? operator.operatorSlug,
      formKey,
      locale.value,
    );
  }),
);
const selectedOperatorFormName = computed(
  () => operatorFormNamesByTrack.value[selectedTrack.value] ?? null,
);

/**
 * 项目定义提交可能同时替换活动场景，也可能只替换定义库。
 * 统一等 Vue 场景 watcher 先标脏/排队，再立即模拟；simulateNow 会清掉该待执行定时器，保证只跑一份。
 */
function refreshSimulationAfterDefinitionChange(): void {
  simulationService.clearCache();
  void nextTick(simulateNow);
}

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
  refreshSimulationAfterDefinitionChange();
  showOperatorDefinitionWorkspace.value = true;
}

function saveOperatorDefinition(definition: OperatorDefinition): void {
  projectSession.commit('saveProjectOperatorTemplate', project =>
    replaceProjectOperatorTemplateDefinition(project, definition.slug, definition),
  );
  refreshSimulationAfterDefinitionChange();
}

function resetOperatorDefinition(): void {
  const slug = selectedLoadoutModel.value.operator?.operatorSlug;
  if (slug === undefined) return;
  const template = projectDefinitionLibrary.value.operators[slug];
  const base = selectedOperatorBaseDefinition.value;
  if (template === undefined || base === null) return;
  const definition = structuredClone({
    ...base,
    slug,
    displayName: template.name,
    assetSlug: base.assetSlug ?? base.slug,
  });
  projectSession.commit('resetProjectOperatorTemplate', project =>
    replaceProjectOperatorTemplateDefinition(project, slug, definition),
  );
  showOperatorDefinitionWorkspace.value = false;
  refreshSimulationAfterDefinitionChange();
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
  refreshSimulationAfterDefinitionChange();
  showWeaponDefinitionWorkspace.value = true;
}

function saveWeaponDefinition(definition: WeaponDefinition): void {
  projectSession.commit('saveProjectWeaponTemplate', project =>
    replaceProjectWeaponTemplateDefinition(project, definition.slug, definition),
  );
  refreshSimulationAfterDefinitionChange();
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
  refreshSimulationAfterDefinitionChange();
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
  refreshSimulationAfterDefinitionChange();
}

function saveGearDefinition(definition: GearDefinition): void {
  projectSession.commit('saveProjectGearTemplate', project =>
    replaceProjectGearTemplateDefinition(project, definition.slug, definition),
  );
  refreshSimulationAfterDefinitionChange();
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
  refreshSimulationAfterDefinitionChange();
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
    refreshSimulationAfterDefinitionChange();
    return;
  }

  const baseSet = gameDataRepository.getGearSet(sourceSetId);
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
  refreshSimulationAfterDefinitionChange();
}

function saveGearSetDefinition(definition: GearSetDefinition): void {
  projectSession.commit('saveProjectGearSetTemplate', project =>
    replaceProjectGearSetTemplateDefinition(project, definition.slug, definition),
  );
  refreshSimulationAfterDefinitionChange();
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
  refreshSimulationAfterDefinitionChange();
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
  if (marker.target.scope === 'team') return t('timeline.markerInspector.teamTarget');
  const track = scenario.value.tracks[marker.target.trackIndex];
  return track === null || track.operator === null
    ? t('timeline.emptyTrack')
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
            label: t('timeline.documentMarkerInspector.trackOption', {
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
  gameDataRepository.getCommonAbilityEntityDefinitions?.() ?? {};
const commonBuffDefinitions = gameDataRepository.getCommonBuffDefinitions?.() ?? {};
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
const compatibleSkillCastReceiptIds = computed(() =>
  matchingPublishedSkillCastIds(scenario.value, publishedSimulation.value?.scenario),
);
const publishedSkillCastActualStartFrames = computed(() =>
  simulationRun.value === null
    ? new Map<string, number>()
    : projectSkillCastActualStartFrames(simulationRun.value.receiptEntries),
);
const publishedSkillCastActualDurationFrames = computed(() =>
  simulationRun.value === null
    ? new Map<string, number>()
    : projectSkillCastActualDurationFrames(simulationRun.value.receiptEntries),
);
const publishedSkillCastInputFacts = computed(() =>
  projectSkillCastInputFacts(simulationRun.value?.receiptEntries ?? []),
);
const skillCastInputFrames = computed(
  () =>
    new Map(
      [...publishedSkillCastInputFacts.value.frames].filter(([id]) =>
        compatibleSkillCastReceiptIds.value.has(id),
      ),
    ),
);
const skillCastActualStartFrames = computed(
  () =>
    new Map(
      [...publishedSkillCastActualStartFrames.value].filter(([id]) =>
        compatibleSkillCastReceiptIds.value.has(id),
      ),
    ),
);
const skillCastActualDurationFrames = computed(
  () =>
    new Map(
      [
        ...publishedSkillCastActualDurationFrames.value,
        ...[...publishedSkillCastInputFacts.value.switchedToBuff].map(id => [id, 1] as const),
      ].filter(([id]) => compatibleSkillCastReceiptIds.value.has(id)),
    ),
);
const skillCastPlacementActualFrames = computed(
  () => new Map([...skillCastInputFrames.value, ...skillCastActualStartFrames.value]),
);
const skillCastDefinitionDurations = computed(
  () =>
    new Map(
      viewModel.value.tracks.flatMap(track =>
        track.skillCasts.map(
          cast => [cast.id, skillPlacementDisplayFrames(cast.durationFrames)] as const,
        ),
      ),
    ),
);

function resolveDisplayedSkillStarts(document: ScenarioDocument): ReadonlyMap<string, number> {
  return new Map(
    document.tracks.flatMap(track => [
      ...resolveSkillCastStartFrames(
        track?.skillCasts ?? [],
        cast =>
          skillCastActualDurationFrames.value.get(cast.id) ??
          skillCastDefinitionDurations.value.get(cast.id) ??
          0,
        skillCastPlacementActualFrames.value,
      ),
    ]),
  );
}

const resolvedSkillCastStartFrames = computed(() => resolveDisplayedSkillStarts(scenario.value));
const displayedSkillCastStartFrames = computed(() => {
  const gesture = castMoveGesture.value;
  // 等待新回执时只平移上一版完整结果；新回执发布后，立即使用其中的组内间距。
  const publishedStarts =
    gesture === null
      ? resolvedSkillCastStartFrames.value
      : resolveDisplayedSkillStarts(gesture.baseScenario);
  return projectMovingSkillCastStartFrames(
    publishedStarts,
    gesture === null
      ? null
      : {
          anchorId: gesture.skillCastId,
          castIds: gesture.skillCastIds,
          baseStartFrames: gesture.baseStartFrames,
          previewActualFrame: gesture.previewActualFrame,
        },
  );
});
const skillCastGroupsByTrack = computed(() =>
  scenario.value.tracks.map(track =>
    getSkillCastPlacementChains(track?.skillCasts ?? []).filter(chain => chain.casts.length > 1),
  ),
);
const groupedSkillCastIds = computed(
  () =>
    new Set(
      skillCastGroupsByTrack.value.flatMap(groups =>
        groups.flatMap(group => group.casts.map(cast => cast.id)),
      ),
    ),
);
const publishedPerfectComboCastIds = computed(() =>
  simulationRun.value === null
    ? new Set<string>()
    : projectRossiComboSuccessCastIds(simulationRun.value.receiptEntries),
);
const perfectComboCastIds = computed(
  () =>
    new Set(
      [...publishedPerfectComboCastIds.value].filter(id =>
        compatibleSkillCastReceiptIds.value.has(id),
      ),
    ),
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
const publishedTimeDilationBands = computed(() => {
  if (simulationRun.value === null) return [];
  return projectTimelineTimeDilationBands(
    simulationRun.value.receiptEntries,
    simulationRun.value.frame,
  );
});
const timeDilationBands = computed(() => {
  const bands = publishedTimeDilationBands.value.filter(
    band =>
      band.sourceCastId === undefined || compatibleSkillCastReceiptIds.value.has(band.sourceCastId),
  );
  const gesture = castMoveGesture.value;
  if (gesture === null) return bands;
  return bands.map(band => {
    if (band.sourceCastId === undefined || !gesture.skillCastIds.includes(band.sourceCastId))
      return band;
    const publishedFrame = skillCastActualStartFrames.value.get(band.sourceCastId);
    const displayedFrame = displayedSkillCastStartFrames.value.get(band.sourceCastId);
    const deltaFrames =
      publishedFrame === undefined || displayedFrame === undefined
        ? 0
        : displayedFrame - publishedFrame;
    return deltaFrames === 0
      ? band
      : Object.freeze({
          ...band,
          startFrame: band.startFrame + deltaFrames,
          endFrame: band.endFrame + deltaFrames,
        });
  });
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
    scenario.value.editor.prepExpanded,
  ),
);
function timelineFramePx(frame: number, prepFrames = scenario.value.battle.prepFrames): number {
  return frameToTimelinePx(frame, prepFrames, pxPerFrame.value, scenario.value.editor.prepExpanded);
}
function timelineFrameSpanPx(startFrame: number, durationFrames: number): number {
  return Math.max(0, timelineFramePx(startFrame + durationFrames) - timelineFramePx(startFrame));
}
const timelineSurfaceStyle = computed<Record<string, string>>(() => ({
  width: `${TIMELINE_TRACK_HEADER_WIDTH + timelineWidth.value}px`,
  '--timeline-grid-step': `${PROJECT_FPS * pxPerFrame.value}px`,
  '--timeline-grid-origin': `${
    TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(0, displayedTimelinePrepFrames.value)
  }px`,
}));

function updateTimelineViewportMetrics(): void {
  const viewport = timelineScroll.value;
  if (viewport === null) return;
  timelineScrollLeft.value = viewport.scrollLeft;
  timelineScrollTop.value = viewport.scrollTop;
  timelineViewportWidth.value = viewport.clientWidth;
  timelineViewportHeight.value = viewport.clientHeight;
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
  if (!compatibleSkillCastReceiptIds.value.has(castId)) return [];
  const castStartFrame = castActualStartFrame(castId, placementFrame);
  return projectCastTimeDilationSegments(
    timeDilationBands.value,
    castId,
    castStartFrame,
    durationFrames,
  ).map(segment => ({
    left: timelineFramePx(castStartFrame + segment.offsetFrames) - timelineFramePx(castStartFrame),
    width: timelineFrameSpanPx(castStartFrame + segment.offsetFrames, segment.durationFrames),
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
    minimumFrame: -scenario.value.battle.prepFrames,
    maximumFrame: scenario.value.battle.durationFrames,
  });
  const changed = commitScenario('alignSkillCast', current =>
    moveSkillCast(
      current,
      source.trackIndex,
      sourceCastId,
      frame,
      displayedSkillCastStartFrames.value,
    ),
  );
  alignmentGuide.value = null;
  if (changed) ElMessage.success(alignmentPresentation(mode).result);
  else ElMessage.warning(t('timelineGrid.alignResult.unchanged'));
  return true;
}

function castActualStartFrame(castId: string, placementFrame: number): number {
  return displayedSkillCastStartFrames.value.get(castId) ?? placementFrame;
}

function castActualDurationFrame(castId: string, definitionDurationFrames: number): number {
  return (
    skillCastActualDurationFrames.value.get(castId) ??
    skillPlacementDisplayFrames(definitionDurationFrames)
  );
}

const publishedSkillCastInterruptionFrames = computed(() =>
  projectSkillCastInterruptionFrames(simulationRun.value?.receiptEntries ?? []),
);
const visibleSkillEndFrames = computed(() => {
  const ends = new Map<string, number>();
  const interruptions = new Map(
    [...publishedSkillCastInterruptionFrames.value].filter(([id]) =>
      compatibleSkillCastReceiptIds.value.has(id),
    ),
  );
  for (const track of viewModel.value.tracks) {
    for (const [id, end] of timelineVisibleSkillEnds(
      track.skillCasts.map(cast => ({
        id: cast.id,
        startFrame: castActualStartFrame(cast.id, cast.startFrame),
        durationFrames: Math.min(
          castActualDurationFrame(cast.id, cast.durationFrames),
          Math.max(
            0,
            (interruptions.get(cast.id) ?? Infinity) -
              (skillCastActualStartFrames.value.get(cast.id) ?? cast.startFrame),
          ),
        ),
      })),
    ))
      ends.set(id, end);
  }
  return ends;
});

function castActualDurationPending(castId: string, definitionDurationFrames: number): boolean {
  return (
    definitionDurationFrames > 0 &&
    skillCastActualStartFrames.value.has(castId) &&
    !skillCastActualDurationFrames.value.has(castId)
  );
}

function timelinePointerActualFrame(pointerPx: number): number {
  return timelinePxToFrame(
    pointerPx,
    scenario.value.battle.prepFrames,
    pxPerFrame.value,
    scenario.value.editor.prepExpanded,
  );
}
function formatGuideNumber(value: number | null): string {
  if (value === null) return '--';
  return String(Math.round(value * 1000) / 1000);
}

function castWarningTitle(castId: string): string {
  if (!compatibleSkillCastReceiptIds.value.has(castId)) return '';
  const reasons = diagnosticsByCastId.value.get(castId);
  if (reasons === undefined || reasons.length === 0) return '';
  return reasons
    .map(reason => {
      if (reason === 'resourceUnavailable') return '资源不足：时间轴仍会强制执行该技能';
      if (reason === 'cooldownUnavailable') return '技能尚在冷却：时间轴仍会强制执行该技能';
      if (reason === 'skillInputMismatch') return '该操作当前不会触发这个技能';
      if (reason === 'skillGroupInputRejected') return t('timeline.continuousGroup.inputRejected');
      if (reason === 'skillGroupInterrupted') return t('timeline.continuousGroup.interrupted');
      if (reason.startsWith('skillInputMismatch:')) {
        const mismatch = /^skillInputMismatch: expected '(.+)', actual '(.+)'$/.exec(reason);
        return mismatch === null
          ? '操作实际会触发其他技能；时间轴仍执行已放置技能'
          : `操作实际会触发 '${mismatch[2]}'，不是已放置的 '${mismatch[1]}'；时间轴仍执行已放置技能`;
      }
      if (reason === 'skillInputUnknown') return '缺少该操作的原生技能路由证据';
      if (reason.startsWith('skillInputUnknown:'))
        return `无法确定该操作会触发哪个技能：${formatPlayerInputEvidenceDetail(reason.slice('skillInputUnknown: '.length))}`;
      if (reason === 'ultimateInputDuringPresentation')
        return '演出期间原生终结技输入入口不接受再次释放；时间轴仍执行已放置技能';
      if (reason === 'skillCommonTagUnavailable')
        return '干员当前标签状态禁止施法；时间轴仍执行已放置技能';
      if (reason === 'skillTypeTagUnavailable')
        return '干员当前标签状态禁止释放该类型技能；时间轴仍执行已放置技能';
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

// 同一发布回执只解析一次；不能每个技能、每次指针移动都重扫整份日志。
const hitReceipts = computed(() =>
  projectTimelineHitReceipts(simulationRun.value?.receiptEntries ?? []),
);
const castHitEffects = computed(() => {
  const current = simulationRun.value;
  if (current === null) {
    return new Map<string, ReadonlyMap<string, TimelineHitEffectLabel>>();
  }
  const byCastId = new Map<string, ReadonlyMap<string, TimelineHitEffectLabel>>();
  const models = new Map(
    viewModel.value.tracks.flatMap(track => track.skillCasts).map(cast => [cast.id, cast]),
  );
  for (const track of scenario.value.tracks) {
    if (track === null) continue;
    for (const cast of track.skillCasts) {
      if (!compatibleSkillCastReceiptIds.value.has(cast.id)) continue;
      const castModel = models.get(cast.id);
      byCastId.set(
        cast.id,
        projectHitEffectsByCast(
          scenario.value,
          current.receiptEntries,
          cast.id,
          castModel?.hitMarkers ?? [],
          hitReceipts.value,
        ),
      );
    }
  }
  return byCastId;
});
const hitActualFrames = computed(() =>
  projectCompatibleHitFrames(hitReceipts.value.damages, compatibleSkillCastReceiptIds.value),
);

/** 敌人瞬时效果标记；附着和法术异常的持续展示统一由可见 Buff 生命周期负责。 */
const attachmentBuffIds = new Set(
  elementalAttachments.buffs
    .filter(buff => buff.role?.kind === 'elementalAttachment')
    .map(buff => buff.id),
);
const enemyEffectViz = computed(() => {
  const current = simulationRun.value;
  if (current === null) {
    return { markers: [] };
  }
  // 拖动草稿会立即把模拟标脏，但上一份成功回执仍是比空白更稳定的视觉占位；
  // 新模拟完成后 simulationRun 会整体替换，效果条随之原子更新，避免来回闪烁。
  return projectEnemyEffectViz(current.receiptEntries, current.frame);
});

const poiseBrokenSegments = computed(() => {
  const current = simulationRun.value;
  return current === null ? [] : projectPoiseBrokenSegments(current.receiptEntries, current.frame);
});

/** 所有持续状态统一由原生可见 Buff 生命周期投影，Buff 实例就是稳定展示身份。 */
const buffTimelineSegments = computed(() => {
  const current = simulationRun.value;
  return current === null ? [] : projectBuffTimelineViz(current.receiptEntries, current.frame);
});

/** 光标快照只消费已经生成的生命周期段，不回查或重算 Buff 运行时。 */
const combatHudInitialSkillSlots = computed(() =>
  viewModel.value.tracks.flatMap(track => {
    if (track.operatorInstanceId === null || track.operatorSlug === null) return [];
    const definition = editorGameDataRepository.getOperator(track.operatorSlug);
    return [
      {
        operatorId: track.operatorInstanceId,
        slots: (definition?.skillSlots ?? []).map(slot => ({
          skillSlotKey: slot.key,
          currentSkillKey: slot.baseSkillKey,
        })),
      },
    ];
  }),
);

const combatHudOperatorPassiveUis = computed(() =>
  viewModel.value.tracks.flatMap(track => {
    if (track.operatorInstanceId === null || track.operatorSlug === null) return [];
    const definition = editorGameDataRepository.getOperator(track.operatorSlug)?.passiveUi;
    return definition === undefined ? [] : [{ operatorId: track.operatorInstanceId, definition }];
  }),
);

/** 专属 UI 不只采样光标快照；非零状态还要保留完整生命周期供轨道展示。 */
const operatorPassiveUiTimelineSegments = computed(() => {
  const current = simulationRun.value;
  return current === null
    ? []
    : projectOperatorPassiveUiTimelineViz(
        current.receiptEntries,
        current.frame,
        combatHudOperatorPassiveUis.value,
      );
});

const operatorControlTimeline = computed(() =>
  resolveControlTimeline(
    scenario.value.tracks,
    scenario.value.battle.controlSwitches,
    -scenario.value.battle.prepFrames,
  ),
);

/** 旧版底部摘要固定取最后一次敌人受伤时刻，而不是跟随隐藏的编辑光标。 */
const enemyEffectsMinimumHeight = ref(60);
const collapsedMonitorSectionCount = ref(0);
const enemyLastDamageFrame = computed(() => {
  const current = simulationRun.value;
  if (current === null) return null;
  return (
    current.enemyHealthCurve.points.filter(point => point.sequence !== null).at(-1)?.frame ?? null
  );
});

const combatHudSnapshot = computed(() => {
  const current = simulationRun.value;
  if (current === null) return null;
  return projectCombatHudSnapshot({
    frame: enemyLastDamageFrame.value ?? 0,
    endFrame: current.frame,
    enemyHealthCurve: current.enemyHealthCurve,
    poiseCurve: current.poiseCurve,
    resourceCurves: current.resourceCurves,
    receiptEntries: current.receiptEntries,
    operatorSkillSlots: combatHudInitialSkillSlots.value,
    operatorPassiveUis: combatHudOperatorPassiveUis.value,
    buffProgressCurves: current.buffProgressCurves,
    controlTimeline: operatorControlTimeline.value,
  });
});

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
const controlledComboCooldownBands = computed(() => {
  const run = simulationRun.value;
  return run === null ? [] : projectTimelineComboCooldowns(run.receiptEntries, run.frame);
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
  if (!compatibleSkillCastReceiptIds.value.has(castId)) return [];
  const publishedStart = skillCastPlacementActualFrames.value.get(castId) ?? castStartFrame;
  return skillCooldownSegments.value
    .filter(segment => segment.castId === castId)
    .map(segment => ({
      offsetFrames: segment.startFrame - publishedStart,
      durationFrames: Math.max(0, segment.endFrame - segment.startFrame),
      completed: segment.completed,
    }))
    .filter(segment => segment.durationFrames > 0);
}

function enhancementBarsForCast(castId: string, castStartFrame: number) {
  if (!compatibleSkillCastReceiptIds.value.has(castId)) return [];
  const publishedStart = skillCastPlacementActualFrames.value.get(castId) ?? castStartFrame;
  return skillEnhancementSegments.value
    .filter(segment => segment.castId === castId)
    .map(segment => ({
      offsetFrames: segment.startFrame - publishedStart,
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
    if (segment.targetId === SINGLE_ENEMY_TARGET_ID && !isEnemyTimelineBuffVisible(segment))
      continue;
    const list = grouped.get(segment.targetId) ?? [];
    list.push(segment);
    grouped.set(segment.targetId, list);
  }
  const positioned = new Map<string, PositionedDisplayBuffTimelineSegment[]>();
  for (const [targetId, segments] of grouped) {
    const displaySegments = mergeOverlappingBuffTimelineSegments(segments);
    positioned.set(
      targetId,
      targetId === SINGLE_ENEMY_TARGET_ID
        ? [...layoutBuffTimelineSegments(displaySegments)]
        : [
            ...layoutBuffTimelineSegments(
              displaySegments.filter(segment => segment.placement === 'upper'),
            ),
            ...layoutBuffTimelineSegments(
              displaySegments.filter(segment => segment.placement === 'lower'),
            ),
          ],
    );
  }
  return positioned;
});

const positionedOperatorPassiveUisByTarget = computed(() => {
  const grouped = new Map<string, OperatorPassiveUiTimelineSegment[]>();
  for (const segment of operatorPassiveUiTimelineSegments.value) {
    const list = grouped.get(segment.operatorId) ?? [];
    list.push(segment);
    grouped.set(segment.operatorId, list);
  }
  const positioned = new Map<string, readonly PositionedOperatorPassiveUiTimelineSegment[]>();
  for (const [operatorId, segments] of grouped) {
    const upperBuffLaneCount = Math.max(
      0,
      ...(positionedBuffsByTarget.value.get(operatorId) ?? [])
        .filter(segment => segment.placement === 'upper')
        .map(segment => segment.lane + 1),
    );
    positioned.set(
      operatorId,
      layoutOperatorPassiveUiTimelineSegments(segments, upperBuffLaneCount),
    );
  }
  return positioned;
});

function buffSegmentsForTarget(
  targetId: string | null,
  placement?: BuffTimelineSegment['placement'],
): readonly PositionedDisplayBuffTimelineSegment[] {
  if (targetId === null) return [];
  const segments = positionedBuffsByTarget.value.get(targetId) ?? [];
  return placement === undefined
    ? segments
    : segments.filter(segment => segment.placement === placement);
}

function operatorPassiveUiSegmentsForTarget(
  targetId: string | null,
): readonly PositionedOperatorPassiveUiTimelineSegment[] {
  return targetId === null ? [] : (positionedOperatorPassiveUisByTarget.value.get(targetId) ?? []);
}

function trackEffectLayout(trackIndex: TrackIndex, targetId: string | null) {
  const laneCount = (placement: BuffTimelineSegment['placement']): number => {
    if (targetId === null || !isOperatorEffectsVisible(trackIndex)) return 0;
    const buffLaneCount = Math.max(
      0,
      ...buffSegmentsForTarget(targetId, placement).map(segment => segment.lane + 1),
    );
    return placement === 'upper'
      ? Math.max(
          buffLaneCount,
          ...operatorPassiveUiSegmentsForTarget(targetId).map(segment => segment.lane + 1),
        )
      : buffLaneCount;
  };
  return projectTimelineTrackEffectLayout({
    mode: buffLayoutMode.value,
    upperLaneCount: laneCount('upper'),
    lowerLaneCount: laneCount('lower'),
    compactHeight: displayedCompactTrackHeights.value[trackIndex],
  });
}

interface CompactTrackResizeGesture {
  readonly pointerId: number;
  readonly lease: InteractionLease;
  readonly dividerIndex: TrackIndex;
  readonly startY: number;
  readonly initialHeights: readonly number[];
  readonly initialWeights: readonly number[];
}

const compactTrackResizeGesture = ref<CompactTrackResizeGesture | null>(null);

function finishCompactTrackResize(event?: PointerEvent): void {
  if (compactTrackResizeGesture.value === null) return;
  if (event !== undefined && event.pointerId !== compactTrackResizeGesture.value.pointerId) return;
  compactTrackResizeGesture.value.lease.release();
  compactTrackResizeGesture.value = null;
  document.documentElement.classList.remove('is-track-resizing');
  window.removeEventListener('pointermove', updateCompactTrackResize);
  window.removeEventListener('pointerup', finishCompactTrackResize);
  window.removeEventListener('pointercancel', cancelCompactTrackResize);
}

function cancelCompactTrackResize(event?: PointerEvent): void {
  const gesture = compactTrackResizeGesture.value;
  if (event !== undefined && event.pointerId !== gesture?.pointerId) return;
  if (gesture !== null) compactTrackHeights.value = gesture.initialWeights;
  finishCompactTrackResize();
}

function updateCompactTrackResize(event: PointerEvent): void {
  const gesture = compactTrackResizeGesture.value;
  if (gesture === null || event.pointerId !== gesture.pointerId || !gesture.lease.isCurrent())
    return;
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
  const lease = interactionSession.tryStart('track-resize', cancelCompactTrackResize);
  if (lease === null) return;
  compactTrackResizeGesture.value = {
    pointerId: event.pointerId,
    lease,
    dividerIndex,
    startY: event.clientY,
    initialHeights: displayedCompactTrackHeights.value,
    initialWeights: compactTrackHeights.value,
  };
  document.documentElement.classList.add('is-track-resizing');
  window.addEventListener('pointermove', updateCompactTrackResize);
  window.addEventListener('pointerup', finishCompactTrackResize);
  window.addEventListener('pointercancel', cancelCompactTrackResize);
}

function resetCompactTrackLayout(): void {
  cancelCompactTrackResize();
  compactTrackHeights.value = compactTrackHeights.value.map(() => TIMELINE_TRACK_BASE_HEIGHT);
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
      `${Math.round(damage.value)}${publishedRandomMode.value === 'sampled' && damage.isCritical ? '!' : ''} ${damageElementLabel(damage.damageType)}`,
    );
  }
  for (const infliction of label.infliction) {
    parts.push(`${damageElementLabel(infliction.element)}${t('timeline.hitInflictionSuffix')}`);
  }
  for (const reaction of label.reactions) {
    const name = reactionName(reaction.reaction);
    parts.push(
      reaction.applied
        ? `${name} Lv${reaction.level}`
        : `${name}${t('timeline.hitReactionConsumed')}`,
    );
  }
  return parts.join(' · ');
}

const publishedHitOccurrences = computed(() =>
  projectTimelineHitOccurrences(simulationRun.value?.receiptEntries ?? []),
);
const hitOccurrences = computed(
  () =>
    new Map(
      [...publishedHitOccurrences.value].filter(([id]) =>
        compatibleSkillCastReceiptIds.value.has(id),
      ),
    ),
);
function castHitMarkers(trackIndex: TrackIndex, castId: string): TimelineHitMarkerView[] {
  if (simulationRun.value !== null && !compatibleSkillCastReceiptIds.value.has(castId)) return [];
  const castModel = viewModel.value.tracks[trackIndex]?.skillCasts.find(
    candidate => candidate.id === castId,
  );
  const cast = scenario.value.tracks[trackIndex]?.skillCasts.find(
    candidate => candidate.id === castId,
  );
  if (castModel === undefined || cast === undefined) return [];
  const effects = castHitEffects.value.get(castId);
  const publishedStartFrame = skillCastActualStartFrames.value.get(castId) ?? castModel.startFrame;
  if (simulationRun.value !== null) {
    return (hitOccurrences.value.get(castId) ?? []).map(hit => ({
      stepKey: hit.stepKey,
      hitId: hit.hitId,
      executionFrame: hit.frame,
      leftPx: timelineFramePx(hit.frame) - timelineFramePx(publishedStartFrame),
      critical: hit.label.damage.some(damage => damage.isCritical),
      forcedCritical: cast.simulationInputs?.criticalOverrides?.[hit.stepKey] === true,
      title: hitMarkerTitle(hit.label),
    }));
  }
  return castModel.hitMarkers
    .filter(marker =>
      shouldDisplayTimelineHitMarker(marker, simulationRun.value !== null, hitActualFrames.value),
    )
    .map(marker => ({
      stepKey: marker.stepKey,
      hitId: marker.hitId,
      leftPx:
        timelineFramePx(
          hitActualFrames.value.get(marker.hitId) ?? publishedStartFrame + marker.frameOffset,
        ) - timelineFramePx(publishedStartFrame),
      forcedCritical: cast.simulationInputs?.criticalOverrides?.[marker.stepKey] === true,
      ...(effects === undefined ? {} : { title: hitMarkerTitle(effects.get(marker.hitId)) }),
    }));
}

const hitDetailTarget = ref<{
  trackIndex: TrackIndex;
  castId: string;
  hitId: string;
  executionFrame?: number;
} | null>(null);
const enemyDamageDetailSequence = useSimulationReceiptSelection(simulationRun);
const publishedHitDetail = computed(() =>
  projectPublishedHitDetail(publishedSimulation.value, hitDetailTarget.value),
);
const enemyDamageDetailEntries = computed(() => {
  if (enemyDamageDetailSequence.value === null) return [];
  const entries = simulationRun.value?.receiptEntries ?? [];
  return (
    layoutEnemyDamageHits(
      entries,
      buffSegmentsForTarget('enemy'),
      enemyEffectViz.value.markers,
      attachmentBuffIds,
    ).find(position =>
      position.group.some(entry => entry.sequence === enemyDamageDetailSequence.value),
    )?.group ?? []
  );
});
function enemyDamageSourceDescription(entry: CombatReceiptEntry) {
  const sourceActionId =
    typeof entry.data?.sourceActionId === 'string' ? entry.data.sourceActionId : undefined;
  const track = publishedSimulation.value?.scenario.tracks.find(
    track => track?.id === entry.sourceId,
  );
  const operatorSlug = track?.operator?.operatorSlug;
  return [
    operatorSlug ? publishedOperatorName(operatorSlug) : entry.sourceId,
    buffSourceName({ sourceActionId, sourceId: entry.sourceId }),
    typeof entry.data?.spellBurstType === 'string'
      ? t('battleLog.receiptTypes.SpellBurstApplied')
      : resolveBuffDisplayName(String(entry.data?.buffId ?? ''), { t, te }),
  ]
    .filter(Boolean)
    .join(' · ');
}
function enemyDamageOperatorPanel(entry: CombatReceiptEntry) {
  return (
    simulationRun.value?.operatorPanels.find(panel => panel.operatorId === entry.sourceId) ?? null
  );
}
const hitDetail = computed(() => {
  const target = hitDetailTarget.value;
  if (target === null) return null;
  const track = scenario.value.tracks[target.trackIndex];
  const cast = track?.skillCasts.find(candidate => candidate.id === target.castId);
  if (track === null || cast === undefined || track.operator === null) return null;
  const castModel = viewModel.value.tracks[target.trackIndex]?.skillCasts.find(
    candidate => candidate.id === target.castId,
  );
  const marker =
    castModel?.hitMarkers.find(candidate => candidate.hitId === target.hitId) ??
    hitOccurrences.value
      .get(target.castId)
      ?.find(
        candidate => candidate.hitId === target.hitId && candidate.frame === target.executionFrame,
      ) ??
    null;
  if (marker === null) return null;
  return { cast, marker };
});
const hitDetailForceCritical = computed(() => {
  const detail = hitDetail.value;
  return detail?.cast.simulationInputs?.criticalOverrides?.[detail.marker.stepKey] === true;
});
const hitDetailOperatorPanel = computed(() => {
  const target = hitDetailTarget.value;
  const current = simulationRun.value;
  if (current === null) return null;
  if (target !== null) return publishedHitDetail.value?.operatorPanel ?? null;
  const operatorId = enemyDamageDetailEntries.value[0]?.sourceId;
  return current.operatorPanels.find(panel => panel.operatorId === operatorId) ?? null;
});

function hitDetailContributionSourceLabel(
  entry: OperatorPanelContributionReceipt,
  sequence?: number,
): string {
  const target = hitDetailTarget.value;
  const track =
    target !== null
      ? publishedHitDetail.value?.track
      : publishedSimulation.value?.scenario.tracks.find(
          track =>
            track?.id ===
            enemyDamageDetailEntries.value.find(hit => hit.sequence === sequence)?.sourceId,
        );
  const operatorSlug = track?.operator?.operatorSlug ?? null;
  return resolveOperatorPanelContributionSourceLabel(entry, {
    operator:
      operatorSlug === null || operatorSlug === undefined
        ? null
        : (publishedOperators.value.get(operatorSlug) ?? null),
    locale: locale.value,
    translate: t,
  });
}

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
  const snapshot =
    current === null || frame > current.frame
      ? null
      : projectCombatHudSnapshot({
          frame,
          endFrame: current.frame,
          enemyHealthCurve: current.enemyHealthCurve,
          poiseCurve: current.poiseCurve,
          resourceCurves: current.resourceCurves,
          receiptEntries: current.receiptEntries,
          operatorSkillSlots: combatHudInitialSkillSlots.value,
          operatorPassiveUis: combatHudOperatorPassiveUis.value,
        });
  if (current !== null && snapshot !== null) {
    sp = String(Math.floor(Number(snapshot.sp.current) || 0));
    enemyHealth = `${Math.floor(Number(snapshot.enemy.health.current) || 0).toLocaleString()} / ${Math.floor(snapshot.enemy.health.maximum).toLocaleString()}`;
    if (snapshot.enemy.poise !== null) {
      poise = `${Math.floor(Number(snapshot.enemy.poise.current) || 0)}/${Math.floor(snapshot.enemy.poise.maximum)}`;
    }
    for (const operator of snapshot.operators) {
      const trackIndex = viewModel.value.tracks.findIndex(
        track => track.operatorInstanceId === operator.operatorId,
      );
      const track = trackIndex < 0 ? undefined : viewModel.value.tracks[trackIndex];
      if (track === undefined) continue;
      gauges.push({
        id: operator.operatorId,
        name: operatorName(track.operatorSlug),
        current: formatGuideNumber(operator.ultimateEnergy.current),
        max: formatGuideNumber(operator.ultimateEnergy.maximum),
        color: gaugeColorFor(trackIndex as TrackIndex),
        isFull:
          operator.ultimateEnergy.current !== null &&
          operator.ultimateEnergy.current >= operator.ultimateEnergy.maximum,
      });
    }
  }
  return { time: formatGuideFrame(frame), sp, poise, enemyHealth, gauges };
});

const CURSOR_EFFECT_ICON_LIMIT = 10;
const cursorEnemyEffects = computed(() => {
  const frame = cursorGuide.value?.sampleFrame ?? 0;
  const byBuffId = new Map<
    string,
    { buffId: string; title: string; icon: string | null; layers: number }
  >();
  for (const segment of buffSegmentsForTarget(SINGLE_ENEMY_TARGET_ID)) {
    if (segment.startFrame > frame || segment.endFrame <= frame) continue;
    const previous = byBuffId.get(segment.buffId);
    if (previous !== undefined && previous.layers >= segment.layers) continue;
    byBuffId.set(segment.buffId, {
      buffId: segment.buffId,
      title: buffDisplayName(segment) ?? resolveBuffDisplayName(segment.buffId, { t, te }),
      icon: buffIcon(segment) ?? segment.iconPath ?? getIconAssetPath(segment.iconId) ?? null,
      layers: segment.layers,
    });
  }
  const all = [...byBuffId.values()].sort((left, right) => left.buffId.localeCompare(right.buffId));
  return {
    effects: all.slice(0, CURSOR_EFFECT_ICON_LIMIT),
    overflow: Math.max(0, all.length - CURSOR_EFFECT_ICON_LIMIT),
  };
});

function publishedOperatorName(slug: string | null): string {
  if (slug === null) return t('timeline.emptyTrack');
  const metadata = publishedOperators.value.get(slug);
  return metadata?.displayName ?? getOperatorGameName(metadata?.assetSlug ?? slug, locale.value);
}

function operatorName(slug: string | null): string {
  if (slug === null) return t('timeline.emptyTrack');
  const definition = editorGameDataRepository.getOperator(slug);
  return (
    definition?.displayName ?? getOperatorGameName(definition?.assetSlug ?? slug, locale.value)
  );
}

function enemyName(enemyId: string): string {
  return getEnemyGameName(enemyId, locale.value);
}

const enemyHudName = computed(() =>
  scenario.value.enemy.source.kind === 'prefab'
    ? enemyName(scenario.value.enemy.source.enemyId)
    : t('resourceMonitor.enemy.custom'),
);

function skillName(groupKey: string, slug: string | null): string {
  if (slug === null) return groupKey;
  const definition = editorGameDataRepository.getOperator(slug);
  return getOperatorCombatSkillName(definition?.assetSlug ?? slug, groupKey, locale.value);
}

type BuffPresentationSource = {
  readonly sourceId?: string;
  readonly sourceActionId?: string;
};

function contingencyContractBuffName(segment: BuffPresentationSource): string | undefined {
  const presentation = resolveContingencyContractBuffPresentation(
    segment.sourceActionId,
    publishedSimulation.value?.scenario.mechanics.selections ?? [],
  );
  return presentation === undefined
    ? undefined
    : localizedContingencyContractTagName(presentation.tag, locale.value);
}

function buffDisplayName(segment: BuffPresentationSource): string | undefined {
  return contingencyContractBuffName(segment);
}

function buffIcon(segment: BuffPresentationSource): string | undefined {
  const source = resolvePublishedBuffSource(
    segment,
    publishedSimulation.value?.scenario,
    publishedOperators.value,
    publishedWeaponSources.value,
  );
  return source?.kind === 'weapon' ? source.iconPath : undefined;
}

function buffSourceName(segment: BuffPresentationSource): string | undefined {
  const contractTagName = contingencyContractBuffName(segment);
  if (contractTagName !== undefined) {
    return formatContingencyContractBuffSourceName(
      t('contingencyContract.title'),
      t('contingencyContract.operationName'),
      contractTagName,
    );
  }
  const source = resolvePublishedBuffSource(
    segment,
    publishedSimulation.value?.scenario,
    publishedOperators.value,
    publishedWeaponSources.value,
  );
  if (source === undefined) return undefined;
  switch (source.kind) {
    case 'custom':
      return source.name;
    case 'skill':
      return source.slug === null
        ? source.key
        : getOperatorCombatSkillName(
            source.slug,
            source.key,
            locale.value,
            source.fallbackKey === undefined
              ? undefined
              : getOperatorCombatSkillName(source.slug, source.fallbackKey, locale.value),
          );
    case 'weapon':
      return source.name ?? getWeaponGameName(source.slug, locale.value);
    case 'gear':
      return getGearPieceGameName(source.slug, locale.value);
    case 'gearSet':
      return getGearSetGameName(source.slug, locale.value);
    case 'talent':
      return getOperatorTalentName(source.slug, source.index, 0, locale.value);
    case 'potential':
      return getOperatorPotentialName(source.slug, source.index, locale.value);
  }
}

function openBuffDetail(target: BuffDetailTarget): void {
  buffDetailTarget.value = target;
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
  const fallbackLabel = cast.skillType === null ? source.skillKey : skillTypeLabel(cast.skillType);
  return entry === undefined
    ? fallbackLabel
    : timelineSkillBlockLabel(entry, source.skillKey, skillSegmentLabels(), fallbackLabel);
}

const OPERATOR_ELEMENT_SKILL_COLORS: Readonly<Record<string, string>> = {
  heat: '#ff4d4f',
  cryo: '#00e5ff',
  electric: '#ffbf00',
  nature: '#52c41a',
  physical: '#e0e0e0',
};

/**
 * 照录旧版技能块配色边界：普攻、连携、处决和下落攻击由技能类型定色，
 * 战技与终结技继承干员属性色。轮廓差异仍由 TimelineActionBlock 的技能类型样式负责。
 */
function skillAccentColor(skillType: string | null, operatorSlug: string | null): string {
  const typeColor =
    skillType === 'basicAttack'
      ? '#aaaaaa'
      : skillType === 'comboSkill'
        ? '#fdd900'
        : skillType === 'finisher'
          ? '#a61d24'
          : skillType === 'plungingAttack'
            ? '#69c0ff'
            : null;
  if (typeColor !== null) return typeColor;

  const element =
    operatorSlug === null ? null : editorGameDataRepository.getOperator(operatorSlug)?.element;
  if (element !== null && element !== undefined) {
    return OPERATOR_ELEMENT_SKILL_COLORS[element] ?? '#8c8c8c';
  }
  return skillType === 'ultimate' ? '#00e5ff' : skillType === 'battleSkill' ? '#ffffff' : '#8c8c8c';
}

function skillDisplayIcon(skillType: string, operatorSlug: string | null): string {
  if (operatorSlug === null) return '';
  const operator = editorGameDataRepository.getOperator(operatorSlug);
  const assetSlug = operator?.assetSlug ?? operatorSlug;
  if (skillType === 'battleSkill' || skillType === 'comboSkill' || skillType === 'ultimate') {
    return getOperatorSkillIconPath(assetSlug, skillType) ?? '';
  }
  const weaponType = operator?.weaponType ?? 'sword';
  return getWeaponActionIconPath(weaponType);
}

function skillDurationSeconds(entry: TimelineSkillLibraryEntryViewModel): number {
  const frames = layoutSkillGroupPlacement(
    entry.skills.filter(skill => entry.groupPlacementSkillKeys.includes(skill.skillKey)),
  ).durationFrames;
  return Math.round((frames / 30) * 1000) / 1000;
}

function applyActionSelection(selection: TimelineActionSelection): void {
  if (selection.primaryId !== null) selectedLibrarySkill.value = null;
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
  selectedLibrarySkill.value = null;
  timelineSelection.value = clearTimelineEditorSelection(timelineSelection.value);
}

function selectLibrarySkill(entry: TimelineSkillLibraryEntryViewModel, skillKey?: string): void {
  cancelLibraryPlacement();
  clearTimelineSelection();
  selectedLibrarySkill.value = {
    entryKey: entry.entryKey,
    ...(skillKey === undefined ? {} : { skillKey }),
  };
}

function selectedLibrarySkillName(): string {
  const entry = selectedLibraryEntry.value;
  const skillKey = selectedLibrarySkill.value?.skillKey;
  if (entry === null || skillKey === undefined) {
    return entry === null ? '' : skillLibraryEntryName(entry);
  }
  return skillName(skillKey, selectedTrackModel.value.operatorSlug);
}

function selectedLibrarySkillDurationFrames(): number {
  const entry = selectedLibraryEntry.value;
  if (entry === null) return 0;
  const skillKey = selectedLibrarySkill.value?.skillKey;
  if (skillKey !== undefined) {
    return skillPlacementDisplayFrames(
      entry.skills.find(skill => skill.skillKey === skillKey)?.timelineBlockFrames ?? 0,
    );
  }
  return layoutSkillGroupPlacement(
    entry.skills.filter(skill => entry.groupPlacementSkillKeys.includes(skill.skillKey)),
  ).durationFrames;
}

function isTrackIdentitySelected(trackIndex: TrackIndex): boolean {
  const primary = timelineSelection.value.primary;
  return primary.kind === 'track' && primary.trackIndex === trackIndex;
}

function locateBattleLogEntry(frame: number, castId: string | null): void {
  const targetFrame = Math.max(
    -scenario.value.battle.prepFrames,
    Math.min(scenario.value.battle.durationFrames, frame),
  );
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
      TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(targetFrame) - viewport.clientWidth / 2;
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
  if (connectionDrag.value?.pointerId !== event.pointerId) return;
  const pointer = pointerInTimelineSurface(event);
  if (pointer === null || connectionDrag.value === null) return;
  connectionDrag.value = { ...connectionDrag.value, pointer };
}

function cancelConnectionDrag(event?: PointerEvent): void {
  if (event !== undefined && connectionDrag.value?.pointerId !== event.pointerId) return;
  connectionDrag.value?.lease.release();
  connectionDrag.value = null;
  window.removeEventListener('pointermove', updateConnectionDrag);
  window.removeEventListener('pointerup', finishConnectionDrag);
  window.removeEventListener('pointercancel', cancelConnectionDrag);
}

function finishConnectionDrag(event: PointerEvent): void {
  const drag = connectionDrag.value;
  if (drag?.pointerId !== event.pointerId) return;
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
    const targetTrackIndex = viewModel.value.tracks.findIndex(track =>
      track.skillCasts.some(castModel => castModel.id === targetSkillCastId),
    );
    const targetMarkers =
      targetTrackIndex < 0 ? [] : castHitMarkers(targetTrackIndex as TrackIndex, targetSkillCastId);
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
  if (!connectionToolEnabled.value || event.button !== 0) return;
  const pointer = pointerInTimelineSurface(event);
  if (pointer === null) return;
  const lease = interactionSession.tryStart('connection-drag', cancelConnectionDrag);
  if (lease === null) return;
  connectionDrag.value = { skillCastId, port, pointer, pointerId: event.pointerId, lease };
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
      (libraryPlacement.value?.entryKey === entry.entryKey &&
        libraryPlacement.value?.skillKey === skill.skillKey) ||
      (selectedLibrarySkill.value?.entryKey === entry.entryKey &&
        selectedLibrarySkill.value?.skillKey === skill.skillKey),
    disabled: false,
  }));
}

function selectTimelinePosition(event: MouseEvent): void {
  const lane = event.currentTarget as HTMLElement;
  cursorFrame.value = Math.max(
    -scenario.value.battle.prepFrames,
    Math.min(
      scenario.value.battle.durationFrames,
      timelinePointerActualFrame(event.clientX - lane.getBoundingClientRect().left),
    ),
  );
  clearTimelineSelection();
}

const { marqueeStyle, beginMarqueeGesture, consumeLaneClickSuppression } =
  useTimelineMarqueeGesture({
    interactionSession,
    surface: timelineSurface,
    getSelection: () => actionSelection.value,
    applySelection: applyActionSelection,
  });
const { isPanning, beginViewportPan } = useTimelineViewportPan({
  viewport: timelineScroll,
  interactionSession,
});

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

function pointerMarkerFrame(clientX: number, grabOffsetPx = 0): number {
  const surface = timelineSurface.value;
  if (surface === null) return cursorFrame.value;
  return resolveTimelineMarkerPointerFrame({
    clientX,
    grabOffsetPx,
    surfaceLeftPx: surface.getBoundingClientRect().left,
    trackHeaderWidthPx: TIMELINE_TRACK_HEADER_WIDTH,
    pxPerFrame: pxPerFrame.value,
    prepFrames: scenario.value.battle.prepFrames,
    snapFrames: snapFrames.value,
    maximumFrame: scenario.value.battle.durationFrames,
    prepExpanded: scenario.value.editor.prepExpanded,
  });
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
    | 'teamHit'
    | 'enemyWeaknessSet'
    | 'comboCooldown'
    | 'comboReady',
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
      kind === 'comboCooldown' || kind === 'comboReady'
        ? { kind: 'comboCooldownControl', mode: kind === 'comboReady' ? 'ready' : 'cooldown' }
        : kind === 'operatorWeakness'
          ? { kind: 'operatorWeaknessTriggeredOutput' }
          : kind === 'enemyWeaknessSet'
            ? { kind: 'enemyWeaknessSet' }
            : { kind: 'operatorHit', tags: [], features: [] };
    const eventTarget =
      kind === 'teamHit' ||
      kind === 'enemyWeaknessSet' ||
      kind === 'comboCooldown' ||
      kind === 'comboReady'
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

function setPrepExpanded(expanded: boolean): void {
  commitScenario('setTimelinePrepExpanded', current => setTimelinePrepExpanded(current, expanded));
}

function beginTimelinePrepResize(event: PointerEvent): void {
  if (!scenario.value.editor.prepExpanded) return;
  if (event.button !== 0) return;
  const surface = timelineSurface.value;
  if (surface === null) return;
  event.preventDefault();
  event.stopPropagation();
  const lease = interactionSession.tryStart('timeline-prep-resize', () =>
    stopTimelinePrepResize?.(),
  );
  if (lease === null) return;
  const update = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== event.pointerId) return;
    const localPx =
      moveEvent.clientX - surface.getBoundingClientRect().left - TIMELINE_TRACK_HEADER_WIDTH;
    const frame = Math.max(
      0,
      Math.round(localPx / pxPerFrame.value / snapFrames.value) * snapFrames.value,
    );
    timelinePrepPreviewFrames.value = frame;
  };
  const teardownPrepResize = () => {
    lease.release();
    window.removeEventListener('pointermove', update);
    window.removeEventListener('pointerup', finishPrepResize);
    window.removeEventListener('pointercancel', cancelPrepResize);
    stopTimelinePrepResize = null;
  };
  const finishPrepResize = (finishEvent: PointerEvent) => {
    if (finishEvent.pointerId !== event.pointerId) return;
    const frames = timelinePrepPreviewFrames.value;
    teardownPrepResize();
    if (frames !== null && frames !== scenario.value.battle.prepFrames) {
      setTimelinePrepFrames(frames);
    }
    timelinePrepPreviewFrames.value = null;
  };
  const cancelPrepResize = (cancelEvent?: PointerEvent) => {
    if (cancelEvent !== undefined && cancelEvent.pointerId !== event.pointerId) return;
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
  if (interactionSession.current !== null) return;
  event.preventDefault();
  event.stopPropagation();
  stopMarkerMove?.();
  if (trackIndex !== selectedTrack.value) selectedTrack.value = trackIndex;
  const surface = timelineSurface.value;
  if (surface === null) return;
  const lease = interactionSession.tryStart('marker-move', () => stopMarkerMove?.())!;
  const grabOffsetPx =
    event.clientX -
    surface.getBoundingClientRect().left -
    TIMELINE_TRACK_HEADER_WIDTH -
    timelineFramePx(frame);
  const wasComboControlSelected =
    selectedMarker.value?.kind === kind &&
    selectedMarker.value.id === id &&
    selectedExternalEventMarker.value?.event.kind === 'comboCooldownControl';
  clearTimelineSelection();
  selectedMarker.value = { kind, id };
  markerMoveGesture.value = {
    pointerId: event.pointerId,
    initialPointerX: event.clientX,
    initialPointerY: event.clientY,
    latestPointerX: event.clientX,
    latestPointerY: event.clientY,
    dragStarted: false,
    kind,
    id,
    initialFrame: frame,
    previewFrame: frame,
  };
  const update = (pointerId: number, clientX: number, clientY: number, fromAutoScroll = false) => {
    let gesture = markerMoveGesture.value;
    if (gesture === null || gesture.pointerId !== pointerId) return;
    if (!fromAutoScroll) {
      gesture = { ...gesture, latestPointerX: clientX, latestPointerY: clientY };
      markerMoveGesture.value = gesture;
    }
    if (
      !gesture.dragStarted &&
      !passedTimelineDragThreshold(
        gesture.initialPointerX,
        gesture.initialPointerY,
        clientX,
        clientY,
      )
    ) {
      return;
    }
    if (!fromAutoScroll) scheduleMarkerMoveAutoScroll(update);
    markerMoveGesture.value = {
      ...gesture,
      dragStarted: true,
      previewFrame: pointerMarkerFrame(clientX, grabOffsetPx),
    };
  };
  const move = (moveEvent: PointerEvent) =>
    update(moveEvent.pointerId, moveEvent.clientX, moveEvent.clientY);
  const cleanup = () => {
    lease.release();
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', cancel);
    if (markerMoveAutoScrollFrame !== null) cancelAnimationFrame(markerMoveAutoScrollFrame);
    markerMoveAutoScrollFrame = null;
    stopMarkerMove = null;
  };
  const cancel = (cancelEvent?: PointerEvent) => {
    const gesture = markerMoveGesture.value;
    if (cancelEvent !== undefined && gesture?.pointerId !== cancelEvent.pointerId) return;
    markerMoveGesture.value = null;
    cleanup();
  };
  const finish = (finishEvent: PointerEvent) => {
    update(finishEvent.pointerId, finishEvent.clientX, finishEvent.clientY);
    const gesture = markerMoveGesture.value;
    if (gesture === null || gesture.pointerId !== finishEvent.pointerId) return;
    markerMoveGesture.value = null;
    cleanup();
    if (!gesture.dragStarted && wasComboControlSelected) clearTimelineSelection();
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
}

function scheduleMarkerMoveAutoScroll(
  update: (pointerId: number, clientX: number, clientY: number, fromAutoScroll?: boolean) => void,
): void {
  if (markerMoveAutoScrollFrame !== null) return;
  const tick = () => {
    markerMoveAutoScrollFrame = null;
    const gesture = markerMoveGesture.value;
    const viewport = timelineScroll.value;
    if (gesture === null || viewport === null || !gesture.dragStarted) return;
    const rect = viewport.getBoundingClientRect();
    const delta = projectTimelineEdgeAutoScrollDelta({
      pointerX: gesture.latestPointerX,
      pointerY: gesture.latestPointerY,
      left: rect.left + TIMELINE_TRACK_HEADER_WIDTH,
      right: rect.right,
      top: rect.top + TIMELINE_RULER_HEIGHT,
      bottom: rect.bottom,
    });
    if (delta.x === 0) return;
    const previousLeft = viewport.scrollLeft;
    viewport.scrollLeft += delta.x;
    if (viewport.scrollLeft === previousLeft) return;
    update(gesture.pointerId, gesture.latestPointerX, gesture.latestPointerY, true);
    markerMoveAutoScrollFrame = requestAnimationFrame(tick);
  };
  markerMoveAutoScrollFrame = requestAnimationFrame(tick);
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
    scenario.value.editor.prepExpanded,
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
  if (libraryPlacementLease === null) {
    libraryPlacementLease = interactionSession.tryStart(
      'library-placement',
      cancelLibraryPlacement,
    );
    if (libraryPlacementLease === null) return;
  }
  skillPlacementTransaction.cancel();
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
  libraryPlacementLease?.release();
  libraryPlacementLease = null;
  const cancelledPending = skillPlacementTransaction.cancel();
  if (libraryPlacement.value === null) return cancelledPending;
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
  return (
    (placement !== null && placement.entryKey === entry.entryKey) ||
    selectedLibrarySkill.value?.entryKey === entry.entryKey
  );
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
    -scenario.value.battle.prepFrames,
  );
  cursorFrame.value = frame;
  cancelLibraryPlacement();
  void placeGroup(
    placement.skillGroupKey,
    placement.skillKey,
    frame,
    trackIndex,
    placement.variantKey,
  );
  return true;
}

async function placeGroup(
  skillGroupKey: string,
  skillKey?: string,
  startFrame = cursorFrame.value,
  trackIndex = selectedTrack.value,
  variantKey?: string,
): Promise<void> {
  const operatorSlug = viewModel.value.tracks[trackIndex]?.operatorSlug ?? null;
  const operator =
    operatorSlug === null ? null : editorGameDataRepository.getOperator(operatorSlug);
  if (operator === null) return;
  const shouldAutoGroup =
    autoGroupBasicAttackSequences.value &&
    skillKey === undefined &&
    operator.skillGroups.find(group => group.key === skillGroupKey)?.skillType === 'basicAttack';
  const result = placeLibrarySkillGroup({
    scenario: scenario.value,
    trackIndex,
    operator,
    skillGroupKey,
    ...(variantKey === undefined ? {} : { variantKey }),
    ...(skillKey === undefined ? {} : { skillKey }),
    startFrame,
    ids,
  });
  let placedScenario = result.scenario;
  let placedIds = result.skillCastIds;
  if (result.skillCastIds.length > 1 || result.extension !== undefined) {
    const planned = await skillPlacementTransaction.resolve(result);
    if (planned === null) return;
    placedScenario = planned.scenario;
    placedIds = planned.skillCastIds ?? placedIds;
    if (planned.incomplete)
      ElMessage.warning(
        t(
          result.extension
            ? 'timeline.recursiveChainPlacementIncomplete'
            : 'timeline.chainPlacementIncomplete',
        ),
      );
    if ('error' in planned)
      ElMessage.error(
        planned.error instanceof Error ? planned.error.message : t('timeline.chainPlacementFailed'),
      );
  } else {
    skillPlacementTransaction.cancel();
  }
  if (shouldAutoGroup && placedIds.length > 1) {
    placedScenario = groupPlacedSkillSequence(placedScenario, placedIds);
  }
  commitScenario('placeSkillGroup', () => placedScenario);
  const lastPlacedId = placedIds.at(-1);
  if (lastPlacedId === undefined) clearTimelineSelection();
  else applyActionSelection(selectTimelineAction(actionSelection.value, lastPlacedId, false));
  const placed = placedScenario.tracks[trackIndex]?.skillCasts ?? [];
  const last = placed.find(cast => cast.id === lastPlacedId);
  if (last !== undefined) {
    const lastSkillDuration = resolvePlacedSkillDurationFrames(
      operator,
      skillGroupKey,
      last.source.kind === 'operatorSkill' ? last.source.skillKey : skillKey,
      variantKey,
    );
    cursorFrame.value = resolvedSkillCastStartFrames.value.get(last.id)! + lastSkillDuration;
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
  operator: ReturnType<typeof gameDataRepository.getOperator>,
  skillGroupKey: string,
  skillKey?: string,
  variantKey?: string,
): number {
  if (operator === null) return 0;
  const group = operator.skillGroups.find(g => g.key === skillGroupKey);
  if (group === undefined) return 0;
  const lastSkill = resolveSkillGroupPlacementSkills(group, variantKey, skillKey).at(-1);
  return skillPlacementDisplayFrames(lastSkill?.timelineBlockFrames ?? 0);
}

function resolveLibraryDropRegion(event: DragEvent): HTMLElement | null {
  const viewport = timelineScroll.value;
  const lane = trackDropRegions.get(selectedTrack.value);
  // Do not drop through an unrelated/teleported panel into the canvas behind it.
  if (
    viewport === null ||
    lane === undefined ||
    !lane.isConnected ||
    !(event.target instanceof Node) ||
    !viewport.contains(event.target)
  )
    return null;
  const rect = viewport.getBoundingClientRect();
  return isInsideTimelineDropRegion({
    x: event.clientX,
    y: event.clientY,
    lane: lane.getBoundingClientRect(),
    viewport: {
      left: rect.left,
      top: rect.top,
      right: rect.left + viewport.clientWidth,
      bottom: rect.top + viewport.clientHeight,
    },
    headerWidth: TIMELINE_TRACK_HEADER_WIDTH,
    rulerHeight: TIMELINE_RULER_HEIGHT,
  })
    ? lane
    : null;
}

// Negotiate on entry too: a quick release after crossing a child/overlay may happen
// before the browser sends its next dragover at the new target.
function guardLibrarySkillDragOver(event: DragEvent): void {
  if (dragPayload.value?.kind !== 'librarySkill') return;
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer !== null) {
    event.dataTransfer.dropEffect = resolveLibraryDropRegion(event) === null ? 'none' : 'copy';
  }
}

/** The active workbench routes the drop before child controls can consume its text payload. */
function guardLibrarySkillDrop(event: DragEvent): void {
  if (dragPayload.value?.kind !== 'librarySkill') return;
  event.preventDefault();
  event.stopPropagation();
  const lane = resolveLibraryDropRegion(event);
  if (lane === null) finishSkillDrag();
  else dropTimelinePayload(event, selectedTrack.value, lane);
}

function beginSkillDrag(
  event: DragEvent,
  entry: TimelineSkillLibraryEntryViewModel,
  skillKey?: string,
): void {
  if (!(event.target instanceof Element) || !event.target.isConnected) {
    event.preventDefault();
    return;
  }
  const placedSkillKey = skillKey ?? entry.placementSkillKey;
  const lease = interactionSession.tryStart('library-drag', finishSkillDrag);
  if (lease === null) {
    event.preventDefault();
    return;
  }
  libraryDragLease = lease;
  disposeLibraryDragLifetime = observeNativeDragLifetime(event.target, () => {
    if (lease.isCurrent()) finishSkillDrag();
  });
  window.addEventListener('drop', guardLibrarySkillDrop, true);
  window.addEventListener('dragover', guardLibrarySkillDragOver, true);
  window.addEventListener('dragenter', guardLibrarySkillDragOver, true);
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
      : Math.round(
          (skillPlacementDisplayFrames(draggedSkill.timelineBlockFrames) / PROJECT_FPS) * 1000,
        ) / 1000;
  const label =
    placedSkillKey === undefined
      ? skillLibraryTypeLabel(entry)
      : (timelineSkillSegmentLabel(entry, placedSkillKey, skillSegmentLabels()) ??
        skillLibraryTypeLabel(entry));
  const ghost = createLibraryDragGhost(
    { name: label, duration: durationSeconds },
    pxPerFrame.value * PROJECT_FPS,
    () => skillAccentColor(entry.skillType, selectedTrackModel.value.operatorSlug),
  );
  if (event.dataTransfer !== null) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', placedSkillKey ?? entry.skillGroupKey);
    event.dataTransfer.setDragImage(ghost, offsets.dragOffsetX, offsets.dragOffsetY);
  }
}

function finishSkillDrag(): void {
  disposeLibraryDragLifetime?.();
  disposeLibraryDragLifetime = null;
  libraryDragLease?.release();
  libraryDragLease = null;
  window.removeEventListener('drop', guardLibrarySkillDrop, true);
  window.removeEventListener('dragover', guardLibrarySkillDragOver, true);
  window.removeEventListener('dragenter', guardLibrarySkillDragOver, true);
  if (dragPayload.value?.kind === 'librarySkill') dragPayload.value = null;
  removeLibraryDragGhost();
}

function beginCastMove(event: PointerEvent, trackIndex: TrackIndex, skillCastId: string): void {
  if (event.button !== 0) return;
  if (interactionSession.current !== null) return;
  if (alignSelectedCastToTarget(event, skillCastId)) return;
  event.preventDefault();
  event.stopPropagation();
  cancelCastMove();
  const selection = actionSelection.value.selectedIds.has(skillCastId)
    ? { ...actionSelection.value, primaryId: skillCastId }
    : selectTimelineAction(actionSelection.value, skillCastId, false);
  const movingIds = expandSkillCastGroupSelection(scenario.value, selection.selectedIds);
  const selectedCasts = scenario.value.tracks.flatMap(track =>
    track === null ? [] : track.skillCasts.filter(candidate => movingIds.has(candidate.id)),
  );
  if (selectedCasts.some(candidate => candidate.presentation?.locked ?? false)) {
    event.preventDefault();
    event.stopPropagation();
    ElMessage.warning(t('timelineGrid.action.locked'));
    return;
  }
  const block = event.currentTarget as HTMLElement;
  const cast = scenario.value.tracks[trackIndex]?.skillCasts.find(
    candidate => candidate.id === skillCastId,
  );
  if (cast === undefined) return;
  const anchor = getSkillCastPlacementAnchor(
    scenario.value.tracks[trackIndex]!.skillCasts,
    cast.id,
  );
  const baseStartFrames = resolvedSkillCastStartFrames.value;
  const initialActualFrame = baseStartFrames.get(anchor.id)!;
  const initialPlacementFrame = anchor.placement.startFrame!;
  const pointerTimelinePx =
    timelineFramePx(baseStartFrames.get(cast.id)!) +
    event.clientX -
    block.getBoundingClientRect().left;
  const pointerOffsetActualFrames = Math.max(
    0,
    timelinePxToExactFrame(
      pointerTimelinePx,
      scenario.value.battle.prepFrames,
      pxPerFrame.value,
      scenario.value.editor.prepExpanded,
    ) - initialActualFrame,
  );
  castMoveGesture.value = {
    pointerId: event.pointerId,
    trackIndex,
    skillCastId: anchor.id,
    pointerCastId: skillCastId,
    skillCastIds: [...movingIds],
    baseStartFrames,
    pointerOffsetActualFrames,
    initialPointerX: event.clientX,
    initialPointerY: event.clientY,
    latestPointerX: event.clientX,
    latestPointerY: event.clientY,
    baseScenario: scenario.value,
    previewFrame: initialPlacementFrame,
    previewActualFrame: initialActualFrame,
    committed: false,
    dragStarted: false,
    moved: false,
  };
  simulationService.beginInteractiveSession();
  // 捕获到稳定的滚动容器，避免模拟刷新替换技能块或跨控件悬停抢走手势。
  // 落点仍通过 elementFromPoint 解析，不依赖捕获后的 event.target。
  const captureTarget = timelineScroll.value;
  const lease = interactionSession.tryStart('cast-move', cancelCastMove)!;
  const onMove = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== event.pointerId) return;
    moveEvent.stopPropagation();
    updateCastMove(moveEvent);
    // 超过拖动阈值才接管，普通点击仍交给原技能块，不能丢失选择行为。
    if (castMoveGesture.value?.dragStarted && !captureTarget?.hasPointerCapture(event.pointerId)) {
      captureTarget?.setPointerCapture(event.pointerId);
    }
  };
  const onFinish = (finishEvent: PointerEvent) => {
    if (finishEvent.pointerId !== event.pointerId) return;
    finishEvent.stopPropagation();
    void finishCastMove(finishEvent);
  };
  const onCancel = () => cancelCastMove();
  stopCastMoveGesture = () => {
    simulationService.endInteractiveSession();
    lease.release();
    window.removeEventListener('pointermove', onMove, true);
    window.removeEventListener('pointerup', onFinish, true);
    window.removeEventListener('pointercancel', onCancel);
    captureTarget?.removeEventListener('lostpointercapture', onCancel);
    window.removeEventListener('blur', onCancel);
    if (captureTarget?.hasPointerCapture(event.pointerId)) {
      captureTarget.releasePointerCapture(event.pointerId);
    }
    if (castMoveAutoScrollFrame !== null) cancelAnimationFrame(castMoveAutoScrollFrame);
    castMoveAutoScrollFrame = null;
    stopCastMoveGesture = null;
  };
  window.addEventListener('pointermove', onMove, true);
  window.addEventListener('pointerup', onFinish, true);
  window.addEventListener('pointercancel', onCancel);
  captureTarget?.addEventListener('lostpointercapture', onCancel);
  window.addEventListener('blur', onCancel);
}

function castMoveFrame(
  clientX: number,
  clientY: number,
  gesture: TimelineCastMoveGesture,
): { readonly placementFrame: number; readonly actualFrame: number } | null {
  const pointed = document.elementFromPoint(clientX, clientY);
  const lane = pointed instanceof Element ? pointed.closest<HTMLElement>('.track-lane') : null;
  if (lane?.dataset.trackIndex !== String(gesture.trackIndex)) return null;
  return resolveTimelineCastMovePointerFrame({
    clientX,
    laneLeftPx: lane.getBoundingClientRect().left,
    pxPerFrame: pxPerFrame.value,
    prepFrames: scenario.value.battle.prepFrames,
    prepExpanded: scenario.value.editor.prepExpanded,
    pointerOffsetActualFrames: gesture.pointerOffsetActualFrames,
    snapFrames: snapFrames.value,
    minimumFrame: -scenario.value.battle.prepFrames,
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
  const movedScenario = moveSkillCasts(
    gesture.baseScenario,
    new Set(gesture.skillCastIds),
    gesture.trackIndex,
    gesture.skillCastId,
    frame.placementFrame,
    gesture.baseStartFrames,
  );
  // 多选按共享位移整体限位。预览必须使用命令实际采用的落点，不能让主块单独越界。
  const placedFrame = movedScenario.tracks[gesture.trackIndex]!.skillCasts.find(
    cast => cast.id === gesture.skillCastId,
  )!.placement.startFrame!;
  const actualFrame = frame.actualFrame + placedFrame - frame.placementFrame;
  if (placedFrame === gesture.previewFrame && actualFrame === gesture.previewActualFrame) {
    return;
  }
  if (!gesture.moved) {
    gesture.moved = true;
    applyActionSelection({
      selectedIds: new Set(gesture.skillCastIds),
      primaryId: gesture.pointerCastId,
    });
  }
  castMoveGesture.value = {
    ...gesture,
    previewFrame: placedFrame,
    previewActualFrame: actualFrame,
  };
  if (placedFrame !== gesture.previewFrame) {
    scenario.value = movedScenario;
  }
  cursorFrame.value = placedFrame;
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
  suppressedCastClickId = gesture.pointerCastId;
  setTimeout(() => {
    if (suppressedCastClickId === gesture.pointerCastId) suppressedCastClickId = null;
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
  const lease = interactionSession.tryStart('track-order', finishTrackOrderDrag);
  if (lease === null) {
    event.preventDefault();
    return;
  }
  trackOrderLease = lease;
  dragPayload.value = { kind: 'trackOrder', trackIndex };
  trackOrderDropTarget.value = null;
  if (event.dataTransfer !== null) event.dataTransfer.effectAllowed = 'move';
}

function finishTrackOrderDrag(): void {
  trackOrderLease?.release();
  trackOrderLease = null;
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
  finishTrackOrderDrag();
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

function dropTimelinePayload(
  event: DragEvent,
  trackIndex: TrackIndex,
  dropRegion?: HTMLElement,
): void {
  const payload = dragPayload.value;
  dragPayload.value = null;
  if (payload === null) return;
  event.preventDefault();
  trackOrderDropTarget.value = null;
  if (payload.kind === 'trackOrder') {
    finishTrackOrderDrag();
    swapTrackOrder(payload.trackIndex, trackIndex);
    return;
  }
  finishSkillDrag();
  if (trackIndex !== selectedTrack.value) return;
  const lane = dropRegion ?? (event.currentTarget as HTMLElement);
  const frame = resolveTimelineLibraryDropFrame({
    clientX: event.clientX,
    laneLeftPx: lane.getBoundingClientRect().left,
    dragOffsetPx: payload.dragOffsetX,
    pxPerFrame: pxPerFrame.value,
    prepFrames: scenario.value.battle.prepFrames,
    prepExpanded: scenario.value.editor.prepExpanded,
    snapFrames: snapFrames.value,
    maximumFrame: scenario.value.battle.durationFrames,
  });
  cursorFrame.value = frame;
  void placeGroup(payload.skillGroupKey, payload.skillKey, frame, trackIndex, payload.variantKey);
}

const resetDialogVisible = ref(false);

function resetScenario(mode: TimelineResetMode): void {
  const changed = projectSession.commit('resetScenarios', project =>
    resetProjectScenarios(project, mode),
  );
  if (!changed) return;
  resetTransientScenarioUi();
  cursorFrame.value = 0;
  timelineScroll.value?.scrollTo({ left: 0, top: 0 });
}

function resetTransientScenarioUi(): void {
  // 丢弃旧方案的拖动预览，不能让取消回调把旧草稿写回已切换的方案。
  castMoveGesture.value = null;
  stopCastMoveGesture?.();
  interactionSession.cancel();
  suppressedCastClickId = null;
  selectedTrack.value = 0;
  clearTimelineSelection();
  cursorFrame.value = 30;
  cursorGuide.value = null;
  hoveredCastId.value = null;
  alignmentGuide.value = null;
  placementPointer.value = null;
  contextMenuTarget.value = null;
  markerContextTarget.value = null;
  cancelLibraryPlacement();
  hitDetailTarget.value = null;
  enemyDamageDetailSequence.value = null;
  buffDetailTarget.value = null;
  showDamageAnalysis.value = false;
  showExportDialog.value = false;
  showSmallImageExport.value = false;
  showSkillDefinitionEditor.value = false;
  showOperatorDefinitionWorkspace.value = false;
  showWeaponDefinitionWorkspace.value = false;
  gearDefinitionWorkspaceSlot.value = null;
  gearSetDefinitionWorkspaceId.value = null;
  operatorDialogTrack.value = null;
  weaponDialogTrack.value = null;
  gearDialogTarget.value = null;
  panelDialogTrack.value = null;
  showOperatorBuildDialog.value = false;
  showWeaponBuildDialog.value = false;
  showGearBuildDialog.value = false;
  resetDialogVisible.value = false;
}

function renameScenario(name: string): void {
  projectSession.commit('renameScenario', project => renameActiveScenario(project, name));
}

function selectScenario(scenarioId: string): void {
  projectSession.commit('switchScenario', project => switchProjectScenario(project, scenarioId));
}

function addScenario(): void {
  const project = projectSession.snapshot.project;
  if (project.scenarios.length >= MAX_PROJECT_SCENARIOS) {
    ElMessage.warning(t('timeline.scenario.limit', { max: MAX_PROJECT_SCENARIOS }));
    return;
  }
  projectSession.commit('addScenario', current =>
    addProjectScenario(
      current,
      t('timeline.scenario.defaultName', { index: current.scenarios.length + 1 }),
    ),
  );
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
    await serviceModalBoundary.run(() =>
      ElMessageBox.confirm(
        t('timeline.scenario.deleteConfirm'),
        t('timeline.scenario.deleteTitle'),
        {
          confirmButtonText: t('common.delete'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
        },
      ),
    );
  } catch {
    return;
  }
  const changed = projectSession.commit('deleteScenario', deleteActiveScenario);
  if (!changed) return;
  ElMessage.success(t('timeline.scenario.deleted'));
}

function restoreEditorHistory(direction: 'undo' | 'redo'): boolean {
  const restored = direction === 'undo' ? scenarioSession.undo() : scenarioSession.redo();
  if (!restored) return false;
  clearTimelineSelection();
  contextMenuTarget.value = null;
  // 历史项可能只改变定义库而保持活动场景引用不变，不能只依赖场景 watcher。
  refreshSimulationAfterDefinitionChange();
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

const compactSelection = computed(() =>
  resolveCompactSkillSelection(scenario.value, actionSelection.value.selectedIds),
);
const continuousGroupSelection = computed(() =>
  resolveSkillCastGroupSelection(
    scenario.value,
    actionSelection.value.selectedIds,
    displayedSkillCastStartFrames.value,
  ),
);
const selectionIncludesContinuousGroup = computed(() =>
  skillCastGroupsByTrack.value.some(groups =>
    groups.some(group => group.casts.some(cast => actionSelection.value.selectedIds.has(cast.id))),
  ),
);

function createSelectedSkillCastGroup(): void {
  const selection = continuousGroupSelection.value;
  if (!selection.ok || selection.alreadyGrouped) return;
  const starts = displayedSkillCastStartFrames.value;
  commitScenario('createSkillCastGroup', current =>
    createSkillCastGroup(current, selection.castIds, starts),
  );
  contextMenuTarget.value = null;
}

function dissolveSelectedSkillCastGroups(): void {
  const starts = displayedSkillCastStartFrames.value;
  const selectedIds = actionSelection.value.selectedIds;
  commitScenario('dissolveSkillCastGroups', current =>
    dissolveSkillCastGroups(current, selectedIds, starts),
  );
  contextMenuTarget.value = null;
}

function selectSkillCastGroup(castIds: readonly string[]): void {
  applyActionSelection({ selectedIds: new Set(castIds), primaryId: castIds[0] ?? null });
}

function skillCastGroupEndFrame(castIds: readonly string[]): number {
  return Math.max(
    ...castIds.map(id => {
      const start = displayedSkillCastStartFrames.value.get(id)!;
      return Math.max(start, visibleSkillEndFrames.value.get(id) ?? start);
    }),
  );
}

function skillCastIsUnexecuted(castId: string): boolean {
  return !skillCastInputFrames.value.has(castId);
}

async function compactSelectedSkills(): Promise<void> {
  const selection = compactSelection.value;
  contextMenuTarget.value = null;
  if (!selection.ok) return;
  const original = scenario.value;
  const widths = new Map(
    viewModel.value.tracks.flatMap(track =>
      track.skillCasts.map(
        cast => [cast.id, castActualDurationFrame(cast.id, cast.durationFrames)] as const,
      ),
    ),
  );
  const result = await skillPlacementTransaction.resolve(
    { scenario: original, skillCastIds: selection.castIds },
    'compact',
  );
  if (result === null) return;
  const compacted = result.incomplete
    ? compactSkillSelectionByWidths(original, selection.castIds, widths, result.plannedStartFrames)
    : result.scenario;
  if (result.incomplete) {
    ElMessage.warning(t('timeline.compactSelection.incomplete'));
  }
  if ('error' in result)
    ElMessage.error(
      result.error instanceof Error ? result.error.message : t('timeline.chainPlacementFailed'),
    );
  const originalFrames = new Map(
    original.tracks.flatMap(track =>
      (track?.skillCasts ?? []).map(cast => [cast.id, cast.placement.startFrame] as const),
    ),
  );
  if (
    !compacted.tracks.some(track =>
      track?.skillCasts.some(cast => originalFrames.get(cast.id) !== cast.placement.startFrame),
    )
  )
    return;
  commitScenario('compactSelectedSkills', () => compacted);
}

function pasteClipboardAtCursor(): void {
  const clipboard = timelineClipboard.value;
  if (clipboard === null) return;
  const pasteFrame = snapTimelineFrame(
    cursorFrame.value,
    snapFrames.value,
    scenario.value.battle.durationFrames,
    -scenario.value.battle.prepFrames,
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
  timelineClipboard.value = copyTimelineActions(
    scenario.value,
    actionSelection.value.selectedIds,
    displayedSkillCastStartFrames.value,
  );
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
  const marker = selectedExternalEventMarker.value ?? selectedDocumentMarker.value;
  if (marker !== null) {
    const frame = Math.max(
      0,
      Math.min(scenario.value.battle.durationFrames, marker.frame + deltaFrames * snapFrames.value),
    );
    if (frame !== marker.frame) {
      if (selectedExternalEventMarker.value !== null) {
        commitScenario('moveExternalEventMarker', current =>
          moveExternalEventMarker(current, marker.id, frame),
        );
      } else {
        setSelectedDocumentMarkerFrame(frame);
      }
    }
    // Consume the shortcut even at a boundary; it must not scroll the page.
    return true;
  }
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
        Math.max(
          -scenario.value.battle.prepFrames,
          resolvedSkillCastStartFrames.value.get(anchor.id)! + deltaFrames * snapFrames.value,
        ),
        resolvedSkillCastStartFrames.value,
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
        ? TIMELINE_TRACK_HEADER_WIDTH + (viewport.clientWidth - TIMELINE_TRACK_HEADER_WIDTH) / 2
        : anchorClientX - viewport.getBoundingClientRect().left;
  const anchorContentX =
    viewport === null || anchorOffset === null ? null : viewport.scrollLeft + anchorOffset;
  const anchorFrame =
    anchorContentX === null
      ? null
      : timelinePxToExactFrame(
          anchorContentX - TIMELINE_TRACK_HEADER_WIDTH,
          scenario.value.battle.prepFrames,
          pxPerFrame.value,
          scenario.value.editor.prepExpanded,
        );

  timelineZoomPercent.value = nextPercent;
  if (viewport === null || anchorFrame === null || anchorOffset === null) return;

  await nextTick();
  viewport.scrollLeft = Math.max(
    0,
    TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(anchorFrame) - anchorOffset,
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
  void updateTimelineZoomPercent(
    wheelTimelineZoomPercent(timelineZoomPercent.value, intent.direction),
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

const hasTimelineContextMenu = computed(
  () => contextMenuTarget.value !== null || markerContextTarget.value !== null,
);

useInteractionBarrier(interactionSession, () => hasTimelineContextMenu.value);

useKeyboardShortcutScope({
  id: 'timeline-overlay',
  region: workbenchInputRegion,
  priority: 100,
  active: () => hasTimelineContextMenu.value,
  handle: () => false,
  blockLowerScopes: true,
});

useKeyboardShortcutScope({
  id: 'timeline-editor',
  region: workbenchInputRegion,
  priority: 10,
  active: () => !hasTimelineContextMenu.value,
  handleClipboard: event => {
    if (isKeyboardShortcutIsolationTarget(event.target)) return false;
    if (event.type === 'copy') return copySelectedActions();
    if (event.type !== 'paste' || timelineClipboard.value === null) return false;
    pasteClipboardAtCursor();
    return true;
  },
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

const selectedContingencyContractTagIds = computed(() =>
  scenario.value.mechanics.selections.flatMap(selection => {
    if (
      !selection.enabled ||
      !selection.mechanicId.startsWith(CONTINGENCY_CONTRACT_MECHANIC_PREFIX)
    ) {
      return [];
    }
    const tagId = Number(selection.mechanicId.slice(CONTINGENCY_CONTRACT_MECHANIC_PREFIX.length));
    return Number.isInteger(tagId) ? [tagId] : [];
  }),
);

function setSelectedContingencyContractTagIds(tagIds: readonly number[]): void {
  commitScenario('setContingencyContractTags', current => ({
    ...current,
    mechanics: {
      selections: [
        ...current.mechanics.selections.filter(
          selection => !selection.mechanicId.startsWith(CONTINGENCY_CONTRACT_MECHANIC_PREFIX),
        ),
        ...tagIds.map(tagId => ({
          id: `mechanic:contingency-contract:${tagId}`,
          mechanicId: contingencyContractMechanicId(tagId),
          enabled: true,
          parameters: {},
        })),
      ],
    },
  }));
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

function setSelectedCastRandomSeed(seed: number | null): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('setSkillCastRandomSeed', current =>
    setSkillCastRandomSeed(current, selected.trackIndex, selected.cast.id, seed),
  );
}

function rollSelectedCastRandomSeed(): void {
  setSelectedCastRandomSeed(globalThis.crypto.getRandomValues(new Uint32Array(1))[0]!);
}

function setScenarioRandomMode(mode: 'expected' | 'sampled'): void {
  commitScenario('setScenarioRandomMode', current => ({
    ...current,
    battle: {
      ...current.battle,
      random: { mode, globalSeed: current.battle.random?.globalSeed ?? 0 },
    },
  }));
}

function setGlobalRandomSeed(globalSeed: number): void {
  commitScenario('setGlobalRandomSeed', current => ({
    ...current,
    battle: {
      ...current.battle,
      random: { mode: current.battle.random?.mode ?? 'expected', globalSeed },
    },
  }));
}

function rollGlobalRandomSeed(): void {
  setGlobalRandomSeed(globalThis.crypto.getRandomValues(new Uint32Array(1))[0]!);
}

function setSelectedCastStartFrame(frame: number): void {
  const selected = selectedCastModel.value;
  if (selected === null || selected.cast.placement.afterCastId !== undefined) return;
  commitScenario('moveSkillCast', current =>
    moveSkillCast(
      current,
      selected.trackIndex,
      selected.cast.id,
      frame,
      displayedSkillCastStartFrames.value,
    ),
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
  <TimelineResetDialog v-model="resetDialogVisible" @confirm="resetScenario" />
  <input
    ref="projectFileInput"
    class="project-file-input"
    type="file"
    accept="application/json,.json"
    @change="handleProjectFileChange"
  />
  <TimelineWorkbenchShell
    :collapsed-monitor-section-count="collapsedMonitorSectionCount"
    :labels="{
      library: t('timeline.activityBar.library'),
      globalConfig: t('timeline.activityBar.globalConfig'),
      contract: t('timeline.activityBar.contract'),
      contractUnavailable: t('timeline.activityBar.contractUnavailable'),
      resourceMonitor: t('timeline.activityBar.resourceMonitor'),
      inspector: t('timeline.activityBar.inspector'),
      performance: t('timeline.performance.title'),
      battleLog: t('timeline.activityBar.battleLog'),
      resetPanel: t('common.reset'),
      collapsePanel: t('common.close'),
    }"
  >
    <template #left>
      <section class="skill-sidebar">
        <div class="library-header">
          <div class="library-header__main">
            <h3 class="operator-heading">
              <span class="operator-heading__mark"></span>
              <span class="operator-heading__main">{{
                operatorName(selectedTrackModel.operatorSlug)
              }}</span>
              <span
                v-if="selectedOperatorFormName"
                class="operator-form-badge"
                :title="selectedOperatorFormName"
                >{{ selectedOperatorFormName }}</span
              >
            </h3>
          </div>
          <div class="library-header__divider"></div>
          <div class="library-section-title library-section-title--status">
            <strong>{{ t('actionLibrary.section.operatorStatusAdjust') }}</strong>
            <span>{{ t('actionLibrary.hints.adjustOperatorStatus') }}</span>
          </div>
          <div class="sidebar-tabs" role="group">
            <EaButton
              variant="ghost"
              type="button"
              :disabled="selectedLoadoutModel.operator === null"
              @click="showOperatorBuildDialog = true"
            >
              {{ t('timeline.operatorTab') }}
            </EaButton>
            <EaButton
              variant="ghost"
              type="button"
              :disabled="selectedLoadoutModel.weapon === null"
              @click="showWeaponBuildDialog = true"
            >
              {{ t('timeline.weaponTab') }}
            </EaButton>
            <EaButton
              variant="ghost"
              type="button"
              :disabled="!Object.values(selectedLoadoutModel.gears).some(Boolean)"
              @click="showGearBuildDialog = true"
            >
              {{ t('timeline.gearTab') }}
            </EaButton>
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
              :accent-color="skillAccentColor(entry.skillType, selectedTrackModel.operatorSlug)"
              :selected="libraryEntrySelected(entry)"
              :segments="skillSegments(entry)"
              @dragstart="beginSkillDrag($event, entry)"
              @dragstart-segment="beginSkillDrag($event.event, entry, $event.skillKey)"
              @select="selectLibrarySkill(entry)"
              @select-segment="selectLibrarySkill(entry, $event)"
            />
          </div>
        </div>
      </section>
    </template>

    <template #left-bottom="{ tool }">
      <EnemySettingsPanel
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
        @select-definition="selectDefinitionEnemy"
        @select-custom="selectCustomEnemy"
        @save="saveEnemyValues"
      />
      <GlobalResourcePanel
        v-else-if="tool === 'global'"
        mode="modifiers"
        :rules="scenario.battle.resourceRules"
        :modifiers="scenario.globalConfig.modifiers"
        :labels="{
          title: t('globalConfig.customSection'),
          maximum: t('timeline.maxSp'),
          initial: t('resourceMonitor.labels.initialSp'),
          recovery: t('resourceMonitor.labels.spPerSecond'),
        }"
        @update="setBattleResourceRule"
        @set-modifiers="setGlobalModifiers"
      />
      <div v-else-if="tool === 'contract'" class="contract-side-panel">
        <img
          src="/contingency_contract/1/deco_contingency_select_tag_3.webp"
          alt=""
          aria-hidden="true"
        />
        <div class="contract-side-title">{{ t('contingencyContract.operationName') }}</div>
      </div>
      <div v-else class="empty-panel">{{ t('timeline.activityBar.contractUnavailable') }}</div>
    </template>

    <template #header>
      <TimelineHeaderToolbar
        :scenario-name="scenario.name"
        :scenarios="projectScenarios"
        :active-scenario-id="activeProjectScenarioId"
        :max-scenarios="MAX_PROJECT_SCENARIOS"
        :project-dirty="projectDirty"
        :cursor-guide-enabled="showCursorGuide"
        :box-select-enabled="boxSelectEnabled"
        :connection-tool-enabled="connectionToolEnabled"
        :auto-group-basic-attack-sequences="autoGroupBasicAttackSequences"
        @toggle-box-select="toggleBoxSelect"
        @toggle-connection-tool="toggleConnectionTool"
        @set-auto-group-basic-attack-sequences="autoGroupBasicAttackSequences = $event"
        :buff-layout-mode="buffLayoutMode"
        @toggle-cursor-guide="toggleCursorGuide"
        @set-buff-layout="buffLayoutMode = $event"
        :view-layers="timelineViewLayers"
        :view-layer-ids="TIMELINE_VIEW_LAYER_IDS"
        :operator-effects="operatorEffectsOptions"
        :locale="locale"
        :appearance="appearance"
        :random-mode="scenario.battle.random?.mode ?? 'expected'"
        :global-random-seed="scenario.battle.random?.globalSeed ?? 0"
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
        @export="showExportDialog = true"
        @reset="resetDialogVisible = true"
        @toggle-view-layer="toggleTimelineViewLayer"
        @toggle-operator-effects="toggleOperatorEffectsVisibility"
        @set-locale="selectTimelineLocale"
        @set-appearance="setAppearance"
        @set-random-mode="setScenarioRandomMode"
        @set-global-random-seed="setGlobalRandomSeed"
        @roll-global-random-seed="rollGlobalRandomSeed"
        @clear-selection="clearTimelineSelection"
      />
    </template>

    <div class="timeline-workspace">
      <div
        ref="timelineScroll"
        class="timeline-scroll"
        :class="{
          'is-panning': isPanning,
          'is-compact-buff-layout': buffLayoutMode === 'compact',
        }"
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
              :initial-gauge-display-value="initialUltimateEnergyDisplayValue"
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
              @set-zoom-percent="timelineZoomPercent = normalizeTimelineZoomPercent($event)"
            />
          </div>
          <TimelineRuler
            class="timeline-ruler"
            :style="{ width: `${timelineWidth}px` }"
            :prep-frames="displayedTimelinePrepFrames"
            :prep-expanded="scenario.editor.prepExpanded"
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
            :class="{ 'is-prep-collapsed': !scenario.editor.prepExpanded }"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(0, displayedTimelinePrepFrames)}px`,
            }"
            :title="t('timelineGrid.prep.setDurationTitle')"
            @pointerdown="beginTimelinePrepResize"
          ></div>
          <div
            v-if="scenario.battle.prepFrames > 0 && !scenario.editor.prepExpanded"
            class="prep-collapsed-entry"
            :style="{ left: `${TIMELINE_TRACK_HEADER_WIDTH}px` }"
          >
            <span>{{ t('timelineGrid.prep.title') }}</span>
            <EaButton
              variant="ghost"
              size="sm"
              icon-only
              type="button"
              :title="t('timelineGrid.prep.expand')"
              @click.stop="setPrepExpanded(true)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="8 6 16 12 8 18" /></svg>
            </EaButton>
            <span>{{ t('timelineGrid.prep.expand') }}</span>
          </div>
          <div
            v-else-if="scenario.battle.prepFrames > 0"
            class="prep-expanded-collapse"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + Math.max(0, timelineFramePx(0) - 18)}px`,
            }"
          >
            <EaButton
              variant="ghost"
              size="sm"
              icon-only
              type="button"
              :title="t('timelineGrid.prep.collapseTitle')"
              @click.stop="setPrepExpanded(false)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="16 6 8 12 16 18" />
              </svg>
            </EaButton>
          </div>
          <TimelineConnectionLayer
            v-if="timelineViewLayers.effectLinks || connectionDrag !== null"
            :scenario="scenario"
            :tracks="viewModel.tracks"
            :px-per-frame="pxPerFrame"
            :prep-expanded="scenario.editor.prepExpanded"
            :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
            :cast-actual-start-frames="skillCastActualStartFrames"
            :cast-actual-duration-frames="skillCastActualDurationFrames"
            :hit-actual-frames="hitActualFrames"
            :visible-track-indices="visibleEffectTrackIndices"
            :ruler-height="TIMELINE_RULER_HEIGHT"
            :track-layouts="
              viewModel.tracks.map(track =>
                trackEffectLayout(track.trackIndex, track.operatorInstanceId),
              )
            "
            :preview="connectionDrag"
            @remove="deleteTimelineConnection"
          />
          <div
            v-if="showCursorGuide && cursorGuide !== null && marqueeStyle === null"
            class="cursor-guide"
            :style="{ left: `${TIMELINE_TRACK_HEADER_WIDTH + cursorGuide.leftPx}px` }"
          >
            <div
              class="cursor-guide__info"
              :style="{ transform: `translate3d(0, ${timelineScrollTop + 4}px, 0)` }"
            >
              <TimelineCursorGuide
                :time="cursorGuideMetrics.time"
                :sp="cursorGuideMetrics.sp"
                :poise="cursorGuideMetrics.poise"
                :enemy-health="cursorGuideMetrics.enemyHealth"
                :gauges="cursorGuideMetrics.gauges"
                :enemy-effects="cursorEnemyEffects.effects"
                :enemy-effect-overflow="cursorEnemyEffects.overflow"
              />
            </div>
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
            :prep-expanded="scenario.editor.prepExpanded"
            :px-per-frame="pxPerFrame"
            :horizontal-offset="TIMELINE_TRACK_HEADER_WIDTH"
          />
          <div
            v-if="scenario.battle.simulationRange?.startFrame !== undefined"
            class="simulation-range-dim simulation-range-dim--start"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH}px`,
              width: `${timelineFramePx(displayedMarkerFrame('simulationStart', 'simulationStart', scenario.battle.simulationRange.startFrame))}px`,
            }"
          ></div>
          <div
            v-if="scenario.battle.simulationRange?.endFrame !== undefined"
            class="simulation-range-dim simulation-range-dim--end"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(displayedMarkerFrame('simulationEnd', 'simulationEnd', scenario.battle.simulationRange.endFrame))}px`,
            }"
          ></div>
          <div
            v-if="scenario.battle.simulationRange?.startFrame !== undefined"
            class="timeline-marker simulation-range-marker simulation-range-marker--start"
            :class="{ selected: selectedMarker?.kind === 'simulationStart' }"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(displayedMarkerFrame('simulationStart', 'simulationStart', scenario.battle.simulationRange.startFrame))}px`,
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
                t('timeline.markerLabels.simulationStart'),
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
            <b>{{ t('timeline.markerLabels.simulationStart') }}</b>
          </div>
          <div
            v-if="scenario.battle.simulationRange?.endFrame !== undefined"
            class="timeline-marker simulation-range-marker simulation-range-marker--end"
            :class="{ selected: selectedMarker?.kind === 'simulationEnd' }"
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(displayedMarkerFrame('simulationEnd', 'simulationEnd', scenario.battle.simulationRange.endFrame))}px`,
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
                t('timeline.markerLabels.simulationEnd'),
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
            <b>{{ t('timeline.markerLabels.simulationEnd') }}</b>
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
              left: `${TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(displayedMarkerFrame('cycleBoundary', boundary.id, boundary.frame))}px`,
            }"
            @pointerdown="beginMarkerMove($event, 'cycleBoundary', boundary.id, boundary.frame)"
            @contextmenu="
              openExistingMarkerContextMenu(
                $event,
                'cycleBoundary',
                boundary.id,
                boundary.frame,
                selectedTrack,
                t('timeline.markerLabels.cycleBoundary'),
              )
            "
          >
            <span>{{ displayedMarkerFrame('cycleBoundary', boundary.id, boundary.frame) }}f</span>
            <b>{{ t('timeline.markerLabels.cycleBoundary') }}</b>
          </div>
          <div
            v-for="marker in (scenario.battle.externalEventMarkers ?? []).filter(
              item => item.target.scope === 'team',
            )"
            :key="marker.id"
            class="timeline-marker team-event-marker"
            :class="{
              'combo-cooldown-guide': marker.event.kind === 'comboCooldownControl',
              'is-ready':
                marker.event.kind === 'comboCooldownControl' && marker.event.mode === 'ready',
              selected: selectedMarker?.kind === 'externalEvent' && selectedMarker.id === marker.id,
            }"
            :title="
              marker.event.kind === 'comboCooldownControl'
                ? t(`comboControl.${marker.event.mode}`)
                : undefined
            "
            :style="{
              left: `${TIMELINE_TRACK_HEADER_WIDTH + timelineFramePx(displayedMarkerFrame('externalEvent', marker.id, marker.frame))}px`,
            }"
            @pointerdown="beginMarkerMove($event, 'externalEvent', marker.id, marker.frame)"
            @contextmenu="
              openExistingMarkerContextMenu(
                $event,
                'externalEvent',
                marker.id,
                marker.frame,
                selectedTrack,
                marker.event.kind === 'comboCooldownControl'
                  ? t(`comboControl.${marker.event.mode}`)
                  : t('timeline.markerLabels.teamExternalEvent'),
              )
            "
          >
            <div v-if="marker.event.kind === 'comboCooldownControl'" class="combo-cooldown-marker">
              <svg v-if="marker.event.mode === 'ready'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 11a8 8 0 1 1-2.3-5.7" />
                <path d="M20 4v7h-7" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <span v-if="marker.event.kind !== 'comboCooldownControl'"
              >{{ displayedMarkerFrame('externalEvent', marker.id, marker.frame) }}f</span
            >
            <b v-if="marker.event.kind !== 'comboCooldownControl'">{{
              marker.event.kind === 'enemyWeaknessSet'
                ? t('timeline.markerLabels.enemyWeaknessSet')
                : t('timeline.markerLabels.teamHit')
            }}</b>
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
                :form-name="operatorFormNamesByTrack[track.trackIndex] ?? null"
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
                :ref="element => registerTrackDropRegion(track.trackIndex, element)"
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
                <template
                  v-if="
                    timelineViewLayers.skillDecorations &&
                    isOperatorEffectsVisible(track.trackIndex)
                  "
                >
                  <div
                    v-for="band in controlledComboCooldownBands.filter(
                      item => item.operatorId === track.operatorInstanceId,
                    )"
                    :key="`${band.skillId}:${band.startFrame}`"
                    class="controlled-combo-cooldown-bar"
                    :style="{
                      left: `${timelineFramePx(band.startFrame)}px`,
                      width: `${timelineFrameSpanPx(band.startFrame, band.endFrame - band.startFrame)}px`,
                    }"
                  >
                    <span>{{
                      formatTimeWithFrames((band.endFrame - band.startFrame) / PROJECT_FPS)
                    }}</span
                    ><i></i>
                  </div>
                </template>
                <TimelineTrackGauge
                  v-if="timelineViewLayers.gauge && isOperatorEffectsVisible(track.trackIndex)"
                  :curve="gaugeCurveFor(track.trackIndex)"
                  :color="gaugeColorFor(track.trackIndex)"
                  :prep-frames="scenario.battle.prepFrames"
                  :prep-expanded="scenario.editor.prepExpanded"
                  :duration-frames="scenario.battle.durationFrames"
                  :px-per-frame="pxPerFrame"
                />
                <TimelineBuffBands
                  v-if="
                    timelineViewLayers.upperEffects && isOperatorEffectsVisible(track.trackIndex)
                  "
                  :segments="buffSegmentsForTarget(track.operatorInstanceId, 'upper')"
                  :source-name="buffSourceName"
                  :display-name="buffDisplayName"
                  :icon="buffIcon"
                  :prep-frames="scenario.battle.prepFrames"
                  :prep-expanded="scenario.editor.prepExpanded"
                  :px-per-frame="pxPerFrame"
                  placement="upper"
                  :action-top="
                    trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop
                  "
                  @open-detail="openBuffDetail"
                />
                <TimelineOperatorPassiveUiBands
                  v-if="
                    timelineViewLayers.upperEffects && isOperatorEffectsVisible(track.trackIndex)
                  "
                  :segments="operatorPassiveUiSegmentsForTarget(track.operatorInstanceId)"
                  :prep-frames="scenario.battle.prepFrames"
                  :prep-expanded="scenario.editor.prepExpanded"
                  :px-per-frame="pxPerFrame"
                  :action-top="
                    trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop
                  "
                />
                <TimelineBuffBands
                  v-if="timelineViewLayers.lowerBuffs && isOperatorEffectsVisible(track.trackIndex)"
                  :segments="buffSegmentsForTarget(track.operatorInstanceId, 'lower')"
                  :source-name="buffSourceName"
                  :display-name="buffDisplayName"
                  :icon="buffIcon"
                  :prep-frames="scenario.battle.prepFrames"
                  :prep-expanded="scenario.editor.prepExpanded"
                  :px-per-frame="pxPerFrame"
                  placement="lower"
                  :action-top="
                    trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop
                  "
                  @open-detail="openBuffDetail"
                />
                <TimelineComboWindowBands
                  v-if="
                    timelineViewLayers.comboWindows && isOperatorEffectsVisible(track.trackIndex)
                  "
                  :segments="comboWindowSegmentsFor(track.operatorInstanceId)"
                  :prep-frames="scenario.battle.prepFrames"
                  :prep-expanded="scenario.editor.prepExpanded"
                  :px-per-frame="pxPerFrame"
                  :action-top="
                    trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop
                  "
                  :label="t('timeline.header.viewLayers.comboWindows')"
                />
                <div
                  class="prep-zone"
                  :style="{ width: `${timelineFramePx(0, displayedTimelinePrepFrames)}px` }"
                ></div>
                <div
                  class="battle-start-line"
                  :style="{ left: `${timelineFramePx(0, displayedTimelinePrepFrames)}px` }"
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
                    dragging:
                      markerMoveGesture?.kind === 'controlSwitch' &&
                      markerMoveGesture.id === marker.id &&
                      markerMoveGesture.dragStarted,
                  }"
                  :style="{
                    left: `${timelineFramePx(displayedMarkerFrame('controlSwitch', marker.id, marker.frame))}px`,
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
                  @click.stop
                  @contextmenu="
                    openExistingMarkerContextMenu(
                      $event,
                      'controlSwitch',
                      marker.id,
                      marker.frame,
                      track.trackIndex,
                      t('timeline.markerLabels.controlSwitch'),
                    )
                  "
                >
                  <OperatorAvatar
                    v-if="track.operatorSlug"
                    class="track-switch-marker__avatar"
                    :src="getOperatorAvatarPath(track.operatorAssetSlug ?? track.operatorSlug)"
                  />
                  <span class="track-switch-marker__time">
                    {{
                      formatGuideFrame(
                        displayedMarkerFrame('controlSwitch', marker.id, marker.frame),
                      )
                    }}
                  </span>
                  <i class="track-switch-marker__pointer"></i>
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
                    left: `${timelineFramePx(displayedMarkerFrame('externalEvent', marker.id, marker.frame))}px`,
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
                  @click.stop
                  @contextmenu="
                    openExistingMarkerContextMenu(
                      $event,
                      'externalEvent',
                      marker.id,
                      marker.frame,
                      track.trackIndex,
                      marker.event.kind === 'operatorHit'
                        ? t('timeline.markerContext.operatorHit')
                        : t('timeline.markerLabels.operatorWeakness'),
                    )
                  "
                >
                  <span>{{
                    marker.event.kind === 'operatorHit'
                      ? t('timeline.markerLabels.hitShort')
                      : t('timeline.markerLabels.weaknessShort')
                  }}</span>
                  <b>{{ displayedMarkerFrame('externalEvent', marker.id, marker.frame) }}f</b>
                </div>
                <TimelineSkillCastGroupMarker
                  v-for="group in skillCastGroupsByTrack[track.trackIndex]"
                  :key="group.anchor.id"
                  :left="timelineFramePx(displayedSkillCastStartFrames.get(group.anchor.id)!)"
                  :width="
                    timelineFrameSpanPx(
                      displayedSkillCastStartFrames.get(group.anchor.id)!,
                      skillCastGroupEndFrame(group.casts.map(cast => cast.id)) -
                        displayedSkillCastStartFrames.get(group.anchor.id)!,
                    )
                  "
                  :label="t('timeline.continuousGroup.label', { count: group.casts.length })"
                  :selected="group.casts.every(cast => actionSelection.selectedIds.has(cast.id))"
                  @select="selectSkillCastGroup(group.casts.map(cast => cast.id))"
                />
                <TimelineActionBlock
                  v-for="(cast, castIndex) in track.skillCasts"
                  :key="cast.id"
                  :action-id="cast.id"
                  :label="timelineCastLabel(cast, track)"
                  :skill-type="cast.skillType"
                  :left="timelineFramePx(castActualStartFrame(cast.id, cast.startFrame))"
                  :width="
                    timelineFrameSpanPx(
                      castActualStartFrame(cast.id, cast.startFrame),
                      Math.max(
                        0,
                        (visibleSkillEndFrames.get(cast.id) ?? cast.startFrame) -
                          castActualStartFrame(cast.id, cast.startFrame),
                      ),
                    )
                  "
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
                  :unexecuted="
                    !cast.disabled &&
                    groupedSkillCastIds.has(cast.id) &&
                    skillCastIsUnexecuted(cast.id)
                  "
                  :unexecuted-text="t('timeline.continuousGroup.unexecuted')"
                  :locked="cast.locked"
                  :edited="cast.edited"
                  :color="cast.color ?? skillAccentColor(cast.skillType, track.operatorSlug)"
                  :connection-tool-enabled="connectionToolEnabled"
                  :connection-dragging="connectionDrag !== null"
                  :connection-source-action-id="connectionDrag?.skillCastId ?? null"
                  :connection-target-valid="isConnectionTargetValid(cast.id)"
                  :warning="
                    (compatibleSkillCastReceiptIds.has(cast.id) &&
                      diagnosticsByCastId.has(cast.id)) ||
                    cast.resolutionIssue !== undefined
                  "
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
                    (hitId, executionFrame) =>
                      (hitDetailTarget = {
                        trackIndex: track.trackIndex,
                        castId: cast.id,
                        hitId,
                        ...(executionFrame === undefined ? {} : { executionFrame }),
                      })
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
                @dblclick.stop="resetCompactTrackLayout()"
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

    <template #bottom="{ tool, collapsePanel, expandAllToken }">
      <GlobalResourcePanel
        v-if="tool === 'global'"
        :rules="scenario.battle.resourceRules"
        :modifiers="scenario.globalConfig.modifiers"
        :labels="{
          title: t('timeline.activityBar.globalConfig'),
          maximum: t('timeline.maxSp'),
          initial: t('resourceMonitor.labels.initialSp'),
          recovery: t('resourceMonitor.labels.spPerSecond'),
        }"
        @update="setBattleResourceRule"
        @set-modifiers="setGlobalModifiers"
      />
      <section v-else-if="tool === 'enemy'" class="simulation-panel">
        <div v-if="simulationRun !== null" class="simulation-curves">
          <TimelineEnemyStatusSections
            @collapsed-count-change="collapsedMonitorSectionCount = $event"
            :expand-all-token="expandAllToken"
            :affliction-minimum-height="enemyEffectsMinimumHeight"
            :labels="{
              affliction: t('resourceMonitor.modules.enemyStatus'),
              poise: t('resourceMonitor.modules.stagger'),
              sp: t('resourceMonitor.modules.sp'),
            }"
            :collapse-label="t('common.close')"
            :expand-label="t('timelineGrid.prep.expand')"
            @collapse-panel="collapsePanel"
          >
            <template #affliction>
              <TimelineEnemyEffects
                @open-damage-detail="
                  hitDetailTarget = null;
                  enemyDamageDetailSequence = $event;
                "
                @minimum-height="enemyEffectsMinimumHeight = $event"
                :duration-frames="scenario.battle.durationFrames"
                v-if="combatHudSnapshot !== null"
                :viz="enemyEffectViz"
                :attachment-buff-ids="attachmentBuffIds"
                :buffs="buffSegmentsForTarget('enemy')"
                :source-name="buffSourceName"
                :display-name="buffDisplayName"
                :icon="buffIcon"
                :timeline-width="timelineWidth"
                :prep-frames="scenario.battle.prepFrames"
                :prep-expanded="scenario.editor.prepExpanded"
                :px-per-frame="pxPerFrame"
                :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
                :scroll-left="timelineScrollLeft"
                :snapshot-frame="enemyLastDamageFrame"
                :hud-snapshot="combatHudSnapshot.enemy"
                :enemy-name="enemyHudName"
                :enemy-level="scenario.enemy.source.level"
                :poise-knot-thresholds="scenario.enemy.editable.stagger.knotThresholds"
                :hud-labels="{
                  status: t('resourceMonitor.modules.enemyStatus'),
                  hp: t('timeline.simGuide.enemyHp'),
                  poise: t('timeline.simGuide.poise'),
                  recovering: t('timeline.simGuide.poiseRecovering'),
                  brokenEndWindow: t('timeline.simGuide.poiseBrokenEndWindow'),
                }"
                :labels="{
                  burst: t('timeline.effect.burst'),
                  reaction: t('timeline.effect.reaction'),
                  reactionConsumed: t('timeline.effect.reactionConsumed'),
                }"
                @open-buff-detail="openBuffDetail"
              />
            </template>
            <template #poise>
              <TimelineResourceCurves
                :poise-broken-segments="poiseBrokenSegments"
                :poise-broken-label="t('resourceMonitor.stagger.weak')"
                :sp-curve="simulationRun.resourceCurves.sp"
                :poise-curve="simulationRun.poiseCurve"
                :visible-kinds="['poise']"
                :poise-label="t('resourceMonitor.modules.stagger')"
                :timeline-width="timelineWidth"
                :duration-frames="scenario.battle.durationFrames"
                :cursor-frame="simulationRun.frame"
                :prep-frames="scenario.battle.prepFrames"
                :prep-expanded="scenario.editor.prepExpanded"
                :px-per-frame="pxPerFrame"
                :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
                :scroll-left="timelineScrollLeft"
              />
            </template>
            <template #sp>
              <TimelineResourceCurves
                :sp-curve="simulationRun.resourceCurves.sp"
                :visible-kinds="['sp']"
                :timeline-width="timelineWidth"
                :duration-frames="scenario.battle.durationFrames"
                :cursor-frame="cursorFrame"
                :sp-insufficient-label="t('resourceMonitor.sp.insufficient')"
                :prep-frames="scenario.battle.prepFrames"
                :prep-expanded="scenario.editor.prepExpanded"
                :px-per-frame="pxPerFrame"
                :track-header-width="TIMELINE_TRACK_HEADER_WIDTH"
                :scroll-left="timelineScrollLeft"
                :sp-label="t('resourceMonitor.modules.sp')"
                :initial-sp="scenario.battle.resourceRules.initialSp"
                :sp-recovery-per-second="scenario.battle.resourceRules.spRecoveryPerSecond"
                :initial-sp-label="t('resourceMonitor.labels.initialSp')"
                :sp-recovery-label="t('resourceMonitor.labels.spPerSecond')"
                @update-resource-rule="setBattleResourceRule"
              />
            </template>
          </TimelineEnemyStatusSections>
        </div>
        <div v-else class="simulation-panel__empty">—</div>
      </section>
      <ContingencyContractPanel
        v-else-if="tool === 'contract'"
        :selected-tag-ids="selectedContingencyContractTagIds"
        :locale="locale"
        @set-selected-tag-ids="setSelectedContingencyContractTagIds"
      />
      <div v-else class="empty-panel">{{ t('timeline.activityBar.contractUnavailable') }}</div>
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
        v-else-if="tool === 'inspector' && selectedLibraryEntry === null"
        :cast="selectedCastModel?.cast ?? null"
        :label="selectedCastModel?.label ?? ''"
        :skill-type="selectedCastModel?.skillType ?? null"
        :edited="selectedCastModel?.edited ?? false"
        :diff-count="selectedCastModel?.diffCount ?? 0"
        :template-definition="selectedCastModel?.templateDefinition ?? null"
        :current-definition="selectedCastModel?.currentDefinition ?? null"
        :minimum-frame="-scenario.battle.prepFrames"
        :maximum-frame="scenario.battle.durationFrames"
        :connections="selectedCastConnections"
        :connection-tool-enabled="connectionToolEnabled"
        :actual-start-frame="
          selectedCastId === null ? undefined : skillCastPlacementActualFrames.get(selectedCastId)
        "
        :grouped="selectedCastId !== null && groupedSkillCastIds.has(selectedCastId)"
        @dissolve-group="dissolveSelectedSkillCastGroups"
        @edit-definition="showSkillDefinitionEditor = true"
        @reset-definition="resetSelectedCastDefinition"
        @set-camera-target-angle="setSelectedCastCameraTargetAngle"
        @set-random-seed="setSelectedCastRandomSeed"
        @roll-random-seed="rollSelectedCastRandomSeed"
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
      <TimelineLibrarySkillInspector
        v-else-if="tool === 'inspector'"
        :name="selectedLibraryInspectorModel.name"
        :operator-name="selectedLibraryInspectorModel.operatorName"
        :type-label="selectedLibraryInspectorModel.typeLabel"
        :skill-group-key="selectedLibraryInspectorModel.skillGroupKey"
        :level="selectedLibraryInspectorModel.level"
        :duration-frames="selectedLibraryInspectorModel.durationFrames"
        :segments="selectedLibraryInspectorModel.segments"
        :custom-operator-definition="selectedLibraryInspectorModel.customOperatorDefinition"
        @edit-operator-definition="openOperatorDefinitionWorkspace"
      />
      <SimulationPerformanceAudit
        v-else-if="tool === 'performance'"
        :samples="simulationPerformanceSamples"
        :budget-ms="INTERACTIVE_SIMULATION_BUDGET_MS"
        :labels="{
          title: t('timeline.performance.title'),
          latest: t('timeline.performance.latest'),
          p95: t('timeline.performance.p95'),
          cacheHit: t('timeline.performance.cacheHit'),
          cacheLookup: t('timeline.performance.cacheLookup'),
          simulation: t('timeline.performance.simulation'),
          projection: t('timeline.performance.projection'),
          budget: t('timeline.performance.budget'),
          noSamples: t('timeline.performance.noSamples'),
        }"
      />
      <BattleLogPanel
        v-else-if="tool === 'battleLog'"
        :log="battleLogSnapshot"
        :event-label="battleReceiptEventLabel"
        :damage-type-label="damageElementLabel"
        :selected-cast-id="selectedCastId"
        @locate="locateBattleLogEntry"
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
    :compact-visible="actionSelection.selectedIds.size > 1"
    :create-group-visible="
      actionSelection.selectedIds.size > 1 &&
      !(continuousGroupSelection.ok && continuousGroupSelection.alreadyGrouped)
    "
    :create-group-disabled-reason="
      continuousGroupSelection.ok
        ? undefined
        : t(`timeline.continuousGroup.${continuousGroupSelection.reason}`)
    "
    :dissolve-group-visible="selectionIncludesContinuousGroup"
    :compact-disabled-reason="
      compactSelection.ok ? undefined : t(`timeline.compactSelection.${compactSelection.reason}`)
    "
    @compact="compactSelectedSkills"
    @create-group="createSelectedSkillCastGroup"
    @dissolve-group="dissolveSelectedSkillCastGroups"
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
      title: t('timeline.markerContext.title'),
      deleteMarker: t('timeline.markerContext.deleteMarker'),
      addCycle: t('timeline.markerContext.addCycle'),
      addSimulationStart: t('timeline.markerContext.addSimulationStart'),
      removeSimulationStart: t('timeline.markerContext.removeSimulationStart'),
      addSimulationEnd: t('timeline.markerContext.addSimulationEnd'),
      removeSimulationEnd: t('timeline.markerContext.removeSimulationEnd'),
      switchOperator: t('timeline.markerContext.switchOperator'),
      restrictedHint: t('timeline.markerContext.restrictedHint'),
      operatorHit: t('timeline.markerContext.operatorHit'),
      operatorWeakness: t('timeline.markerContext.operatorWeakness'),
      teamHit: t('timeline.markerContext.teamHit'),
      enemyWeaknessSet: t('timeline.markerContext.enemyWeaknessSet'),
    }"
    @close="markerContextTarget = null"
    @add-cycle="addMarkerFromContext('cycle')"
    @toggle-simulation-start="addMarkerFromContext('simulationStart')"
    @toggle-simulation-end="addMarkerFromContext('simulationEnd')"
    @add-switch="addMarkerFromContext('switch')"
    @add-operator-hit="addMarkerFromContext('operatorHit')"
    @add-operator-weakness="addMarkerFromContext('operatorWeakness')"
    @add-team-hit="addMarkerFromContext('teamHit')"
    @add-enemy-weakness-set="addMarkerFromContext('enemyWeaknessSet')"
    @control-combo-cooldown="
      addMarkerFromContext($event === 'ready' ? 'comboReady' : 'comboCooldown')
    "
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
      title: t('timeline.weaponDialog.title'),
      searchPlaceholder: t('timelineGrid.weaponDialog.searchPlaceholder'),
      unequip: t('common.unequip'),
      close: t('common.close'),
      empty: t('timeline.weaponDialog.empty'),
      partialSupport: t('timeline.weaponDialog.partialSupport'),
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
    :operator-definition="selectedLoadoutModel.operator?.definition ?? null"
    :gear-set-names="gearSetNames"
    :labels="{
      title: t('timelineGrid.equipmentDialog.title', {
        slot: t(`timelineGrid.equipmentSlot.${gearDialogTarget?.slot ?? 'armor'}`),
      }),
      searchPlaceholder: t('timelineGrid.equipmentDialog.searchPlaceholder'),
      unequip: t('common.unequip'),
      close: t('common.close'),
      empty: t('timelineGrid.equipmentDialog.empty'),
      partialSupport: t('timeline.gearDialog.partialSupport'),
      defense: t('timeline.gearDialog.defense'),
      noSet: t('timeline.gearDialog.noSet'),
    }"
    @close="gearDialogTarget = null"
    @select="selectGear"
    @clear="clearGear"
    @change-refine-tier="changeGearRefineTier"
  />
  <WeaponBuildDialog
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
  <OperatorBuildDialog
    :visible="showOperatorBuildDialog"
    :operator="selectedLoadoutModel.operator"
    :custom-definition="selectedOperatorCustomDefinition"
    :build-attributes="operatorBuildPanel?.attributes ?? null"
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
    :common-buff-definitions="commonBuffDefinitions"
    :skill-level="selectedOperatorDefinitionSkillLevel"
    :required-skill-references="selectedOperatorRequiredSkillReferences"
    @update:visible="showOperatorDefinitionWorkspace = $event"
    @save="saveOperatorDefinition"
    @reset="resetOperatorDefinition"
  />
  <GearLoadoutBuildDialog
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
  <OperatorPanelDialog
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
    :random-mode="publishedRandomMode"
    :operator-panel-for-entry="hitDetailTarget === null ? enemyDamageOperatorPanel : undefined"
    :source-label="t('timeline.buffDetail.source')"
    :source-description="hitDetailTarget === null ? enemyDamageSourceDescription : undefined"
    :visible="hitDetailTarget !== null || enemyDamageDetailSequence !== null"
    :allow-force-critical="hitDetailTarget !== null"
    :force-critical="hitDetailForceCritical"
    :result-force-critical="publishedHitDetail?.forcedCritical ?? false"
    :entries="
      hitDetailTarget !== null ? (publishedHitDetail?.entries ?? []) : enemyDamageDetailEntries
    "
    :operator-panel="hitDetailOperatorPanel"
    :contribution-source-label="hitDetailContributionSourceLabel"
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
      actualDamage: t('hitDetail.actualDamage'),
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
      criticalResult: t('hitDetail.criticalResult'),
      criticalRate: t('hitDetail.rawCritRate'),
      criticalHit: t('hitDetail.criticalHit'),
      nonCriticalHit: t('hitDetail.nonCriticalHit'),
      cannotCritical: t('hitDetail.cannotCritical'),
      directMultiplier: t('hitDetail.directMult'),
      damageTaken: t('hitDetail.dmgTaken'),
      defenseMultiplier: t('hitDetail.defMult'),
      resistanceMultiplier: t('hitDetail.resMult'),
      defenseDetail: (value: number) => t('hitDetail.defDetail', { def: value }),
    }"
    @close="
      hitDetailTarget = null;
      enemyDamageDetailSequence = null;
    "
    @toggle-force-critical="toggleHitDetailForceCritical"
  />
  <TimelineBuffDetailDialog
    :visible="buffDetailTarget !== null"
    :target="buffDetailTarget"
    :fps="PROJECT_FPS"
    :labels="{
      title: t('timeline.buffDetail.title'),
      source: t('timeline.buffDetail.source'),
      effect: t('timeline.buffDetail.effect'),
      layers: t('timeline.buffDetail.layers'),
      start: t('timeline.buffDetail.start'),
      startReason: t('timeline.buffDetail.startReason'),
      end: t('timeline.buffDetail.end'),
      endReason: t('timeline.buffDetail.endReason'),
      duration: t('timeline.buffDetail.duration'),
      frames: value => t('timeline.buffDetail.frames', { value }),
      buffId: t('timeline.buffDetail.buffId'),
    }"
    @update:visible="buffDetailTarget = $event ? buffDetailTarget : null"
  />
  <TimelineExportDialog
    :visible="showExportDialog"
    :max-duration="Math.max(10, Math.round(scenario.battle.durationFrames / PROJECT_FPS))"
    :labels="{
      title: t('timeline.export.dialogTitle'),
      filename: t('timeline.export.filenameLabel'),
      filenamePlaceholder: t('timeline.export.filenamePlaceholder'),
      duration: t('timeline.export.durationLabel'),
      durationHint: t('timeline.export.durationHintMax', {
        max: Math.max(10, Math.round(scenario.battle.durationFrames / PROJECT_FPS)),
      }),
      cancel: t('common.cancel'),
      exportJson: t('timeline.export.exportJson'),
      copyCode: t('timeline.export.copyCode'),
      exportSmallImage: t('timeline.export.exportSmallImage'),
      exportImage: t('timeline.export.exportImage'),
    }"
    @update:visible="showExportDialog = $event"
    @export-json="exportProject"
    @copy-code="copyProjectCode"
    @export-small-image="openSmallImageExport"
    @export-image="exportTimelineLongImage"
  />
  <TimelineSmallImageExportDialog
    :visible="showSmallImageExport"
    :initial-filename="smallImageExportInitial.filename"
    :initial-duration="smallImageExportInitial.duration"
    :max-duration="Math.max(10, Math.round(scenario.battle.durationFrames / PROJECT_FPS))"
    :scenario-name="scenario.name"
    :tracks="exportShareTracks"
    :prep-frames="scenario.battle.prepFrames"
    :editor-appearance="appearance"
    :labels="{
      title: t('timeline.export.smallPreviewTitle'),
      filename: t('timeline.export.filenameLabel'),
      filenamePlaceholder: t('timeline.export.filenamePlaceholder'),
      duration: t('timeline.export.durationLabel'),
      durationHint: `${t('timeline.export.durationHintMax', {
        max: Math.max(10, Math.round(scenario.battle.durationFrames / PROJECT_FPS)),
      })} · ${t('timeline.export.smallDurationHint')}`,
      cardAppearance: t('timeline.export.cardAppearanceLabel'),
      light: t('common.appearanceLight'),
      dark: t('common.appearanceDark'),
      cardWidth: t('timeline.export.cardWidthLabel'),
      blockHeight: t('timeline.export.blockHeightLabel'),
      timeScale: t('timeline.export.timeScaleLabel'),
      showCombatIcons: t('timeline.export.showCombatIcons'),
      showDurationBars: t('timeline.export.showDurationBars'),
      showKeycaps: t('timeline.export.showKeycaps'),
      showPrep: t('timeline.export.showPrep'),
      showTimeTicks: t('timeline.export.showTimeTicks'),
      cancel: t('common.cancel'),
      save: t('timeline.export.saveSmallImage'),
      rendering: t('timeline.export.smallRendering'),
      exported: filename => t('timeline.export.smallImageExported', { filename }),
      failed: msg => t('timeline.export.failed', { msg }),
    }"
    @update:visible="showSmallImageExport = $event"
  />
  <DamageAnalysisDialog
    :visible="showDamageAnalysis"
    :analysis="damageAnalysis"
    :locale="locale"
    :random-mode="publishedRandomMode"
    :global-random-seed="publishedGlobalRandomSeed"
    :labels="{
      title: t('timeline.analysis.dialogTitle'),
      warning: t('timeline.analysis.warning'),
      noData: t('timeline.analysis.noData'),
      damageByOperator: t('timeline.analysis.damageByOperator'),
      contributionByOperator: t('timeline.analysis.contributionByOperator'),
      damageByElement: t('timeline.analysis.damageByElement'),
      totalDamage: t('timeline.analysis.totalDamage'),
      expectedTotalDamage: t('timeline.analysis.expectedTotalDamage'),
      sampledTotalDamage: t('timeline.analysis.sampledTotalDamage'),
      expectedModeDescription: t('timeline.analysis.expectedModeDescription'),
      sampledModeDescription: (seed: string) =>
        t('timeline.analysis.sampledModeDescription', { seed }),
      rotationTime: t('timeline.analysis.rotationTime'),
      dps: t('timeline.analysis.dps'),
      unattributedDamage: (value: string) => t('timeline.analysis.unattributedDamage', { value }),
      contributionUnavailable: t('timeline.analysis.contributionUnavailable'),
      faqTitle: t('timeline.analysis.faqTitle'),
      faq: [
        [t('timeline.analysis.faq1Q'), t('timeline.analysis.faq1A')],
        [t('timeline.analysis.faq2Q'), t('timeline.analysis.faq2A')],
        [t('timeline.analysis.faq3Q'), t('timeline.analysis.faq3A')],
        [t('timeline.analysis.faq4Q'), t('timeline.analysis.faq4A')],
      ],
    }"
    @update:visible="showDamageAnalysis = $event"
  />
  <TimelineSimulationErrorNotice :error="simulationError" />
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
  margin: 0;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ea-fg);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: left;
}

.library-header__divider {
  height: 2px;
  margin-top: 3px;
  background: linear-gradient(90deg, var(--ea-gold) 0%, transparent 100%);
  opacity: 0.3;
}

.operator-heading__mark {
  flex: 0 0 auto;
  width: 4px;
  height: 18px;
  background: var(--ea-gold);
}

.operator-heading__main {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.operator-form-badge {
  flex: 0 0 auto;
  color: #00e5ff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.35);
  white-space: nowrap;
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

.timeline-scroll.is-compact-buff-layout {
  overflow-y: hidden;
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
  /* The ruler row participates in normal vertical scrolling. Its opaque layer
     only prevents later track content from painting over it while it is visible. */
  z-index: 120;
  width: 180px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 2px 0 8px;
  border-right: 1px solid var(--ea-border);
  border-bottom: 1px solid var(--ea-border);
  background: var(--ea-workbench-header);
}

.timeline-ruler {
  position: sticky;
  top: 0;
  z-index: 110;
  margin-top: -60px;
  margin-left: 180px;
}

.timeline-battle-start-boundary {
  position: absolute;
  z-index: 11;
  top: 60px;
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

.timeline-battle-start-boundary.is-prep-collapsed {
  cursor: default;
}

.prep-collapsed-entry,
.prep-expanded-collapse {
  position: absolute;
  /* 与轨道分隔线重合时，准备区按钮优先命中；仍低于固定轨道头和标尺。 */
  z-index: 41;
  top: calc(60px + (100% - 60px) / 2);
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.prep-collapsed-entry {
  width: 18px;
  gap: 8px;
}

.prep-collapsed-entry > span {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  color: var(--ea-fg-secondary);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px var(--ea-shadow);
}

.prep-collapsed-entry button,
.prep-expanded-collapse button {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ea-fg-secondary);
  cursor: pointer;
  pointer-events: auto;
}

.prep-collapsed-entry button:hover,
.prep-expanded-collapse button:hover {
  color: var(--ea-gold);
}
.prep-collapsed-entry svg,
.prep-expanded-collapse svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cursor-guide {
  position: absolute;
  top: 60px;
  bottom: 0;
  width: 1px;
  background: color-mix(in srgb, var(--ea-gold) 80%, transparent);
  box-shadow: 0 0 6px var(--ea-gold);
  z-index: 3000;
  pointer-events: none;
}

.cursor-guide__info {
  width: max-content;
  will-change: transform;
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
  top: 60px;
  bottom: 0;
  background: rgb(0 0 0 / 38%);
  pointer-events: none;
}

.simulation-range-dim--end {
  right: 0;
}

.simulation-range-marker {
  top: 60px;
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
  top: 60px;
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
  top: calc(var(--timeline-action-top, 55px) - 42px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 30;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
  transition: transform 0.1s;
  cursor: grab;
}

.track-switch-marker.dragging {
  transition: none;
  cursor: grabbing;
}

.track-switch-marker__avatar.operator-avatar-crop {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #d3adff;
  background: #222;
  box-shadow: 0 2px 4px rgb(0 0 0 / 50%);
}

.track-switch-marker__time {
  padding: 1px 5px;
  border: 1px solid rgb(211 173 255 / 65%);
  border-radius: 10px;
  background: rgb(24 18 30 / 92%);
  box-shadow: 0 1px 4px rgb(0 0 0 / 35%);
  color: #f0dcff;
  font-size: 9px;
  font-weight: bold;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgb(0 0 0 / 80%);
  white-space: nowrap;
}

.track-switch-marker__pointer {
  width: 0;
  height: 0;
  border-top: 7px solid #d3adff;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 40%));
}

.timeline-marker.track-switch-marker.selected {
  outline: 0;
}

.track-switch-marker.selected .track-switch-marker__avatar {
  border-color: #fff;
  box-shadow: 0 0 8px #fff;
}

.track-switch-marker.selected .track-switch-marker__time {
  border-color: rgb(255 255 255 / 85%);
  color: #fff;
}

.track-switch-marker.selected .track-switch-marker__pointer {
  border-top-color: #fff;
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

.team-event-marker.combo-cooldown-guide {
  --combo-control-color: #f15b8a;
  width: 1px;
  border: 0;
  background: color-mix(in srgb, var(--combo-control-color) 55%, transparent);
  cursor: grab;
  /* 图标可高于 0 秒线命中区，竖线本身仍不抢准备区拖动。 */
  z-index: auto;
}
.controlled-combo-cooldown-bar {
  position: absolute;
  top: calc(var(--timeline-action-top) + 57px);
  height: 2px;
  background: var(--ea-gold);
  color: var(--ea-gold);
  opacity: 0.9;
  pointer-events: none;
  z-index: 14;
}
.controlled-combo-cooldown-bar span {
  position: absolute;
  top: 4px;
  left: 0;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}
.controlled-combo-cooldown-bar i {
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 8px;
  background: currentColor;
  transform: translateY(-50%);
}
.team-event-marker.combo-cooldown-guide.is-ready {
  --combo-control-color: #20d9d2;
}
.combo-cooldown-guide.selected {
  width: 2px;
  background: #fff;
  box-shadow: 0 0 8px rgb(255 255 255 / 75%);
  outline: 0;
  z-index: 31;
}
.combo-cooldown-marker {
  position: absolute;
  z-index: 12;
  top: 0;
  left: 50%;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  color: #161616;
  background: var(--combo-control-color);
  border: 1px solid color-mix(in srgb, var(--combo-control-color) 72%, #fff);
  transform: translateX(-50%);
  box-shadow: 0 2px 6px rgb(0 0 0 / 45%);
}
.combo-cooldown-guide.selected .combo-cooldown-marker {
  color: #111;
  background: #fff;
  border-color: #fff;
}
.combo-cooldown-marker svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.simulation-panel {
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.simulation-curves {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.simulation-curves > :deep(.enemy-status-sections) {
  flex: 1 0 auto;
  width: 100%;
  height: 100%;
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
  box-sizing: border-box;
}

.track-row {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  height: 160px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.track-identity {
  position: sticky;
  left: 0;
  /* 必须盖过技能、标记、连线和时间膨胀层，横向滚动时形成稳定的轨道头遮罩。 */
  z-index: 80;
  isolation: isolate;
}

.track-lane {
  position: relative;
  z-index: 1;
  height: var(--timeline-track-height, 160px);
  overflow: hidden;
}

.track-lane::before {
  content: '';
  position: absolute;
  z-index: 1;
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

:global(html.is-track-resizing),
:global(html.is-track-resizing *) {
  cursor: ns-resize !important;
  user-select: none !important;
}

.prep-zone {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--ea-prep-fill);
  z-index: 0;
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

.contract-side-panel {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  box-sizing: border-box;
  background: var(--ea-workbench-panel);
  overflow: hidden;
}

.contract-side-panel img {
  width: min(82px, 48%);
  max-height: 82px;
  object-fit: contain;
  opacity: 0.78;
  filter: saturate(1.02) brightness(0.92);
}

.contract-side-title {
  color: #ff4d4f;
  font-size: 13px;
  font-weight: 900;
  text-align: center;
  white-space: nowrap;
}
</style>
