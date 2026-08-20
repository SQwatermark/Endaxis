<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import type {
  ActionSequenceDefinition,
  CombatStepDefinition,
  OperatorDefinition,
  ScheduledSequenceDefinition,
  SkillDefinition,
  SkillGroupDefinition,
} from '../../core/game-data/operatorDefinition';
import { validateSkillDefinition } from '../../core/game-data/validateSkillDefinition';
import type { ValidationIssue } from '../../core/project/validation';
import { rossi, tangtang } from '../../data/operators';
import ExpandedFlowSequence from './ExpandedFlowSequence.vue';
import SkillMindMap from '../timeline/components/SkillStructureMindMap.vue';

type ReferenceKind = 'buff' | 'entity';

interface DemoNode {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly summary: string;
  readonly sourcePath: string;
  readonly details: Readonly<Record<string, unknown>>;
  readonly children: readonly DemoNode[];
  readonly reference?: { readonly kind: ReferenceKind; readonly id: string };
}

const router = useRouter();
const operator = shallowRef<OperatorDefinition>(tangtang);
const renamed = ref<Record<string, string>>({});
const search = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const showProblems = ref(false);

function sequenceNode(
  sequence: ActionSequenceDefinition,
  id: string,
  label: string,
  sourcePath: string,
  summary: string,
): DemoNode {
  return {
    id,
    label,
    kind: '动作序列',
    summary,
    sourcePath,
    details: { 步骤数: sequence.steps.length },
    children: sequence.steps.map((step, index) =>
      stepNode(step, `${id}:step:${index}`, `${sourcePath}.steps[${index}]`, index),
    ),
  };
}

function stepNode(
  step: CombatStepDefinition,
  id: string,
  sourcePath: string,
  index: number,
): DemoNode {
  const children: DemoNode[] = [];
  if (step.kind === 'conditional') {
    children.push({
      ...sequenceNode(
        step.whenTrue,
        `${id}:true`,
        'TRUE / Then',
        `${sourcePath}.whenTrue`,
        `${step.whenTrue.steps.length} 个直属步骤`,
      ),
      details: { 分支: 'TRUE / Then', 步骤数: step.whenTrue.steps.length },
    });
    if (step.whenFalse !== undefined) {
      children.push({
        ...sequenceNode(
          step.whenFalse,
          `${id}:false`,
          'FALSE / Else',
          `${sourcePath}.whenFalse`,
          `${step.whenFalse.steps.length} 个直属步骤`,
        ),
        details: { 分支: 'FALSE / Else', 步骤数: step.whenFalse.steps.length },
      });
    }
  } else if (
    step.kind === 'once' ||
    step.kind === 'repeatEachTick' ||
    step.kind === 'forEachContextTarget'
  ) {
    children.push(
      sequenceNode(
        step.body,
        `${id}:body`,
        'Body',
        `${sourcePath}.body`,
        `${step.body.steps.length} 个直属步骤`,
      ),
    );
  }

  const parameters = step.parameters as Readonly<Record<string, unknown>>;
  const reference =
    step.kind === 'applyBuff'
      ? { kind: 'buff' as const, id: String(parameters.buffId ?? '') }
      : step.kind === 'spawnAbilityEntity'
        ? { kind: 'entity' as const, id: String(parameters.abilityEntityId ?? '') }
        : undefined;
  const conditionText =
    step.kind === 'conditional' ? describeCondition(parameters.condition) : undefined;

  return {
    id,
    label: step.kind === 'conditional' ? `${index + 1}. IF` : `${index + 1}. ${step.kind}`,
    kind: '战斗步骤',
    summary:
      conditionText === undefined
        ? children.length > 0
          ? `${children.length} 个子容器`
          : summarizeParameters(parameters)
        : `${conditionText} · ${children.map(child => child.label).join(' / ')}`,
    sourcePath,
    details: {
      步骤类型: step.kind,
      稳定键: step.key ?? '—',
      ...(conditionText === undefined ? {} : { 条件表达式: conditionText }),
      ...parameters,
    },
    children,
    ...(reference === undefined || reference.id === '' ? {} : { reference }),
  };
}

function scheduledSequenceNode(
  sequence: ScheduledSequenceDefinition,
  id: string,
  sourcePath: string,
  index: number,
): DemoNode {
  const range =
    sequence.endFrame === undefined
      ? `第 ${sequence.startFrame} 帧`
      : `第 ${sequence.startFrame}–${sequence.endFrame} 帧`;
  const node = sequenceNode(
    sequence.sequence,
    id,
    `时间序列 ${index + 1}`,
    sourcePath,
    `${range} · ${sequence.sequence.steps.length} 个直属步骤`,
  );
  return {
    ...node,
    details: {
      开始帧: sequence.startFrame,
      结束帧: sequence.endFrame ?? '—',
      直属步骤数: sequence.sequence.steps.length,
    },
  };
}

function skillNode(skill: SkillDefinition, id: string, sourcePath: string): DemoNode {
  const sequences = skill.scheduledSequences.map((sequence, index) =>
    scheduledSequenceNode(
      sequence,
      `${id}:sequence:${index}`,
      `${sourcePath}.scheduledSequences[${index}].sequence`,
      index,
    ),
  );
  const listeners = (skill.eventHandlers ?? []).map((listener, index) => ({
    id: `${id}:listener:${index}`,
    label: `事件监听 · ${listener.event}`,
    kind: '技能事件监听器',
    summary: `${listener.scheduledSequences.length} 条时间序列`,
    sourcePath: `${sourcePath}.eventHandlers[${index}]`,
    details: { 监听器键: listener.key, 事件: listener.event },
    children: listener.scheduledSequences.map((sequence, sequenceIndex) =>
      scheduledSequenceNode(
        sequence,
        `${id}:listener:${index}:sequence:${sequenceIndex}`,
        `${sourcePath}.eventHandlers[${index}].scheduledSequences[${sequenceIndex}].sequence`,
        sequenceIndex,
      ),
    ),
  }));
  return {
    id,
    label: skill.key,
    kind: '技能定义',
    summary: `${skill.timelineBlockFrames} 帧 · ${sequences.length} 条时间序列 · ${listeners.length} 个监听器`,
    sourcePath,
    details: {
      技能键: skill.key,
      时间轴宽度帧: skill.timelineBlockFrames,
      费用数: skill.costs?.length ?? 0,
      黑板参数数: Object.keys(skill.blackboard ?? {}).length,
      时间序列数: sequences.length,
      监听器数: listeners.length,
    },
    children: [...sequences, ...listeners],
  };
}

function childSkillNode(
  skill: NonNullable<OperatorDefinition['abilityEntityDefinitions']>[string]['childSkill'],
  id: string,
  sourcePath: string,
): DemoNode {
  if (skill === undefined) throw new Error('missing ability entity child skill');
  return {
    id,
    label: skill.skillId,
    kind: '能力实体子技能',
    summary: `${skill.scheduledSequences.length} 条时间序列 · ${Object.keys(skill.blackboard ?? {}).length} 个黑板参数`,
    sourcePath,
    details: {
      原生技能ID: skill.skillId,
      黑板参数数: Object.keys(skill.blackboard ?? {}).length,
      时间序列数: skill.scheduledSequences.length,
    },
    children: skill.scheduledSequences.map((sequence, index) =>
      scheduledSequenceNode(
        sequence,
        `${id}:sequence:${index}`,
        `${sourcePath}.scheduledSequences[${index}].sequence`,
        index,
      ),
    ),
  };
}

function groupNode(group: SkillGroupDefinition, groupIndex: number): DemoNode {
  const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
  return {
    id: `group:${groupIndex}`,
    label: group.key,
    kind: '技能组',
    summary: `${skills.length} 个技能 · ${group.skillType}`,
    sourcePath: `$.skillGroups[${groupIndex}]`,
    details: {
      组键: group.key,
      技能类型: group.skillType,
      等级来源: group.levelSource,
      技能数: skills.length,
    },
    children: skills.map((skill, skillIndex) =>
      skillNode(
        skill,
        `group:${groupIndex}:skill:${skillIndex}`,
        `$.skillGroups[${groupIndex}].skills[${skillIndex}]`,
      ),
    ),
  };
}

function summarizeParameters(parameters: Readonly<Record<string, unknown>>): string {
  const entries = Object.entries(parameters).slice(0, 2);
  if (entries.length === 0) return '无参数';
  return entries.map(([key, value]) => `${key}: ${shortValue(value)}`).join(' · ');
}

function describeCondition(value: unknown, depth = 0): string {
  if (value === null || value === undefined) return '未设置条件';
  if (typeof value !== 'object') return String(value);
  if (Array.isArray(value)) {
    const entries = value.slice(0, 3).map(entry => describeCondition(entry, depth + 1));
    return `${entries.join(', ')}${value.length > 3 ? ` … +${value.length - 3}` : ''}`;
  }
  const record = value as Readonly<Record<string, unknown>>;
  const kind = typeof record.kind === 'string' ? record.kind : 'condition';
  if (depth >= 2) return kind;
  const parameters = Object.entries(record)
    .filter(([key]) => key !== 'kind')
    .slice(0, 3)
    .map(([key, entry]) => `${key}=${describeCondition(entry, depth + 1)}`);
  return parameters.length === 0 ? kind : `${kind}(${parameters.join(', ')})`;
}

function shortValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) return `${value.length} 项`;
  return `${Object.keys(value as object).length} 个字段`;
}

function definitionNode(
  id: string,
  label: string,
  kind: string,
  sourcePath: string,
  definition: Readonly<Record<string, unknown>>,
): DemoNode {
  return {
    id,
    label,
    kind,
    summary: `${Object.keys(definition).length} 个字段`,
    sourcePath,
    details: definition,
    children: [],
  };
}

function buildOperatorRoot(definition: OperatorDefinition): DemoNode {
  const groups = definition.skillGroups.map(groupNode);
  const buffs = Object.entries(definition.buffDefinitions ?? {}).map(([id, value]) =>
    definitionNode(`buff:${id}`, id, 'Buff 定义', `$.buffDefinitions.${id}`, value),
  );
  const entities = Object.entries(definition.abilityEntityDefinitions ?? {}).map(([id, value]) => {
    const childSkill = value.childSkill;
    return {
      ...definitionNode(
        `entity:${id}`,
        id,
        '能力实体定义',
        `$.abilityEntityDefinitions.${id}`,
        value as unknown as Readonly<Record<string, unknown>>,
      ),
      summary: `${value.lifetime.kind === 'limited' ? '有限生命周期' : '无限生命周期'}${childSkill === undefined ? '' : ' · 包含子技能'}`,
      children:
        childSkill === undefined
          ? []
          : [
              childSkillNode(
                childSkill,
                `entity:${id}:child`,
                `$.abilityEntityDefinitions.${id}.childSkill`,
              ),
            ],
    };
  });
  const sections: DemoNode[] = [
    {
      id: 'section:panel',
      label: '基础与成长',
      kind: '模板章节',
      summary: '身份、职业、元素与 90 级成长表',
      sourcePath: '$',
      details: {
        游戏ID: definition.gameId,
        星级: definition.rarity,
        武器类型: definition.weaponType,
        元素: definition.element,
        职业: definition.role,
      },
      children: [],
    },
    {
      id: 'section:skills',
      label: '技能与技能组',
      kind: '模板章节',
      summary: `${groups.length} 个技能组`,
      sourcePath: '$.skillGroups',
      details: { 技能组数: groups.length },
      children: groups,
    },
    {
      id: 'section:buffs',
      label: 'Buff',
      kind: '模板章节',
      summary: `${buffs.length} 个定义`,
      sourcePath: '$.buffDefinitions',
      details: { Buff数: buffs.length },
      children: buffs,
    },
    {
      id: 'section:entities',
      label: '能力实体',
      kind: '模板章节',
      summary: `${entities.length} 个定义`,
      sourcePath: '$.abilityEntityDefinitions',
      details: { 能力实体数: entities.length },
      children: entities,
    },
  ];
  return {
    id: 'operator',
    label: `${definition.slug === 'tangtang' ? '唐棠' : definition.slug === 'rossi' ? '洛茜' : definition.slug}（交互原型）`,
    kind: '干员模板',
    summary: '只读真实定义投影；界面修改不会保存',
    sourcePath: '$',
    details: { 模板ID: definition.slug, 游戏ID: definition.gameId },
    children: sections,
  };
}

const root = shallowRef(buildOperatorRoot(operator.value));
const breadcrumbs = ref<DemoNode[]>([root.value, root.value.children[1]!]);
const page = computed(() => breadcrumbs.value.at(-1)!);
const selected = ref<DemoNode | null>(page.value.children[0] ?? null);
const query = computed(() => search.value.trim().toLocaleLowerCase());
const visibleChildren = computed(() =>
  page.value.children.filter(node =>
    `${displayLabel(node)} ${node.kind} ${node.summary}`.toLocaleLowerCase().includes(query.value),
  ),
);
const issues = computed<readonly ValidationIssue[]>(() =>
  operator.value.skillGroups.flatMap((group, groupIndex) => {
    const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
    return skills.flatMap((skill, skillIndex) =>
      validateSkillDefinition(skill, `$.skillGroups[${groupIndex}].skills[${skillIndex}]`),
    );
  }),
);
const dirty = computed(() => Object.keys(renamed.value).length > 0);

function displayLabel(node: DemoNode): string {
  return renamed.value[node.id] ?? node.label;
}

function select(node: DemoNode): void {
  selected.value = node;
}

function enter(node: DemoNode): void {
  selected.value = node;
  if (node.children.length === 0) return;
  breadcrumbs.value = [...breadcrumbs.value, node];
  selected.value = node.children[0] ?? null;
  search.value = '';
}

function enterChildContainer(parent: DemoNode, child: DemoNode): void {
  enter(parent);
  enter(child);
}

function navigateTo(index: number): void {
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1);
  selected.value = page.value.children[0] ?? null;
  search.value = '';
}

function goBack(): void {
  if (breadcrumbs.value.length <= 1) return;
  navigateTo(breadcrumbs.value.length - 2);
}

function openSection(node: DemoNode): void {
  breadcrumbs.value = [root.value, node];
  selected.value = node.children[0] ?? node;
  search.value = '';
}

function renameSelected(event: Event): void {
  const node = selected.value;
  if (node === null) return;
  const value = (event.target as HTMLInputElement).value;
  renamed.value = { ...renamed.value, [node.id]: value };
}

function findPath(
  targetId: string,
  node: DemoNode = root.value,
  path: DemoNode[] = [],
): DemoNode[] | null {
  const nextPath = [...path, node];
  if (node.id === targetId) return nextPath;
  for (const child of node.children) {
    const found = findPath(targetId, child, nextPath);
    if (found !== null) return found;
  }
  return null;
}

function jumpToReference(kind: ReferenceKind, id: string): void {
  const targetId = `${kind}:${id}`;
  const path = findPath(targetId);
  if (path === null) return;
  breadcrumbs.value = path.slice(0, -1);
  selected.value = path.at(-1)!;
  search.value = '';
}

function jumpToFlowReference(reference: NonNullable<DemoNode['reference']>): void {
  jumpToReference(reference.kind, reference.id);
}

function revealIssue(issue: ValidationIssue): void {
  let best: DemoNode | null = null;
  function visit(node: DemoNode): void {
    if (
      issue.path.startsWith(node.sourcePath) &&
      (best === null || node.sourcePath.length > best.sourcePath.length)
    ) {
      best = node;
    }
    node.children.forEach(visit);
  }
  visit(root.value);
  if (best === null) return;
  const path = findPath((best as DemoNode).id);
  if (path === null) return;
  breadcrumbs.value = path.slice(0, -1);
  selected.value = path.at(-1)!;
  showProblems.value = false;
}

function resetDemo(): void {
  renamed.value = {};
}

function selectOperator(slug: 'tangtang' | 'rossi'): void {
  operator.value = slug === 'rossi' ? rossi : tangtang;
  root.value = buildOperatorRoot(operator.value);
  const skillsSection = root.value.children[1]!;
  breadcrumbs.value = [root.value, skillsSection];
  selected.value = skillsSection.children[0] ?? null;
  renamed.value = {};
  search.value = '';
  showProblems.value = false;
}

function openComplexSample(slug: 'tangtang' | 'rossi', groupKey: string, skillKey: string): void {
  selectOperator(slug);
  const skillsSection = root.value.children[1]!;
  const group = skillsSection.children.find(node => node.label === groupKey);
  const skill = group?.children.find(node => node.label === skillKey);
  if (group === undefined || skill === undefined) return;
  breadcrumbs.value = [root.value, skillsSection, group, skill];
  selected.value = skill.children[0] ?? null;
}

function timelinePosition(node: DemoNode, skill: DemoNode): Readonly<Record<string, string>> {
  const total = timelineExtent(skill);
  const start = Math.max(0, finiteNumber(node.details['开始帧'], 0));
  const end = Math.max(start, finiteNumber(node.details['结束帧'], start));
  const left = Math.min(88, (start / total) * 100);
  const duration = Math.max(0, end - start);
  const width = Math.max(12, Math.min(42, (duration / total) * 100));
  return { left: `${left}%`, width: `${width}%` };
}

function timelineExtent(skill: DemoNode): number {
  return Math.max(
    1,
    finiteNumber(skill.details['时间轴宽度帧'], 1),
    ...skill.children
      .filter(node => node.kind === '动作序列')
      .map(node =>
        Math.max(finiteNumber(node.details['开始帧'], 0), finiteNumber(node.details['结束帧'], 0)),
      ),
  );
}

function timelineTick(skill: DemoNode, ratio: number): number {
  return Math.round(timelineExtent(skill) * ratio);
}

function timelineBlockPercent(skill: DemoNode): string {
  const blockFrames = finiteNumber(skill.details['时间轴宽度帧'], 0);
  return `${Math.min(100, (blockFrames / timelineExtent(skill)) * 100)}%`;
}

function finiteNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') goBack();
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'p') {
    event.preventDefault();
    searchInput.value?.focus();
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown));
onUnmounted(() => window.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <div class="demo-shell">
    <header class="demo-header">
      <div>
        <button class="back-to-timeline" @click="router.push('/next/timeline')">← 时间轴</button>
        <strong>定义编辑器 Demo</strong>
        <span class="prototype-badge">交互原型 · 不保存</span>
        <span v-if="dirty" class="dirty-badge">已修改</span>
      </div>
      <div class="header-actions">
        <button @click="openComplexSample('tangtang', 'comboSkill', 'comboSkill')">
          唐棠 · 连携技
        </button>
        <button @click="openComplexSample('rossi', 'battleSkill', 'battleSkill')">
          洛茜 · 战技
        </button>
        <button :disabled="!dirty" @click="resetDemo">放弃修改</button>
        <button class="primary" :disabled="!dirty">保存模板</button>
      </div>
    </header>

    <div class="demo-body">
      <aside class="outliner">
        <div class="panel-caption">定义结构</div>
        <button
          v-for="section in root.children"
          :key="section.id"
          :class="{ active: breadcrumbs[1]?.id === section.id }"
          @click="openSection(section)"
        >
          <span>{{ section.label }}</span
          ><small>{{ section.summary }}</small>
        </button>
        <div class="outliner-note">
          <b>原则</b>
          <span>中间画布默认展开完整结构。层级导航只用于定位和局部聚焦。</span>
        </div>
      </aside>

      <main class="editor-area">
        <nav class="breadcrumbs" aria-label="当前位置">
          <button v-if="breadcrumbs.length > 1" class="back-button" @click="goBack">←</button>
          <template v-for="(node, index) in breadcrumbs" :key="node.id">
            <span v-if="index > 0">›</span>
            <button
              :class="{ current: index === breadcrumbs.length - 1 }"
              @click="navigateTo(index)"
            >
              {{ displayLabel(node) }}
            </button>
          </template>
        </nav>

        <div class="collection-toolbar">
          <div>
            <strong>{{ displayLabel(page) }}</strong>
            <span>{{ page.summary }}</span>
          </div>
          <input ref="searchInput" v-model="search" placeholder="搜索当前层级…  Ctrl+P" />
        </div>

        <div class="collection-content">
          <SkillMindMap
            v-if="
              page.kind === '技能定义' || page.kind === '能力实体子技能' || page.kind === '动作序列'
            "
            :root="page"
            :selected-id="selected?.id"
            @select="select"
            @reference="jumpToFlowReference"
          />
          <div v-else-if="false" class="skill-map">
            <header class="skill-map-head">
              <div>
                <b>时间结构</b>
                <span>每条轨道是一个触发序列；技能块宽度与完整计划跨度分别标记</span>
              </div>
              <strong v-if="page.details['时间轴宽度帧'] !== undefined">
                技能块 {{ page.details['时间轴宽度帧'] }}f · 计划至 {{ timelineExtent(page) }}f
              </strong>
              <strong v-else>子技能计划至 {{ timelineExtent(page) }}f</strong>
            </header>
            <div class="timeline-ruler">
              <span>0</span><span>{{ timelineTick(page, 0.25) }}f</span
              ><span>{{ timelineTick(page, 0.5) }}f</span
              ><span>{{ timelineTick(page, 0.75) }}f</span><span>{{ timelineExtent(page) }}f</span>
              <b
                v-if="page.details['时间轴宽度帧'] !== undefined"
                class="block-end-label"
                :style="{ left: timelineBlockPercent(page) }"
              >
                技能块结束 {{ page.details['时间轴宽度帧'] }}f
              </b>
            </div>
            <div class="timeline-lanes">
              <div
                v-for="(node, index) in visibleChildren.filter(child => child.kind === '动作序列')"
                :key="node.id"
                class="timeline-lane"
              >
                <span class="lane-label">S{{ index + 1 }}</span>
                <div class="lane-track">
                  <i
                    v-if="page.details['时间轴宽度帧'] !== undefined"
                    class="block-end-tick"
                    :style="{ left: timelineBlockPercent(page) }"
                  ></i>
                  <button
                    class="sequence-block"
                    :class="{ selected: selected?.id === node.id }"
                    :style="timelinePosition(node, page)"
                    @click="select(node)"
                  >
                    <b>{{ node.details['开始帧'] }}f</b>
                    <span>{{ node.children.length }} 个步骤</span>
                    <i v-if="node.children.some(child => child.children.length)">含结构</i>
                  </button>
                </div>
              </div>
            </div>
            <section
              v-if="visibleChildren.some(child => child.kind === '技能事件监听器')"
              class="event-rail"
            >
              <header><b>事件入口</b><span>不属于主时间轴，由事件触发</span></header>
              <button
                v-for="node in visibleChildren.filter(child => child.kind === '技能事件监听器')"
                :key="node.id"
                @click="select(node)"
              >
                <span>⚡</span><b>{{ node.label }}</b
                ><small>{{ node.summary }}</small>
              </button>
            </section>

            <section class="expanded-skill-structure">
              <header>
                <div>
                  <b>完整技能结构</b>
                  <span>默认展开全部序列、条件分支和循环 Body</span>
                </div>
                <strong>{{ visibleChildren.length }} 个入口</strong>
              </header>
              <article
                v-for="(sequence, index) in visibleChildren.filter(
                  child => child.kind === '动作序列',
                )"
                :key="sequence.id"
                class="expanded-sequence-entry"
              >
                <button class="sequence-entry-head" @click="select(sequence)">
                  <span>S{{ index + 1 }}</span>
                  <b>{{ sequence.label }} · {{ sequence.details['开始帧'] }}f</b>
                  <small>{{ sequence.summary }}</small>
                </button>
                <ExpandedFlowSequence
                  :sequence="sequence"
                  :selected-id="selected?.id"
                  @select="select"
                  @reference="jumpToFlowReference"
                />
              </article>
              <article
                v-for="handler in visibleChildren.filter(child => child.kind === '技能事件监听器')"
                :key="handler.id"
                class="expanded-sequence-entry event-entry"
              >
                <button class="sequence-entry-head" @click="select(handler)">
                  <span>⚡</span><b>{{ handler.label }}</b
                  ><small>{{ handler.summary }}</small>
                </button>
                <div
                  v-for="sequence in handler.children"
                  :key="sequence.id"
                  class="handler-sequence"
                >
                  <b>{{ sequence.label }}</b>
                  <ExpandedFlowSequence
                    :sequence="sequence"
                    :selected-id="selected?.id"
                    @select="select"
                    @reference="jumpToFlowReference"
                  />
                </div>
              </article>
            </section>
          </div>

          <div v-else-if="page.kind === '动作序列'" class="flow-canvas">
            <div class="flow-caption">
              <span class="flow-caption-line"></span>
              <span>顺序执行</span>
              <small>结构关系在画布中直接表达，参数仍在右侧编辑</small>
            </div>
            <ExpandedFlowSequence
              :sequence="page"
              :selected-id="selected?.id"
              @select="select"
              @reference="jumpToFlowReference"
            />
            <div v-if="false" class="flow-sequence">
              <template v-for="(node, index) in visibleChildren" :key="node.id">
                <div v-if="index > 0" class="flow-connector"><span></span></div>

                <article
                  v-if="node.details['步骤类型'] === 'conditional'"
                  class="flow-control flow-condition"
                  :class="{ selected: selected?.id === node.id }"
                >
                  <button class="condition-head" @click="select(node)">
                    <span class="condition-symbol">IF</span>
                    <span>
                      <strong>{{ node.details['条件表达式'] }}</strong>
                      <small>条件判定</small>
                    </span>
                  </button>
                  <div class="branch-fork" aria-hidden="true"><i></i><i></i><i></i></div>
                  <div class="flow-branches">
                    <section
                      v-for="(branchNode, branchIndex) in node.children"
                      :key="branchNode.id"
                      class="flow-branch"
                      :class="branchIndex === 0 ? 'true-branch' : 'false-branch'"
                    >
                      <button class="branch-head" @click="enterChildContainer(node, branchNode)">
                        <b>{{ branchNode.label }}</b>
                        <span>{{ branchNode.children.length }} 个步骤</span>
                      </button>
                      <div class="branch-body">
                        <button
                          v-for="branchStep in branchNode.children"
                          :key="branchStep.id"
                          class="branch-step"
                          @click="enterChildContainer(node, branchNode)"
                        >
                          <span>{{
                            branchStep.details['步骤类型'] === 'conditional' ? 'IF' : '●'
                          }}</span>
                          <strong>{{ displayLabel(branchStep) }}</strong>
                          <small v-if="branchStep.children.length">包含子结构 →</small>
                        </button>
                        <span v-if="branchNode.children.length === 0" class="branch-empty"
                          >空分支</span
                        >
                      </div>
                    </section>
                    <section
                      v-if="node.children.length === 1"
                      class="flow-branch false-branch passthrough"
                    >
                      <div class="branch-head">
                        <b>FALSE / Else</b>
                        <span>无额外动作</span>
                      </div>
                      <div class="branch-body branch-pass">
                        <span></span><b>继续主流程</b><span></span>
                      </div>
                    </section>
                  </div>
                </article>

                <article
                  v-else-if="node.children.length"
                  class="flow-control flow-loop"
                  :class="{ selected: selected?.id === node.id }"
                  @click="select(node)"
                >
                  <header>
                    <span class="loop-symbol">↻</span>
                    <span>
                      <strong>{{ node.details['步骤类型'] }}</strong>
                      <small>{{ node.summary }}</small>
                    </span>
                  </header>
                  <button
                    v-for="body in node.children"
                    :key="body.id"
                    class="loop-body"
                    @click.stop="enterChildContainer(node, body)"
                  >
                    <b>{{ body.label }}</b>
                    <span>{{ body.children.length }} 个步骤 →</span>
                  </button>
                </article>

                <button
                  v-else
                  class="flow-action"
                  :class="{ selected: selected?.id === node.id, reference: node.reference }"
                  @click="select(node)"
                >
                  <span class="flow-index">{{ index + 1 }}</span>
                  <span class="action-copy">
                    <strong>{{ displayLabel(node).replace(/^\d+\.\s*/, '') }}</strong>
                    <small>{{ node.summary }}</small>
                  </span>
                  <span v-if="node.reference" class="reference-port">引用 ↗</span>
                </button>
              </template>
              <div v-if="visibleChildren.length === 0" class="empty-state">没有匹配项。</div>
            </div>
          </div>

          <div v-else class="node-list">
            <button
              v-for="node in visibleChildren"
              :key="node.id"
              class="node-card"
              :class="{ selected: selected?.id === node.id }"
              @click="select(node)"
            >
              <span class="node-type">{{ node.kind }}</span>
              <strong>{{ displayLabel(node) }}</strong>
              <small>{{ node.summary }}</small>
              <span v-if="node.children.length" class="enter-hint" @click.stop="enter(node)">
                {{ node.children.length }} 项 →
              </span>
            </button>
            <div v-if="visibleChildren.length === 0" class="empty-state">
              {{ page.children.length === 0 ? '当前对象没有可下钻的子项。' : '没有匹配项。' }}
            </div>
          </div>

          <section
            v-if="
              page.kind !== '动作序列' &&
              page.kind !== '技能定义' &&
              page.kind !== '能力实体子技能' &&
              selected?.children.length
            "
            class="structure-preview"
          >
            <header>
              <div>
                <strong>下一层结构预览</strong>
                <span>只预览直属容器及其步骤摘要，不递归展开。</span>
              </div>
              <button @click="enter(selected)">进入 {{ displayLabel(selected) }} →</button>
            </header>
            <div
              class="preview-grid"
              :class="{ branches: selected.details['步骤类型'] === 'conditional' }"
            >
              <button
                v-for="child in selected.children"
                :key="child.id"
                class="preview-lane"
                @click="enterChildContainer(selected, child)"
              >
                <span>{{ child.kind }}</span>
                <strong>{{ displayLabel(child) }}</strong>
                <small>{{ child.summary }}</small>
                <div v-if="child.children.length" class="preview-steps">
                  <span v-for="step in child.children.slice(0, 4)" :key="step.id">
                    {{ displayLabel(step) }}
                  </span>
                  <span v-if="child.children.length > 4">… +{{ child.children.length - 4 }}</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>

      <aside class="inspector">
        <template v-if="selected">
          <div class="panel-caption">属性检查器</div>
          <h2>{{ displayLabel(selected) }}</h2>
          <p>{{ selected.kind }} · {{ selected.summary }}</p>
          <label class="field-row">
            <span>演示名称</span>
            <input :value="displayLabel(selected)" @input="renameSelected" />
          </label>
          <div class="property-list">
            <div v-for="(value, key) in selected.details" :key="key">
              <span>{{ key }}</span
              ><code>{{ shortValue(value) }}</code>
            </div>
          </div>
          <button
            v-if="selected.reference"
            class="reference-card"
            @click="jumpToReference(selected.reference.kind, selected.reference.id)"
          >
            <span>引用定义</span>
            <strong>{{ selected.reference.id }}</strong>
            <small>跳转到定义 →</small>
          </button>
        </template>
        <div v-else class="empty-state">选择当前层级中的一个对象。</div>
      </aside>
    </div>

    <section v-if="showProblems" class="problems-panel">
      <button
        v-for="issue in issues"
        :key="`${issue.path}:${issue.message}`"
        @click="revealIssue(issue)"
      >
        <code>{{ issue.path }}</code
        ><span>{{ issue.message }}</span>
      </button>
    </section>
    <footer class="status-bar">
      <button :class="{ warning: issues.length }" @click="showProblems = !showProblems">
        {{ issues.length ? `● ${issues.length} 个基线问题` : '✓ 定义结构有效' }}
      </button>
      <span>Esc 返回上一级</span>
      <span>右侧可选聚焦，不影响全局展开</span>
      <span class="status-path">{{ breadcrumbs.map(displayLabel).join(' / ') }}</span>
    </footer>
  </div>
</template>

<style scoped>
.demo-shell {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 54px minmax(0, 1fr) auto 30px;
  overflow: hidden;
  background: #111214;
  color: #e8e8e8;
  font-family: Inter, 'Microsoft YaHei', sans-serif;
}
button,
input {
  color: inherit;
  font: inherit;
}
button {
  cursor: pointer;
}
button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid #33363a;
  background: #191a1d;
}
.demo-header > div {
  display: flex;
  align-items: center;
  gap: 12px;
}
.demo-header strong {
  font-size: 17px;
}
.back-to-timeline,
.header-actions button {
  height: 30px;
  padding: 0 11px;
  border: 1px solid #44474d;
  background: #202226;
}
.prototype-badge,
.dirty-badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
}
.prototype-badge {
  color: #9fa6af;
  background: #292c31;
}
.dirty-badge {
  color: #f4dd54;
  border: 1px solid #716925;
}
.header-actions .primary {
  color: #111;
  border-color: #e4cf32;
  background: #e4cf32;
}
.demo-body {
  min-height: 0;
  display: grid;
  grid-template-columns: 230px minmax(420px, 1fr) 320px;
}
.outliner,
.inspector {
  min-height: 0;
  overflow: auto;
  background: #151619;
}
.outliner {
  padding: 12px;
  border-right: 1px solid #303238;
}
.inspector {
  padding: 16px;
  border-left: 1px solid #303238;
}
.panel-caption {
  margin-bottom: 10px;
  color: #747982;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.outliner > button {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 11px 12px;
  border: 0;
  border-left: 3px solid transparent;
  background: transparent;
  text-align: left;
}
.outliner > button small,
.node-card small,
.inspector p {
  color: #858a92;
}
.outliner > button.active {
  color: #f0dc4e;
  border-left-color: #e2cb2e;
  background: #2b2a22;
}
.outliner-note {
  display: grid;
  gap: 7px;
  margin-top: 24px;
  padding: 12px;
  border: 1px solid #34363b;
  color: #868b94;
  font-size: 12px;
  line-height: 1.6;
}
.outliner-note b {
  color: #c8cbd0;
}
.editor-area {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: 40px 62px minmax(0, 1fr);
  background: #111214;
}
.collection-content {
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  overflow: hidden;
}
.breadcrumbs {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 14px;
  overflow: hidden;
  border-bottom: 1px solid #303238;
  background: #18191c;
  color: #70757d;
}
.breadcrumbs button {
  flex: 0 1 auto;
  min-width: 0;
  padding: 4px 2px;
  overflow: hidden;
  border: 0;
  background: transparent;
  color: #a6aab1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.breadcrumbs button.current {
  color: #f0dc4e;
}
.breadcrumbs .back-button {
  flex: 0 0 28px;
  height: 26px;
  border: 1px solid #3d4046;
}
.collection-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 16px;
  border-bottom: 1px solid #292b30;
}
.collection-toolbar > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.collection-toolbar span {
  color: #858a92;
  font-size: 12px;
}
.collection-toolbar input,
.field-row input {
  height: 34px;
  padding: 0 10px;
  border: 1px solid #41444a;
  background: #1d1f23;
  outline: none;
}
.collection-toolbar input {
  width: min(280px, 40%);
}
input:focus {
  border-color: #baaa31;
}
.node-list {
  min-height: 0;
  display: grid;
  align-content: start;
  gap: 4px;
  padding: 10px 12px;
  overflow: auto;
}
.node-card {
  position: relative;
  min-height: 48px;
  display: grid;
  grid-template-columns: 100px minmax(120px, 0.7fr) minmax(180px, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 7px 11px;
  border: 1px solid #34373d;
  border-left: 3px solid #555a63;
  background: #1a1c20;
  text-align: left;
}
.node-card:hover,
.node-card.selected {
  border-color: #827928;
  border-left-color: #e2cb2e;
  background: #22221e;
}
.node-card .node-type {
  color: #9297a0;
  font-size: 12px;
}
.node-card strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.node-card .enter-hint {
  padding: 5px 8px;
  color: #f0dc4e;
  border: 1px solid #605b2a;
  font-size: 12px;
}
.skill-map {
  min-height: 0;
  padding: 14px 18px 28px;
  overflow: auto;
  background: #121316;
}
.skill-map-head,
.event-rail header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.skill-map-head > div,
.event-rail header {
  color: #858a92;
  font-size: 11px;
}
.skill-map-head > div {
  display: grid;
  gap: 3px;
}
.skill-map-head b,
.event-rail b {
  color: #d3d5d9;
}
.skill-map-head > strong {
  color: #f0dc4e;
  font: 700 15px monospace;
}
.timeline-ruler {
  display: flex;
  justify-content: space-between;
  margin: 14px 0 0 52px;
  padding: 5px 0;
  border-bottom: 1px solid #555a63;
  color: #737983;
  font: 10px monospace;
  position: relative;
}
.block-end-label {
  position: absolute;
  top: -17px;
  padding: 2px 4px;
  color: #e0cc42;
  background: #24231b;
  font: 9px monospace;
  transform: translateX(-50%);
  white-space: nowrap;
}
.timeline-lanes {
  display: grid;
  gap: 4px;
  padding-top: 5px;
  max-height: 220px;
  overflow: auto;
  border-bottom: 1px solid #30333a;
}
.timeline-lane {
  min-height: 43px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}
.lane-label {
  color: #747a84;
  font: 10px monospace;
  text-align: right;
}
.lane-track {
  height: 38px;
  position: relative;
  border-bottom: 1px solid #292c32;
  background-image: linear-gradient(90deg, #2b2e34 1px, transparent 1px);
  background-size: 25% 100%;
}
.block-end-tick {
  width: 1px;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 0;
  border-left: 1px dashed rgba(224, 204, 66, 0.42);
}
.sequence-block {
  min-width: 116px;
  height: 34px;
  position: absolute;
  top: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 7px;
  padding: 0 8px;
  overflow: hidden;
  border: 1px solid #536985;
  border-left: 3px solid #75a2d2;
  background: #1c2733;
  text-align: left;
  white-space: nowrap;
  z-index: 1;
}
.sequence-block:hover,
.sequence-block.selected {
  border-color: #e1cb35;
  background: #29291f;
}
.sequence-block b {
  color: #a9cdf1;
  font: 700 10px monospace;
}
.sequence-block span {
  overflow: hidden;
  color: #c7cbd1;
  text-overflow: ellipsis;
  font-size: 10px;
}
.sequence-block i {
  position: absolute;
  top: 2px;
  right: 3px;
  color: #e0cc42;
  font-size: 8px;
  font-style: normal;
}
.event-rail {
  display: grid;
  gap: 6px;
  margin: 18px 0 0 52px;
  padding-top: 12px;
  border-top: 1px dashed #705681;
}
.event-rail header {
  justify-content: flex-start;
}
.event-rail > button {
  display: grid;
  grid-template-columns: 28px minmax(120px, auto) 1fr;
  gap: 8px;
  padding: 9px;
  border: 1px solid #5f4d6d;
  background: #251d2b;
  text-align: left;
}
.event-rail > button > span {
  color: #d3a6ed;
  text-align: center;
}
.event-rail small {
  color: #908397;
}
.expanded-skill-structure {
  min-width: 680px;
  display: grid;
  align-items: start;
  justify-items: start;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #3d4047;
}
.expanded-skill-structure > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.expanded-skill-structure > header > div {
  display: grid;
  gap: 3px;
}
.expanded-skill-structure > header span {
  color: #858a92;
  font-size: 11px;
}
.expanded-skill-structure > header > strong {
  color: #e1ce42;
  font-size: 11px;
}
.expanded-sequence-entry {
  width: max-content;
  min-width: max-content;
  padding: 0 0 10px;
}
.sequence-entry-head {
  width: 100%;
  display: grid;
  grid-template-columns: 38px minmax(160px, auto) 1fr;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
  padding: 8px 10px;
  border: 1px solid #4c6078;
  border-left: 3px solid #75a2d2;
  background: #1c2733;
  color: inherit;
  text-align: left;
}
.sequence-entry-head > span {
  color: #9dc4eb;
  font: 700 11px monospace;
}
.sequence-entry-head small {
  color: #858a92;
}
.event-entry .sequence-entry-head {
  border-color: #654e72;
  background: #251d2b;
}
.handler-sequence {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}
.flow-canvas {
  min-height: 0;
  padding: 12px 18px 28px;
  overflow: auto;
  background:
    linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px), #121316;
  background-size: 20px 20px;
}
.flow-caption {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #969ba4;
  font-size: 11px;
}
.flow-caption small {
  margin-left: auto;
  color: #676c74;
}
.flow-caption-line {
  width: 20px;
  height: 2px;
  background: #727782;
}
.flow-canvas > .expanded-sequence {
  width: max-content;
  min-width: min(100%, 760px);
  margin: 16px auto 0;
}
.flow-sequence {
  width: min(100%, 760px);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 16px auto 0;
}
.flow-connector {
  height: 24px;
  display: grid;
  place-items: center;
}
.flow-connector span {
  width: 2px;
  height: 100%;
  position: relative;
  background: #686d76;
}
.flow-connector span::after {
  position: absolute;
  bottom: -1px;
  left: -4px;
  width: 0;
  height: 0;
  border-top: 6px solid #686d76;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  content: '';
}
.flow-action {
  min-height: 54px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid #41454d;
  border-left: 4px solid #737984;
  background: #1c1e22;
  text-align: left;
}
.flow-action:hover,
.flow-action.selected,
.flow-control.selected {
  border-color: #d2bd31;
  box-shadow: 0 0 0 1px rgba(226, 203, 46, 0.16);
}
.flow-index {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #30333a;
  color: #c5c8cd;
  font: 700 12px monospace;
}
.action-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.action-copy strong,
.action-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.action-copy small {
  color: #858a93;
  font-size: 11px;
}
.reference-port {
  padding: 5px 8px;
  border: 1px solid #536b87;
  color: #8ebce8;
  background: #1a2530;
  font-size: 10px;
}
.flow-control {
  border: 1px solid #494d55;
  background: #181a1e;
}
.condition-head {
  width: min(88%, 620px);
  min-height: 56px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  margin: -1px auto 0;
  padding: 8px 14px;
  border: 1px solid #777038;
  background: #27251c;
  text-align: left;
  clip-path: polygon(4% 0, 96% 0, 100% 50%, 96% 100%, 4% 100%, 0 50%);
}
.condition-head > span:last-child,
.flow-loop header > span:last-child {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.condition-head strong,
.condition-head small,
.flow-loop small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.condition-head small,
.flow-loop small {
  color: #919078;
  font-size: 10px;
}
.condition-symbol {
  color: #f0dc4e;
  font: 800 20px monospace;
  text-align: center;
}
.branch-fork {
  height: 30px;
  position: relative;
  margin: 0 19%;
}
.branch-fork i {
  position: absolute;
  display: block;
  background: #646a74;
}
.branch-fork i:first-child {
  width: 2px;
  height: 15px;
  top: 0;
  left: calc(50% - 1px);
}
.branch-fork i:nth-child(2) {
  height: 2px;
  top: 14px;
  right: 0;
  left: 0;
}
.branch-fork i:last-child {
  width: calc(100% - 2px);
  height: 15px;
  top: 14px;
  left: 1px;
  border-right: 2px solid #646a74;
  border-left: 2px solid #646a74;
  background: transparent;
}
.flow-branches {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 0 12px 12px;
}
.flow-branch {
  min-width: 0;
  border: 1px solid #3d4148;
  background: #141619;
}
.flow-branch.true-branch {
  border-top: 3px solid #62b87a;
}
.flow-branch.false-branch {
  border-top: 3px solid #c46f66;
}
.branch-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 9px;
  border: 0;
  border-bottom: 1px solid #32353b;
  background: #202228;
  text-align: left;
}
.branch-head span {
  color: #858a92;
  font-size: 10px;
}
.branch-body {
  min-height: 52px;
  display: grid;
  align-content: start;
  gap: 6px;
  padding: 8px;
}
.branch-step {
  min-width: 0;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: center;
  gap: 5px;
  padding: 7px;
  border: 1px solid #3b3e45;
  background: #202228;
  text-align: left;
}
.branch-step > span {
  color: #a9a13d;
  font: 700 10px monospace;
}
.branch-step strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
}
.branch-step small,
.branch-empty {
  color: #7f858e;
  font-size: 9px;
}
.flow-branch.passthrough {
  opacity: 0.72;
}
.branch-pass {
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  color: #858a92;
  font-size: 10px;
}
.branch-pass span {
  height: 1px;
  background: #565b64;
}
.flow-loop {
  padding: 0 10px 10px;
  border: 2px solid #62789a;
  border-radius: 4px;
}
.flow-loop header {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  margin: 0 -10px 10px;
  padding: 7px 10px;
  background: #1d2836;
}
.loop-symbol {
  color: #8bb7e8;
  font-size: 22px;
  text-align: center;
}
.loop-body {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px dashed #607594;
  background: #18202a;
  text-align: left;
}
.loop-body span {
  color: #8da3bf;
  font-size: 11px;
}
.structure-preview {
  max-height: 280px;
  padding: 12px;
  overflow: auto;
  border-top: 1px solid #34373d;
  background: #151619;
}
.structure-preview header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
}
.structure-preview header > div {
  display: grid;
  gap: 3px;
}
.structure-preview header span {
  color: #858a92;
  font-size: 11px;
}
.structure-preview header button {
  padding: 6px 10px;
  color: #e7d64f;
  border: 1px solid #5f5928;
  background: #22221d;
}
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 8px;
}
.preview-grid.branches {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.preview-lane {
  min-width: 0;
  display: grid;
  gap: 5px;
  padding: 10px;
  border: 1px solid #3b3e44;
  border-top: 3px solid #767b84;
  background: #1b1d21;
  text-align: left;
}
.preview-grid.branches .preview-lane:first-child {
  border-top-color: #65b779;
}
.preview-grid.branches .preview-lane:nth-child(2) {
  border-top-color: #c27668;
}
.preview-lane > span,
.preview-lane > small {
  color: #8d929a;
  font-size: 11px;
}
.preview-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
}
.preview-steps span {
  padding: 3px 6px;
  border: 1px solid #383b40;
  background: #24262b;
  color: #b8bbc0;
  font-size: 10px;
}
.inspector h2 {
  margin: 4px 0;
  overflow-wrap: anywhere;
  font-size: 18px;
}
.inspector p {
  margin: 0 0 20px;
  font-size: 12px;
}
.field-row {
  display: grid;
  gap: 7px;
  color: #a4a8af;
  font-size: 12px;
}
.property-list {
  display: grid;
  gap: 1px;
  margin-top: 18px;
  border: 1px solid #34373c;
}
.property-list > div {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(90px, 0.7fr) minmax(0, 1fr);
  gap: 12px;
  padding: 9px 10px;
  background: #1c1e22;
}
.property-list span {
  color: #8f949c;
}
.property-list code {
  overflow: hidden;
  color: #d8d9dc;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.reference-card,
.enter-primary {
  width: 100%;
  margin-top: 14px;
  padding: 11px;
  border: 1px solid #575329;
  background: #25251e;
  text-align: left;
}
.reference-card {
  display: grid;
  gap: 5px;
}
.reference-card span,
.reference-card small {
  color: #9a9d85;
}
.reference-card strong {
  overflow-wrap: anywhere;
  color: #f0dc4e;
}
.enter-primary {
  color: #111;
  border-color: #e2cb2e;
  background: #e2cb2e;
  text-align: center;
  font-weight: 700;
}
.empty-state {
  min-height: 180px;
  display: grid;
  place-items: center;
  color: #747982;
}
.problems-panel {
  max-height: 180px;
  overflow: auto;
  border-top: 1px solid #553932;
  background: #181313;
}
.problems-panel button {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1fr);
  gap: 14px;
  padding: 9px 14px;
  border: 0;
  border-bottom: 1px solid #322625;
  background: transparent;
  color: #d7b2a4;
  text-align: left;
}
.problems-panel code {
  color: #e3876e;
  overflow-wrap: anywhere;
}
.status-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 12px;
  border-top: 1px solid #303238;
  background: #1a1b1e;
  color: #878c94;
  font-size: 11px;
}
.status-bar button {
  height: 100%;
  padding: 0 9px;
  border: 0;
  background: transparent;
  color: #87c795;
}
.status-bar button.warning {
  color: #e49a77;
}
.status-path {
  min-width: 0;
  margin-left: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 1000px) {
  .demo-body {
    grid-template-columns: 190px minmax(360px, 1fr) 270px;
  }
}
@media (max-width: 760px) {
  .demo-body {
    grid-template-columns: 150px minmax(0, 1fr);
  }
  .inspector {
    display: none;
  }
  .node-card {
    grid-template-columns: 90px minmax(0, 1fr);
  }
  .node-card .enter-hint {
    display: none;
  }
}
</style>
