import { describe, expect, it } from 'vitest';
import { unityComboConditionFixture } from '../../../../tools/game-data-compiler/test/unityComboConditionFixture.ts';
import { parseUnityComboSkillConditionsSource } from '../../../../tools/game-data-compiler/src/source/unityComboSkillConditions.ts';
import { parseAbilitySystemBlackboardsSource } from '../../../../tools/game-data-compiler/src/source/abilitySystemBlackboards.ts';
import { compileAbilitySystemBlackboardsSource } from '../../../../tools/game-data-compiler/src/compiler/abilitySystemBlackboards.ts';
import { compileComboSkillConditionDefinitionSource } from '../../../../tools/game-data-compiler/src/compiler/comboSkillConditions.ts';
import { perlica } from '../../data/operators/perlica';
import { createGameDataRepository } from '../../data/gameDataRepository';
import { elementalAttachments } from '../../data/buffs/elementalAttachments';
import { skillSettings } from '../../data/combat/skillSettings';
import { createEmptyProject } from '../project/createProject';
import {
  deriveProjectOperatorTemplate,
  getProjectDefinitionLibrary,
  createProjectGameDataRepository,
} from '../project/projectDefinitionLibrary';
import { serializeProjectDocument, parseProjectDocument } from '../project/serialization';
import { placeSkillGroup } from '../../ui/timeline/placeSkillGroup';
import { validateComboSkillConditions } from '../game-data/validateComboSkillConditions';
import type {
  ComboSkillConditionDefinition,
  OperatorDefinition,
  SkillDefinition,
} from '../game-data/operatorDefinition';
import { compileScenarioRuntimeAssembly } from './compileScenarioRuntimeAssembly';
import { compileScenarioEnemy } from './compileScenarioEnemy';
import { StandardPlayerDamageEnvironment } from '../combat/runtime/standardPlayerDamageEnvironment';
import { createEnemyCombatVitals } from '../combat/runtime/combatVitalsFactory';
import { CombatRuntimeAssembly } from '../combat/runtime/combatRuntimeAssembly';

function template(
  element: 'heat' | 'electric' | 'cryo' | 'nature',
  deckGate: number,
): OperatorDefinition {
  const pair = (key: string, valueDouble = 0) => ({
    key,
    valueDouble,
    valueStr: '',
    isDynamic: true,
  });
  // 已取证的最小黑板切片；仅 deckGate 按测试构筑取 0/1。其余技能/面板是测试载体，不冒充完整诀转换。
  const blackboards = compileAbilitySystemBlackboardsSource(
    parseAbilitySystemBlackboardsSource(
      {
        entityBlackboard: [
          pair('EntityBB_consumed_type'),
          pair('EntityBB_consumed_layer'),
          pair('EntityBB_ult_hit'),
          pair('EntityBB_wisd_greater_will', deckGate),
        ],
        skillDataBundle: {
          enableComboSkillBlackboard: true,
          comboSkillBlackboard: [pair('consumed_layer'), pair('consumed_type')],
        },
      },
      'fixture.abilitySystem',
    ),
  );
  const fixture = unityComboConditionFixture();
  const projections = parseUnityComboSkillConditionsSource(
    fixture.conditions,
    fixture.references,
    'fixture.combo',
  ).conditions.map((source, index) =>
    compileComboSkillConditionDefinitionSource(
      source,
      blackboards,
      { key: `condition:${index}`, skillGroupKey: 'comboSkill' },
      {
        actionOwnerTarget: 'caster',
        actionSourceTarget: 'caster',
        actionTargetTarget: 'eventTarget',
      },
    ),
  );
  const definitions: unknown = projections.map(result => result.definition);
  expect(validateComboSkillConditions(definitions)).toEqual([]);
  // 仅在公共严格结构校验后进入正式定义类型；不会将审计 source 一起塞进项目。
  const comboSkillConditions = definitions as readonly ComboSkillConditionDefinition[];
  return {
    ...perlica,
    comboSkillRegistrations: [],
    entityBlackboard: blackboards.entityInitialValues,
    comboSkillConditions,
    skillGroups: perlica.skillGroups.map(group =>
      group.key === 'comboSkill'
        ? {
            ...group,
            skills: { ...(group.skills as SkillDefinition), cooldownFrames: 300, costFrame: 0 },
          }
        : group.key !== 'battleSkill'
          ? group
          : {
              ...group,
              skills: {
                ...(group.skills as SkillDefinition),
                costs: [],
                costFrame: undefined,
                cooldownFrames: undefined,
                timelineBlockFrames: 1,
                scheduledSequences: [
                  {
                    startFrame: 0,
                    sequence: {
                      steps: [
                        {
                          kind: 'applyElementalInfliction',
                          parameters: { element, isExtra: false },
                        },
                      ],
                    },
                  },
                ],
              },
            },
    ),
  };
}

describe('原生条件经正式项目定义进入实际附着', () => {
  it.each(['heat', 'electric', 'cryo', 'nature'] as const)(
    '%s 来源→模板持久化→场景→未放置连携条件→连续附着',
    element => {
      for (const deckGate of [0, 1]) {
        const definition = template(element, deckGate);
        const base = createGameDataRepository({ revision: 'fixture', operators: [perlica] });
        const project = deriveProjectOperatorTemplate(
          createEmptyProject({ createdWith: 'test', gameDataRevision: base.revision }),
          {
            id: 'project:operator:native-combo',
            name: 'native combo fixture',
            baseTemplateId: perlica.slug,
            definition,
          },
        );
        let scenario = project.scenarios[0]!;
        const persisted =
          getProjectDefinitionLibrary(project).operators['project:operator:native-combo']!
            .definition;
        scenario.tracks[0] = {
          id: 'owner',
          operator: {
            operatorSlug: persisted.slug,
            level: 90,
            promoted: true,
            potential: 0,
            trustLevel: 4,
            talentStates: {},
            skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          },
          weapon: null,
          gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
          initialState: { ultimateEnergy: 0 },
          skillCasts: [],
        };
        let nextId = 0;
        for (const startFrame of [0, 2])
          scenario = placeSkillGroup({
            scenario,
            trackIndex: 0,
            operator: persisted,
            skillGroupKey: 'battleSkill',
            startFrame,
            ids: { allocate: kind => `${kind}:${++nextId}` },
          }).scenario;
        project.scenarios[0] = scenario;
        const loaded = parseProjectDocument(serializeProjectDocument(project));
        if (!loaded.ok) throw new Error(JSON.stringify(loaded));
        const restoredScenario = loaded.value.scenarios[0]!;
        const repository = createProjectGameDataRepository(
          base,
          getProjectDefinitionLibrary(loaded.value),
        );
        const environment = new StandardPlayerDamageEnvironment({
          criticalSamples: { nextCriticalSample: () => 1 },
          resolveNonRandomRuntimeSnapshot: () => ({
            runtimeExtensionMultiplier: 1,
            appliesIgniteDamageMultiplier: false,
            appliesPhysicalInflictionDamageMultiplier: false,
          }),
          enemyVitals: createEnemyCombatVitals(compileScenarioEnemy(restoredScenario.enemy)),
          elementalInflictionDocument: elementalAttachments,
          spellInflictionSettings: skillSettings,
        });
        const pending: string[] = [];
        const compiled = compileScenarioRuntimeAssembly(restoredScenario, {
          index: repository,
          resources: {
            sharedSpGain: { baseGainEfficiency: 1 },
            spRecoveryPauseDuration: 1.5,
            ultimateEnergySystemUnlocked: true,
            normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
          },
          environment: {
            ...environment.runtimeOptions,
            comboConditionEligibility: { isAlive: () => true, isSilenced: () => false },
            onPendingComboCondition: (operatorId, program, value) => {
              expect(operatorId).toBe('owner');
              expect(value.assignPairs).toEqual({ consumed_layer: 0, consumed_type: 0 });
              expect(value.inputTarget).toEqual({ kind: 'operator', operatorId: 'owner' });
              expect(value.triggerTarget).toEqual({ kind: 'enemy' });
              pending.push(program.key);
            },
          },
        });
        expect(compiled.operators[0]!.comboConditionPrograms).toHaveLength(5);
        expect(compiled.operators[0]!.skills.some(skill => skill.skillType === 'comboSkill')).toBe(
          false,
        );
        const assembly = new CombatRuntimeAssembly(compiled);
        expect(pending).toEqual([
          ...(element === 'nature' ? ['condition:0'] : []),
          ...(deckGate === 0 ? ['condition:4'] : []),
        ]);
        pending.length = 0;
        assembly.simulation.advanceFrames(2);
        expect(pending).toEqual([
          `condition:${{ nature: 0, heat: 1, electric: 2, cryo: 3 }[element]}`,
          ...(deckGate === 0 ? ['condition:4'] : []),
        ]);
        expect(
          environment.runtimeOptions.createOperatorBuffRuntime!(
            'owner',
          )!.entityBlackboard!.getNumber('EntityBB_consumed_type'),
        ).toBe(deckGate === 0 ? { heat: 0, electric: 1, cryo: 2, nature: 3 }[element] : 0);
        assembly.disposeComboSkillConditions();
      }
    },
  );
});
