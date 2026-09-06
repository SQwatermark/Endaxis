<script setup lang="ts">
import { useKeyboardInputRegion, useKeyboardShortcutScope } from './keyboardShortcutRouter';

const props = defineProps<{ label: string; active: boolean; modal?: boolean }>();
const region = useKeyboardInputRegion({
  label: props.label,
  modal: props.modal,
  active: () => props.active,
});
// Child editors handle commands first. Unhandled keys remain available to native controls.
useKeyboardShortcutScope({
  id: 'input-region-boundary',
  region,
  priority: -1,
  active: () => props.active,
  blockLowerScopes: true,
  handle: () => false,
});
</script>

<template>
  <slot />
</template>
