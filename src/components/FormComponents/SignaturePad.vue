<template>
  <div class="space-y-2">
    <div class="flex items-baseline justify-between gap-3">
      <label :for="canvasId" class="block text-sm font-medium text-gray-700">
        {{ label }}
        <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
      </label>
      <span v-if="hasSignature" class="text-xs font-medium text-emerald-700">
        Signature captured
      </span>
    </div>

    <div
      ref="canvasContainer"
      :class="[
        'relative overflow-hidden rounded-xl border bg-gray-50 transition',
        error
          ? 'border-red-400 ring-1 ring-red-200'
          : 'border-gray-300 focus-within:border-[var(--system-color,#000080)] focus-within:ring-2 focus-within:ring-[var(--system-color,#000080)]/20',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-crosshair',
      ]"
    >
      <canvas
        :id="canvasId"
        ref="canvas"
        :aria-describedby="describedBy"
        :aria-invalid="Boolean(error)"
        :aria-label="label"
        :style="{ height }"
        class="block w-full touch-none select-none bg-transparent"
      ></canvas>
      <p
        v-if="!hasSignature"
        class="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-gray-400"
      >
        Sign here using a mouse, stylus, or finger
      </p>
    </div>

    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <p :id="hintId" class="text-xs text-gray-500">
        {{ hint }}
      </p>
      <button
        type="button"
        :disabled="disabled || !hasSignature"
        class="inline-flex min-h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        @click="clearSignature"
      >
        Clear signature
      </button>
    </div>

    <p v-if="error" :id="errorId" class="text-sm text-red-600" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import SignaturePadLibrary from "signature_pad";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: null },
  label: { type: String, default: "Digital signature" },
  hint: {
    type: String,
    default: "Your signature is captured as a PNG and should be protected by the receiving API.",
  },
  error: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  height: { type: String, default: "10rem" },
  penColor: { type: String, default: "#111827" },
  backgroundColor: { type: String, default: "rgba(255,255,255,0)" },
});

const emit = defineEmits([
  "update:modelValue",
  "change",
  "clear",
  "save-consent",
]);

const canvas = ref(null);
const canvasContainer = ref(null);
const hasSignature = ref(Boolean(props.modelValue));
const canvasId = `smartmed-signature-${Math.random().toString(36).slice(2)}`;
const hintId = `${canvasId}-hint`;
const errorId = `${canvasId}-error`;
const describedBy = computed(() =>
  props.error ? `${hintId} ${errorId}` : hintId,
);
let pad = null;
let resizeObserver = null;
let loadingExternalValue = false;
let resizeFrame = null;

/** Emit the current PNG after a completed stroke. */
const saveSignature = () => {
  if (!pad || loadingExternalValue) return;
  const value = pad.isEmpty() ? null : pad.toDataURL("image/png");
  hasSignature.value = Boolean(value);
  emit("update:modelValue", value);
  emit("change", value);
};

/** Clear both the canvas and its v-model value. */
const clearSignature = () => {
  if (props.disabled) return;
  pad?.clear();
  hasSignature.value = false;
  emit("update:modelValue", null);
  emit("change", null);
  emit("clear");
};

/** Resize for device-pixel density while retaining captured strokes. */
const resizeCanvas = () => {
  if (!canvas.value || !pad) return;
  const bounds = canvas.value.getBoundingClientRect();
  const cssWidth = Math.max(1, Math.round(bounds.width || canvas.value.clientWidth));
  const cssHeight = Math.max(1, Math.round(bounds.height || canvas.value.clientHeight));
  const strokes = pad.toData();
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const pixelWidth = Math.max(1, Math.round(cssWidth * ratio));
  const pixelHeight = Math.max(1, Math.round(cssHeight * ratio));
  if (
    canvas.value.width === pixelWidth &&
    canvas.value.height === pixelHeight
  ) {
    return;
  }
  canvas.value.width = pixelWidth;
  canvas.value.height = pixelHeight;
  canvas.value.getContext("2d")?.scale(ratio, ratio);
  pad.clear();
  if (strokes.length) pad.fromData(strokes);
};

const scheduleCanvasResize = () => {
  if (resizeFrame) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = null;
    resizeCanvas();
  });
};

/** Load an externally supplied PNG data URL into the canvas. */
const loadModelValue = async (value) => {
  if (!pad || !canvas.value) return;
  if (!value) {
    pad.clear();
    hasSignature.value = false;
    return;
  }
  if (!value.startsWith("data:image/png;base64,")) {
    hasSignature.value = true;
    return;
  }
  loadingExternalValue = true;
  try {
    pad.clear();
    await pad.fromDataURL(value, {
      ratio: Math.max(window.devicePixelRatio || 1, 1),
    });
    hasSignature.value = !pad.isEmpty();
  } finally {
    loadingExternalValue = false;
  }
};

/** Preserve the legacy imperative submit event for older consumers. */
const handleSubmit = () => {
  const signature = pad && !pad.isEmpty() ? pad.toDataURL("image/png") : null;
  emit("save-consent", { signature_image: signature });
  return signature;
};

defineExpose({
  clear: clearSignature,
  isEmpty: () => !pad || pad.isEmpty(),
  toDataURL: () => (pad && !pad.isEmpty() ? pad.toDataURL("image/png") : null),
  handleSubmit,
});

onMounted(async () => {
  await nextTick();
  if (!canvas.value) return;
  pad = new SignaturePadLibrary(canvas.value, {
    minWidth: 1.2,
    maxWidth: 3,
    penColor: props.penColor,
    backgroundColor: props.backgroundColor,
  });
  pad.addEventListener("endStroke", saveSignature);
  resizeCanvas();
  await loadModelValue(props.modelValue);
  if (props.disabled) pad.off();
  resizeObserver = new ResizeObserver(scheduleCanvasResize);
  resizeObserver.observe(canvasContainer.value || canvas.value);
});

watch(
  () => props.modelValue,
  (value) => {
    if (value !== (pad && !pad.isEmpty() ? pad.toDataURL("image/png") : null)) {
      loadModelValue(value);
    }
  },
);

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) pad?.off();
    else pad?.on();
  },
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (resizeFrame) cancelAnimationFrame(resizeFrame);
  if (pad) {
    pad.removeEventListener("endStroke", saveSignature);
    pad.off();
  }
  pad = null;
});
</script>
