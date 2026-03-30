import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, TYPE } from "../lib/constants";
import { SPRING_SMOOTH } from "../lib/spring-configs";
import { AnimatedBackground } from "./AnimatedBackground";
import { PersonPhoto } from "./PersonPhoto";

interface QuoteCardProps {
  readonly text: string;
  readonly author: string;
  readonly role: string;
  readonly photoSrc?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  text,
  author,
  role,
  photoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({ frame, fps, config: SPRING_SMOOTH });
  const lineSlide = spring({ frame: frame - 15, fps, config: SPRING_SMOOTH });
  const authorEntrance = spring({ frame: frame - 30, fps, config: SPRING_SMOOTH });

  const textOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Typewriter-style reveal for the quote
  const charsToShow = Math.floor(
    interpolate(frame, [8, 8 + text.length * 0.5], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="warm" />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 140,
        }}
      >
        {/* Photo with animated ring */}
        {photoSrc && (
          <div style={{ marginBottom: 44 }}>
            <PersonPhoto src={photoSrc} size={130} delay={5} />
          </div>
        )}

        {/* Oversized decorative quote mark */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 100,
            fontSize: 500,
            fontFamily: FONTS.serif,
            background: `linear-gradient(180deg, rgba(244, 183, 40, 0.08) 0%, transparent 80%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            userSelect: "none",
            opacity: fadeIn,
          }}
        >
          {"\u201C"}
        </div>

        {/* Quote text with typewriter reveal */}
        <div
          style={{
            fontSize: TYPE.h2,
            fontFamily: FONTS.serif,
            color: COLORS.white,
            textAlign: "center",
            lineHeight: 1.45,
            maxWidth: 1300,
            opacity: textOpacity,
            transform: `translateY(${interpolate(fadeIn, [0, 1], [40, 0])}px)`,
            fontWeight: 500,
            letterSpacing: -0.5,
          }}
        >
          {"\u201C"}
          <span style={{ color: COLORS.white }}>
            {text.slice(0, charsToShow)}
          </span>
          <span style={{ color: "transparent" }}>
            {text.slice(charsToShow)}
          </span>
          {charsToShow >= text.length && "\u201D"}
        </div>

        {/* Animated gradient divider */}
        <div
          style={{
            width: interpolate(lineSlide, [0, 1], [0, 100]),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.zcashYellow}, ${COLORS.zcashGold}, transparent)`,
            marginTop: 44,
            marginBottom: 36,
          }}
        />

        {/* Author */}
        <div
          style={{
            opacity: authorEntrance,
            transform: `translateY(${interpolate(authorEntrance, [0, 1], [15, 0])}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: TYPE.h3,
              fontFamily: FONTS.display,
              color: COLORS.zcashYellow,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            {author}
          </div>
          <div
            style={{
              fontSize: TYPE.caption,
              fontFamily: FONTS.text,
              color: COLORS.textSecondary,
              marginTop: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {role}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
