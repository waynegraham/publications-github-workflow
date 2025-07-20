module.exports = {
  content: ["./src/**/*.{njk,md,html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}