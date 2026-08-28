import type { DamageActionSource } from '../source/damageActions.ts';
import type { ScalarSource } from '../source/scalar.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import { projectNativeDamageElement } from '../source/damageElement.ts';

import type {
  CompiledActionValueOperandSource,
  CompiledSimplePoiseOperationSource,
  CompiledSimpleDamageOperationSource,
} from './combatActionProjectionTypes.ts';
export type {
  CompiledActionValueOperandSource,
  CompiledSimplePoiseOperationSource,
  CompiledSimpleDamageOperationSource,
} from './combatActionProjectionTypes.ts';

/**
 * 投影固定单敌人场景中的标准攻击倍率伤害（Hp 后接可选的固定 Poise 单元）。
 * simpleCalculation 读取顶层 atkScale；普通 AtkScaleCalculation 读取嵌套倍率。
 * 两者都在执行时读黑板，不能在转换时冻结潜能等动作写入。处决的 BreakingAttackCalculation
 * 额外保留逐命中 multiplier；动态 multiplier 仍严格拒绝。
 */
export function compileEventTargetSimpleDamageOperationSource(
  action: DamageActionSource,
  sourcePath: string,
  context: {
    readonly actionOwnerTarget: 'buffOwner' | 'caster' | 'unavailable';
    readonly actionSourceTarget: 'caster';
    readonly fixedBuffOwnerTarget?: 'caster' | 'enemy' | 'currentAbilityEntity';
    readonly staticEnemyTargetGroupKeys?: ReadonlySet<string>;
  } = { actionOwnerTarget: 'caster', actionSourceTarget: 'caster' },
): CompiledSimpleDamageOperationSource {
  if (context.actionOwnerTarget === 'unavailable' && action.attacker === 'ActionOwner') {
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
  // combat-spec target-resolution：GetTargetsView 仅在 InstantSearch 执行 selectorData。
  // Context 读取已保存的组；残留选择器仍由来源层解析，但不能变成这次伤害的过滤条件。
  if (action.target.targetSource === 'Context') {
    if (
      !action.target.targetGroupKey ||
      !context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey)
    )
      throw new Error(`${sourcePath}.target: unsupported simple event damage target`);
  } else if (action.target.targetSource === 'Owner' && context.fixedBuffOwnerTarget === 'enemy') {
    requireFixedTarget(action.target, 'Owner', `${sourcePath}.target`);
  } else {
    requireFixedTarget(action.target, 'Target', `${sourcePath}.target`);
  }
  if (
    action.effectSource.targetSource !== 'Owner' &&
    action.effectSource.targetSource !== 'Source'
  ) {
    throw new Error(`${sourcePath}.effectSource: unsupported simple event damage source`);
  }
  // combat-spec 的 DamageAction 适配边界已闭环：effectSource 只决定表现归属，
  // 不参与 attacker、倍率或目标结算。投射物回调的 Owner 因而无需冒充施术干员；
  // 仍完整校验它是无选择器副作用的固定 Owner/Source 引用。
  requireFixedTarget(
    action.effectSource,
    action.effectSource.targetSource,
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
    unit.serializedPoiseCalculationPresent ||
    unit.poiseCalculation !== null ||
    unit.onlyEnableForMainOperator ||
    unit.ignoreDamageImmuneLevel !== 'None' ||
    unit.ignorePoiseImmune ||
    unit.reduceDamageForGuard ||
    unit.gainCost
  ) {
    throw new Error(`${sourcePath}: unsupported simple event DamageUnit behavior`);
  }
  const breakingCalculation =
    !unit.simpleCalculation &&
    unit.serializedAttackCalculationPresent &&
    unit.attackCalculation?.kind === 'breakingAttack'
      ? unit.attackCalculation
      : null;
  if (
    breakingCalculation !== null &&
    (unit.takeAttackSnapshot ||
      breakingCalculation.multiplier.blackboardKey !== null ||
      breakingCalculation.multiplier.levelValues !== null)
  ) {
    throw new Error(`${sourcePath}: snapshot/dynamic breaking-attack multiplier is unsupported`);
  }
  const attackScale = unit.simpleCalculation
    ? unit.attackScale
    : unit.serializedAttackCalculationPresent &&
        (unit.attackCalculation?.kind === 'attackScale' ||
          unit.attackCalculation?.kind === 'breakingAttack')
      ? unit.attackCalculation.attackScale
      : null;
  if (attackScale === null) {
    throw new Error(`${sourcePath}: unsupported event attack calculation`);
  }
  const attributeNames: Readonly<Record<string, string>> = {
    Atk: 'attack',
    CriticalRate: 'criticalRate',
    CriticalDamageIncrease: 'criticalDamageIncrease',
  };
  const slots = {
    BaseAddition: 'baseAddition',
    BaseMultiplier: 'baseMultiplier',
    FinalMultiplier: 'finalMultiplier',
  } as const;
  const instantAttributeModifiers = unit.processors.map((processor, index) => {
    if (
      processor.kind !== 'instantAttributeModifier' ||
      processor.targetSide !== 'Attacker' ||
      processor.modifyAttributeType !== 'Specific'
    ) {
      throw new Error(`${sourcePath}.units[0].processors[${index}]: unsupported processor`);
    }
    const attribute = attributeNames[processor.attributeType];
    const slot = slots[processor.formulaItem as keyof typeof slots];
    if (attribute === undefined || slot === undefined) {
      throw new Error(
        `${sourcePath}.units[0].processors[${index}]: unsupported instant attribute mapping`,
      );
    }
    return {
      targetSide: 'attacker' as const,
      attribute,
      slot,
      value: scalarOperand(processor.parameter),
      attributeTiming: 'runtime' as const,
    };
  });
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
  const burning = Math.floor(mask / 67108864) % 2 === 1;
  const dot = Math.floor(mask / 268435456) % 2 === 1;
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
      (burning ? 67108864 : 0) + (dot ? 268435456 : 0)
  ) {
    throw new Error(`${sourcePath}: unsupported event damage decorate mask ${mask}`);
  }
  const stagger =
    poiseUnit === undefined ? undefined : compileSimplePoiseOperand(poiseUnit, sourcePath, 1);
  return {
    kind: 'dealDamage',
    parameters: {
      damageType,
      attackScale: scalarOperand(attackScale),
      ...(unit.takeAttackSnapshot ? { takeAttackSnapshot: true } : {}),
      ...(breakingCalculation === null
        ? {}
        : {
            calculation: 'breakingAttack' as const,
            calculationMultiplier: breakingCalculation.multiplier.value,
          }),
      tags: [
        ...(normalAttack ? (['normalAttack'] as const) : []),
        ...(normalAttackLastCombo ? (['normalAttackLastCombo'] as const) : []),
        ...(powerAttack ? (['powerAttack'] as const) : []),
        ...(plungingAttack ? (['plungingAttack'] as const) : []),
        ...(dashAttack ? (['dashAttack'] as const) : []),
        ...(normalSkill ? (['normalSkill'] as const) : []),
        ...(ultimateSkill ? (['ultimateSkill'] as const) : []),
        ...(comboSkill ? (['comboSkill'] as const) : []),
        ...(burning ? (['fireAbnormal'] as const) : []),
      ],
      ...(canBreakWeakness || dot
        ? {
            features: [
              ...(canBreakWeakness ? (['canBreakWeakness'] as const) : []),
              ...(dot ? (['dot'] as const) : []),
            ],
          }
        : {}),
      ...(instantAttributeModifiers.length === 0 ? {} : { instantAttributeModifiers }),
      ...(stagger === undefined ? {} : { stagger }),
      ...(poiseUnit?.onlyEnableForMainOperator ? { staggerOnlyWhenCasterControlled: true } : {}),
    },
  };
}

/** 投影只含一个原生 Poise DamageUnit 的动作；它不制造零生命伤害命中。 */
export function compileEventTargetSimplePoiseOperationSource(
  action: DamageActionSource,
  sourcePath: string,
  context: {
    readonly actionOwnerTarget: 'buffOwner' | 'caster' | 'unavailable';
    readonly actionSourceTarget: 'caster';
    readonly fixedBuffOwnerTarget?: 'caster' | 'enemy' | 'currentAbilityEntity';
    readonly staticEnemyTargetGroupKeys?: ReadonlySet<string>;
  } = { actionOwnerTarget: 'caster', actionSourceTarget: 'caster' },
): CompiledSimplePoiseOperationSource {
  if (action.units.length !== 1 || action.units[0]!.attributeType !== 'Poise')
    throw new Error(`${sourcePath}: expected one Poise DamageUnit`);
  if (
    !action.alwaysNext ||
    (action.attacker !== 'ActionSource' && action.attacker !== 'ActionOwner') ||
    (action.attacker === 'ActionOwner' && context.actionOwnerTarget === 'unavailable')
  )
    throw new Error(`${sourcePath}: unsupported poise damage action control flags`);
  if (action.target.targetSource === 'Context') {
    if (
      !action.target.targetGroupKey ||
      !context.staticEnemyTargetGroupKeys?.has(action.target.targetGroupKey)
    )
      throw new Error(`${sourcePath}.target: unsupported poise damage target`);
  } else if (action.target.targetSource === 'Owner' && context.fixedBuffOwnerTarget === 'enemy') {
    requireFixedTarget(action.target, 'Owner', `${sourcePath}.target`);
  } else {
    requireFixedTarget(action.target, 'Target', `${sourcePath}.target`);
  }
  if (action.effectSource.targetSource !== 'Owner' && action.effectSource.targetSource !== 'Source')
    throw new Error(`${sourcePath}.effectSource: unsupported poise damage source`);
  requireFixedTarget(
    action.effectSource,
    action.effectSource.targetSource,
    `${sourcePath}.effectSource`,
  );
  return {
    kind: 'dealStagger',
    parameters: { value: compileSimplePoiseOperand(action.units[0]!, sourcePath, 0) },
  };
}

function compileSimplePoiseOperand(
  unit: DamageActionSource['units'][number],
  sourcePath: string,
  unitIndex: number,
): CompiledActionValueOperandSource {
  const calculation = unit.poiseCalculation;
  if (
    unit.attributeType !== 'Poise' ||
    !unit.simpleCalculation ||
    unit.takeAttackSnapshot ||
    unit.serializedAttackCalculationPresent ||
    unit.attackCalculation !== null ||
    !unit.serializedPoiseCalculationPresent ||
    calculation?.kind !== 'definite' ||
    calculation.applyScale ||
    unit.processors.length > 0 ||
    unit.damageDecorateMask !== 0 ||
    unit.ignoreDamageImmuneLevel !== 'None' ||
    unit.ignorePoiseImmune ||
    unit.reduceDamageForGuard ||
    unit.gainCost
  ) {
    throw new Error(`${sourcePath}: unsupported simple event Poise DamageUnit behavior`);
  }
  // 原生 PlayerDamageActionDataAdapter 在 Poise 分支只构造 poiseCalculation；顶层 atkScale
  // 仍会被反序列化，但不会进入 PoisePack 或失衡公式，因此其字面值/黑板键都是序列化残留。
  // PoisePack 原生规格不保存元素字段，修正器只读取 decorate mask；仍验证来源元素是已知枚举。
  projectNativeDamageElement(unit.damageType, `${sourcePath}.units[${unitIndex}].damageType`);
  // combat-spec definite-value-calculation：applyScale=false 不求值 valueScale，
  // 因而其残留数值或黑板引用不能阻断未缩放的失衡值；启用缩放仍保持上面的显式拒绝。
  return scalarOperand(calculation.value);
}

function requireFixedTarget(
  target: TargetReferenceSource,
  targetSource: 'Target' | 'Owner' | 'Source',
  sourcePath: string,
): void {
  if (target.targetSource !== targetSource) {
    throw new Error(`${sourcePath}: unsupported simple event damage target`);
  }
  // 反编译已确认只有 Context 来源读取 targetGroupKey；固定 Target/Owner 上的同名字段是残留值。
}

function scalarOperand(source: ScalarSource): CompiledActionValueOperandSource {
  return source.blackboardKey === null
    ? { kind: 'constant', value: source.value }
    : { kind: 'blackboard', key: source.blackboardKey };
}
