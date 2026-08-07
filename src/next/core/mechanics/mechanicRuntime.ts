import type {
  AbilityEventContext,
  AbilityEventDispatcher,
} from '../combat/events/abilityEventDispatcher';
import type {
  GameLevelEventContext,
  GameLevelEventDispatcher,
} from '../combat/events/gameLevelEventDispatcher';
import type { ResolvedActionSequence } from '../compiler/combatProgram';
import type { CompiledMechanics } from './mechanicCompiler';
import type { MechanicAbilityEvent, MechanicGameLevelEvent } from './mechanicContribution';

export interface MechanicExecutionSource {
  readonly selectionId: string;
  readonly mechanicId: string;
}

export type MechanicEventContext<AbilityPayload, LevelPayload> =
  | {
      readonly domain: 'ability';
      readonly event: AbilityEventContext<MechanicAbilityEvent, AbilityPayload>;
    }
  | {
      readonly domain: 'gameLevel';
      readonly event: GameLevelEventContext<MechanicGameLevelEvent['kind'], LevelPayload>;
    };

/** 执行核心序列；活动适配器不会获得此运行时端口。 */
export interface MechanicSequenceExecutor<AbilityPayload = unknown, LevelPayload = unknown> {
  execute(
    sequence: ResolvedActionSequence,
    source: MechanicExecutionSource,
    context: MechanicEventContext<AbilityPayload, LevelPayload>,
  ): void;
}

export interface MechanicRuntimeDependencies<AbilityPayload = unknown, LevelPayload = unknown> {
  readonly abilityEvents: AbilityEventDispatcher<MechanicAbilityEvent, AbilityPayload>;
  readonly gameLevelEvents: GameLevelEventDispatcher<MechanicGameLevelEvent['kind'], LevelPayload>;
  readonly sequenceExecutor: MechanicSequenceExecutor<AbilityPayload, LevelPayload>;
}

/** 将已编译的数据贡献安装到还原出的事件边界。 */
export function installMechanicContributions<AbilityPayload = unknown, LevelPayload = unknown>(
  mechanics: CompiledMechanics,
  dependencies: MechanicRuntimeDependencies<AbilityPayload, LevelPayload>,
): void {
  for (const entry of mechanics.contributions) {
    const source = { selectionId: entry.selectionId, mechanicId: entry.mechanicId };
    const contribution = entry.contribution;
    if (contribution.kind === 'combatEventSequence') {
      dependencies.abilityEvents.registerAction(contribution.event, contribution.priority, event =>
        dependencies.sequenceExecutor.execute(contribution.sequence, source, {
          domain: 'ability',
          event,
        }),
      );
    } else {
      dependencies.gameLevelEvents.registerCallback(contribution.event.kind, event =>
        dependencies.sequenceExecutor.execute(contribution.sequence, source, {
          domain: 'gameLevel',
          event,
        }),
      );
    }
  }
}
