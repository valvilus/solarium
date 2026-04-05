import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/providers/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "var(--accent)",
          rgb: "var(--accent-rgb)",
        },
        "resi-accent": "#10B981",
        "resi-hover": "#059669",
        "insurai-accent": "#84CC16",
        "insurai-hover": "#65A30D",
        neon: "#FF1515",
        "neon-dark": "#CC0000",
        solrm: {
          crimson: "#D90429",
          rose: "#EF233C",
          amber: "#FFB703",
          teal: "#2A9D8F",
          indigo: "#4895EF",
          violet: "#7209B7",
          ice: "#8ECAE6",
        },
        surface: {
          900: "#111111",
          800: "#1a1a1a",
          700: "#222222",
        },
      },
      fontFamily: {
        sans: ["var(--font-onest)", "system-ui", "sans-serif"],
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"],
        inter: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        unbounded: ["var(--font-unbounded)", "system-ui", "sans-serif"],
        exo2: ["var(--font-exo2)", "system-ui", "sans-serif"],
        onest: ["var(--font-onest)", "system-ui", "sans-serif"],
      },
      animation: {
        "float-hero": "floatHero 6s ease-in-out infinite",
        "float-slow": "floatCard 6s ease-in-out infinite",
        "float-delayed": "floatCard 7s ease-in-out 2s infinite",
      },
      keyframes: {
        floatHero: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        floatCard: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
