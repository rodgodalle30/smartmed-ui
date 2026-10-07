<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-[var(--system-color)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[var(--system-color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--system-color)] focus:ring-offset-2 active:bg-[var(--system-color-active)] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </button>
</template>
