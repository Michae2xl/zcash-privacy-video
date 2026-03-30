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
import { SPRING_SMOOTH, SPRING_FAST } from "../lib/spring-configs";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { AnimatedText } from "../components/AnimatedText";

// Conveyor belt roller
const Roller: React.FC<{ x: number; frame: number }> = ({ x, frame }) => {
  const rotation = (frame * 3) % 360;
  return (
    <g transform={`translate(${x}, 0)`}>
      <circle cy={0} r={18} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
      <circle cy={0} r={12} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      {/* Spokes */}
      {[0, 60, 120].map((a) => (
        <line
          key={a}
          x1={0} y1={-10} x2={0} y2={10}
          stroke="rgba(255,255,255,0.08)" strokeWidth={1}
          transform={`rotate(${a + rotation})`}
        />
      ))}
    </g>
  );
};

const TX_TYPES = [
  { from: "t", to: "t", label: "Fully Visible", privacy: 0 },
  { from: "t", to: "z", label: "Shielding", privacy: 0.5 },
  { from: "z", to: "t", label: "Deshielding", privacy: 0.5 },
  { from: "z", to: "z", label: "Fully Private", privacy: 1.0 },
] as const;

export const TransparentVsShielded: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === CONVEYOR BELT ANIMATION ===
  // Phase timeline:
  // 0-60: Title + conveyor appears
  // 60-200: White coin enters from left
  // 200-400: Coin enters the shielding machine (center)
  // 400-550: Golden coin exits right
  // 550+: Transaction types grid fades in

  const beltY = 500; // vertical center of belt
  const beltLeft = 100;
  const beltRight = 1820;
  const beltWidth = beltRight - beltLeft;
  const machineLeft = 760;
  const machineRight = 1160;
  const machineWidth = machineRight - machineLeft;

  // Belt appearance
  const beltEntrance = spring({ frame: frame - 20, fps, config: SPRING_SMOOTH });

  // Coin travel progress (full journey)
  const coinProgress = interpolate(frame - 80, [0, 420], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Coin X position along the belt
  const coinX = interpolate(coinProgress, [0, 1], [beltLeft - 40, beltRight + 40]);

  // Is coin inside machine?
  const insideMachine = coinX > machineLeft + 20 && coinX < machineRight - 20;
  const pastMachine = coinX >= machineRight - 20;

  // Coin visibility (hidden inside machine)
  const coinOpacity = insideMachine
    ? interpolate(coinX, [machineLeft, machineLeft + 60], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
    : pastMachine
      ? interpolate(coinX, [machineRight - 60, machineRight], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 1;

  // Coin rotation (rolling)
  const coinRotation = interpolate(coinProgress, [0, 1], [0, 1080]);

  // Coin size
  const coinSize = 120;

  // Machine processing effects
  const machineActive = coinX > machineLeft - 30 && coinX < machineRight + 80;
  const machinePulse = machineActive
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 1])
    : 0.3;
  const machineGlow = machineActive
    ? interpolate(Math.sin(frame * 0.12), [-1, 1], [0.2, 0.6])
    : 0;

  // Processing sparks/particles inside machine
  const sparkCount = machineActive ? 8 : 0;

  // Belt rollers positions
  const rollerCount = 18;
  const rollerSpacing = beltWidth / (rollerCount - 1);

  // Shield flash when coin exits
  const exitFlash = pastMachine && coinOpacity > 0.5;
  const flashIntensity = exitFlash
    ? interpolate(coinX, [machineRight, machineRight + 100], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Transaction types grid
  const gridEntrance = spring({ frame: frame - 550, fps, config: SPRING_SMOOTH });

  // Labels
  const labelBeforeEntrance = spring({ frame: frame - 50, fps, config: SPRING_FAST });
  const labelAfterEntrance = spring({ frame: frame - 460, fps, config: SPRING_FAST });

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="cool" />

      {/* Zcash watermark */}
      <Img src={ZCASH_LOGO_GRAY} style={{ position: "absolute", right: 60, top: 60, width: 80, height: 80, objectFit: "contain", opacity: 0.12 }} />

      {/* Title */}
      <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", zIndex: 5 }}>
        <AnimatedText text="Shielding a Transaction" fontSize={TYPE.h1} color={COLORS.white} />
      </div>

      {/* === CONVEYOR BELT FULL WIDTH === */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: beltEntrance,
        }}
      >
        {/* Belt structure */}
        <svg
          style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080 }}
          viewBox="0 0 1920 1080"
        >
          {/* Belt surface — top rail */}
          <line
            x1={beltLeft} y1={beltY + coinSize / 2 + 10}
            x2={beltRight} y2={beltY + coinSize / 2 + 10}
            stroke="rgba(255,255,255,0.08)" strokeWidth={3}
          />
          {/* Belt surface — bottom rail */}
          <line
            x1={beltLeft} y1={beltY + coinSize / 2 + 46}
            x2={beltRight} y2={beltY + coinSize / 2 + 46}
            stroke="rgba(255,255,255,0.05)" strokeWidth={2}
          />

          {/* Rollers */}
          {Array.from({ length: rollerCount }).map((_, i) => {
            const rx = beltLeft + i * rollerSpacing;
            // Skip rollers under the machine
            if (rx > machineLeft - 10 && rx < machineRight + 10) return null;
            return (
              <g key={i} transform={`translate(0, ${beltY + coinSize / 2 + 28})`}>
                <Roller x={rx} frame={frame} />
              </g>
            );
          })}

          {/* Moving belt lines (conveyor texture) */}
          {Array.from({ length: 30 }).map((_, i) => {
            const baseX = (i * 65 + frame * 2) % (beltWidth + 100) + beltLeft - 50;
            if (baseX > machineLeft - 5 && baseX < machineRight + 5) return null;
            return (
              <line
                key={`belt-${i}`}
                x1={baseX} y1={beltY + coinSize / 2 + 12}
                x2={baseX} y2={beltY + coinSize / 2 + 44}
                stroke="rgba(255,255,255,0.03)" strokeWidth={1}
              />
            );
          })}
        </svg>

        {/* "TRANSPARENT" label — left side */}
        <div
          style={{
            position: "absolute",
            left: beltLeft + 30,
            top: beltY - coinSize - 40,
            opacity: labelBeforeEntrance,
            transform: `translateY(${interpolate(labelBeforeEntrance, [0, 1], [20, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: TYPE.h3, color: COLORS.transparentBlue, fontWeight: 700, letterSpacing: 2 }}>
            TRANSPARENT
          </div>
          <div style={{ fontFamily: FONTS.text, fontSize: TYPE.small, color: COLORS.textTertiary, marginTop: 6 }}>
            Sender, receiver & amount visible
          </div>
        </div>

        {/* "SHIELDED" label — right side */}
        <div
          style={{
            position: "absolute",
            right: beltLeft + 30,
            top: beltY - coinSize - 40,
            textAlign: "right",
            opacity: labelAfterEntrance,
            transform: `translateY(${interpolate(labelAfterEntrance, [0, 1], [20, 0])}px)`,
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: TYPE.h3, color: COLORS.zcashYellow, fontWeight: 700, letterSpacing: 2 }}>
            SHIELDED
          </div>
          <div style={{ fontFamily: FONTS.text, fontSize: TYPE.small, color: COLORS.textSecondary, marginTop: 6 }}>
            Fully encrypted & private
          </div>
        </div>

        {/* === SHIELDING MACHINE === */}
        <div
          style={{
            position: "absolute",
            left: machineLeft,
            top: beltY - 120,
            width: machineWidth,
            height: 280,
          }}
        >
          {/* Machine body */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              background: `linear-gradient(180deg, rgba(244, 183, 40, ${0.04 + machinePulse * 0.06}) 0%, rgba(10, 14, 26, 0.95) 100%)`,
              border: `2px solid rgba(244, 183, 40, ${0.1 + machinePulse * 0.2})`,
              boxShadow: `
                0 0 ${60 * machineGlow}px rgba(244, 183, 40, ${machineGlow * 0.3}),
                inset 0 0 ${40 * machineGlow}px rgba(244, 183, 40, ${machineGlow * 0.05})
              `,
              backdropFilter: "blur(20px)",
            }}
          />

          {/* Machine label */}
          <div
            style={{
              position: "absolute",
              top: 20,
              width: "100%",
              textAlign: "center",
              fontFamily: FONTS.display,
              fontSize: TYPE.body,
              color: COLORS.zcashYellow,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            ZK-SNARK Shield
          </div>

          {/* Zcash logo inside machine */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${0.9 + machinePulse * 0.1})`,
              opacity: 0.15 + machinePulse * 0.1,
            }}
          >
            <Img src={ZCASH_LOGO_YELLOW} style={{ width: 100, height: 100, objectFit: "contain" }} />
          </div>

          {/* Processing indicator dots */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {[0, 1, 2].map((dot) => {
              const dotActive = machineActive && ((frame + dot * 8) % 30) < 15;
              return (
                <div
                  key={dot}
                  style={{
                    width: 10, height: 10, borderRadius: "50%",
                    backgroundColor: dotActive ? COLORS.zcashYellow : "rgba(255,255,255,0.1)",
                    boxShadow: dotActive ? `0 0 12px ${COLORS.zcashYellow}` : "none",
                    transition: "background-color 0.1s",
                  }}
                />
              );
            })}
          </div>

          {/* Entry gate — left */}
          <div style={{ position: "absolute", left: -4, top: 90, width: 8, height: 100, borderRadius: 4, background: `linear-gradient(180deg, ${COLORS.transparentBlue}40, ${COLORS.transparentBlue}10)`, border: `1px solid ${COLORS.transparentBlue}30` }} />

          {/* Exit gate — right */}
          <div style={{ position: "absolute", right: -4, top: 90, width: 8, height: 100, borderRadius: 4, background: `linear-gradient(180deg, ${COLORS.zcashYellow}40, ${COLORS.zcashYellow}10)`, border: `1px solid ${COLORS.zcashYellow}30` }} />

          {/* Sparks inside machine */}
          {Array.from({ length: sparkCount }).map((_, i) => {
            const sparkX = 40 + ((frame * 3 + i * 50) % (machineWidth - 80));
            const sparkY = 80 + Math.sin(frame * 0.2 + i * 2) * 50;
            const sparkOpacity = interpolate(Math.sin(frame * 0.3 + i), [-1, 1], [0, 0.6]);
            return (
              <div
                key={`spark-${i}`}
                style={{
                  position: "absolute",
                  left: sparkX,
                  top: sparkY,
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  backgroundColor: COLORS.zcashYellow,
                  opacity: sparkOpacity,
                  boxShadow: `0 0 8px ${COLORS.zcashYellow}`,
                }}
              />
            );
          })}
        </div>

        {/* === THE COIN === */}
        {coinProgress > 0 && coinProgress < 1 && (
          <div
            style={{
              position: "absolute",
              left: coinX - coinSize / 2,
              top: beltY - coinSize / 2,
              width: coinSize,
              height: coinSize,
              opacity: coinOpacity,
              transform: `rotate(${coinRotation}deg)`,
              zIndex: 8,
              filter: pastMachine
                ? `drop-shadow(0 0 30px rgba(244, 183, 40, 0.6)) drop-shadow(0 8px 20px rgba(0,0,0,0.4))`
                : `drop-shadow(0 0 15px rgba(255,255,255,0.15)) drop-shadow(0 8px 20px rgba(0,0,0,0.3))`,
            }}
          >
            <Img
              src={pastMachine ? ZCASH_LOGO_YELLOW : ZCASH_LOGO_WHITE}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        {/* Exit flash effect */}
        {flashIntensity > 0.01 && (
          <div
            style={{
              position: "absolute",
              left: machineRight - 40,
              top: beltY - 150,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(244, 183, 40, ${flashIntensity * 0.4}) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Data labels floating near coin */}
        {/* Before machine — transparent data */}
        {coinProgress > 0.05 && coinProgress < 0.35 && (
          <div
            style={{
              position: "absolute",
              left: coinX - 80,
              top: beltY + coinSize / 2 + 60,
              opacity: interpolate(coinProgress, [0.05, 0.12, 0.3, 0.35], [0, 0.8, 0.8, 0]),
              fontFamily: FONTS.mono,
              fontSize: 16,
              color: COLORS.transparentBlue,
              textAlign: "center",
              width: 160,
            }}
          >
            <div>From: t1Abc...xyz</div>
            <div>To: t1Def...uvw</div>
            <div style={{ color: COLORS.white, fontWeight: 600, marginTop: 4 }}>2.5 ZEC</div>
          </div>
        )}

        {/* After machine — encrypted data */}
        {pastMachine && coinOpacity > 0.5 && coinProgress < 0.95 && (
          <div
            style={{
              position: "absolute",
              left: coinX - 80,
              top: beltY + coinSize / 2 + 60,
              opacity: interpolate(coinProgress, [0.7, 0.78, 0.9, 0.95], [0, 0.8, 0.8, 0]),
              fontFamily: FONTS.mono,
              fontSize: 16,
              color: COLORS.zcashYellow,
              textAlign: "center",
              width: 160,
            }}
          >
            <div>From: *******</div>
            <div>To: *******</div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>*** ZEC</div>
          </div>
        )}
      </div>

      {/* Transaction types grid — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 24,
          opacity: gridEntrance,
          transform: `translateY(${interpolate(gridEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        {TX_TYPES.map((tx, i) => {
          const txSpring = spring({ frame: frame - 560 - i * 10, fps, config: SPRING_FAST });
          const isFullyPrivate = tx.from === "z" && tx.to === "z";

          const barWidth = spring({ frame: frame - 580 - i * 10, fps, config: SPRING_SMOOTH });

          return (
            <div
              key={`${tx.from}-${tx.to}`}
              style={{
                padding: "18px 30px",
                borderRadius: 18,
                border: `1.5px solid ${isFullyPrivate ? "rgba(255, 213, 79, 0.3)" : "rgba(255, 255, 255, 0.08)"}`,
                background: isFullyPrivate ? "rgba(255, 213, 79, 0.06)" : COLORS.bgCard,
                textAlign: "center",
                opacity: txSpring,
                transform: `scale(${txSpring})`,
                boxShadow: isFullyPrivate ? "0 0 30px rgba(244, 183, 40, 0.12)" : "none",
                backdropFilter: "blur(8px)",
                minWidth: 170,
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: TYPE.body, color: COLORS.white, fontWeight: 700 }}>
                {tx.from} {"\u2192"} {tx.to}
              </div>
              <div style={{ fontFamily: FONTS.text, fontSize: TYPE.small, color: isFullyPrivate ? COLORS.zcashYellow : COLORS.textSecondary, marginTop: 6, fontWeight: 500 }}>
                {tx.label}
              </div>
              <div style={{ width: 100, height: 5, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 3, marginTop: 12, marginLeft: "auto", marginRight: "auto", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${tx.privacy * 100 * barWidth}%`,
                    height: "100%",
                    background: isFullyPrivate
                      ? `linear-gradient(90deg, ${COLORS.zcashAmber}, ${COLORS.zcashYellow})`
                      : `linear-gradient(90deg, ${COLORS.transparentBlue}, #90CAF9)`,
                    borderRadius: 3,
                    boxShadow: isFullyPrivate ? `0 0 8px rgba(244, 183, 40, 0.4)` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
