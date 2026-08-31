import type { DeclaredBlackboardValueSource } from '../source/blackboard.ts';
import type {
  ProjectileLaunchActionSource,
  ProjectileSkillCallbackSource,
} from '../source/referenceActions.ts';
import type {
  CompiledBuffSequenceSource,
  CompiledBuffStepSource,
  CompiledActionValueOperandSource,
} from './combatActionProjectionTypes.ts';

export interface CompiledActionBlackboardScopeSource {
  readonly kind: 'withActionBlackboardScope';
  readonly parameters: {
    readonly scopeKey: string;
    readonly lifetime: 'execution';
    readonly alwaysNext?: boolean;
    readonly initialValues: Readonly<Record<string, number>>;
    readonly inheritParent: boolean;
    readonly entityInitialValues?: Readonly<Record<string, number>>;
    readonly entityAssignments?: Readonly<Record<string, CompiledActionValueOperandSource>>;
  };
  readonly body: {
    readonly steps: readonly CompiledBuffStepSource[];
  };
}

export interface ProjectileCallbackInvocationSource {
  readonly event: ProjectileSkillCallbackSource['event'];
  readonly skillId: string;
  readonly declaredBlackboard: readonly DeclaredBlackboardValueSource[];
  readonly sequence: CompiledBuffSequenceSource;
}

/**
 * 将已证明可同步执行的一次发射包装成独立宿主和回调 direct 板，不推导命中次数/回调顺序。
 * combat-spec/launch-projectile-skill-routing.md、skill-blackboard.md：同投射物共享实体板，
 * 回调 direct 各自以静态初值再合入发射快照。不同发射不复用，即使处于同一 ForEach 静态路径。
 *
 * 调用方必须提供有来源的模板初值，以及场景层已证明的同步事件顺序。这里只接受每个技能
 * 首次调用，且静态默认值已足够描述其创建基线；独立 SkillPatch/extra、重复回调的动态恢复、
 * 延迟回调、实体赋值仍由后续完整宿主投影闭合，不能冒充支持。
 */
export function compileSynchronousProjectileCallbackScopesSource(input: {
  readonly sourcePath: string;
  readonly launch: ProjectileLaunchActionSource;
  readonly template: {
    readonly projectileId: string;
    readonly entityBlackboard: readonly DeclaredBlackboardValueSource[];
  } | null;
  readonly invocations: readonly ProjectileCallbackInvocationSource[];
  /** 仅限调用方已由完整 ProjectileData 证明不需要实体黑板的特殊回调。 */
  readonly allowMissingEntityBlackboardEvidence?: boolean;
}): CompiledActionBlackboardScopeSource {
  const { sourcePath, launch, template, invocations } = input;
  const callbackReadsEntityBlackboard = invocations.some(invocation =>
    invocation.declaredBlackboard.some(value => value.key.startsWith('EntityBB_')),
  );
  if (
    template === null &&
    (!input.allowMissingEntityBlackboardEvidence ||
      (launch.assignEntityBlackboard && launch.assignments.length !== 0) ||
      callbackReadsEntityBlackboard)
  )
    throw new Error(`${sourcePath}: projectile entity blackboard evidence is missing`);
  if (template !== null && template.projectileId !== launch.projectileId)
    throw new Error(`${sourcePath}: projectile template identity mismatch`);
  const entityAssignments = projectEntityAssignments(launch, sourcePath);
  const routes = new Map<ProjectileSkillCallbackSource['event'], string>();
  for (const callback of launch.callbacks) {
    if (!callback.enabled) continue;
    if (callback.skillId.length === 0 || routes.has(callback.event))
      throw new Error(`${sourcePath}: invalid enabled projectile callback ${callback.event}`);
    routes.set(callback.event, callback.skillId);
  }
  const skills = new Set<string>();
  const steps: CompiledBuffStepSource[] = invocations.map((invocation, invocationIndex) => {
    if (routes.get(invocation.event) !== invocation.skillId)
      throw new Error(
        `${sourcePath}: callback ${invocation.event} does not match the enabled native route`,
      );
    if (skills.has(invocation.skillId))
      throw new Error(
        `${sourcePath}: repeated callback skill requires dynamic restoration semantics`,
      );
    skills.add(invocation.skillId);
    const sequence = omitDeadSingleEnemyBounceBookkeeping(
      invocation.sequence,
      invocations.slice(invocationIndex + 1).map(candidate => candidate.sequence),
    );
    return {
      kind: 'withActionBlackboardScope',
      parameters: {
        scopeKey: `${sourcePath}:${invocation.skillId}`,
        lifetime: 'execution',
        alwaysNext: true,
        initialValues: numericInitialValues(invocation.declaredBlackboard, sourcePath),
        inheritParent: true,
      },
      body: sequence,
    } satisfies CompiledActionBlackboardScopeSource;
  });
  return {
    kind: 'withActionBlackboardScope',
    parameters: {
      scopeKey: `${sourcePath}:${launch.projectileId}`,
      lifetime: 'execution',
      initialValues: {},
      inheritParent: launch.assignBlackboard,
      ...(template === null
        ? {}
        : {
            entityInitialValues: numericInitialValues(template.entityBlackboard, sourcePath, true),
            ...(Object.keys(entityAssignments).length === 0 ? {} : { entityAssignments }),
          }),
    },
    body: { steps },
  };
}

/**
 * 唯一木桩被 ExcludeTarget 排除后，寻找弹射目标的投影会得到确定空组，后续发射也随之消失。
 * 此时原分支只剩“记录已经弹射”的实体黑板写入和空组写入；若本次及后续回调均不再读取它们，
 * 整个分支在 Next 的单敌人模型中不可观察。先从叶子确认消费者已消失，再删除条件，避免要求
 * 一个本来只服务多敌人弹射的 EntityBB 初值。
 */
function omitDeadSingleEnemyBounceBookkeeping(
  sequence: CompiledBuffSequenceSource,
  laterCallbacks: readonly CompiledBuffSequenceSource[],
): CompiledBuffSequenceSource {
  const retained = sequence.steps.filter((step, index, steps) => {
    if (step.kind !== 'conditional' || step.whenFalse !== undefined) return true;
    if (step.parameters.alwaysNext !== true) return true;
    const writes: string[] = [];
    let hasEmptyTargetGroupWrite = false;
    for (const child of step.whenTrue.steps) {
      if (child.kind === 'modifyActionValue') {
        writes.push(child.parameters.key);
        continue;
      }
      if (child.kind === 'mergeContextTargets' && child.parameters.sources.length === 0) {
        writes.push(child.parameters.saveToContextKey);
        hasEmptyTargetGroupWrite = true;
        continue;
      }
      return true;
    }
    if (!hasEmptyTargetGroupWrite || writes.length < 2) return true;
    const remaining = [...steps.slice(index + 1), ...laterCallbacks.flatMap(item => item.steps)];
    return writes.some(key => containsStringValue(remaining, key));
  });
  return retained.length === sequence.steps.length ? sequence : { steps: retained };
}

function containsStringValue(value: unknown, expected: string): boolean {
  if (value === expected) return true;
  if (Array.isArray(value)) return value.some(child => containsStringValue(child, expected));
  if (value === null || typeof value !== 'object') return false;
  return Object.values(value).some(child => containsStringValue(child, expected));
}

function projectEntityAssignments(
  launch: ProjectileLaunchActionSource,
  sourcePath: string,
): Readonly<Record<string, CompiledActionValueOperandSource>> {
  if (!launch.assignEntityBlackboard || launch.assignments.length === 0) return {};
  return Object.fromEntries(
    launch.assignments.map((assignment, index) => {
      if (!assignment.targetKey.startsWith('EntityBB_')) {
        throw new Error(
          `${sourcePath}.assignPairs[${index}]: projectile entity assignment requires an EntityBB_ target`,
        );
      }
      if (!assignment.useDirectValue) {
        return [
          assignment.targetKey,
          { kind: 'blackboard', key: assignment.inputValueKey },
        ] as const;
      }
      if (assignment.valueType !== 'Numeric') {
        throw new Error(
          `${sourcePath}.assignPairs[${index}]: projectile entity assignment requires a numeric value`,
        );
      }
      return [assignment.targetKey, { kind: 'constant', value: assignment.numericValue }] as const;
    }),
  );
}

function numericInitialValues(
  values: readonly DeclaredBlackboardValueSource[],
  sourcePath: string,
  entity = false,
): Readonly<Record<string, number>> {
  const result: Record<string, number> = Object.create(null);
  for (const value of values) {
    if (
      typeof value.value !== 'number' ||
      !Number.isFinite(value.value) ||
      Object.hasOwn(result, value.key) ||
      (entity && !value.key.startsWith('EntityBB_'))
    )
      throw new Error(
        `${sourcePath}: unsupported or duplicate blackboard initial value ${value.key}`,
      );
    // 动态声明也必须保留初值；不能因它不是编译期常量而删掉。
    result[value.key] = value.value;
  }
  return result;
}
