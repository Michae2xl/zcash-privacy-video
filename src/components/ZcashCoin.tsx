import React from "react";
import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ZCASH_LOGO_YELLOW } from "../lib/assets";
import { SPRING_BOUNCY } from "../lib/spring-configs";

interface ZcashCoinProps {
  readonly size?: number;
  readonly delay?: number;
  readonly spinning?: boolean;
}

export const ZcashCoin: React.FC<ZcashCoinProps> = ({
  size = 100,
  delay = 0,
  spinning = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: SPRING_BOUNCY,
  });

  // 3D flip effect
  const rotateY = spinning
    ? interpolate((frame - delay) % 150, [0, 150], [0, 360])
    : 0;

  const floatY = interpolate(Math.sin((frame - delay) * 0.035), [-1, 1], [-5, 5]);
  const glow = interpolate(Math.sin((frame - delay) * 0.05), [-1, 1], [0.2, 0.6]);

  // When coin is "edge on", show a thin line
  const scaleX = Math.abs(Math.cos((rotateY * Math.PI) / 180));
  const isFront = Math.cos((rotateY * Math.PI) / 180) > 0;

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: entrance,
        transform: `scale(${entrance}) translateY(${floatY}px)`,
        perspective: 800,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transform: `scaleX(${Math.max(scaleX, 0.04)})`,
          filter: `drop-shadow(0 0 ${30 * glow}px rgba(244, 183, 40, ${glow})) drop-shadow(0 ${size * 0.08}px ${size * 0.2}px rgba(0,0,0,0.5))`,
        }}
      >
        {isFront ? (
          <Img
            src={ZCASH_LOGO_YELLOW}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          // Back side — solid gold disc
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #E0A000 0%, #C8860A 50%, #A06800 100%)",
              boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.3), inset 0 4px 12px rgba(255,255,255,0.2)",
            }}
          />
        )}
      </div>
    </div>
  );
};
