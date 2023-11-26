<template>
  <div>
    <div @click="showList = !showList" class="uppercase font-semibold cursor-pointer">{{ list.name }} ({{ list.movies.length }})</div>
    <div v-if="showList" class="flex flex-col gap-2 mt-1">
      <div v-for="movie in list.movies" :key="movie">{{ movie.title }}</div>
    </div>
  </div>

</template>
<script setup>
import { ref } from "vue";
defineProps({
  list: Object
})

const showList = ref(false)
</script>
