/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#1e1b4b', // Used for header and footer background
          900: '#312e81', // Used in the main gradient and input background
        },
        blue: {
          900: '#1e3a8a', // Used in the main gradient
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    backdropFilter: true, // Enable backdrop-blur-lg for glassmorphism effect
  },
};