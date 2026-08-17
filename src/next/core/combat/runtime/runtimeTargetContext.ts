import type { RuntimeTargetGroup, RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';

/** 一次技能释放内的命名目标组；释放重启时与动作黑板一起清空。 */
export class RuntimeTargetContext {
  readonly #groups = new Map<string, RuntimeTargetGroup>();

  set(key: string, targets: RuntimeTargetGroup): void {
    if (key.length === 0) throw new Error('target context key must not be empty');
    this.#groups.set(key, Object.freeze([...targets]));
  }

  setSingle(key: string, target: RuntimeTargetRef): void {
    this.set(key, [target]);
  }

  get(key: string): RuntimeTargetGroup {
    const targets = this.#groups.get(key);
    if (targets === undefined) throw new Error(`target context group '${key}' is missing`);
    return targets;
  }

  clear(): void {
    this.#groups.clear();
  }
}
