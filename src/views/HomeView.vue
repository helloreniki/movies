<script setup>
import { onMounted, ref } from 'vue'
import Paginator from 'primevue/paginator';
import 'primevue/resources/themes/lara-light-teal/theme.css'
import { useMoviesStore } from '@/stores/movies'
import { storeToRefs } from 'pinia';
import Rating from 'primevue/rating';
import ReviewCreate from '@/components/ReviewCreate.vue'
import ReviewShow from '@/components/ReviewShow.vue'
import ListCreate from '@/components/ListCreate.vue'

const moviesStore = useMoviesStore()
const { paginatedMovies, error, isLoading, totalMovies, perPage, paginatedPage, queryTitle, queryYear, selectedGenre, selectedSortOption, openedRating } = storeToRefs(moviesStore)
const { getMovies, updatePage, addRating } = moviesStore

const genres = [
    { "id": 1, "name": "Drama"},
    { "id": 2, "name": "Action"},
    { "id": 3, "name": "Comedy"},
    { "id": 4, "name": "Music"},
    { "id": 5, "name": "Short"},
    { "id": 6, "name": "Documentary"},
    { "id": 7, "name": "Sci-Fi"},
    { "id": 8, "name": "Crime"},
]

const sortOptions = [
    { "id": 1, "field": "Title", "direction": "asc"},
    { "id": 2, "field": "Title", "direction": "desc"},
    { "id": 3, "field": "Rating", "direction": "asc"},
    { "id": 4, "field": "Rating", "direction": "desc"},
    { "id": 5, "field": "Year", "direction": "asc"},
    { "id": 6, "field": "Year", "direction": "desc"},
  ]

onMounted(() => getMovies())
</script>

<template>

  <main>
    <div class="flex flex-col md:flex-row items-center gap-x-4 max-w-5xl w-full mb-12 text-xl">
      <input type="text" v-model="queryTitle" class="md:w-3/5 shadow-md px-4 py-2 rounded-lg border-0 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400/80 placeholder:text-sm" placeholder="Search by title..."/>
      <input type="number" v-model="queryYear" class="md:2/5 shadow-md px-4 py-2 rounded-lg border-0 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400/80 placeholder:text-sm" placeholder="Search by year..."/>
      <select v-model="selectedGenre" class="shadow-md px-4 py-2 rounded-lg border-0 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400/80">
        <option value="">Filter by genre </option>
        <option value="">All</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.name">{{ genre.name }}</option>
        <!-- <option v-for="genre in genresAll" :key="genre.id" :value="genre.name">{{ genre.id }}</option> -->
      </select>
      <select v-model="selectedSortOption" class="shadow-md px-4 py-2 rounded-lg border-0 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400/80">
        <option value="">SortBy</option>
        <option v-for="sortOption in sortOptions" :key="sortOption.id" :value="sortOption">{{ sortOption.field + ' ' + sortOption.direction}}</option>
      </select>
    </div>
    <!-- <div class="mb-6">Total Movies: {{ totalMovies }}</div> -->
    <div v-if="paginatedMovies.length > 0" class="my-12">
      <table class="max-w-7xl w-full rounded-md overflow-hidden shadow-md ring-1 ring-gray-300">
        <thead class="bg-gray-100 text-left text-gray-900">
          <tr class="border-b border-gray-300">
            <th class="pl-6 pr-3 py-3">Title</th>
            <th class="pl-3 pr-6 py-3">Year</th>
            <th class="pl-3 pr-6 py-3">Genre</th>
            <th class="pl-3 pr-6 py-3">Review</th>
            <th class="pl-3 pr-6 py-3">Save to list</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-y-gray-200">
          <tr v-for="movie in paginatedMovies" :key="movie.id" class="even: bg-gray-50 odd:bg-white">
            <td class="pl-6 pr-3 py-3 ">
              <div class="font-semibold"> {{ movie.title }} </div>
              <div class="text-sm text-gray-500 mt-1"> Rating: {{ movie.imdb_rating }} / 10</div>
              <div class="flex gap-5 items-baseline">
                <div class="text-sm text-gray-500 mt-1"> Your Rating: </div>
                <div v-if="movie.your_rating">{{ movie.your_rating }}</div>
                <div v-else @click="openedRating = !openedRating" class="bg-gray-100 hover:bg-gray-200 px-4 py-2 font-semibold rounded-lg cursor-pointer">Rate</div>
                <div v-if="movie.your_rating || openedRating">
                  <Rating v-model="movie.your_rating" :cancel="false" @update:modelValue="addRating($event, movie)"></Rating>
                </div>
              </div>
            </td>
            <td class="pl-3 pr-6 py-3 text-sm text-gray-800">{{ movie.year }}</td>
            <td class="pl-3 pr-6 py-3 text-sm text-gray-700">{{ movie.genre }}</td>
            <td class="pl-3 pr-6 py-3 flex gap-2 text-sm">
              <ReviewCreate :movie="movie" />
              <ReviewShow v-if="movie.review" :movie="movie" />
            </td>
            <td class="pl-3 pr-6 py-3 text-center cursor-pointer">
              <ListCreate :movie="movie" />
            </td>
          </tr>
        </tbody>
        <caption class="caption-bottom mt-8 ml-0">
          <Paginator v-model:first="paginatedPage" :rows="perPage" :totalRecords="Number(totalMovies)" :rowsPerPageOptions="[10, 20, 30]" @page="updatePage($event)"></Paginator>
        </caption>
      </table>
    </div>
    <div v-if="isLoading" class="mt-4 flex gap-4 items-center">
      <svg class="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <div>Loading...</div>
    </div>
    <p v-if="queryTitle == ''">Your search input is empty. Please fill something in.</p>
    <div v-if="error" class="mt-4">{{ error }}</div>
  </main>
</template>
