/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      black: '#1C1B1F',
      white: '#FFFFFF',
      grey: {
        DEFAULT: '#7C7C7C',
        light: '#D4D4D4'
      },
      blue: {
        light: '#E7EFFE'
      },
      iris: {
        DEFAULT: '#5D5FEF'
      }
    },
    fontFamily: {
      sans: ["Roboto Flex", "sans-serif"]
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
