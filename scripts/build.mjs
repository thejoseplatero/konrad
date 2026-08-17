// Stitches content/*.md into template.html and writes index.html.
// Zero dependencies. Deterministic: same inputs always produce the same bytes.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const esc = (s) => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// Minimal, deliberate markdown subset: paragraphs, blockquotes, **bold**.
// Anything richer belongs in template.html, not in prose.
function render(md) {
  return md
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const b = block.trim();
      if (b.startsWith('>')) {
        const inner = b.replace(/^>\s?/gm, '').trim();
        return `<blockquote>${bold(esc(inner))}</blockquote>`;
      }
      return `<p>${bold(esc(b.replace(/\n/g, ' ')))}</p>`;
    })
    .join('\n      ');
}

const bold = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// Inline tokens sit inside an existing <h1>/<p>, so they must not be wrapped in
// block tags. Wrapping them produced <h1><p>...</p></h1>, which silently drops
// the heading to body size, and <p><p>...</p></p>, which is invalid nesting.
const inline = (md) => bold(esc(md.trim().replace(/\s*\n\s*/g, ' ')));

const raw = {};
for (const f of readdirSync(join(root, 'content')).sort()) {
  if (!f.endsWith('.md')) continue;
  raw[f.replace(/\.md$/, '')] = readFileSync(join(root, 'content', f), 'utf8');
}

let html = readFileSync(join(root, 'template.html'), 'utf8');
const used = new Set();

html = html.replace(/<!--(content|inline):([a-z0-9-]+)-->/g, (m, mode, key) => {
  if (!(key in raw)) {
    console.error(`FAIL: template references missing content file content/${key}.md`);
    process.exit(1);
  }
  if (mode === 'inline' && /\n\s*\n/.test(raw[key].trim())) {
    console.error(`FAIL: content/${key}.md has multiple blocks but is used as an inline token`);
    process.exit(1);
  }
  used.add(key);
  return mode === 'inline' ? inline(raw[key]) : render(raw[key]);
});

const tokens = raw;

const orphans = Object.keys(tokens).filter((k) => !used.has(k));
if (orphans.length) {
  console.error(`FAIL: content files never used by the template: ${orphans.join(', ')}`);
  process.exit(1);
}

writeFileSync(join(root, 'index.html'), html);
console.log(`built index.html from ${used.size} content files`);
