import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { refDebounced } from '@vueuse/core'

export const useMoviesStore = defineStore('movies', () => {
  const apiKey = import.meta.env.VITE_OMDB_API
  const movies = ref([])
  const error = ref()
  const isLoading = ref(false)

  const queryTitle = ref('foo')
  const queryYear = ref('')
  const page = ref(1)
  const totalMovies = ref('')
  const totalPages = computed(() => Math.ceil(totalMovies.value / 10))

  const paginatedPage = ref(1)
  const paginatedMovies = ref([])
  const perPage = ref(20)

  const queryTitleDebounced = refDebounced(queryTitle, 200)
  const queryYearDebounced = refDebounced(queryYear, 200)

  async function getMovies() {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${queryTitle.value}&page=${page.value}&y=${queryYear.value}`)
      // console.log(data)
      const { Search, totalResults, Error } = data

      // if Response false
      if(Error) { error.value = Error; return }

      // if Response true
      Search.map(element => {
        movies.value.push({
          "id": element.imdbID,
          "title": element.Title,
          "year": element.Year
        })
      });

      totalMovies.value = totalResults

      loadMore()

    } catch(err) {
        error.value = err.message;
    } finally {
        isLoading.value = false
    }

    if(perPage.value <= movies.value.length){
      paginatedMovies.value = movies.value.slice(0, perPage.value)
    } else {
      paginatedMovies.value = movies.value
    }
  }

  function loadMore() {
    if(page.value < totalPages.value){
      page.value++
      getMovies()
    }
  }

  function updatePage(e) {
    console.log(e)
    const first = e.first
    const last = first + e.rows
    paginatedMovies.value = movies.value.slice(first, last)
  }

  // on every keystroke
  watch([queryTitleDebounced, queryYearDebounced], () => {
    movies.value = [];
    paginatedMovies.value = [];
    page.value = 1
    getMovies()
  })

  return { paginatedMovies, error, isLoading, getMovies, totalMovies, perPage, paginatedPage, updatePage, queryTitle, queryYear }

})
