<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="bg-gray-100 shadow-md">
    <nav class="max-w-7xl mx-auto px-4 py-4 border-b">
      <RouterLink :to="{ name: 'home' }" class="cursor-pointer">Home</RouterLink>
    </nav>
    <div class="max-w-7xl mx-auto px-4 py-20">
      <h1 class="text-7xl font-semibold">Movies</h1>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 pt-16">
    <RouterView />
  </div>

</template>
