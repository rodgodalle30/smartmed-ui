<template>
  <div class="flex items-start space-x-2">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :disabled="disabled"
      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:bg-gray-100"
    />
    <label v-if="label" class="text-sm text-gray-700">{{ label }}</label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  label: String,
  disabled: Boolean,
});
defineEmits(["update:modelValue"]);
</script>
