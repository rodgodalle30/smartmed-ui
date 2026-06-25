<template>
  <div class="flex flex-col space-y-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <input
      type="file"
      class="w-full text-sm text-gray-700 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.files)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: FileList, default: null },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);
</script>
