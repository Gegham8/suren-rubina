"use client";

import Image from "next/image";
import { motion, type Transition } from "framer-motion";

import { wedding } from "@/config/wedding";

const REVEAL: Transition = { duration: 1.6, ease: "easeOut", delay: 0.25 };
const INSTANT: Transition = { duration: 0 };

/** Static photo size — adjust these two values to taste. */
const PHOTO_WIDTH = "33rem";
const PHOTO_HEIGHT = "50rem";

type HeroProps = { isOpen: boolean; skipAnimation: boolean };

/**
 * The hero photo sits behind the intro video and fades in once the video ends.
 * Anchored to the top of the viewport with a fixed size; names and date centred
 * over it.
 */
export default function Hero({ isOpen, skipAnimation }: HeroProps) {
  return (
    <div
      className="relative z-10 flex items-start justify-center"
    >
      <motion.div
        className="relative overflow-hidden"
        style={{ width: PHOTO_WIDTH, height: PHOTO_HEIGHT }}
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
          sizes="(max-width: 560px), 512px"
          className="select-none object-cover"
          draggable={false}
        />
       
      </motion.div>
    </div>
  );
}
