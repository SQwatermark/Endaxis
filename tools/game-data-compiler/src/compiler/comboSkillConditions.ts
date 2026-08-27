import type { ComboSkillConditionSource } from '../source/comboSkillConditions.ts';
import type { CompiledAbilitySystemBlackboardsSource } from './abilitySystemBlackboards.ts';
import { requireNonEmptyString } from '../source/primitives.ts';
import { compileCombatConditionSequenceSource } from './buffRuntimeProjection.ts';
import type { CombatActionProjectionContextSource } from './combatProjectionCommon.ts';
import type { CompiledBuffSequenceSource } from './combatActionProjectionTypes.ts';

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

/** 供正式定义渲染的字段投影；来源记录另存审计，不能混入项目定义。 */
export function compileComboSkillConditionDefinitionSource(
  source: ComboSkillConditionSource,
  blackboards: CompiledAbilitySystemBlackboardsSource,
  binding: { readonly key: string; readonly skillGroupKey: string },
  context: CombatActionProjectionContextSource,
) {
  const compiled = compilePendingComboConditionSource(source, context);
  return {
    source: { condition: compiled.source, blackboards: blackboards.source },
    definition: {
      key: requireNonEmptyString(binding.key, `${source.sourcePath}.binding.key`),
      skillGroupKey: requireNonEmptyString(
        binding.skillGroupKey,
        `${source.sourcePath}.binding.skillGroupKey`,
      ),
      event: compiled.event,
      initialValues:
        blackboards.comboConditionInitialValues === null
          ? null
          : { ...blackboards.comboConditionInitialValues },
      sequence: compiled.sequence,
    },
  };
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
  if (
    'metadata' in value &&
    typeof value.metadata === 'object' &&
    value.metadata !== null &&
    'enabled' in value.metadata &&
    value.metadata.enabled === false
  )
    return;
  // 原生 DebugPrint fallback 不读取目标/黑板，不能被关闭字段中的 Target 假阻塞。
  if (
    'family' in value &&
    value.family === 'presentation' &&
    'action' in value &&
    typeof value.action === 'object' &&
    value.action !== null &&
    'kind' in value.action &&
    value.action.kind === 'debugPrint'
  )
    return;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'targetSource' && child === 'Target') {
      throw new Error(`${path}: combo InputTarget projection is not installed`);
    }
    rejectUnboundInputTargets(child, `${path}.${key}`);
  }
}
