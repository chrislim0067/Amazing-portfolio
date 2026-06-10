import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const summaryContent = `I am an AI/ML Engineering Executive, Technology Leader, and Data Platform Architect passionate about building intelligent systems that transform how organizations operate, innovate, and create value.

Over the past decade, I have led the development of enterprise AI platforms, machine learning products, cloud-native systems, and advanced analytics solutions across healthcare, retail technology, biomedical engineering, and SaaS industries. My experience spans the complete technology lifecycle—from research and experimentation to large-scale deployment, operationalization, and organizational transformation.

My expertise includes Generative AI, Agentic AI, Large Language Models, Retrieval-Augmented Generation, Computer Vision, 3D Modeling, Data Engineering, MLOps, and Cloud Architecture. I have successfully built and scaled high-performing engineering teams, delivered production AI systems serving millions of users, and driven strategic initiatives that bridge the gap between cutting-edge research and real-world business impact.

I believe the future of technology lies in intelligent systems that augment human decision-making, automate complex workflows, and unlock new opportunities through data-driven innovation. My mission is to build scalable, responsible, and impactful AI solutions that improve customer experiences, accelerate business growth, and create meaningful outcomes for organizations and the people they serve.`;

export function patchSummaryContent(source, marker = 'title:"PORTFOLIO_CO_01 Chris Lim"') {
  const start = source.indexOf(marker);
  if (start === -1) return source;

  const contentKey = 'content:`';
  const contentStart = source.indexOf(contentKey, start);
  if (contentStart === -1) return source;

  const bodyStart = contentStart + contentKey.length;
  const bodyEnd = source.indexOf('`', bodyStart);
  if (bodyEnd === -1) return source;

  return source.slice(0, bodyStart) + summaryContent + source.slice(bodyEnd);
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
  source = patchSummaryContent(source);
  if (source === before) {
    console.error('Summary marker not found');
    process.exit(1);
  }

  writeFileSync(bundlePath, source, 'utf8');
  console.log('Patched summary content in', bundlePath);
}
