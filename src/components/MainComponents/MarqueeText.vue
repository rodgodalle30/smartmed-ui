<template>
  <div
    class="relative overflow-hidden"
    :class="wrapperClass"
    :style="{ maxWidth }"
  >
    <span
      v-marquee
      class="marquee-text inline-block whitespace-nowrap"
      :class="textClass"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  maxWidth: { type: String, default: "20rem" },
  textClass: { type: String, default: "" },
  wrapperClass: { type: String, default: "" },
});
</script>
