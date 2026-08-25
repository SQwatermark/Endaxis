import type { ProjectedBuildDamageScale } from './buildAttributeProjection.ts';

/** 干员构筑来源无法直接进入正式定义时的统一诊断。 */
export interface BuildDefinitionDiagnosticSource {
  readonly status: 'scenario-omitted' | 'blocked';
  readonly sourcePath: string;
  readonly reason: string;
}

/** 武器与装备共用的 Next 静态构筑修正。 */
export type CompiledBuildModifierDefinitionSource =
  | {
      readonly kind: 'attribute';
      readonly attribute: 'strength' | 'agility' | 'intellect' | 'will' | 'main' | 'secondary';
      readonly operation: 'flat' | 'percent';
      readonly value: readonly number[];
    }
  | {
      readonly kind: 'panelStat';
      readonly stat:
        | 'attackFlat'
        | 'attackPercent'
        | 'healthFlat'
        | 'healthPercent'
        | 'criticalRate'
        | 'artsIntensity'
        | 'ultimateEnergyGainEfficiency'
        | 'staggerDamagePercent';
      readonly value: readonly number[];
    }
  | {
      readonly kind: 'damageScale';
      readonly target: ProjectedBuildDamageScale;
      readonly slot: 'baseAddition' | 'addition';
      readonly value: readonly number[];
    }
  | {
      readonly kind: 'staticHealingIncrease';
      readonly target: 'output';
      readonly value: readonly number[];
    }
  | {
      readonly kind: 'skillCooldownMultiplier';
      readonly skillTypes: 'comboSkill';
      readonly value: readonly number[];
    };
