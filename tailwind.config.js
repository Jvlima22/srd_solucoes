/* eslint-disable @typescript-eslint/no-require-imports */
const { hairlineWidth } = require('nativewind/theme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        blueSystem: 'hsl(var(--blue-system))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        system: {
          DEFAULT: '#27408B'
        },
        chathams_blue: {
          50: '#eefaff',
          100: '#dcf5ff',
          200: '#b2edff',
          300: '#6de0ff',
          400: '#20d1ff',
          500: '#00bbff',
          600: '#0097df',
          700: '#0078b4',
          800: '#006594',
          900: '#004d71',
          950: '#003551',
        },
        grayscale: {
          0: '#FFFFFF',
          1: '#FCFDFE',
          5: '#F2F2F2',
          10: '#E6E6E6',
          20: '#CCCCCC',
          30: '#B3B3B3',
          45: '#8C8C8C',
          60: '#666666',
          70: '#4D4D4D',
          80: '#333333',
          90: '#1A1A1A',
          100: '#000000',
          500: '#45525F',
          600: '#1A1F24',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
