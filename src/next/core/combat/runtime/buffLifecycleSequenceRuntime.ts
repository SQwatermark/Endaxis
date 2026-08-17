/**
 * 把编译后的有序步骤绑定到 Buff 的同步生命周期边界。
 * 每个 Buff 实例独占动作黑板和 once 状态；调用方仍需提供完整战斗操作链。
 */
import type {
  ResolvedActionSequence,
  ResolvedSkillBuffLifecycleSequences,
} from '../../compiler/combatProgram';
import type { BuffLifecycleActions, CombatBuff, CombatBuffDefinition } from '../buffs/combatBuffs';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';

/** 为一份已编译 Buff 定义安装同步生命周期序列。 */
export function attachBuffLifecycleSequences<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  sequences: ResolvedSkillBuffLifecycleSequences,
  resolveOperations: (buff: CombatBuff<Key>) => CombatOperationExecutor,
  currentTarget?: RuntimeTargetRef,
): CombatBuffDefinition<Key> {
  if (definition.actions !== undefined) {
    throw new Error(
      `buff '${definition.id}' cannot mix legacy lifecycle actions with ordered lifecycle sequences`,
    );
  }

  const runtimes = new WeakMap<CombatBuff<Key>, CombatActionSequenceRuntime>();
  const runtimeFor = (buff: CombatBuff<Key>): CombatActionSequenceRuntime => {
    let runtime = runtimes.get(buff);
    if (runtime !== undefined) return runtime;
    const context: CombatOperationContext = {
      blackboard: buff.blackboard,
      ...(currentTarget === undefined ? {} : { currentTarget }),
      ...(buff.skillCastInfo === null ? {} : { skillCastInfo: buff.skillCastInfo }),
    };
    runtime = new CombatActionSequenceRuntime(resolveOperations(buff), context);
    runtimes.set(buff, runtime);
    return runtime;
  };
  const execute = (sequence: ResolvedActionSequence | undefined, buff: CombatBuff<Key>): void => {
    if (sequence === undefined) return;
    runtimeFor(buff).createSequence(sequence).executeInstant({});
  };
  const actions: BuffLifecycleActions<Key> = {
    ...(sequences.start === undefined ? {} : { start: buff => execute(sequences.start, buff) }),
    ...(sequences.enable === undefined ? {} : { enable: buff => execute(sequences.enable, buff) }),
    ...(sequences.disable === undefined
      ? {}
      : { disable: buff => execute(sequences.disable, buff) }),
    ...(sequences.beforeEnhance === undefined
      ? {}
      : { beforeEnhance: buff => execute(sequences.beforeEnhance, buff) }),
    ...(sequences.enhanceChanged === undefined
      ? {}
      : { enhanceChanged: buff => execute(sequences.enhanceChanged, buff) }),
    ...(sequences.afterEnhance === undefined
      ? {}
      : { afterEnhance: buff => execute(sequences.afterEnhance, buff) }),
    ...(sequences.trigger === undefined
      ? {}
      : { trigger: buff => execute(sequences.trigger, buff) }),
    ...(sequences.finish === undefined ? {} : { finish: buff => execute(sequences.finish, buff) }),
  };
  return { ...definition, actions };
}
