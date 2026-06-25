<template>
  <div class="flex flex-col space-y-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <input
      type="number"
      step="0.01"
      min="0"
      class="w-full border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      :value="modelValue"
      :disabled="disabled"
      @input="$emit('update:modelValue', parseFloat($event.target.value))"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: 0 },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "Enter price" },
  disabled: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);
</script>
