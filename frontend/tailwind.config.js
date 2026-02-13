/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0f172a",
        accent: "#00c3ff",
        card: "#1e293b",
      },
    },
  },
  plugins: [],
};
