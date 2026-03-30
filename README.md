# Zcash Privacy Video

A cinematic explainer video about Zcash privacy built with [Remotion](https://www.remotion.dev/) — React for programmatic video creation.

## Preview

> Clone the repo and run `npm start` to preview in Remotion Studio, or render the final video with `npm run build`.

## Scenes

| # | Scene | Duration | Description |
|---|-------|----------|-------------|
| 1 | **Hook** | 8s | Edward Snowden quote with cinematic letterbox |
| 2 | **What is Zcash** | 17s | Bitcoin fork visual, feature comparison, halving chart |
| 3 | **Transparent vs Shielded** | 30s | Conveyor belt animation showing transaction shielding |
| 4 | **ZK-SNARKs** | 24s | Acronym breakdown, "Where's Waldo" analogy, ZK machine |
| 5 | **The Ceremony** | 25s | Trusted setup orbital diagram with shard destruction |
| 6 | **Privacy is a Right** | 20s | Zcash vs surveillance comparison + quote montage |
| 7 | **Closing** | 10s | Logo, tagline, CTA |

**Total: ~2 minutes 14 seconds @ 30fps**

## Tech Stack

- [Remotion 4.0](https://www.remotion.dev/) — React-based video framework
- [React 19](https://react.dev/) — UI components
- [TypeScript 6](https://www.typescriptlang.org/) — Type safety
- [@remotion/transitions](https://www.remotion.dev/docs/transitions) — Scene transitions (fade, slide, wipe)

## Getting Started

```bash
# Install dependencies
npm install

# Start Remotion Studio (live preview)
npm start

# Render the full video
npm run build
```

The rendered video will be saved to `out/zcash-privacy.mp4`.

## Project Structure

```
src/
├── index.ts              # Remotion entry point
├── Root.tsx              # Composition registry + scene orchestration
├── lib/
│   ├── constants.ts      # Colors, fonts, durations, data
│   ├── spring-configs.ts # Animation spring presets
│   ├── assets.ts         # Static file references
│   └── quotes.ts         # Quote data
├── components/           # Reusable animated building blocks
│   ├── AnimatedBackground.tsx  # Gradient orbs + particles + vignette
│   ├── AnimatedText.tsx        # Word-by-word spring entrance
│   ├── QuoteCard.tsx           # Full-screen quote with typewriter effect
│   ├── HalvingChart.tsx        # Animated bar chart with rolling coin
│   ├── PersonPhoto.tsx         # Photo with animated gradient ring
│   ├── GlassBox.tsx            # Glassmorphism card
│   ├── ZcashCoin.tsx           # 3D-flipping coin
│   └── ZcashLogo.tsx           # Animated logo with glow
├── sequences/            # Individual scenes
│   ├── Hook.tsx
│   ├── WhatIsZcash.tsx
│   ├── TransparentVsShielded.tsx
│   ├── ZkSnarks.tsx
│   ├── TheCeremony.tsx
│   ├── PrivacyIsARight.tsx
│   └── Closing.tsx
└── public/               # Static assets (logos, photos)
```

## Design System

- **Dark mode** with Apple-keynote-inspired aesthetics
- **Zcash brand colors**: `#F4B728` (yellow), `#FFD666` (gold), `#E09E00` (amber)
- **Typography**: SF Pro Display / Inter for headings, monospace for data
- **4 spring presets**: FAST, SMOOTH, BOUNCY, SLOW for consistent animation feel

## Adapting for Another Project

This template can be reused for any crypto/blockchain explainer video:

1. Swap brand colors in `src/lib/constants.ts`
2. Replace logos in `public/` and update `src/lib/assets.ts`
3. Update data arrays (halving data, feature comparisons, quotes)
4. Adjust scene durations in the `SCENES` object
5. Add/remove scenes — each sequence is self-contained

## Individual Scene Preview

Each scene is registered as its own Remotion composition, so you can preview them individually in Remotion Studio or render them separately:

```bash
npx remotion render Hook out/hook.mp4
npx remotion render WhatIsZcash out/what-is-zcash.mp4
```

## Credits

- [Zcash](https://z.cash/) — Brand assets
- [ZecHub](https://zechub.xyz/) — Community resources
- Built with [Remotion](https://www.remotion.dev/)

## License

MIT
