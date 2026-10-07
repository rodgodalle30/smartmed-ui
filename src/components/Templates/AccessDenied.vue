<template>
  <div
    class="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center bg-[var(--system-color)] rounded-2xl overflow-hidden"
  >
    <div
      class="flex flex-col items-center justify-center py-24 px-6 text-center max-w-2xl"
    >
      <p class="text-lg font-bold tracking-widest text-blue-300 uppercase">
        {{ eyebrow }}
      </p>
      <h1
        class="mt-5 text-6xl font-extrabold tracking-tight text-white sm:text-7xl"
      >
        {{ title }}
      </h1>
      <p
        class="mt-6 text-xl text-blue-100 sm:text-2xl leading-relaxed max-w-lg mx-auto"
      >
        <slot>
          You don't have permission to view this page. Please contact your
          <span class="font-semibold text-white">{{ contactRole }}</span>
          to request access.
        </slot>
      </p>

      <div class="mt-12 flex items-center justify-center gap-x-6">
        <a
          :href="actionHref"
          class="rounded-md bg-white px-6 py-3.5 text-base font-semibold text-[var(--system-color)] shadow-sm hover:bg-blue-50 transition-colors"
        >
          {{ actionLabel }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Access Denied" },
  eyebrow: { type: String, default: "Permission required" },
  contactRole: { type: String, default: "System Administrator" },
  actionHref: { type: String, default: "/" },
  actionLabel: { type: String, default: "Go to Home" },
});
</script>
