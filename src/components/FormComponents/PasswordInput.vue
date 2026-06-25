<template>
  <div class="flex flex-col space-y-1 relative">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :type="showPassword ? 'text' : 'password'"
      class="w-full border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 pr-10"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- Toggle password visibility -->
    <button
      type="button"
      @click="toggleVisibility"
      class="absolute right-2 top-7 text-gray-500 hover:text-gray-700"
      tabindex="-1"
    >
      <font-awesome-icon
        :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']"
      />
    </button>
    <p v-if="helperText" class="text-xs text-gray-500 mt-1">{{ helperText }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  helperText: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);

const showPassword = ref(false);
const toggleVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
