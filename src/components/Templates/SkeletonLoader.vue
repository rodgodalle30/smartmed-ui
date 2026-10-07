<template>
  <!-- TABLE variant -->
  <template v-if="variant === 'table'">
    <tr v-for="n in rows" :key="`skel-row-${n}`">
      <td
        v-for="col in cols"
        :key="`skel-col-${col}`"
        class="whitespace-nowrap px-2 py-3"
      >
        <div
          class="h-4 bg-gray-200 rounded animate-pulse"
          :style="{ width: randomWidth() }"
        />
      </td>
      <td class="whitespace-nowrap px-4 py-3 sticky right-0 bg-white z-10">
        <div class="flex gap-2">
          <div
            class="h-7 w-14 rounded animate-pulse"
            style="background-color: var(--system-color); opacity: 0.2"
          />
          <div
            class="h-7 w-14 rounded animate-pulse"
            style="background-color: #c62828; opacity: 0.2"
          />
        </div>
      </td>
    </tr>
  </template>

  <!-- FORM variant -->
  <template v-else-if="variant === 'form'">
    <div class="space-y-5 px-6 py-4 animate-pulse">
      <div
        v-for="n in rows"
        :key="`skel-form-${n}`"
        class="sm:grid sm:grid-cols-4 sm:items-start sm:gap-2 sm:py-2"
      >
        <!-- Label -->
        <div class="h-4 bg-gray-200 rounded w-3/4" />
        <!-- Input -->
        <div class="mt-2 sm:col-span-2 sm:mt-0">
          <div class="h-9 bg-gray-200 rounded-xl w-full" />
        </div>
      </div>

      <!-- Footer buttons (optional) -->
      <div
        v-if="showFooter"
        class="sticky bottom-0 bg-white border-t-2 border-gray-100 pt-2 pb-6 px-6 mt-10"
      >
        <div class="grid grid-cols-2 gap-4">
          <div class="h-12 bg-gray-200 rounded-xl" />
          <div
            class="h-12 rounded-xl animate-pulse"
            style="background-color: var(--system-color); opacity: 0.2"
          />
        </div>
      </div>
    </div>
  </template>

  <!-- CARD variant -->
  <template v-else-if="variant === 'card'">
    <div
      v-for="n in rows"
      :key="`skel-card-${n}`"
      class="animate-pulse rounded-xl border border-gray-200 bg-white p-4 space-y-3"
    >
      <div class="h-4 bg-gray-200 rounded w-1/2" />
      <div class="h-3 bg-gray-200 rounded w-3/4" />
      <div class="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </template>

  <!-- TEXT variant (paragraph lines) -->
  <template v-else-if="variant === 'text'">
    <div class="animate-pulse space-y-2">
      <div
        v-for="n in rows"
        :key="`skel-text-${n}`"
        class="h-4 bg-gray-200 rounded"
        :style="{ width: n === rows ? '60%' : randomWidth() }"
      />
    </div>
  </template>

  <!-- STAT / METRIC CARD variant -->
  <template v-else-if="variant === 'stat'">
    <div
      class="animate-pulse space-y-2 p-4 rounded-xl bg-gray-50 border border-gray-200"
    >
      <div class="h-3 bg-gray-200 rounded w-1/3" />
      <div class="h-8 bg-gray-200 rounded w-1/2" />
    </div>
  </template>
</template>

<script setup>
/**
 * SkeletonLoader
 *
 * Props:
 *  variant  - 'table' | 'form' | 'card' | 'text' | 'stat'   (default: 'table')
 *  rows     - number of skeleton rows / items                 (default: 5)
 *  cols     - number of columns (table variant only)          (default: 4)
 *  showFooter - show submit button skeleton (form only)       (default: true)
 */
const props = defineProps({
  variant: {
    type: String,
    default: "table",
    validator: (v) => ["table", "form", "card", "text", "stat"].includes(v),
  },
  rows: {
    type: Number,
    default: 5,
  },
  cols: {
    type: Number,
    default: 4,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});

const randomWidth = () => Math.floor(Math.random() * 40 + 50) + "%";
</script>
