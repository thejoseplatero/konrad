# Design notes — Konrad, Senior Consultant

The contract for every edit to this page. Measured, not remembered. If a change
contradicts this file, the file wins or the file gets updated first.

Built by the `target-employer` skill, 2026-08-17.
Posting: https://www.konrad.com/careers/job/senior-consultant_7848814003

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

**Constraint that follows from all of this:** a loud page reads as off-brand here.
No accent colors, no gradients, no bold weights. Confidence is carried by space
and restraint. Resist every instinct to add emphasis.

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
