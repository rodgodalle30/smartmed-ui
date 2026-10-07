<script setup>
defineProps({
  type: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-700 shadow-sm transition hover:border-[var(--system-color-border)] hover:bg-[var(--system-color-soft)] hover:text-[var(--system-color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--system-color)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </button>
</template>
