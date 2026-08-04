/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        norte: {
          dark: "#1C1B19", // Texto y base
          bg: "#F3EFE7", // Off-white fondo
          mustard: "#C77D2E", // Acento principal
          forest: "#33402F", // Acento secundario
          stone: "#D8D2C4", // Bordes y neutros
        },
      },
    },
  },
  plugins: [],
};
