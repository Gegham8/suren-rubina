"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";

/**
 * The intro overlay: a fully-opaque, fixed full-screen light-transition video.
 * It covers the entire page so nothing beneath is visible until the video ends.
 * The 28MB clip is fully prefetched into a blob up front (not just `preload`,
 * which only buffers enough to *estimate* smooth playback) and played from
 * memory, so it runs start-to-finish with zero buffering. The tap prompt only
 * arms once the clip is ready. When the video ends, `onEnded` opens the page and
 * the overlay fades away to reveal it.
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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fully download the clip into a blob, then play it from memory — guarantees
  // no mid-play buffering. Skip on the #showmore skip-refresh path (intro already
  // open). Falls back to streaming from the URL if the fetch fails.
  useEffect(() => {
    if (isOpen) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;
    const prefetch = async (): Promise<void> => {
      try {
        const res = await fetch(VIDEO_SRC, { signal: controller.signal });
        if (!res.ok) throw new Error(`video fetch failed: ${res.status}`);
        objectUrl = URL.createObjectURL(await res.blob());
        setVideoUrl(objectUrl);
      } catch {
        if (!controller.signal.aborted) setVideoUrl(VIDEO_SRC);
      }
    };
    void prefetch();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#ECEBE9]"
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
          src={videoUrl ?? undefined}
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsReady(true)}
          onEnded={onEnded}
          className="h-full w-full select-none object-cover md:object-contain"
        />
      </button>
    </motion.div>
  );
}
