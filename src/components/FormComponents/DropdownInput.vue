<template>
  <div class="flex flex-col space-y-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <!--    @change="query = $event.target.value" -->
    <Combobox
      as="div"
      v-model="selectedValue"
      @update:modelValue="handleChange"
    >
      <div class="relative mt-2">
        <ComboboxInput
          class="w-full border-gray-300 block rounded-xl bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          :placeholder="`Search ${label}`"
          :disabled="disabled"
          @blur="query = ''"
          :display-value="displayLabel"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden"
        >
          <ChevronUpDownIcon class="size-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
        >
          <li
            v-if="props.loading && filteredOptions.length == 0"
            class="py-2 px-4 text-gray-500 italic"
          >
            Loading...
          </li>

          <template v-else-if="filteredOptions.length > 0">
            <ComboboxOption
              v-for="option in filteredOptions"
              :key="option.id"
              :value="option"
              as="template"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  'relative cursor-default py-2 pr-9 pl-3 select-none',
                  active
                    ? 'bg-indigo-600 text-white outline-hidden'
                    : 'text-gray-900',
                ]"
              >
                <div class="flex flex-col">
                  <span :class="['block', selected && 'font-bold']">
                    {{ option[referenceColumn] }}
                  </span>
                  <span
                    :class="[
                      'text-sm text-gray-500',
                      active ? 'text-indigo-200' : 'text-gray-500',
                    ]"
                  >
                    {{ option[secondaryColumn] }}
                  </span>
                </div>

                <span
                  v-if="selected"
                  :class="[
                    'absolute inset-y-0 right-0 flex items-center pr-4',
                    active ? 'text-white' : 'text-indigo-600',
                  ]"
                >
                  <CheckIcon class="size-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </template>

          <li v-else class="py-2 px-4 text-gray-500 italic">
            No results found
          </li>
        </ComboboxOptions>
      </div>
    </Combobox>

    <p v-if="helperText" class="text-xs text-gray-500 mt-1">{{ helperText }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  options: {
    type: Array,
    default: () => [], // [{ label: '', value: '' }]
  },
  helperText: String,
  disabled: Boolean,
  referenceColumn: {
    type: String,
    default: "",
  },
  secondaryColumn: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["update:modelValue", "clear-child"]);

const query = ref("");
const selectedValue = ref(null);

const filteredOptions = computed(() => {
  const term = query.value.toLowerCase();
  return props.options.filter((option) =>
    option[props.referenceColumn].toLowerCase().includes(term),
  );
});

const displayLabel = (option) => option?.[props.referenceColumn] || "";

// Update internal state if modelValue changes from outside
/*   watch(() => props.modelValue, (newVal) => {
    selectedValue.value = props.options.find(option => option[props.referenceColumn] === newVal) || null
  }, { immediate: true }) */

const handleChange = (newValue) => {
  /*   query.value = event.target.value; */
  selectedValue.value = newValue;
  query.value = ""; // reset the query

  if (props.column?.has_child_data == 1) {
    emit("clear-child", props.column.column_name, props.column);
  }

  emit("update:modelValue", newValue); // bubble up
};

/*   watch(() => props.modelValue, (newVal) => {
  // If modelValue is an object, set it directly
  // Or find in options (optional fallback)
  if (newVal && typeof newVal === 'object') {
    selectedValue.value = newVal
  } else {
    selectedValue.value = props.options.find(option => option[props.referenceColumn] === newVal) || null
  }
}, { immediate: true }) */

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === null) {
      selectedValue.value = null;
      query.value = "";
    } else if (typeof newVal === "object") {
      selectedValue.value = newVal;
    } else {
      selectedValue.value =
        props.options.find(
          (option) => option[props.referenceColumn] === newVal,
        ) || null;
    }
  },
  { immediate: true },
);

// Emit when user selects a new option
/* watch(selectedValue, (newOption) => {

    emit('update:modelValue', newOption?.[props.referenceColumn] ?? '')
  })
 */
watch(selectedValue, (newOption) => {
  // Emit the whole object
  emit("update:modelValue", newOption ?? null);
});
</script>
