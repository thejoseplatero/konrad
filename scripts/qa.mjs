// Zero-dependency QA gate for the Konrad application page.
// Every check here exists because a rule in design-notes.md is load-bearing.
// Run: node scripts/qa.mjs        (local)
//      node scripts/qa.mjs --live (also checks both deploy targets)
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const notes = readFileSync(join(root, 'design-notes.md'), 'utf8');

let pass = 0;
const fails = [];
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; } else { fails.push(`${name}${detail ? ` :: ${detail}` : ''}`); }
};

// Visible copy only: strip style, script, tags, comments.
const visible = html
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ');

const css = (html.match(/<style[\s\S]*?<\/style>/i) || [''])[0];

/* ---------- 1. noindex (critical) ---------- */
ok('noindex meta present', /<meta\s+name="robots"\s+content="noindex, nofollow, noarchive">/.test(html));
ok('no OG tags', !/property="og:/i.test(html));
ok('no robots.txt Disallow file (it would block the noindex being read)',
  !existsSync(join(root, 'robots.txt')));

/* ---------- 2. document integrity ---------- */
ok('doctype first', html.trimStart().startsWith('<!doctype html>'));
ok('lang set', /<html lang="en">/.test(html));
ok('title present and not the template default', /<title>[^<]{10,}<\/title>/.test(html));
for (const tag of ['html', 'head', 'body', 'header', 'footer', 'section', 'style', 'nav']) {
  const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
  const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  ok(`<${tag}> balanced`, open === close, `${open} open / ${close} close`);
}
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
ok('ids unique', new Set(ids).size === ids.length, ids.join(','));
ok('no unreplaced content tokens', !/<!--(content|inline):/.test(html));
// Caught in review once: build.mjs wrapped every block in <p>, producing
// <h1><p>...</p></h1>, which silently rendered the hero headline at body size.
// Scope each check to the element's own contents, not to whatever follows it.
// The (?=[\s>]) boundary matters: without it, <p...> also matches <path> in the
// inline SVG mark and the check reports nonsense.
const innerOf = (tag) =>
  [...html.matchAll(new RegExp(`<${tag}(?=[\\s>])[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => m[1]);
const headingInners = ['h1', 'h2', 'h3'].flatMap(innerOf);
ok('no block tag nested inside a heading',
  headingInners.every((s) => !/<(p|div|ul|blockquote)[\s>]/.test(s)),
  headingInners.find((s) => /<(p|div|ul|blockquote)[\s>]/.test(s))?.slice(0, 60) || '');
ok('no <p> nested inside a <p>',
  innerOf('p').every((s) => !/<p(?=[\s>])/.test(s)),
  innerOf('p').find((s) => /<p(?=[\s>])/.test(s))?.slice(0, 60) || '');
ok('hero headline carries real text, not an empty shell',
  /<h1>[^<]{20,}<\/h1>/.test(html));

/* ---------- 3. CSS integrity ---------- */
ok('css braces balanced',
  (css.match(/{/g) || []).length === (css.match(/}/g) || []).length);
ok('no orphaned top-level declaration',
  !/}\s*[a-z-]+\s*:\s*[^;{]+;/i.test(css.replace(/<\/?style[^>]*>/g, '')));

/* ---------- 4. brand fidelity, measured from the live site ---------- */
ok('Inter variable face declared', /InterVariable\s*,\s*Inter/.test(css));
ok('near-black ink #090a0a, not pure black', /#090a0a/i.test(css));
ok('no accent colour introduced',
  !/#(?!090a0a\b|fff\b|ffffff\b)[0-9a-f]{3,6}\b/i.test(css),
  (css.match(/#(?!090a0a\b|fff\b|ffffff\b)[0-9a-f]{3,6}\b/gi) || []).join(','));
ok('full-pill buttons (100px radius)', /border-radius:\s*100px/.test(css));
ok('headings never reach bold',
  !/font-weight:\s*(700|800|900|bold)\b/i.test(css),
  (css.match(/font-weight:\s*(700|800|900|bold)\b/gi) || []).join(','));
ok('negative letter-spacing on h1', /h1\{[^}]*letter-spacing:\s*-/.test(css));
ok('negative letter-spacing on h2', /h2\{[^}]*letter-spacing:\s*-/.test(css));
ok('numbered section index present (their pattern)',
  ['01', '02', '03', '04', '05', '06'].every((n) => new RegExp(`class="num">${n}<`).test(html)));

/* ---------- 5. honesty framework, load-bearing ---------- */
ok('Direct fit bucket present', /Direct fit/.test(visible));
ok('Adjacent bucket present', /Adjacent, not identical/.test(visible));
ok('Flagged bucket present', /Flagged/.test(visible));
const flagged = (html.split('Flagged')[1] || '').split('</div>')[0];
ok('Flagged bucket is not empty', flagged.replace(/<[^>]+>/g, '').trim().length > 120);
ok('at least two flagged entries', (flagged.match(/<strong>/g) || []).length >= 2);
ok('disclaimer present', /Not affiliated with, endorsed by, or authorized by Konrad/.test(visible));

/* ---------- 6. copy rules ---------- */
ok('no em dashes', !visible.includes('\u2014'), visible.match(/.{0,30}\u2014.{0,30}/)?.[0] || '');
ok('no en dashes in prose', !visible.includes('\u2013'));
ok('no emoji', !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(visible));
for (const w of ['surface', 'surfaces', 'leverage', 'leveraging', 'seamless', 'robust', 'utilize']) {
  ok(`banned word "${w}" absent from visible copy`,
    !new RegExp(`\\b${w}\\b`, 'i').test(visible.replace(/"[^"]*"/g, '')));
}
ok('the word "gap" never appears in visible copy',
  !/\bgaps?\b/i.test(visible), visible.match(/.{0,40}\bgaps?\b.{0,40}/i)?.[0] || '');
ok('no years-of-experience bragging',
  !/\b\d{2}\+?\s*(years|yrs)\b/i.test(visible), visible.match(/.{0,30}\d{2}\+?\s*(years|yrs).{0,30}/i)?.[0] || '');
ok('no "not X but Y" construction', !/\bnot\s+\w+[^.]{0,40},\s*but\b/i.test(visible));

/* ---------- 7. disclosure rules ---------- */
// This page goes to an external consultancy. Air Canada's consulting partners
// appear on the private CV and must never reach it.
for (const name of ['Thoughtworks', 'BCG', 'Boston Consulting']) {
  ok(`"${name}" never named on a page sent to an external consultancy`,
    !new RegExp(name, 'i').test(visible));
}

/* ---------- 8. quotes are real and attributed ---------- */
ok('Beliz Kasirga quote attributed', /Beliz Kasirga/.test(visible) && /AI Product Summit, BrainStation/.test(visible));
ok('Hugo Cardoso quote attributed', /Hugo Cardoso/.test(visible) && /Business Systems Analyst/.test(visible));
ok('two letters exactly', (html.match(/class="letter"/g) || []).length === 2);

/* ---------- 9. a11y and responsive ---------- */
const targetBlank = [...html.matchAll(/<a[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
ok('every target=_blank carries rel=noopener', targetBlank.every((a) => /rel="noopener"/.test(a)),
  targetBlank.filter((a) => !/rel="noopener"/.test(a)).join(' '));
ok('reduced-motion honoured', /prefers-reduced-motion:\s*reduce/.test(css));
ok('svg mark has accessible label', /role="img"\s+aria-label="[^"]+"/.test(html));
ok('viewport meta present', /name="viewport"/.test(html));
ok('mobile breakpoint present', /@media\s*\(max-width:\s*560px\)/.test(css));
ok('tablet breakpoint present', /@media\s*\(max-width:\s*860px\)/.test(css));
ok('horizontal overflow guarded', /overflow-x:\s*hidden/.test(css));

/* ---------- 10. mark is custom to this company ---------- */
// The Thomson Reuters build once shipped with the Affirm arc pasted in unchanged.
ok('mark uses Konrad wedge geometry, not a reused arc',
  /d="M24 0V6\.32/.test(html) && !/[Aa]\s?\d+[\d.,\s]+0\s+[01]\s+[01]/.test(html.match(/<svg[\s\S]*?<\/svg>/)?.[0] || ''));
ok('design-notes records the shape language', /45. diagonal band plus triangular wedges/i.test(notes));

/* ---------- 11. live mode ---------- */
const targets = [
  'https://joseplatero.com/konrad/',
  'https://thejoseplatero.github.io/konrad/',
];
if (process.argv.includes('--live')) {
  for (const url of targets) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const body = await res.text();
      ok(`${url} returns 200`, res.status === 200, `got ${res.status}`);
      ok(`${url} carries noindex`, /noindex, nofollow, noarchive/.test(body));
      ok(`${url} byte-matches local index.html`, body.trim() === html.trim());
    } catch (e) {
      ok(`${url} reachable`, false, e.message);
    }
  }
}

/* ---------- report ---------- */
if (fails.length) {
  console.error(`\nQA FAILED  ${pass} passed, ${fails.length} failed\n`);
  for (const f of fails) console.error(`  x ${f}`);
  process.exit(1);
}
console.log(`QA green: ${pass} checks passed.`);
