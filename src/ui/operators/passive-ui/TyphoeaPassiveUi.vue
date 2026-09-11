<script setup lang="ts">
import type { PassiveUiWidgetState } from './state';
defineProps<PassiveUiWidgetState>();
</script>
<template>
  <span class="passive-ui-skin">
    <span class="typhoea-arrows">
      <span
        v-for="index in Math.max(1, maximum)"
        :key="`arrow:${index}`"
        class="typhoea-arrow"
        :class="{ 'is-filled': index <= value }"
      />
    </span>
    <span class="typhoea-points">
      <span
        v-for="index in 8"
        :key="`point:${index}`"
        class="typhoea-point"
        :class="{ 'is-filled': index <= points }"
      />
    </span>
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
.typhoea-arrows,
.typhoea-points {
  position: absolute;
  left: 2px;
  display: flex;
  gap: 3px;
}

.typhoea-arrows {
  top: 4px;
}

.typhoea-points {
  top: 29px;
  gap: 2px;
}

.typhoea-arrow {
  width: 13px;
  height: 18px;
  border: 1px solid rgb(116 127 127 / 80%);
  clip-path: polygon(50% 0, 100% 48%, 68% 48%, 68% 100%, 32% 100%, 32% 48%, 0 48%);
  background: rgb(55 61 61);
}

.typhoea-arrow.is-filled,
.typhoea-point.is-filled {
  border-color: rgb(160 255 241);
  background: rgb(94 231 209);
}

.typhoea-point {
  width: 6px;
  height: 6px;
  border: 1px solid rgb(116 127 127 / 80%);
  border-radius: 50%;
  background: rgb(55 61 61);
}
</style>
