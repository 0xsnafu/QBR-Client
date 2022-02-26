const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.js',
    './src/**/*.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minHeight: {
      '300': '300px'
    },
    extend: {
      colors: {
        orange: colors.orange,
        // cyan: colors.cyan,
        // emerald: colors.green
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled']
    },
  },
  plugins: [],
}
