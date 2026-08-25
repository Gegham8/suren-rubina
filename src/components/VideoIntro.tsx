"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";

/**
 * The intro overlay: a fully-opaque, fixed full-screen light-transition video.
 * It covers the entire page so nothing beneath is visible until the video ends.
 * The 28MB clip is preloaded up front; the tap prompt only arms once it can
 * play through, so playback runs smoothly without buffering. When the video
 * ends, `onEnded` opens the page and the overlay fades away to reveal it.
 */

const VIDEO_SRC = "/images/light-transition.MOV";

const FADE_OUT: Transition = { duration: 0.8, ease: "easeInOut" };
const INSTANT: Transition = { duration: 0 };

type VideoIntroProps = {
  isOpen: boolean;
  skipAnimation: boolean;
  onStart: () => void;
  onEnded: () => void;
};

export default function VideoIntro({ isOpen, skipAnimation, onStart, onEnded }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Kick off buffering immediately — `preload="auto"` alone is a hint browsers
  // may ignore, so call load() explicitly for the large clip. Skip it entirely
  // when the intro is already open (the #showmore skip-refresh path).
  useEffect(() => {
    if (isOpen) return;
    videoRef.current?.load();
  }, [isOpen]);

  const play = (): void => {
    const video = videoRef.current;
    if (!video || !isReady) return;
    // Start the ambient track inside this same tap gesture — required by the
    // browser autoplay policy — so music begins as the intro opens.
    onStart();
    setIsPlaying(true);
    void video.play();
  };


  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
      style={{ pointerEvents: isOpen ? "none" : "auto" }}
      aria-hidden={isOpen}
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={skipAnimation ? INSTANT : FADE_OUT}
    >
      <button
        type="button"
        onClick={play}
        disabled={isPlaying || !isReady}
        aria-label="Tap to play your invitation"
        className="relative h-full w-full cursor-pointer disabled:cursor-default"
        tabIndex={isOpen ? -1 : 0}
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsReady(true)}
          onEnded={onEnded}
          className="h-full w-full select-none object-cover"
        />
      </button>
    </motion.div>
  );
}
