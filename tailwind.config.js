/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        babas: ["Bebas Neue"],
        montserrat: ["Montserrat"],
        inter: ["Inter"],
      },
    },
    colors: {
      whiteColor: "#FFFFFF",
      gray700: "#344054",
      gray600: "#475467",
      grayBorder: "#D0D5DD",
      primaryColor: "#329BFA",
      textColor: "#565656",
      redHighlightedColor: "#F04438",
      activeColorBreadCrum: "#2E5ADE",
      checkbox: "#EFF3FF",
      DolorsColor: "#3364F7",
      BlackColor: "#333333",
      ExpertiseTag: "#85A2FA",
      customShadow: "rgba(16, 24, 40, 0.05)",
      gray200: "#EAECF0",
      loadingOverlay: "rgba(0,0,0,0.5)",
      "success-300": "#75E0A7",
      "success-25": "#F6FEF9",
      "success-700": "#067647",
      "success-600": "#079455",
      "warning-300": "#FEC84B",
      "warning-25": "#FFFCF5",
      "warning-600": "#DC6803",
      "warning-700": "#B54708",
    },
    screens: {
      mobile: "350px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
