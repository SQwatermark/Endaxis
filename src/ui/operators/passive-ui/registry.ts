import type { Component } from 'vue';
import type { OperatorPassiveUiAppearance } from '../../../../packages/game-data-contract/src/operators';
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
  },
  laevatainCounter: {
    component: LaevatainPassiveUi,
    width: 32,
    height: 32,
  },
  zhuangFangyiThunder: {
    component: ZhuangFangyiPassiveUi,
    width: 56,
    height: 56,
  },
  arcaneSigils: { component: ArcanePassiveUi, width: 44, height: 36 },
  liinoMusic: {
    component: LiinoPassiveUi,
    width: 68,
    height: 60,
  },
  typhoeaArrows: {
    component: TyphoeaPassiveUi,
    width: 76,
    height: 56,
  },
} as const satisfies {
  [Appearance in OperatorPassiveUiAppearance]: {
    component: Component;
    width: number;
    height: number;
  };
};
