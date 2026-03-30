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
import { ZCASH_LOGO_YELLOW, ZCASH_LOGO_GRAY } from "../lib/assets";
import { SPRING_SMOOTH, SPRING_FAST, SPRING_BOUNCY } from "../lib/spring-configs";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { AnimatedText } from "../components/AnimatedText";

export const ZkSnarks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Acronym breakdown
  const acronymParts = [
    { letter: "zk", full: "Zero-Knowledge", color: COLORS.zcashYellow },
    { letter: "S", full: "Succinct", color: COLORS.blue },
    { letter: "N", full: "Non-Interactive", color: COLORS.purple },
    { letter: "ARK", full: "Argument of Knowledge", color: COLORS.white },
  ];

  // Waldo analogy phases — smooth pacing, scene duration is shorter
  const waldoLabel = interpolate(frame - 180, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const waldoPhase1 = frame > 200;
  const waldoPhase2 = frame > 320;
  const waldoPhase3 = frame > 400;

  // Cover progress
  const coverProgress = interpolate(frame - 320, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Peephole
  const peepholeSize = spring({ frame: frame - 400, fps, config: SPRING_BOUNCY });

  // Machine
  const machineEntrance = spring({ frame: frame - 520, fps, config: SPRING_SMOOTH });
  const dataFade = interpolate(frame - 560, [0, 50], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const proofOut = spring({ frame: frame - 640, fps, config: SPRING_BOUNCY });

  // Processing dots animation
  const processingActive = frame > 580 && frame < 640;
  const dotCount = Math.floor(((frame - 580) % 30) / 10) + 1;

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="cool" />

      {/* Zcash watermark */}
      <Img src={ZCASH_LOGO_GRAY} style={{ position: "absolute", right: 60, top: 60, width: 80, height: 80, objectFit: "contain", opacity: 0.12 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 35, width: "100%", textAlign: "center" }}>
        <AnimatedText text="How ZK-SNARKs Work" fontSize={TYPE.h1} color={COLORS.zcashYellow} />
      </div>

      {/* Acronym */}
      <div style={{ position: "absolute", top: 195, width: "100%", display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap", padding: "0 100px" }}>
        {acronymParts.map((part, i) => {
          const partSpring = spring({ frame: frame - 40 - i * 12, fps, config: SPRING_FAST });
          return (
            <div
              key={part.letter}
              style={{
                opacity: partSpring,
                transform: `translateY(${interpolate(partSpring, [0, 1], [25, 0])}px)`,
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                padding: "14px 26px",
                borderRadius: 14,
                background: `${part.color}10`,
                border: `1px solid ${part.color}20`,
              }}
            >
              <span style={{ fontFamily: FONTS.mono, fontSize: 48, color: part.color, fontWeight: 800 }}>
                {part.letter}
              </span>
              <span style={{ fontFamily: FONTS.text, fontSize: TYPE.caption, color: COLORS.textSecondary }}>
                {part.full}
              </span>
            </div>
          );
        })}
      </div>

      {/* Waldo Analogy */}
      <div style={{ position: "absolute", top: 320, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: TYPE.body, fontFamily: FONTS.text, color: COLORS.textSecondary, marginBottom: 28, opacity: waldoLabel, fontWeight: 500 }}>
          The "Where's Waldo" Analogy
        </div>

        <div style={{ position: "relative", width: 920, height: 400 }}>
          {/* Grid of data points */}
          {waldoPhase1 && (
            <div
              style={{
                width: 920, height: 400, borderRadius: 24,
                background: COLORS.bgCard,
                border: `1px solid rgba(255,255,255,0.06)`,
                position: "absolute",
                display: "flex", flexWrap: "wrap", gap: 16, padding: 28,
                justifyContent: "center", alignItems: "center",
                opacity: interpolate(frame - 300, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const isTarget = i === 28;
                const dotEntrance = spring({ frame: frame - 210 - i * 1.2, fps, config: SPRING_FAST });
                return (
                  <div
                    key={i}
                    style={{
                      width: isTarget ? 32 : 24,
                      height: isTarget ? 32 : 24,
                      borderRadius: "50%",
                      background: isTarget
                        ? `linear-gradient(135deg, ${COLORS.zcashGold}, ${COLORS.zcashYellow})`
                        : "rgba(255,255,255,0.12)",
                      boxShadow: isTarget ? `0 0 20px ${COLORS.zcashYellow}` : "none",
                      opacity: dotEntrance,
                      transform: `scale(${dotEntrance})`,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Cover sheet */}
          {waldoPhase2 && (
            <div
              style={{
                position: "absolute", width: 920, height: 400, borderRadius: 24,
                background: `linear-gradient(135deg, ${COLORS.bgNavy}, ${COLORS.bgPurple})`,
                border: `1px solid rgba(255,255,255,0.08)`,
                opacity: coverProgress,
                display: "flex", justifyContent: "center", alignItems: "center",
              }}
            >
              {/* Peephole */}
              {waldoPhase3 && (
                <div
                  style={{
                    width: 110 * peepholeSize,
                    height: 110 * peepholeSize,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.zcashGold}, ${COLORS.zcashYellow})`,
                    boxShadow: `0 0 50px rgba(244, 183, 40, ${peepholeSize * 0.5})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#1C1C1E",
                  }}
                >
                  {"\u2713"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phase labels */}
        <div style={{ marginTop: 20, fontFamily: FONTS.text, fontSize: TYPE.body, textAlign: "center", minHeight: 40 }}>
          {!waldoPhase2 && waldoPhase1 && (
            <span style={{ color: COLORS.textSecondary }}>All transaction data exposed on the blockchain</span>
          )}
          {waldoPhase2 && !waldoPhase3 && (
            <span style={{ color: COLORS.blue }}>ZK-SNARK covers everything with cryptographic proof...</span>
          )}
          {waldoPhase3 && (
            <span style={{ color: COLORS.zcashYellow, fontWeight: 600 }}>
              Proof verified! No data was revealed.
            </span>
          )}
        </div>
      </div>

      {/* ZK Machine metaphor */}
      <div style={{ position: "absolute", bottom: 70, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 24, opacity: machineEntrance }}>
        {/* Data input */}
        <div
          style={{
            padding: "16px 28px", borderRadius: 14,
            border: `1px solid rgba(100, 181, 246, 0.2)`,
            background: "rgba(100, 181, 246, 0.06)",
            fontFamily: FONTS.mono, fontSize: TYPE.caption, color: COLORS.transparentBlue,
            opacity: dataFade,
          }}
        >
          sender, receiver, amount
        </div>

        <div style={{ color: COLORS.textTertiary, fontSize: TYPE.body }}>{"\u2192"}</div>

        {/* ZK Machine */}
        <div
          style={{
            padding: "20px 40px", borderRadius: 18,
            background: "rgba(244, 183, 40, 0.08)",
            border: `1.5px solid rgba(244, 183, 40, 0.25)`,
            boxShadow: "0 0 40px rgba(244, 183, 40, 0.1)",
            fontFamily: FONTS.display, fontSize: TYPE.body, color: COLORS.zcashYellow, fontWeight: 700,
          }}
        >
          <Img src={ZCASH_LOGO_YELLOW} style={{ width: 36, height: 36, objectFit: "contain", display: "inline-block", verticalAlign: "middle", marginRight: 12 }} />
          ZK-SNARK Engine
          {processingActive && (
            <span style={{ color: COLORS.textTertiary }}>{".".repeat(dotCount)}</span>
          )}
        </div>

        <div style={{ color: COLORS.textTertiary, fontSize: TYPE.body }}>{"\u2192"}</div>

        {/* Proof output */}
        <div
          style={{
            padding: "16px 28px", borderRadius: 14,
            border: `1.5px solid rgba(244, 183, 40, 0.3)`,
            background: "rgba(244, 183, 40, 0.1)",
            fontFamily: FONTS.mono, fontSize: TYPE.caption, color: COLORS.zcashYellow, fontWeight: 600,
            opacity: proofOut, transform: `scale(${proofOut})`,
            boxShadow: `0 0 30px rgba(244, 183, 40, ${proofOut * 0.3})`,
          }}
        >
          {"\u2705"} Valid (288 bytes)
        </div>
      </div>
    </AbsoluteFill>
  );
};
