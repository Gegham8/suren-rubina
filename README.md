# Suren & Ruby — Wedding Invitation

A single-page wedding invitation, mobile-first, built with **Next.js 16 (App
Router) + TypeScript + Tailwind v4 + Framer Motion**.

Layout and interaction concept follow the reference the client supplied
(`belleame.am/gor_yana`, a Tilda page); the markup, CSS, illustrations and
animations here are written from scratch.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Everything the client can change lives in one file

`src/config/wedding.ts` — names, date, schedule, map links, RSVP copy, photo
paths. No component edits needed.

## Replacing the photos

Drop the real files into `public/images/` keeping these names (or edit the
paths in the config):

| File | Used for | Suggested ratio |
|---|---|---|
| `hero.jpg` | opening photo behind the names | 9:16 portrait |
| `g1.jpg` … `g4.jpg` | collage | 3:4, 1:1, 3:4, 4:5 |
| `countdown.jpg` | photo behind the countdown | 3:4 portrait |

The files currently in the repo are neutral placeholders.

## Sections

1. **Envelope cover** — paper envelope with a wax seal; tapping the seal folds
   the flap open and dissolves into the invitation. `/#showmore` skips it.
2. **Hero** — full-bleed photo, names, date.
3. **Invitation** — greeting and body copy.
4. **Gallery** — staggered, overlapping collage with scroll reveals.
5. **Calendar** — sage band, month grid, heart on the wedding day.
6. **Schedule** — four timed entries with line-art icons and MAP buttons.
7. **RSVP** — name, attendance, guest count → Google Sheet.
8. **Countdown** — live days/hours/minutes/seconds over a photo.
9. **Footer** — closing line and table illustration.

## RSVP

See [`docs/google-sheet-setup.md`](docs/google-sheet-setup.md). One env var,
`RSVP_WEBHOOK_URL`. Without it the form still succeeds and logs server-side.

## The wax seal

`public/images/seal.png` — a square PNG with a transparent background (~600×600).
The file currently in the repo is a generated stand-in; drop the real seal
artwork in under the same name and nothing else needs to change. The path is
`envelope.sealImage` in the config if you'd rather point somewhere else.

## Fonts

Five roles, all self-hosted via Fontsource (no Google Fonts request at runtime),
declared once in `src/app/globals.css` under `@theme`:

| Variable | Face | Used for |
|---|---|---|
| `--font-hero` | **Italiana** | the couple's names |
| `--font-display` | **Cinzel** | SCHEDULE, RSVP, COUNTDOWN, AUGUST 2026, footer line |
| `--font-serif` | **Cormorant Garamond** | all body copy |
| `--font-script` | **Great Vibes** | the "Tap to open your invitation" line |
| `--font-ui` | **Montserrat** | numerals — times, calendar, countdown |

Swapping any of them is a one-line change: edit the variable in `globals.css`
and the matching `@fontsource/...` import in `src/app/layout.tsx`.

To use licensed faces instead (e.g. the reference's *Aida*): drop the `.woff2`
files into `src/app/fonts/`, declare them with `next/font/local`, and point the
CSS variable at the generated family name.

## Illustrations

`src/components/art/LineArt.tsx` holds the hand-drawn-style SVGs (dove, glasses,
rings, sparkler, chandelier, champagne, table setting). They are stand-ins in the
reference's style — if the client sends their own artwork, replace the component
bodies with the supplied SVG paths.

## Deploy

Vercel: import the repo, add `RSVP_WEBHOOK_URL`, done. Any Node host works too
(`npm run build && npm start`).
