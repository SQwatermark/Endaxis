/**
 * 黑板数据图：direct 值由本板持有，entity 指向共享实体板。
 * 保存完整战斗数据时应一起复制整个图，保留多个技能共享同一实体板的关系。
 */
import type { ActionBlackboardValue } from '../../../../packages/game-data-contract/src/primitives.ts';

export interface ActionBlackboardState {
  readonly values: Map<string, ActionBlackboardValue>;
  readonly entity?: ActionBlackboardState;
}

export function createActionBlackboardState(
  values?: Readonly<Record<string, ActionBlackboardValue>>,
  entity?: ActionBlackboardState,
): ActionBlackboardState {
  return { values: new Map(Object.entries(values ?? {})), entity };
}
