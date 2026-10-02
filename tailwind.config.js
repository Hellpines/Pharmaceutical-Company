export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          secondary: '#56627D',
          primary: '#3874FF',
          dark: '#141828',
        },
      },
    },
  },
  plugins: [],
}

