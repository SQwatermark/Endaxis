/**
 * 当前游戏数据版本的公共时间膨胀配置。
 * 技能生成时已把版本相关优先级标签降为数值；槽位规则和命名曲线仍在这里统一装配。
 */
import { compileTimeScaleCurve } from '../../core/combat/runtime/timeScaleCurve';
import type { TimeDilationRuntimeConfig } from '../../core/combat/runtime/timeDilationRuntime';
import { requireGameplayTagId } from './gameplayTagCatalog';
import { TIME_DILATION_NAMED_CURVE_DEFINITIONS } from './timeDilationCatalog';

const namedCurves = new Map(
  Object.entries(TIME_DILATION_NAMED_CURVE_DEFINITIONS).map(([name, keys]) => [
    name,
    compileTimeScaleCurve(keys),
  ]),
);

export const timeDilationRuntimeConfig: TimeDilationRuntimeConfig = Object.freeze({
  entityLifetimeUsesGlobalScaleBySlot: new Map([
    [requireGameplayTagId('TimeDilation/Layer/Entity/Frozen'), true],
    [requireGameplayTagId('TimeDilation/Layer/Entity/Seal'), true],
  ]),
  curves: namedCurves,
});

/** 标准入口的默认模式；调用方可传入原生模式值覆盖。 */
export const STANDARD_TIME_MANAGER_DELTA_MODE = 0;
