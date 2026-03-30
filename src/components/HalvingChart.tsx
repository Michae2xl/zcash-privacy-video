import React from "react";
import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, TYPE, HALVING_DATA } from "../lib/constants";
import { ZCASH_LOGO_YELLOW } from "../lib/assets";
import { SPRING_SMOOTH, SPRING_FAST } from "../lib/spring-configs";

interface HalvingChartProps {
  readonly delay?: number;
}

export const HalvingChart: React.FC<HalvingChartProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartWidth = 1400;
  const chartHeight = 500;
  const maxReward = 12.5;
  const barWidth = 160;
  const barsCount = HALVING_DATA.length;
  const totalBarSpace = barWidth * barsCount;
  const totalGapSpace = chartWidth - totalBarSpace;
  const barGap = totalGapSpace / (barsCount + 1);

  // Smooth exponential decay curve points for the SVG path
  const curvePoints = Array.from({ length: 50 }, (_, i) => {
    const t = i / 49;
    const x = t * chartWidth;
    const reward = maxReward * Math.pow(0.5, t * 3); // simulates 3 halvings
    const y = chartHeight - (reward / maxReward) * chartHeight;
    return { x, y };
  });

  const curvePath = `M ${curvePoints.map((p) => `${p.x},${p.y}`).join(" L ")}`;

  // Curve draw animation
  const curveDrawProgress = interpolate(frame - delay, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rolling coin position along the curve
  const coinActive = frame > delay + 40;
  const coinT = interpolate(frame - delay - 40, [0, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const coinIndex = Math.floor(coinT * (curvePoints.length - 1));
  const coinPoint = curvePoints[Math.min(coinIndex, curvePoints.length - 1)];
  // Coin rotation based on distance traveled
  const coinRotation = interpolate(coinT, [0, 1], [0, 540]);

  return (
    <div style={{ width: chartWidth, height: chartHeight + 100, position: "relative" }}>
      {/* Y-axis label */}
      <div
        style={{
          position: "absolute",
          left: -70,
          top: "40%",
          transform: "rotate(-90deg)",
          fontFamily: FONTS.text,
          fontSize: TYPE.small,
          color: COLORS.textTertiary,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Block Reward
      </div>

      {/* Grid lines with labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const lineOpacity = spring({ frame: frame - delay - pct * 20, fps, config: SPRING_FAST });
        return (
          <React.Fragment key={pct}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 80 + pct * chartHeight,
                height: 1,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)`,
                opacity: lineOpacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -50,
                bottom: 72 + pct * chartHeight,
                fontFamily: FONTS.mono,
                fontSize: 16,
                color: COLORS.textTertiary,
                opacity: lineOpacity,
              }}
            >
              {(maxReward * pct).toFixed(1)}
            </div>
          </React.Fragment>
        );
      })}

      {/* Smooth decay curve */}
      <svg
        style={{ position: "absolute", left: 0, bottom: 80, width: chartWidth, height: chartHeight }}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        <defs>
          <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.zcashYellow} />
            <stop offset="100%" stopColor={COLORS.zcashAmber} stopOpacity={0.3} />
          </linearGradient>
          {/* Area fill under curve */}
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.zcashYellow} stopOpacity={0.12} />
            <stop offset="100%" stopColor={COLORS.zcashYellow} stopOpacity={0.01} />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        <path
          d={`${curvePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`}
          fill="url(#areaGrad)"
          opacity={curveDrawProgress}
        />

        {/* Curve line */}
        <path
          d={curvePath}
          fill="none"
          stroke="url(#curveGrad)"
          strokeWidth={3}
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - curveDrawProgress)}
          strokeLinecap="round"
        />
      </svg>

      {/* Bars at halving points */}
      {HALVING_DATA.map((item, i) => {
        const barDelay = delay + 30 + i * 18;
        const barSpring = spring({ frame: frame - barDelay, fps, config: SPRING_SMOOTH });

        const barHeight = (item.reward / maxReward) * chartHeight;
        const x = barGap + i * (barWidth + barGap);
        const isFuture = item.price === null;

        // Value counter animation
        const rewardCount = interpolate(barSpring, [0, 1], [0, item.reward]);

        return (
          <div key={item.year} style={{ position: "absolute", left: x, bottom: 80 }}>
            {/* Bar with gradient */}
            <div
              style={{
                width: barWidth,
                height: barHeight * barSpring,
                borderRadius: "14px 14px 4px 4px",
                background: isFuture
                  ? `repeating-linear-gradient(
                      -45deg,
                      rgba(244, 183, 40, 0.1),
                      rgba(244, 183, 40, 0.1) 4px,
                      rgba(244, 183, 40, 0.04) 4px,
                      rgba(244, 183, 40, 0.04) 8px
                    )`
                  : `linear-gradient(180deg, ${COLORS.zcashGold} 0%, ${COLORS.zcashAmber} 60%, rgba(200, 150, 10, 0.8) 100%)`,
                position: "absolute",
                bottom: 0,
                boxShadow: isFuture
                  ? "none"
                  : `0 0 25px rgba(244, 183, 40, ${0.1 + barSpring * 0.12}), inset 0 2px 8px rgba(255,255,255,0.15)`,
                border: isFuture ? `1.5px dashed rgba(244, 183, 40, 0.4)` : "none",
              }}
            />

            {/* Reward label — animated counter */}
            <div
              style={{
                position: "absolute",
                bottom: barHeight * barSpring + 14,
                width: barWidth,
                textAlign: "center",
                fontFamily: FONTS.mono,
                fontSize: TYPE.h3,
                color: COLORS.zcashYellow,
                fontWeight: 700,
                opacity: barSpring,
              }}
            >
              {rewardCount.toFixed(rewardCount < 2 ? 4 : rewardCount < 7 ? 2 : 1)} ZEC
            </div>

            {/* Year + detail label */}
            <div
              style={{
                position: "absolute",
                bottom: -50,
                width: barWidth,
                textAlign: "center",
                opacity: barSpring,
              }}
            >
              <div style={{ fontFamily: FONTS.display, fontSize: TYPE.body, color: isFuture ? COLORS.textTertiary : COLORS.white, fontWeight: 600 }}>
                {item.year}
              </div>
              {isFuture && (
                <div style={{ fontFamily: FONTS.text, fontSize: TYPE.small, color: COLORS.textTertiary, marginTop: 3, fontStyle: "italic" }}>
                  projected
                </div>
              )}
            </div>

            {/* Halving indicator between bars */}
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: -(barGap / 2) - 24,
                  bottom: barHeight * 0.3,
                  opacity: barSpring,
                  textAlign: "center",
                }}
              >
                <svg width={60} height={40} viewBox="0 0 60 40">
                  <rect x={4} y={4} width={52} height={32} rx={16} fill="rgba(255, 69, 58, 0.12)" stroke="rgba(255, 69, 58, 0.3)" strokeWidth={1.5} />
                  <text x={30} y={26} textAnchor="middle" fontFamily={FONTS.mono} fontSize={16} fontWeight={700} fill={COLORS.red}>
                    ÷2
                  </text>
                </svg>
              </div>
            )}
          </div>
        );
      })}

      {/* Large rolling Zcash coin along the curve */}
      {coinActive && (
        <div
          style={{
            position: "absolute",
            left: coinPoint.x - 70,
            bottom: 80 + (chartHeight - coinPoint.y) - 70,
            width: 140,
            height: 140,
            transform: `rotate(${coinRotation}deg)`,
            filter: `drop-shadow(0 6px 24px rgba(244, 183, 40, 0.6)) drop-shadow(0 0 40px rgba(244, 183, 40, 0.3))`,
            opacity: interpolate(coinT, [0, 0.02, 0.92, 1], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            zIndex: 10,
          }}
        >
          <Img src={ZCASH_LOGO_YELLOW} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      )}

      {/* X-axis line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 79,
          height: 1.5,
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)`,
        }}
      />
    </div>
  );
};
