<template>
  <div class="relative">
    <!-- Trigger input -->
    <div
      :class="[
        'flex rounded-lg shadow-sm ring-1 ring-inset focus-within:ring-2 focus-within:ring-inset',
        props.disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer',
        hasError
          ? 'ring-red-300 focus-within:ring-red-500'
          : 'ring-gray-300 focus-within:ring-[var(--system-color)]',
      ]"
      @click="!props.disabled && togglePicker()"
    >
      <input
        :value="modelValue"
        readonly
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'block w-full border-0 bg-transparent py-1.5 pl-3 sm:text-sm sm:leading-6 focus:ring-0',
          props.disabled
            ? 'cursor-not-allowed text-gray-400'
            : 'cursor-pointer',
          hasError ? 'text-red-900' : 'text-gray-900',
        ]"
      />
      <div class="flex items-center pr-3">
        <svg
          class="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <!-- Calendar Dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-[9999] mt-1 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 p-3 w-72"
    >
      <!-- Month Navigation -->
      <div class="flex items-center justify-between mb-3">
        <button
          type="button"
          @click="prevMonth"
          class="p-1 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span class="text-sm font-semibold text-gray-900">
          {{ monthYear }}
        </span>
        <button
          type="button"
          @click="nextMonth"
          class="p-1 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Day Headers -->
      <div class="grid grid-cols-7 mb-1">
        <div
          v-for="day in dayHeaders"
          :key="day"
          class="text-center text-xs font-medium text-gray-500 py-1"
        >
          {{ day }}
        </div>
      </div>

      <!-- Date Grid -->
      <div class="grid grid-cols-7 gap-y-1">
        <!-- Empty cells for first week offset -->
        <div v-for="n in firstDayOffset" :key="'empty-' + n"></div>

        <!-- Day cells -->
        <button
          v-for="day in daysInMonth"
          :key="day"
          type="button"
          @click="selectDate(day)"
          :disabled="isDayDisabled(day)"
          :class="[
            'text-center text-sm py-1.5 rounded-lg transition-colors',
            isDayDisabled(day)
              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
              : isSelectedDay(day)
                ? 'bg-[var(--system-color)] text-white font-semibold'
                : isValidPatternDay(day)
                  ? [
                      'text-gray-900 hover:bg-[var(--system-color-soft)] font-medium',
                      isTodayDay(day)
                        ? 'ring-2 ring-[var(--system-color)] ring-inset'
                        : '',
                    ]
                  : [
                      'text-gray-300 cursor-not-allowed bg-gray-50',
                      isTodayDay(day) ? 'ring-2 ring-gray-300 ring-inset' : '',
                    ],
          ]"
        >
          {{ day }}
        </button>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9998]"
      @click="closePicker"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  validDays: { type: Array, default: null },
  minDate: { type: String, default: null },
  hasError: { type: Boolean, default: false },
  placeholder: { type: String, default: "Select date" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthYear = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOffset = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const isValidPatternDay = (day) => {
  if (!props.validDays) return true;
  const date = new Date(currentYear.value, currentMonth.value, day);
  return props.validDays.includes(date.getDay());
};

const isDayDisabled = (day) => {
  // Build date string in local time (avoid UTC timezone shift)
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Before minDate
  if (props.minDate && dateStr < props.minDate) return true;

  // Not a valid pattern day
  if (props.validDays) {
    const date = new Date(currentYear.value, currentMonth.value, day);
    if (!props.validDays.includes(date.getDay())) return true;
  }

  return false;
};

const isSelectedDay = (day) => {
  if (!props.modelValue) return false;
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return dateStr === props.modelValue;
};

const isTodayDay = (day) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};

const selectDate = (day) => {
  if (isDayDisabled(day)) return;
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  emit("update:modelValue", dateStr);
  closePicker();
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const togglePicker = () => {
  isOpen.value = !isOpen.value;
};
const closePicker = () => {
  isOpen.value = false;
};

// Sync calendar to current value
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      const [y, m] = val.split("-").map(Number);
      currentYear.value = y;
      currentMonth.value = m - 1;
    }
  },
  { immediate: true },
);

// Reset value if it becomes invalid after pattern change
watch(
  () => props.validDays,
  (newDays) => {
    if (!newDays || !props.modelValue) return;
    const [, , d] = props.modelValue.split("-").map(Number);
    const date = new Date(currentYear.value, currentMonth.value, d);
    if (!newDays.includes(date.getDay())) {
      emit("update:modelValue", "");
    }
  },
);
</script>
