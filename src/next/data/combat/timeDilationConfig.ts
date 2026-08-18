/**
 * 当前游戏数据版本的公共时间膨胀配置。
 * 技能生成时已把版本相关优先级标签降为数值；槽位规则和命名曲线仍在这里统一装配。
 */
import { compileTimeScaleCurve } from '../../core/combat/runtime/timeScaleCurve';
import type { TimeDilationRuntimeConfig } from '../../core/combat/runtime/timeDilationRuntime';

const resetToOne = compileTimeScaleCurve([
  { time: 0, value: 1, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 },
  { time: 1, value: 1, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 },
]);

const comboSkill = compileTimeScaleCurve([
  {
    time: 0,
    value: 0.01,
    inTangent: 0.000489342,
    outTangent: 0.000489342,
    weightedMode: 2,
    inWeight: 0,
    outWeight: 1,
  },
  {
    time: 1,
    value: 1,
    inTangent: 8.798947,
    outTangent: 8.798947,
    weightedMode: 1,
    inWeight: 0.102117956,
    outWeight: 0,
  },
]);

export const timeDilationRuntimeConfig: TimeDilationRuntimeConfig = Object.freeze({
  entityLifetimeUsesGlobalScaleBySlot: new Map([
    [-1855252810, true],
    [197328068, true],
  ]),
  curves: new Map([
    ['RESETto1', resetToOne],
    ['ComboSkill', comboSkill],
  ]),
});

/** 标准入口的默认模式；调用方可传入原生模式值覆盖。 */
export const STANDARD_TIME_MANAGER_DELTA_MODE = 0;
