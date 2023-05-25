// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d',
        'footer-bg': '#f5f5f5',
        'text-tt-ft': 'rgba(0,0,0,.65)',
        'qs-form': 'rgba(0,0,0,.26)',
        'bg-pattern': 'rgb(248, 241, 233)'
      },
      boxShadow: {
        'shadow-hd': '0 6px 6px rgba(0,0,0,.6)'
      },
      backgroundImage: {
        'banner-pattern':
          "url('https://down-vn.img.susercontent.com/file/sg-11134004-23030-vhzme1v5qvov4a')"
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          // eslint-disable-next-line prettier/prettier
          paddingRight: theme('spacing.4')
        }
      })
    })
  ]
}
