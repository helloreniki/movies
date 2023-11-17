import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useMoviesStore = defineStore('movies', () => {
  const apiKey = import.meta.env.VITE_OMDB_API
  const movies = ref([])
  const error = ref()
  const isLoading = ref(false)

  // shouldn't be empty -> todo: show error message if empty
  const query = ref('foo')
  const page = ref(1)
  const totalMovies = ref('')
  const totalPages = computed(() => Math.ceil(totalMovies.value / 10))

  const paginatedPage = ref(1)
  const paginatedMovies = ref([])
  const perPage = ref(20)

  async function getMovies() {
    isLoading.value = true

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

      paginatedMovies.value = movies.value.slice(0, perPage.value)

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

  return { paginatedMovies, error, isLoading, getMovies, totalMovies, perPage, paginatedPage, updatePage }

})
