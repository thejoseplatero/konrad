# Design notes — Konrad, Senior Consultant

The contract for every edit to this page. Measured, not remembered. If a change
contradicts this file, the file wins or the file gets updated first.

Built by the `target-employer` skill, 2026-08-17.
Posting: https://www.konrad.com/careers/job/senior-consultant_7848814003

## Scan history

**Pass 1 (job page only) was wrong and produced a text-only page.** The posting at
`/careers/job/...` is the plainest page Konrad owns: 48px H1, flat columns, no
imagery, no motion. Building from it alone shipped something technically on-brand
and visibly dead.

**Pass 2 (2026-08-17) walked konrad.com, /work, and a case study.** Findings below
supersede pass 1 wherever they conflict. The job-page numbers are kept only as a
record of what a stripped template page looks like.

## Measured brand tokens

Captured in-browser from the live job page via computed styles.

| Token | Value |
|---|---|
| Type | `InterVariable, Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| Weights | 400 nav, **450 headings**, 550 buttons. Never 700. |
| Ink | `#090a0a` (near-black, not pure black) |
| Ground | `#ffffff` |
| H1 | 48px / 450, letter-spacing `-1.44px` (-0.03em) |
| H2 | 22px / 450, letter-spacing `-0.44px` (-0.02em) |
| Buttons | radius `100px` full pill, padding `16px 24px`, 14px / 550, ls `-0.28px` |
| Primary CTA | white ground, `#090a0a` ink |
| Nav | transparent over hero, white ink, 14px / 400 |
| Section bands | roughly even split of white and `#090a0a` |

**Signature moves:** negative letter-spacing at every size. Variable-weight type
that never reaches bold. Full-pill buttons against otherwise square layout.
Numbered section index (01 through 06) down the job page. Restrained near-black
and white with no accent color anywhere.

**Voice formula:** plain declarative sentences. No exclamation, no hype adjectives.
"We help the world's top businesses and brands succeed in the AI era." Short
sentence, concrete claim, full stop.

**Constraint that follows from all of this:** no accent colors, no gradients, no
bold weights. Confidence is carried by space and restraint.

Restraint in *color and weight* is not the same as restraint in *motion and media*.
Pass 2 found the opposite there. See below.

## Pass 2: the real site (konrad.com, /work, /work/spotify)

The homepage is **10,515px tall**. The work index H1 is **140px**. The job page's
48px hero is a stripped template, not the brand.

### Motion system, measured

| Token | Value |
|---|---|
| Signature easing | `cubic-bezier(0.22, 1, 0.36, 1)` — 100 declarations, easily dominant |
| Secondary easing | `cubic-bezier(0.16, 1, 0.3, 1)` — 32 declarations |
| Hover duration | `0.12s` — 55 declarations, the single most common |
| Reveal durations | `0.28s`, `0.3s`, `0.4s`, `0.45s`, `0.5s` |
| Card media hover | `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.28s` |
| Logo marquee | `@keyframes logo-marquee` → `translateX(calc(-100% / var(--logo-copies)))`, `60s linear infinite` |
| Scroll reveals | `translateY` offsets (43px, 61px, 64px, 101px observed mid-scroll) |

**One curve carries the whole site.** Use `cubic-bezier(0.22, 1, 0.36, 1)` for
everything, 0.12s on hover, 0.3s to 0.5s on reveal. Mixing curves is off-brand.

### Media, measured

- **Hero:** `homepage-hero.webm`, autoplay + loop + muted, full bleed 1440×810
- **Case cards:** 437×546, ratio **0.80 (4:5 portrait)**, `object-fit: cover`,
  **0px radius**
- **Idle-to-hover video swap per card:** `soulcycle-equinox-idle-mobile.webm`,
  `spotify-hover.webm`, `hp-hover-mobile.webm`, `kia-hover-mobile.webm`
- **99 images** on the homepage, including a photo strip at 201×235 `cover`
- Large media wells run ratio 0.62 (446×721), `overflow: hidden` on the well

**The system's core tension: every image and video is 0px radius, every button is a
100px pill.** Sharp media, round controls. Flattening either loses the brand.

### Type scale, real ceiling

| Use | Value |
|---|---|
| Section landing H1 | `140px / 450 / -4.2px` ("Our Work") |
| Display | `86.4px / 400 / -2.592px` ("Innovation with Intelligence™") |
| Large heading | `64px / 450 / -1.92px` ("Have a Project for Us?") |
| Body-lead | `52px / 450 / -1.56px` |
| Section heading | `28px / 450 / -0.56px` |
| Body | `18px / 400` and `16px / 400` |
| Eyebrow label | `12px / 550 / uppercase` ("VIEW CASE", "CAPABILITIES") |
| Meta label | `12px / 400 / ls 0.5px` ("TORONTO", "NEW YORK") |

Letter-spacing is consistently about `-0.03em` at display sizes.

### Signature components worth borrowing

- **Live world clocks in the nav:** "NYC 12:26 PM · TOR 12:26 PM · LDN 5:26 PM"
- **Numbered eyebrows:** `(01) — CULTURE`, `(02) — CRAFT`, and a `01 / 05` counter
- **Uppercase section kickers:** WHO WE ARE, HIGHLIGHTED CASE STUDIES, OUR CLIENTS
- **Infinite client-logo marquee**
- Tagline lockup: "Innovation with Intelligence™"

### What this means for the page

The current build has zero motion, zero images, zero video, and a 48px hero. That
is not a restrained interpretation of this brand, it is a different brand. The
rebuild needs, at minimum: the signature curve on every interactive element, a
scroll-reveal pattern, real media in fixed 4:5 sharp-cornered wells, a marquee or
ticker, and a display heading in the 86px to 140px range.

All motion added must be wrapped in `prefers-reduced-motion: reduce`, and any
video needs a poster frame.

## Phase 0.5 — the candidate's mark

Konrad's logo, read from the live SVG (`viewBox="0 0 149 24"`, icon in the first
24 units):

- `M0 0V6.32L8.84 15.16L17.68 24H24L12 12L0 0Z` — a thick 45° diagonal band
  running top-left to bottom-right, roughly 6.3/24 units thick
- `M0 24H8.84L4.42 19.58L0 15.16V24Z` — triangular wedge, bottom-left
- `M8.84 0L15.47 6.32L22.10 0H8.84Z` — triangular wedge, top, pointing down

**Shape language: a 45° diagonal band plus triangular wedges, all cut from a
24×24 square. Sharp corners throughout. No curves anywhere.**

Jose's mark uses that exact vocabulary with the diagonal axis mirrored (running
top-right to bottom-left instead), paired with his initial set in the same
variable face. Same system, different geometry, which is the rule: the Thomson
Reuters build once shipped with the Affirm arc pasted in unchanged, and that is
the mistake this phase exists to prevent.

## Phase 1 — concept

Konrad's own job page numbers its sections 01 through 06 and reads as a
structured brief. The page mirrors that structure and answers it section for
section, in their order, in their voice. The organizing idea is their own
document form turned back toward them.

The hook is theirs, quoted from the posting's Bonus Points section:

> "Have you taken any courses at BrainStation? A lot of our design and
> development best practices and processes are taught during our courses."

He does not take courses at BrainStation. He teaches three certifications and
three workshops there, and presented on their stage the day this was built.
Konrad and BrainStation share founding lineage, which is why the question is on
the posting. Section 05 is that answer and it is the spine of the page.

## Phase 2 — honesty framework

Three buckets against real JD lines. Direct fit, Adjacent, Flagged.

Flagged carries two entries, both undefended:

1. **Agency-side selling.** The JD asks for RFP responses. He has bought
   consulting and run vendor relationships from the client side. He has not
   carried a sales target or owned a response as the seller.
2. **The shape of the seat.** The posting asks for 4+ years and a role supporting
   the engagement lead. His recent years have been client-side owning the
   organization. Named plainly, not argued away.

A page with no flagged entries reads as dishonest. These stay.

## Phase 4 — copy rules enforced by qa.mjs

Banned in visible copy: em dashes, emoji, "surface" or "surfaces" as a verb,
"leverage", the word "gap", vague "experiences/products/platforms" as standalone
nouns, "not X but Y" contrast constructions, self-commentary explaining why the
page does something.

No years-of-experience bragging. No hero stat reading "15 years". Outcomes and
multipliers instead.

**Air Canada's external consulting partners (BCG, Thoughtworks) are never named.**
They appear on the private CV. This page goes to an external consultancy and
naming them here would be a disclosure problem. Encoded as a failing QA test.

Two real quotes from `people/mentions.md`, with name, title, and context, never
trimmed into saying something they did not say.

## Phase 5 — engineering

Prose in `content/*.md`. Structure in `template.html` with `<!--content:token-->`
markers. `scripts/build.mjs` stitches `index.html`. Round trip must be byte
identical before any commit.

`<meta name="robots" content="noindex, nofollow, noarchive">`. No robots.txt
Disallow (it would block crawlers from reading the noindex). No OG tags.

`scripts/qa.mjs` is zero-dependency and gates every commit.
