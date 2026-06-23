import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderLlmsTxt } from '../scripts/generate-llms.mjs';

const ROOT = join(import.meta.dirname, '..');

describe('llms.txt generator', () => {
  it('committed llms.txt matches generator output', () => {
    const generated = renderLlmsTxt().replace(/\r\n/g, '\n');
    const onDisk = readFileSync(join(ROOT, 'llms.txt'), 'utf8').replace(/\r\n/g, '\n');
    expect(onDisk).toBe(generated);
  });
});