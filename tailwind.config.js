module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#121212',
      white: '#ffffff',
      gray: '#767676',
    },
    extend: {
      fontFamily: {
        sauce: ['Source Code Pro', 'monospace'],
      },
      keyframes: {
        blink: {
          '0%': { opacity: 1.0 },
          '50%': { opacity: 0.0 },
          '100%': { opacity: 1.0 },
        },
        'text-under-cursor': {
          '0%': { color: '#121212' },
          '50%': { color: '#ffffff' },
          '100%': { color: '#121212' },
        },
      },
      animation: {
        blink: 'blink 1000ms step-end infinite',
        'text-under-cursor': 'text-under-cursor 1000ms step-end infinite',
      },
    },
  },
  plugins: [],
};
