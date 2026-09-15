import type { Component } from 'vue';
import type {
  OperatorPassiveUiAppearance,
  OperatorPassiveUiDefinition,
  OperatorPassiveUiDefinitionMap,
} from '../../../../packages/game-data-contract/src/operators';
import TangtangPassiveUi from './TangtangPassiveUi.vue';
import LaevatainPassiveUi from './LaevatainPassiveUi.vue';
import ZhuangFangyiPassiveUi from './ZhuangFangyiPassiveUi.vue';
import ArcanePassiveUi from './ArcanePassiveUi.vue';
import LiinoPassiveUi from './LiinoPassiveUi.vue';
import TyphoeaPassiveUi from './TyphoeaPassiveUi.vue';

/** 显式装配专属外观；通用组件只负责按配方选择、缩放和传递状态。 */
export const passiveUiSkins = {
  tangtangDroplets: {
    component: TangtangPassiveUi,
    width: 48,
    height: 44,
    label: '涡流',
    numeric: true,
  },
  laevatainCounter: {
    component: LaevatainPassiveUi,
    width: 32,
    height: 32,
    label: '熔火',
    numeric: true,
  },
  zhuangFangyiThunder: {
    component: ZhuangFangyiPassiveUi,
    width: 56,
    height: 56,
    label: '青霆剑',
    numeric: true,
  },
  arcaneSigils: { component: ArcanePassiveUi, width: 44, height: 36, label: '破晦', numeric: true },
  liinoMusic: {
    component: LiinoPassiveUi,
    width: 68,
    height: 60,
    label: '演唱姿态',
    numeric: false,
  },
  typhoeaArrows: {
    component: TyphoeaPassiveUi,
    width: 76,
    height: 56,
    label: '猎物清点',
    numeric: true,
  },
} as const satisfies Record<
  OperatorPassiveUiAppearance,
  { component: Component; width: number; height: number; label: string; numeric: boolean }
>;

export const numericPassiveUiAppearances = Object.fromEntries(
  Object.entries(passiveUiSkins)
    .filter(([, skin]) => skin.numeric)
    .map(([key, skin]) => [key, skin.label]),
);

const defaults = {
  numeric: { kind: 'numeric', appearance: 'tangtangDroplets', maximum: 1 },
  buffProgress: {
    kind: 'buffProgress',
    appearance: 'liinoMusic',
    normalBuffId: '',
    ultimateBuffId: '',
  },
  buffCounters: {
    kind: 'buffCounters',
    appearance: 'typhoeaArrows',
    reserveArrowBuffId: '',
    battleArrowBuffId: '',
    pointBuffId: '',
    maximumArrows: 1,
    maximumPoints: 1,
  },
} satisfies OperatorPassiveUiDefinitionMap;

export function createPassiveUiDefinition(
  kind: OperatorPassiveUiDefinition['kind'],
): OperatorPassiveUiDefinition {
  return { ...defaults[kind] };
}
