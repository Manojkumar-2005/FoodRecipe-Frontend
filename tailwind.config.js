/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'food-orange': '#FF6B35',
        'food-green': '#4CAF50',
        'food-brown': '#8D6E63',
      },
    },
  },
  plugins: [],
};
