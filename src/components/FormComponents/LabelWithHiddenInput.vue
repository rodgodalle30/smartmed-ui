<template>
  <div class="flex flex-col space-y-1">
    <label v-if="label">
      {{ label }}
    </label>
    <input
      type="hidden"
      class="w-full border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
/* You can extend styles here if needed */
</style>
