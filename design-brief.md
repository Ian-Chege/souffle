# Souffle — Color Theme & Navigation Structure

---

## Color Theme — "Atelier-Warm"

| Token | Value | Role |
|---|---|---|
| `--color-paper` | `oklch(96.5% 0.012 80)` | Page background (warm cream) |
| `--color-paper-2` | `oklch(93% 0.015 80)` | Subtle surface variant |
| `--color-paper-3` | `oklch(89% 0.014 80)` | Image placeholder / muted surface |
| `--color-ink` | `oklch(18% 0.012 60)` | Primary text (deep warm near-black) |
| `--color-ink-2` | `oklch(42% 0.012 60)` | Secondary / muted text |
| `--color-rule` | `oklch(85% 0.012 80)` | Dividers and borders |
| `--color-accent` | `oklch(68% 0.14 55)` | Amber glow (highlights, selections) |
| `--color-accent-deep` | `oklch(52% 0.15 45)` | Deep amber (prices, hover states) |
| `--color-accent-ink` | `oklch(98% 0.005 80)` | Text on accent backgrounds |

**Mood:** warm cream paper, editorial, atelier / antiquarian

---

## Typography

| Role | Font | Notes |
|---|---|---|
| Display / headings | Cormorant Garamond, italic weight 500 | h1–h4, brand name, lede copy |
| Body | Inter Tight, 400/500 | UI text, paragraphs |
| Mono / labels | JetBrains Mono | Nav, kickers, prices, specs — all-caps + wide tracking |

---

## Navigation Structure

```
[brand: souffle · №Nairobi]          [Index]  [Archive]  [Cart · N]
```

- TopBar: 3-column grid — brand wordmark left, spacer center, nav links right
- Nav links: monospace, all-caps, 0.75rem, letter-spacing 0.12em
- Active link: ink color + 1px amber underline (`color-accent`)
- Mobile (<640px): stacks to single column, nav left-aligns

### Routes

| Label | Path | Notes |
|---|---|---|
| Index | `/` | Home / letter macrostructure |
| Archive | `/archive` | Catalogue numbered grid |
| Product | `/archive/[id]` | Specimen / product detail |
| Cart | `/cart` | Ledger / checkout |
| Admin | `/admin`, `/admin/dashboard` | Protected section |

---
