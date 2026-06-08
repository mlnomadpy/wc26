import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';

const fonts = [
  { name: 'Anton', data: fs.readFileSync('src/og/fonts/Anton-400.ttf'), weight: 400, style: 'normal' },
  { name: 'Archivo', data: fs.readFileSync('src/og/fonts/Archivo-700.ttf'), weight: 700, style: 'normal' },
  { name: 'Archivo', data: fs.readFileSync('src/og/fonts/Archivo-500.ttf'), weight: 500, style: 'normal' },
];

export async function og(markup) {
  const svg = await satori(html(markup), { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
