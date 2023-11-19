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

  const selectedGenre = ref(null)
  const filteredMovies = computed(() => {
    return selectedGenre.value
      ? movies.value.filter(movie => movie.genre.includes(selectedGenre.value))
      : movies.value
  })

  const totalMovies = ref('')
  const totalPages = computed(() => Math.ceil(totalMovies.value / 10))

  const paginatedPage = ref(1)
  const paginatedMovies = ref([])
  const perPage = ref(20)

  const queryTitleDebounced = refDebounced(queryTitle, 200)
  const queryYearDebounced = refDebounced(queryYear, 200)

  const genre = ref('')

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
      Search.map(async element => {
        await getOneMovie(element.imdbID)
        movies.value.push({
          "id": element.imdbID,
          "title": element.Title,
          "year": element.Year,
          "genre": genre.value
        })
      });

      totalMovies.value = totalResults

      loadMore()

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

  async function getOneMovie(imdbID) {
    try {
      const { data } = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
      genre.value = data.Genre
    } catch(err) {
        error.value = err.message;
    } finally {
        isLoading.value = false
    }
  }

  function updatePage(e) {
    console.log(e)
    const first = e.first
    const last = first + e.rows
    paginatedMovies.value = filteredMovies.value.slice(first, last)
  }

  watch([queryTitleDebounced, queryYearDebounced], () => {
    movies.value = [];
    paginatedMovies.value = [];
    page.value = 1
    getMovies()
  })

  // on first load, immediate: true, sets paginatedMovies to...
  watch(filteredMovies, (newFilteredMovies, oldFilteredMovies) => {

    paginatedMovies.value = newFilteredMovies.slice(0, perPage.value);
    totalMovies.value = newFilteredMovies.length

  }, { immediate: true, deep: true });

  // does the same:
  // watchEffect(() => {
  //   console.log('watch')
  //   // works on start
  //   paginatedMovies.value = filteredMovies.value.slice(0, perPage.value)
  // })

  // doesn't work, on load is []
  // const genresAll = computed(() => {
  //   const genres = ref([])
  //   let i = ref(1)
  //   // console.log(filteredMovies.value)
  //   Object.values(filteredMovies.value).map(movie => {
  //     const arrMovieGenre = ref(movie.genre.split(','))

  //     arrMovieGenre.value.forEach(g => {
  //       // console.log(g)
  //       if(! genres.value.find(el => el.name == g)) {
  //         genres.value.push({
  //           "id": i.value++, // genres.value.length + 1
  //           "name": g
  //         })
  //       }
  //     })
  //   })

  //   return genres
  // })

  // console.log(genresAll.value)

  return { paginatedMovies, error, isLoading, getMovies, totalMovies, perPage, paginatedPage, updatePage, queryTitle, queryYear, selectedGenre }

})
