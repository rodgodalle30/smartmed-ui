<template>
  <header
    :class="[
      'smartmed-page-title w-full border-b border-gray-200 bg-white',
      sticky ? 'sticky top-0 z-30 bg-white/95 backdrop-blur' : '',
    ]"
  >
    <div class="px-5 py-4 sm:px-6">
      <nav
        v-if="$slots.breadcrumbs"
        class="mb-1 flex items-center gap-2 overflow-hidden text-xs text-gray-500"
        aria-label="Breadcrumb"
      >
        <slot name="breadcrumbs" />
      </nav>

      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex min-w-0 items-center gap-3">
          <div
            v-if="$slots.icon || icon"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--system-color-soft)] text-[var(--system-color)] ring-1 ring-inset ring-[var(--system-color-border)]"
            aria-hidden="true"
          >
            <slot name="icon">
              <font-awesome-icon :icon="icon" class="h-5 w-5" />
            </slot>
          </div>

          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h1
                class="truncate text-xl font-semibold tracking-tight text-gray-900"
              >
                {{ pagetitle }}
              </h1>
              <span
                v-if="badge"
                class="inline-flex items-center rounded-full border border-[var(--system-color-border)] bg-[var(--system-color-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--system-color-hover)]"
              >
                {{ badge }}
              </span>
            </div>
            <p
              v-if="hasSubtitle"
              class="mt-0.5 text-sm leading-5 text-gray-500"
            >
              {{ subtitle }}
            </p>
          </div>
        </div>

        <div
          v-if="$slots.actions"
          class="flex shrink-0 flex-wrap items-center gap-2"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pagetitle: { type: String, required: true },
  subtitle: { type: String, default: "" },
  icon: { type: [String, Array], default: null },
  sticky: { type: Boolean, default: false },
  badge: { type: [String, Number], default: null },
});

const hasSubtitle = computed(() => Boolean(props.subtitle?.trim()));
</script>
