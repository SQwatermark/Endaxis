/**
 * combat-spec 生成物进入元素附着运行时的唯一数据边界。
 * 导入时必须严格校验，不能用默认值掩盖生成器与核心契约的结构漂移。
 */
import { parseCombatBuffDefinitionsDocument } from '../../core/combat/buffs/combatBuffDefinitions';
import rawDefinitions from './elemental-attachments.combat-1.4.4.json';
import { compoundStatusFactories } from './compoundStatusFactories';

const CONDUCT_DAMAGE_MODIFIERS = ['heat', 'electric', 'cryo', 'nature'].map(damageType => ({
  enabledSide: 'defender',
  condition: { kind: 'eventDamageTypesMatch', damageTypes: [damageType] },
  processors: [
    {
      kind: 'damageScale',
      side: 'defender',
      zone: 'normal',
      addition: { blackboardKey: 'final_spell_resistance_decrease' },
    },
  ],
}));

function conductStatus(
  id: string,
  consumedElement: 'heat' | 'cryo' | 'nature',
): Record<string, unknown> {
  return {
    id,
    presentation: {
      visible: true,
      iconId: 'icon_battle_conduct',
      showInHeadBarCommon: true,
      showInHeadBarAttached: false,
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'SpellAbnormal',
      abnormalColorType: 'Pulse',
      orderPriority: {
        useDirectoryValue: false,
        value: 0,
        category: 'AttachedAndAbnormal',
      },
    },
    stackingType: 'stack',
    stackingKey: 'pulse_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTags: ["Skill/Character/Common/SpellStatus/Conduct"],
    blackboard: {
      atk_scale: 0,
      consumed_layer: 0,
      count: 0,
      duration: 15,
      final_spell_resistance_decrease: 0,
      spell_resistance_decrease: 0,
    },
    damageModifiers: CONDUCT_DAMAGE_MODIFIERS,
    role: { kind: 'compoundStatus', consumedElement, incomingElement: 'electric' },
    actions: {
      start: [
        {
          kind: 'storeAttributeValue',
          target: 'source',
          attribute: { kind: 'specific', key: 'electricAbnormalDamageIncrease' },
          stage: 'finalNonConverted',
          useFloor: false,
          divisor: 1,
          multiplier: { blackboardKey: 'spell_resistance_decrease' },
          base: { blackboardKey: 'spell_resistance_decrease' },
          targetKey: 'final_spell_resistance_decrease',
        },
        compoundDamage('electric', 'electricAbnormal'),
      ],
    },
  };
}

function compoundDamage(
  damageType: 'heat' | 'electric' | 'cryo' | 'nature',
  tag: 'fireAbnormal' | 'electricAbnormal' | 'cryoAbnormal' | 'natureAbnormal',
  attackScaleKey = 'atk_scale',
  canCritical = true,
): Record<string, unknown> {
  return {
    kind: 'dealAttackScaledDamage',
    damageType,
    attackScale: { blackboardKey: attackScaleKey },
    tags: [tag],
    features: attackScaleKey === 'burning_atk_scale' ? ['dot'] : [],
    canCritical,
  };
}

const STATUS_PRESENTATION = {
  heat: { iconId: 'icon_battle_burning', abnormalColorType: 'Fire' },
  cryo: { iconId: 'icon_battle_frozen', abnormalColorType: 'Cryst' },
  nature: { iconId: 'icon_battle_corrupt', abnormalColorType: 'Natural' },
} as const;

function visibleCompoundPresentation(element: keyof typeof STATUS_PRESENTATION) {
  return {
    visible: true,
    ...STATUS_PRESENTATION[element],
    showInHeadBarCommon: true,
    showInHeadBarAttached: false,
    showInSquadIcon: false,
    onlyShowForMainCharacter: false,
    iconStyleInSquad: 'SpellAbnormal',
    orderPriority: {
      useDirectoryValue: false,
      value: 0,
      category: 'AttachedAndAbnormal',
    },
  };
}

function frozenStatus(
  id: string,
  consumedElement: 'heat' | 'electric' | 'nature',
): Record<string, unknown> {
  return {
    id,
    presentation: visibleCompoundPresentation('cryo'),
    stackingType: 'stack',
    stackingKey: 'cryst_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ["Skill/Character/Common/SpellStatus/Frozen"],
    blackboard: {
      atk_scale: 0,
      consumed_layer: 0,
      count: 0,
      duration: 5,
      final_phy_dmg_up: 0,
      phy_dmg_up: 0,
      shatter_dmg: 0,
    },
    role: { kind: 'compoundStatus', consumedElement, incomingElement: 'cryo' },
    actions: {
      start: [
        compoundDamage('cryo', 'cryoAbnormal'),
        {
          kind: 'simulationNoEffect',
          reason: 'enemyWeaknessWindowRequiresEnemyActiveBehavior',
          nativeActionType: 'ForceTriggerWeakness',
        },
      ],
    },
  };
}

function burningStatus(
  id: string,
  consumedElement: 'electric' | 'cryo' | 'nature',
): Record<string, unknown> {
  return {
    id,
    presentation: visibleCompoundPresentation('heat'),
    stackingType: 'stack',
    stackingKey: 'fire_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 9999,
    applyTags: ["Skill/Character/Common/SpellStatus/Burning"],
    blackboard: {
      atk_scale: 0,
      burning_atk_scale: 0,
      consumed_layer: 0,
      count: 0,
      duration: 10,
    },
    role: { kind: 'compoundStatus', consumedElement, incomingElement: 'heat' },
    actions: {
      start: [compoundDamage('heat', 'fireAbnormal')],
      trigger: [compoundDamage('heat', 'fireAbnormal', 'burning_atk_scale', false)],
    },
  };
}

const CORROSION_ATTRIBUTE_MODIFIERS = [
  'PhysicalResistance',
  'FireResistance',
  'PulseResistance',
  'CrystResistance',
  'NaturalResistance',
].flatMap(attribute => [
  { attribute, slot: 'baseAddition', value: { blackboardKey: 'def_decrease' } },
  { attribute, slot: 'baseAddition', value: { blackboardKey: 'additional_def_decrease' } },
]);

function corrosionStatus(
  id: string,
  consumedElement: 'heat' | 'electric' | 'cryo',
): Record<string, unknown> {
  return {
    id,
    presentation: visibleCompoundPresentation('nature'),
    stackingType: 'stack',
    stackingKey: 'natural_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: -1,
    applyTags: ["Skill/Character/Common/SpellStatus/Corrupt"],
    blackboard: {
      additional_def_decrease: 0,
      atk_scale: 0,
      consumed_layer: 0,
      consumed_type: 0,
      count: 0,
      def_decrease: 0,
      def_decrease_tick: 0,
      duration: 15,
      max_def_decrease: 0,
      start_def_decrease: 0,
      tick: 0,
    },
    attributeModifiers: CORROSION_ATTRIBUTE_MODIFIERS,
    role: { kind: 'compoundStatus', consumedElement, incomingElement: 'nature' },
    actions: {
      start: [
        compoundDamage('nature', 'natureAbnormal'),
        {
          kind: 'modifyBlackboard',
          operation: 'assign',
          targetKey: 'def_decrease',
          value: { blackboardKey: 'start_def_decrease' },
        },
        { kind: 'refreshAttributeModifierValues' },
      ],
      trigger: [
        {
          kind: 'modifyBlackboard',
          operation: 'add',
          targetKey: 'def_decrease',
          value: { blackboardKey: 'def_decrease_tick' },
        },
        // 原始链在递减后再次 CompareFloat，越过下限时 Assign max_def_decrease。
        {
          kind: 'clampBlackboard',
          targetKey: 'def_decrease',
          minimum: { blackboardKey: 'max_def_decrease' },
        },
        { kind: 'refreshAttributeModifierValues' },
      ],
    },
  };
}

function allCompoundStatuses(): readonly Record<string, unknown>[] {
  return compoundStatusFactories.factories.map(factory => {
    const id = factory.createdBuff.buffId;
    const consumed = factory.consumedElement;
    switch (factory.incomingElement) {
      case 'electric':
        return conductStatus(id, consumed as 'heat' | 'cryo' | 'nature');
      case 'cryo':
        return frozenStatus(id, consumed as 'heat' | 'electric' | 'nature');
      case 'heat':
        return burningStatus(id, consumed as 'electric' | 'cryo' | 'nature');
      case 'nature':
        return corrosionStatus(id, consumed as 'heat' | 'electric' | 'cryo');
    }
  });
}

const definitionsWithConduct = {
  ...rawDefinitions,
  buffs: [...rawDefinitions.buffs, ...allCompoundStatuses()],
};

/** 由 combat-spec 生成；此处校验用于防止结构漂移进入运行时。 */
export const elementalAttachments = parseCombatBuffDefinitionsDocument(definitionsWithConduct);
