<template>
  <div v-if="my_lists" class="flex flex-col gap-4">
    <div v-for="list in my_lists" :key="list" >
      <ListShow :list="list" />
    </div>
  </div>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import ListShow from "@/components/ListShow.vue";

const my_lists = useStorage('lists', [])


</script>
