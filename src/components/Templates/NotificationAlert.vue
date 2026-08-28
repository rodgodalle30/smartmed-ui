<template>
  <div aria-live="assertive" class="pointer-events-auto w-full max-w-sm">
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5"
        :class="bgColor"
      >
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icon -->
            <div class="shrink-0">
              <component
                :is="icon"
                class="size-6"
                :class="iconColor"
                aria-hidden="true"
              />
            </div>

            <!-- Content -->
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <!-- Title -->
              <p class="text-sm font-medium" :class="titleColor">
                {{ title }}
              </p>

              <!-- Message -->
              <p v-if="message" class="mt-1 text-sm" :class="messageColor">
                {{ message }}
              </p>

              <!-- Details List -->
              <div v-if="details && details.length > 0" class="mt-3 space-y-1">
                <p class="text-xs font-semibold" :class="detailsTitleColor">
                  {{ details.length === 1 ? "Detail:" : "Details:" }}
                </p>
                <ul class="space-y-1 text-xs" :class="detailsTextColor">
                  <li
                    v-for="(detail, index) in details"
                    :key="index"
                    class="flex items-start"
                  >
                    <span class="mr-2 mt-0.5">•</span>
                    <span class="flex-1">{{ detail }}</span>
                  </li>
                </ul>
              </div>

              <!-- Countdown -->
              <div
                v-if="showCountdown && countdown > 0"
                class="mt-3 flex items-center gap-2"
              >
                <div
                  class="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full transition-all duration-1000 ease-linear"
                    :class="progressBarColor"
                    :style="{ width: `${(countdown / maxCountdown) * 100}%` }"
                  ></div>
                </div>
                <p class="text-xs font-medium text-gray-400">
                  {{ countdown }}s
                </p>
              </div>
            </div>

            <!-- Close Button -->
            <div class="ml-4 flex shrink-0">
              <button
                type="button"
                @click="closeNotification"
                class="inline-flex rounded-xl text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                :class="closeButtonRing"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from "vue";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import { XMarkIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  type: {
    type: String,
    default: "success",
    validator: (value) =>
      ["success", "error", "info", "warning"].includes(value),
  },
  title: { type: String, required: true },
  message: { type: String, default: "" },
  details: { type: Array, default: () => [] },
  duration: { type: Number, default: 0 },
  show: { type: Boolean, default: true },
  showCountdown: { type: Boolean, default: true },
});

const emit = defineEmits(["close"]);

const visible = ref(props.show);
const countdown = ref(0);
const maxCountdown = ref(0);
let countdownInterval = null;
let hideTimeout = null;

const getDefaultDuration = () => {
  if (props.duration > 0) return props.duration;

  const durations = {
    success: 4000,
    info: 5000,
    warning: 6000,
    error: 8000,
  };

  return durations[props.type] || 5000;
};

const startCountdown = () => {
  const duration = getDefaultDuration();
  countdown.value = Math.ceil(duration / 1000);
  maxCountdown.value = countdown.value;

  if (countdownInterval) clearInterval(countdownInterval);
  if (hideTimeout) clearTimeout(hideTimeout);

  countdownInterval = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--;
    } else {
      closeNotification();
    }
  }, 1000);

  hideTimeout = setTimeout(() => {
    closeNotification();
  }, duration);
};

const closeNotification = () => {
  visible.value = false;
  if (countdownInterval) clearInterval(countdownInterval);
  if (hideTimeout) clearTimeout(hideTimeout);
  emit("close");
};

watch(
  () => props.show,
  (val) => {
    visible.value = val;
    if (val) {
      startCountdown();
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
  if (hideTimeout) clearTimeout(hideTimeout);
});

// Computed styles
const icon = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: ExclamationCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };
  return icons[props.type];
});

const iconColor = computed(() => {
  const colors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };
  return colors[props.type];
});

const titleColor = computed(() => {
  const colors = {
    success: "text-gray-900",
    error: "text-red-900",
    warning: "text-yellow-900",
    info: "text-blue-900",
  };
  return colors[props.type];
});

const messageColor = computed(() => {
  const colors = {
    success: "text-gray-600",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
  };
  return colors[props.type];
});

const detailsTitleColor = computed(() => {
  const colors = {
    success: "text-gray-700",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  };
  return colors[props.type];
});

const detailsTextColor = computed(() => {
  const colors = {
    success: "text-gray-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };
  return colors[props.type];
});

const progressBarColor = computed(() => {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };
  return colors[props.type];
});

const closeButtonRing = computed(() => {
  const colors = {
    success: "focus:ring-green-500",
    error: "focus:ring-red-500",
    warning: "focus:ring-yellow-500",
    info: "focus:ring-blue-500",
  };
  return colors[props.type];
});

const bgColor = computed(() => {
  return "bg-white";
});
</script>
