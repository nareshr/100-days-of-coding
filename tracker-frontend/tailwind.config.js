/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef6ff",
          100: "#d8e8ff",
          200: "#b4d4ff",
          300: "#85b8ff",
          400: "#5397ff",
          500: "#246dff",
          600: "#0f4fff",
          700: "#0537e6",
          800: "#0329b8",
          900: "#042480"
        },
        success: {
          100: "#DCFCE7",
          500: "#22C55E",
          700: "#15803D",
        },
        warning: {
          100: "#FEF9C3",
          500: "#EAB308",
        },
        danger: {
          100: "#FEE2E2",
          500: "#EF4444",
          700: "#B91C1C",
        }
      }
    }
  },
  plugins: [],
}
