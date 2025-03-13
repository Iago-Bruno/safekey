/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        background_2: "hsl(var(--background-2))",
        foreground: "hsl(var(--foreground))",
        foreground_100: "hsl(var(--foreground-100))",
        foreground_90: "hsl(var(--foreground-90))",
        foreground_80: "hsl(var(--foreground-80))",
        foreground_60: "hsl(var(--foreground-60))",
        foreground_50: "hsl(var(--foreground-50))",
        gray_5: "#FCFAFA",
        blue_1: "#152259",
        blue_2: "#100F57",
        gray_100: "#A7A7A7",
        gray_200: "#8A8A8A",
        gray_400: "#4F4F4F",
        table: {
          background: "hsl(var(--table-background))",
          foreground: "hsl(var(--table-foreground))",
          accent: "hsl(var(--table-accent))",
          accent_opacity: "hsl(var(--table-accent-opacity))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          icon: "hsl(var(--sidebar-icon))",
          icon_active: "hsl(var(--sidebar-icon-active))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        secondary_300: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "#509CDB",
        },
        secondary_400: {
          DEFAULT: "#2D88D4",
        },
        secondary_500: {
          DEFAULT: "#2671B1",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        border_2: "hsl(var(--border-2))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        KumbhSans: ["Kumbh Sans", "sans-serif"],
        Poppins: ["Poppins", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
