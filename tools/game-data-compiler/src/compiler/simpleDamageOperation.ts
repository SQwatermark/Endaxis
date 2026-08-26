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
    readonly tags: readonly (
      | 'normalAttack'
      | 'normalAttackLastCombo'
      | 'powerAttack'
      | 'plungingAttack'
      | 'dashAttack'
      | 'normalSkill'
      | 'ultimateSkill'
      | 'comboSkill'
    )[];
    readonly features?: readonly 'canBreakWeakness'[];
    readonly stagger?: CompiledActionValueOperandSource;
    readonly staggerOnlyWhenCasterControlled?: boolean;
  };
}

/**
 * 投影固定单敌人场景中的标准攻击倍率伤害（Hp 后接可选的固定 Poise 单元）。
 * simpleCalculation 读取顶层 atkScale；普通 AtkScaleCalculation 读取嵌套倍率。
 * 两者都在执行时读黑板，不能在转换时冻结潜能等动作写入。
 * 仅接入已验收的 NormalSkill/UltimateSkill/ComboSkill/CanBreakWeakness 位；快照、其他公式/掩码及处理器严格拒绝。
 */
export function compileEventTargetSimpleDamageOperationSource(
  action: DamageActionSource,
  sourcePath: string,
  context: {
    readonly actionOwnerTarget: 'buffOwner' | 'caster' | 'unavailable';
    readonly actionSourceTarget: 'caster';
    readonly staticEnemyTargetGroupKeys?: ReadonlySet<string>;
  } = { actionOwnerTarget: 'caster', actionSourceTarget: 'caster' },
): CompiledSimpleDamageOperationSource {
  if (
    context.actionOwnerTarget === 'unavailable' &&
    (action.attacker === 'ActionOwner' || action.effectSource.targetSource === 'Owner')
  ) {
    throw new Error(`${sourcePath}: damage action Owner projection is unavailable`);
  }
  const attackerTarget =
    action.attacker === 'ActionOwner'
      ? ('caster' as const)
      : action.attacker === 'ActionSource'
        ? context.actionSourceTarget
        : null;
  if (!action.alwaysNext || attackerTarget !== 'caster') {
    throw new Error(`${sourcePath}: unsupported simple damage action control flags`);
  }
  if (
    action.target.targetSource === 'Context' &&
    context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey)
  ) {
    requireUnfilteredTarget(action.target, `${sourcePath}.target`);
  } else {
    requireFixedTarget(action.target, 'Target', `${sourcePath}.target`);
  }
  const effectSourceTarget =
    action.effectSource.targetSource === 'Owner'
      ? ('caster' as const)
      : action.effectSource.targetSource === 'Source'
        ? context.actionSourceTarget
        : null;
  if (effectSourceTarget !== 'caster') {
    throw new Error(`${sourcePath}.effectSource: unsupported simple event damage source`);
  }
  requireFixedTarget(
    action.effectSource,
    action.effectSource.targetSource as 'Owner' | 'Source',
    `${sourcePath}.effectSource`,
  );
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
    unit.takeAttackSnapshot ||
    unit.serializedPoiseCalculationPresent ||
    unit.poiseCalculation !== null ||
    unit.processors.length > 0 ||
    unit.onlyEnableForMainOperator ||
    unit.ignoreDamageImmuneLevel !== 'None' ||
    unit.ignorePoiseImmune ||
    unit.reduceDamageForGuard ||
    unit.gainCost
  ) {
    throw new Error(`${sourcePath}: unsupported simple event DamageUnit behavior`);
  }
  const attackScale = unit.simpleCalculation
    ? unit.attackScale
    : unit.serializedAttackCalculationPresent && unit.attackCalculation?.kind === 'attackScale'
      ? unit.attackCalculation.attackScale
      : null;
  if (attackScale === null) {
    throw new Error(`${sourcePath}: unsupported event attack calculation`);
  }
  // DamageEnums.g.cs：分类位彼此独立。hitEnvironment 只增加环境命中旁路，不改变同一
  // DamageUnit 对目标的结算；Endaxis 没有可破坏环境，只投影目标伤害。
  // 用安全整数和减法验剩余位，避免 JS 位运算把高位截断后误当作已覆盖。
  const mask = unit.damageDecorateMask;
  const powerAttack = Math.floor(mask / 4) % 2 === 1;
  const normalAttack = Math.floor(mask / 128) % 2 === 1;
  const normalSkill = Math.floor(mask / 256) % 2 === 1;
  const ultimateSkill = Math.floor(mask / 512) % 2 === 1;
  const plungingAttack = Math.floor(mask / 1024) % 2 === 1;
  const canBreakWeakness = Math.floor(mask / 4096) % 2 === 1;
  const comboSkill = Math.floor(mask / 8192) % 2 === 1;
  const dashAttack = Math.floor(mask / 131072) % 2 === 1;
  const normalAttackLastCombo = Math.floor(mask / 2097152) % 2 === 1;
  if (
    !Number.isSafeInteger(mask) ||
    mask < 0 ||
    mask -
      (powerAttack ? 4 : 0) -
      (normalAttack ? 128 : 0) -
      (normalSkill ? 256 : 0) -
      (ultimateSkill ? 512 : 0) -
      (plungingAttack ? 1024 : 0) -
      (canBreakWeakness ? 4096 : 0) -
      (comboSkill ? 8192 : 0) -
      (dashAttack ? 131072 : 0) -
      (normalAttackLastCombo ? 2097152 : 0) !==
      0
  ) {
    throw new Error(`${sourcePath}: unsupported event damage decorate mask ${mask}`);
  }
  const stagger =
    poiseUnit === undefined ? undefined : compileSimplePoiseOperand(poiseUnit, sourcePath);
  return {
    kind: 'dealDamage',
    parameters: {
      damageType,
      attackScale: scalarOperand(attackScale),
      tags: [
        ...(normalAttack ? (['normalAttack'] as const) : []),
        ...(normalAttackLastCombo ? (['normalAttackLastCombo'] as const) : []),
        ...(powerAttack ? (['powerAttack'] as const) : []),
        ...(plungingAttack ? (['plungingAttack'] as const) : []),
        ...(dashAttack ? (['dashAttack'] as const) : []),
        ...(normalSkill ? (['normalSkill'] as const) : []),
        ...(ultimateSkill ? (['ultimateSkill'] as const) : []),
        ...(comboSkill ? (['comboSkill'] as const) : []),
      ],
      ...(canBreakWeakness ? { features: ['canBreakWeakness'] as const } : {}),
      ...(stagger === undefined ? {} : { stagger }),
      ...(poiseUnit?.onlyEnableForMainOperator ? { staggerOnlyWhenCasterControlled: true } : {}),
    },
  };
}

function compileSimplePoiseOperand(
  unit: DamageActionSource['units'][number],
  sourcePath: string,
): CompiledActionValueOperandSource {
  const calculation = unit.poiseCalculation;
  if (
    unit.attributeType !== 'Poise' ||
    !unit.simpleCalculation ||
    unit.takeAttackSnapshot ||
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
    unit.ignoreDamageImmuneLevel !== 'None' ||
    unit.ignorePoiseImmune ||
    unit.reduceDamageForGuard ||
    unit.gainCost
  ) {
    throw new Error(`${sourcePath}: unsupported simple event Poise DamageUnit behavior`);
  }
  // PoisePack 原生规格不保存元素字段，修正器只读取 decorate mask；仍验证来源元素是已知枚举。
  projectNativeDamageElement(unit.damageType, `${sourcePath}.units[1].damageType`);
  return scalarOperand(calculation.value);
}

function requireFixedTarget(
  target: TargetReferenceSource,
  targetSource: 'Target' | 'Owner' | 'Source',
  sourcePath: string,
): void {
  if (target.targetSource !== targetSource || !isUnfilteredTarget(target)) {
    throw new Error(`${sourcePath}: unsupported simple event damage target`);
  }
  // 反编译已确认只有 Context 来源读取 targetGroupKey；固定 Target/Owner 上的同名字段是残留值。
}

function requireUnfilteredTarget(target: TargetReferenceSource, sourcePath: string): void {
  if (!isUnfilteredTarget(target)) {
    throw new Error(`${sourcePath}: unsupported simple event damage target`);
  }
}

function isUnfilteredTarget(target: TargetReferenceSource): boolean {
  return (
    (target.finderType !== null ||
      target.finderShape !== null ||
      target.finderOwnerPartsQuery !== null ||
      target.validatorTypes.length > 0 ||
      target.postProcessorTypes.length > 0 ||
      target.finderSpawnedObjectType !== null ||
      target.validatorTagQueries.length > 0) === false
  );
}

function scalarOperand(source: ScalarSource): CompiledActionValueOperandSource {
  return source.blackboardKey === null
    ? { kind: 'constant', value: source.value }
    : { kind: 'blackboard', key: source.blackboardKey };
}
