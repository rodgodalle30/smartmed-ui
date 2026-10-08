<script setup>
import { computed, useSlots } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  eyebrow: { type: String, default: "Transaction" },
  mode: {
    type: String,
    default: "create",
    validator: (value) => ["create", "edit", "view"].includes(value),
  },
  reference: { type: [String, Number], default: "" },
  status: { type: String, default: "" },
  backHref: { type: String, default: "" },
  backLabel: { type: String, default: "Back to list" },
  compact: { type: Boolean, default: false },
});

const slots = useSlots();

const modeLabel = computed(
  () => ({ create: "New", edit: "Editing", view: "Viewing" })[props.mode],
);

const modeClasses = computed(
  () =>
    ({
      create: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      edit: "bg-amber-50 text-amber-700 ring-amber-600/20",
      view: "bg-slate-100 text-slate-700 ring-slate-600/20",
    })[props.mode],
);
</script>

<template>
  <main
    class="mx-auto w-full max-w-[1600px] space-y-4 px-3 sm:px-5 lg:px-8"
    :class="compact ? 'py-2' : 'py-4'"
  >
    <div
      v-if="compact"
      class="flex min-h-10 flex-wrap items-center justify-between gap-3 px-1"
    >
      <RouterLink
        v-if="backHref"
        :to="backHref"
        class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[var(--system-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--system-color)]"
      >
        <span aria-hidden="true">←</span>
        {{ backLabel }}
      </RouterLink>
      <div
        v-if="slots.actions"
        class="ml-auto flex flex-wrap items-center gap-2"
      >
        <slot name="actions" />
      </div>
    </div>

    <header
      v-else
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div
        class="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between"
      >
        <div class="min-w-0">
          <RouterLink
            v-if="backHref"
            :to="backHref"
            class="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[var(--system-color)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--system-color)]"
          >
            <span aria-hidden="true">←</span>
            {{ backLabel }}
          </RouterLink>

          <p
            class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--system-color)]"
          >
            {{ eyebrow }}
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <h1
              class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              {{ title }}
            </h1>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
              :class="modeClasses"
            >
              {{ modeLabel }}
            </span>
          </div>
          <p
            v-if="description"
            class="mt-2 max-w-3xl text-sm leading-6 text-slate-600"
          >
            {{ description }}
          </p>
        </div>

        <div
          v-if="slots.actions"
          class="flex shrink-0 flex-wrap items-center gap-2"
        >
          <slot name="actions" />
        </div>
      </div>

      <dl
        v-if="reference || status || slots.meta"
        class="grid gap-px border-t border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div v-if="reference" class="bg-slate-50 px-5 py-3 sm:px-6">
          <dt
            class="text-xs font-medium uppercase tracking-wide text-slate-500"
          >
            Reference
          </dt>
          <dd class="mt-1 truncate text-sm font-semibold text-slate-900">
            {{ reference }}
          </dd>
        </div>
        <div v-if="status" class="bg-slate-50 px-5 py-3 sm:px-6">
          <dt
            class="text-xs font-medium uppercase tracking-wide text-slate-500"
          >
            Status
          </dt>
          <dd class="mt-1 text-sm font-semibold text-slate-900">
            {{ status }}
          </dd>
        </div>
        <slot name="meta" />
      </dl>
    </header>

    <section
      class="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <slot />
    </section>

    <footer
      v-if="slots.footer"
      class="sticky bottom-3 z-20 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur"
    >
      <slot name="footer" />
    </footer>
  </main>
</template>
