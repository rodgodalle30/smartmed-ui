<template>
  <div>
    <!-- Mobile View: Select Menu -->
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        class="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-sm bg-[var(--system-color)] text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
        @change="handleSelectChange"
        :value="currentTabHref"
      >
        <option v-for="tab in tabs" :key="tab.name" :value="tab.href">
          {{ tab.name }}
        </option>
      </select>
    </div>

    <!-- Desktop View: Navigation Tabs -->
    <div class="bg-[var(--system-color)] rounded-md p-1.5 flex gap-1">
      <a
        v-for="tab in tabs"
        :key="tab.name"
        :href="tab.href"
        @click.prevent="handleTabClick(tab)"
        :class="[
          tab.current
            ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
            : 'text-gray-300 hover:bg-white/10 hover:text-white',
          'whitespace-nowrap px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-200',
        ]"
      >
        {{ tab.name }}
      </a>
    </div>

    <!-- Tab Content -->
    <div class="mt-4">
      <span v-if="formTabs">
        <component
          :is="currentTab.component"
          :editmode="editmode"
          :datavalues="datavalues"
        />
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import emitter from "../../eventBus.js";

const props = defineProps(["tabs", "formtabs", "editmode", "datavalues"]);
const formTabs = ref(props.formtabs);
const currentTab = computed(() => {
  return props.tabs.find((tab) => tab.current) || props.tabs[0];
});

const currentTabHref = computed(() => currentTab.value.href);

const handleSelectChange = (event) => {
  const selectedUrl = event.target.value;
  selectTab(selectedUrl);
};

const handleTabClick = (tab) => {
  emitter.emit("getSelectedTab", tab);
  selectTab(tab.href);
};

const selectTab = (href) => {
  props.tabs.forEach((tab) => {
    tab.current = tab.href === href;
  });
};
</script>
