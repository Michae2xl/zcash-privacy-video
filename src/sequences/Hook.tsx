import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, TYPE } from "../lib/constants";
import { PHOTO_SNOWDEN } from "../lib/assets";
import { SPRING_SMOOTH, SPRING_SLOW } from "../lib/spring-configs";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { PersonPhoto } from "../components/PersonPhoto";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgFade = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  const quoteSpring = spring({ frame: frame - 25, fps, config: SPRING_SLOW });
  const quoteOpacity = interpolate(frame, [25, 55], [0, 1], { extrapolateRight: "clamp" });
  const highlightOpacity = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: "clamp" });
  const authorSpring = spring({ frame: frame - 75, fps, config: SPRING_SMOOTH });
  const lineWidth = spring({ frame: frame - 65, fps, config: SPRING_SMOOTH });

  // Cinematic letterbox bars
  const barHeight = interpolate(frame, [0, 30], [120, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: bgFade }}>
      <AnimatedBackground variant="warm" />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 100 }}>
        {/* Snowden photo with animated ring */}
        <div style={{ marginBottom: 48 }}>
          <PersonPhoto src={PHOTO_SNOWDEN} size={190} delay={8} />
        </div>

        {/* Quote */}
        <div
          style={{
            maxWidth: 1350,
            textAlign: "center",
            opacity: quoteOpacity,
            transform: `translateY(${interpolate(quoteSpring, [0, 1], [50, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: TYPE.h2 + 4,
              fontFamily: FONTS.serif,
              color: COLORS.white,
              lineHeight: 1.4,
              fontWeight: 500,
              letterSpacing: -0.5,
            }}
          >
            {"\u201CZcash is the most interesting Bitcoin alternative. Bitcoin is great, but "}
            <span
              style={{
                background: `linear-gradient(135deg, ${COLORS.zcashYellow}, ${COLORS.zcashGold})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: highlightOpacity > 0.01 ? "transparent" : COLORS.white,
                fontWeight: 700,
                filter: `drop-shadow(0 0 ${20 * highlightOpacity}px rgba(244, 183, 40, 0.4))`,
              }}
            >
              if it's not private, it's not safe.
            </span>
            {"\u201D"}
          </div>
        </div>

        {/* Animated gradient divider */}
        <div
          style={{
            width: interpolate(lineWidth, [0, 1], [0, 100]),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.zcashYellow}, ${COLORS.zcashGold}, transparent)`,
            marginTop: 44,
            marginBottom: 32,
          }}
        />

        {/* Author */}
        <div
          style={{
            opacity: authorSpring,
            transform: `translateY(${interpolate(authorSpring, [0, 1], [15, 0])}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: TYPE.h3, fontFamily: FONTS.display, color: COLORS.zcashYellow, fontWeight: 700, letterSpacing: -0.5 }}>
            Edward Snowden
          </div>
          <div style={{ fontSize: TYPE.caption, fontFamily: FONTS.text, color: COLORS.textSecondary, marginTop: 10, letterSpacing: 2, textTransform: "uppercase" }}>
            Whistleblower & Privacy Advocate
          </div>
        </div>
      </AbsoluteFill>

      {/* Cinematic letterbox bars */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: barHeight, backgroundColor: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: barHeight, backgroundColor: "#000" }} />
    </AbsoluteFill>
  );
};
