/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
   ],
   darkMode: ['class'],
   theme: {
      container: {
         center: true,
         padding: '2rem',
         screens: {
            '2xl': '1400px',
         },
      },
      extend: {
         colors: {
            input: 'hsl(var(--input))',
            destructive: 'hsl(var(--destructive))',
            accent: 'hsl(var(--accent))',
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            cursor: 'hsl(var(--cursor))',
            lightcorrect: '#2ECC71',
            lightwrong: '#E74C3C',
            darkcorrect: '#27AE60',
            darkwrong: '#E74C3C',
            lightorangecorrect: '#228B22',
            lightorangewrong: '#DC143C',
            darkorangecorrect: '#32CD32',
            darkorangewrong: '#FF4500',
            lightgreencorrect: '#006400',
            lightgreenwrong: '#FF6347',
            darkgreencorrect: '#354A21',
            darkgreenwrong: '#FF2400',
            darkgraycorrect: '#39FF14',
            darkgraywrong: '#FF4500',
            midnightbluecorrect: '#BFFF00',
            midnightbluewrong: '#FF4040',
            oceancorrect: '#2E8B57',
            oceanwrong: '#FF4040',
            girlycorrect: '#FF69B4',
            girlywrong: '#FF1493',
            retrocorrect: '#66CDAA',
            retrowrong: '#B22222',
            sunshinecorrect: '#ADFF2F',
            sunshinewrong: '#DC143C',
            hacktoberfestcorrect: '#354A21',
            hacktoberfestwrong: '#710C04',
            cyberpunkcorrect: '#00FFFF',
            cyberpunkwrong: '#FF00FF',
            // secondary: {
            //    DEFAULT: 'var(--secondary)',
            //    foreground: 'var(--secondary-foreground)',
            // },

            // muted: {
            //    DEFAULT: 'var(--muted)',
            //    foreground: 'var(--muted-foreground)',
            // },
            // accent: {
            //    DEFAULT: 'var(--accent))',
            //    foreground: 'var(--accent-foreground)',
            // },
            // popover: {
            //    DEFAULT: 'var(--popover)',
            //    foreground: 'var(--popover-foreground)',
            // },
            // card: {
            //    DEFAULT: 'var(--card)',
            //    foreground: 'var(--card-foreground)',
            // },
         },
         borderRadius: {
            lg: `var(--radius)`,
            md: `calc(var(--radius) - 2px)`,
            sm: 'calc(var(--radius) - 4px)',
         },
         fontFamily: {
            sans: ['var(--font-sans)'],
            mono: ['var(--font-roboto-mono)'],
         },
         keyframes: {
            blink: {
               '0%, 100%': { opacity: 0 },
               '50%': { opacity: 1 },
            },
            shake: {
               '10%, 90%': { transform: ' translate3d(-1px, 0, 0)' },
               '25%, 75%': { transform: ' translate3d(2px, 0, 0)' },
               '30%, 50%, 70%': { transform: ' translate3d(-4px, 0, 0)' },
               '40%, 60%': { transform: 'translate3d(-4px)' },
            },
         },
         animation: {
            blink: 'blink 1s linear infinite',
            shake: 'shake 0.8s cubic-bezier(.36, .07, .19, .97) both',
         },
      },
   },
   plugins: [],
};