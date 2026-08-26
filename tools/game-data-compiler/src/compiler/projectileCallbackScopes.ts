import type { DeclaredBlackboardValueSource } from '../source/blackboard.ts';
import type {
  ProjectileLaunchActionSource,
  ProjectileSkillCallbackSource,
} from '../source/referenceActions.ts';
import type {
  CompiledBuffSequenceSource,
  CompiledBuffStepSource,
} from './buffRuntimeProjection.ts';

export interface CompiledActionBlackboardScopeSource {
  readonly kind: 'withActionBlackboardScope';
  readonly parameters: {
    readonly scopeKey: string;
    readonly lifetime: 'execution';
    readonly alwaysNext?: boolean;
    readonly initialValues: Readonly<Record<string, number>>;
    readonly inheritParent: boolean;
    readonly entityInitialValues?: Readonly<Record<string, number>>;
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
}): CompiledActionBlackboardScopeSource {
  const { sourcePath, launch, template, invocations } = input;
  if (template === null)
    throw new Error(`${sourcePath}: projectile entity blackboard evidence is missing`);
  if (template.projectileId !== launch.projectileId)
    throw new Error(`${sourcePath}: projectile template identity mismatch`);
  if (launch.assignEntityBlackboard)
    throw new Error(`${sourcePath}: projectile entity blackboard assignments are not projected`);
  const routes = new Map<ProjectileSkillCallbackSource['event'], string>();
  for (const callback of launch.callbacks) {
    if (!callback.enabled) continue;
    if (callback.skillId.length === 0 || routes.has(callback.event))
      throw new Error(`${sourcePath}: invalid enabled projectile callback ${callback.event}`);
    routes.set(callback.event, callback.skillId);
  }
  const skills = new Set<string>();
  const steps: CompiledBuffStepSource[] = invocations.map(invocation => {
    if (routes.get(invocation.event) !== invocation.skillId)
      throw new Error(
        `${sourcePath}: callback ${invocation.event} does not match the enabled native route`,
      );
    if (skills.has(invocation.skillId))
      throw new Error(
        `${sourcePath}: repeated callback skill requires dynamic restoration semantics`,
      );
    skills.add(invocation.skillId);
    return {
      kind: 'withActionBlackboardScope',
      parameters: {
        scopeKey: `${sourcePath}:${invocation.skillId}`,
        lifetime: 'execution',
        alwaysNext: true,
        initialValues: numericInitialValues(invocation.declaredBlackboard, sourcePath),
        inheritParent: true,
      },
      body: invocation.sequence,
    } satisfies CompiledActionBlackboardScopeSource;
  });
  return {
    kind: 'withActionBlackboardScope',
    parameters: {
      scopeKey: `${sourcePath}:${launch.projectileId}`,
      lifetime: 'execution',
      initialValues: {},
      inheritParent: launch.assignBlackboard,
      entityInitialValues: numericInitialValues(template.entityBlackboard, sourcePath, true),
    },
    body: { steps },
  };
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
