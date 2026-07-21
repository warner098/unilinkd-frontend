/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unilinkd: {
          blue: '#0A66C2',      // Azul estilo LinkedIn
          hover: '#004182',     // Azul oscuro
          bgLight: '#F3F2EF',   // Gris claro
        }
      }
    },
  },
  plugins: [],
}