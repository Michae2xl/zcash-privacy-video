import React from "react";
import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../lib/constants";
import { SPRING_SMOOTH } from "../lib/spring-configs";

interface PersonPhotoProps {
  readonly src: string;
  readonly size?: number;
  readonly delay?: number;
  readonly borderColor?: string;
}

export const PersonPhoto: React.FC<PersonPhotoProps> = ({
  src,
  size = 140,
  delay = 0,
  borderColor = COLORS.zcashYellow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: SPRING_SMOOTH,
  });

  // Ring rotation
  const ringRotation = interpolate(frame - delay, [0, 300], [0, 360]);

  // Subtle pulse
  const pulse = interpolate(
    Math.sin((frame - delay) * 0.05),
    [-1, 1],
    [0.98, 1.02]
  );

  return (
    <div
      style={{
        width: size + 8,
        height: size + 8,
        opacity: entrance,
        transform: `scale(${entrance * pulse})`,
        position: "relative",
      }}
    >
      {/* Animated gradient ring */}
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          background: `conic-gradient(from ${ringRotation}deg, ${borderColor}, rgba(255,255,255,0.1), ${borderColor}, rgba(255,255,255,0.05), ${borderColor})`,
          padding: 3,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: COLORS.bgDeep,
          }}
        />
      </div>

      {/* Photo */}
      <div
        style={{
          position: "absolute",
          inset: 3,
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: `0 0 40px rgba(244, 183, 40, ${entrance * 0.2})`,
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};
