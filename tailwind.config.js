const { fontFamily } = require(`tailwindcss/defaultTheme`)
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Sans', ...fontFamily.sans],
      },
      screens: {
        xs: '420px',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '2180px',
        '4xl': '2732px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.current'),
            },
          },
        },
      }),
      colors: {
        inherit: 'inherit',
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        white: '#ffffff',
        gray: colors.slate,
        primary: colors.indigo,
        main: '#7f56d9',
        secondary: colors.rose,
        tertiary: colors.emerald,
      },
      backgroundImage: {
        gradient: 'linear-gradient(180deg, rgba(66, 0, 255, 0.475) 0%, rgba(25, 0, 98, 0.95) 116.67%)'
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  variants: {
    extend: {},
  },
}
