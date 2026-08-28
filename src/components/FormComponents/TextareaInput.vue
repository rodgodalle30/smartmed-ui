<template>
  <div class="flex flex-col space-y-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <textarea
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :cols="cols"
      class="max-w-full border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="helperText" class="text-xs text-gray-500 mt-1">{{ helperText }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  helperText: String,
  disabled: Boolean,
  rows: {
    type: Number,
    default: 4,
  },
  rows: {
    type: Number,
    default: 15,
  },
});

defineEmits(["update:modelValue"]);
</script>
