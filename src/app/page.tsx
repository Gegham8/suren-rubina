"use client";

import { useLayoutEffect, useRef, useState } from "react";

import BackgroundMusic, { type BackgroundMusicHandle } from "@/components/BackgroundMusic";
import Countdown from "@/components/Countdown";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Invitation from "@/components/Invitation";
import Rsvp from "@/components/Rsvp";
import Schedule from "@/components/Schedule";
import VideoIntro from "@/components/VideoIntro";

const SKIP_HASH = "showmore";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const musicRef = useRef<BackgroundMusicHandle>(null);

  useLayoutEffect(() => {
    if (window.location.hash === `#${SKIP_HASH}`) {
      setSkipAnimation(true);
      setIsOpen(true);
    }
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
        <VideoIntro
          isOpen={isOpen}
          skipAnimation={skipAnimation}
          onStart={() => musicRef.current?.play()}
          onEnded={open}
        />
      </section>
      <Invitation />
      <Gallery />
      <Schedule />
      <Rsvp />
      <Countdown />
      <Footer />
      <BackgroundMusic ref={musicRef} />
    </main>
  );
}
