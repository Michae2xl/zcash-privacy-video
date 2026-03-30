import React from "react";
import { Composition } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { FPS, WIDTH, HEIGHT, SCENES } from "./lib/constants";

import { Hook } from "./sequences/Hook";
import { WhatIsZcash } from "./sequences/WhatIsZcash";
import { TransparentVsShielded } from "./sequences/TransparentVsShielded";
import { ZkSnarks } from "./sequences/ZkSnarks";
import { TheCeremony } from "./sequences/TheCeremony";
import { PrivacyIsARight } from "./sequences/PrivacyIsARight";
import { Closing } from "./sequences/Closing";

const TRANSITION_FRAMES = 20;

const ZcashPrivacyVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Hook — Snowden quote */}
      <TransitionSeries.Sequence durationInFrames={SCENES.hook.duration}>
        <Hook />
      </TransitionSeries.Sequence>

      {/* Transition: Cinematic fade */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* Scene 2: What is Zcash + Halving */}
      <TransitionSeries.Sequence durationInFrames={SCENES.whatIsZcash.duration}>
        <WhatIsZcash />
      </TransitionSeries.Sequence>

      {/* Transition: Slide from right */}
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
      />

      {/* Scene 3: Transparent vs Shielded */}
      <TransitionSeries.Sequence durationInFrames={SCENES.transparentVsShielded.duration}>
        <TransparentVsShielded />
      </TransitionSeries.Sequence>

      {/* Transition: Wipe */}
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* Scene 4: ZK-SNARKs */}
      <TransitionSeries.Sequence durationInFrames={SCENES.zkSnarks.duration}>
        <ZkSnarks />
      </TransitionSeries.Sequence>

      {/* Transition: Fade for ceremony mood */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 25 })}
      />

      {/* Scene 5: The Ceremony */}
      <TransitionSeries.Sequence durationInFrames={SCENES.ceremony.duration}>
        <TheCeremony />
      </TransitionSeries.Sequence>

      {/* Transition: Slide up */}
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
      />

      {/* Scene 6: Privacy is a Right + Quote Montage */}
      <TransitionSeries.Sequence durationInFrames={SCENES.privacyIsARight.duration}>
        <PrivacyIsARight />
      </TransitionSeries.Sequence>

      {/* Transition: Cinematic fade to close */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 25 })}
      />

      {/* Scene 7: Closing */}
      <TransitionSeries.Sequence durationInFrames={SCENES.closing.duration}>
        <Closing />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// Total = sum of all scenes - sum of all transitions
const TOTAL_WITH_TRANSITIONS =
  SCENES.hook.duration +
  SCENES.whatIsZcash.duration +
  SCENES.transparentVsShielded.duration +
  SCENES.zkSnarks.duration +
  SCENES.ceremony.duration +
  SCENES.privacyIsARight.duration +
  SCENES.closing.duration -
  (TRANSITION_FRAMES * 4 + 25 * 2);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full video with transitions */}
      <Composition
        id="ZcashPrivacy"
        component={ZcashPrivacyVideo}
        durationInFrames={TOTAL_WITH_TRANSITIONS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Individual scenes for development */}
      <Composition id="Hook" component={Hook} durationInFrames={SCENES.hook.duration} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="WhatIsZcash" component={WhatIsZcash} durationInFrames={SCENES.whatIsZcash.duration} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="TransparentVsShielded" component={TransparentVsShielded} durationInFrames={SCENES.transparentVsShielded.duration} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="ZkSnarks" component={ZkSnarks} durationInFrames={SCENES.zkSnarks.duration} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="TheCeremony" component={TheCeremony} durationInFrames={SCENES.ceremony.duration} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="PrivacyIsARight" component={PrivacyIsARight} durationInFrames={SCENES.privacyIsARight.duration} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="Closing" component={Closing} durationInFrames={SCENES.closing.duration} fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
