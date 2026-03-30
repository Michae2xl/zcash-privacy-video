import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../lib/constants";

interface AnimatedBackgroundProps {
  readonly variant?: "default" | "warm" | "cool" | "ceremony";
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = "default",
}) => {
  const frame = useCurrentFrame();

  // Slow-moving gradient orbs
  const orb1X = interpolate(Math.sin(frame * 0.008), [-1, 1], [15, 45]);
  const orb1Y = interpolate(Math.cos(frame * 0.006), [-1, 1], [10, 40]);
  const orb2X = interpolate(Math.sin(frame * 0.005 + 2), [-1, 1], [55, 85]);
  const orb2Y = interpolate(Math.cos(frame * 0.007 + 1), [-1, 1], [50, 80]);
  const orb3X = interpolate(Math.sin(frame * 0.009 + 4), [-1, 1], [30, 70]);
  const orb3Y = interpolate(Math.cos(frame * 0.004 + 3), [-1, 1], [60, 90]);

  const gradients: Record<string, { bg: string; orb1: string; orb2: string; orb3: string }> = {
    default: {
      bg: `linear-gradient(145deg, ${COLORS.bgDeep} 0%, ${COLORS.bgNavy} 50%, ${COLORS.bgPurple} 100%)`,
      orb1: "rgba(244, 183, 40, 0.08)",
      orb2: "rgba(41, 151, 255, 0.06)",
      orb3: "rgba(191, 90, 242, 0.05)",
    },
    warm: {
      bg: `linear-gradient(145deg, ${COLORS.bgDeep} 0%, #1A1008 50%, ${COLORS.bgNavy} 100%)`,
      orb1: "rgba(244, 183, 40, 0.12)",
      orb2: "rgba(255, 214, 102, 0.08)",
      orb3: "rgba(224, 158, 0, 0.06)",
    },
    cool: {
      bg: `linear-gradient(145deg, ${COLORS.bgDeep} 0%, #08101A 50%, ${COLORS.bgPurple} 100%)`,
      orb1: "rgba(41, 151, 255, 0.1)",
      orb2: "rgba(100, 181, 246, 0.07)",
      orb3: "rgba(191, 90, 242, 0.06)",
    },
    ceremony: {
      bg: `linear-gradient(145deg, #0A0515 0%, ${COLORS.bgPurple} 50%, ${COLORS.bgDeep} 100%)`,
      orb1: "rgba(191, 90, 242, 0.1)",
      orb2: "rgba(244, 183, 40, 0.08)",
      orb3: "rgba(41, 151, 255, 0.06)",
    },
  };

  const g = gradients[variant];

  // Floating particles
  const particles = Array.from({ length: 30 }, (_, i) => {
    const speed = 0.002 + (i % 5) * 0.001;
    const size = 2 + (i % 4);
    const x = interpolate(
      Math.sin(frame * speed + i * 1.3),
      [-1, 1],
      [5, 95]
    );
    const y = interpolate(
      Math.cos(frame * speed * 0.8 + i * 0.9),
      [-1, 1],
      [5, 95]
    );
    const opacity = interpolate(
      Math.sin(frame * 0.02 + i),
      [-1, 1],
      [0.1, 0.4]
    );

    return { x, y, size, opacity };
  });

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: g.bg,
        }}
      />

      {/* Noise texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          left: `${orb1X}%`,
          top: `${orb1Y}%`,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${g.orb1} 0%, transparent 70%)`,
          filter: "blur(60px)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${g.orb2} 0%, transparent 70%)`,
          filter: "blur(50px)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${orb3X}%`,
          top: `${orb3Y}%`,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${g.orb3} 0%, transparent 70%)`,
          filter: "blur(40px)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: COLORS.zcashYellow,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
