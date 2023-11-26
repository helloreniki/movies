<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

// const route = useRoute()
// console.log('r',route.path)
</script>

<template>
  <header class="bg-gradient-to-b from-gray-100 from-60% to-teal-100">
    <nav class="max-w-7xl mx-auto px-4 py-4 flex gap-12 items-center text-xl">
      <RouterLink :to="{ name: 'home' }" class="cursor-pointer text-gray-900 hover:text-teal-500 no-underline" active-class="text-teal-500">Home</RouterLink>
      <RouterLink :to="{ name: 'my-lists' }" class="cursor-pointer text-gray-900 hover:text-teal-500 no-underline" active-class="text-teal-500">My Lists</RouterLink>
    </nav>
    <div class="max-w-7xl mx-auto px-4 py-20">
      <h1 class="text-7xl font-semibold">Movies</h1>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 pt-16">
    <RouterView />
  </div>

</template>
