<script setup lang="ts">
/**
 * 角色专属 HUD prefab 的静态状态复刻。
 * 纹理来自 1.4.4 manifest 451359 的五个原生 charpassiveui prefab；
 * 动画、闪烁与音效不进入只读时间轴，但层数、模式和进度使用原生图形表达。
 */
import { computed } from 'vue';
import type { OperatorPassiveUiAppearance } from '../../../../../packages/game-data-contract/src/operators';

const props = withDefaults(
  defineProps<{
    appearance: OperatorPassiveUiAppearance;
    value?: number;
    maximum?: number;
    active?: boolean;
    mode?: 'normal' | 'ultimate';
    ratio?: number | null;
    height?: number;
    maxWidth?: number | null;
  }>(),
  {
    value: 0,
    maximum: 0,
    active: false,
    mode: 'normal',
    ratio: null,
    height: 20,
    maxWidth: null,
  },
);

const nativeSize = computed(() => {
  switch (props.appearance) {
    case 'tangtangDroplets':
      return { width: 64, height: 44 };
    case 'laevatainCounter':
      return { width: 32, height: 32 };
    case 'zhuangFangyiThunder':
      return { width: 56, height: 48 };
    case 'arcaneSigils':
      return { width: 44, height: 36 };
    case 'liinoMusic':
      return { width: 68, height: 60 };
  }
});

const nativeScale = computed(() =>
  Math.min(
    props.height / nativeSize.value.height,
    props.maxWidth === null ? Number.POSITIVE_INFINITY : props.maxWidth / nativeSize.value.width,
  ),
);

const rootStyle = computed(() => {
  const scale = nativeScale.value;
  return {
    width: `${nativeSize.value.width * scale}px`,
    height: `${nativeSize.value.height * scale}px`,
  };
});

const canvasStyle = computed(() => ({
  width: `${nativeSize.value.width}px`,
  height: `${nativeSize.value.height}px`,
  transform: `scale(${nativeScale.value})`,
}));

const progressRatio = computed(() => Math.max(0, Math.min(1, props.ratio ?? 1)));
const progressClip = computed(() => `inset(${(1 - progressRatio.value) * 100}% 0 0 0)`);
const tangtangFillColor = computed(() =>
  props.value >= 2 ? 'rgb(128 182 255)' : props.value >= 1 ? 'white' : 'rgb(98 98 98)',
);
const zhuangPointPositions: readonly (readonly [number, number])[] = [
  [-13.94, 0],
  [-7.1, 6.9],
  [-0.2, 13.7],
  [-7.15, -6.875],
  [-0.25, 0],
  [6.7, 6.875],
  [-0.25, -13.75],
  [6.575, -6.875],
  [13.5, 0],
];
const zhuangPoints = zhuangPointPositions.map(([x, y], index) => ({
  index: index + 1,
  left: 15.5 + x,
  top: 14 - y,
}));
const zhuangPointColor = (index: number) => {
  if (index > props.value) return 'rgb(122 122 122)';
  return props.value >= 9 ? 'rgb(255 151 151)' : 'rgb(151 255 229)';
};
const arcanePartColor = (part: 1 | 2) => {
  if (props.value === 1) return part === 1 ? 'white' : 'rgb(68 67 67)';
  if (props.value === 2) return 'rgb(35 231 188)';
  return 'rgb(68 67 67)';
};
</script>

<template>
  <span
    class="operator-passive-widget"
    :class="[`is-${appearance}`, { 'is-active': active }]"
    :style="rootStyle"
    aria-hidden="true"
  >
    <span class="operator-passive-widget__canvas" :style="canvasStyle">
      <template v-if="appearance === 'tangtangDroplets'">
        <span class="tangtang-droplet">
          <span class="tangtang-fill" :style="{ backgroundColor: tangtangFillColor }" />
          <img src="/next/passive-ui/tangtang-droplet-border.png" alt="" />
        </span>
      </template>

      <template v-else-if="appearance === 'laevatainCounter'">
        <img class="native-fill" src="/next/passive-ui/laevatain-bg.png" alt="" />
        <img
          v-if="value >= maximum"
          class="native-fill"
          src="/next/passive-ui/laevatain-max.png"
          alt=""
        />
        <template v-else>
          <img
            v-for="index in Math.min(value, 4)"
            :key="index"
            class="laevatain-leaf"
            :class="`laevatain-leaf--${index}`"
            src="/next/passive-ui/laevatain-leaf.png"
            alt=""
          />
        </template>
      </template>

      <template v-else-if="appearance === 'zhuangFangyiThunder'">
        <img
          v-if="active"
          class="zhuang-glow"
          src="/next/passive-ui/zhuang-fangyi-glow.png"
          alt=""
        />
        <img class="native-fill" src="/next/passive-ui/zhuang-fangyi-frame.png" alt="" />
        <span
          v-for="point in zhuangPoints"
          :key="point.index"
          class="zhuang-point"
          :style="{
            left: `${point.left}px`,
            top: `${point.top}px`,
            backgroundColor: zhuangPointColor(point.index),
          }"
        />
      </template>

      <template v-else-if="appearance === 'arcaneSigils'">
        <template v-if="value > 0">
          <img class="arcane-frame" src="/next/passive-ui/arcane-frame.png" alt="" />
          <span
            class="arcane-energy arcane-energy--part-1"
            :style="{ backgroundColor: arcanePartColor(1) }"
          />
          <span
            class="arcane-energy arcane-energy--part-2"
            :style="{ backgroundColor: arcanePartColor(2) }"
          />
        </template>
      </template>

      <template v-else>
        <img class="liino-ring" src="/next/passive-ui/liino-bg.png" alt="" />
        <img class="liino-deco" src="/next/passive-ui/liino-deco.png" alt="" />
        <img
          class="liino-note-bg"
          :src="
            mode === 'ultimate'
              ? '/next/passive-ui/liino-ultimate-bg.png'
              : '/next/passive-ui/liino-normal-bg.png'
          "
          alt=""
        />
        <img
          class="liino-note-bar"
          :src="
            mode === 'ultimate'
              ? '/next/passive-ui/liino-ultimate-bar.png'
              : '/next/passive-ui/liino-normal-bar.png'
          "
          :style="{ clipPath: progressClip }"
          alt=""
        />
        <img
          v-if="ratio !== null"
          class="liino-star liino-star--big"
          src="/next/passive-ui/liino-big-star.png"
          alt=""
        />
        <img
          v-if="ratio !== null"
          class="liino-star liino-star--small"
          src="/next/passive-ui/liino-small-star.png"
          alt=""
        />
      </template>
    </span>
  </span>
</template>

<style scoped>
.operator-passive-widget {
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
  overflow: visible;
  vertical-align: middle;
}

.operator-passive-widget__canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  transform-origin: left top;
}

.operator-passive-widget img,
.tangtang-droplet {
  position: absolute;
  display: block;
}

.native-fill {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.tangtang-droplet {
  top: 0;
  left: 0;
  width: 48px;
  height: 44px;
}

.tangtang-droplet img {
  inset: 0;
  width: 48px;
  height: 44px;
}

.tangtang-fill,
.zhuang-point,
.arcane-energy {
  position: absolute;
  display: block;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.tangtang-fill {
  inset: 0;
  mask-image: url('/next/passive-ui/tangtang-droplet.png');
}

.laevatain-leaf {
  width: 16px;
  height: 16px;
}

.laevatain-leaf--1 {
  top: 2px;
  left: 15px;
}

.laevatain-leaf--2 {
  top: 14px;
  left: 15px;
  transform: scaleY(-1);
}

.laevatain-leaf--3 {
  top: 14px;
  left: 1px;
  transform: scale(-1);
}

.laevatain-leaf--4 {
  top: 2px;
  left: 1px;
  transform: scaleX(-1);
}

.is-laevatainCounter .native-fill {
  width: 32px;
  height: 32px;
}

.zhuang-glow {
  top: -4px;
  left: 0;
  width: 56px;
  height: 56px;
}

.is-zhuangFangyiThunder > .operator-passive-widget__canvas > .native-fill {
  top: -2px;
  left: -0.5px;
  width: 44px;
  height: 44px;
}

.zhuang-point {
  width: 12px;
  height: 12px;
  mask-image: url('/next/passive-ui/zhuang-fangyi-active-point.png');
}

.arcane-frame {
  top: -1.5px;
  left: 2px;
  width: 42px;
  height: 33px;
}

.arcane-energy {
  top: 3px;
  width: 18px;
  height: 24px;
}

.arcane-energy--part-1 {
  left: 6.25px;
  mask-image: url('/next/passive-ui/arcane-energy-1.png');
}

.arcane-energy--part-2 {
  left: 22.25px;
  mask-image: url('/next/passive-ui/arcane-energy-2.png');
}

.liino-ring {
  top: 8px;
  left: 12px;
  width: 44px;
  height: 44px;
}

.liino-deco {
  top: 10px;
  left: 14px;
  width: 40px;
  height: 40px;
}

.liino-note-bg {
  top: 1px;
  left: 11px;
  width: 52px;
  height: 56px;
}

.liino-note-bar {
  top: 12px;
  left: 16px;
  width: 32px;
  height: 36px;
}

.is-liinoMusic .liino-note-bg[src*='ultimate'] {
  left: 2.75px;
  width: 56px;
}

.is-liinoMusic .liino-note-bar[src*='ultimate'] {
  top: 10px;
  left: 8.75px;
  width: 44px;
  height: 40px;
}

.liino-star--big {
  top: 24px;
  left: 14px;
  width: 28px;
  height: 28px;
}

.liino-star--small {
  top: 2px;
  left: 43px;
  width: 28px;
  height: 28px;
}
</style>
