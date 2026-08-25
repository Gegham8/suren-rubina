"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Looping ambient track. Browsers forbid audio with sound before the visitor
 * has interacted with the page, so playback is driven by the intro: the page
 * calls the exposed `play()` from within the tap-to-open gesture. As a fallback
 * for the #showmore skip-refresh path (no intro tap), it also starts on the
 * first gesture of any kind. Renders no UI; there is no visible control by
 * design.
 */

const TRACK_SRC = "/music/background.mp3";
const VOLUME = 0.5;
const GESTURE_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

export type BackgroundMusicHandle = { play: () => void };

const BackgroundMusic = forwardRef<BackgroundMusicHandle>(function BackgroundMusic(_props, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useImperativeHandle(ref, () => ({
    play: (): void => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = VOLUME;
      void audio.play().catch(() => {});
    },
  }), []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;

    const startOnGesture = (): void => {
      void audio.play().catch(() => {});
      GESTURE_EVENTS.forEach((event) => window.removeEventListener(event, startOnGesture));
    };

    GESTURE_EVENTS.forEach((event) =>
      window.addEventListener(event, startOnGesture, { passive: true }),
    );

    return () =>
      GESTURE_EVENTS.forEach((event) => window.removeEventListener(event, startOnGesture));
  }, []);

  return <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" />;
});

export default BackgroundMusic;
