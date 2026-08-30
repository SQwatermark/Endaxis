import type { ComboSkillRegistrationDefinition } from '../../../../../packages/game-data-contract/src/skills.ts';
import type { GameplayTagRegistry } from '../../source/nativeGameplayTags.ts';
import { projectGameplayTags } from '../../compiler/combatProjectionCommon.ts';
import {
  requireArray,
  requireBoolean,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
} from '../../source/primitives.ts';

/** 严格读取产品层连携入口；触发条件来自 manifest，不从技能名或动作文本反推。 */
export function parseOperatorComboSkillRegistrationsSource(
  value: unknown,
  sourcePath: string,
  skillKeys: ReadonlySet<string>,
  gameplayTagRegistry: GameplayTagRegistry,
): readonly ComboSkillRegistrationDefinition[] | undefined {
  if (value === undefined) return undefined;
  const rows = requireArray(value, sourcePath);
  if (rows.length === 0) throw new Error(`${sourcePath}: expected non-empty array`);
  const seen = new Set<string>();
  return rows.map((raw, index) => {
    const path = `${sourcePath}[${index}]`;
    const row = requireRecord(raw, path);
    requireAllowedFields(
      row,
      new Set(['skillKey', 'priority', 'blackboard', 'invalidCastBlackboard', 'rules']),
      path,
    );
    const skillKey = requireNonEmptyString(row.skillKey, `${path}.skillKey`);
    if (!skillKeys.has(skillKey)) throw new Error(`${path}.skillKey: expected an active skill key`);
    if (seen.has(skillKey)) throw new Error(`${path}.skillKey: duplicate registration`);
    seen.add(skillKey);
    const priority = requireNonEmptyString(row.priority, `${path}.priority`);
    if (priority !== 'default' && priority !== 'firstBlackboard' && priority !== 'enemyRank')
      throw new Error(`${path}.priority: unsupported combo priority ${JSON.stringify(priority)}`);
    const rules = requireArray(row.rules, `${path}.rules`);
    if (rules.length === 0) throw new Error(`${path}.rules: expected non-empty array`);
    return {
      skillKey,
      priority,
      ...(row.blackboard === undefined
        ? {}
        : { blackboard: numericBlackboard(row.blackboard, `${path}.blackboard`) }),
      ...(row.invalidCastBlackboard === undefined
        ? {}
        : {
            invalidCastBlackboard: numericBlackboard(
              row.invalidCastBlackboard,
              `${path}.invalidCastBlackboard`,
            ),
          }),
      rules: rules.map((rawRule, ruleIndex) => {
        const rulePath = `${path}.rules[${ruleIndex}]`;
        const rule = requireRecord(rawRule, rulePath);
        requireAllowedFields(
          rule,
          new Set(['trigger', 'condition', 'blackboard', 'castImmediately']),
          rulePath,
        );
        const trigger = requireRecord(rule.trigger, `${rulePath}.trigger`);
        const kind = requireNonEmptyString(trigger.kind, `${rulePath}.trigger.kind`);
        const fields =
          kind === 'damageTagHit'
            ? ['kind', 'tag', 'scope']
            : kind === 'elementalInflictionApplied'
              ? ['kind', 'elements', 'scope']
              : kind === 'physicalInflictionApplied'
                ? ['kind', 'types', 'scope']
                : null;
        if (fields === null) throw new Error(`${rulePath}.trigger.kind: unsupported combo trigger`);
        requireAllowedFields(trigger, new Set(fields), `${rulePath}.trigger`, true);
        const scope = requireNonEmptyString(trigger.scope, `${rulePath}.trigger.scope`);
        if (scope !== 'operator' && scope !== 'team')
          throw new Error(`${rulePath}.trigger.scope: unsupported trigger scope`);
        const payloadKey =
          kind === 'damageTagHit'
            ? 'tag'
            : kind === 'elementalInflictionApplied'
              ? 'elements'
              : 'types';
        requireNonEmptyString(trigger[payloadKey], `${rulePath}.trigger.${payloadKey}`);
        const condition =
          rule.condition === undefined
            ? undefined
            : projectComboCondition(
                requireRecord(rule.condition, `${rulePath}.condition`),
                `${rulePath}.condition`,
                gameplayTagRegistry,
              );
        return {
          trigger: trigger as ComboSkillRegistrationDefinition['rules'][number]['trigger'],
          ...(condition === undefined ? {} : { condition }),
          ...(rule.blackboard === undefined
            ? {}
            : { blackboard: numericBlackboard(rule.blackboard, `${rulePath}.blackboard`) }),
          ...(rule.castImmediately === undefined
            ? {}
            : {
                castImmediately: requireBoolean(
                  rule.castImmediately,
                  `${rulePath}.castImmediately`,
                ),
              }),
        };
      }),
    };
  });
}

function projectComboCondition(
  condition: Readonly<Record<string, unknown>>,
  path: string,
  gameplayTagRegistry: GameplayTagRegistry,
): NonNullable<ComboSkillRegistrationDefinition['rules'][number]['condition']> {
  if (condition.kind !== 'buffStackCompare') {
    return condition as NonNullable<ComboSkillRegistrationDefinition['rules'][number]['condition']>;
  }
  requireAllowedFields(
    condition,
    new Set(['kind', 'target', 'tagQueryType', 'buffTagIds', 'operator', 'value']),
    path,
    true,
  );
  const target = requireNonEmptyString(condition.target, `${path}.target`);
  const tagQueryType = requireNonEmptyString(condition.tagQueryType, `${path}.tagQueryType`);
  const operator = requireNonEmptyString(condition.operator, `${path}.operator`);
  if (target !== 'enemy') throw new Error(`${path}.target: unsupported combo Buff target`);
  if (!['hasAny', 'hasAll', 'exceptAny', 'exceptAll'].includes(tagQueryType))
    throw new Error(`${path}.tagQueryType: unsupported GameplayTag query`);
  if (!['equal', 'notEqual', 'greater', 'greaterOrEqual', 'less', 'lessOrEqual'].includes(operator))
    throw new Error(`${path}.operator: unsupported comparison`);
  const value = requireRecord(condition.value, `${path}.value`);
  requireAllowedFields(value, new Set(['kind', 'value']), `${path}.value`, true);
  if (value.kind !== 'constant') throw new Error(`${path}.value.kind: expected constant`);
  const tagIds = requireArray(condition.buffTagIds, `${path}.buffTagIds`).map((item, index) =>
    requireNumber(item, `${path}.buffTagIds[${index}]`),
  );
  return {
    kind: 'buffStackCompare',
    target,
    tagQueryType: tagQueryType as 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll',
    buffTags: projectGameplayTags(tagIds, { gameplayTagRegistry }, `${path}.buffTagIds`),
    operator: operator as
      'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual',
    value: { kind: 'constant', value: finiteNumber(value.value, `${path}.value.value`) },
  };
}

function numericBlackboard(value: unknown, path: string): Readonly<Record<string, number>> {
  const record = requireRecord(value, path);
  return Object.fromEntries(
    Object.entries(record).map(([key, item]) => [key, finiteNumber(item, `${path}.${key}`)]),
  );
}

function finiteNumber(value: unknown, path: string): number {
  const number = requireNumber(value, path);
  if (!Number.isFinite(number)) throw new Error(`${path}: expected finite number`);
  return number;
}

function requireAllowedFields(
  value: Readonly<Record<string, unknown>>,
  allowed: ReadonlySet<string>,
  path: string,
  exact = false,
): void {
  const actual = Object.keys(value);
  if (actual.some(field => !allowed.has(field)) || (exact && actual.length !== allowed.size))
    throw new Error(`${path}: unexpected fields ${JSON.stringify(actual.sort())}`);
}
