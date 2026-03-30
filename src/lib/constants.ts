// Video settings
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Colors — Apple-inspired dark palette with Zcash accents
export const COLORS = {
  // Zcash brand
  zcashYellow: "#F4B728",
  zcashGold: "#FFD666",
  zcashAmber: "#E09E00",

  // Backgrounds — rich gradients, not flat black
  bgDeep: "#05050F",
  bgNavy: "#0A0E1A",
  bgPurple: "#0D0A1A",
  bgCard: "rgba(255, 255, 255, 0.04)",
  bgCardHover: "rgba(255, 255, 255, 0.08)",
  bgGlass: "rgba(255, 255, 255, 0.06)",

  // Text
  white: "#F5F5F7",
  textSecondary: "#A1A1A6",
  textTertiary: "#6E6E73",

  // Accents
  blue: "#2997FF",
  green: "#30D158",
  red: "#FF453A",
  purple: "#BF5AF2",

  // Transaction types
  transparentBlue: "#64B5F6",
  shieldedGold: "#FFD54F",
} as const;

// Scene durations in frames (at 30fps)
export const SCENES = {
  hook: { start: 0, duration: 8 * FPS },
  whatIsZcash: { start: 8 * FPS, duration: 17 * FPS },
  transparentVsShielded: { start: 25 * FPS, duration: 30 * FPS },
  zkSnarks: { start: 55 * FPS, duration: 24 * FPS },
  ceremony: { start: 95 * FPS, duration: 25 * FPS },
  privacyIsARight: { start: 120 * FPS, duration: 20 * FPS },
  closing: { start: 140 * FPS, duration: 10 * FPS },
} as const;

export const TOTAL_DURATION = 150 * FPS; // 2:30 = 4500 frames

// Typography — Apple-style large, bold, clean
export const FONTS = {
  display: "SF Pro Display, Inter, -apple-system, sans-serif",
  text: "SF Pro Text, Inter, -apple-system, sans-serif",
  mono: "SF Mono, JetBrains Mono, monospace",
  serif: "New York, Georgia, serif",
} as const;

// Font sizes — premium, generous
export const TYPE = {
  hero: 96,
  h1: 76,
  h2: 56,
  h3: 42,
  body: 28,
  caption: 22,
  small: 18,
} as const;

// Halving data
export const HALVING_DATA = [
  { year: 2016, block: 0, reward: 12.5, price: 0.47 },
  { year: 2020, block: 1046400, reward: 6.25, price: 63 },
  { year: 2024, block: 2726400, reward: 3.125, price: 25 },
  { year: 2028, block: 4406400, reward: 1.5625, price: null },
] as const;

// Public figures — URLs for official/press photos
export const PEOPLE = {
  snowden: {
    name: "Edward Snowden",
    role: "Whistleblower & Privacy Advocate",
    // Official press photo from Freedom of the Press Foundation
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Edward_Snowden-2.jpg/440px-Edward_Snowden-2.jpg",
  },
  zooko: {
    name: "Zooko Wilcox",
    role: "Zcash Founder & CEO",
    imageUrl: "https://pbs.twimg.com/profile_images/1590784020/zooko-sepia-bw_400x400.jpg",
  },
  hughes: {
    name: "Eric Hughes",
    role: "Cypherpunk's Manifesto, 1993",
    imageUrl: "",
  },
  schneier: {
    name: "Bruce Schneier",
    role: "Security Expert & Author",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Bruce_Schneier_at_CoPS2013-IMG_9174.jpg/440px-Bruce_Schneier_at_CoPS2013-IMG_9174.jpg",
  },
} as const;
