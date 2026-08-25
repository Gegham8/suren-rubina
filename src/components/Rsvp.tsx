"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

import dividerBand from "../../public/images/divider-band.webp";

const FOREST = "#C47A5A";
const WHITE = "#ffffff";
const SERIF = '"Cormorant Garamond", serif';

const MAX_PARTY = 5;
const PARTY_SIZES = Array.from({ length: MAX_PARTY }, (_, i) => i + 1);

const ATTENDING = [
  { value: "yes", label: "Yes, with pleasure" },
  { value: "no", label: "Regretfully, I will not be able to attend" },
] as const;

type Attending = (typeof ATTENDING)[number]["value"];
type Status = "idle" | "sending" | "sent" | "error";

/**
 * RSVP: green card with torn-paper edges and the form. The responder is
 * attendee #1; picking "Yes" reveals a party-size select (max 3) and a name
 * input for each additional guest. Submissions POST to /api/rsvp, which
 * forwards to the Google Sheet webhook (see docs/google-sheet-setup.md).
 */
export default function Rsvp() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending | "">("");
  const [partySize, setPartySize] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const resizeParty = (size: number): void => {
    setPartySize(size);
    setGuestNames((prev) => {
      const next = prev.slice(0, size - 1);
      while (next.length < size - 1) next.push("");
      return next;
    });
  };

  const setGuestName = (index: number, value: string): void => {
    setGuestNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name.trim() || !attending || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          count: attending === "yes" ? partySize : 0,
          guests: attending === "yes" ? guestNames.map((n) => n.trim()).filter(Boolean) : [],
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const underline = {
    WebkitAppearance: "none",
    appearance: "none",
    border: "none",
    borderBottom: `1px solid ${WHITE}`,
    borderRadius: 0,
    background: "transparent",
    fontSize: "1.2rem",
    color: WHITE,
  } as const;

  return (
    <section className="w-full pt-6" style={{ fontFamily: SERIF }}>
      <div className="mx-auto overflow-x-hidden pb-16" style={{ maxWidth: "28rem" }}>
        <div
          className="relative mt-12 w-[112%] -ml-[6%] rounded-3xl px-[11%] text-center sm:ml-0 sm:w-full sm:px-6"
          style={{ background: FOREST, color: WHITE, paddingTop: "21%", paddingBottom: "19%" }}
        >
          {/* torn-paper edge bridging the page background into the card */}
          <Image
            src={dividerBand}
            alt=""
            sizes="110vw"
            className="pointer-events-none absolute h-auto max-w-none select-none"
            style={{ left: "-5%", top: "-2.75rem", width: "110%" }}
            draggable={false}
          />
          {/* mirrored torn edge closing the card at the bottom */}
          <Image
            src={dividerBand}
            alt=""
            sizes="110vw"
            className="pointer-events-none absolute h-auto max-w-none select-none"
            style={{ left: "-5%", bottom: "-3.75rem", width: "110%" }}
            draggable={false}
          />

          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2.9rem, 12vw, 3.8rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              lineHeight: 1,
              transform: "translateX(-0.4em)",
            }}
          >
            RSVP
          </p>
          <p
            style={{
              fontFamily: "var(--font-script), cursive",
              fontSize: "clamp(2.1rem, 9vw, 2.8rem)",
              marginTop: "-0.55em",
              transform: "translateX(0.9em)",
            }}
          >
            invited
          </p>

          <p
            className="mx-auto mt-9"
            style={{
              maxWidth: "21rem",
              fontSize: "clamp(1.1rem, 4.4vw, 1.35rem)",
              lineHeight: 1.6,
            }}
          >
            You are kindly invited to confirm your attendance for our wedding
            celebration. Please take a moment to complete the form below to
            help us plan our special day.
          </p>

          <p className="mt-7" style={{ fontSize: "clamp(1.1rem, 4.4vw, 1.35rem)" }}>
            Kindly respond by <strong>October 10, 2026</strong>
          </p>

          {status === "sent" ? (
            <p className="mt-14 pb-4" style={{ fontSize: "1.4rem", fontWeight: 500 }}>
              Thank you! Your response has been received.
            </p>
          ) : (
            <form
              onSubmit={submit}
              suppressHydrationWarning
              className="mx-auto mt-14 text-left"
              style={{ maxWidth: "21rem" }}
            >
              <label className="block" style={{ fontSize: "1.3rem" }}>
                Your Name
                <input
                  suppressHydrationWarning
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-8 block w-full px-0 pb-2 outline-none"
                  style={underline}
                />
              </label>

              <fieldset className="mt-10 border-0 p-0">
                <legend style={{ fontSize: "1.3rem" }}>Will you be attending?</legend>
                <div className="mt-4 space-y-3">
                  {ATTENDING.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-start gap-3"
                      style={{ fontSize: "1.2rem", lineHeight: 1.3 }}
                    >
                      <input
                        suppressHydrationWarning
                        type="radio"
                        name="attending"
                        value={option.value}
                        checked={attending === option.value}
                        onChange={() => setAttending(option.value)}
                        required
                        className="mt-0.5 h-5 w-5 shrink-0"
                        style={{ accentColor: WHITE }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {attending === "yes" && (
                <>
                  <label className="mt-10 block" style={{ fontSize: "1.3rem" }}>
                    Number of people attending (including you)
                    <select
                      suppressHydrationWarning
                      value={partySize}
                      onChange={(e) => resizeParty(Number(e.target.value))}
                      className="mt-8 block w-full px-0 pb-2 outline-none"
                      style={{ ...underline, WebkitAppearance: "menulist", appearance: "menulist" }}
                    >
                      {PARTY_SIZES.map((n) => (
                        <option key={n} value={n} style={{ color: FOREST }}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>

                  {guestNames.map((guest, i) => (
                    <label key={i} className="mt-8 block" style={{ fontSize: "1.3rem" }}>
                      {`Guest ${i + 2} name`}
                      <input
                        suppressHydrationWarning
                        type="text"
                        value={guest}
                        onChange={(e) => setGuestName(i, e.target.value)}
                        className="mt-6 block w-full px-0 pb-2 outline-none"
                        style={underline}
                      />
                    </label>
                  ))}
                </>
              )}

              {status === "error" && (
                <p className="mt-8" style={{ fontSize: "1.1rem" }} role="alert">
                  Something went wrong sending your RSVP. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-12 block w-full cursor-pointer uppercase disabled:cursor-default disabled:opacity-70"
                style={{
                  WebkitAppearance: "none",
                  appearance: "none",
                  height: "3.6rem",
                  borderRadius: "1.5rem",
                  border: "none",
                  letterSpacing: "0.12em",
                  fontSize: "1.25rem",
                  fontFamily: SERIF,
                  color: FOREST,
                  background: WHITE,
                }}
              >
                {status === "sending" ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
