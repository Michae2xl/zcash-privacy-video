import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONTS, TYPE } from "../lib/constants";
import { PHOTO_SNOWDEN, PHOTO_ZOOKO, PHOTO_SCHNEIER, ZCASH_LOGO_YELLOW, ZCASH_LOGO_GRAY } from "../lib/assets";
import { SPRING_SMOOTH, SPRING_FAST } from "../lib/spring-configs";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { QuoteCard } from "../components/QuoteCard";
import { QUOTES } from "../lib/quotes";

export const PrivacyIsARight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cashEntrance = spring({ frame: frame - 10, fps, config: SPRING_SMOOTH });
  const digitalEntrance = spring({ frame: frame - 40, fps, config: SPRING_SMOOTH });

  const trailItems = [
    { name: "Bank", delay: 65 },
    { name: "ISP", delay: 75 },
    { name: "Government", delay: 85 },
    { name: "Ad Networks", delay: 95 },
    { name: "Analytics", delay: 105 },
    { name: "Social Media", delay: 115 },
    { name: "Data Brokers", delay: 125 },
    { name: "Credit Bureau", delay: 135 },
  ];

  // Quote montage with real photos
  const quoteMontageStart = 190;
  const selectedQuotes = [
    { ...QUOTES[4], photoSrc: undefined },           // Eric Hughes — no photo
    { ...QUOTES[3], photoSrc: PHOTO_ZOOKO },          // Zooko
    { ...QUOTES[5], photoSrc: PHOTO_SCHNEIER },        // Schneier
    { ...QUOTES[6], photoSrc: PHOTO_SNOWDEN },         // Snowden "nothing to hide"
  ];
  const framesPerQuote = Math.floor((600 - quoteMontageStart) / selectedQuotes.length);

  const comparisonOpacity = frame > quoteMontageStart
    ? interpolate(frame - quoteMontageStart, [0, 25], [1, 0], { extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill>
      <AnimatedBackground variant="default" />

      {/* Zcash watermark */}
      <Img src={ZCASH_LOGO_GRAY} style={{ position: "absolute", right: 60, top: 60, width: 80, height: 80, objectFit: "contain", opacity: 0.12 }} />

      {/* Cash vs Digital */}
      {frame < quoteMontageStart + 25 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: comparisonOpacity }}>
          <div style={{ display: "flex", gap: 200, alignItems: "flex-start" }}>
            {/* Cash side */}
            <div
              style={{
                textAlign: "center",
                opacity: cashEntrance,
                transform: `translateY(${interpolate(cashEntrance, [0, 1], [40, 0])}px)`,
                maxWidth: 560,
              }}
            >
              {/* Zcash official logo — large */}
              <Img src={ZCASH_LOGO_YELLOW} style={{ width: 200, height: 200, objectFit: "contain", filter: "drop-shadow(0 0 35px rgba(244, 183, 40, 0.35))" }} />
              <div style={{ fontFamily: FONTS.display, fontSize: TYPE.h2, color: COLORS.zcashYellow, fontWeight: 700, marginTop: 20, letterSpacing: -1 }}>
                Zcash
              </div>
              <div style={{ fontFamily: FONTS.text, fontSize: TYPE.caption, color: COLORS.textSecondary, marginTop: 14, lineHeight: 1.6 }}>
                Shielded transactions.
                <br />
                Private by default.
              </div>
              {/* Shield badge */}
              <div
                style={{
                  marginTop: 28, padding: "14px 32px", borderRadius: 100,
                  background: "rgba(244, 183, 40, 0.08)",
                  border: "1px solid rgba(244, 183, 40, 0.2)",
                  fontFamily: FONTS.text, fontSize: TYPE.small, color: COLORS.zcashYellow,
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontWeight: 600,
                }}
              >
                <Img src={ZCASH_LOGO_YELLOW} style={{ width: 22, height: 22, objectFit: "contain", display: "inline-block", verticalAlign: "middle", marginRight: 8 }} />
                Shielded by Default
              </div>
            </div>

            {/* VS divider */}
            <div
              style={{
                marginTop: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 1, height: 60, background: `linear-gradient(180deg, transparent, ${COLORS.textTertiary}, transparent)` }} />
              <div style={{ fontSize: TYPE.body, color: COLORS.textTertiary, fontFamily: FONTS.display, fontWeight: 300 }}>
                vs
              </div>
              <div style={{ width: 1, height: 60, background: `linear-gradient(180deg, transparent, ${COLORS.textTertiary}, transparent)` }} />
            </div>

            {/* Digital side */}
            <div
              style={{
                textAlign: "center",
                opacity: digitalEntrance,
                transform: `translateY(${interpolate(digitalEntrance, [0, 1], [40, 0])}px)`,
                maxWidth: 560,
              }}
            >
              {/* Dollar sign — surveillance money */}
              <svg width={200} height={200} viewBox="0 0 150 150">
                <circle cx={75} cy={75} r={68} fill="none" stroke="rgba(255, 69, 58, 0.25)" strokeWidth={3} />
                <circle cx={75} cy={75} r={68} fill="rgba(255, 69, 58, 0.06)" />
                <text x={75} y={95} textAnchor="middle" fontFamily="SF Pro Display, Inter, sans-serif" fontSize={72} fontWeight={700} fill="rgba(255, 69, 58, 0.5)">$</text>
                {/* Scan lines */}
                <line x1={20} y1={75} x2={130} y2={75} stroke="rgba(255, 69, 58, 0.15)" strokeWidth={1} strokeDasharray="4 3" />
                <line x1={75} y1={15} x2={75} y2={135} stroke="rgba(255, 69, 58, 0.15)" strokeWidth={1} strokeDasharray="4 3" />
              </svg>
              <div style={{ fontFamily: FONTS.display, fontSize: TYPE.h2, color: COLORS.red, fontWeight: 700, marginTop: 20, letterSpacing: -1 }}>
                Dollar (Digital)
              </div>
              <div style={{ fontFamily: FONTS.text, fontSize: TYPE.caption, color: COLORS.textSecondary, marginTop: 14, lineHeight: 1.6 }}>
                Every transaction tracked.
                <br />
                Surveillance by default.
              </div>
              {/* Data trail tags growing in */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, justifyContent: "center", maxWidth: 360 }}>
                {trailItems.map((item) => {
                  const tagSpring = spring({ frame: frame - item.delay, fps, config: SPRING_FAST });
                  return (
                    <div
                      key={item.name}
                      style={{
                        padding: "7px 14px", borderRadius: 8,
                        background: "rgba(255, 69, 58, 0.08)",
                        border: "1px solid rgba(255, 69, 58, 0.15)",
                        fontFamily: FONTS.text, fontSize: TYPE.small, color: COLORS.red,
                        opacity: tagSpring, transform: `scale(${tagSpring})`,
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: COLORS.red, marginRight: 6, verticalAlign: "middle" }} />
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* UN Article 12 */}
          <div
            style={{
              position: "absolute", bottom: 80,
              textAlign: "center", maxWidth: 1200,
              opacity: interpolate(frame - 130, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <div style={{ fontFamily: FONTS.text, fontSize: TYPE.small - 2, color: COLORS.textTertiary, textTransform: "uppercase", letterSpacing: 3, marginBottom: 12 }}>
              UN Declaration of Human Rights — Article 12
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: TYPE.body + 2, color: COLORS.white, fontStyle: "italic", lineHeight: 1.5 }}>
              "No one shall be subjected to arbitrary interference with his privacy"
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Quote montage with real photos */}
      {selectedQuotes.map((quote, i) => (
        <Sequence key={`quote-${i}`} from={quoteMontageStart + i * framesPerQuote} durationInFrames={framesPerQuote}>
          <QuoteCard
            text={quote.text}
            author={quote.author}
            role={quote.role}
            photoSrc={quote.photoSrc}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
