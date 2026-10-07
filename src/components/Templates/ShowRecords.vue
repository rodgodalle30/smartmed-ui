<template>
  
  <Listbox as="div" v-model="selectedrec" class="flex items-center gap-2">
    <ListboxLabel class="text-sm font-medium text-gray-900 whitespace-nowrap">Show:</ListboxLabel>
    <div class="relative">
      <ListboxButton class="relative w-16 cursor-default rounded-md bg-white py-2 pl-3 pr-8 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm">
        <span class="block truncate">{{ selectedrec }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-20 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption  as="template" v-for="shownumrec in shownumberofrecords" :key="shownumrec" :value="shownumrec" v-slot="{ active, selected }">
            <li :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ shownumrec }}</span>

              <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>

</template>

<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import emitter from "../../eventBus.js";

const selectedrec = ref(10);
const shownumberofrecords = ref([10,15,20,25,50]);

const handleSetSelectedRecord = (showrecordval) => {
  selectedrec.value = showrecordval
  emitter.emit('getSelectedShowRecordsVal', showrecordval)
}

watch(() => selectedrec.value, (newValue, oldValue) => {
  emitter.emit('showrecords', newValue)
})

onMounted(() => {
  emitter.on('setSelectedRec', handleSetSelectedRecord)
})

onUnmounted(() => {
  emitter.off('setSelectedRec', handleSetSelectedRecord)
})
</script>
