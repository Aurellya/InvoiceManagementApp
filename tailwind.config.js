/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layout/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2b4450",
        secondary: "#497285",
        dm_secondary: "#4D6673",        
        tertiary: "#007C4A",
        neutral: "#F4F5F9",
        complementary: "#F1962E",
      },
    },
  },
  plugins: [],
};
