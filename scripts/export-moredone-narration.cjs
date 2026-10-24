/* eslint-disable @typescript-eslint/no-require-imports -- Standalone narration export using Next's bundled HTML parser. */
// Export the rendered page, rather than a hand-picked summary, for GD recording.
// Start the app, then run: node scripts/export-moredone-narration.cjs
const { parse } = require('next/dist/compiled/node-html-parser');
const { mkdirSync, writeFileSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const normalize = text => text.replace(/\s+/g, ' ').trim();
const origin = process.env.MOREDONE_REVIEW_ORIGIN || 'http://127.0.0.1:3000';
const output = resolve('artifacts/moredone-narration');
const manifest = JSON.parse(readFileSync('src/app/moredone/gd-voice.json', 'utf8'));

async function main() {
  mkdirSync(output, { recursive: true });
  let incomplete = false;
  for (const country of ['ng', 'rw', 'other']) {
    const response = await fetch(`${origin}/moredone?country=${country}`);
    if (!response.ok) throw new Error(`${country}: page returned ${response.status}`);
    const root = parse(await response.text()).querySelector('.md-page');
    if (!root) throw new Error(`${country}: page is missing`);
    // Exclude duplicate floating actions, narration UI and private input values.
    // Closed details stay in the transcript: project ideas and FAQ answers matter.
    root.querySelectorAll('script,style,.md-companion,.md-tour,.md-voice-dock,.md-sticky-cta,.md-listen-link,.md-form__trap,[aria-hidden="true"],[hidden]').forEach(element => element.remove());
    root.querySelectorAll('input,textarea').forEach(element => element.remove());
    root.querySelectorAll('select').forEach(element => {
      const choice = element.querySelector('option[selected]') || element.querySelector('option');
      element.replaceWith(choice?.textContent || '');
    });
    const passages = [];
    function walk(element) {
      for (const child of element.childNodes || []) {
        if (child.nodeType === 3) {
          const text = normalize(child.textContent);
          if (text) passages.push(text);
        } else if (child.nodeType === 1) walk(child);
      }
    }
    walk(root);
    // Join text in page order. Exact words are retained, including country prices.
    const text = passages.join(' ');
    const clips = manifest.segments.map(clip => normalize(clip.text));
    const recordedWords = clips.reduce((sum, clip) => sum + clip.split(' ').length, 0);
    const pageWords = text.split(' ').length;
    const stale = clips.filter(clip => !text.includes(clip));
    const covered = recordedWords === pageWords && stale.length === 0 && clips.join(' ') === text;
    incomplete ||= !covered;
    const report = { country, pageWords, recordedWords, complete: covered, stalePassages: stale, text };
    writeFileSync(resolve(output, `${country}.json`), JSON.stringify(report, null, 2) + '\n');
    writeFileSync(resolve(output, `${country}.txt`), text + '\n');
    console.log(`${country}: ${recordedWords} recorded words / ${pageWords} page words; ${stale.length} stale passages; ${covered ? 'COMPLETE' : 'INCOMPLETE'}`);
  }
  if (process.argv.includes('--check') && incomplete) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
