/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f9f2fa",
          100: "#f2e0f5",
          200: "#e0b3e6",
          300: "#c980d1",
          400: "#a64da6",
          500: "#340040", // main brand color
          600: "#2a0034",
          700: "#200028",
          800: "#17001d",
          900: "#0f0012",
          950: "#08000a",
        },
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-10px)", opacity: "0" },
        },
      },
      animation: {
        slideUp: "slideUp 0.3s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
