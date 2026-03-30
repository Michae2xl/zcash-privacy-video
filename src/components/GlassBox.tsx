import React from "react";
import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, TYPE } from "../lib/constants";
import { ZCASH_LOGO_YELLOW, ZCASH_LOGO_LIGHT_GRAY } from "../lib/assets";
import { SPRING_BOUNCY } from "../lib/spring-configs";

interface GlassBoxProps {
  readonly type: "transparent" | "shielded";
  readonly label: string;
  readonly delay?: number;
}

export const GlassBox: React.FC<GlassBoxProps> = ({
  type,
  label,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: SPRING_BOUNCY,
  });

  const isTransparent = type === "transparent";

  const pulse = interpolate(
    Math.sin((frame - delay) * 0.06),
    [-1, 1],
    [0.95, 1.05]
  );

  // Scanning line effect for transparent
  const scanY = interpolate((frame - delay) % 90, [0, 90], [0, 100]);

  return (
    <div
      style={{
        width: 380,
        height: 260,
        borderRadius: 24,
        border: `1.5px solid ${isTransparent ? "rgba(100, 181, 246, 0.3)" : "rgba(255, 213, 79, 0.3)"}`,
        background: isTransparent
          ? "rgba(100, 181, 246, 0.06)"
          : "rgba(255, 213, 79, 0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${entrance * pulse})`,
        opacity: entrance,
        backdropFilter: isTransparent ? "none" : "blur(30px)",
        boxShadow: isTransparent
          ? "0 8px 32px rgba(100, 181, 246, 0.1)"
          : "0 8px 32px rgba(244, 183, 40, 0.15), 0 0 60px rgba(244, 183, 40, 0.08)",
        position: "relative",
        overflow: "hidden",
        padding: 30,
      }}
    >
      {/* Scanning line for transparent */}
      {isTransparent && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scanY}%`,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.transparentBlue}, transparent)`,
            opacity: 0.4,
          }}
        />
      )}

      {/* Shield glow for shielded */}
      {!isTransparent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background: "radial-gradient(circle at 50% 30%, rgba(255, 213, 79, 0.08) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Icon — official Zcash logo */}
      <div style={{ marginBottom: 16 }}>
        {isTransparent ? (
          <Img src={ZCASH_LOGO_LIGHT_GRAY} style={{ width: 52, height: 52, objectFit: "contain", opacity: 0.5 }} />
        ) : (
          <Img src={ZCASH_LOGO_YELLOW} style={{ width: 56, height: 56, objectFit: "contain", filter: "drop-shadow(0 0 12px rgba(244, 183, 40, 0.4))" }} />
        )}
      </div>

      {/* Inner content */}
      {isTransparent ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: TYPE.small, color: COLORS.textSecondary, marginBottom: 4 }}>
            From: t1Abc...xyz
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: TYPE.small, color: COLORS.textSecondary, marginBottom: 8 }}>
            To: t1Def...uvw
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: TYPE.body, color: COLORS.white, fontWeight: 700 }}>
            2.5 ZEC
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: TYPE.h3, color: COLORS.shieldedGold, letterSpacing: 12 }}>
            * * * *
          </div>
          <div style={{ fontFamily: FONTS.text, fontSize: TYPE.small, color: COLORS.textTertiary, marginTop: 8 }}>
            Encrypted & Hidden
          </div>
        </div>
      )}

      {/* Label badge */}
      <div
        style={{
          marginTop: 20,
          padding: "8px 24px",
          borderRadius: 100,
          background: isTransparent
            ? "rgba(100, 181, 246, 0.12)"
            : "rgba(255, 213, 79, 0.12)",
          border: `1px solid ${isTransparent ? "rgba(100, 181, 246, 0.2)" : "rgba(255, 213, 79, 0.2)"}`,
        }}
      >
        <div
          style={{
            fontSize: TYPE.small,
            color: isTransparent ? COLORS.transparentBlue : COLORS.shieldedGold,
            fontWeight: 600,
            fontFamily: FONTS.mono,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
