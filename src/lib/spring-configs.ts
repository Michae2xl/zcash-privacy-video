import type { SpringConfig } from "remotion";

export const SPRING_FAST: SpringConfig = {
  damping: 12,
  stiffness: 200,
  mass: 0.5,
  overshootClamping: false,
};

export const SPRING_SMOOTH: SpringConfig = {
  damping: 15,
  stiffness: 120,
  mass: 0.8,
  overshootClamping: false,
};

export const SPRING_BOUNCY: SpringConfig = {
  damping: 8,
  stiffness: 180,
  mass: 0.6,
  overshootClamping: false,
};

export const SPRING_SLOW: SpringConfig = {
  damping: 20,
  stiffness: 80,
  mass: 1.2,
  overshootClamping: false,
};
