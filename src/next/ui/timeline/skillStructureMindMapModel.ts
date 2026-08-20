import type {
  ActionSequenceDefinition,
  AbilityEntityDefinition,
  CombatCondition,
  CombatStepDefinition,
  ScheduledSequenceDefinition,
  SkillBuffDefinition,
  SkillDefinition,
} from '../../core/game-data/operatorDefinition';
import type { EquipmentContributionDefinition } from '../../core/game-data/equipmentDefinition';

export type SkillStructureEditorSection = 'overview' | 'blackboard' | 'availability' | number;

export interface SkillStructureNode {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly summary: string;
  readonly sourcePath: string;
  readonly details: Readonly<Record<string, unknown>>;
  readonly children: readonly SkillStructureNode[];
  readonly editorSection: SkillStructureEditorSection;
  readonly reference?: { readonly kind: 'buff' | 'entity'; readonly id: string };
  readonly canAddChild?:
    | 'sequence'
    | 'step'
    | 'lifecycle'
    | 'childSkill'
    | 'equipmentModifier'
    | 'equipmentHandler'
    | 'combatCondition';
  readonly payloadKind?:
    | 'scheduledSequence'
    | 'combatStep'
    | 'childSkill'
    | 'equipmentModifier'
    | 'equipmentHandler'
    | 'combatCondition';
  readonly acceptsChildKind?:
    | 'scheduledSequence'
    | 'combatStep'
    | 'childSkill'
    | 'equipmentModifier'
    | 'equipmentHandler'
    | 'combatCondition';
  readonly canDelete?: boolean;
  readonly canMove?: boolean;
}

export interface SkillStructureMindMapLabels {
  readonly blackboard: string;
  readonly availability: string;
  readonly sequence: string;
}

function shortValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) return `${value.length} 项`;
  return `${Object.keys(value as object).length} 个字段`;
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

function conditionNode(
  condition: CombatCondition,
  id: string,
  sourcePath: string,
  label: string = condition.kind,
  editorSection: number = 0,
  canDelete = true,
  canMove = true,
): SkillStructureNode {
  const children =
    condition.kind === 'not'
      ? [
          conditionNode(
            condition.condition,
            `${id}:condition`,
            `${sourcePath}.condition`,
            'NOT',
            editorSection,
            false,
            false,
          ),
        ]
      : condition.kind === 'all' || condition.kind === 'any'
        ? condition.conditions.map((child, index) =>
            conditionNode(
              child,
              `${id}:condition:${index}`,
              `${sourcePath}.conditions[${index}]`,
              `${index + 1}. ${child.kind}`,
              editorSection,
              condition.conditions.length > 1,
              condition.conditions.length > 1,
            ),
          )
        : [];
  const composite = condition.kind === 'all' || condition.kind === 'any';
  return {
    id,
    label,
    kind: '战斗条件',
    summary: describeCondition(condition),
    sourcePath,
    details: { 条件类型: condition.kind },
    editorSection,
    children,
    payloadKind: 'combatCondition',
    canDelete,
    canMove,
    ...(composite
      ? { canAddChild: 'combatCondition' as const, acceptsChildKind: 'combatCondition' as const }
      : {}),
  };
}

function sequenceNode(
  sequence: ActionSequenceDefinition,
  id: string,
  label: string,
  sourcePath: string,
  summary: string,
  editorSection: number,
): SkillStructureNode {
  return {
    id,
    label,
    kind: '动作序列',
    summary,
    sourcePath,
    details: { 步骤数: sequence.steps.length },
    editorSection,
    children: sequence.steps.map((step, index) =>
      stepNode(step, `${id}:step:${index}`, `${sourcePath}.steps[${index}]`, index, editorSection),
    ),
    canAddChild: 'step',
    acceptsChildKind: 'combatStep',
  };
}

function stepNode(
  step: CombatStepDefinition,
  id: string,
  sourcePath: string,
  index: number,
  editorSection: number,
): SkillStructureNode {
  const children: SkillStructureNode[] = [];
  if (step.kind === 'conditional') {
    children.push(
      sequenceNode(
        step.whenTrue,
        `${id}:true`,
        'TRUE / Then',
        `${sourcePath}.whenTrue`,
        `${step.whenTrue.steps.length} 个直属步骤`,
        editorSection,
      ),
    );
    const whenFalse = step.whenFalse ?? { steps: [] };
    children.push(
      sequenceNode(
        whenFalse,
        `${id}:false`,
        'FALSE / Else',
        `${sourcePath}.whenFalse`,
        `${whenFalse.steps.length} 个直属步骤`,
        editorSection,
      ),
    );
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
        editorSection,
      ),
    );
  }

  const parameters = step.parameters as Readonly<Record<string, unknown>>;
  const conditionText =
    step.kind === 'conditional' ? describeCondition(parameters.condition) : undefined;
  const reference =
    step.kind === 'applyBuff'
      ? { kind: 'buff' as const, id: String(parameters.buffId ?? '') }
      : step.kind === 'spawnAbilityEntity'
        ? { kind: 'entity' as const, id: String(parameters.abilityEntityId ?? '') }
        : undefined;
  return {
    id,
    label: step.kind === 'conditional' ? `${index + 1}. IF` : `${index + 1}. ${step.kind}`,
    kind: '战斗步骤',
    summary: conditionText ?? summarizeParameters(parameters),
    sourcePath,
    details: {
      步骤类型: step.kind,
      稳定键: step.key ?? '—',
      ...(conditionText === undefined ? {} : { 条件表达式: conditionText }),
      ...parameters,
    },
    editorSection,
    children,
    payloadKind: 'combatStep',
    ...(reference === undefined || reference.id === '' ? {} : { reference }),
  };
}

function scheduledSequenceNode(
  sequence: ScheduledSequenceDefinition,
  index: number,
  sequenceLabel: string,
): SkillStructureNode {
  const range =
    sequence.endFrame === undefined
      ? `第 ${sequence.startFrame} 帧`
      : `第 ${sequence.startFrame}–${sequence.endFrame} 帧`;
  const node = sequenceNode(
    sequence.sequence,
    `sequence:${index}`,
    `${sequenceLabel} ${index + 1}`,
    `scheduledSequences[${index}].sequence`,
    `${range} · ${sequence.sequence.steps.length} 个直属步骤`,
    index,
  );
  return {
    ...node,
    sourcePath: `scheduledSequences[${index}]`,
    payloadKind: 'scheduledSequence',
    details: {
      开始帧: sequence.startFrame,
      结束帧: sequence.endFrame ?? '—',
      直属步骤数: sequence.sequence.steps.length,
    },
  };
}

export function buildSkillStructureMindMap(
  skill: SkillDefinition,
  labels: SkillStructureMindMapLabels = {
    blackboard: '初始黑板',
    availability: '可用条件',
    sequence: '时间序列',
  },
): SkillStructureNode {
  const sequences = skill.scheduledSequences.map((sequence, index) =>
    scheduledSequenceNode(sequence, index, labels.sequence),
  );
  return {
    id: 'skill',
    label: skill.key,
    kind: '技能定义',
    summary: `${skill.timelineBlockFrames} 帧 · ${sequences.length} 条时间序列`,
    sourcePath: '',
    details: {
      时间轴宽度帧: skill.timelineBlockFrames,
      冷却帧: skill.cooldownFrames ?? '—',
      费用数: skill.costs?.length ?? 0,
    },
    editorSection: 'overview',
    children: [
      {
        id: 'blackboard',
        label: labels.blackboard,
        kind: '技能设置',
        summary: `${Object.keys(skill.blackboard ?? {}).length} 个参数`,
        sourcePath: 'blackboard',
        details: skill.blackboard ?? {},
        editorSection: 'blackboard',
        children: [],
      },
      {
        id: 'availability',
        label: labels.availability,
        kind: '技能设置',
        summary:
          skill.availability === undefined ? '未设置' : describeCondition(skill.availability),
        sourcePath: 'availability',
        details: skill.availability ?? {},
        editorSection: 'availability',
        children: [],
      },
      ...sequences,
    ],
    canAddChild: 'sequence',
    acceptsChildKind: 'scheduledSequence',
  };
}

/** 武器、装备与套装共享同一贡献结构图；事件响应的动作序列继续使用技能步骤树。 */
export function buildEquipmentContributionMindMap(
  contribution: EquipmentContributionDefinition,
  label = '装备贡献',
): SkillStructureNode {
  const modifiers = contribution.modifiers ?? [];
  const handlers = contribution.eventHandlers ?? [];
  return {
    id: 'equipment:contribution',
    label,
    kind: '装备贡献',
    summary: `${modifiers.length} 项修正 · ${handlers.length} 个事件响应`,
    sourcePath: '',
    details: { 属性修正: modifiers.length, 事件响应: handlers.length },
    editorSection: 'overview',
    children: [
      {
        id: 'equipment:modifiers',
        label: '属性修正',
        kind: '贡献分组',
        summary: `${modifiers.length} 项`,
        sourcePath: 'modifiers',
        details: { 数量: modifiers.length },
        editorSection: 'overview',
        canAddChild: 'equipmentModifier',
        acceptsChildKind: 'equipmentModifier',
        children: modifiers.map((modifier, index) => ({
          id: `equipment:modifier:${index}`,
          label: `${index + 1}. ${modifier.kind}`,
          kind: '属性修正',
          summary: shortValue(modifier.value),
          sourcePath: `modifiers[${index}]`,
          details: { ...modifier },
          editorSection: index,
          children: [],
          payloadKind: 'equipmentModifier',
        })),
      },
      {
        id: 'equipment:handlers',
        label: '事件响应',
        kind: '贡献分组',
        summary: `${handlers.length} 项`,
        sourcePath: 'eventHandlers',
        details: { 数量: handlers.length },
        editorSection: 'overview',
        canAddChild: 'equipmentHandler',
        acceptsChildKind: 'equipmentHandler',
        children: handlers.map((handler, index) => {
          const handlerPath = `eventHandlers[${index}]`;
          return {
            id: `equipment:handler:${index}`,
            label: handler.key,
            kind: '事件响应',
            summary: handler.event.kind,
            sourcePath: handlerPath,
            details: { 事件: handler.event.kind, 条件: describeCondition(handler.condition) },
            editorSection: index,
            payloadKind: 'equipmentHandler' as const,
            ...(handler.condition === undefined ? { canAddChild: 'combatCondition' as const } : {}),
            children: [
              ...(handler.condition === undefined
                ? []
                : [
                    conditionNode(
                      handler.condition,
                      `equipment:handler:${index}:condition`,
                      `${handlerPath}.condition`,
                      '响应条件',
                      index,
                      true,
                      false,
                    ),
                  ]),
              sequenceNode(
                handler.sequence,
                `equipment:handler:${index}:sequence`,
                '响应序列',
                `${handlerPath}.sequence`,
                `${handler.sequence.steps.length} 个直属步骤`,
                index,
              ),
            ],
          };
        }),
      },
    ],
  };
}

const BUFF_LIFECYCLE_LABELS: Readonly<Record<string, string>> = {
  start: 'Start',
  enable: 'Enable',
  disable: 'Disable',
  beforeEnhance: 'Before Enhance',
  enhanceChanged: 'Enhance Changed',
  afterEnhance: 'After Enhance',
  trigger: 'Trigger',
  finish: 'Finish',
};

export function buildBuffStructureMindMap(
  buffId: string,
  definition: SkillBuffDefinition,
): SkillStructureNode {
  const lifecycleNodes = Object.entries(definition.lifecycleSequences ?? {}).flatMap(
    ([key, sequence]) => {
      if (sequence === undefined) return [];
      return [
        sequenceNode(
          sequence,
          `buff:lifecycle:${key}`,
          BUFF_LIFECYCLE_LABELS[key] ?? key,
          `lifecycleSequences.${key}`,
          `${sequence.steps.length} 个直属步骤`,
          0,
        ),
      ];
    },
  );
  return {
    id: 'buff',
    label: buffId,
    kind: 'Buff 定义',
    summary: `${lifecycleNodes.length} 个生命周期`,
    sourcePath: '',
    details: {
      叠加类型: definition.stackingType,
      持续秒数: definition.durationSeconds ?? '—',
      生命周期数: lifecycleNodes.length,
    },
    editorSection: 'overview',
    children: lifecycleNodes,
    canAddChild: 'lifecycle',
  };
}

export function buildAbilityEntityStructureMindMap(
  abilityEntityId: string,
  definition: AbilityEntityDefinition,
): SkillStructureNode {
  const childSkill = definition.childSkill;
  const sequenceNodes =
    childSkill?.scheduledSequences.map((sequence, index) => {
      const node = sequenceNode(
        sequence.sequence,
        `entity:sequence:${index}`,
        `子序列 ${index + 1}`,
        `childSkill.scheduledSequences[${index}].sequence`,
        `第 ${sequence.startFrame}–${sequence.endFrame ?? '∞'} 帧 · ${sequence.sequence.steps.length} 个直属步骤`,
        index,
      );
      return {
        ...node,
        sourcePath: `childSkill.scheduledSequences[${index}]`,
        payloadKind: 'scheduledSequence' as const,
      };
    }) ?? [];
  return {
    id: 'entity',
    label: abilityEntityId,
    kind: '能力实体',
    summary:
      definition.lifetime.kind === 'limited'
        ? `${definition.lifetime.durationSeconds}s · ${sequenceNodes.length} 条子序列`
        : `无限生命周期 · ${sequenceNodes.length} 条子序列`,
    sourcePath: '',
    details: { 生命周期: definition.lifetime.kind, 子序列数: sequenceNodes.length },
    editorSection: 'overview',
    children: [
      {
        id: 'entity:lifetime',
        label: '生命周期',
        kind: '实体设置',
        summary:
          definition.lifetime.kind === 'limited'
            ? `${definition.lifetime.durationSeconds} 秒`
            : '无限',
        sourcePath: 'lifetime',
        details: definition.lifetime,
        editorSection: 'overview',
        children: [],
      },
      ...(childSkill === undefined
        ? []
        : [
            {
              id: 'entity:child-skill',
              label: childSkill.skillId,
              kind: '实体子技能',
              summary: `${sequenceNodes.length} 条子序列`,
              sourcePath: 'childSkill',
              details: { 黑板参数数: Object.keys(childSkill.blackboard ?? {}).length },
              editorSection: 'overview' as const,
              children: sequenceNodes,
              canAddChild: 'sequence' as const,
              acceptsChildKind: 'scheduledSequence' as const,
            },
          ]),
    ],
    ...(childSkill === undefined ? { canAddChild: 'childSkill' as const } : {}),
    ...(childSkill === undefined ? { acceptsChildKind: 'childSkill' as const } : {}),
  };
}

export function indexSkillStructureNodes(
  root: SkillStructureNode,
): ReadonlyMap<string, SkillStructureNode> {
  const nodes = new Map<string, SkillStructureNode>();
  function visit(node: SkillStructureNode): void {
    nodes.set(node.id, node);
    node.children.forEach(visit);
  }
  visit(root);
  return nodes;
}

export function findSkillStructureNodeForPath(
  root: SkillStructureNode,
  rawPath: string,
): SkillStructureNode {
  const path = rawPath.replace(/^\$\.?/, '');
  let best = root;
  function visit(node: SkillStructureNode): void {
    const sourcePath = node.sourcePath;
    if (
      sourcePath.length > best.sourcePath.length &&
      (path === sourcePath ||
        path.startsWith(`${sourcePath}.`) ||
        path.startsWith(`${sourcePath}[`))
    ) {
      best = node;
    }
    node.children.forEach(visit);
  }
  visit(root);
  return best;
}
