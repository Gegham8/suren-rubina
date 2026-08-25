"use client";

import { useLayoutEffect, useRef, useState } from "react";

import BackgroundMusic, { type BackgroundMusicHandle } from "@/components/BackgroundMusic";
import Countdown from "@/components/Countdown";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Invitation from "@/components/Invitation";
import { Reveal } from "@/components/Reveal";
import Rsvp from "@/components/Rsvp";
import Schedule from "@/components/Schedule";
import VideoIntro from "@/components/VideoIntro";

const SKIP_HASH = "showmore";
// 48rem === Tailwind's default `md` breakpoint (used for `md:object-contain` in
// VideoIntro). Kept in rem so this JS query and the CSS breakpoint stay identical.
const DESKTOP_QUERY = "(min-width: 48rem)";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  // null until measured client-side; the intro is mobile-only, so desktop skips
  // straight to the page and never mounts (or downloads) the video.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const musicRef = useRef<BackgroundMusicHandle>(null);

  // matchMedia and location.hash are client-only and must resolve *before* the
  // first paint: desktop skips straight to the page, mobile shows the intro, and
  // #showmore skips the animation. A layout effect that sets state is the only
  // way to read these browser APIs pre-paint without a hydration flash, so the
  // set-state-in-effect rule is a false positive here.
  useLayoutEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const skip = desktop || window.location.hash === `#${SKIP_HASH}`;
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsDesktop(desktop);
    setSkipAnimation(skip);
    setIsOpen(skip);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Layout effect (not passive) so lock/unlock resolves before paint — on the
  // #showmore skip-refresh path isOpen flips false→true across two synchronous
  // renders, and a passive effect would briefly lock the already-open page.
  useLayoutEffect(() => {
    const { style } = document.body;
    const lock = (): void => {
      // position:fixed is the only reliable scroll lock on iOS Safari;
      // overflow:hidden alone lets touch drag/rubber-band the intro away.
      // The intro is always at scrollTop 0, so no scroll position to save.
      style.overflow = "hidden";
      style.position = "fixed";
      style.inset = "0";
      style.width = "100%";
    };
    const unlock = (): void => {
      style.overflow = "";
      style.position = "";
      style.inset = "";
      style.width = "";
    };

    if (isOpen) unlock();
    else lock();
    return unlock;
  }, [isOpen]);

  const open = (): void => {
    setIsOpen(true);
    window.history.replaceState(null, "", `#${SKIP_HASH}`);
  };

  return (
    <main>
      <section className="relative overflow-hidden" style={{ height: isOpen ? undefined : "100dvh" }}>
        <Hero isOpen={isOpen} skipAnimation={skipAnimation} />
        {isDesktop === false && (
          <VideoIntro
            isOpen={isOpen}
            skipAnimation={skipAnimation}
            onStart={() => musicRef.current?.play()}
            onEnded={open}
          />
        )}
      </section>
      <Invitation />
      <Gallery />
      <Reveal>
        <Schedule />
      </Reveal>
      <Reveal>
        <Rsvp />
      </Reveal>
      <Reveal>
        <Countdown />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
      <BackgroundMusic ref={musicRef} />
    </main>
  );
}
