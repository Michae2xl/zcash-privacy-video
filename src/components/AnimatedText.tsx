import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_FAST } from "../lib/spring-configs";
import { COLORS, FONTS, TYPE } from "../lib/constants";

interface AnimatedTextProps {
  readonly text: string;
  readonly fontSize?: number;
  readonly color?: string;
  readonly delay?: number;
  readonly fontFamily?: string;
  readonly fontWeight?: number;
  readonly letterSpacing?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = TYPE.h1,
  color = COLORS.white,
  delay = 0,
  fontFamily = FONTS.display,
  fontWeight = 700,
  letterSpacing = -1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: fontSize * 0.28,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * 4;
        const wordSpring = spring({
          frame: frame - wordDelay,
          fps,
          config: SPRING_FAST,
        });

        const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
        const y = interpolate(wordSpring, [0, 1], [40, 0]);
        const blur = interpolate(wordSpring, [0, 0.5], [8, 0], {
          extrapolateRight: "clamp",
        });

        return (
          <span
            key={`${word}-${i}`}
            style={{
              fontSize,
              fontFamily,
              fontWeight,
              color,
              opacity,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              display: "inline-block",
              letterSpacing,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
