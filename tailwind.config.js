module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'open-sans': ['"Open Sans"', 'sans - serif'],
        'poppins': ['"Poppins"', 'sans - serif']
      },
      keyframes: {
        blink: { '50%': { opacity: 1 } }
      },
    },
  },
  plugins: [],
}