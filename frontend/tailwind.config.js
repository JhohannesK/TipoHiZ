/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
   ],
   theme: {
      extend: {
         keyframes: {
            blink: {
               '0%, 100%': { opacity: 0 },
               '50%': { opacity: 1 },
            },
         },
         animation: {
            blink: 'blink 1s linear infinite',
         },
      },
      plugins: [],
   },
};
