"use client";

import { useEffect, useRef } from "react";

/**
 * Looping ambient track. Browsers forbid audio with sound before the visitor
 * has interacted with the page, so this starts as early as that policy allows:
 * a best-effort attempt on mount (works only where the browser already grants
 * autoplay), falling back to the first user interaction of any kind — tap,
 * scroll, or key. Renders no UI; there is no visible control by design.
 */

const TRACK_SRC = "/music/background.mp3";
const VOLUME = 0.5;
const GESTURE_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;

    const startOnGesture = (): void => {
      void audio.play().catch(() => {});
      GESTURE_EVENTS.forEach((event) => window.removeEventListener(event, startOnGesture));
    };

    // Try immediately; browsers usually block this until a gesture exists.
    audio.play().catch(() => {
      GESTURE_EVENTS.forEach((event) =>
        window.addEventListener(event, startOnGesture, { passive: true }),
      );
    });

    return () =>
      GESTURE_EVENTS.forEach((event) => window.removeEventListener(event, startOnGesture));
  }, []);

  return <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" />;
}
