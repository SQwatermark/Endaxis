import { parseOperatorRuntimeTemplateSource } from '../../source/operatorRuntimeTemplate.ts';
import { parseSkillCastMetadataSource } from '../../source/activeSkill.ts';
import { compileAbilitySystemBlackboardsSource } from '../../compiler/abilitySystemBlackboards.ts';
import { compileComboSkillConditionDefinitionSource } from '../../compiler/comboSkillConditions.ts';
import { compileSkillSmartTargetSource } from '../../compiler/comboSmartTarget.ts';
import { requireNonEmptyString } from '../../source/primitives.ts';

/** 迁移期角色常驻环境产物；不重复编译旧主动动作，也不依赖运行时加载原始导出。 */
export function compileOperatorRuntimeDefinitionSource(
  template: unknown,
  comboSkill: unknown,
  binding: { readonly operatorSlug: string; readonly skillGroupKey: string },
) {
  const source = parseOperatorRuntimeTemplateSource(template, 'characterTemplate');
  const cast = parseSkillCastMetadataSource(comboSkill, 'comboSkill');
  if (source.comboSkillId !== cast.skillId)
    throw new Error('comboSkill.skillId: does not match character template comboSkillId');
  const operatorSlug = requireNonEmptyString(binding.operatorSlug, 'binding.operatorSlug');
  const skillGroupKey = requireNonEmptyString(binding.skillGroupKey, 'binding.skillGroupKey');
  const blackboards = compileAbilitySystemBlackboardsSource(source.blackboards);
  const conditions = source.conditions.conditions.map((condition, index) =>
    compileComboSkillConditionDefinitionSource(
      condition,
      blackboards,
      { key: `native-combo:${index}`, skillGroupKey },
      {
        actionOwnerTarget: 'caster',
        actionSourceTarget: 'caster',
        actionTargetTarget: 'eventTarget',
      },
    ),
  );
  const targeting = compileSkillSmartTargetSource(cast.targetSelection);
  return {
    definition: {
      operatorSlug,
      entityBlackboard: blackboards.entityInitialValues,
      comboSkillConditions: conditions.map(condition => condition.definition),
      skillMetadata: [
        {
          skillGroupKey,
          sourceSkillId: cast.skillId,
          costFrame: cast.startCdFrame,
          ...targeting.definition,
        },
      ],
    },
    audit: {
      source,
      cast,
      conditions: conditions.map(condition => condition.source),
      projection: targeting.projection,
      scope: 'template-blackboards-combo-conditions-cast-metadata',
    },
  };
}

/** 正式产物只有运行定义；原始来源和审计必须写入被忽略的临时区。 */
export function renderOperatorRuntimeDefinitionSource(
  definition: ReturnType<typeof compileOperatorRuntimeDefinitionSource>['definition'],
) {
  if (!/^[A-Za-z0-9_-]+$/.test(definition.operatorSlug))
    throw new Error('operatorSlug: unsafe output identity');
  return {
    relativePath: `${definition.operatorSlug}.runtime.generated.ts`,
    content: `/** 由 tools/game-data-compiler 生成的角色常驻运行定义；不要手工编辑。 */\nimport type { OperatorRuntimeDefinition } from '../../../../core/game-data/operatorRuntimeDefinition';\n\n// prettier-ignore\nexport default ${JSON.stringify(definition, null, 2)} as const satisfies OperatorRuntimeDefinition;\n`,
  };
}
