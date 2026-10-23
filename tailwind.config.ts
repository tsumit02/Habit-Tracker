/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5965C9",
          light: "#E9EBFF",
          dark: "#414DA8",
        },
        app: {
          background: "#F7F8FC",
          surface: "#FFFFFF",
          text: "#20243A",
          muted: "#85899B",
          border: "#EEF0F6",
          danger: "#C62828",
        },
      },
    },
  },
  plugins: [],
};