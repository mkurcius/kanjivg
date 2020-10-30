import * as fs from 'fs';
import * as globby from 'globby';
import * as meow from 'meow';
import * as path from 'path';
import { KanjivgPath } from './kanjivg-path';
import { KanjivgPathInfo } from './kanjivg-path-info';

const cli = meow(`
  Usage
      $ ts-node minify-kanjivg <source …> <destination>
  `);

if (cli.input.length < 0) {
  throw new Error('`source` and `destination` required');
}

const source = cli.input;
const destination = cli.input.pop() as string;


const PATH_REG_EXP = /<path id="([^"]*)" .*d="([^"]*)".*\/>/g;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, { recursive: true });
}

globby.sync(source).forEach(file => {
  const svgPaths = extractSvgPaths(file);
  if(svgPaths.map(i => i.start).some(i => !i.x || !i.y)){
    console.log(file);
  }

  const svgContent = buildSvgContent(svgPaths);

  const destFile = path.join(destination, path.basename(file));
  fs.writeFileSync(destFile, svgContent);

  const destFileInfo = destFile.replace(/\.svg$/, '.json');
  const pathsInfo: KanjivgPathInfo[] = svgPaths.map(path => ({id: path.id, start: path.start}));
  fs.writeFileSync(destFileInfo, JSON.stringify(pathsInfo));
});

function extractSvgPaths(file: string): KanjivgPath[] {
  const content = fs.readFileSync(file, 'utf8');
  return Array.from(content.matchAll(PATH_REG_EXP), m => {
    const result = Array.from(m[2].matchAll(/^[M|m]\s*([^,|\s]*)[,|\s]([^c|C]*)/))[0];

    return {
      id: m[1],
      d: m[2],
      start: {
        x: Number(result[1].trim()),
        y: Number(result[2].trim())
      },
    };
  });
}

function buildSvgContent(svgPaths: KanjivgPath[]): string {
  const svgPathNodes = svgPaths
    .map(path => `<path id="${path.id}" d="${path.d}"/>`)
    .join('\n');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109" style="fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;">
${svgPathNodes}
</svg>`.trim();
}
