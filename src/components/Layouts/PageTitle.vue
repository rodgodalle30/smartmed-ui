<template>
     <header class="bg-white shadow-sm">
        <div class="mx-auto max-w-full px-4 py-4 sm:px-6 lg:px-8 bg-blue-100">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight uppercase">{{ pagetitle }}</h2>
        </div>
    </header>
</template>

<script setup>
const props = defineProps(['pagetitle'])
</script>