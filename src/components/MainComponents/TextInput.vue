<script setup>
import { onMounted, ref } from "vue";

const model = defineModel({
  type: String,
  required: true,
});

const input = ref(null);

onMounted(() => {
  if (input.value.hasAttribute("autofocus")) {
    input.value.focus();
  }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
  <input
    class="rounded-lg border-gray-300 bg-white text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[var(--system-color)] focus:ring-[var(--system-color)]"
    v-model="model"
    ref="input"
  />
</template>
