<template>
  <div>
    <button @click="visible = true" type="button" class="bg-gray-200 px-4 py-2 hover:bg-gray-300 rounded-lg text-sm w-fit text-center">Your Review</button>
    <Dialog v-model:visible="visible" modal>
      <div class="mb-6">Review for {{ props.movie.title }}:</div>
      <div class="shadow-md px-4 py-6 rounded-lg border-0 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400/80 placeholder:text-sm" placeholder="Your review..">
        {{ props.movie.review }}
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { ref } from "vue";

const props = defineProps({movie: Object})
const visible = ref(false)

</script>
