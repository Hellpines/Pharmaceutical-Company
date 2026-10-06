export default {
  darkMode: 'class',
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
        border: {
          primary: '#E0E3EB',
        },
        background: {
          primary: '#F5F7FA',
        },
      },
    },
  },
  plugins: [],
}

