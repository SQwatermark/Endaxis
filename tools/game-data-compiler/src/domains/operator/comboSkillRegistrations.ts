import type { ComboSkillRegistrationDefinition } from '../../../../../packages/game-data-contract/src/skills.ts';
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
        if (rule.condition !== undefined) requireRecord(rule.condition, `${rulePath}.condition`);
        return {
          trigger: trigger as ComboSkillRegistrationDefinition['rules'][number]['trigger'],
          ...(rule.condition === undefined
            ? {}
            : {
                condition: rule.condition as NonNullable<
                  ComboSkillRegistrationDefinition['rules'][number]['condition']
                >,
              }),
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
