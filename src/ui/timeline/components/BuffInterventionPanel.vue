<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { EaButton, EaInput, EaNumberInput, EaSelect } from '@/design-system';
import type { BuffInterventionDocument } from '../../../core/project/schema';
import {
  buffInterventionReferenceKey,
  type BuffInterventionCatalogEntry,
} from '../../../core/game-data/buffInterventionCatalog';
import type { CombatReceiptEntry } from '../../../core/combat/receipt/combatReceipt';

const props = defineProps<{
  interventions: readonly BuffInterventionDocument[];
  catalog: readonly BuffInterventionCatalogEntry[];
  operators: readonly { id: string; label: string }[];
  durationFrames: number;
  minimumFrame: number;
  fps: number;
  receipts: readonly CombatReceiptEntry[];
  locale: string;
  readOnly?: boolean;
  inherited?: boolean;
}>();
const emit = defineEmits<{ update: [value: BuffInterventionDocument[]] }>();
const en = computed(() => props.locale === 'en');
const text = (zh: string, english: string) => (en.value ? english : zh);
const kind = ref<'apply' | 'finish' | 'suppress'>('apply');
const search = ref('');
const editingId = ref<string | null>(null);
const formElement = ref<HTMLElement | null>(null);
const selectedKey = ref('');
const sourceId = ref('');
const targetId = ref('enemy');
const applicationId = ref('');
const startFrame = ref(0);
const endFrame = ref(30);
const parameters = ref<Record<string, number>>({});
const selected = computed(() => props.catalog.find(entry => entry.key === selectedKey.value));
const filteredCatalog = computed(() => {
  const term = search.value.trim().toLocaleLowerCase();
  return props.catalog.filter(entry =>
    `${entry.label} ${entry.sourceLabel} ${entry.reference.buffId}`
      .toLocaleLowerCase()
      .includes(term),
  );
});
const options = computed(() =>
  filteredCatalog.value.map(entry => ({
    value: entry.key,
    label: `${entry.label} · ${entry.sourceLabel}${entry.support.apply ? '' : text('（不可独立施加）', ' (cannot apply independently)')}`,
  })),
);
const operatorOptions = computed(() =>
  props.operators.map(operator => ({ value: operator.id, label: operator.label })),
);
const targetOptions = computed(() => [
  { value: 'enemy', label: text('敌人', 'Enemy') },
  ...operatorOptions.value,
]);
const applications = computed(() => props.interventions.filter(entry => entry.kind === 'apply'));
const entryLabel = (entry: BuffInterventionDocument): string => {
  if (entry.kind === 'finish') {
    const application = applications.value.find(
      application => application.id === entry.applicationId,
    );
    return application
      ? `${application.frame / props.fps}s · ${entryLabel(application)}`
      : text('引用不存在', 'Application reference missing');
  }
  const item = props.catalog.find(
    item =>
      buffInterventionReferenceKey(item.reference) === buffInterventionReferenceKey(entry.buff),
  );
  return `${item?.label ?? entry.buff.buffId} · ${item?.sourceLabel ?? entry.buff.sourceId}`;
};
const applicationOptions = computed(() =>
  applications.value.map(entry => ({
    value: entry.id,
    label: `${entry.frame / props.fps}s · ${entryLabel(entry)}`,
  })),
);
const selectedApplication = computed(() =>
  applications.value.find(entry => entry.id === applicationId.value),
);
const selectedApplicationEntry = computed(() => {
  const application = selectedApplication.value;
  return (
    application &&
    props.catalog.find(
      entry =>
        buffInterventionReferenceKey(entry.reference) ===
        buffInterventionReferenceKey(application.buff),
    )
  );
});
const allResults = computed(() =>
  props.receipts.filter(entry => entry.event === 'BuffInterventionResult'),
);
const results = computed(() => allResults.value.slice(-200));
const sortedPlan = computed(() =>
  [...props.interventions].sort((left, right) => {
    const first = left.kind === 'suppress' ? left.startFrame : left.frame;
    const second = right.kind === 'suppress' ? right.startFrame : right.frame;
    // 稳定排序保留同帧计划的数组顺序，与运行时执行顺序一致。
    return first - second;
  }),
);
function targetLabel(entry: BuffInterventionDocument): string {
  if (entry.kind === 'finish') return '';
  const target = entry.target;
  return target.kind === 'enemy'
    ? text('敌人', 'Enemy')
    : (props.operators.find(operator => operator.id === target.operatorId)?.label ??
        target.operatorId);
}
const invalidReason = computed(() => {
  if (props.inherited)
    return text(
      '第一版暂不支持继承场景干预，请在独立方案中使用。',
      'This version supports interventions only in independent scenarios.',
    );
  if (props.readOnly) return text('当前方案只读。', 'This scenario is read-only.');
  if (
    !Number.isInteger(startFrame.value) ||
    startFrame.value < props.minimumFrame ||
    startFrame.value > props.durationFrames
  )
    return text('开始时间必须位于战斗范围内。', 'Start time must be within the battle.');
  if (kind.value === 'finish') {
    if (!selectedApplication.value)
      return text('请选择需要结束的施加计划。', 'Select an application to finish.');
    if (startFrame.value < selectedApplication.value.frame)
      return text('结束时间不能早于施加时间。', 'Finish time cannot precede application.');
    if (!selectedApplicationEntry.value?.support.finish)
      return text('该 Buff 不支持手动结束。', 'This Buff does not support manual finish.');
    return '';
  }
  if (!selected.value) return text('请从目录选择 Buff。', 'Select a Buff from the catalog.');
  if (
    targetId.value !== 'enemy' &&
    !props.operators.some(operator => operator.id === targetId.value)
  )
    return text('目标干员不存在。', 'The target operator does not exist.');
  if (kind.value === 'suppress') {
    if (!selected.value.support.suppress)
      return selected.value.support.suppressionReasons.join('；');
    if (
      !Number.isInteger(endFrame.value) ||
      endFrame.value <= startFrame.value ||
      endFrame.value > props.durationFrames
    )
      return text(
        '抑制结束必须晚于开始，并位于战斗范围内。',
        'Suppression must end after its start and within the battle.',
      );
    return '';
  }
  if (!selected.value.support.apply) return selected.value.support.reasons.join('；');
  if (
    editingId.value &&
    props.interventions.some(
      entry =>
        entry.kind === 'finish' &&
        entry.applicationId === editingId.value &&
        entry.frame < startFrame.value,
    )
  )
    return text(
      '已有结束计划早于新的施加时间，请先调整结束计划。',
      'An existing finish precedes the new application time; adjust it first.',
    );
  if (
    editingId.value &&
    !selected.value.support.finish &&
    props.interventions.some(
      entry => entry.kind === 'finish' && entry.applicationId === editingId.value,
    )
  )
    return text(
      '此计划已有结束操作，请选择可结束的 Buff。',
      'This application has a finish plan; choose a finishable Buff.',
    );
  if (!props.operators.some(operator => operator.id === sourceId.value))
    return text(
      '请选择场上真实来源干员。',
      'Select an operator present in this scenario as the source.',
    );
  const targetKind = targetId.value === 'enemy' ? 'enemy' : 'operator';
  if (!selected.value.support.targets.includes(targetKind))
    return (
      selected.value.support.targetReasons[targetKind]?.join('；') ||
      text('该 Buff 不支持所选目标。', 'This Buff does not support the selected target.')
    );
  for (const field of selected.value.support.parameters) {
    const value = parameters.value[field.key];
    if (value === undefined && !field.required) continue;
    if (
      value === undefined ||
      !Number.isFinite(value) ||
      (field.minimum !== undefined && value < field.minimum) ||
      (field.integer && !Number.isSafeInteger(value))
    )
      return `${text('参数无效', 'Invalid parameter')}: ${field.label}`;
  }
  return '';
});
watch(
  selected,
  entry => {
    parameters.value = Object.fromEntries(
      (entry?.support.parameters ?? []).flatMap(field =>
        field.defaultValue === undefined ? [] : [[field.key, field.defaultValue]],
      ),
    );
  },
  { flush: 'sync' },
);
function add(): void {
  if (invalidReason.value) return;
  const id = editingId.value ?? `buff-intervention:${crypto.randomUUID()}`;
  let intervention: BuffInterventionDocument;
  if (kind.value === 'finish')
    intervention = {
      id,
      kind: 'finish',
      frame: startFrame.value,
      applicationId: applicationId.value,
    };
  else {
    const target =
      targetId.value === 'enemy'
        ? { kind: 'enemy' as const }
        : { kind: 'operator' as const, operatorId: targetId.value };
    const buff = { ...selected.value!.reference };
    intervention =
      kind.value === 'apply'
        ? {
            id,
            kind: 'apply',
            frame: startFrame.value,
            buff,
            target,
            sourceOperatorId: sourceId.value,
            ...(Object.keys(parameters.value).length
              ? { parameters: { ...parameters.value } }
              : {}),
          }
        : {
            id,
            kind: 'suppress',
            startFrame: startFrame.value,
            endFrame: endFrame.value,
            buff,
            target,
            ...(sourceId.value ? { sourceOperatorId: sourceId.value } : {}),
          };
  }
  emit(
    'update',
    editingId.value
      ? props.interventions.map(entry => (entry.id === editingId.value ? intervention : entry))
      : [...props.interventions, intervention],
  );
  editingId.value = null;
}
function edit(entry: BuffInterventionDocument): void {
  if (props.readOnly) return;
  editingId.value = entry.id;
  kind.value = entry.kind;
  startFrame.value = entry.kind === 'suppress' ? entry.startFrame : entry.frame;
  if (entry.kind === 'finish') applicationId.value = entry.applicationId;
  else {
    selectedKey.value =
      props.catalog.find(
        item =>
          buffInterventionReferenceKey(item.reference) === buffInterventionReferenceKey(entry.buff),
      )?.key ?? '';
    targetId.value = entry.target.kind === 'enemy' ? 'enemy' : entry.target.operatorId;
    sourceId.value = entry.sourceOperatorId ?? '';
    if (entry.kind === 'suppress') endFrame.value = entry.endFrame;
    else parameters.value = { ...entry.parameters };
  }
  void nextTick(() => formElement.value?.scrollIntoView({ block: 'start' }));
}
const resultLabels: Record<string, [string, string]> = {
  applied: ['新建', 'Applied'],
  refreshed: ['刷新', 'Refreshed'],
  stacked: ['叠加', 'Stacked'],
  rejected: ['拒绝', 'Rejected'],
  suppressed: ['被抑制', 'Suppressed'],
  finished: ['已结束', 'Finished'],
  notFound: ['实例不存在', 'Instance not found'],
  notFinishable: ['无法结束', 'Not finishable'],
  targetMissing: ['目标不存在', 'Target missing'],
};
function resultPlanLabel(result: CombatReceiptEntry): string {
  const plan = props.interventions.find(entry => entry.id === result.data?.interventionId);
  return plan ? entryLabel(plan) : text('计划已移除', 'Plan removed');
}
function resultLabel(value: unknown): string {
  const key = String(value ?? '');
  const labels = resultLabels[key];
  return labels ? text(labels[0], labels[1]) : key;
}
function remove(id: string): void {
  if (props.readOnly) return;
  const next = props.interventions.filter(
    entry => entry.id !== id && !(entry.kind === 'finish' && entry.applicationId === id),
  );
  if (!next.some(entry => entry.id === editingId.value)) editingId.value = null;
  emit('update', next);
}
function setFrame(value: number | undefined, end = false): void {
  if (value === undefined || !Number.isFinite(value)) return;
  if (end) endFrame.value = Math.round(value * props.fps);
  else startFrame.value = Math.round(value * props.fps);
}
function setParameter(key: string, value: number | undefined): void {
  if (value === undefined) delete parameters.value[key];
  else parameters.value[key] = value;
}
</script>

<template>
  <div class="buff-intervention-panel" data-testid="buff-intervention-panel">
    <p v-if="inherited" class="notice">
      {{
        text(
          '第一版暂不支持继承场景干预；历史实例不会被重放。请在独立方案中使用。',
          'Interventions in inherited scenarios are not supported yet. Historical instances are not replayed; use an independent scenario.',
        )
      }}
    </p>
    <p class="notice">
      {{
        text(
          '实验功能：只开放依赖可独立运行的 Buff。最早模拟帧可能为负；初始帧自然初始化后执行人工施加，后续每帧干预先于自然计时。计划不代表实际生效；实际结果见下方回执。',
          'Experimental: only independently supported Buffs can be applied. The earliest simulation frame may be negative. Manual initial application follows natural initialization; later interventions precede natural ticks. A plan is not proof of an effect; see actual results below.',
        )
      }}
    </p>
    <div ref="formElement" class="intervention-form">
      <label
        >{{ text('操作', 'Operation') }}
        <EaSelect
          v-model="kind"
          :disabled="editingId !== null"
          :options="[
            { value: 'apply', label: text('施加', 'Apply') },
            { value: 'finish', label: text('结束本计划实例', 'Finish planned instance') },
            { value: 'suppress', label: text('区间抑制', 'Suppress interval') },
          ]"
        />
      </label>
      <template v-if="kind !== 'finish'">
        <label class="wide"
          >{{ text('搜索全来源目录', 'Search all sources') }}
          <EaInput
            v-model="search"
            :placeholder="text('Buff ID、名称或来源', 'Buff ID, name or source')"
            clearable
          />
        </label>
        <label class="wide"
          >{{ text('Buff', 'Buff') }} · {{ filteredCatalog.length }}/{{ catalog.length }}
          <EaSelect
            v-model="selectedKey"
            :options="options"
            filterable
            :placeholder="text('选择 Buff', 'Select Buff')"
          />
        </label>
        <div v-if="selected" class="wide definition-detail">
          <code>{{ selected.reference.buffId }}</code>
          <span>{{ selected.sourceLabel }}</span>
          <p v-if="selected.support.reasons.length">{{ selected.support.reasons.join('；') }}</p>
          <p>
            {{
              text(
                '持续时间遵循原定义；不反复补挂，也不覆盖内部计数器。',
                'Lifetime follows the definition. No repeated reapplication or internal counter overrides.',
              )
            }}
          </p>
        </div>
        <label
          >{{ text('目标', 'Target') }}<EaSelect v-model="targetId" :options="targetOptions"
        /></label>
        <label
          >{{
            kind === 'suppress'
              ? text('限定来源（可选）', 'Source filter (optional)')
              : text('来源干员', 'Source operator')
          }}
          <EaSelect
            v-model="sourceId"
            :options="operatorOptions"
            :clearable="kind === 'suppress'"
            :placeholder="
              kind === 'suppress'
                ? text('所有来源', 'All sources')
                : text('选择来源', 'Select source')
            "
          />
        </label>
      </template>
      <label v-else class="wide"
        >{{ text('施加计划', 'Application')
        }}<EaSelect v-model="applicationId" :options="applicationOptions"
      /></label>
      <label
        >{{
          kind === 'finish'
            ? text('结束时间（秒）', 'Finish time (seconds)')
            : text('开始时间（秒）', 'Start time (seconds)')
        }}
        <EaNumberInput
          :model-value="startFrame / fps"
          :min="minimumFrame / fps"
          :max="durationFrames / fps"
          :step="1 / fps"
          :precision="3"
          @update:model-value="setFrame($event)"
        />
        <small
          >{{ startFrame }}
          {{
            text(
              '帧；按整数帧保存；0 秒为战斗时间零点',
              'frames; stored as integer frames; 0s is battle time zero',
            )
          }}</small
        >
      </label>
      <label v-if="kind === 'suppress'"
        >{{ text('解除时间（秒）', 'Resume time (seconds)') }}
        <EaNumberInput
          :model-value="endFrame / fps"
          :min="minimumFrame / fps"
          :max="durationFrames / fps"
          :step="1 / fps"
          :precision="3"
          @update:model-value="setFrame($event, true)"
        />
        <small>{{ endFrame }} {{ text('帧（此帧已解除）', 'frames (exclusive end)') }}</small>
      </label>
      <template v-if="kind === 'apply' && selected">
        <label v-for="field in selected.support.parameters" :key="field.key"
          >{{ field.label }}{{ field.required ? ' *' : '' }}
          <EaNumberInput
            :model-value="parameters[field.key]"
            :min="field.minimum"
            :precision="field.integer ? 0 : undefined"
            @update:model-value="setParameter(field.key, $event)"
          />
          <small
            >{{
              text(
                '本 Buff 声明的数值参数；清空沿用默认值：',
                'Declared numeric parameter; clear to keep default: ',
              )
            }}{{ field.defaultValue }}</small
          >
        </label>
      </template>
      <p v-if="kind === 'suppress'" class="wide notice">
        {{
          text(
            '区间为 [开始, 解除)。阻止匹配的新施加、刷新和增层，包括手动施加；已有实例及周期行为继续，不补发错过的施加。',
            'The interval is [start, end). Matching applications, refreshes and stacking are blocked, including manual applications. Existing instances and periodic effects continue; missed applications are not replayed.',
          )
        }}
      </p>
      <p v-if="kind === 'finish'" class="wide notice">
        {{
          text(
            '结束引用本计划返回的实例；若施加合并到旧实例，结束会影响该共享实例。不可结束的 Buff 会明确拒绝。',
            'Finish targets the instance returned to this application. If application merges with an existing instance, finish affects that shared instance. Non-finishable Buffs are rejected.',
          )
        }}
      </p>
      <div class="wide add-row">
        <span role="status">{{ invalidReason }}</span>
        <EaButton v-if="editingId" @click="editingId = null">{{
          text('取消编辑', 'Cancel edit')
        }}</EaButton>
        <EaButton :disabled="!!invalidReason" @click="add">{{
          editingId ? text('保存修改', 'Save changes') : text('添加计划', 'Add plan')
        }}</EaButton>
      </div>
    </div>
    <section class="plan-list">
      <h3>{{ text('干预计划', 'Intervention plan') }} · {{ interventions.length }}</h3>
      <p v-if="!interventions.length">
        {{
          text(
            '尚无计划。可随方案保存、复制、导出，并使用编辑器撤销/重做。',
            'No interventions. Plans are saved, copied and exported with the scenario, with editor undo/redo.',
          )
        }}
      </p>
      <article v-for="entry in sortedPlan" :key="entry.id">
        <div>
          <strong
            >{{
              entry.kind === 'suppress'
                ? `[${entry.startFrame / fps}, ${entry.endFrame / fps})s`
                : `${entry.frame / fps}s`
            }}
            ·
            {{
              entry.kind === 'apply'
                ? text('施加', 'Apply')
                : entry.kind === 'finish'
                  ? text('结束', 'Finish')
                  : text('抑制', 'Suppress')
            }}</strong
          >
          <p>{{ entryLabel(entry) }}</p>
          <small>{{ targetLabel(entry) }}</small>
        </div>
        <EaButton :disabled="readOnly" size="sm" @click="edit(entry)">{{
          text('编辑', 'Edit')
        }}</EaButton>
        <EaButton :disabled="readOnly" variant="danger" size="sm" @click="remove(entry.id)">{{
          text('删除', 'Remove')
        }}</EaButton>
      </article>
    </section>
    <section class="result-list">
      <h3>{{ text('实际模拟结果', 'Actual simulation results') }} · {{ allResults.length }}</h3>
      <p v-if="allResults.length > 200">
        {{
          text(
            '显示最近 200 条；完整事实保留在战斗日志中。',
            'Showing the latest 200; complete receipts remain in the battle log.',
          )
        }}
      </p>
      <p v-if="!results.length">
        {{
          text(
            '尚无干预回执；待模拟推进到计划时刻。',
            'No intervention receipts yet; simulation must reach the planned time.',
          )
        }}
      </p>
      <article v-for="result in results" :key="result.sequence">
        <strong>{{ result.frame / fps }}s · {{ resultLabel(result.data?.result) }}</strong
        ><span>{{ result.data?.detail }}</span
        ><span>{{ resultPlanLabel(result) }}</span
        ><small v-if="result.data?.instanceId !== undefined"
          >{{ text('实例', 'Instance') }} {{ result.data.instanceId }}</small
        >
      </article>
    </section>
  </div>
</template>

<style scoped>
.buff-intervention-panel {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.notice,
small,
.definition-detail {
  color: var(--ea-text-muted);
  font-size: 12px;
  line-height: 1.6;
}
.intervention-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
label {
  display: grid;
  gap: 7px;
  min-width: 0;
  font-size: 13px;
}
label :deep(.ea-select),
label :deep(.ea-number-input) {
  width: 100%;
}
.wide {
  grid-column: 1 / -1;
}
.definition-detail {
  display: grid;
  gap: 4px;
  padding: 12px;
  background: var(--ea-panel-elevated);
  border-radius: 5px;
}
p {
  margin: 0;
  overflow-wrap: anywhere;
}
code {
  display: block;
  overflow-wrap: anywhere;
  font-size: 11px;
}
.add-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.add-row span {
  color: var(--ea-text-muted);
  font-size: 12px;
}
h3 {
  margin: 0 0 10px;
  font-size: 14px;
}
article {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--ea-border);
}
article > div {
  min-width: 0;
  display: grid;
  gap: 5px;
}
.result-list article {
  display: grid;
  gap: 5px;
}
@media (max-width: 600px) {
  .intervention-form {
    grid-template-columns: minmax(0, 1fr);
  }
  .add-row {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
