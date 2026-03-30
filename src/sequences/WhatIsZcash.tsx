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
import { ZCASH_LOGO_YELLOW, ZCASH_LOGO_WHITE, BITCOIN_LOGO } from "../lib/assets";
import { SPRING_SMOOTH, SPRING_FAST, SPRING_BOUNCY } from "../lib/spring-configs";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { AnimatedText } from "../components/AnimatedText";
import { HalvingChart } from "../components/HalvingChart";

const FEATURES = [
  { btc: "All transactions public", zec: "Optional full privacy", icon: "privacy", same: false },
  { btc: "Pseudonymous addresses", zec: "Shielded (z) addresses", icon: "shield", same: false },
  { btc: "Transparent ledger", zec: "zk-SNARKs encrypted proofs", icon: "proof", same: false },
  { btc: "21M supply cap", zec: "21M supply cap", icon: "supply", same: true },
] as const;

export const WhatIsZcash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === PHASE 1: Fork visual (0–120) ===
  const btcScale = spring({ frame: frame - 15, fps, config: SPRING_BOUNCY });
  const btcOpacity = interpolate(frame, [10, 35, 90, 120], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const arrowProgress = spring({ frame: frame - 50, fps, config: SPRING_SMOOTH });
  const zecEntrance = spring({ frame: frame - 85, fps, config: SPRING_BOUNCY });

  // === PHASE 2: Feature comparison (120–320) ===
  const showFeatures = frame >= 120 && frame < 330;
  const featuresFade = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const featuresOut = interpolate(frame, [310, 330], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === PHASE 3: Halving chart (330+) ===
  const showChart = frame >= 320;
  const chartFade = interpolate(frame, [320, 350], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title phases
  const titlePhase = showChart ? "halving" : showFeatures ? "features" : "fork";

  return (
    <AbsoluteFill>
      <AnimatedBackground variant={showChart ? "warm" : "default"} />

      {/* Title */}
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", zIndex: 10 }}>
        {titlePhase === "fork" && (
          <AnimatedText text="What is Zcash?" fontSize={TYPE.h1} color={COLORS.white} delay={5} />
        )}
        {titlePhase === "features" && (
          <AnimatedText text="Bitcoin vs Zcash" fontSize={TYPE.h1} color={COLORS.white} delay={0} />
        )}
        {titlePhase === "halving" && (
          <AnimatedText text="Halving Every 4 Years" fontSize={TYPE.h1} color={COLORS.zcashYellow} delay={0} />
        )}
        <div
          style={{
            fontSize: TYPE.caption,
            fontFamily: FONTS.text,
            color: COLORS.textSecondary,
            marginTop: 8,
            opacity: interpolate(
              frame,
              titlePhase === "fork" ? [30, 50] : titlePhase === "features" ? [130, 150] : [335, 355],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            letterSpacing: 1,
          }}
        >
          {titlePhase === "fork" && "Born from Bitcoin, built for privacy"}
          {titlePhase === "features" && "Same foundation, different philosophy"}
          {titlePhase === "halving" && "Block rewards decrease, scarcity increases"}
        </div>
      </div>

      {/* === PHASE 1: Fork visual === */}
      {!showFeatures && !showChart && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
            {/* Bitcoin */}
            <div style={{ opacity: btcOpacity, transform: `scale(${btcScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Img
                src={BITCOIN_LOGO}
                style={{
                  width: 240, height: 240, objectFit: "contain",
                  filter: "drop-shadow(0 0 50px rgba(247, 147, 26, 0.35)) drop-shadow(0 16px 50px rgba(0,0,0,0.4))",
                }}
              />
              <div style={{ color: COLORS.textSecondary, fontFamily: FONTS.text, fontSize: TYPE.body, marginTop: 22, fontWeight: 500 }}>
                Bitcoin (2009)
              </div>
            </div>

            {/* Fork arrow */}
            <div style={{ opacity: arrowProgress, position: "relative" }}>
              <svg width={180} height={70} viewBox="0 0 180 70">
                <defs>
                  <linearGradient id="arrowG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F7931A" />
                    <stop offset="100%" stopColor={COLORS.zcashYellow} />
                  </linearGradient>
                </defs>
                <line x1="0" y1="35" x2={150 * arrowProgress} y2="35" stroke="url(#arrowG)" strokeWidth={3} strokeDasharray="10 5" />
                <path d={`M${145 * arrowProgress} 35 l-14 -12 M${145 * arrowProgress} 35 l-14 12`} stroke={COLORS.zcashYellow} strokeWidth={3} fill="none" strokeLinecap="round" />
              </svg>
              <div style={{ textAlign: "center", fontFamily: FONTS.mono, fontSize: TYPE.small, color: COLORS.textTertiary, marginTop: 4, letterSpacing: 3, textTransform: "uppercase" }}>
                Fork
              </div>
            </div>

            {/* Zcash */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  opacity: zecEntrance,
                  transform: `scale(${zecEntrance})`,
                  filter: `drop-shadow(0 0 50px rgba(244, 183, 40, ${zecEntrance * 0.4})) drop-shadow(0 16px 50px rgba(0,0,0,0.4))`,
                }}
              >
                <Img src={ZCASH_LOGO_YELLOW} style={{ width: 240, height: 240, objectFit: "contain" }} />
              </div>
              <div style={{ color: COLORS.zcashYellow, fontFamily: FONTS.text, fontSize: TYPE.body, marginTop: 22, fontWeight: 700, opacity: zecEntrance }}>
                Zcash (2016)
              </div>
            </div>
          </div>

          {/* Key pitch line */}
          <div
            style={{
              position: "absolute",
              bottom: 120,
              textAlign: "center",
              opacity: interpolate(zecEntrance, [0.5, 1], [0, 1]),
            }}
          >
            <div style={{ fontFamily: FONTS.serif, fontSize: TYPE.h3, color: COLORS.white, fontStyle: "italic", fontWeight: 400 }}>
              "If Bitcoin is <span style={{ color: COLORS.transparentBlue }}>HTTP</span>, Zcash is <span style={{ color: COLORS.zcashYellow, fontWeight: 700 }}>HTTPS</span>"
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* === PHASE 2: Feature comparison table === */}
      {showFeatures && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 40,
            opacity: featuresFade * featuresOut,
          }}
        >
          {/* Logos header */}
          <div style={{ display: "flex", alignItems: "center", gap: 500, marginBottom: 50 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Img src={BITCOIN_LOGO} style={{ width: 100, height: 100, objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(247, 147, 26, 0.3))" }} />
              <div style={{ fontFamily: FONTS.display, fontSize: TYPE.body, color: COLORS.textSecondary, marginTop: 12, fontWeight: 600 }}>Bitcoin</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Img src={ZCASH_LOGO_YELLOW} style={{ width: 100, height: 100, objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(244, 183, 40, 0.3))" }} />
              <div style={{ fontFamily: FONTS.display, fontSize: TYPE.body, color: COLORS.zcashYellow, marginTop: 12, fontWeight: 700 }}>Zcash</div>
            </div>
          </div>

          {/* Feature rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 1200 }}>
            {FEATURES.map((feat, i) => {
              const rowSpring = spring({ frame: frame - 140 - i * 15, fps, config: SPRING_FAST });
              const barWidth = spring({ frame: frame - 160 - i * 15, fps, config: SPRING_SMOOTH });

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    opacity: rowSpring,
                    transform: `translateY(${interpolate(rowSpring, [0, 1], [20, 0])}px)`,
                  }}
                >
                  {/* BTC side */}
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      padding: "18px 30px",
                      borderRadius: 16,
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      marginRight: 12,
                    }}
                  >
                    <div style={{ fontFamily: FONTS.text, fontSize: TYPE.caption, color: COLORS.textSecondary }}>
                      {feat.btc}
                    </div>
                  </div>

                  {/* Center indicator */}
                  <div
                    style={{
                      width: 50, height: 50, borderRadius: "50%",
                      background: feat.same
                        ? "rgba(48, 209, 88, 0.1)"
                        : "rgba(244, 183, 40, 0.1)",
                      border: `2px solid ${feat.same ? COLORS.green : COLORS.zcashYellow}30`,
                      display: "flex", justifyContent: "center", alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {feat.same ? (
                      <span style={{ color: COLORS.green, fontSize: 20, fontWeight: 700 }}>=</span>
                    ) : (
                      <Img src={ZCASH_LOGO_YELLOW} style={{ width: 28, height: 28, objectFit: "contain" }} />
                    )}
                  </div>

                  {/* ZEC side */}
                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                      padding: "18px 30px",
                      borderRadius: 16,
                      background: feat.same
                        ? "rgba(48, 209, 88, 0.04)"
                        : "rgba(244, 183, 40, 0.04)",
                      border: `1px solid ${feat.same ? COLORS.green : COLORS.zcashYellow}15`,
                      marginLeft: 12,
                      boxShadow: feat.same ? "none" : "0 0 20px rgba(244, 183, 40, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONTS.text,
                        fontSize: TYPE.caption,
                        color: feat.same ? COLORS.green : COLORS.zcashYellow,
                        fontWeight: feat.same ? 400 : 600,
                      }}
                    >
                      {feat.zec}
                    </div>
                    {/* Advantage bar */}
                    {!feat.same && (
                      <div style={{ width: 80, height: 3, borderRadius: 2, marginTop: 10, overflow: "hidden", background: "rgba(255,255,255,0.04)" }}>
                        <div style={{ width: `${barWidth * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.zcashAmber}, ${COLORS.zcashYellow})`, borderRadius: 2 }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom pitch */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              textAlign: "center",
              opacity: interpolate(frame - 240, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ fontFamily: FONTS.display, fontSize: TYPE.h3, color: COLORS.white, fontWeight: 600, letterSpacing: -0.5 }}>
              Same security. Same scarcity.{" "}
              <span style={{ color: COLORS.zcashYellow }}>Added privacy.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* === PHASE 3: Halving chart === */}
      {showChart && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 70, opacity: chartFade }}>
          <HalvingChart delay={335} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
