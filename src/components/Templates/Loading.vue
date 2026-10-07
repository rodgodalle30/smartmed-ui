<template>
  <div
    v-if="active"
    :class="[
      isFullPage
        ? 'fixed inset-0 flex items-center justify-center'
        : 'absolute inset-0 flex items-center justify-center',
      'z-[9999]',
    ]"
    :style="{
      backgroundColor: isFullPage
        ? backgroundColor || 'rgba(255,255,255,0.8)'
        : 'transparent',
    }"
  >
    <!-- Spinner container -->
    <div
      class="relative flex items-center justify-center"
      :style="{ width: width + 'px', height: height + 'px', color: color }"
    >
      <!-- Spinner (SVG ring) -->
      <svg
        v-if="loader === 'spinner'"
        class="animate-spin w-full h-full"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          stroke-width="3"
          class="opacity-20 fill-none"
        />
        <path
          d="M45 25a20 20 0 00-8-15"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          class="opacity-90 fill-none"
        />
      </svg>

      <!-- Fallback simple loaders -->
      <div v-else-if="loader === 'dots'">Loading...</div>
      <div v-else-if="loader === 'bars'">Loading...</div>

      <!-- CENTER SLOT -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  active: { type: Boolean, default: false },
  loader: { type: String, default: "spinner" },
  isFullPage: { type: Boolean, default: true },
  backgroundColor: { type: String, default: "rgba(255,255,255,0.8)" },
  color: { type: String, default: "var(--system-color, #475569)" },
  height: { type: Number, default: 150 },
  width: { type: Number, default: 150 },
});
</script>

<style scoped>
/* Ensure spinner respects prop color */
svg {
  color: inherit;
}
</style>
