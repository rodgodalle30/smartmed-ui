<template>
  <!-- JSON value -->
  <template v-if="isJsonObject">
    <button
      type="button"
      @click="openJsonModal"
      class="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
    >
      View JSON
    </button>

    <Modal :show="isOpen" @close="closeJsonModal" maxWidth="4xl">
      <!-- Header -->
      <div
        class="border-b-2 border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] bg-white px-6 py-4 flex items-center gap-3"
      >
        <!-- Icon -->
        <div
          class="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0 bg-gradient-to-br from-[var(--system-color)] to-[var(--system-color-hover)]"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
        </div>

        <!-- Title -->
        <div class="flex-1">
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            JSON Viewer
          </h3>

          <p class="text-xs text-gray-400 leading-none mt-0.5">
            View complete JSON payload
          </p>
        </div>

        <!-- Close -->
        <button
          type="button"
          @click="closeJsonModal"
          class="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div
        class="p-6 max-h-[75vh] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <pre
          class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap break-all text-gray-800"
          >{{ formattedJson }}</pre
        >
      </div>

      <!-- Footer -->
      <div
        class="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-end"
      >
        <button
          type="button"
          @click="closeJsonModal"
          class="rounded-lg bg-[var(--system-color)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--system-color-hover)] transition"
        >
          Close
        </button>
      </div>
    </Modal>
  </template>

  <!-- Normal value -->
  <template v-else>
    <span>
      {{ value ?? emptyValue }}
    </span>
  </template>
</template>

<script setup>
import { ref, computed } from "vue";
import Modal from "../MainComponents/Modal.vue";

const props = defineProps({
  value: {
    type: [Object, Array, String, Number, Boolean],
    default: null,
  },
  emptyValue: {
    type: String,
    default: "-",
  },
});

const isOpen = ref(false);

const isJsonObject = computed(() => {
  return typeof props.value === "object" && props.value !== null;
});

const formattedJson = computed(() => {
  if (!isJsonObject.value) {
    return "";
  }

  return JSON.stringify(props.value, null, 2);
});

const openJsonModal = () => {
  isOpen.value = true;
};

const closeJsonModal = () => {
  isOpen.value = false;
};
</script>
