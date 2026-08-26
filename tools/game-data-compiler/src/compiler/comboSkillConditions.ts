import type { ComboSkillConditionSource } from '../source/comboSkillConditions.ts';
import {
  compileCombatConditionSequenceSource,
  type CombatActionProjectionContextSource,
  type CompiledBuffSequenceSource,
} from './buffRuntimeProjection.ts';

const INFLICTION_COMBO_EVENTS = {
  126: 'beforeOutputInfliction',
  121: 'beforeTakeInfliction',
  129: 'afterOutputInfliction',
  130: 'afterTakeInfliction',
} as const;

export interface CompiledComboConditionSource {
  readonly source: ComboSkillConditionSource;
  readonly event: (typeof INFLICTION_COMBO_EVENTS)[keyof typeof INFLICTION_COMBO_EVENTS];
  readonly sequence: CompiledBuffSequenceSource;
}

/** 只编译已审计的四类附着 Pending 注册；不猜 immediate、主控/支援过滤或其他事件目标。 */
export function compilePendingComboConditionSource(
  source: ComboSkillConditionSource,
  context: CombatActionProjectionContextSource,
): CompiledComboConditionSource {
  if (source.immediately)
    throw new Error(`${source.sourcePath}: immediate combo conditions are unsupported`);
  if (!Object.hasOwn(INFLICTION_COMBO_EVENTS, source.nativeEvent)) {
    throw new Error(`${source.sourcePath}: unaudited combo event ${source.nativeEvent}`);
  }
  rejectUnboundInputTargets(source.sequence, source.sourcePath);
  return {
    source,
    event: INFLICTION_COMBO_EVENTS[source.nativeEvent as keyof typeof INFLICTION_COMBO_EVENTS],
    sequence: compileCombatConditionSequenceSource(source.sequence, context),
  };
}

/** 公共 Buff 投影的 Target 是物理 eventTarget，不能套到连携 InputTarget。未接适配前严格拒绝。 */
function rejectUnboundInputTargets(value: unknown, path: string): void {
  if (value === null || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'targetSource' && child === 'Target') {
      throw new Error(`${path}: combo InputTarget projection is not installed`);
    }
    rejectUnboundInputTargets(child, `${path}.${key}`);
  }
}
