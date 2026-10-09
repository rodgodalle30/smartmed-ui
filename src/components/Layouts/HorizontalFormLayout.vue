<script setup>
import { computed, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  as: {
    type: String,
    default: "div",
  },
  labelMinWidth: {
    type: String,
    default: "9rem",
  },
  labelMaxWidth: {
    type: String,
    default: "12rem",
  },
});

const attrs = useAttrs();

const layoutStyle = computed(() => ({
  "--smartmed-form-label-min-width": props.labelMinWidth,
  "--smartmed-form-label-max-width": props.labelMaxWidth,
}));
</script>

<template>
  <component
    :is="as"
    v-bind="attrs"
    class="smartmed-horizontal-form"
    :style="[layoutStyle, attrs.style]"
  >
    <slot />
  </component>
</template>

<style scoped>
.smartmed-horizontal-form :deep(.smartmed-form-row) {
  display: grid;
  gap: 0.375rem;
  min-width: 0;
}

.smartmed-horizontal-form :deep(.smartmed-form-row > label:first-child) {
  min-width: 0;
  white-space: nowrap;
}

.smartmed-horizontal-form :deep(.smartmed-form-row > :not(label)) {
  min-width: 0;
}

@media (min-width: 640px) {
  .smartmed-horizontal-form :deep(.smartmed-form-row) {
    grid-template-columns:
      minmax(
        var(--smartmed-form-label-min-width),
        var(--smartmed-form-label-max-width)
      )
      repeat(3, minmax(0, 1fr));
    align-items: start;
    column-gap: 1rem;
    row-gap: 0.25rem;
    padding-block: 0.375rem;
  }
}
</style>
