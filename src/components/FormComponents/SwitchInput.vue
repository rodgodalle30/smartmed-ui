<template>
  <div class="flex flex-col space-y-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <div class="flex items-center">
      <input
        type="checkbox"
        class="toggle-switch"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.toggle-switch {
  width: 40px;
  height: 24px;
  border-radius: 12px;
  background-color: #ccc;
  position: relative;
  appearance: none;
  outline: none;
  cursor: pointer;
}
.toggle-switch:checked {
  background-color: #4caf50;
}
.toggle-switch:before {
  content: "";
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.3s;
}
.toggle-switch:checked:before {
  transform: translateX(16px);
}
</style>
