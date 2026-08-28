<template>
  <div class="flex flex-col space-y-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      type="text"
      class="w-full border border-gray-300 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="displayValue"
      @blur="handleBlur"
      @focus="openPalette = true"
      @input="handleInput"
    />
    <p v-if="helperText" class="text-xs text-gray-500 mt-1">{{ helperText }}</p>
  </div>

  <!-- COMMAND PALETTE -->
  <TransitionRoot
    :show="openPalette"
    as="template"
    @after-leave="query = ''"
    appear
  >
    <Dialog class="relative z-50" @close="openPalette = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/25 transition-opacity" />
      </TransitionChild>

      <div
        class="fixed inset-0 z-50 w-screen overflow-y-auto p-4 sm:p-6 md:p-20"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-5xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 transition-all"
          >
            <Combobox v-slot="{ activeOption }" @update:modelValue="onSelect">
              <div class="grid grid-cols-1">
                <ComboboxInput
                  class="col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm"
                  placeholder="Search..."
                  @input="query = $event.target.value"
                  @blur="query = ''"
                />
                <MagnifyingGlassIcon
                  class="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400"
                  aria-hidden="true"
                />
              </div>

              <ComboboxOptions
                v-if="query === '' || filteredData.length > 0"
                class="flex transform-gpu divide-x divide-gray-100"
                as="div"
                static
                hold
              >
                <div
                  :class="[
                    'max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4',
                    activeOption && 'sm:h-96',
                  ]"
                >
                  <h2
                    v-if="query === ''"
                    class="mt-2 mb-4 text-xs font-semibold text-gray-500"
                  >
                    Search...
                  </h2>
                  <div hold class="-mx-2 text-sm text-gray-700">
                    <ComboboxOption
                      v-for="data in query === '' ? recent : filteredData"
                      :key="data.id"
                      :value="data"
                      as="template"
                      v-slot="{ active }"
                    >
                      <div
                        :class="[
                          'group flex items-center rounded-xl p-2 select-none',
                          data.is_absconded == 1 || data.is_blacklisted == 1
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-default',
                          active && 'bg-gray-100 text-gray-900',
                        ]"
                      >
                        <img
                          :src="data.imageUrl"
                          alt=""
                          class="size-6 flex-none rounded-full"
                        />
                        <div class="ml-3 flex flex-col flex-auto">
                          <span class="font-medium">{{
                            data[referenceColumn]
                          }}</span>
                          <span class="text-sm text-gray-500">{{
                            data["hismpatientcategories"]["name"]
                          }}</span>
                        </div>
                        <ChevronRightIcon
                          v-if="active"
                          class="ml-3 size-5 flex-none text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </ComboboxOption>
                  </div>
                </div>

                <!-- content -->
                <slot
                  name="commandpalette-content"
                  :activeoption="activeOption"
                />
              </ComboboxOptions>

              <div
                v-if="query !== '' && filteredData.length === 0"
                class="px-6 py-14 text-center text-sm sm:px-14"
              >
                <UsersIcon
                  class="mx-auto size-6 text-gray-400"
                  aria-hidden="true"
                />
                <p class="mt-4 font-semibold text-gray-900">No data found</p>
                <p class="mt-2 text-gray-500">
                  We couldn’t find anything with that term. Please try again.
                </p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
  <!-- END COMMAND PALETTE -->
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import { ChevronRightIcon, UsersIcon } from "@heroicons/vue/24/outline";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import emitter from "@/eventBus";

const props = defineProps({
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
  dataoptions: {
    type: Array,
    default: () => [], // Ensuring it's always an array by default
  },
  referenceColumn: {
    type: String,
    default: "",
  },
  // columns: {
  //   type: Array,
  //   default: []
  // }
});

const openPalette = ref(false);
const emit = defineEmits(["update:modelValue"]);
const recent = ref([]);
const query = ref("");
const selectedValue = ref("");
// Ensure dataoptions is always an array before filtering
const filteredData = computed(() => {
  const options = Array.isArray(props.dataoptions) ? props.dataoptions : [];

  if (query.value === "") {
    return options;
  }

  return options.filter((option) => {
    const value =
      option?.[props.referenceColumn]?.toString().toLowerCase() || "";
    return value.includes((query.value || "").toString().toLowerCase());
  });
});

/* function onSelect(option) {
  if (option) {
    emit('update:modelValue', option[props.referenceColumn])  // Update modelValue when a person is selected
    openPalette.value = false
  }
} */
const displayValue = computed(() => {
  if (typeof props.modelValue === "object" && props.modelValue !== null) {
    return props.modelValue[props.referenceColumn] || "";
  }
  return props.modelValue || "";
});

const onSelect = (option) => {
  if (option?.is_absconded == 1 || option?.is_blacklisted == 1) {
    // Show a toast, alert, or silently block selection
    alert("Selection is disabled for absconded or blacklisted records.");
    return; // prevent selection
  }

  // Proceed with selection
  emitter.emit("optionValues", option);
  selectedValue.value = option[props.referenceColumn];
  emit("update:modelValue", option);

  // Save to recent
  if (!recent.value.some((r) => r.id === option.id)) {
    recent.value.unshift(option);
    if (recent.value.length > 5) recent.value.pop(); // limit
  }

  openPalette.value = false;
};

function handleInput(event) {
  query.value = event.target.value;
  emit("update:modelValue", query.value);
}

function handleBlur() {
  // Only clear if query is empty
  if (query.value.trim() === "") {
    query.value = "";
    emit("update:modelValue", "");
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (typeof val === "object" && val !== null) {
      query.value = val[props.referenceColumn] || "";
      selectedValue.value = val[props.referenceColumn] || "";
    } else {
      query.value = val || "";
      selectedValue.value = val || "";
    }
  },
);

watch(
  () => props.dataoptions,
  () => {
    // Force recompute if needed
    query.value = ""; // Optional: reset search on update
  },
  { deep: true },
);

onMounted(() => {});
</script>

<style scoped>
/* You can extend styles here if needed */
</style>
