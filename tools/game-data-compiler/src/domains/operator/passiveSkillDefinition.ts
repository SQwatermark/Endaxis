import type { OperatorPassiveSkillDefinition } from '../../../../../packages/game-data-contract/src/index.ts';
import type { CompiledPassiveSkillDefinitionSource } from '../../compiler/passiveSkillBatch.ts';
import type { PassiveSkillCompileRequestSource } from '../../compiler/passiveSkillRequest.ts';
import {
  materializePassiveBuffInstallation,
  materializePassiveSkillInstallation,
} from '../../compiler/passiveSkillInstallation.ts';

interface PlannedPassiveSkill {
  readonly key: string;
  readonly buffs: readonly {
    readonly buffId: string;
    readonly assignments: Readonly<Record<string, number>>;
  }[];
}

export interface CompiledOperatorUpgradePassiveSkillsSource {
  readonly definitions: readonly OperatorPassiveSkillDefinition[];
  readonly buffIds: readonly string[];
  readonly handledSourcePaths: readonly string[];
}

/**
 * 把同一天赋/潜能各等级的 AddPassiveSkill 请求合并成一个等级化安装定义。
 * 这里只接受无事件、无时间轴、无 Toggle、无卡面修正的 AddBuff 形态；其余机制必须先独立取证。
 */
export function compileOperatorUpgradePassiveSkills(
  effectIds: readonly string[],
  requests: readonly PassiveSkillCompileRequestSource[],
  definitions: readonly CompiledPassiveSkillDefinitionSource[],
): CompiledOperatorUpgradePassiveSkillsSource {
  const definitionById = new Map(definitions.map(item => [item.skillId, item]));
  const levelPlans = effectIds.map(effectId =>
    requests
      .filter(request => request.originId === effectId)
      .map(request => planPassiveSkill(request, definitionById)),
  );
  const identities = levelPlans.map(plan =>
    JSON.stringify(
      plan.map(passive => [
        passive.key,
        passive.buffs.map(buff => [buff.buffId, Object.keys(buff.assignments).sort()]),
      ]),
    ),
  );
  if (identities.some(identity => identity !== identities[0])) {
    throw new Error('operator passive SkillData installation structure changes between levels');
  }
  const definitionsOutput = (levelPlans[0] ?? []).map((passive, passiveIndex) => {
    const blackboard: Record<string, number | readonly number[]> = {};
    const usedKeys = new Set<string>();
    const steps = passive.buffs.map((buff, buffIndex) => {
      const blackboardAssignments: Record<string, { kind: 'blackboard'; key: string }> = {};
      for (const targetKey of Object.keys(buff.assignments).sort()) {
        if (usedKeys.has(targetKey)) {
          throw new Error(
            `${passive.key}: duplicate passive Buff assignment key ${JSON.stringify(targetKey)}`,
          );
        }
        usedKeys.add(targetKey);
        const values = levelPlans.map(
          level => level[passiveIndex]!.buffs[buffIndex]!.assignments[targetKey]!,
        );
        blackboard[targetKey] = values.length === 1 ? values[0]! : values;
        blackboardAssignments[targetKey] = { kind: 'blackboard', key: targetKey };
      }
      return {
        kind: 'applyBuff' as const,
        parameters: {
          buffId: buff.buffId,
          target: 'caster' as const,
          inheritSourceSkillCastInfo: false,
          ...(Object.keys(blackboardAssignments).length === 0 ? {} : { blackboardAssignments }),
        },
      };
    });
    return {
      key: passive.key,
      ...(Object.keys(blackboard).length === 0 ? {} : { blackboard }),
      enableSequence: { steps },
    } satisfies OperatorPassiveSkillDefinition;
  });
  return {
    definitions: definitionsOutput,
    buffIds: [
      ...new Set(levelPlans.flatMap(level => level.flatMap(item => item.buffs.map(b => b.buffId)))),
    ],
    handledSourcePaths: requests
      .filter(request => effectIds.includes(request.originId))
      .map(request => request.sourcePath),
  };
}

function planPassiveSkill(
  request: PassiveSkillCompileRequestSource,
  definitions: ReadonlyMap<string, CompiledPassiveSkillDefinitionSource>,
): PlannedPassiveSkill {
  if (request.activeConditionIds?.length) {
    throw new Error(`${request.sourcePath}: conditioned operator passive SkillData is unsupported`);
  }
  const compiled = definitions.get(request.skillId);
  if (!compiled)
    throw new Error(`${request.sourcePath}: missing passive SkillData ${request.skillId}`);
  const skill = compiled.definition.skill;
  if (
    skill.passiveType !== 'AddBuff' ||
    skill.toggleBuffs.length > 0 ||
    compiled.definition.hasCardAttributeModifiers ||
    skill.actionGraph.actionGroup.timelineActions.length > 0 ||
    skill.actionGraph.actionGroup.passiveEvents.length > 0
  ) {
    throw new Error(`${request.sourcePath}: unsupported operator passive SkillData program`);
  }
  const installation = materializePassiveSkillInstallation(request, compiled);
  return {
    key: request.skillId,
    buffs: skill.startupBuffs.map(buff => {
      const materialized = materializePassiveBuffInstallation(buff, installation.blackboard);
      const assignments: Record<string, number> = {};
      for (const [key, value] of Object.entries(materialized.blackboardAssignments)) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          throw new Error(`${request.sourcePath}: unresolved passive Buff assignment ${key}`);
        }
        assignments[key] = value;
      }
      return { buffId: materialized.buffId, assignments };
    }),
  };
}
