import {
  COMBO_SKILL_PRIORITIES,
  DAMAGE_ELEMENTS,
  OPERATOR_ATTRIBUTES,
  OPERATOR_RARITIES,
  OPERATOR_ROLES,
  OPERATOR_WEAPON_TYPES,
  type OperatorDefinition,
  type OperatorPassiveSkillDefinition,
} from './operatorDefinition';
import { listOperatorSkillDefinitionBindings } from './operatorSkillDefinitions';
import { validateComboSkillConditions } from './validateComboSkillConditions';
import {
  validateAbilityEntityDefinition,
  validateActionSequenceDefinition,
  validateLevelValuesDefinition,
  validateSkillDefinition,
  type SkillDefinitionValidationIssue,
} from './validateSkillDefinition';

function push(issues: SkillDefinitionValidationIssue[], path: string, message: string): void {
  issues.push({ path, message });
}

function validatePassiveSkill(
  passive: OperatorPassiveSkillDefinition,
  path: string,
  issues: SkillDefinitionValidationIssue[],
): void {
  if (passive.key.length === 0) push(issues, `${path}.key`, 'expected a non-empty string');
  for (const [key, values] of Object.entries(passive.blackboard ?? {})) {
    if (key.length === 0) push(issues, `${path}.blackboard`, 'expected a non-empty blackboard key');
    issues.push(
      ...validateLevelValuesDefinition(values, `${path}.blackboard.${JSON.stringify(key)}`),
    );
  }
  issues.push(
    ...validateActionSequenceDefinition(passive.enableSequence, `${path}.enableSequence`),
  );
}

/**
 * 校验一份已进入公共 TypeScript 契约的完整干员定义。
 *
 * 不可信 JSON 的形状仍由项目加载校验负责；这里检查跨根集合、全部技能执行定义以及根级行为程序，
 * 供项目模板命令和编辑器共同调用，避免两处各维护一份“看起来像”的干员校验。
 */
export function validateOperatorDefinition(
  definition: OperatorDefinition,
  path = '$',
): SkillDefinitionValidationIssue[] {
  const issues: SkillDefinitionValidationIssue[] = [];
  for (const [field, value] of [
    ['slug', definition.slug],
    ['gameId', definition.gameId],
  ] as const) {
    if (value.length === 0) push(issues, `${path}.${field}`, 'expected a non-empty string');
  }
  if (definition.displayName !== undefined && definition.displayName.length === 0)
    push(issues, `${path}.displayName`, 'expected a non-empty string');
  if (definition.assetSlug !== undefined && definition.assetSlug.length === 0)
    push(issues, `${path}.assetSlug`, 'expected a non-empty string');
  if (!(OPERATOR_RARITIES as readonly unknown[]).includes(definition.rarity))
    push(issues, `${path}.rarity`, 'expected a known operator rarity');
  if (!(OPERATOR_WEAPON_TYPES as readonly unknown[]).includes(definition.weaponType))
    push(issues, `${path}.weaponType`, 'expected a known weapon type');
  if (!(DAMAGE_ELEMENTS as readonly unknown[]).includes(definition.element))
    push(issues, `${path}.element`, 'expected a known damage element');
  if (!(OPERATOR_ROLES as readonly unknown[]).includes(definition.role))
    push(issues, `${path}.role`, 'expected a known operator role');
  for (const [field, value] of [
    ['mainAttribute', definition.mainAttribute],
    ['secondaryAttribute', definition.secondaryAttribute],
  ] as const) {
    if (!(OPERATOR_ATTRIBUTES as readonly unknown[]).includes(value))
      push(issues, `${path}.${field}`, 'expected a known operator attribute');
  }
  if (
    definition.defaultPotential !== undefined &&
    (!Number.isInteger(definition.defaultPotential) || definition.defaultPotential < 0)
  )
    push(issues, `${path}.defaultPotential`, 'expected a non-negative integer');

  const attributeFields = [...OPERATOR_ATTRIBUTES, 'baseAttack', 'baseHealth'] as const;
  let attributeLevelCount: number | null = null;
  for (const field of attributeFields) {
    const values = definition.attributes[field];
    if (values.length === 0)
      push(issues, `${path}.attributes.${field}`, 'expected a non-empty level array');
    values.forEach((value, index) => {
      if (!Number.isFinite(value))
        push(issues, `${path}.attributes.${field}[${index}]`, 'expected a finite number');
    });
    attributeLevelCount ??= values.length;
    if (values.length !== attributeLevelCount)
      push(issues, `${path}.attributes.${field}`, `expected ${attributeLevelCount} level values`);
  }
  if (definition.trustAttributeBonus !== undefined) {
    definition.trustAttributeBonus.values.forEach((value, index) => {
      if (!Number.isFinite(value))
        push(issues, `${path}.trustAttributeBonus.values[${index}]`, 'expected a finite number');
    });
    definition.trustAttributeBonus.attributes.forEach((attribute, index) => {
      if (
        attribute !== 'main' &&
        attribute !== 'secondary' &&
        !(OPERATOR_ATTRIBUTES as readonly unknown[]).includes(attribute)
      )
        push(
          issues,
          `${path}.trustAttributeBonus.attributes[${index}]`,
          'expected a known operator attribute selector',
        );
    });
  }

  const groupKeys = new Set<string>();
  const skillIdentities = new Set<string>();
  for (const group of definition.skillGroups) {
    const groupPath = `${path}.skillGroups[${definition.skillGroups.indexOf(group)}]`;
    if (group.key.length === 0) push(issues, `${groupPath}.key`, 'expected a non-empty string');
    if (groupKeys.has(group.key))
      push(issues, `${groupPath}.key`, `duplicate group key '${group.key}'`);
    groupKeys.add(group.key);
  }
  for (const { group, skill, origin, variant } of listOperatorSkillDefinitionBindings(definition)) {
    const groupIndex = definition.skillGroups.indexOf(group);
    const identity = `${group.key}\u0000${skill.key}`;
    const skillPath =
      origin === 'variant'
        ? `${path}.skillGroups[${groupIndex}].variants[${group.variants?.indexOf(variant!) ?? -1}].skills['${skill.key}']`
        : `${path}.skillGroups[${groupIndex}].${origin}Skills['${skill.key}']`;
    if (skillIdentities.has(identity))
      push(issues, skillPath, `duplicate skill identity '${group.key}/${skill.key}'`);
    skillIdentities.add(identity);
    issues.push(...validateSkillDefinition(skill, skillPath));
  }

  issues.push(
    ...validateComboSkillConditions(
      definition.comboSkillConditions,
      `${path}.comboSkillConditions`,
    ),
  );
  const comboSkillKeys = new Set(
    listOperatorSkillDefinitionBindings(definition)
      .filter(({ skill }) => skill.skillType === 'comboSkill')
      .map(({ skill }) => skill.key),
  );
  for (const [index, condition] of (definition.comboSkillConditions ?? []).entries()) {
    if (!comboSkillKeys.has(condition.skillKey))
      push(
        issues,
        `${path}.comboSkillConditions[${index}].skillKey`,
        `unknown combo skill '${condition.skillKey}'`,
      );
  }

  for (const [id, entity] of Object.entries(definition.abilityEntityDefinitions ?? {}))
    issues.push(
      ...validateAbilityEntityDefinition(
        entity,
        `${path}.abilityEntityDefinitions[${JSON.stringify(id)}]`,
      ),
    );

  (definition.passiveSkills ?? []).forEach((passive, index) =>
    validatePassiveSkill(passive, `${path}.passiveSkills[${index}]`, issues),
  );
  (definition.eventHandlers ?? []).forEach((handler, index) => {
    const handlerPath = `${path}.eventHandlers[${index}]`;
    if (handler.key.length === 0) push(issues, `${handlerPath}.key`, 'expected a non-empty string');
    issues.push(...validateActionSequenceDefinition(handler.sequence, `${handlerPath}.sequence`));
  });
  for (const collection of ['talents', 'potentials'] as const) {
    definition[collection].forEach((upgrade, index) => {
      const upgradePath = `${path}.${collection}[${index}]`;
      if (upgrade.key.length === 0)
        push(issues, `${upgradePath}.key`, 'expected a non-empty string');
      if (!Number.isInteger(upgrade.levels) || upgrade.levels < 1)
        push(issues, `${upgradePath}.levels`, 'expected a positive integer');
      if (upgrade.initializationSequence !== undefined)
        issues.push(
          ...validateActionSequenceDefinition(
            upgrade.initializationSequence,
            `${upgradePath}.initializationSequence`,
          ),
        );
      (upgrade.passiveSkills ?? []).forEach((passive, passiveIndex) =>
        validatePassiveSkill(passive, `${upgradePath}.passiveSkills[${passiveIndex}]`, issues),
      );
      (upgrade.eventHandlers ?? []).forEach((handler, handlerIndex) => {
        const handlerPath = `${upgradePath}.eventHandlers[${handlerIndex}]`;
        for (const [key, values] of Object.entries(handler.blackboard ?? {}))
          issues.push(
            ...validateLevelValuesDefinition(
              values,
              `${handlerPath}.blackboard.${JSON.stringify(key)}`,
            ),
          );
        issues.push(
          ...validateActionSequenceDefinition(handler.sequence, `${handlerPath}.sequence`),
        );
      });
    });
  }

  for (const [key, value] of Object.entries(definition.entityBlackboard ?? {})) {
    if (key.length === 0) push(issues, `${path}.entityBlackboard`, 'expected a non-empty key');
    if (typeof value === 'number' && !Number.isFinite(value))
      push(issues, `${path}.entityBlackboard.${JSON.stringify(key)}`, 'expected a finite number');
  }
  if (
    definition.comboSkillPriority !== undefined &&
    !(COMBO_SKILL_PRIORITIES as readonly unknown[]).includes(definition.comboSkillPriority)
  )
    push(issues, `${path}.comboSkillPriority`, 'expected a native combo priority');

  return issues;
}
