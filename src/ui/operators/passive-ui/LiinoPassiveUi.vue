<script setup lang="ts">
import { computed } from 'vue';
import type { PassiveUiWidgetState } from './state';
const props = defineProps<PassiveUiWidgetState>();
const progressRatio = computed(() => Math.max(0, Math.min(1, props.ratio ?? 1)));
const progressClip = computed(() => `inset(${(1 - progressRatio.value) * 100}% 0 0 0)`);
</script>
<template>
  <span class="passive-ui-skin">
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

.liino-note-bg[src*='ultimate'] {
  left: 2.75px;
  width: 56px;
}

.liino-note-bar[src*='ultimate'] {
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
