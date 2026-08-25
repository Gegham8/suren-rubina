import { wedding } from "@/config/wedding";

const FOREST = "#C47A5A";

/** Invite text shown below the hero photo. */
export default function Invitation() {
  return (
    <section className="px-6 py-8 text-center" style={{ color: FOREST }}>
      <div className="mx-auto" style={{ maxWidth: "min(90vw, 32rem)" }}>
        <h2 style={{ fontSize: "clamp(2rem, 7vw, 2.75rem)", fontWeight: 600, color: FOREST }}>
          Dear Guests,
        </h2>
        <p
          className="mt-8"
          style={{ fontSize: "clamp(1.1rem, 3.6vw, 1.4rem)", lineHeight: 1.6 }}
        >
          With great joy, we invite you to join us in celebrating our wedding.
        </p>
        <p
          className="mt-8"
          style={{ fontSize: "clamp(1.1rem, 3.6vw, 1.4rem)", lineHeight: 1.6 }}
        >
          We look forward to sharing this special day with you on {wedding.date}.
        </p>
      </div>
    </section>
  );
}
