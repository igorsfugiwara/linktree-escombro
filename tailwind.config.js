/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-white': '#ffffff',
        'brand-green': '#22c55e',
      },
    },
  },
  plugins: [],
};
