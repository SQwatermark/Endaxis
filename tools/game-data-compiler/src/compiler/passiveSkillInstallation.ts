import type { PassiveSkillCompileRequestSource } from './passiveSkillRequest.ts';
import { requireNonNegativeInteger } from '../source/primitives.ts';
import type { CompiledPassiveSkillDefinitionSource } from './passiveSkillBatch.ts';
import { selectSkillBlackboardLevel } from './skillBlackboard.ts';
import type { SkillBuffInstallSource } from '../source/skillBuffInstall.ts';

/** 服务端被动可能在客户端 SkillData/SkillPatch 之外注入的运行时黑板值。 */
export interface UnresolvedPassiveSkillBlackboardValueSource {
  readonly kind: 'unresolvedSkillBlackboard';
  readonly key: string;
}

export interface MaterializedPassiveBuffInstallationSource {
  readonly buffId: string;
  readonly blackboardAssignments: Readonly<
    Record<string, number | string | UnresolvedPassiveSkillBlackboardValueSource>
  >;
}

export interface MaterializedPassiveSkillInstallationSource {
  readonly originKind: PassiveSkillCompileRequestSource['originKind'];
  readonly originId: string;
  readonly sourcePath: string;
  readonly skillId: string;
  readonly level: number;
  readonly patchApplied: boolean;
  readonly blackboard: Readonly<Record<string, number>>;
  readonly activeConditionIds?: readonly string[];
}

/**
 * 把共享被动定义实例化为一次领域安装。等级选择完成后才覆盖运行时输入黑板，顺序与原生
 * CardSkill._Init 一致；武器等级依赖具体构筑，调用方必须显式提供，不能使用模板或星级猜测。
 */
export function materializePassiveSkillInstallation(
  request: PassiveSkillCompileRequestSource,
  compiled: CompiledPassiveSkillDefinitionSource,
  resolvedWeaponLevel?: number,
): MaterializedPassiveSkillInstallationSource {
  if (request.skillId !== compiled.skillId) {
    throw new Error(
      `${request.sourcePath}: request skill ${JSON.stringify(request.skillId)} does not match compiled definition ${JSON.stringify(compiled.skillId)}`,
    );
  }
  const requestedLevel = resolveRequestedLevel(request, resolvedWeaponLevel);
  const selected = selectSkillBlackboardLevel(compiled.definition.blackboard, requestedLevel);
  return {
    originKind: request.originKind,
    originId: request.originId,
    sourcePath: request.sourcePath,
    skillId: request.skillId,
    level: selected.level,
    patchApplied: selected.patchApplied,
    blackboard: { ...selected.values, ...request.inputBlackboard },
    ...(request.activeConditionIds === undefined
      ? {}
      : { activeConditionIds: [...request.activeConditionIds] }),
  };
}

/**
 * 依据一次被动安装已经选定的动作黑板物化 CreateBuff 参数。
 * 未出现在客户端补丁中的服务端值保留身份，交给领域场景投影判断是否会被实际读取。
 */
export function materializePassiveBuffInstallation(
  source: SkillBuffInstallSource,
  blackboard: Readonly<Record<string, number>>,
): MaterializedPassiveBuffInstallationSource {
  if (!source.assignBlackboard) return { buffId: source.buffId, blackboardAssignments: {} };
  return {
    buffId: source.buffId,
    blackboardAssignments: Object.fromEntries(
      source.assignments.map(assignment => {
        if (assignment.useDirectValue) {
          return [
            assignment.targetKey,
            assignment.valueType === 'Numeric' ? assignment.numericValue : assignment.stringValue,
          ];
        }
        const value = blackboard[assignment.inputValueKey];
        return [
          assignment.targetKey,
          value ?? {
            kind: 'unresolvedSkillBlackboard' as const,
            key: assignment.inputValueKey,
          },
        ];
      }),
    ),
  };
}

function resolveRequestedLevel(
  request: PassiveSkillCompileRequestSource,
  resolvedWeaponLevel: number | undefined,
): number | null {
  switch (request.levelSource.kind) {
    case 'nativeDefault':
      return null;
    case 'equipmentSuitThreshold':
      return request.levelSource.level;
    case 'weaponProgression':
      if (resolvedWeaponLevel === undefined) {
        throw new Error(`${request.sourcePath}: resolved weapon skill level is required`);
      }
      return requireNonNegativeInteger(resolvedWeaponLevel, `${request.sourcePath}.resolvedLevel`);
  }
}
