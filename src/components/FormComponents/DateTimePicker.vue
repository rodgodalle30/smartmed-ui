<template>
  <div class="relative">
    <!-- Trigger input -->
    <div
      :class="[
        'flex rounded-lg shadow-sm ring-1 ring-inset focus-within:ring-2 focus-within:ring-inset',
        props.disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer',
        hasError
          ? 'ring-red-300 focus-within:ring-red-500'
          : 'ring-gray-300 focus-within:ring-[#000080]',
      ]"
      @click="!props.disabled && togglePicker()"
    >
      <input
        :value="displayValue"
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

    <!-- Dropdown Panel -->
    <div
      v-if="isOpen"
      class="absolute z-[9999] mt-1 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 p-3 w-72"
    >
      <!-- TAB: Date / Time -->
      <div class="flex rounded-lg overflow-hidden mb-3 ring-1 ring-gray-200">
        <button
          type="button"
          @click="activeTab = 'date'"
          :class="[
            'flex-1 py-1.5 text-xs font-semibold transition-colors',
            activeTab === 'date'
              ? 'bg-[#000080] text-white'
              : 'text-gray-500 hover:bg-gray-50',
          ]"
        >
          Date
        </button>
        <button
          type="button"
          @click="activeTab = 'time'"
          :class="[
            'flex-1 py-1.5 text-xs font-semibold transition-colors',
            activeTab === 'time'
              ? 'bg-[#000080] text-white'
              : 'text-gray-500 hover:bg-gray-50',
          ]"
        >
          Time
        </button>
      </div>

      <!-- DATE TAB -->
      <div v-if="activeTab === 'date'">
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
          <span class="text-sm font-semibold text-gray-900">{{
            monthYear
          }}</span>
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

        <div class="grid grid-cols-7 mb-1">
          <div
            v-for="day in dayHeaders"
            :key="day"
            class="text-center text-xs font-medium text-gray-500 py-1"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-y-1">
          <div v-for="n in firstDayOffset" :key="'empty-' + n"></div>
          <button
            v-for="day in daysInMonth"
            :key="day"
            type="button"
            @click="selectDate(day)"
            :disabled="isDayDisabled(day)"
            :class="[
              'text-center text-sm py-1.5 rounded-lg transition-colors',
              isSelectedDay(day)
                ? 'bg-[#000080] text-white font-semibold'
                : isDayDisabled(day)
                  ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                  : [
                      'text-gray-900 hover:bg-[#000080]/10 font-medium',
                      isTodayDay(day) ? 'ring-2 ring-[#000080] ring-inset' : '',
                    ],
            ]"
          >
            {{ day }}
          </button>
        </div>
      </div>

      <!-- TIME TAB -->
      <div v-if="activeTab === 'time'" class="space-y-4">
        <p class="text-xs text-gray-500 text-center">
          {{
            selectedDate
              ? formatDateDisplay(selectedDate)
              : "Select a date first"
          }}
        </p>

        <div class="flex items-center justify-center gap-2">
          <!-- Hour input -->
          <input
            ref="hourInputRef"
            type="text"
            inputmode="numeric"
            maxlength="2"
            :value="String(selectedHour).padStart(2, '0')"
            @input="onHourInput"
            @blur="onHourBlur"
            @keydown="onTimeKeydown($event, 'hour')"
            @focus="$event.target.select()"
            class="w-14 h-12 text-center rounded-lg bg-gray-50 ring-1 ring-gray-200 text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080] border-0 cursor-text"
          />

          <span class="text-2xl font-bold text-gray-400">:</span>

          <!-- Minute input -->
          <input
            ref="minuteInputRef"
            type="text"
            inputmode="numeric"
            maxlength="2"
            :value="String(selectedMinute).padStart(2, '0')"
            @input="onMinuteInput"
            @blur="onMinuteBlur"
            @keydown="onTimeKeydown($event, 'minute')"
            @focus="$event.target.select()"
            class="w-14 h-12 text-center rounded-lg bg-gray-50 ring-1 ring-gray-200 text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080] border-0 cursor-text"
          />

          <!-- AM/PM -->
          <div class="flex flex-col gap-1">
            <button
              type="button"
              @click="period = 'AM'"
              :class="[
                'px-3 py-1.5 rounded text-xs font-semibold transition-colors',
                period === 'AM'
                  ? 'bg-[#000080] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              AM
            </button>
            <button
              type="button"
              @click="period = 'PM'"
              :class="[
                'px-3 py-1.5 rounded text-xs font-semibold transition-colors',
                period === 'PM'
                  ? 'bg-[#000080] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              PM
            </button>
          </div>
        </div>

        <button
          type="button"
          @click="confirmDateTime"
          :disabled="!selectedDate"
          :class="[
            'w-full py-2 rounded-lg text-sm font-semibold transition-colors',
            selectedDate
              ? 'bg-[#000080] text-white hover:bg-[#000066]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed',
          ]"
        >
          Confirm
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
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  minDate: { type: String, default: null },
  hasError: { type: Boolean, default: false },
  placeholder: { type: String, default: "Select date and time" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const activeTab = ref("date");
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref("");
const selectedHour = ref(12);
const selectedMinute = ref(0);
const hourInputRef = ref(null);
const minuteInputRef = ref(null);
const period = ref("AM");

const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const displayValue = computed(() => {
  if (!props.modelValue) return "";
  const [datePart, timePart] = props.modelValue.split(" ");
  if (!timePart) return datePart;
  const [h, m] = timePart.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${datePart} ${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
});

const monthYear = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  ),
);
const daysInMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate(),
);
const firstDayOffset = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1).getDay(),
);

const isDayDisabled = (day) => {
  if (!props.minDate) return false;
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return dateStr < props.minDate;
};
const isSelectedDay = (day) => {
  if (!selectedDate.value) return false;
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return dateStr === selectedDate.value;
};
const isTodayDay = (day) => {
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const selectDate = (day) => {
  if (isDayDisabled(day)) return;
  selectedDate.value = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  activeTab.value = "time";
  nextTick(() => {
    hourInputRef.value?.focus();
    hourInputRef.value?.select();
  });
};

// Auto-focus hour input whenever time tab is opened
watch(activeTab, (val) => {
  if (val === "time") {
    nextTick(() => {
      hourInputRef.value?.focus();
      hourInputRef.value?.select();
    });
  }
});
// ── Direct input handlers ─────────────────────────────────────
const onHourInput = (e) => {
  const val = e.target.value.replace(/\D/g, "");
  const num = parseInt(val);

  if (!val) return;

  if (val.length === 2 || num > 12) {
    selectedHour.value = Math.min(12, Math.max(1, num)) || 1;
    e.target.value = String(selectedHour.value).padStart(2, "0");
    minuteInputRef.value?.focus();
    minuteInputRef.value?.select();
  } else if (val.length === 1 && num >= 2) {
    if (num >= 3) {
      selectedHour.value = num;
      e.target.value = String(selectedHour.value).padStart(2, "0");
      minuteInputRef.value?.focus();
      minuteInputRef.value?.select();
    }
  }
};
const onHourBlur = (e) => {
  const num = parseInt(e.target.value);
  selectedHour.value = isNaN(num) || num < 1 ? 1 : num > 12 ? 12 : num;
  e.target.value = String(selectedHour.value).padStart(2, "0");
};
const onMinuteInput = (e) => {
  const val = e.target.value.replace(/\D/g, "");
  const num = parseInt(val);
  if (val.length === 2 || num > 59) {
    selectedMinute.value = Math.min(59, Math.max(0, num));
    e.target.value = String(selectedMinute.value).padStart(2, "0");
  }
};
const onMinuteBlur = (e) => {
  const num = parseInt(e.target.value);
  selectedMinute.value = isNaN(num) || num < 0 ? 0 : num > 59 ? 59 : num;
  e.target.value = String(selectedMinute.value).padStart(2, "0");
};
const onTimeKeydown = (e, type) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    type === "hour"
      ? (selectedHour.value =
          selectedHour.value === 12 ? 1 : selectedHour.value + 1)
      : (selectedMinute.value = (selectedMinute.value + 1) % 60);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    type === "hour"
      ? (selectedHour.value =
          selectedHour.value === 1 ? 12 : selectedHour.value - 1)
      : (selectedMinute.value = (selectedMinute.value + 59) % 60);
  } else if (
    !/^\d$/.test(e.key) &&
    !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    e.preventDefault();
  }
};

const confirmDateTime = () => {
  if (!selectedDate.value) return;
  let hour24 = selectedHour.value;
  if (period.value === "AM" && hour24 === 12) hour24 = 0;
  if (period.value === "PM" && hour24 !== 12) hour24 += 12;
  const timeStr = `${String(hour24).padStart(2, "0")}:${String(selectedMinute.value).padStart(2, "0")}`;
  emit("update:modelValue", `${selectedDate.value} ${timeStr}`);
  closePicker();
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else currentMonth.value--;
};
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else currentMonth.value++;
};

const togglePicker = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) activeTab.value = "date";
};
const closePicker = () => {
  isOpen.value = false;
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    const [datePart, timePart] = val.split(" ");
    if (datePart) {
      const [y, m] = datePart.split("-").map(Number);
      selectedDate.value = datePart;
      currentYear.value = y;
      currentMonth.value = m - 1;
    }
    if (timePart) {
      const [h, m] = timePart.split(":").map(Number);
      period.value = h >= 12 ? "PM" : "AM";
      selectedHour.value = h % 12 || 12;
      selectedMinute.value = m;
    }
  },
  { immediate: true },
);
</script>
