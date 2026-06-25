<template>
  <label class="block text-sm font-medium text-gray-700 mb-1"
    >Digital Signature</label
  >
  <div class="border border-gray-300 rounded-xl mb-4">
    <canvas
      ref="signaturePad"
      class="w-full h-40 touch-none"
      style="background-color: #f9fafb"
    ></canvas>
  </div>

  <div class="flex gap-4 mb-6">
    <button
      type="button"
      @click="clearSignature"
      class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition"
    >
      Clear Signature
    </button>
    <p class="text-xs text-gray-500 self-center">
      Sign above using mouse or touch
    </p>
  </div>
</template>

<script setup>
import SignaturePad from "signature_pad";
import { ref, onMounted, onBeforeUnmount, defineEmits } from "vue";
const emit = defineEmits(["save-consent", "close"]);

const signaturePad = ref(null);
let pad = null;

const form = ref({
  type: "",
  title: "",
  description: "",
  signed_by: "",
  signature_image: null,
});

function clearSignature() {
  pad.clear();
  form.value.signature_image = null;
}

function handleSubmit() {
  if (pad.isEmpty()) {
    alert("Please provide a digital signature.");
    return;
  }

  form.value.signature_image = pad.toDataURL();

  emit("save-consent", form.value);
}

onMounted(() => {
  pad = new SignaturePad(signaturePad.value, {
    backgroundColor: "rgba(255, 255, 255, 0)",
  });
});

onBeforeUnmount(() => {
  pad = null;
});
</script>
