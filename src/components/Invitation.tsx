"use client";

import { motion, useReducedMotion } from "framer-motion";

import { wedding } from "@/config/wedding";

import { itemFade, itemRise, staggerContainer } from "./Reveal";

const FOREST = "#C47A5A";

/** Invite text shown below the hero photo. Lines stagger in on scroll. */
export default function Invitation() {
  const reduce = useReducedMotion();
  const item = reduce ? itemFade : itemRise;
  return (
    <motion.section
      className="px-6 py-8 text-center"
      style={{ color: FOREST }}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="mx-auto" style={{ maxWidth: "min(90vw, 32rem)" }}>
        <motion.h2
          variants={item}
          style={{ fontSize: "clamp(2rem, 7vw, 2.75rem)", fontWeight: 600, color: FOREST }}
        >
          Dear Guests,
        </motion.h2>
        <motion.p
          variants={item}
          className="mt-8"
          style={{ fontSize: "clamp(1.1rem, 3.6vw, 1.4rem)", lineHeight: 1.6 }}
        >
          With great joy, we invite you to join us in celebrating our wedding.
        </motion.p>
        <motion.p
          variants={item}
          className="mt-8"
          style={{ fontSize: "clamp(1.1rem, 3.6vw, 1.4rem)", lineHeight: 1.6 }}
        >
          We look forward to sharing this special day with you on {wedding.date}.
        </motion.p>
      </div>
    </motion.section>
  );
}
