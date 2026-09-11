<script setup lang="ts">
import type { PassiveUiWidgetState } from './state';
defineProps<PassiveUiWidgetState>();
</script>
<template>
  <span class="passive-ui-skin">
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

.native-fill {
  width: 32px;
  height: 32px;
}
</style>
