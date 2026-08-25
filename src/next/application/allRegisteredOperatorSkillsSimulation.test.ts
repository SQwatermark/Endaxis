import { describe, expect, it } from 'vitest';

import type { OperatorDefinition, SkillDefinition } from '../core/game-data/operatorDefinition';
import { createEmptyScenario } from '../core/project/createProject';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { skillSettings } from '../data/combat/skillSettings';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { perlica } from '../data/operators/perlica';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';

interface RegisteredSkillPlacementCase {
  readonly operator: OperatorDefinition;
  readonly groupKey: string;
  readonly variantKey?: string;
  readonly skill: SkillDefinition;
}

const cases: readonly RegisteredSkillPlacementCase[] = nextGameDataRepository
  .getOperators()
  .flatMap(operator =>
    operator.skillGroups.flatMap(group => [
      ...asSkills(group.skills).map(skill => ({ operator, groupKey: group.key, skill })),
      ...(group.variants ?? []).flatMap(variant =>
        asSkills(variant.skills).map(skill => ({
          operator,
          groupKey: group.key,
          variantKey: variant.key,
          skill,
        })),
      ),
    ]),
  );

const resources = {
  sharedSpGain: { baseGainEfficiency: 1 },
  spRecoveryPauseDuration: 1.5,
  ultimateEnergySystemUnlocked: true,
  normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
} as const;

/**
 * 已复现并完成首轮归因、但尚未闭合的基础构筑失败边界。
 * 新失败不能自动进入此表；已修复项也必须从表中删除，否则“预期失败”会反向让门禁报错。
 */
const knownFailures: Readonly<Record<string, string>> = {
  'arcane/comboSkill/base/comboSkill':
    "ability event 'beforeTakeDamage' has multiple actions at unresolved priority 0",
  'yvonne/basicAttack/enhancedBasicAttack/ultimateAttackEnd':
    "target context group 'robots' is missing",
  'ardelia/plungingAttack/base/plungingAttack': "target context group 'Sheep' is missing",
};

describe('所有正式干员技能逐项放置与模拟', () => {
  it('覆盖默认仓库中的每个干员和每个基础/变体技能', () => {
    expect(nextGameDataRepository.getOperators()).toHaveLength(30);
    expect(cases).toHaveLength(301);
    expect(Object.keys(knownFailures)).toHaveLength(3);
    expect(
      new Set(
        cases.map(
          entry =>
            `${entry.operator.slug}/${entry.groupKey}/${entry.variantKey ?? '-'}/${entry.skill.key}`,
        ),
      ).size,
    ).toBe(cases.length);
    expect(
      Object.keys(knownFailures).every(identity =>
        cases.some(entry => skillIdentity(entry) === identity),
      ),
    ).toBe(true);
  });

  it.each(cases)(
    '$operator.slug / $groupKey / $variantKey / $skill.key 可以在最小合法上下文中放上时间轴并跑完整模拟',
    async ({ operator, groupKey, variantKey, skill }) => {
      const scenario = createEmptyScenario(
        `audit:${operator.slug}:${groupKey}:${variantKey ?? 'base'}:${skill.key}`,
        '全技能运行门禁',
      );
      scenario.battle.durationFrames = 3600;
      scenario.enemy.editable.hp = 1_000_000_000;
      scenario.battle.resourceRules = {
        maxSp: 1000,
        initialSp: 1000,
        spRecoveryPerSecond: 100,
        defaultSkillSpCost: 100,
      };
      scenario.tracks[0] = {
        id: `track:${operator.slug}`,
        operator: {
          operatorSlug: operator.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: Object.fromEntries(operator.talents.map((_, index) => [index, 0])),
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 1000, maxUltimateEnergyOverride: 1000 },
        skillCasts: [],
      };
      scenario.tracks[1] = {
        id: 'track:audit-teammate',
        operator: {
          operatorSlug: perlica.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: Object.fromEntries(perlica.talents.map((_, index) => [index, 0])),
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      const identity = skillIdentity({ operator, groupKey, variantKey, skill });
      const placementContext = placeRequiredSkillContext(scenario, identity, operator);
      const placed = placeSkillGroup({
        scenario: placementContext.scenario,
        trackIndex: 0,
        operator,
        skillGroupKey: groupKey,
        ...(variantKey === undefined ? {} : { variantKey }),
        skillKey: skill.key,
        startFrame: placementContext.startFrame,
        ids: {
          allocate: kind =>
            `${kind}:${operator.slug}:${groupKey}:${variantKey ?? 'base'}:${skill.key}`,
        },
      }).scenario;
      const service = new ScenarioSimulationService({
        index: nextGameDataRepository,
        repositoryRevision: `${nextGameDataRepository.revision}:all-skill-placement-audit`,
        resources,
        elementalInflictionDocument: elementalAttachments,
        spellInflictionSettings: skillSettings,
      });

      const expectedFailure = knownFailures[identity];
      if (expectedFailure !== undefined) {
        await expect(service.simulate(placed, 3600)).rejects.toThrow(expectedFailure);
      } else {
        await expect(service.simulate(placed, 3600)).resolves.toBeDefined();
      }
    },
  );
});

function asSkills(value: SkillDefinition | readonly SkillDefinition[]): readonly SkillDefinition[] {
  return 'key' in value ? [value] : value;
}

function skillIdentity(entry: RegisteredSkillPlacementCase): string {
  return `${entry.operator.slug}/${entry.groupKey}/${entry.variantKey ?? 'base'}/${entry.skill.key}`;
}

/** 只登记已有来源与生产回归证明的阶段前置，不为缺键技能猜造输入。 */
function placeRequiredSkillContext(
  scenario: ReturnType<typeof createEmptyScenario>,
  identity: string,
  operator: OperatorDefinition,
): { scenario: ReturnType<typeof createEmptyScenario>; startFrame: number } {
  if (identity !== 'rossi/comboSkill/base/comboSkill3') {
    return { scenario, startFrame: 1 };
  }
  return {
    scenario: placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator,
      skillGroupKey: 'comboSkill',
      skillKey: 'comboSkill2',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:rossi:comboSkill2:qte-prerequisite` },
    }).scenario,
    // 既有生产回归证明此帧位于第一段创建的 0.5 秒 QTE 有效计时 Buff 内。
    startFrame: 55,
  };
}
