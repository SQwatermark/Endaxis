/**
 * 元素附着步骤与目标 Buff 容器、关卡事件之间的装配点。
 * 必须在操作序列给定的位置同步执行，不能由投影层根据伤害结果事后补算。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import {
  resolveElementalInfliction,
  type ElementalInflictionOperation,
  type ElementalInflictionOutcomeKind,
  type ExistingElementalAttachment,
} from '../infliction/elementalInfliction';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { CombatSkillCastInfo } from './skillCastInfo';

type RuntimeOperation = ResolvedCombatOperationStep;
type InflictionStep = Extract<RuntimeOperation, { kind: 'applyElementalInfliction' }>;

export const ELEMENTAL_INFLICTION_EVENTS = [
  'beforeOutputInfliction',
  'beforeTakeInfliction',
  'afterOutputInfliction',
  'afterTakeInfliction',
] as const;
/** 元素附着执行阶段向来源方和目标方发布的事件。 */
export type ElementalInflictionEvent = (typeof ELEMENTAL_INFLICTION_EVENTS)[number];

/** 同一次元素附着事件中保持不变的来源、目标和技能信息。 */
export interface ElementalInflictionEventPayload {
  readonly sourceId: string;
  readonly targetId: string;
  readonly skillId: string;
  readonly element: InflictionStep['parameters']['element'];
  readonly isExtra: boolean;
  readonly skillCastInfo?: CombatSkillCastInfo;
}

/** 元素附着执行节点所需的状态读写、事件、回执和后继执行端口。 */
export interface ElementalInflictionOperationDependencies {
  readonly sourceOperatorId: string;
  /** 存档中的技能释放身份；附着回执凭它与具体施放对应。单元测试程序可能缺失。 */
  readonly castId?: string;
  readonly targetId: string;
  readonly skillId: string;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly getExistingAttachment: () => ExistingElementalAttachment | null;
  readonly applyOperation: (
    operation: ElementalInflictionOperation,
    skillCastInfo: CombatSkillCastInfo | undefined,
  ) => void;
  /** 原生 OnConsumeBuff 对应事实：附着层已从目标容器中实际移除后同步报告。 */
  readonly emitSemanticAttachmentConsumed?: (attachment: ExistingElementalAttachment) => void;
  /** 附着状态已经写入目标后，向统一语义事件层报告实际施加的元素。 */
  readonly emitSemanticInfliction?: (element: InflictionStep['parameters']['element']) => void;
  readonly triggerSpellBurst?: (payload: {
    readonly burstType: 'Fire' | 'Pulse' | 'Cryst' | 'Natural';
    readonly sourceId: string;
    readonly skillCastInfo?: CombatSkillCastInfo;
  }) => void;
  readonly emitSourceEvent: (
    event: ElementalInflictionEvent,
    payload: ElementalInflictionEventPayload,
  ) => void;
  readonly emitTargetEvent: (
    event: ElementalInflictionEvent,
    payload: ElementalInflictionEventPayload,
  ) => void;
  readonly delegate: CombatOperationExecutor;
}

/** 在目标解析后、后续命中步骤前执行一次附着。 */
export class ElementalInflictionOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: ElementalInflictionOperationDependencies) {}

  prepare(step: ResolvedCombatOperationStep, context: CombatOperationContext): void {
    this.dependencies.delegate.prepare?.(step, context);
  }

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'triggerSpellBurst') {
      if (this.dependencies.triggerSpellBurst === undefined)
        throw new Error(`spell burst '${step.parameters.burstType}' has no runtime port`);
      this.dependencies.triggerSpellBurst({
        burstType: step.parameters.burstType,
        sourceId: context?.buffSourceId ?? this.dependencies.sourceOperatorId,
        ...(context?.skillCastInfo === undefined ? {} : { skillCastInfo: context.skillCastInfo }),
      });
      return true;
    }
    if (step.kind !== 'applyElementalInfliction') {
      return context === undefined
        ? this.dependencies.delegate.execute(step)
        : this.dependencies.delegate.execute(step, context);
    }
    // 当前附着适配器只绑定一个敌方容器。保留 Owner 身份并在产生任何事件前校验，
    // 避免把挂在干员或能力实体上的动作悄悄转成对木桩施加附着。
    if (step.parameters.target === 'buffOwner') {
      if (context?.buffOwnerId === undefined)
        throw new Error("elemental infliction target 'buffOwner' requires a Buff lifecycle owner");
      if (context.buffOwnerId !== this.dependencies.targetId)
        throw new Error(
          `elemental infliction target '${context.buffOwnerId}' is not the bound enemy`,
        );
    }
    const payload: ElementalInflictionEventPayload = {
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      skillId: this.dependencies.skillId,
      element: step.parameters.element,
      isExtra: step.parameters.isExtra,
      ...(context?.skillCastInfo === undefined ? {} : { skillCastInfo: context.skillCastInfo }),
    };
    this.dependencies.emitSourceEvent('beforeOutputInfliction', payload);
    this.dependencies.emitTargetEvent('beforeTakeInfliction', payload);
    const existing = this.dependencies.getExistingAttachment();
    const operations = resolveElementalInfliction(step.parameters.element, existing);
    for (const operation of operations) {
      this.dependencies.applyOperation(operation, context?.skillCastInfo);
      if (operation.kind === 'consumeAttachment') {
        this.dependencies.emitSemanticAttachmentConsumed?.(operation.attachment);
      }
    }
    this.dependencies.emitSourceEvent('afterOutputInfliction', payload);
    this.dependencies.emitTargetEvent('afterTakeInfliction', payload);
    const current = this.dependencies.getExistingAttachment();
    const compound = operations.find(operation => operation.kind === 'createCompoundStatus');
    const outcomeKind: ElementalInflictionOutcomeKind = operations.some(
      operation => operation.kind === 'triggerBurst',
    )
      ? 'burst'
      : compound === undefined
        ? 'attachmentOnly'
        : 'compoundStatus';
    this.dependencies.receipt.record({
      frame: this.dependencies.clock.frame,
      time: this.dependencies.clock.time,
      event: 'ElementalInflictionApplied',
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      data: {
        skillId: this.dependencies.skillId,
        ...(this.dependencies.castId === undefined ? {} : { castId: this.dependencies.castId }),
        requestedElement: step.parameters.element,
        isExtra: payload.isExtra,
        previousElement: existing?.element ?? null,
        previousLayers: existing?.layers ?? 0,
        currentElement: current?.element ?? null,
        currentLayers: current?.layers ?? 0,
        outcomeKind,
        ...(compound === undefined
          ? {}
          : {
              consumedElement: compound.consumedElement,
              consumedLayers: compound.consumedLayers,
            }),
        operationKinds: operations.map(operation => operation.kind).join(','),
      },
    });
    this.dependencies.emitSemanticInfliction?.(step.parameters.element);
    return true;
  }

  end(
    step: Parameters<NonNullable<CombatOperationExecutor['end']>>[0],
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }
}
