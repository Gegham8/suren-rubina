"use client";

import Image from "next/image";
import { motion, type Transition } from "framer-motion";

import { wedding } from "@/config/wedding";

const REVEAL: Transition = { duration: 1.6, ease: "easeOut", delay: 0.25 };
const INSTANT: Transition = { duration: 0 };

/** The hero photo's intrinsic aspect ratio (1200×1600) — the box tracks it so
 *  the image fills the full width edge-to-edge without cropping the names/date
 *  baked into it. */
const PHOTO_ASPECT_RATIO = "1200 / 1600";

type HeroProps = { isOpen: boolean; skipAnimation: boolean };

/**
 * The hero photo sits behind the intro video and fades in once the video ends.
 * Spans the full viewport width on every screen; names and date are part of the
 * image.
 */
export default function Hero({ isOpen, skipAnimation }: HeroProps) {
  return (
    <div
      className="relative z-10 flex items-start justify-center"
    >
      <motion.div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: PHOTO_ASPECT_RATIO }}
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 1.03 }}
        transition={skipAnimation ? INSTANT : REVEAL}
      >
        <Image
          src={wedding.heroImage}
          alt={wedding.names}
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="select-none object-cover"
          draggable={false}
        />
       
      </motion.div>
    </div>
  );
}
