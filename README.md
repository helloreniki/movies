# Movie App

Movie App is a movie application built with Vue3, Pinia, PrimeVue, VueUse.

## Features:

- Displays a list of movies with their titles, release year, imdb rating and genre in a table with PrimeVue Paginator

- For the list of movies I used external API: https://www.omdbapi.com/

- Search bar allows users to search for movies by title or/and release year.

- Filtering movies by genre

- Sorting movies by title, rating, year

- User can rate movies on a scale of 1-5 stars. I used PrimeVue Rating component for this.

- User's rating of each movie is stored in local storage, so that the user can later on see his own ratings, when he comes back to the application. VueUse useStorage().

- Display the average rating for each movie.

- Users can write reviews for movies. Reviews are displayed in Modal with PrimeVue Dialog component and are also saved in localStorage with useStorage from VueUse.

- Users can create and save custom movie lists, such as “Favorites” or “Xmas Movies" and add movies to the list. List and it's movies are saved in localStorage.


## Setup

- Vue3
- Pinia
- PrimeVue
- VueUse

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
