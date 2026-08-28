/**
 * 1.4.4 `TimeDilationConfig` 与 `GameplayTagConfig` 的版本化投影。
 *
 * 槽位直接使用完整 GameplayTag 路径；优先级是原生配置解析后的可排序数值。
 * 公共曲线保持原生关键帧；运行时与编辑器必须消费同一份定义。
 */
import type { TimeScaleCurveKeyDefinition } from '../../core/game-data/operatorDefinition';
import { requireGameplayTag } from './gameplayTagCatalog';

export interface TimeDilationSlotDefinition {
  readonly id: string;
  readonly name: string;
  readonly scope: 'global' | 'entity';
}

export interface TimeDilationPriorityDefinition {
  readonly tagPath: string;
  readonly value: number;
}

function slot(
  name: string,
  scope: TimeDilationSlotDefinition['scope'],
): TimeDilationSlotDefinition {
  return Object.freeze({ id: requireGameplayTag(name), name, scope });
}

function priority(tagPath: string, value: number): TimeDilationPriorityDefinition {
  return Object.freeze({ tagPath, value });
}

export const TIME_DILATION_SLOT_DEFINITIONS = Object.freeze([
  slot('TimeDilation/Layer/Global/UltiSkill', 'global'),
  slot('TimeDilation/Layer/Global/GamePlay', 'global'),
  slot('TimeDilation/Layer/Entity/HitStop', 'entity'),
  slot('TimeDilation/Layer/Entity/Frozen', 'entity'),
  slot('TimeDilation/Layer/Entity/DashSucceed', 'entity'),
  slot('TimeDilation/Layer/Entity/VisualAdjust', 'entity'),
  slot('TimeDilation/Layer/Entity/UltTangtang', 'entity'),
  slot('TimeDilation/Layer/Entity/Seal', 'entity'),
] as const satisfies readonly TimeDilationSlotDefinition[]);

export const TIME_DILATION_PRIORITY_DEFINITIONS = Object.freeze([
  priority('TimeDilation/Priority/UltiSkill', 100),
  priority('TimeDilation/Priority/HitStop', 10),
  priority('TimeDilation/Priority/Frozen', 50),
  priority('TimeDilation/Priority/DashSucceed', 10),
  priority('TimeDilation/Priority/BreakPoise', 20),
  priority('TimeDilation/Priority/ComboSkill', 30),
  priority('TimeDilation/Priority/GlobalSlowMotion', 10),
  priority('TimeDilation/Priority/GlobalSlowMotionPro', 21),
  priority('TimeDilation/Priority/Interrupt', 15),
  priority('TimeDilation/Priority/VisualAdjust', 50),
] as const satisfies readonly TimeDilationPriorityDefinition[]);

export const TIME_DILATION_PRIORITY_OPTIONS = Object.freeze(
  [...new Set(TIME_DILATION_PRIORITY_DEFINITIONS.map(definition => definition.value))]
    .sort((left, right) => left - right)
    .map(value =>
      Object.freeze({
        value,
        tagPaths: TIME_DILATION_PRIORITY_DEFINITIONS.filter(
          definition => definition.value === value,
        ).map(definition => definition.tagPath),
      }),
    ),
);

const key = (
  time: number,
  value: number,
  inTangent: number,
  outTangent: number,
  weightedMode: 0 | 1 | 2 | 3,
  inWeight: number,
  outWeight: number,
): TimeScaleCurveKeyDefinition => ({
  time,
  value,
  inTangent,
  outTangent,
  weightedMode,
  inWeight,
  outWeight,
});

export const TIME_DILATION_NAMED_CURVE_DEFINITIONS = Object.freeze({
  forge_iron_hitstop: Object.freeze([
    key(0, 0.05, 0, 0, 0, 0, 0.33333334),
    key(1, 1, 0.95, 0.95, 0, 0.33333334, 0),
  ]),
  indie_dg002_travel_guide: Object.freeze([
    key(0, 1, 0, 0, 0, 0.33333334, 0.33333334),
    key(0.01, 0.4, -32, -32, 0, 0.33333334, 0.33333334),
    key(0.025, 0.2, -0.40816325, -0.40816325, 0, 0.33333334, 0.33333334),
    key(0.5, 0.15, 0, 0, 0, 0.33333334, 0.33333334),
    key(0.98025024, 0.27664328, 0.57838523, 0.57838523, 0, 0.24554868, 0.33333334),
  ]),
  interactive_behit_plant: Object.freeze([key(0, 0, 0, 0, 0, 0, 0), key(1, 1, 2, 2, 0, 0, 0)]),
  interactive_behit_mine: Object.freeze([
    key(0, 0.05, 0, 0, 0, 0, 0.33333334),
    key(0.38, 0.05, 0, 0, 0, 0.33333334, 0.0938591),
    key(1, 1, 1.532258, 1.532258, 0, 0.33333334, 0),
  ]),
  RESETto1: Object.freeze([key(0, 1, 0, 0, 0, 0, 0), key(1, 1, 0, 0, 0, 0, 0)]),
  interrupt_weakness: Object.freeze([
    key(0, 0, 0, 0, 0, 0, 0.33333334),
    key(0.618, 0.01, 0, 0, 0, 0.33333334, 0.33333334),
    key(1, 1, 2.5916228, 2.5916228, 0, 0.33333334, 0),
  ]),
  ComboSkill: Object.freeze([
    key(0, 0.01, 0.000489342, 0.000489342, 2, 0, 1),
    key(1, 1, 8.798947, 8.798947, 1, 0.102117956, 0),
  ]),
} satisfies Readonly<Record<string, readonly TimeScaleCurveKeyDefinition[]>>);

export type TimeDilationNamedCurveKey = keyof typeof TIME_DILATION_NAMED_CURVE_DEFINITIONS;

export const TIME_DILATION_NAMED_CURVE_KEYS = Object.freeze(
  Object.keys(TIME_DILATION_NAMED_CURVE_DEFINITIONS) as TimeDilationNamedCurveKey[],
);

export function timeDilationNamedCurveKeys(
  keyName: string,
): readonly TimeScaleCurveKeyDefinition[] | undefined {
  return (
    TIME_DILATION_NAMED_CURVE_DEFINITIONS as Readonly<
      Record<string, readonly TimeScaleCurveKeyDefinition[]>
    >
  )[keyName];
}

export function timeDilationSlotName(slotId: string): string | undefined {
  return TIME_DILATION_SLOT_DEFINITIONS.find(slot => slot.id === slotId)?.name;
}
