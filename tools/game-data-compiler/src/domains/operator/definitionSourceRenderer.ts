type RecordValue = Readonly<Record<string, unknown>>;

interface RenderContext {
  readonly helpers: Set<string>;
}

interface RawExpression {
  readonly rawExpression: string;
}

/**
 * 将整名编译器的结构化结果渲染成与旧生成器一致的声明式源码。
 * 这里只恢复机械 DSL（调度、序列、步骤和技能黑板），不重新解释游戏规则。
 */
export function renderOperatorDefinitionSource(input: {
  readonly operator: RecordValue;
  readonly commonBuffDefinitions: RecordValue;
}): string {
  const context: RenderContext = { helpers: new Set() };
  const operator = { ...input.operator };
  const skillDeclarations: string[] = [];
  const renderedSkills = new Map<string, string>();
  const registerSkill = (skillValue: unknown, path: string): RawExpression => {
    const skill = requireRecord(skillValue, path);
    const key = requireString(skill.key, `${path}.key`);
    const identifier = `${toIdentifier(requireString(operator.slug, 'operator.slug'))}${upperFirst(toIdentifier(key))}`;
    const signature = JSON.stringify(skill);
    const previous = renderedSkills.get(key);
    if (previous !== undefined) {
      if (previous !== signature) throw new Error(`conflicting rendered operator skill ${key}`);
      return raw(identifier);
    }
    renderedSkills.set(key, signature);
    skillDeclarations.push(
      `export const ${identifier}: SkillDefinition = ${renderSkill(skill, context)};`,
    );
    return raw(identifier);
  };
  const registerSkills = (value: unknown, path: string): RawExpression | RawExpression[] =>
    Array.isArray(value)
      ? value.map((skill, index) => registerSkill(skill, `${path}[${index}]`))
      : registerSkill(value, path);
  const skillGroups = requireArray(operator.skillGroups, 'operator.skillGroups').map(
    (groupValue, groupIndex) => {
      const group = requireRecord(groupValue, `operator.skillGroups[${groupIndex}]`);
      const groupPath = `operator.skillGroups[${groupIndex}]`;
      return {
        ...group,
        skills: registerSkills(group.skills, `${groupPath}.skills`),
        ...(Array.isArray(group.variants)
          ? {
              variants: group.variants.map((variantValue, variantIndex) => {
                const variant = requireRecord(
                  variantValue,
                  `${groupPath}.variants[${variantIndex}]`,
                );
                return {
                  ...variant,
                  skills: registerSkills(
                    variant.skills,
                    `${groupPath}.variants[${variantIndex}].skills`,
                  ),
                };
              }),
            }
          : {}),
        ...(Array.isArray(group.replacementSkills)
          ? {
              replacementSkills: group.replacementSkills.map((skill, index) =>
                registerSkill(skill, `${groupPath}.replacementSkills[${index}]`),
              ),
            }
          : {}),
        ...(Array.isArray(group.routedReplacementSkills)
          ? {
              routedReplacementSkills: group.routedReplacementSkills.map(
                (routeValue, routeIndex) => {
                  const route = requireRecord(
                    routeValue,
                    `${groupPath}.routedReplacementSkills[${routeIndex}]`,
                  );
                  return {
                    ...route,
                    skill: registerSkill(
                      route.skill,
                      `${groupPath}.routedReplacementSkills[${routeIndex}].skill`,
                    ),
                  };
                },
              ),
            }
          : {}),
      };
    },
  );
  operator.skillGroups = skillGroups;

  const commonBuffs = renderValue(input.commonBuffDefinitions, context);
  const renderedOperator = renderValue(operator, context);
  const helperImport = [...context.helpers].sort().join(', ');
  return `/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
${helperImport ? `import { ${helperImport} } from '../../definitionHelpers';\n` : ''}
${skillDeclarations.join('\n\n')}

export const commonBuffDefinitions = ${commonBuffs} as const satisfies OperatorBuffDefinitions;

export default ${renderedOperator} as const satisfies OperatorDefinition;
`;
}

function renderSkill(skill: RecordValue, context: RenderContext): string {
  if (!hasOwn(skill, 'blackboard')) return renderValue(skill, context);
  const { blackboard, ...definition } = skill;
  context.helpers.add('withSkillBlackboard');
  return `withSkillBlackboard(${renderValue(definition, context)}, ${renderValue(blackboard, context)})`;
}

function renderValue(value: unknown, context: RenderContext, property?: string): string {
  if (isRaw(value)) return value.rawExpression;
  if (value === null || typeof value === 'boolean' || typeof value === 'string')
    return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('cannot render non-finite number');
    if (property === 'attackScale') {
      context.helpers.add('percentage');
      return `percentage(${renderNumber(value * 100)})`;
    }
    return renderNumber(value);
  }
  if (Array.isArray(value)) {
    if (property === 'attackScale' && value.every(item => typeof item === 'number')) {
      context.helpers.add('percentages');
      return `percentages([${value.map(item => renderNumber(item * 100)).join(', ')}])`;
    }
    return `[${value.map(item => renderValue(item, context)).join(', ')}]`;
  }
  const record = requireRecord(value, 'rendered value');
  const helper = renderHelper(record, context);
  if (helper !== null) return helper;
  return `{${Object.entries(record)
    .map(([key, item]) => `${JSON.stringify(key)}: ${renderValue(item, context, key)}`)
    .join(', ')}}`;
}

function renderHelper(value: RecordValue, context: RenderContext): string | null {
  const keys = Object.keys(value);
  if (sameKeys(keys, ['steps'])) {
    context.helpers.add('sequence');
    return `sequence(${requireArray(value.steps, 'sequence.steps')
      .map(step => renderValue(step, context))
      .join(', ')})`;
  }
  if (
    keys.every(key => ['startFrame', 'endFrame', 'sequence'].includes(key)) &&
    hasOwn(value, 'startFrame') &&
    hasOwn(value, 'sequence')
  ) {
    context.helpers.add('scheduled');
    const args = [renderValue(value.startFrame, context), renderValue(value.sequence, context)];
    if (hasOwn(value, 'endFrame')) args.push(renderValue(value.endFrame, context));
    return `scheduled(${args.join(', ')})`;
  }
  if (typeof value.kind !== 'string' || !hasOwn(value, 'parameters')) return null;
  const parameters = requireRecord(value.parameters, `${value.kind}.parameters`);
  if (value.kind === 'conditional' && hasOwn(value, 'whenTrue')) {
    context.helpers.add('branch');
    const { condition, alwaysNext, ...unexpected } = parameters;
    if (Object.keys(unexpected).length || condition === undefined) return null;
    const args = [renderValue(condition, context), renderValue(value.whenTrue, context)];
    if (hasOwn(value, 'whenFalse')) args.push(renderValue(value.whenFalse, context));
    else if (alwaysNext === true) args.push('undefined');
    if (alwaysNext === true) args.push('{ alwaysNext: true }');
    return `branch(${args.join(', ')})`;
  }
  if (
    value.kind === 'once' &&
    sameKeys(Object.keys(parameters), ['scopeKey']) &&
    hasOwn(value, 'body')
  )
    return callHelper('once', [parameters.scopeKey, value.body], context);
  if (value.kind === 'repeatEachTick' && keys.length === 3 && hasOwn(value, 'body'))
    return callHelper('repeatEachTick', [value.body], context);
  if (
    value.kind === 'forEachContextTarget' &&
    sameKeys(Object.keys(parameters), ['contextKey']) &&
    hasOwn(value, 'body')
  )
    return callHelper('forEachContextTarget', [parameters.contextKey, value.body], context);
  if (value.kind === 'withActionBlackboardScope' && hasOwn(value, 'body')) {
    const {
      scopeKey,
      lifetime,
      alwaysNext,
      initialValues,
      inheritParent,
      entityInitialValues,
      ...unexpected
    } = parameters;
    if (
      Object.keys(unexpected).length === 0 &&
      scopeKey !== undefined &&
      initialValues !== undefined &&
      inheritParent !== undefined
    ) {
      const args = [scopeKey, initialValues, inheritParent, value.body];
      if (entityInitialValues !== undefined || lifetime !== undefined || alwaysNext === true)
        args.push(entityInitialValues === undefined ? raw('undefined') : entityInitialValues);
      if (lifetime !== undefined || alwaysNext === true)
        args.push({
          ...(lifetime === undefined ? {} : { lifetime }),
          ...(alwaysNext === true ? { alwaysNext: true } : {}),
        });
      return callHelper('withActionBlackboardScope', args, context);
    }
  }
  if (keys.every(key => ['kind', 'parameters', 'key'].includes(key))) {
    context.helpers.add('step');
    const args: unknown[] = [value.kind, parameters];
    if (hasOwn(value, 'key')) args.push(value.key);
    return `step(${args.map(item => renderValue(item, context)).join(', ')})`;
  }
  return null;
}

function callHelper(name: string, args: readonly unknown[], context: RenderContext): string {
  context.helpers.add(name);
  return `${name}(${args.map(value => renderValue(value, context)).join(', ')})`;
}

function renderNumber(value: number): string {
  return String(Number(value.toPrecision(15)));
}

function raw(rawExpression: string): RawExpression {
  return { rawExpression };
}

function isRaw(value: unknown): value is RawExpression {
  return typeof value === 'object' && value !== null && 'rawExpression' in value;
}

function hasOwn(value: RecordValue, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function sameKeys(actual: readonly string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && expected.every(key => actual.includes(key));
}

function requireRecord(value: unknown, path: string): RecordValue {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error(`${path}: expected object`);
  return value as RecordValue;
}

function requireArray(value: unknown, path: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new Error(`${path}: expected array`);
  return value;
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== 'string' || !value) throw new Error(`${path}: expected string`);
  return value;
}

function toIdentifier(value: string): string {
  const parts = value.split(/[^A-Za-z0-9_$]+/).filter(Boolean);
  const result = parts.map((part, index) => (index ? upperFirst(part) : part)).join('');
  if (!/^[$A-Z_a-z]/.test(result)) return `_${result}`;
  return result;
}

function upperFirst(value: string): string {
  return value ? value[0]!.toUpperCase() + value.slice(1) : value;
}
