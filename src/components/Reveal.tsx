"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared scroll-reveal vocabulary for the page: fade in while rising a little,
 * once, as the element scrolls into view. Reduced-motion drops the rise and
 * fades only (framer-motion's JS motion isn't caught by the global CSS
 * prefers-reduced-motion rule, so it's handled here in JS).
 *
 * `Reveal` wraps a whole block. For sequenced children, spread `staggerContainer`
 * on a motion parent and `itemRise` (or `itemFade` under reduced-motion) on each
 * motion child.
 */

const RISE_PX = 24;
const DURATION = 0.6;
const EASE = "easeOut";

type RevealProps = { children: ReactNode; className?: string; delay?: number };

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : RISE_PX }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const itemRise: Variants = {
  hidden: { opacity: 0, y: RISE_PX },
  show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};

export const itemFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};
