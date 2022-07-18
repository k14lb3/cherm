module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#121212',
      white: '#ffffff',
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
      },
      animation: {
        blink: 'blink 1000ms step-end infinite',
      },
    },
  },
  plugins: [],
};
