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
            border: 'var(--border)',
            input: 'var(--input)',
            ring: 'var(--ring)',
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            primary: {
               DEFAULT: 'var(--primary)',
               foreground: 'var(--primary-foreground)',
            },
            secondary: {
               DEFAULT: 'var(--secondary)',
               foreground: 'var(--secondary-foreground)',
            },
            destructive: {
               DEFAULT: 'var(--destructive)',
               foreground: 'var(--destructive-foreground)',
            },
            muted: {
               DEFAULT: 'var(--muted)',
               foreground: 'var(--muted-foreground)',
            },
            accent: {
               DEFAULT: 'var(--accent))',
               foreground: 'var(--accent-foreground)',
            },
            popover: {
               DEFAULT: 'var(--popover)',
               foreground: 'var(--popover-foreground)',
            },
            card: {
               DEFAULT: 'var(--card)',
               foreground: 'var(--card-foreground)',
            },
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
      plugins: [],
   },
};
