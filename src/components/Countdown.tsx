"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import countdownPhoto from "../../public/images/countdown.webp";

/** Wedding moment the countdown runs to. */
const TARGET = new Date("2026-10-10T13:30:00-07:00").getTime();

const LABELS = ["days", "hours", "minutes", "seconds"] as const;

function partsUntil(target: number): [string, string, string, string] {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return [pad(d), pad(h), pad(m), pad(s % 60)];
}

/**
 * Countdown card: divider band, then a framed card with the timer at the top
 * and a photo below (PLACEHOLDER — /public/images/countdown.webp currently
 * holds the hero photo; drop the real one over it).
 */
export default function Countdown() {
  // Render zeros on the server, start ticking after mount (avoids hydration
  // mismatch).
  const [parts, setParts] = useState<[string, string, string, string]>(["00", "00", "00", "00"]);

  useEffect(() => {
    const tick = () => setParts(partsUntil(TARGET));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="w-full">
      <div className="mx-auto" style={{ maxWidth: "30rem" }}>
        {/* photo fills the whole card; countdown overlaid on top of it */}
        <div className="relative mx-4 overflow-hidden rounded-3xl sm:mx-0">
          <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
            <Image
              src={countdownPhoto}
              alt=""
              fill
              placeholder="blur"
              sizes="(max-width: 640px) 100vw, 448px"
              className="select-none object-cover"
              draggable={false}
            />
          </div>
          {/* soft dark veil so the white text stays readable on any photo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 px-5 pt-9 text-center text-white">
            <h2
              className="uppercase"
              style={{
                fontSize: "clamp(1.6rem, 6.5vw, 2rem)",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textShadow: "0 1px 14px rgba(0,0,0,0.45)",
              }}
            >
              Countdown...
            </h2>

            <div
              className="mt-4 flex items-baseline justify-center whitespace-nowrap"
              style={{
                fontSize: "clamp(2rem, 8.5vw, 2.6rem)",
                fontWeight: 500,
                textShadow: "0 1px 14px rgba(0,0,0,0.45)",
              }}
            >
              {parts.map((value, i) => (
                <span key={LABELS[i]} className="flex items-baseline">
                  <span className="inline-block text-center" style={{ minWidth: "2ch" }}>
                    {value}
                  </span>
                  {i < 3 && <span className="mx-2 opacity-70">:</span>}
                </span>
              ))}
            </div>

            <div
              className="mx-auto mt-1 grid grid-cols-4"
              style={{
                maxWidth: "21rem",
                fontSize: "0.95rem",
                letterSpacing: "0.05em",
                textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              }}
            >
              {LABELS.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
