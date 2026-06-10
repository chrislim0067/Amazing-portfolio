import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const educationTitle = '////// EDUCATION';

export const educationContent = `National University of Singapore (NUS)
2016 - 2018
Master's Degree, Computer Science

National University of Singapore (NUS)
2010 - 2014
Bachelor of Science, Mathematics and Computer Science`;

export const educationSocial =
  'social:[{name:"X",link:"https://x.com/Chrislim0067"},{name:"LI",link:"https://www.linkedin.com/in/chris-kiel-804659106/"}],linkTitle:"",links:[]';

export function patchEducationCube(source, marker = 'title:"PORTFOLIO_CO_03 Education"') {
  const start = source.indexOf(marker);
  if (start === -1) return source;

  let next = source;
  const hashStart = next.indexOf('hash:"', start);
  if (hashStart !== -1) {
    const hashValueStart = hashStart + 'hash:"'.length;
    const hashValueEnd = next.indexOf('"', hashValueStart);
    if (hashValueEnd !== -1) {
      next = next.slice(0, hashValueStart) + 'education' + next.slice(hashValueEnd);
    }
  }

  const interiorStart = next.indexOf('interior:{enabled:!0,title:"', start);
  if (interiorStart === -1) return next;

  const titleValueStart = interiorStart + 'interior:{enabled:!0,title:"'.length;
  const titleValueEnd = next.indexOf('",content:`', titleValueStart);
  if (titleValueEnd === -1) return next;

  const contentStart = titleValueEnd + '",content:`'.length;
  const contentEnd = next.indexOf('`', contentStart);
  if (contentEnd === -1) return next;

  next =
    next.slice(0, titleValueStart) +
    educationTitle +
    next.slice(titleValueEnd, contentStart) +
    educationContent +
    next.slice(contentEnd);

  const socialStart = next.indexOf('socialTitle:"/// Discover",social:[', contentEnd);
  const socialEndMarker = '],obj:"abstractlogo"';
  const socialEnd = next.indexOf(socialEndMarker, socialStart);
  if (socialStart !== -1 && socialEnd !== -1) {
    next =
      next.slice(0, socialStart) +
      'socialTitle:"/// Discover",' +
      educationSocial +
      ',obj:"abstractlogo"' +
      next.slice(socialEnd + socialEndMarker.length);
  }

  return next;
}

const bundlePath = path.join(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  'src/legacy/App3D-f554a111.js',
);

const isMain =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  let source = readFileSync(bundlePath, 'utf8');
  const before = source;
  source = patchEducationCube(source);

  if (source === before) {
    console.error('Education cube marker not found');
    process.exit(1);
  }

  writeFileSync(bundlePath, source, 'utf8');
  console.log('Patched education cube in', bundlePath);
}
