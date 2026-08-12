/**
 * 时间轴技能块连线的文档命令与端口类型。
 *
 * 这里仅处理持久化语义，不接触 DOM 和拖拽状态；命中点端点应在命中标记投影完成后
 * 通过同一组 ConnectionEndpoint 类型扩展，不能伪装成技能块端点。
 */
import type { ConnectionDocument, ScenarioDocument } from '../../core/project/schema';
import type { TimelineHitMarker } from './timelineHitProjection';

export type TimelineConnectionPort = 'top' | 'right' | 'bottom' | 'left';

export interface CreateSkillCastConnectionInput {
  readonly id: string;
  readonly fromSkillCastId: string;
  readonly fromPort: TimelineConnectionPort;
  readonly toSkillCastId: string;
  readonly toPort: TimelineConnectionPort;
  readonly consumption?: boolean;
}

export interface CreateDamageHitConnectionInput {
  readonly id: string;
  readonly fromSkillCastId: string;
  readonly fromPort: TimelineConnectionPort;
  readonly toSkillCastId: string;
  /** 目标技能定义中伤害步骤的稳定 key；全局 hitId 由 castId + stepKey 派生。 */
  readonly toStepKey: string;
  /** 目标释放的已投影命中标记，用于确认 stepKey 存在。 */
  readonly targetMarkers: readonly TimelineHitMarker[];
  readonly consumption?: boolean;
}

function containsSkillCast(scenario: ScenarioDocument, skillCastId: string): boolean {
  return scenario.tracks.some(track =>
    track?.skillCasts.some(skillCast => skillCast.id === skillCastId),
  );
}

function findSkillCast(scenario: ScenarioDocument, skillCastId: string) {
  for (const track of scenario.tracks) {
    const skillCast = track?.skillCasts.find(candidate => candidate.id === skillCastId);
    if (skillCast !== undefined) return skillCast;
  }
  return null;
}

/** 建立一条技能块到技能块的连接；非法、自连和重复连接不会产生历史记录。 */
export function createSkillCastConnection(
  scenario: ScenarioDocument,
  input: CreateSkillCastConnectionInput,
): ScenarioDocument {
  if (
    input.fromSkillCastId === input.toSkillCastId ||
    !containsSkillCast(scenario, input.fromSkillCastId) ||
    !containsSkillCast(scenario, input.toSkillCastId) ||
    scenario.connections.some(
      connection =>
        connection.from.skillCastId === input.fromSkillCastId &&
        connection.to.skillCastId === input.toSkillCastId,
    )
  ) {
    return scenario;
  }

  const connection: ConnectionDocument = {
    id: input.id,
    consumption: input.consumption ?? false,
    from: {
      kind: 'skillCast',
      skillCastId: input.fromSkillCastId,
      port: input.fromPort,
    },
    to: {
      kind: 'skillCast',
      skillCastId: input.toSkillCastId,
      port: input.toPort,
    },
  };
  return { ...scenario, connections: [...scenario.connections, connection] };
}

/** 建立一条技能块到具体命中点的连接；来源与目标必须存在，目标 stepKey 必须在命中标记中。 */
export function createDamageHitConnection(
  scenario: ScenarioDocument,
  input: CreateDamageHitConnectionInput,
): ScenarioDocument {
  if (input.fromSkillCastId === input.toSkillCastId) return scenario;
  const fromCast = findSkillCast(scenario, input.fromSkillCastId);
  const toCast = findSkillCast(scenario, input.toSkillCastId);
  if (fromCast === null || toCast === null) return scenario;
  if (!input.targetMarkers.some(marker => marker.stepKey === input.toStepKey)) return scenario;
  if (
    scenario.connections.some(
      connection =>
        connection.from.kind === 'skillCast' &&
        connection.from.skillCastId === input.fromSkillCastId &&
        connection.to.kind === 'damageHit' &&
        connection.to.skillCastId === input.toSkillCastId &&
        connection.to.stepKey === input.toStepKey,
    )
  ) {
    return scenario;
  }

  const connection: ConnectionDocument = {
    id: input.id,
    consumption: input.consumption ?? false,
    from: {
      kind: 'skillCast',
      skillCastId: input.fromSkillCastId,
      port: input.fromPort,
    },
    to: {
      kind: 'damageHit',
      skillCastId: input.toSkillCastId,
      stepKey: input.toStepKey,
    },
  };
  return { ...scenario, connections: [...scenario.connections, connection] };
}

/** 删除指定连接；找不到连接时保持文档引用不变。 */
export function removeTimelineConnection(
  scenario: ScenarioDocument,
  connectionId: string,
): ScenarioDocument {
  if (!scenario.connections.some(connection => connection.id === connectionId)) return scenario;
  return {
    ...scenario,
    connections: scenario.connections.filter(connection => connection.id !== connectionId),
  };
}
