// tailwind.config.js

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    // Remove or comment out this line 👇
    // require('tailwind-scrollbar'),
  ],
};
