import type { PassiveSkillCompileRequestSource } from '../domains/passiveDiscovery.ts';
import { requireNonNegativeInteger } from '../source/primitives.ts';
import type { CompiledPassiveSkillDefinitionSource } from './passiveSkillBatch.ts';
import { selectSkillBlackboardLevel } from './skillBlackboard.ts';

export interface MaterializedPassiveSkillInstallationSource {
  readonly originKind: PassiveSkillCompileRequestSource['originKind'];
  readonly originId: string;
  readonly sourcePath: string;
  readonly skillId: string;
  readonly level: number;
  readonly patchApplied: boolean;
  readonly blackboard: Readonly<Record<string, number>>;
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
