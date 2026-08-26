import { describe, expect, it } from 'vitest';
import fixtures from './fixtures/avywenna-return-damage.json';
import scopeFixtures from './fixtures/avywenna-return-blackboard.json';
import { parseDamageActionSource } from '../src/source/damageActions.ts';
import { compileEventTargetSimpleDamageOperationSource } from '../src/compiler/simpleDamageOperation.ts';
import { compileCombatActionSequenceSource } from '../src/compiler/buffRuntimeProjection.ts';
import {
  makeReturnProjection,
  parseReturnSequence,
  returnProjectionContext,
} from './support/avywennaReturnProjection.ts';

function rawDamage(index = 0) {
  return structuredClone(fixtures[index]!.branch.failActions.actionData[0]!);
}
function damageSource(index = 0) {
  return parseDamageActionSource(rawDamage(index), 'return.damage', {});
}

describe('公共回调伤害投影', () => {
  it.each(['attacker', 'effectSource'] as const)(
    '未投影的投射物 Owner 不能由 %s 借用为施法者',
    field => {
      const source = damageSource();
      const action =
        field === 'attacker'
          ? { ...source, attacker: 'ActionOwner' }
          : { ...source, effectSource: { ...source.effectSource, targetSource: 'Owner' } };
      expect(() =>
        compileEventTargetSimpleDamageOperationSource(action, 'damage', {
          actionOwnerTarget: 'unavailable',
          actionSourceTarget: 'caster',
        }),
      ).toThrow('Owner projection is unavailable');
    },
  );

  it('未绑定的 Owner Buff 条件不能查询施法者的 Buff', () => {
    const raw = structuredClone(scopeFixtures[0]!.reach.sequence);
    const guard = raw.actionData[1]!;
    if (!('checkTarget' in guard) || !guard.checkTarget) throw new Error('fixture');
    guard.checkTarget.targetSource = 'Owner';
    expect(() =>
      compileCombatActionSequenceSource(parseReturnSequence(raw, 'reach'), returnProjectionContext),
    ).toThrow('Owner projection is unavailable');
  });

  it('未绑定的 Owner 回能不能记到施法者的资源账本', () => {
    const raw = structuredClone(scopeFixtures[0]!.reach.sequence);
    const gain = raw.actionData[2]!;
    if (!('source' in gain) || !gain.source || !('target' in gain) || !gain.target)
      throw new Error('fixture');
    gain.source.targetSource = 'Owner';
    gain.target.targetSource = 'Owner';
    expect(() =>
      compileCombatActionSequenceSource(parseReturnSequence(raw, 'reach'), returnProjectionContext),
    ).toThrow('resource gain source/target');
  });
  it.each([0, 1])('%i: 真实 Hp/Poise 读取动作黑板，并保留战技分类和击破弱点位', index => {
    const source = damageSource(index);
    expect(source.units[0]!.damageDecorateMask).toBe(4352);
    expect(compileEventTargetSimpleDamageOperationSource(source, 'return.damage')).toEqual({
      kind: 'dealDamage',
      parameters: {
        damageType: 'electric',
        attackScale: {
          kind: 'blackboard',
          key: index === 0 ? 'atk_scale_lance' : 'atk_scale_lance_ult',
        },
        tags: ['normalSkill'],
        features: ['canBreakWeakness'],
        stagger: { kind: 'blackboard', key: index === 0 ? 'poise_lance' : 'poise_lance_ult' },
      },
    });
  });

  it.each([0, 256, 4096, 4352])('严格分解已覆盖伤害位 %i', mask => {
    const source = damageSource();
    const result = compileEventTargetSimpleDamageOperationSource(
      {
        ...source,
        units: [{ ...source.units[0]!, damageDecorateMask: mask }],
      },
      'damage',
    );
    expect(result.parameters.tags).toEqual(mask === 256 || mask === 4352 ? ['normalSkill'] : []);
    expect(result.parameters.features).toEqual(mask >= 4096 ? ['canBreakWeakness'] : undefined);
  });

  it.each([1, 128, 8192, 4353, 2 ** 32 + 4352, Number.MAX_SAFE_INTEGER + 1, -1, 0.5])(
    '未知位/非安全整数 %s 不被位运算截断后放行',
    mask => {
      const source = damageSource();
      expect(() =>
        compileEventTargetSimpleDamageOperationSource(
          {
            ...source,
            units: [{ ...source.units[0]!, damageDecorateMask: mask }],
          },
          'damage',
        ),
      ).toThrow('damage decorate mask');
    },
  );

  it.each([0, 1])('第 %i 单元的施法时攻击快照未接入时严格拒绝', index => {
    const source = damageSource();
    expect(() =>
      compileEventTargetSimpleDamageOperationSource(
        {
          ...source,
          units: source.units.map((unit, i) =>
            i === index ? { ...unit, takeAttackSnapshot: true } : unit,
          ),
        },
        'damage',
      ),
    ).toThrow('DamageUnit behavior');
  });

  it('普通 AtkScaleCalculation 只读嵌套倍率，简单路径不读失效的残留公式', () => {
    const raw = rawDamage();
    const hp = raw.damageUnits[0]!;
    const nested = {
      $type: 'Beyond.Gameplay.Core.AtkScaleCalculation, Gameplay.Beyond',
      atkScale: { useBlackboardKey: true, blackboardKey: 'nested_scale', value: 999 },
    };
    const source = parseDamageActionSource(
      {
        ...raw,
        damageUnits: [{ ...hp, simpleCalculation: false, atkCalculation: nested }],
      },
      'normal',
      { nested_scale: [2, 3] },
    );
    expect(
      compileEventTargetSimpleDamageOperationSource(source, 'normal').parameters.attackScale,
    ).toEqual({ kind: 'blackboard', key: 'nested_scale' });

    const simple = parseDamageActionSource(
      {
        ...raw,
        damageUnits: [
          {
            ...hp,
            simpleCalculation: true,
            atkCalculation: { ...nested, atkScale: { ...nested.atkScale, blackboardKey: '' } },
          },
        ],
      },
      'simple',
      {},
    );
    expect(
      compileEventTargetSimpleDamageOperationSource(simple, 'simple').parameters.attackScale,
    ).toEqual({ kind: 'blackboard', key: 'atk_scale_lance' });
  });

  it('普通公式缺失或公式种类不同不能回落到顶层倍率', () => {
    const source = damageSource();
    for (const attackCalculation of [
      null,
      {
        kind: 'definite' as const,
        value: source.units[0]!.attackScale,
        applyScale: false,
        valueScale: source.units[0]!.attackScale,
      },
    ]) {
      expect(() =>
        compileEventTargetSimpleDamageOperationSource(
          {
            ...source,
            units: [
              {
                ...source.units[0]!,
                simpleCalculation: false,
                serializedAttackCalculationPresent: true,
                attackCalculation,
              },
            ],
          },
          'damage',
        ),
      ).toThrow('unsupported event attack calculation');
    }
  });

  it.each([0, 1])('%i: 木桩 Target 与事件 Target 分开，原生条件和先乘再伤害顺序不变', index => {
    const scope = makeReturnProjection(index);
    const hit = scope.body.steps[0]!;
    if (hit.kind !== 'withActionBlackboardScope') throw new Error('fixture');
    const branch = hit.body.steps[1]!;
    expect(branch).toMatchObject({
      kind: 'conditional',
      parameters: {
        alwaysNext: true,
        condition: {
          kind: 'all',
          conditions: [
            { kind: 'actionValueCompare' },
            { kind: 'buffStackCompare', target: 'enemy', buffTagIds: [-1640994543] },
          ],
        },
      },
      whenTrue: { steps: [{ kind: 'modifyActionValue' }, { kind: 'dealDamage' }] },
      whenFalse: { steps: [{ kind: 'dealDamage' }] },
    });
  });

  it('没有被证明的主动物理事件条件不可借用事件上下文', () => {
    const raw = scopeFixtures[0]!.reach.sequence;
    const source = parseReturnSequence(raw, 'reach');
    const condition = source.actions[1]!;
    const unsafe = {
      ...source,
      actions: [
        {
          ...condition,
          body: {
            kind: 'leaf' as const,
            value: {
              family: 'condition' as const,
              action: {
                kind: 'skillType' as const,
                sourceType: 'CheckSkillType',
                skillTypes: ['NormalSkill'],
              },
            },
          },
        },
      ],
    };
    expect(() => compileCombatActionSequenceSource(unsafe, returnProjectionContext)).toThrow(
      'unaudited single-enemy action condition',
    );
  });

  it('伤害不能在明确绑定为队友集合的 Target 上伪装为木桩伤害', () => {
    const sequence = parseReturnSequence(
      {
        actionData: [rawDamage()],
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      'damage',
    );
    expect(() =>
      compileCombatActionSequenceSource(sequence, {
        ...returnProjectionContext,
        actionTargetTarget: 'partyExceptCaster',
      }),
    ).toThrow('damage source');
  });
});
