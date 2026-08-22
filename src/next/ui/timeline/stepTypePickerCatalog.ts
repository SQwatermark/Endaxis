import type { EditableCombatStepKind } from './skillDefinitionEditorViewModel';

export type StepTypeGroupKey = 'time' | 'combat' | 'effects' | 'values' | 'flow';

export interface StepTypeGroup {
  readonly key: StepTypeGroupKey;
  readonly kinds: readonly EditableCombatStepKind[];
}

/**
 * 编辑器的信息架构分组。这里只整理步骤的编辑入口，不改变编译或运行时语义。
 * 测试会保证每个可编辑步骤恰好出现一次。
 */
export const STEP_TYPE_GROUPS: readonly StepTypeGroup[] = [
  {
    key: 'time',
    kinds: ['startTimeDilation', 'startUltimateTimeDilation', 'createTimedMarker'],
  },
  {
    key: 'combat',
    kinds: [
      'dealDamage',
      'dealFixedDamage',
      'dealStagger',
      'heal',
      'applyElementalInfliction',
      'applyElementalReaction',
      'consumeElementalReaction',
    ],
  },
  {
    key: 'effects',
    kinds: [
      'spawnAbilityEntity',
      'applyBuff',
      'readBuffBlackboard',
      'readBuffStackCount',
      'finishBuffsByTag',
      'finishBuffsById',
      'holdBuffsById',
      'adjustSkillCooldown',
      'applyStatus',
      'consumeStatus',
    ],
  },
  {
    key: 'values',
    kinds: [
      'modifyActionValue',
      'calculateActionValue',
      'changeResource',
      'changeResourceByActionValue',
      'gainSquadUltimateEnergyFromSkillCost',
      'gainFinisherSp',
      'setContextFlag',
    ],
  },
  {
    key: 'flow',
    kinds: [
      'outputAirborne',
      'outputKnockDown',
      'openComboWindow',
      'listenForCombatEvents',
      'conditional',
      'once',
    ],
  },
];
