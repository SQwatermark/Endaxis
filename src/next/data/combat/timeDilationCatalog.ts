/**
 * 1.4.4 `TimeDilationConfig` 与 `GameplayTagConfig` 的版本化投影。
 *
 * 槽位 ID 是完整 GameplayTag 路径的 CRC-32 位模式，不是可排序的序号。
 * 公共曲线保持原生关键帧；运行时与编辑器必须消费同一份定义。
 */
import type { TimeScaleCurveKeyDefinition } from '../../core/game-data/operatorDefinition';

export interface TimeDilationSlotDefinition {
  readonly id: number;
  readonly name: string;
  readonly scope: 'global' | 'entity';
}

export const TIME_DILATION_SLOT_DEFINITIONS = Object.freeze([
  { id: -1660475044, name: 'TimeDilation/Layer/Global/UltiSkill', scope: 'global' },
  { id: -693453437, name: 'TimeDilation/Layer/Global/GamePlay', scope: 'global' },
  { id: 1464849466, name: 'TimeDilation/Layer/Entity/HitStop', scope: 'entity' },
  { id: -1855252810, name: 'TimeDilation/Layer/Entity/Frozen', scope: 'entity' },
  { id: -1451582143, name: 'TimeDilation/Layer/Entity/DashSucceed', scope: 'entity' },
  { id: 257664179, name: 'TimeDilation/Layer/Entity/VisualAdjust', scope: 'entity' },
  { id: -1767339671, name: 'TimeDilation/Layer/Entity/UltTangtang', scope: 'entity' },
  { id: 197328068, name: 'TimeDilation/Layer/Entity/Seal', scope: 'entity' },
] as const satisfies readonly TimeDilationSlotDefinition[]);

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

export function timeDilationSlotName(slotId: number): string | undefined {
  return TIME_DILATION_SLOT_DEFINITIONS.find(slot => slot.id === slotId)?.name;
}
