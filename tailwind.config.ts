import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca Taply, extraída del logo (gradiente índigo→celeste,
        // tinta casi negra para texto, superficie blanco-hueso).
        brand: {
          indigo: "#2A25FD",
          sky: "#00ACFE",
          ink: "#05102D",
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#2A25FD",
          600: "#231ED8",
          700: "#1B18AD",
          900: "#05102D",
        },
        surface: {
          DEFAULT: "#F7F8FC",
          alt: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#05102D",
          muted: "#5B6472",
          faint: "#94A0B4",
        },
        line: "#E4E7ED",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #2A25FD 0%, #00ACFE 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(42,37,253,0.10) 0%, rgba(0,172,254,0.10) 100%)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
