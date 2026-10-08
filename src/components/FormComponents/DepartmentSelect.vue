<script setup>
import { computed, useId } from "vue";

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  departments: { type: Array, default: () => [] },
  label: { type: String, default: "Department" },
  placeholder: { type: String, default: "Select a department" },
  hint: { type: String, default: "" },
  error: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  allowUnassigned: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);
const inputId = `department-${useId()}`;

const activeDepartments = computed(() =>
  props.departments.filter(
    (department) =>
      department &&
      department.id != null &&
      department.is_active !== false &&
      Number(department.is_active ?? 1) !== 0,
  ),
);

const optionLabel = (department) => {
  const division = department.mdivisions?.name ?? department.division?.name;
  return division ? `${department.name} — ${division}` : department.name;
};

const updateValue = (event) => {
  const value = event.target.value;
  emit("update:modelValue", value === "" ? null : Number(value));
};
</script>

<template>
  <div>
    <label :for="inputId" class="block text-sm font-semibold text-slate-800">
      {{ label }}
      <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
    </label>
    <select
      :id="inputId"
      :value="modelValue ?? ''"
      :disabled="disabled || loading"
      :required="required"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="hint || error ? `${inputId}-message` : undefined"
      class="mt-2 block w-full rounded-lg border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-[var(--system-color)] focus:ring-[var(--system-color)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      :class="error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''"
      @change="updateValue"
    >
      <option value="" :disabled="!allowUnassigned">
        {{ loading ? "Loading departments..." : placeholder }}
      </option>
      <option
        v-for="department in activeDepartments"
        :key="department.id"
        :value="department.id"
      >
        {{ optionLabel(department) }}
      </option>
    </select>
    <p
      v-if="error || hint"
      :id="`${inputId}-message`"
      class="mt-1.5 text-xs"
      :class="error ? 'text-red-600' : 'text-slate-500'"
    >
      {{ error || hint }}
    </p>
  </div>
</template>
