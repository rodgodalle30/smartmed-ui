<template>
  <Teleport to="body">
    <Transition leave-active-class="duration-200">
      <div
        v-show="show"
        class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-0"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Dialog'"
        @keydown="trapFocus"
      >
        <!-- ── Backdrop ── -->
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-show="show && !hideBackdrop"
            :class="['fixed inset-0 transition-opacity', backdropClass]"
            aria-hidden="true"
            @click="close"
          />
        </Transition>

        <!-- ── Modal Panel ── -->
        <div
          v-show="show"
          ref="modalRef"
          class="relative z-10 w-full sm:mx-auto bg-white rounded-xl shadow-xl overflow-y-auto max-h-[calc(100vh-3rem)]"
          :class="maxWidthClass"
        >
          <slot v-if="show" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, ref, nextTick } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false },
  maxWidth: { type: String, default: "xl" },
  closeable: { type: Boolean, default: true },
  title: { type: String, default: "" }, // for aria-labelledby
  hideBackdrop: { type: Boolean, default: false },
  backdropClass: { type: String, default: "bg-slate-950/40 backdrop-blur-sm" },
});

const emit = defineEmits(["close"]);
const modalRef = ref(null);
const previousActiveElement = ref(null);

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

// ─── Focus Trap ───────────────────────────────────────────────
const trapFocus = (e) => {
  if (!modalRef.value) return;
  const focusable = [...modalRef.value.querySelectorAll(FOCUSABLE)];
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

// ─── Show/Hide Side Effects ───────────────────────────────────
watch(
  () => props.show,
  async (visible) => {
    if (visible) {
      document.body.style.overflow = "hidden";
      previousActiveElement.value = document.activeElement;
      await nextTick();
      // Auto-focus first focusable element inside modal
      const focusable = modalRef.value?.querySelector(FOCUSABLE);
      focusable?.focus();
    } else {
      document.body.style.overflow = "";
      // Restore focus to the element that triggered the modal
      previousActiveElement.value?.focus();
    }
  },
);

const close = () => {
  if (props.closeable) emit("close");
};

const closeOnEscape = (e) => {
  if (e.key === "Escape" && props.show) close();
};

onMounted(() => document.addEventListener("keydown", closeOnEscape));
onUnmounted(() => {
  document.removeEventListener("keydown", closeOnEscape);
  document.body.style.overflow = "";
});

const maxWidthClass = computed(
  () =>
    ({
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      "2xl": "sm:max-w-2xl",
      "3xl": "sm:max-w-3xl",
      "4xl": "sm:max-w-4xl",
      "5xl": "sm:max-w-5xl",
      screen2xl: "max-w-screen-2xl",
    })[props.maxWidth],
);
</script>
