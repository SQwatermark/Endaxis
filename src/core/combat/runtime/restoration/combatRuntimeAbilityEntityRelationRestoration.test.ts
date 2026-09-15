import { expect, it, vi } from 'vitest';
import type { CompiledAbilityEntityChildSkillProgram } from '../../../compiler/combatProgram';
import type { BuffOperationTarget } from '../../buffs/buffOperationExecutor';
import { CombatBuffContainer } from '../../buffs/combatBuffs';
import { CombatAttributeSet } from '../../attributes/combatAttributes';
import { AbilityEntityChildSkillPrograms } from '../../abilities/abilityEntityChildSkillPrograms';
import { AbilityEntityChildSkillRuntime } from '../../abilities/abilityEntityChildSkillRuntime';
import { CombatSemanticEventRuntime } from '../../events/combatSemanticEventRuntime';
import { bindRestoredCombatRuntimeAbilityEntityRelations } from './combatRuntimeAbilityEntityRelationRestoration';
import { LogicalAbilityEntityRuntime } from '../../abilities/logicalAbilityEntityRuntime';

const childProgram = {
  skillId: 'pulse',
  initialBlackboard: {},
  timelineActions: [
    {
      startFrame: 1,
      sequence: {
        steps: [
          {
            kind: 'modifyActionValue',
            parameters: {
              key: 'count',
              operation: 'add',
              value: { kind: 'constant', value: 1 },
            },
          },
        ],
      },
    },
  ],
} satisfies CompiledAbilityEntityChildSkillProgram;

it('统一恢复能力实体子技能和直属子 Buff，且不重放子技能开始', () => {
  const programs = new AbilityEntityChildSkillPrograms();
  const binding = programs.register(childProgram);
  const original = new LogicalAbilityEntityRuntime({});
  const entity = original.spawn({
    abilityEntityId: 'orb',
    ownerId: 'operator',
    source: { kind: 'operator', operatorId: 'operator' },
    definition: {
      lifetime: { kind: 'infinite' },
      childSkill: { skillId: childProgram.skillId },
    },
  });
  const originalChild = new AbilityEntityChildSkillRuntime(childProgram, {
    entity,
    entityBlackboard: original.entityBlackboard(entity),
    operations: { execute: () => true, evaluate: () => true },
    ownerOperatorId: 'operator',
    programId: binding.id,
    damageSnapshotProgram: binding.damageSnapshots,
  });
  originalChild.start();
  original.runtimeState.instances
    .get(entity.instanceId)!
    .childSkills.push(originalChild.runtimeState);
  const reference = { ownerId: 'ability-entity:1', instanceId: 4 };
  original.addChildBuff(entity, { reference, finish: () => true });

  const restoredRuntime = new LogicalAbilityEntityRuntime({
    restoredState: structuredClone(original.runtimeState),
  });
  const finish = vi.fn(() => true);
  const execute = vi.fn(() => true);
  const target = Object.assign(
    new CombatBuffContainer(reference.ownerId, new CombatAttributeSet<string>()),
    {
      resolveHandle: () => ({ reference, finish }),
    },
  ) satisfies BuffOperationTarget;
  const entities = {
    runtime: restoredRuntime,
    targets: new Map([[reference.ownerId, target]]),
  };
  const relations = bindRestoredCombatRuntimeAbilityEntityRelations({
    foundation: { semanticEvents: new CombatSemanticEventRuntime() } as never,
    entities,
    operators: {
      programs: new Map([
        [
          'operator',
          {
            operatorId: 'operator',
            skills: [],
            abilityEntityDefinitions: {
              orb: {
                lifetime: { kind: 'infinite' },
                childSkill: childProgram,
              },
            },
          },
        ],
      ]),
    } as never,
    childSkillPrograms: programs,
    createPassiveOperations: () => {
      throw new Error('fixture has no passives');
    },
    registerPassive: () => {
      throw new Error('fixture has no passive subscriptions');
    },
    createChildSkillBindings: () => ({
      operations: { execute, evaluate: () => true },
    }),
  });

  expect(execute).not.toHaveBeenCalled();
  restoredRuntime.advanceFrame();
  expect(execute).toHaveBeenCalledOnce();
  restoredRuntime.finish(entity);
  expect(finish).toHaveBeenCalledExactlyOnceWith('other', null);
  relations.disposePassives();
});
