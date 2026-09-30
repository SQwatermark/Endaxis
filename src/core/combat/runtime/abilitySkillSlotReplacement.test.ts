/** 验证替换登记与真实冷却账本共同恢复，覆盖旧编号失效和分支独立推进。 */
import { describe, expect, it } from 'vitest';
import {
  replaceCombatSkillSlot,
  finishCombatSkillSlotReplacement,
  type CombatSkillSlotChangeHost,
} from '../skills/combatSkillSlotCoordination';
import { AbilitySystemRuntime } from '../abilities/abilitySystemRuntime';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from '../time/combatClock';
import { ActionBlackboard } from '../actions/actionBlackboard';
import { SkillSlotOperationExecutor } from '../skills/skillSlotOperationExecutor';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { changeCombatSkillSlot } from '../skills/combatSkillSlotCoordination';
import { SkillCooldown } from '../skills/skillCooldown';

describe('技能槽替换恢复', () => {
  it.each([undefined, 'base'])(
    '还原目标 %s 使用当前分支的冷却进度，旧编号不能撤销新替换',
    revertedSkillKey => {
      const definition = {
        skills: [],
        skillSlotGroups: [
          {
            skillSlotKey: 'battle',
            baseSkillKey: 'base',
            replacementSkillKeys: ['first', 'second'],
          },
        ],
      };
      const state = new AbilitySystemRuntime(definition).runtimeState;
      const cooldowns = new Map(
        ['base', 'first', 'second'].map(key => [key, new SkillCooldown(100, 0)]),
      );
      cooldowns.get('base')!.setProgress(0.25);
      const bind = (data: typeof state, ledgers: typeof cooldowns): CombatSkillSlotChangeHost => {
        const abilitySystem = new AbilitySystemRuntime(definition, data);
        const host = {
          operatorId: 'operator',
          abilitySystem,
          cooldowns: new Map(
            [...ledgers].map(([key, cooldown]) => [`operator\u0000${key}`, { cooldown }]),
          ),
          clock: new CombatClock(),
          receipt: new CombatReceiptCollector(),
        };
        return host;
      };
      const host = bind(state, cooldowns);
      const first = replaceCombatSkillSlot(host, {
        skillSlotKey: 'battle',
        targetSkillKey: 'first',
        inheritOriginSkillCooldownProgress: true,
      });
      const saved = structuredClone({
        ability: state,
        cooldowns: new Map([...cooldowns].map(([key, value]) => [key, value.runtimeState])),
      });
      const restoredCooldowns = new Map(
        [...saved.cooldowns].map(([key, value]) => [
          key,
          new SkillCooldown(100, 0, undefined, value),
        ]),
      );
      const restoredHost = bind(saved.ability, restoredCooldowns);
      restoredCooldowns.get('first')!.setProgress(0.75);
      const second = replaceCombatSkillSlot(restoredHost, {
        skillSlotKey: 'battle',
        targetSkillKey: 'second',
        revertedSkillKey,
        inheritOriginSkillCooldownProgress: true,
      });
      const expectedRevert = revertedSkillKey ?? 'first';
      expect(saved.ability.skillSlotReplacements.get('battle')!.revertedSkillKey).toBe(
        expectedRevert,
      );
      expect(restoredCooldowns.get('second')!.snapshot.progress).toBeCloseTo(0.75);
      finishCombatSkillSlotReplacement(restoredHost, 'battle', first);
      expect(saved.ability.skillSlotGroups.get('battle')!.currentSkillKey).toBe('second');
      restoredCooldowns.get('second')!.setProgress(0.9);
      finishCombatSkillSlotReplacement(restoredHost, 'battle', second);
      finishCombatSkillSlotReplacement(restoredHost, 'battle', second);
      expect(saved.ability.skillSlotGroups.get('battle')!.currentSkillKey).toBe(expectedRevert);
      expect(restoredCooldowns.get(expectedRevert)!.snapshot.progress).toBeCloseTo(0.9);
      expect(state.skillSlotGroups.get('battle')!.currentSkillKey).toBe('first');
      expect(cooldowns.get('base')!.snapshot.progress).toBeCloseTo(0.25);
      expect(state.skillSlotReplacements.has('battle')).toBe(true);
    },
  );
});

function replacementFixture() {
  const abilitySystem = new AbilitySystemRuntime({
    skills: [],
    skillSlotGroups: [
      { skillSlotKey: 'battle', baseSkillKey: 'base', replacementSkillKeys: ['first', 'second'] },
    ],
  });
  const host = {
    operatorId: 'operator',
    abilitySystem,
    cooldowns: new Map(
      ['base', 'first', 'second'].map(key => [
        `operator\u0000${key}`,
        { cooldown: new SkillCooldown(100, 0) },
      ]),
    ),
    clock: new CombatClock(),
    receipt: new CombatReceiptCollector(),
  };
  const executor = new SkillSlotOperationExecutor({
    changeSkillSlot: (group, skill, inherit) => changeCombatSkillSlot(host, group, skill, inherit),
    replaceSkillSlot: parameters => replaceCombatSkillSlot(host, parameters),
    finishSkillSlotReplacement: (group, id) => finishCombatSkillSlotReplacement(host, group, id),
    delegate: { execute: () => false, evaluate: () => false },
  });
  const context = () => ({
    blackboard: new ActionBlackboard(),
    actionRegistrationState: { registrationId: null as number | null },
  });
  const step = (targetSkillKey: string, inherit = true): ResolvedCombatOperationStep => ({
    kind: 'changeSkillSlot',
    parameters: {
      skillSlotKey: 'battle',
      targetSkillKey,
      lifetime: 'finishByAction',
      inheritOriginSkillCooldownProgress: inherit,
    },
  });
  const ledger = (skill: string) => host.cooldowns.get(`operator\u0000${skill}`)!.cooldown;
  const snapshot = () =>
    structuredClone({
      ability: abilitySystem.runtimeState,
      cooldowns: new Map(
        [...host.cooldowns].map(([key, value]) => [key, value.cooldown.runtimeState]),
      ),
      receipt: host.receipt.entries,
    });
  return { host, executor, context, step, ledger, snapshot };
}

describe('动作与技能槽协调入口', () => {
  it.each([false, true])(
    '旧撤销继承 %s：身份先快照，冷却在旧撤销后才读，旧动作结束无效',
    inherit => {
      const { host, executor, context, step, ledger } = replacementFixture();
      const firstContext = context();
      const secondContext = context();
      const first = step('first', inherit);
      const second = step('second');
      ledger('base').setProgress(0.25);
      executor.execute(first, firstContext);
      ledger('first').setProgress(0.75);
      executor.execute(second, secondContext);
      expect(
        host.abilitySystem.runtimeState.skillSlotReplacements.get('battle')!.revertedSkillKey,
      ).toBe('first');
      expect(ledger('second').snapshot.progress).toBeCloseTo(inherit ? 0.75 : 0.25);
      const events = host.receipt.entries.map(entry => entry.data);
      expect(events).toEqual([
        expect.objectContaining({ previousSkillKey: 'base', targetSkillKey: 'first' }),
        expect.objectContaining({ previousSkillKey: 'first', targetSkillKey: 'base' }),
        expect.objectContaining({
          previousSkillKey: 'base',
          targetSkillKey: 'second',
          inheritedCooldownProgress: inherit ? 0.75 : 0.25,
        }),
      ]);
      executor.end(first, firstContext);
      expect(host.receipt.entries).toHaveLength(3);
      ledger('second').setProgress(0.9);
      executor.end(second, secondContext);
      executor.end(second, secondContext);
      expect(host.abilitySystem.currentSkillKeyForSlot('battle')).toBe('first');
      expect(ledger('first').snapshot.progress).toBeCloseTo(0.9);
      expect(host.abilitySystem.runtimeState.skillSlotReplacements.size).toBe(0);
      expect(host.receipt.entries).toHaveLength(4);
    },
  );

  it('同一动作再次执行也在旧撤销前快照，结束时不复活旧登记', () => {
    const { host, executor, context, step } = replacementFixture();
    const action = step('first');
    const execution = context();
    executor.execute(action, execution);
    executor.execute(action, execution);
    expect(execution.actionRegistrationState.registrationId).toBe(1);
    executor.end(action, execution);
    expect(host.abilitySystem.currentSkillKeyForSlot('battle')).toBe('first');
    expect(host.abilitySystem.runtimeState.skillSlotReplacements.size).toBe(0);
    expect(host.receipt.entries.map(entry => entry.data?.targetSkillKey)).toEqual([
      'first',
      'base',
      'first',
      'first',
    ]);
  });

  it.each(['target', 'revert', 'oldCooldown', 'newCooldown'] as const)(
    '替换预检拒绝 %s 时保留旧动作登记、槽位、冷却和回执',
    failure => {
      const { host, executor, context, step, ledger, snapshot } = replacementFixture();
      const oldContext = context();
      const first = step('first');
      executor.execute(first, oldContext);
      ledger('first').setProgress(0.6);
      if (failure === 'oldCooldown') host.cooldowns.delete('operator\u0000base');
      if (failure === 'newCooldown') host.cooldowns.delete('operator\u0000second');
      const before = snapshot();
      const next = step(failure === 'target' ? 'unknown' : 'second');
      if (next.kind !== 'changeSkillSlot') throw new Error('expected slot change');
      const invalid =
        failure === 'revert'
          ? { ...next, parameters: { ...next.parameters, revertedSkillKey: 'unknown' } }
          : next;
      const execution = context();
      expect(() => executor.execute(invalid, execution)).toThrow();
      expect(execution.actionRegistrationState.registrationId).toBeNull();
      expect(snapshot()).toEqual(before);
      expect(oldContext.actionRegistrationState.registrationId).toBe(0);
    },
  );

  it('结束前发现单侧冷却缺失时保留登记；补齐后只撤销一次', () => {
    const { host, executor, context, step, ledger, snapshot } = replacementFixture();
    const action = step('first');
    const execution = context();
    executor.execute(action, execution);
    ledger('first').setProgress(0.6);
    const base = host.cooldowns.get('operator\u0000base')!;
    host.cooldowns.delete('operator\u0000base');
    const before = snapshot();
    expect(() => executor.end(action, execution)).toThrow('before both skills are assembled');
    expect(snapshot()).toEqual(before);
    expect(execution.actionRegistrationState.registrationId).toBe(0);
    host.cooldowns.set('operator\u0000base', base);
    executor.end(action, execution);
    executor.end(action, execution);
    expect(host.abilitySystem.currentSkillKeyForSlot('battle')).toBe('base');
    expect(ledger('base').snapshot.progress).toBeCloseTo(0.6);
    expect(host.receipt.entries).toHaveLength(2);
    expect(host.abilitySystem.runtimeState.skillSlotReplacements.size).toBe(0);
  });
});
