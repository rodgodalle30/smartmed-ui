<template>
  <nav class="flex border-gray-200 bg-white" aria-label="Breadcrumb">
    <ol role="list" class="mx-auto flex w-full space-x-4 px-4 sm:px-6 lg:px-8">
      <li class="flex">
        <div class="flex items-center">
          <a :href="homeHref" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span class="sr-only">{{ homeLabel }}</span>
          </a>
        </div>
      </li>
      <li v-for="page in pages" :key="page.name" class="flex">
        <div class="flex items-center">
          <svg
            class="h-full w-4 flex-shrink-0 text-gray-300"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <span v-if="page.current == false">
            <a
              :href="page.href"
              class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              :aria-current="page.current ? 'page' : undefined"
              >{{ page.name }}</a
            >
          </span>
          <span v-else>
            <span
              class="ml-4 text-sm font-medium text-gray-500"
              :aria-current="page.current ? 'page' : undefined"
              >{{ page.name }}</span
            >
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { HomeIcon } from "@heroicons/vue/20/solid";

defineProps({
  pages: { type: Array, default: () => [] },
  homeHref: { type: String, default: "/" },
  homeLabel: { type: String, default: "Home" },
});
</script>
