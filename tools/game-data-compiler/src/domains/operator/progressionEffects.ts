import {
  compileResolvedAttributeModifierSource,
  type CompiledAttributeModifierSource,
} from '../../compiler/attributeModifier.ts';
import {
  compileBuildConditionGroupSource,
  type CompiledBuildConditionGroupSource,
  type CompiledBuildConditionSource,
} from '../../compiler/buildCondition.ts';
import type {
  ModifiableSkillParameterSource,
  OperatorProgressionEffectBundleSource,
  SkillValueModifyTypeSource,
} from '../../source/operatorProgressionEffects.ts';

interface CompiledProgressionEntryBaseSource {
  readonly sourcePath: string;
  /** 构筑期条件；null 表示原生条件数组过滤空字符串后为空。 */
  readonly activeCondition: CompiledBuildConditionGroupSource | null;
}

export type CompiledOperatorProgressionEntrySource =
  | (CompiledProgressionEntryBaseSource & { readonly kind: 'none' })
  | (CompiledProgressionEntryBaseSource & {
      readonly kind: 'passiveSkill';
      readonly skillId: string;
      readonly inputBlackboard: Readonly<Record<string, number>>;
    })
  | (CompiledProgressionEntryBaseSource & {
      readonly kind: 'skillParameterModifier';
      readonly skillId: string;
      readonly parameter: ModifiableSkillParameterSource;
      readonly operation: Exclude<SkillValueModifyTypeSource, 'none'>;
      readonly value: number;
    })
  | (CompiledProgressionEntryBaseSource & {
      readonly kind: 'skillBlackboardModifier';
      readonly skillId: string;
      readonly blackboardKey: string;
      readonly operation: Exclude<SkillValueModifyTypeSource, 'none'>;
      readonly numberValue: number;
      readonly stringValue: string;
    })
  | (CompiledProgressionEntryBaseSource & {
      readonly kind: 'attributeModifier';
      readonly modifier: CompiledAttributeModifierSource;
    })
  | (CompiledProgressionEntryBaseSource & {
      readonly kind: 'buff';
      readonly buffId: string;
      readonly inputBlackboard: Readonly<Record<string, number>>;
    });

export interface CompiledOperatorProgressionEffectBundleSource {
  readonly sourcePath: string;
  readonly effectId: string;
  readonly entries: readonly CompiledOperatorProgressionEntrySource[];
}

/**
 * 将原生联合标签归一成互斥效果 IR。这里仍使用原生 skillId/buffId，不映射编辑器稳定键。
 */
export function compileOperatorProgressionEffectBundles(
  bundles: readonly OperatorProgressionEffectBundleSource[],
  conditionsById: ReadonlyMap<string, CompiledBuildConditionSource> = new Map(),
): CompiledOperatorProgressionEffectBundleSource[] {
  return bundles.map(bundle => ({
    sourcePath: bundle.sourcePath,
    effectId: bundle.effectId,
    entries: bundle.entries.map(entry => {
      const base = {
        sourcePath: entry.sourcePath,
        activeCondition: compileBuildConditionGroupSource(
          entry.activeConditions,
          conditionsById,
          `${entry.sourcePath}.activeCondition`,
        ),
      };
      switch (entry.modifyType) {
        case 'none':
          return { ...base, kind: 'none' };
        case 'addPassiveSkill':
          return {
            ...base,
            kind: 'passiveSkill',
            skillId: entry.attachedSkill.skillId,
            inputBlackboard: entry.attachedSkill.blackboard,
          };
        case 'changeSkillParameter':
          return {
            ...base,
            kind: 'skillParameterModifier',
            skillId: entry.skillParameterModifier.skillId,
            parameter: entry.skillParameterModifier.parameter,
            operation: requireOperation(
              entry.skillParameterModifier.modifyType,
              `${entry.sourcePath}.skillParamModifier.modifyType`,
            ),
            value: entry.skillParameterModifier.value,
          };
        case 'changeSkillBlackboard':
          return {
            ...base,
            kind: 'skillBlackboardModifier',
            skillId: entry.skillBlackboardModifier.skillId,
            blackboardKey: entry.skillBlackboardModifier.key,
            operation: requireOperation(
              entry.skillBlackboardModifier.modifyType,
              `${entry.sourcePath}.skillBbModifier.modifyType`,
            ),
            numberValue: entry.skillBlackboardModifier.numberValue,
            stringValue: entry.skillBlackboardModifier.stringValue,
          };
        case 'modifyAttribute':
          return {
            ...base,
            kind: 'attributeModifier',
            modifier: compileResolvedAttributeModifierSource({
              sourcePath: `${entry.sourcePath}.attrModifier`,
              ...entry.attributeModifier,
            }),
          };
        case 'addBuff':
          return {
            ...base,
            kind: 'buff',
            buffId: entry.attachedBuff.buffId,
            inputBlackboard: entry.attachedBuff.blackboard,
          };
      }
    }),
  }));
}

function requireOperation(
  value: SkillValueModifyTypeSource,
  path: string,
): Exclude<SkillValueModifyTypeSource, 'none'> {
  if (value === 'none') throw new Error(`${path}: active modifier cannot use None`);
  return value;
}
