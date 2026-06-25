<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <div class="space-y-1">
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center space-x-2"
      >
        <input
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          :disabled="disabled"
          class="text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:bg-gray-100"
        />
        <span class="text-sm text-gray-700">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  options: {
    type: Array,
    default: () => [], // [{ label: '', value: '' }]
  },
  disabled: Boolean,
});
defineEmits(["update:modelValue"]);
</script>
