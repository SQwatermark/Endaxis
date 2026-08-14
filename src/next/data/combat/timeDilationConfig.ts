/**
 * 当前游戏数据版本的公共时间膨胀配置。
 * 技能只保存动作参数；跨技能共享的优先级、槽位规则和命名曲线在这里统一装配。
 */
import { compileTimeScaleCurve } from '../../core/combat/runtime/timeScaleCurve';
import type { TimeDilationRuntimeConfig } from '../../core/combat/runtime/timeDilationRuntime';

const priorities = new Map([
  [-1742631616, 100],
  [-2059842104, 10],
  [-361293424, 50],
  [1718594970, 10],
  [1798502681, 20],
  [-593023102, 30],
  [451969779, 10],
  [1349735769, 21],
  [-693798243, 15],
  [513129183, 50],
]);

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
  priorities,
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
