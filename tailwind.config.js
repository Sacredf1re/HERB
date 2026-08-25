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
          DEFAULT: "#465A40",
          light: "#E7ECDF",
          dark: "#2E3A2A"
        },
        clay: {
          DEFAULT: "#BE7A56",
          dark: "#9C5F3D"
        },
        gold: {
          DEFAULT: "#B08A52",
          dark: "#8F6E3E"
        },
        rose: "#D9A9A6",
        ink: "#26251F"
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
