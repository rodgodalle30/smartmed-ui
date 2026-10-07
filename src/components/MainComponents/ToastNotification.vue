<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'error' },
  message: { type: String, required: true },
  title: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const config = computed(() => ({
  error: {
    topBar: 'from-red-500/80 via-red-400/60 to-transparent',
    iconRing: 'border-red-500/40',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-300',
    titleColor: 'text-red-300',
    glowColor: 'shadow-red-900/30',
    dot: 'bg-red-400',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />`,
  },
  success: {
    topBar: 'from-emerald-500/80 via-emerald-400/60 to-transparent',
    iconRing: 'border-emerald-500/40',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-300',
    titleColor: 'text-emerald-300',
    glowColor: 'shadow-emerald-900/30',
    dot: 'bg-emerald-400',
    defaultTitle: 'Success',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
  },
  warning: {
    topBar: 'from-amber-400/80 via-amber-300/60 to-transparent',
    iconRing: 'border-amber-400/40',
    iconBg: 'bg-amber-400/15',
    iconColor: 'text-amber-300',
    titleColor: 'text-amber-300',
    glowColor: 'shadow-amber-900/30',
    dot: 'bg-amber-400',
    defaultTitle: 'Warning',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />`,
  },
  info: {
    topBar: 'from-blue-500/80 via-blue-400/60 to-transparent',
    iconRing: 'border-blue-500/40',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-300',
    titleColor: 'text-blue-300',
    glowColor: 'shadow-blue-900/30',
    dot: 'bg-blue-400',
    defaultTitle: 'Information',
    svg: `<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />`,
  },
})[props.type])

const displayTitle = computed(() => props.title)
</script>

<template>
  <div class="relative w-[360px] rounded-2xl overflow-hidden
          bg-slate-900/80 backdrop-blur-2xl
          border border-white/25
          shadow-2xl shadow-black/60
          ring-1 ring-white/10
           toast-enter">

    <!-- Top gradient accent line (mirrors login card) -->
    <div :class="['absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r', config.topBar]"></div>

    <!-- Bottom subtle line -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent">
    </div>

    <!-- Body -->
    <div class="flex items-center gap-3.5 px-4 py-4">

      <!-- Icon bubble -->
      <div
        :class="['flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border', config.iconBg, config.iconRing]">
        <svg :class="['w-4.5 h-4.5', config.iconColor]" style="width:18px;height:18px" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="1.75" v-html="config.svg">
        </svg>
      </div>

      <!-- Text -->
      <div class="flex-1 min-w-0">
        <p class="text-[12.5px] text-white/60 font-medium leading-relaxed">
          {{ message }}
        </p>
      </div>

      <!-- Close -->
      <button @click="emit('close')" class="flex-shrink-0 ml-1 w-6 h-6 flex items-center justify-center
               rounded-lg text-white/30 hover:text-white/60
               hover:bg-white/10 transition-all duration-150">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
