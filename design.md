# Design — Souffle

A locked design system for the Souffle archive. Every page redesign reads this
file before emitting code. Do not regenerate per page — extend or amend this
file when the system needs to grow.

## Genre

editorial — Souffle is a curatorial archive of rare objects, not a SaaS app or
an AI tool. The voice is foundry-adjacent: hand-set numerals, italic display
headlines, generous hairlines, restrained warmth.

## Macrostructure family

- **Marketing pages** (`/`) — **Letter**. A curator's note: eyebrow numeral
  + italic display headline + short prose + a small "newly catalogued"
  specimen row at the foot. No hero illustration, no enrichment.
- **Catalogue pages** (`/archive`) — **Catalogue Numbered**. Each lamp is a
  numbered specimen with generous vertical rhythm; two columns desktop, one
  column mobile. No uniform tile grid.
- **Specimen pages** (`/archive/[id]`) — **Specimen**. Large left-bias image,
  asymmetric right column with italic name, mono catalogue number, dense
  `<dl>` specs ruled with hairlines.
- **Ledger pages** (`/cart`) — **Long Document ledger**. Hairline-ruled rows,
  mono numerals for prices, no card chrome.

## Theme

Warm cream paper, deep warm ink, italic-serif display, two-tone amber glow
accent (lamp-light energy, ≤ 5 % per viewport).

- `--color-paper`      oklch(96.5% 0.012 80)
- `--color-paper-2`    oklch(93%   0.015 80)
- `--color-paper-3`    oklch(89%   0.014 80)
- `--color-ink`        oklch(18%   0.012 60)
- `--color-ink-2`      oklch(42%   0.012 60)
- `--color-rule`       oklch(85%   0.012 80)
- `--color-accent`     oklch(68%   0.14  55)   /* warm amber — lamp glow */
- `--color-accent-deep` oklch(52%  0.15  45)   /* ember — hover/active */
- `--color-accent-ink` oklch(98%   0.005 80)
- `--color-focus`      oklch(64%   0.16  55)

## Typography

- **Display** — Cormorant Garamond, weight 500, **italic only** (every
  display heading runs italic).
- **Body** — Inter Tight, weight 400 / 500.
- **Mono** — JetBrains Mono, weight 400 (catalogue numerals: `№ 014`, specs).
- Display tracking: -0.015em.
- Body measure: 64ch max.
- Type scale anchor: `--text-display` = clamp(3.25rem, 8vw, 6rem).

## Spacing

4-point named scale; values in `tokens.css`. Pages must use named tokens
(`var(--space-md)`), never raw values.

## Motion

Motion-cut project. No scroll reveals. No spatial entry animations.

- Easings: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1).
- Durations: `--dur-short` 180ms.
- Allowed primitives: button ink-shift on hover (180ms), `:focus-visible`
  ring (instant — never animated), image scale on `:hover` of card (220ms,
  transform-only).
- Reduced-motion fallback: drop the card-image scale; everything else is
  already opacity/colour.

## Microinteractions stance

- Silent success — adding to cart routes to `/cart`; no toast.
- Hover delay 0ms on cards (it's a catalogue, browsing should feel weightless).
- `:focus-visible` ring at `--color-focus`, 2px solid, 2px offset, never
  animated.
- Cards are clickable wrappers — entire surface, not just the image.

## CTA voice

- **Primary CTA** — solid ink fill, paper text, 2px radius (almost square),
  18px vertical padding, single arrow glyph (→) after the verb.
  Hover: background shifts to `--color-accent-deep`, text stays paper.
- **Secondary CTA** — underlined inline link, ink-2 colour, no button chrome.
- Copy pattern: verb-first, no period. "Enter the archive →", "Add to cart",
  "Browse the archive →".

## Per-page allowances

- Marketing (`/`) MAY use a 3–4 specimen footer row.
- Catalogue (`/archive`) MUST NOT add enrichment — the specimens are the page.
- Specimen (`/archive/[id]`) — typography + image only; no decorative chrome.
- Ledger (`/cart`) — typography only; no card backgrounds, no shadows.

## What pages MUST share

- The wordmark *Souffle* (italic Cormorant, lowercase) and a mono kicker
  beneath: `№ NAIROBI`.
- The amber accent and its placement: prices, focus rings, ember-on-hover for
  CTAs, the underline beneath the active nav link. Nothing else.
- Display = italic Cormorant. Body = Inter Tight. Mono = JetBrains Mono.
- Hairline ruling at `--color-rule`, always 1px.
- The catalogue-numeral idiom: every lamp has a `№ NNN` mono number.

## What pages MAY differ on

- Macrostructure within the family declared above.
- Image aspect ratio (catalogue uses 4/5; specimen uses 4/5 large; cart uses
  1/1 thumb).
- Section heading style within the editorial canon.

## Exports

### tokens.css

The portable copy lives at `tokens.css` at the project root.
</content>
</invoke>