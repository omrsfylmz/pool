/**
 * Theme constants for the Lunch Vote app
 * Centralized color and styling values
 */

export const colors = {
  primary: {
    yellow: "#f2b838",
    yellowHover: "#e0a82e",
    yellowLight: "#fff4d6",
    yellowDark: "#d49508",
  },
  background: {
    main: "#fcfcfb",
    card: "#ffffff",
    light: "#f0f0f0",
    grey: "#eeeeee",
  },
  text: {
    dark: "#111111",
    grey: "#666666",
    lightGrey: "#888888",
    muted: "#999999",
    disabled: "#cccccc",
  },
  border: {
    light: "#e0e0e0",
    veryLight: "#f5f5f5",
  },
  accent: {
    orange: "#ffcb47",
    red: "#ffcccc",
    redIcon: "#e74c3c",
    taco: "#ffead0",
    tacoDark: "#d35400",
    pizza: "#ffe0e3",
  },
  banner: {
    lightYellow: "#fffbf0",
    borderYellow: "#fcefc7",
    textYellow: "#dfa01e",
  },
  pill: {
    lightYellow: "#fff8e1",
    borderYellow: "#fcefc7",
  },
  slack: {
    purple: "#4a154b",
    purpleHover: "#3b113c",
  },
} as const;

export const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
} as const;

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 36,
  },
  weights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
} as const;

export const borderRadius = {
  xs: 8,
  sm: 12,
  md: 20,
  lg: 35,
  full: 50,
} as const;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.03,
    shadowRadius: 40,
    elevation: 5,
  },
  button: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButton: {
    shadowColor: colors.primary.yellow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
} as const;

