import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, TYPE } from "../lib/constants";
import { ZCASH_LOGO_YELLOW, ZECHUB_WHITE } from "../lib/assets";
import { SPRING_SMOOTH, SPRING_SLOW } from "../lib/spring-configs";
import { AnimatedBackground } from "../components/AnimatedBackground";

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({ frame: frame - 15, fps, config: SPRING_SLOW });
  const tagline1 = spring({ frame: frame - 60, fps, config: SPRING_SMOOTH });
  const tagline2 = spring({ frame: frame - 90, fps, config: SPRING_SMOOTH });
  const urlEntrance = spring({ frame: frame - 150, fps, config: SPRING_SMOOTH });
  const zechubEntrance = spring({ frame: frame - 180, fps, config: SPRING_SMOOTH });

  const fadeOut = interpolate(frame, [260, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo subtle float
  const logoFloat = interpolate(Math.sin(frame * 0.03), [-1, 1], [-6, 6]);

  // Glow pulse
  const glow = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.3, 0.7]);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AnimatedBackground variant="warm" />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Official Zcash logo — floating with glow */}
        <div
          style={{
            opacity: logoEntrance,
            transform: `scale(${logoEntrance}) translateY(${logoFloat}px)`,
            filter: `drop-shadow(0 0 ${60 * glow}px rgba(244, 183, 40, ${glow})) drop-shadow(0 20px 60px rgba(0,0,0,0.5))`,
          }}
        >
          <Img
            src={ZCASH_LOGO_YELLOW}
            style={{ width: 240, height: 240, objectFit: "contain" }}
          />
        </div>

        {/* Taglines — Apple keynote style */}
        <div style={{ marginTop: 56, textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: TYPE.hero,
              color: COLORS.white,
              fontWeight: 600,
              opacity: tagline1,
              transform: `translateY(${interpolate(tagline1, [0, 1], [30, 0])}px)`,
              letterSpacing: -3,
            }}
          >
            Privacy is normal.
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: TYPE.hero,
              fontWeight: 700,
              marginTop: 4,
              opacity: tagline2,
              transform: `translateY(${interpolate(tagline2, [0, 1], [30, 0])}px)`,
              letterSpacing: -3,
              background: `linear-gradient(135deg, ${COLORS.zcashYellow}, ${COLORS.zcashGold})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 30px rgba(244, 183, 40, 0.3))`,
            }}
          >
            Privacy is a right.
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 48,
            fontFamily: FONTS.mono,
            fontSize: TYPE.body,
            color: COLORS.textSecondary,
            opacity: urlEntrance,
            letterSpacing: 3,
          }}
        >
          z.cash
        </div>

        {/* ZecHub logo */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            opacity: zechubEntrance * 0.6,
            transform: `translateY(${interpolate(zechubEntrance, [0, 1], [10, 0])}px)`,
          }}
        >
          <Img
            src={ZECHUB_WHITE}
            style={{ height: 42, objectFit: "contain" }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
