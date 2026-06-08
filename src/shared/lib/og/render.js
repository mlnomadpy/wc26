import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

// OG images render at build time from the project root; read fonts cwd-relative.
const FONT_DIR = 'src/shared/lib/og/fonts';
const fonts = [
  { name: 'Anton', data: fs.readFileSync(`${FONT_DIR}/Anton-400.ttf`), weight: 400, style: 'normal' },
  { name: 'Archivo', data: fs.readFileSync(`${FONT_DIR}/Archivo-700.ttf`), weight: 700, style: 'normal' },
  { name: 'Archivo', data: fs.readFileSync(`${FONT_DIR}/Archivo-500.ttf`), weight: 500, style: 'normal' },
];

export async function og(markup) {
  const svg = await satori(html(markup), { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
