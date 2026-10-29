import type { BuffInterventionDocument } from '../../project/schema';
import type { BuffInterventionReference } from '../../game-data/buffInterventionCatalog';
import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type { BuffOperationTarget } from '../buffs/buffOperationExecutor';
import type { BuffApplicationAdmissionRequest } from '../buffs/combatBuffs';
import type { BuffReference } from '../state/foundationState';
import type { CombatReceiptSink } from '../receipt/combatReceipt';

export type CompiledBuffIntervention =
  | (Extract<BuffInterventionDocument, { kind: 'apply' }> & {
      readonly definition: ResolvedSkillBuffDefinition;
    })
  | Exclude<BuffInterventionDocument, { kind: 'apply' }>;

export interface BuffInterventionProgram {
  readonly plans: readonly CompiledBuffIntervention[];
  /** Contains the entire catalog, including collisions; ambiguous natural identities are rejected by compilation. */
  readonly provenance: readonly {
    readonly reference: BuffInterventionReference;
    readonly definitionOwnerIds: readonly string[];
  }[];
}

/** Only data is copied into a checkpoint; fixed plans remain in the application program. */
export interface BuffInterventionState {
  readonly processedIds: Set<string>;
  readonly applications: Map<string, BuffReference>;
  readonly activeSuppressionIds: Set<string>;
}

export function createBuffInterventionState(): BuffInterventionState {
  return { processedIds: new Set(), applications: new Map(), activeSuppressionIds: new Set() };
}

const APPLICATION_PREFIX = 'buff-intervention:';

function referenceKey(reference: BuffInterventionReference): string {
  return JSON.stringify([
    reference.kind,
    reference.sourceId,
    reference.buffId,
    reference.resourceKind ?? 'buff',
  ]);
}

export class BuffInterventionRuntime {
  constructor(
    readonly program: BuffInterventionProgram,
    readonly state: BuffInterventionState,
    readonly frame: () => number,
    readonly resolveTarget: (id: string) => BuffOperationTarget | undefined,
    readonly receipt: CombatReceiptSink,
  ) {}

  /** Called before initialization and before any natural operation on a new frame. */
  updateSuppression(): void {
    this.state.activeSuppressionIds.clear();
    const frame = this.frame();
    for (const plan of this.program.plans)
      if (plan.kind === 'suppress' && plan.startFrame <= frame && frame < plan.endFrame)
        this.state.activeSuppressionIds.add(plan.id);
  }

  admit(request: BuffApplicationAdmissionRequest): boolean {
    if (this.state.activeSuppressionIds.size === 0) return true;
    const manual = request.sourceActionId?.startsWith(APPLICATION_PREFIX)
      ? this.program.plans.find(
          plan => plan.id === request.sourceActionId!.slice(APPLICATION_PREFIX.length),
        )
      : undefined;
    const candidates = this.program.provenance.filter(
      item => item.reference.buffId === request.buffId,
    );
    const reference =
      manual?.kind === 'apply'
        ? manual.buff
        : candidates.length === 1
          ? candidates[0]!.reference
          : undefined;
    if (reference === undefined) return true;
    for (const plan of this.program.plans) {
      if (plan.kind !== 'suppress' || !this.state.activeSuppressionIds.has(plan.id)) continue;
      const targetId = plan.target.kind === 'enemy' ? 'enemy' : plan.target.operatorId;
      if (
        referenceKey(plan.buff) !== referenceKey(reference) ||
        targetId !== request.targetId ||
        (plan.sourceOperatorId !== undefined && plan.sourceOperatorId !== request.sourceId)
      )
        continue;
      this.record(
        plan,
        'suppressed',
        request.targetId,
        request.sourceId,
        request.globalBuffId === undefined
          ? '施加请求被区间抑制，已有实例保持运行'
          : `全局 Buff ${request.globalBuffId} 的父请求被原子拒绝`,
      );
      return false;
    }
    return true;
  }

  applyCurrentFrame(): void {
    this.updateSuppression();
    for (const plan of this.program.plans) {
      if (
        plan.kind === 'suppress' ||
        plan.frame !== this.frame() ||
        this.state.processedIds.has(plan.id)
      )
        continue;
      this.state.processedIds.add(plan.id);
      if (plan.kind === 'finish') {
        const reference = this.state.applications.get(plan.applicationId);
        const target = reference === undefined ? undefined : this.resolveTarget(reference.ownerId);
        const handle = reference === undefined ? undefined : target?.resolveHandle?.(reference);
        if (handle === undefined || handle.isRecycled || handle.isFinished) {
          this.record(
            plan,
            'notFound',
            reference?.ownerId,
            undefined,
            '本次施加未返回实例，或实例已自然结束/回收',
          );
        } else {
          this.record(
            plan,
            handle.finish('other', null) ? 'finished' : 'notFinishable',
            reference!.ownerId,
            undefined,
            '只操作本计划实际返回的实例；刷新/叠层可能与已有实例共享身份',
            reference!.instanceId,
          );
        }
        continue;
      }
      const targetId = plan.target.kind === 'enemy' ? 'enemy' : plan.target.operatorId;
      const target = this.resolveTarget(targetId);
      if (target?.applyScoped === undefined) {
        this.record(
          plan,
          'targetMissing',
          targetId,
          plan.sourceOperatorId,
          '目标不存在或没有可施加的 Buff 容器',
        );
        continue;
      }
      const before = new Set(target.runtimeState?.memberIds ?? []);
      const beforeStacks = target.getCountByIds([plan.buff.buffId]);
      const suppressed = !this.admit({
        buffId: plan.buff.buffId,
        targetId,
        sourceId: plan.sourceOperatorId,
        definitionOwnerId: plan.sourceOperatorId,
        sourceActionId: `buff-intervention:${plan.id}`,
        definition: plan.definition,
      });
      if (suppressed) {
        this.record(plan, 'suppressed', targetId, plan.sourceOperatorId, '手动施加同样受区间抑制');
        continue;
      }
      const handle = target.applyScoped({
        buffId: plan.buff.buffId,
        definition: plan.definition,
        sourceId: plan.sourceOperatorId,
        definitionOwnerId: plan.sourceOperatorId,
        sourceActionId: `buff-intervention:${plan.id}`,
        blackboardValues: plan.parameters ?? {},
      });
      if (handle === null) {
        this.record(
          plan,
          'rejected',
          targetId,
          plan.sourceOperatorId,
          '原生免疫、冷却或叠层策略拒绝施加',
        );
        continue;
      }
      this.state.applications.set(plan.id, { ...handle.reference });
      const result = before.has(handle.reference.instanceId)
        ? target.getCountByIds([plan.buff.buffId]) > beforeStacks
          ? 'stacked'
          : 'refreshed'
        : plan.definition.stackingType === 'stack' && beforeStacks > 0
          ? 'stacked'
          : 'applied';
      this.record(
        plan,
        result,
        targetId,
        plan.sourceOperatorId,
        result === 'applied'
          ? '新建实例，寿命遵循原定义'
          : '与已有实例共享身份，结束计划会结束该实例',
        handle.reference.instanceId,
      );
    }
  }

  private record(
    plan: CompiledBuffIntervention,
    result: string,
    targetId?: string,
    sourceId?: string,
    detail?: string,
    instanceId?: number,
  ): void {
    this.receipt.record({
      frame: this.frame(),
      time: this.frame() / 30,
      event: 'BuffInterventionResult',
      targetId,
      sourceId,
      data: {
        interventionId: plan.id,
        kind: plan.kind,
        result,
        ...(detail === undefined ? {} : { detail }),
        ...(instanceId === undefined ? {} : { instanceId }),
        ...(plan.kind === 'finish' ? {} : { buffId: plan.buff.buffId }),
      },
    });
  }
}
