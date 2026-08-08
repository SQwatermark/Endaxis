import { describe, expect, it } from 'vitest';
import { perlica } from '../../../data/operators/perlica';
import { compileSkill } from '../../compiler/compileSkill';
import type { SkillDefinition } from '../../game-data/operatorDefinition';
import type { ExistingElementalAttachment } from '../infliction/elementalInfliction';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeSnapshot,
} from '../damage/damageScaleAttributes';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatResources } from './combatResources';
import { CombatSimulation } from './combatSimulation';
import { CombatVitals } from './combatVitals';
import { ElementalInflictionOperationExecutor } from './elementalInflictionOperationExecutor';
import { PlayerDamageOperationExecutor } from './playerDamageOperationExecutor';
import { SkillResourceOperationExecutor } from './skillResourceOperationExecutor';
import { SkillRuntime, type CombatOperationExecutor } from './skillRuntime';

function findPerlicaBattleSkill(): SkillDefinition {
  const group = perlica.skillGroups.find(candidate => candidate.key === 'battleSkill');
  if (group === undefined) throw new Error('missing Perlica battle-skill group');
  const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
  const skill = skills.find(candidate => candidate.key === 'battleSkill');
  if (skill === undefined) throw new Error('missing Perlica battle skill');
  return skill;
}

describe('Perlica standard damage slice', () => {
  it('orders cost, infliction, health damage, poise damage, and energy gain', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const resources = new CombatResources({
      sp: 100,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.1, otherGainPerSp: 0.2 },
      squad: [
        {
          operatorId: 'perlica',
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          canGainUntaggedUltimateEnergy: true,
        },
      ],
    });
    const targetVitals = new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 100,
      poise: 100,
      poiseRecoveryTime: 1,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const unresolvedOperations: CombatOperationExecutor = {
      execute: step => {
        throw new Error(`unexpected unresolved operation '${step.kind}'`);
      },
      evaluate: () => false,
    };
    const damageOperations = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals,
      clock,
      receipt,
      captureAttributeSnapshots: () => ({
        attacker: {
          ...(Object.fromEntries(
            DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, 0]),
          ) as unknown as DamageScaleAttributeSnapshot),
          attack: 100,
          criticalRate: 0,
          criticalDamageIncrease: 0.5,
          weaknessDamageMultiplier: 1,
          igniteDamageMultiplier: 1,
          physicalInflictionDamageMultiplier: 1,
        },
        defender: {
          ...(Object.fromEntries(
            DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, 0]),
          ) as unknown as DamageScaleAttributeSnapshot),
          defense: 0,
          shelterDamageMultiplier: 0,
          breakingAttackDamageTakenMultiplier: 1,
          resistances: {
            physical: { percent: 0, damageTakenMultiplier: 1 },
            heat: { percent: 0, damageTakenMultiplier: 1 },
            electric: { percent: 0, damageTakenMultiplier: 1 },
            cryo: { percent: 0, damageTakenMultiplier: 1 },
            nature: { percent: 0, damageTakenMultiplier: 1 },
            ether: { percent: 0, damageTakenMultiplier: 1 },
          },
        },
      }),
      resolveRuntimeSnapshot: () => ({
        criticalSample: 1,
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: () => undefined,
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
      emitPreparationEvent: () => undefined,
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: unresolvedOperations,
    });
    let attachment: ExistingElementalAttachment | null = null;
    const inflictionOperations = new ElementalInflictionOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      skillId: 'battleSkill',
      clock,
      receipt,
      getExistingAttachment: () => attachment,
      applyOperation: operation => {
        if (operation.kind !== 'addAttachment') {
          throw new Error(`unexpected first-infliction operation '${operation.kind}'`);
        }
        attachment = { element: operation.element, layers: 1 };
      },
      emitSourceEvent: () => undefined,
      emitTargetEvent: () => undefined,
      delegate: damageOperations,
    });
    let runtime: SkillRuntime;
    const operations = new SkillResourceOperationExecutor({
      sourceOperatorId: 'perlica',
      skillId: 'battleSkill',
      clock,
      resources,
      receipt,
      getNonReturnedSpCost: () => runtime.nonReturnedSpCost,
      delegate: inflictionOperations,
    });
    runtime = new SkillRuntime(
      compileSkill({
        operatorId: 'perlica',
        skillGroupKey: 'battleSkill',
        skillType: 'battleSkill',
        skillLevel: 12,
        skill: findPerlicaBattleSkill(),
      }),
      { clock, resources, receipt, operations, allocateSkillCastId: () => 1 },
    );
    const simulation = new CombatSimulation(clock);
    simulation.add(runtime);

    expect(runtime.tryStart()).toBe(true);
    simulation.advanceFrames(13);

    expect(targetVitals.health).toBe(600);
    expect(targetVitals.poise).toBe(90);
    expect(attachment).toEqual({ element: 'electric', layers: 1 });
    expect(resources.sp).toBe(0);
    expect(resources.getUltimateEnergy('perlica')).toBe(10);
    expect(
      receipt.entries
        .filter(entry =>
          [
            'SkillCostApplied',
            'ElementalInflictionApplied',
            'DamageApplied',
            'PoiseApplied',
            'UltimateEnergyChanged',
          ].includes(entry.event),
        )
        .map(entry => entry.event),
    ).toEqual([
      'SkillCostApplied',
      'ElementalInflictionApplied',
      'DamageApplied',
      'PoiseApplied',
      'UltimateEnergyChanged',
    ]);
  });
});
