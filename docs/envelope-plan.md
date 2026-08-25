# Envelope Cover — Build Plan (from the saved reference)

**Goal:** rebuild the first page (the closed envelope with the wax seal) in our Next.js app so it matches the reference exactly, using the reference's own images *for the prototype only* (they get replaced with our artwork before anything ships).

**Source of truth:** `prototype/Wedding invitation Gor & Yana.html` + `_files/` — the saved copy of the reference. All numbers below were extracted from its markup, not estimated from screenshots.

---

## 1. What the saved copy contains (asset inventory)

| File in `prototype/..._files/` | What it is | Size |
|---|---|---|
| `photo.png.webp` | **Back paper sheet** (envelope layer 2) | 1512 × 2733 |
| `photo(1).png.webp` | **Front envelope with folded flap** (layer 1) | 1136 × 2654 |
| `2024-09-12_152315_1.png.webp` | **Wax seal**, transparent background | 350 × 350 |
| `5368626554008704562.jpg` | Hero photo of the couple (next page, not the cover) | 720 × 1280 |
| `GOR__YANA.svg`, `August_7_2026.svg` | Names / date as SVG artwork (hero section) | — |
| `Vector*.svg`, `Group_*.svg` | Decorative line art (later sections) | — |
| `tilda-*.css/js` | Tilda runtime — **we don't use any of it**, reference only | — |

The cover needs exactly **three images**: front, back, seal.

## 2. How the reference cover actually works

The page is a Tilda "zero block": an artboard with absolutely-positioned elements, defined at 5 design widths (320 / 480 / 640 / 960 / 1200) and **scaled proportionally to the window width** between them. Guests open this on phones, so the **320-wide mobile layout is the design frame that matters**.

Two important discoveries from the markup (this is where my earlier version was wrong):

1. **The envelope is NOT one image split in half.** It's two whole layers. On tap, the **front envelope slides LEFT off-screen** (−458 px over 1000 ms) **carrying the wax seal with it** (−834 px), while the **back sheet slides RIGHT** (+482 px). The hint text just fades out. That's the "apart left/right" motion.
2. **The seal click also starts background music** (`playbgmusic`) — optional for us, noted for later.

### Exact geometry — mobile design frame (320 px wide)

All values in px of the 320-frame; to render at any viewport: `scale = viewportWidth / 320`, multiply everything.

| Element | left | top | width | height | Notes |
|---|---|---|---|---|---|
| Back sheet | −83 | −46 | 512 | 925 | bleeds off BOTH sides |
| Front envelope | −100 | −57 | 408 | 953 | bleeds off both sides, fills screen height |
| Wax seal | 146 | 295 | 180 | 180 | tap target, z-top |
| Hint text | 40 | 333 | 232 | 81 | rotated −54°, green `#1e4216`, fades on open |

Key insight: on a phone the envelope is **full-bleed** — no side margins, the paper layers get cropped by the screen edges. My previous centered-column layout was wrong; this is why positions never looked right.

### Open animation timeline (measured)

| t | What happens |
|---|---|
| 0 → 1000 ms | front + seal slide left off-screen; back sheet slides right off-screen; hint fades |
| after | cover is gone; page content (hero) is revealed; `#showmore` added to URL so a refresh skips the cover |

## 3. Build steps

**Step 1 — assets.** Copy the three cover images into `public/images/` with clean names: `envelope-front.webp`, `envelope-back.webp`, `seal.webp`. Point `wedding.ts` config at these local files (no more hotlinking the reference CDN). *These are placeholders — swapping in our own artwork later is a config change only.*

**Step 2 — rewrite `Envelope.tsx` around the 320-frame model.** One "stage" div = the design frame: width `100vw` on mobile, capped at the site's phone-column width (~430 px) and centered on desktop, exactly like the rest of the site. Every element positioned with the px values above ÷ 320, as percentages. No more guessed constants — numbers come from the table.

**Step 3 — animation.** Framer Motion, matching the measured motion: front + seal → x −112% of frame, back → x +150%, 1.0 s, ease-in-out; hint opacity → 0; then the cover unmounts with a short fade and `#showmore` is set (skip-on-refresh logic we already have stays).

**Step 4 — hint text styling.** Reference font is *Aida* (licensed) — we keep **Cormorant Garamond italic** as the open-source stand-in. Size in the 320-frame ≈ 19 px (scales with the frame), rotation −54°, color `#1e4216`.

**Step 5 — verify.** Open our page and the saved reference file side by side at the same window width and compare: seal position, fold alignment, text placement, open motion. No live site needed — the saved copy renders offline.

## 4. Explicitly out of scope for now

- Replacing the placeholder images with our own envelope/seal artwork (must happen before sharing with guests — the current images are the reference studio's work)
- Background music on seal tap
- All sections after the cover (hero, invitation text, gallery, schedule, RSVP, countdown) — each gets the same treatment later: extract geometry from the saved copy, rebuild with our components

## 5. Definition of done (cover page)

- [ ] Three images copied to `public/images/`, config points at them
- [ ] Envelope renders full-bleed on a phone viewport, identical to the reference
- [ ] Tap: front+seal exit left, back exits right, 1 s, hint fades
- [ ] `#showmore` skip works; page scroll locked while cover is up
- [ ] Side-by-side check against the saved reference at 390 px and desktop widths
