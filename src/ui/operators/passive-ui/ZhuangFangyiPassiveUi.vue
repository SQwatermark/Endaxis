<script setup lang="ts">
import type { PassiveUiWidgetState } from './state';
const props = defineProps<PassiveUiWidgetState>();
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
</script>
<template>
  <span class="passive-ui-skin">
    <img v-if="active" class="zhuang-glow" src="/next/passive-ui/zhuang-fangyi-glow.png" alt="" />
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
  </span>
</template>
<style scoped>
.passive-ui-skin {
  display: contents;
}
img {
  position: absolute;
  display: block;
}
.native-fill {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.zhuang-point {
  position: absolute;
  display: block;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
}

.zhuang-glow {
  top: -4px;
  left: 0;
  width: 56px;
  height: 56px;
}

.native-fill {
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
</style>
