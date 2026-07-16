import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F7FBFA",
          100: "#E4F5EF",
          200: "#98DBC6",
          500: "#5BC8AC",
          600: "#236A5B",
          700: "#16302A",
          800: "#1C584C",
          900: "#16473E"
        },
        action: {
          100: "#FFF9CC",
          500: "#E6D72A",
          600: "#C9BB17"
        },
        pink: {
          100: "#FDE8EC",
          500: "#F18D9E",
          600: "#D97084"
        },
        neutral: {
          50: "#F7FBFA",
          100: "#EEF6F3",
          200: "#DCE9E5",
          300: "#CFE2DB",
          400: "#82958E",
          600: "#52665F",
          700: "#2F453D",
          950: "#16302A"
        },
        success: {
          100: "#DDF7EB",
          600: "#16A56A"
        },
        error: {
          100: "#FDE8E8",
          600: "#DC3E42"
        },
        warning: {
          100: "#FEF3C7",
          600: "#D97706"
        },
        info: {
          100: "#DBEAFE",
          600: "#3B82F6"
        }
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px"
      },
      boxShadow: {
        xs: "0 1px 2px rgba(17, 24, 39, 0.05)",
        sm: "0 4px 12px rgba(17, 24, 39, 0.06)",
        md: "0 8px 24px rgba(17, 24, 39, 0.08)",
        lg: "0 16px 40px rgba(17, 24, 39, 0.12)"
      },
      transitionDuration: {
        instant: "80ms",
        fast: "140ms",
        normal: "200ms",
        slow: "280ms",
        emphasis: "360ms"
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        enter: "cubic-bezier(0.16, 1, 0.3, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)"
      },
      fontFamily: {
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
