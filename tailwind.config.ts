import type { Config } from "tailwindcss";

// 4Relief Brand Colors (extracted from official logo)
// Primary Blue:   #0069D2  (the "4" numeral + "ief" text)
// Dark Blue:      #003C87  (deep blue shadows in logo)
// Pink/Fuchsia:   #F00F5A  (dominant color — "Relief" text + hand)
// Pink Dark:      #C3003C  (deeper pink for hover/dark states)
// Background:     #F8FAFF  (very light blue-white, feels brand-aligned)

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background
        cream: "#F8FAFF",
        beige: "#EEF3FB",
        // Brand — Blue (primary structural color)
        brand: "#0069D2",
        "brand-dark": "#003C87",
        "brand-light": "#4A9AE8",
        // Accent — Pink/Fuchsia (CTAs, highlights, donate buttons)
        accent: "#F00F5A",
        "accent-dark": "#C3003C",
        "accent-light": "#FF4D88",
        // Text
        ink: "#1A1A2E",
        muted: "#5C6880",
        // UI
        line: "#DDE4F0",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        // Admin
        sidebar: "#0F1E3D",
        dashbg: "#F4F7FD",
      },
      backgroundImage: {
        // Pink gradient — donate buttons, hero overlays, CTAs
        "accent-gradient": "linear-gradient(135deg, #F00F5A 0%, #FF4D88 100%)",
        // Blue gradient — sections, stats bands, newsletter
        "brand-gradient": "linear-gradient(135deg, #003C87 0%, #0069D2 100%)",
        // Subtle page background
        "section-gradient": "linear-gradient(180deg, #F8FAFF 0%, #EEF3FB 100%)",
        // Sidebar
        "sidebar-gradient": "linear-gradient(180deg, #0F1E3D 0%, #1A3366 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Tahoma", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Tahoma", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
