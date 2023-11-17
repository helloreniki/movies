import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { refDebounced } from '@vueuse/core'

export const useMoviesStore = defineStore('movies', () => {
  const apiKey = import.meta.env.VITE_OMDB_API
  const movies = ref([])
  const error = ref()
  const isLoading = ref(false)

  const query = ref('foo')
  const page = ref(1)
  const totalMovies = ref('')
  const totalPages = computed(() => Math.ceil(totalMovies.value / 10))

  const paginatedPage = ref(1)
  const paginatedMovies = ref([])
  const perPage = ref(20)

  const queryDebounced = refDebounced(query, 200)

  async function getMovies() {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query.value}&page=${page.value}`)
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

      if(perPage.value < movies.value.length){
        paginatedMovies.value = movies.value.slice(0, perPage.value)
      } else {
        paginatedMovies.value = movies.value
      }

    } catch(err) {
        error.value = err.message;
    } finally {
        isLoading.value = false
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
  watch(queryDebounced, () => {
    movies.value = [];
    paginatedMovies.value = [];

    console.log(movies.value.length)
    console.log('paginated', paginatedMovies.value.length)
    getMovies()
  })

  return { paginatedMovies, error, isLoading, getMovies, totalMovies, perPage, paginatedPage, updatePage, query }

})
