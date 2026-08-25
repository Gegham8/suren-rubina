import Image from "next/image";

import iconChurch from "../../public/images/icon-church.png";
import iconGlasses from "../../public/images/icon-glasses.png";
import iconSparkler from "../../public/images/icon-sparkler.png";

const FOREST = "#C47A5A";
/** Every icon sits in a box this tall, so rows stay equal height and the
 * gaps between them symmetric. Per-item `iconScale` enlarges the drawing
 * inside the box (transform only — it doesn't affect layout/gaps) to offset
 * the differing amounts of blank canvas in each source illustration. */
const ICON_BOX_HEIGHT = "15rem";

/**
 * Timeline of the day. Icons and artwork are the exact files from the saved
 * reference (prototype/). Map links point to the real venues.
 */
const ITEMS = [
  {
    time: "1:30 PM",
    text: ["Wedding Ceremony at", "Saint Peter Armenian Apostolic Church"],
    address: "17231 Sherman Way, Van Nuys, CA 91406",
    icon: iconChurch,
    iconScale: 1,
    map: "https://maps.app.goo.gl/rBvRUJE1qpFcgrDU9",
  },
  {
    time: "6:00 PM",
    text: ["Welcome Drink at", "Alegro Banquet Hall"],
    address: "423 N Brand Blvd, Glendale, CA 91203",
    icon: iconGlasses,
    iconScale: 1.45,
    map: "https://maps.app.goo.gl/chR5jdcq4xHp4vt88",
  },
  {
    time: "6:30 PM",
    text: ["Wedding Reception at", "Alegro Banquet Hall"],
    address: "423 N Brand Blvd, Glendale, CA 91203",
    icon: iconSparkler,
    iconScale: 1.3,
    map: "https://maps.app.goo.gl/chR5jdcq4xHp4vt88",
  },
] as const;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
/** October 2026, Monday-first: the 1st falls on Thursday; 31 days. */
const CALENDAR: (number | null)[] = [
  null, null, null,
  ...Array.from({ length: 31 }, (_, i) => i + 1),
];
const WEDDING_DAY = 10;

export default function Schedule() {
  return (
    <section
      className="mx-auto w-full pb-10 pt-16 text-center"
      style={{ maxWidth: "28rem", color: FOREST }}
    >
      {/* October 2026 calendar — real text, heart on the wedding day */}
      <div
        className="relative mx-4 mb-16 rounded-3xl px-5 py-10 sm:mx-0"
        style={{ background: FOREST, color: "#ffffff", fontFamily: "var(--font-sans), sans-serif" }}
      >
        <p
          className="uppercase"
          style={{ fontSize: "clamp(1.6rem, 6.5vw, 2rem)", letterSpacing: "0.12em" }}
        >
          October&ensp;2026
        </p>
        <div
          className="mx-auto mt-7 grid grid-cols-7 gap-y-4"
          style={{ maxWidth: "20.5rem" }}
        >
          {WEEKDAYS.map((day, i) => (
            <span
              key={day}
              className="uppercase"
              style={{ fontSize: "0.95rem", letterSpacing: "0.06em", fontWeight: i >= 5 ? 600 : 400 }}
            >
              {day}
            </span>
          ))}
          {CALENDAR.map((day, i) =>
            day === null ? (
              <span key={`empty-${i}`} />
            ) : day === WEDDING_DAY ? (
              <span key={day} className="relative flex items-center justify-center">
                <img
                  src="/images/calendar-badge.png"
                  alt=""
                  draggable={false}
                  className="absolute w-12 max-w-none select-none"
                  style={{
                    transformOrigin: "center",
                    animation: "heartbeat 2.8s ease-in-out infinite",
                  }}
                />
                <span className="relative" style={{ color: "#4a4a4a", fontWeight: 400 }}>
                  {day}
                </span>
              </span>
            ) : (
              <span key={day} style={{ fontWeight: i % 7 >= 5 ? 600 : 400 }}>
                {day}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="px-6">
      <h2
        className="uppercase"
        style={{ fontSize: "clamp(2.2rem, 9vw, 3rem)", fontWeight: 500, letterSpacing: "0.12em" }}
      >
        Schedule
      </h2>

      <ol className="mt-10 list-none space-y-16">
        {ITEMS.map((item) => (
          <li key={item.time} className="flex items-center gap-4">
            <div className="relative w-[40%] shrink-0" style={{ height: ICON_BOX_HEIGHT }}>
              <Image
                src={item.icon}
                alt=""
                fill
                sizes="180px"
                className="object-contain select-none"
                style={{ transform: `scale(${item.iconScale})` }}
                draggable={false}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <p
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: "clamp(1.35rem, 5.5vw, 1.7rem)",
                  fontWeight: 600,
                }}
              >
                {item.time}
              </p>
              <p
                className="mt-1"
                style={{ fontSize: "clamp(1.05rem, 4.2vw, 1.3rem)", lineHeight: 1.45, color: "#43483b" }}
              >
                {item.text[0]} {item.text[1]}
              </p>
              <div
                className="mt-4 h-px w-full"
                style={{ background: "currentColor", opacity: 0.5 }}
              />
              <a
                href={item.map}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center rounded-full uppercase"
                style={{
                  height: "3.4rem",
                  background: FOREST,
                  color: "#f6f3ec",
                  letterSpacing: "0.2em",
                  fontSize: "1.15rem",
                }}
              >
                Map
              </a>
            </div>
          </li>
        ))}
      </ol>

      {/* closing flourish — animated wedding cake */}
      <img
        src="/images/wedding-cake1.gif"
        alt=""
        draggable={false}
        className="mx-auto select-none"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
      </div>
    </section>
  );
}
