import React from "react";
import { Img, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ZCASH_LOGO_YELLOW } from "../lib/assets";
import { SPRING_SMOOTH } from "../lib/spring-configs";

interface ZcashLogoProps {
  readonly size?: number;
  readonly delay?: number;
}

export const ZcashLogo: React.FC<ZcashLogoProps> = ({
  size = 200,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: SPRING_SMOOTH,
  });

  const glow = interpolate(
    Math.sin((frame - delay) * 0.04),
    [-1, 1],
    [0.2, 0.6]
  );

  // Subtle rotation
  const rotate = interpolate(
    Math.sin((frame - delay) * 0.015),
    [-1, 1],
    [-2, 2]
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: entrance,
        transform: `scale(${entrance}) rotate(${rotate}deg)`,
        filter: `drop-shadow(0 0 ${50 * glow}px rgba(244, 183, 40, ${glow})) drop-shadow(0 ${size * 0.06}px ${size * 0.15}px rgba(0, 0, 0, 0.5))`,
      }}
    >
      <Img
        src={ZCASH_LOGO_YELLOW}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
