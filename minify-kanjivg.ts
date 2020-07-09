import * as fs from 'fs';
import * as globby from 'globby';
import * as meow from 'meow';
import * as path from 'path';

const cli = meow(`
  Usage
      $ ts-node minify-kanjivg <source …> <destination>
  `);

if (cli.input.length < 0) {
  throw new Error('`source` and `destination` required');
}

const source = cli.input;
const destination = cli.input.pop() as string;


const PATH_REG_EXP = /<path .*d="([^"]*)".*\/>/g;

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination, {recursive: true});
}

globby.sync(source).forEach(file => {
  const svgPaths = extractSvgPaths(file);
  const svgContent = buildSvgContent(svgPaths);

  const destFile = path.join(destination, path.basename(file));
  fs.writeFileSync(destFile, svgContent);
});

function extractSvgPaths(file: string): string[] {
  const content = fs.readFileSync(file, 'utf8');
  return Array.from(content.matchAll(PATH_REG_EXP), m => m[1]);
}

function buildSvgContent(svgPaths: string[]): string {
  const svgPathNodes = svgPaths
    .map(path => `<path d="${path}"/>`)
    .join('\n');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109" style="fill:none;stroke:#000000;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;">
${svgPathNodes}
</svg>`.trim();
}
