import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "320px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
      "2xl": "1920px",
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        success: "var(--success)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        kannada: ["var(--font-noto-kannada)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #38BDF8 0%, #A78BFA 100%)",
        "brand-radial": "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
      },
      borderRadius: {
        "glass": "24px",
      },
      backdropBlur: {
        "glass": "16px",
      },
      transitionTimingFunction: {
        "fluid": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee-left": "marquee-left 35s linear infinite",
        "marquee-right": "marquee-right 35s linear infinite",
      },
      keyframes: {
        "marquee-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

