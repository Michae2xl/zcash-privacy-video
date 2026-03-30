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
import { ZCASH_LOGO_YELLOW, ZCASH_LOGO_WHITE, ZCASH_LOGO_GRAY } from "../lib/assets";
import { SPRING_SMOOTH, SPRING_FAST, SPRING_BOUNCY } from "../lib/spring-configs";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { AnimatedText } from "../components/AnimatedText";

const PARTICIPANTS = [
  { angle: 0, label: "P1", city: "Denver" },
  { angle: 60, label: "P2", city: "London" },
  { angle: 120, label: "P3", city: "Tokyo" },
  { angle: 180, label: "P4", city: "Berlin" },
  { angle: 240, label: "P5", city: "S\u00E3o Paulo" },
  { angle: 300, label: "P6", city: "Mumbai" },
] as const;

const TIMELINE = [
  { year: "2016", name: "Sprout", detail: "6 participants", color: COLORS.blue },
  { year: "2018", name: "Sapling", detail: "87+ global participants", color: COLORS.green },
  { year: "2020+", name: "Halo 2", detail: "No ceremony needed!", color: COLORS.zcashYellow },
] as const;

export const TheCeremony: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Shard destruction
  const destroyStart = 220;
  const destroyProgress = interpolate(frame - destroyStart, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shield after destruction
  const shieldEntrance = spring({ frame: frame - 320, fps, config: SPRING_BOUNCY });

  // Timeline
  const timelineEntrance = spring({ frame: frame - 420, fps, config: SPRING_SMOOTH });

  // Central coin slow rotation
  const coinRotate = interpolate(Math.sin(frame * 0.012), [-1, 1], [-3, 3]);
  const coinGlow = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.2, 0.5]);

  // Orbit ring rotation
  const orbitRotation = interpolate(frame, [0, 600], [0, 60]);

  const containerSize = 720;
  const centerSize = 280;
  const participantRadius = 310;
  const participantSize = 90;

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="ceremony" />

      {/* Zcash watermark */}
      <Img src={ZCASH_LOGO_GRAY} style={{ position: "absolute", right: 60, top: 60, width: 80, height: 80, objectFit: "contain", opacity: 0.12 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center" }}>
        <AnimatedText text="The Ceremony" fontSize={TYPE.h1} color={COLORS.white} />
        <div
          style={{
            fontSize: TYPE.caption,
            fontFamily: FONTS.text,
            color: COLORS.textSecondary,
            marginTop: 10,
            opacity: interpolate(frame - 25, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Trusted Setup — Creating the system parameters
        </div>
      </div>

      {/* Main ceremony circle */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -52%)" }}>
        <div style={{ position: "relative", width: containerSize, height: containerSize }}>

          {/* Orbit ring — subtle rotating dashed circle */}
          <svg
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: containerSize, height: containerSize,
              transform: `rotate(${orbitRotation}deg)`,
            }}
          >
            <circle
              cx={containerSize / 2}
              cy={containerSize / 2}
              r={participantRadius}
              fill="none"
              stroke={COLORS.zcashYellow}
              strokeWidth={1}
              strokeDasharray="6 10"
              opacity={0.15}
            />
          </svg>

          {/* Central Zcash coin — LARGE, fills the center */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${coinRotate}deg)`,
              width: centerSize,
              height: centerSize,
              borderRadius: "50%",
              overflow: "hidden",
              filter: `drop-shadow(0 0 ${50 * coinGlow}px rgba(244, 183, 40, ${coinGlow})) drop-shadow(0 8px 30px rgba(0,0,0,0.5))`,
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

          {/* Shield overlay after destruction — glows on top of coin */}
          {shieldEntrance > 0.01 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${shieldEntrance})`,
                width: centerSize + 40,
                height: centerSize + 40,
                borderRadius: "50%",
                border: `3px solid ${COLORS.zcashYellow}`,
                opacity: shieldEntrance * 0.8,
                boxShadow: `0 0 60px rgba(244, 183, 40, ${shieldEntrance * 0.5}), inset 0 0 40px rgba(244, 183, 40, ${shieldEntrance * 0.15})`,
              }}
            />
          )}

          {/* Connection lines from participants to center */}
          <svg
            style={{ position: "absolute", top: 0, left: 0, width: containerSize, height: containerSize, pointerEvents: "none" }}
          >
            {PARTICIPANTS.map((p, i) => {
              const pEntrance = spring({ frame: frame - 60 - i * 12, fps, config: SPRING_FAST });
              const rad = (p.angle * Math.PI) / 180;
              const px = containerSize / 2 + Math.cos(rad) * participantRadius;
              const py = containerSize / 2 + Math.sin(rad) * participantRadius;

              const isDestroyed = frame > destroyStart && destroyProgress > i * 0.14;
              const destroyOpacity = isDestroyed
                ? interpolate(destroyProgress, [i * 0.14, i * 0.14 + 0.14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                : 1;

              return (
                <line
                  key={`line-${p.label}`}
                  x1={containerSize / 2}
                  y1={containerSize / 2}
                  x2={px}
                  y2={py}
                  stroke={isDestroyed ? COLORS.red : COLORS.zcashYellow}
                  strokeWidth={1.5}
                  opacity={pEntrance * destroyOpacity * 0.25}
                  strokeDasharray="5 5"
                />
              );
            })}
          </svg>

          {/* Participants — larger circles */}
          {PARTICIPANTS.map((p, i) => {
            const pEntrance = spring({ frame: frame - 60 - i * 12, fps, config: SPRING_FAST });
            const rad = (p.angle * Math.PI) / 180;
            const px = Math.cos(rad) * participantRadius;
            const py = Math.sin(rad) * participantRadius;

            const isDestroyed = frame > destroyStart && destroyProgress > i * 0.14;
            const destroyOpacity = isDestroyed
              ? interpolate(destroyProgress, [i * 0.14, i * 0.14 + 0.14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              : 1;

            return (
              <div
                key={p.label}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${pEntrance})`,
                  opacity: pEntrance * destroyOpacity,
                  textAlign: "center",
                }}
              >
                {/* Participant circle */}
                <div
                  style={{
                    width: participantSize,
                    height: participantSize,
                    borderRadius: "50%",
                    background: isDestroyed
                      ? "rgba(255, 69, 58, 0.12)"
                      : "rgba(244, 183, 40, 0.1)",
                    border: `2px solid ${isDestroyed ? COLORS.red : COLORS.zcashYellow}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backdropFilter: "blur(8px)",
                    boxShadow: isDestroyed
                      ? "0 0 25px rgba(255, 69, 58, 0.25)"
                      : "0 0 20px rgba(244, 183, 40, 0.15)",
                  }}
                >
                  {isDestroyed ? (
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <line x1={6} y1={6} x2={18} y2={18} stroke={COLORS.red} strokeWidth={2.5} strokeLinecap="round" />
                      <line x1={18} y1={6} x2={6} y2={18} stroke={COLORS.red} strokeWidth={2.5} strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span style={{ fontFamily: FONTS.mono, fontSize: 24, color: COLORS.white, fontWeight: 600 }}>
                      {p.label}
                    </span>
                  )}
                </div>
                {/* City label */}
                <div style={{ fontFamily: FONTS.text, fontSize: 16, color: COLORS.textTertiary, marginTop: 10, whiteSpace: "nowrap" }}>
                  {p.city}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Security label — positioned above timeline */}
      {destroyProgress > 0.6 && (
        <div
          style={{
            position: "absolute",
            bottom: 250,
            width: "100%",
            textAlign: "center",
            fontFamily: FONTS.text,
            fontSize: TYPE.caption,
            color: COLORS.zcashYellow,
            opacity: interpolate(destroyProgress, [0.6, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontWeight: 600,
          }}
        >
          At least 1 honest participant = system is secure
        </div>
      )}

      {/* Evolution Timeline */}
      <div style={{ position: "absolute", bottom: 50, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 24, opacity: timelineEntrance }}>
        {TIMELINE.map((item, i) => {
          const itemSpring = spring({ frame: frame - 440 - i * 18, fps, config: SPRING_FAST });
          return (
            <React.Fragment key={item.year}>
              <div style={{ textAlign: "center", opacity: itemSpring, transform: `scale(${itemSpring})` }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: TYPE.small, color: COLORS.textTertiary }}>
                  {item.year}
                </div>
                <div
                  style={{
                    padding: "16px 32px", borderRadius: 18, marginTop: 10,
                    border: `1.5px solid ${item.color}30`,
                    background: `${item.color}08`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: `${item.color}20`, border: `2px solid ${item.color}`,
                    display: "flex", justifyContent: "center", alignItems: "center",
                    margin: "0 auto 8px",
                    fontSize: 14, fontFamily: FONTS.mono, color: item.color, fontWeight: 700,
                  }}>
                    {String(i + 1)}
                  </div>
                  <div style={{ fontFamily: FONTS.display, fontSize: TYPE.body, color: item.color, fontWeight: 700 }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: FONTS.text, fontSize: TYPE.small, color: COLORS.textSecondary, marginTop: 4 }}>
                    {item.detail}
                  </div>
                </div>
              </div>
              {i < TIMELINE.length - 1 && (
                <div style={{ color: COLORS.textTertiary, fontSize: TYPE.body, opacity: itemSpring, marginTop: 30 }}>
                  {"\u2192"}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
