/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        norte: {
          dark: "#1C1B19", // Texto y base (negro cálido)
          bg: "#F3EFE7", // Fondo (off-white)
          mustard: "#C77D2E", // Acento principal (mostaza)
          forest: "#33402F", // Acento secundario (verde bosque)
          stone: "#D8D2C4", // Bordes y neutros (gris piedra)
        },
      },
    },
  },
  plugins: [],
};
