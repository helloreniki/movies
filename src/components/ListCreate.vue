<template>
  <div>
    <svg @click="visible = true" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-teal-500">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
    <Dialog v-model:visible="visible" modal header="Save to..." :style="{ width: '50rem' }">
      <div @click="showListCreate = true" v-if="showListCreate == false" class="text-sm mb-4 border rounded-lg shadow-md w-fit px-2 py-1 bg-gray-100">+ Create new list</div>
      <div action="" class="flex flex-col gap-4">
        <Dialog v-model:visible="showListCreate" class="bg-white text-sm" :style="{ width: '20rem' }" header="Create new list">
          <input type="text" v-model="listName" autofocus class="text-sm shadow-md px-2 py-1 rounded-lg border ring-inset ring-gray-500 focus:border-0 focus:outline-none focus:ring-2 focus:ring-teal-400/80" />
          <div @click="createList" class="border px-3 py-1 rounded-lg bg-gray-100 shadow-md mt-6 hover:bg-gray-200 w-fit">Create List</div>
        </Dialog>
        <div v-if="lists.length > 0">
          <div v-for="list in lists" :key="list" class="my-3 flex gap-1 items-center">
            <input type="checkbox" v-model=selectedLists :value="list" />
            <label>{{ list.name }}</label>
          </div>
          <div @click="addToList(props.movie)" class="bg-gray-200 px-4 py-2 hover:bg-gray-300 rounded-lg text-sm w-fit text-center shadow-md mt-3">Add</div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

const props = defineProps({movie: Object})

const visible = ref(false)
const showListCreate = ref(false)
const listName = ref('')
const lists = useStorage('lists', [])
const selectedLists = ref([])

function createList(){
  // if(!lists.value.listName){
    // console.log(listName.value)
    // console.log(lists.value)
    lists.value.push({
      'name': listName.value,
      'movies': []
    })
    listName.value = ''
    console.log(lists.value)
    showListCreate.value = false
    // useStorage('lists', lists,
    // {
    // mergeDefaults: (storageValue, defaults) =>
    //   deepMerge(defaults, storageValue),
    // },
    // )
  // }
}

function addToList(movie) {
  console.log('movie', movie)
  selectedLists.value.forEach(list => {
    console.log(list)
    list.movies.push(movie)
    console.log(list)
  })
  visible.value = false
  //it updates lists in localStorage automatically

  // useStorage('lists', lists,
  // {
  //   mergeDefaults: (storageValue, defaults) =>
  //     deepMerge(defaults, storageValue),
  // },
  //)
}

</script>
