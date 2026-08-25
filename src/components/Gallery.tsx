/**
 * Staggered photo collage — photos at the reference's exact cell size
 * (283 × 346 px) with its pixel offsets (−77 / 72 / −55), alternating
 * left/right with vertical overlap.
 */

import Image from "next/image";

import gallery1 from "../../public/images/gallery-1.webp";
import gallery2 from "../../public/images/gallery-2.webp";
import gallery3 from "../../public/images/gallery-3.webp";
import gallery4 from "../../public/images/gallery-4.webp";

const PHOTOS = [
  // left slots hide a slice of the photo's LEFT edge → photos with the
  // couple right-of-center (g2, g1); right slots get the centered ones.
  { src: gallery1, left: -30, top: 0, pos: "50% 78%", z: 4 },   // lean on car — on top of the b&w
  { src: gallery4, left: 86, top: 340, pos: "50% 62%", z: 3 },  // b&w — under 1st, above 3rd
  { src: gallery2, left: -66, top: 680, pos: "50% 78%", z: 2 }, // hug/spin — above the night rock
  { src: gallery3, left: 108, top: 1020, pos: "50% 40%", z: 1 }, // night rock — underneath
] as const;

const PHOTO_W = 340;
const PHOTO_H = 415;
const FRAME_H = 1020 + PHOTO_H; // last photo's top + its height

export default function Gallery() {
  return (
    <section className="mx-auto w-full" style={{ maxWidth: "28rem" }}>
      <div
        className="relative mx-4 overflow-hidden sm:mx-0"
        style={{ height: FRAME_H }}
      >
        {PHOTOS.map((p, i) => (
          <div
            key={i}
            className="absolute overflow-hidden shadow-[0_18px_45px_-18px_rgba(60,58,50,0.45)]"
            style={{ left: p.left, top: p.top, width: PHOTO_W, height: PHOTO_H, zIndex: p.z }}
          >
            <Image
              src={p.src}
              alt=""
              fill
              placeholder="blur"
              sizes="340px"
              className="select-none object-cover"
              style={{ objectPosition: p.pos }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
