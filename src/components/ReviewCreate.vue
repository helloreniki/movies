<template>
  <div>
    <button @click="visible = true" type="button" class="bg-gray-200 px-4 py-2 hover:bg-gray-300 rounded-lg text-sm w-fit text-center">Add Review</button>
    <Dialog v-model:visible="visible" modal header="Add review">
      <div class="text-sm mb-3">Create review for {{ props.movie.title }}</div>
      <form action="" class="flex flex-col gap-4">
        <textarea v-model="props.movie.review" name="review" id="review" cols="30" rows="10" class="shadow-md px-4 py-2 rounded-lg border-0 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400/80 placeholder:text-sm" placeholder="Your review..">
          {{ props.movie.review }}
        </textarea>
        <button @click="addReview" class="bg-gray-200 px-4 py-2 hover:bg-gray-300 rounded-lg text-sm w-fit text-center">Add review</button>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'


const props = defineProps({movie: Object})

// const review = ref('')
const visible = ref(false)
console.log(props.movie)
function addReview() {
  useStorage('review' + props.movie.id, props.movie.review)
}

</script>
