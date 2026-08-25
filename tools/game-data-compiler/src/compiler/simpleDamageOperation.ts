import type { DamageActionSource } from '../source/damageActions.ts';
import type { ScalarSource } from '../source/scalar.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import { projectNativeDamageElement } from '../source/damageElement.ts';

export type CompiledActionValueOperandSource =
  | { readonly kind: 'constant'; readonly value: number }
  | { readonly kind: 'blackboard'; readonly key: string };

export interface CompiledSimpleDamageOperationSource {
  readonly kind: 'dealDamage';
  readonly parameters: {
    readonly damageType: 'physical' | 'heat' | 'electric' | 'cryo' | 'nature';
    readonly attackScale: CompiledActionValueOperandSource;
    readonly tags: readonly [];
    readonly stagger?: CompiledActionValueOperandSource;
  };
}

/**
 * 投影固定单敌人场景中、由 ActionOwner 对当前事件 Target 造成的标准攻击倍率伤害。
 * 该窄入口只接受公共 DamageAction 来源 IR 中的简单 Hp 单元；任何附加计算、失衡单元、
 * 处理器、费用或目标选择行为都失败关闭。
 */
export function compileEventTargetSimpleDamageOperationSource(
  action: DamageActionSource,
  sourcePath: string,
): CompiledSimpleDamageOperationSource {
  if (!action.alwaysNext || action.attacker !== 'ActionOwner' || action.hitEnvironment) {
    throw new Error(`${sourcePath}: unsupported simple damage action control flags`);
  }
  requireFixedTarget(action.target, 'Target', `${sourcePath}.target`);
  requireFixedTarget(action.effectSource, 'Owner', `${sourcePath}.effectSource`);
  if (action.units.length < 1 || action.units.length > 2) {
    throw new Error(
      `${sourcePath}: simple event damage requires an Hp unit and optional Poise unit`,
    );
  }
  const unit = action.units[0]!;
  const poiseUnit = action.units[1];
  const damageType = projectNativeDamageElement(
    unit.damageType,
    `${sourcePath}.units[0].damageType`,
  );
  if (
    unit.attributeType !== 'Hp' ||
    !unit.simpleCalculation ||
    unit.serializedAttackCalculationPresent ||
    unit.attackCalculation !== null ||
    unit.serializedPoiseCalculationPresent ||
    unit.poiseCalculation !== null ||
    unit.processors.length > 0 ||
    unit.damageDecorateMask !== 0 ||
    unit.onlyEnableForMainOperator ||
    unit.ignoreDamageImmuneLevel !== 'None' ||
    unit.ignorePoiseImmune ||
    unit.reduceDamageForGuard ||
    unit.gainCost ||
    unit.costs.length > 0
  ) {
    throw new Error(`${sourcePath}: unsupported simple event DamageUnit behavior`);
  }
  const stagger =
    poiseUnit === undefined
      ? undefined
      : compileSimplePoiseOperand(poiseUnit, unit.damageType, sourcePath);
  return {
    kind: 'dealDamage',
    parameters: {
      damageType,
      attackScale: scalarOperand(unit.attackScale),
      tags: [],
      ...(stagger === undefined ? {} : { stagger }),
    },
  };
}

function compileSimplePoiseOperand(
  unit: DamageActionSource['units'][number],
  damageType: string,
  sourcePath: string,
): CompiledActionValueOperandSource {
  const calculation = unit.poiseCalculation;
  if (
    unit.damageType !== damageType ||
    unit.attributeType !== 'Poise' ||
    !unit.simpleCalculation ||
    unit.attackScale.blackboardKey !== null ||
    unit.attackScale.value !== 0 ||
    unit.serializedAttackCalculationPresent ||
    unit.attackCalculation !== null ||
    !unit.serializedPoiseCalculationPresent ||
    calculation?.kind !== 'definite' ||
    calculation.applyScale ||
    calculation.valueScale.blackboardKey !== null ||
    calculation.valueScale.value !== 0 ||
    unit.processors.length > 0 ||
    unit.damageDecorateMask !== 0 ||
    unit.onlyEnableForMainOperator ||
    unit.ignoreDamageImmuneLevel !== 'None' ||
    unit.ignorePoiseImmune ||
    unit.reduceDamageForGuard ||
    unit.gainCost ||
    unit.costs.length > 0
  ) {
    throw new Error(`${sourcePath}: unsupported simple event Poise DamageUnit behavior`);
  }
  return scalarOperand(calculation.value);
}

function requireFixedTarget(
  target: TargetReferenceSource,
  targetSource: 'Target' | 'Owner',
  sourcePath: string,
): void {
  if (
    target.targetSource !== targetSource ||
    target.finderType !== null ||
    target.finderShape !== null ||
    target.finderOwnerPartsQuery !== null ||
    target.validatorTypes.length > 0 ||
    target.postProcessorTypes.length > 0 ||
    target.finderSpawnedObjectType !== null ||
    target.validatorTagQueries.length > 0
  ) {
    throw new Error(`${sourcePath}: unsupported simple event damage target`);
  }
  // 反编译已确认只有 Context 来源读取 targetGroupKey；固定 Target/Owner 上的同名字段是残留值。
}

function scalarOperand(source: ScalarSource): CompiledActionValueOperandSource {
  return source.blackboardKey === null
    ? { kind: 'constant', value: source.value }
    : { kind: 'blackboard', key: source.blackboardKey };
}
