import { describe, expect, it } from 'vitest';
import { evaluateTimeScaleCurve } from '../../core/combat/runtime/timeScaleCurve';
import { timeDilationRuntimeConfig } from './timeDilationConfig';
import {
  TIME_DILATION_NAMED_CURVE_DEFINITIONS,
  TIME_DILATION_NAMED_CURVE_KEYS,
  TIME_DILATION_SLOT_DEFINITIONS,
  timeDilationSlotName,
} from './timeDilationCatalog';

describe('time-dilation version catalog', () => {
  it('maps recovered slot ids to exact GameplayTag paths', () => {
    expect(timeDilationSlotName(1464849466)).toBe('TimeDilation/Layer/Entity/HitStop');
    expect(timeDilationSlotName(-1855252810)).toBe('TimeDilation/Layer/Entity/Frozen');
    expect(timeDilationSlotName(197328068)).toBe('TimeDilation/Layer/Entity/Seal');
    expect(timeDilationSlotName(-1660475044)).toBe('TimeDilation/Layer/Global/UltiSkill');
    expect(TIME_DILATION_SLOT_DEFINITIONS).toHaveLength(8);
    expect(timeDilationSlotName(0)).toBeUndefined();
  });

  it('exposes every curve recovered from the shared native config', () => {
    expect(TIME_DILATION_NAMED_CURVE_KEYS).toEqual([
      'forge_iron_hitstop',
      'indie_dg002_travel_guide',
      'interactive_behit_plant',
      'interactive_behit_mine',
      'RESETto1',
      'interrupt_weakness',
      'ComboSkill',
    ]);
    expect(TIME_DILATION_NAMED_CURVE_DEFINITIONS.interrupt_weakness).toHaveLength(3);
    expect(
      evaluateTimeScaleCurve(TIME_DILATION_NAMED_CURVE_DEFINITIONS.interrupt_weakness, 0.618),
    ).toBeCloseTo(0.01);
  });

  it('assembles the runtime from the same definitions used by the editor', () => {
    expect([...timeDilationRuntimeConfig.curves!.keys()]).toEqual(TIME_DILATION_NAMED_CURVE_KEYS);
    for (const name of TIME_DILATION_NAMED_CURVE_KEYS) {
      expect(timeDilationRuntimeConfig.curves!.get(name)?.(0)).toBeCloseTo(
        TIME_DILATION_NAMED_CURVE_DEFINITIONS[name][0]!.value,
      );
    }
  });
});
