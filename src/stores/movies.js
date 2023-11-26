import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { refDebounced } from '@vueuse/core'
import { useStorage } from '@vueuse/core'


export const useMoviesStore = defineStore('movies', () => {
  const apiKey = import.meta.env.VITE_OMDB_API
  const movies = ref([])
  const error = ref()
  const isLoading = ref(false)

  const queryTitle = ref('foo')
  const queryYear = ref('')
  const page = ref(1)

  // selectedGenre empty string, if null it won't filter if nth selected (includes('') vs includes(null))
  const selectedGenre = ref('')
  const selectedSortOption = ref('')
  const filteredMovies = computed(() => {
    return (selectedGenre.value || selectedSortOption.value)
      ? movies.value
          .filter(movie => movie.genre.includes(selectedGenre.value))
          .sort((a, b) => {
            if(selectedSortOption.value.field == 'Title'){
              console.log('sorting')
              if(selectedSortOption.value.direction == 'asc'){

                if (a.title < b.title) { return -1 }
                else return 1
              } else {
                if (a.title < b.title) { return 1 }
                else return -1
              }
            }
          })
          .sort((a, b) => {
            if(selectedSortOption.value.field == 'Year'){
              if(selectedSortOption.value.direction == 'asc'){
                // 1960- (take only first 4, otherwise NaN)
                return Number(a.year.slice(0,4)) - Number(b.year.slice(0,4))
              } else {
               return Number(b.year.slice(0,4)) - Number(a.year.slice(0,4))
              }
            }
          })
          .sort((a, b) => {
            if(selectedSortOption.value.field == 'Rating'){
              if(selectedSortOption.value.direction == 'asc'){
                return Number(a.imdb_rating) - Number(b.imdb_rating)
              } else {
               return Number(b.imdb_rating) - Number(a.imdb_rating)
              }
            }
          })

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
  const imdb_rating = ref('')

  async function getMovies() {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${queryTitle.value}&page=${page.value}&y=${queryYear.value}`)
      const { Search, totalResults, Error } = data
      // console.log(Search)

      // if Response false
      if(Error) { error.value = Error; return }

      // if Response true
      Search.map(async element => {
        await getOneMovie(element.imdbID)
        movies.value.push({
          "id": element.imdbID,
          "title": element.Title,
          "year": element.Year,
          "genre": genre.value,
          'imdb_rating': imdb_rating.value,
          'your_rating': Number(useStorage(element.imdbID, null).value),
          'review': useStorage('review' + element.imdbID, null).value
        })
      });
      console.log(movies.value)

      totalMovies.value = totalResults

      // max 100 results
      if(page.value < 10){
        loadMore()
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

  async function getOneMovie(imdbID) {
    try {
      const { data } = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
      // console.log(data)
      genre.value = data.Genre
      imdb_rating.value = data.imdbRating
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

  const openedRating = ref(false)
  function addRating(value, movie){
    movie.your_rating = value
    movie.imdb_rating = ((Number(movie.imdb_rating) + value*2) / 2).toFixed(2)
    useStorage(movie.id, movie.your_rating)
  }


  return { paginatedMovies, error, isLoading, getMovies, totalMovies, perPage, paginatedPage, updatePage, queryTitle, queryYear, selectedGenre, selectedSortOption, openedRating, addRating }

})
