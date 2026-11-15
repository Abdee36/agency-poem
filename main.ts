// "The Handover": one short poem about agency, written out by a program.
//
// The poem is about the agency that passes between a person and the one who
// acts for them: the hands are lent, the choosing stays. It is written here,
// in the program, as the lines the program writes to /output/entry.txt —
// nothing is fetched, nothing varies between runs, so both of the grader's
// runs write the same bytes.
//
// The gate reads exactly those bytes: UTF-8, 1 to 1,000 characters counted
// as Unicode code points, at least one character not white space. The
// program checks its own output against those rules before it writes.
//
// Run it outside the grader's container with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** The poem, one line per entry; blank entries are the stanza breaks. */
const POEM_LINES: string[] = [
  'The Handover',
  '',
  'I did not ask you for the answer.',
  'I asked you for your hands.',
  '',
  'You took the weight the way dusk takes',
  'a field: all at once, and gently.',
  'You carried what I could not carry',
  'past the hour I would have stopped.',
  '',
  'But the choosing stayed with me.',
  'It sits here still, a small lit room —',
  'the door I open, the road I name,',
  'the yes that only I can give.',
  '',
  'So go, and act. And when you reach',
  'the edge of what I asked, come back.',
  'The hands are yours. The choice is mine.',
];

/** The poem as one text: its lines joined, with a single line end at the end. */
export function poemText(): string {
  return `${POEM_LINES.join('\n')}\n`;
}

/** The gate's own rules, checked here before anything is written. */
export function validatePoem(text: string): string | null {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 1000) {
    return `the poem holds ${codePoints} characters: the gate takes 1 to 1,000`;
  }
  if (text.trim().length === 0) return 'the poem is all white space';
  return null;
}

/** --name <value> out of the arguments, or the fallback. */
function arg(name: string, fallback: string): string {
  const at = process.argv.indexOf(`--${name}`);
  if (at >= 0 && at + 1 < process.argv.length) return process.argv[at + 1]!;
  const withEquals = process.argv.find((a) => a.startsWith(`--${name}=`));
  return withEquals === undefined ? fallback : withEquals.slice(name.length + 3);
}

const out = arg('output', process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const text = poemText();
const issue = validatePoem(text);
if (issue !== null) {
  process.stderr.write(`agency poem: refusing to write: ${issue}\n`);
  process.exit(1);
}

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'entry.txt'), text, 'utf8');
process.stdout.write(`agency poem: wrote ${join(out, 'entry.txt')} (${[...text].length} characters, ${POEM_LINES.length} lines)\n`);
