<template>
    <div :class="`rounded-md bg-${alertColor}-50 p-4`">
      <div class="flex">
        <div class="flex-shrink-0">
           
          <CheckCircleIcon :class="`h-5 w-5 text-${alertColor}-400`" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p :class="`text-sm font-medium text-${alertColor}-800`">{{ alert_description }}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button type="button" :class="`inline-flex rounded-md bg-${alertColor}-50 p-1.5 text-${alertColor}-500 hover:bg-${alertColor}-100 focus:outline-none focus:ring-2 focus:ring-${alertColor}-600 focus:ring-offset-2 focus:ring-offset-${alertColor}-50`">
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>


<script setup>
import { CheckCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { ref, watch, onMounted, onUnmounted, computed, reactive } from 'vue'
import emitter from "../../eventBus.js";
const props = defineProps(['alert_description'])

const alertColor = ref(null)
const alertType = ref('');

function changeColor(payload){
    
  //alertColor.value = payload.data === 'success' ? 'green' : payload.data == 'info' ? 'blue' : payload.data == 'warning' ? 'yellow' : 'red';
    if (payload.data == 'success') {
      alertColor.value = 'green'
    }else if (payload.data == 'info'){
      alertColor.value = 'blue'
    }else if (payload.data == 'warning'){
      alertColor.value = 'yellow'
    }else if (payload.data == 'danger'){
      alertColor.value = 'red'
    }else{
      alertColor.value = ''
    }
    

    
};


onMounted(() => {

    emitter.on('alertType', (payload) => {
      changeColor(payload)
    });
});

onUnmounted(() => {
  emitter.off('alertType', getAlertColor);
});


</script>

<style>

</style>
