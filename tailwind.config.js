/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EF",
        paper: "#F3ECE0",
        sage: {
          DEFAULT: "#4B5E45",
          light: "#E7ECDF",
          dark: "#333F2E"
        },
        clay: {
          DEFAULT: "#C17F5C",
          dark: "#A6633F"
        },
        rose: "#D9A9A6",
        ink: "#2B2A25"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-jost)", "sans-serif"]
      },
      borderRadius: {
        organic: "63% 37% 54% 46% / 40% 45% 55% 60%"
      }
    }
  },
  plugins: []
};
