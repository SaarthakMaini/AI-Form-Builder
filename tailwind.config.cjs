const daisyui = require("daisyui");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ef4444",
        secondary: "#f6d860",
        accent: "#37cdbe",
        neutral: "#3d4451",
        info: "#3ABFF8",
        success: "#36D399",
        warning: "#FBBD23",
        error: "#F87272",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: true
  },
};
