/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // tailwind + primevue: Preflight is a set of base styles that Tailwind applies,
  // and it is setting the background color to transparent.
  // preflight default styles: border-solid, bg-transparent, m-0 on body,...do this manually since preflight = false to use PrimeVue css
  // documentation
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
