/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        crBlack: {
          900: "#050505",
          800: "#151515",
          700: "#252525",
          600: "##353535",
          500: "#454545",
          400: "#555555",
          300: "#656565",
          200: "#757575",
        },
        crBlue: {
          100: "#1DAAE8",
          200: "#1988b7",
          300: "#105e7f",
          400: "#0E405F",
          500: "#03354C",
        },
      },
    },
    fontFamily: {
      display: ["Poppins", "sans-serif"],
      body: ["Poppins", "sans-serif"],
    },
    opacity: {
      0: "0",
      20: "0.2",
      40: "0.4",
      60: "0.6",
      80: "0.8",
      100: "1",
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
  ],
};
