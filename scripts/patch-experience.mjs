import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const experienceTitle = '////// EXPERIENCE';

export const experienceContent = `Builder.ai · Staff AI/ML Engineer
Jan 2024 – May 2025 · Singapore
- Led architecture and development of enterprise AI platforms leveraging LLMs, multi-agent systems, and workflow automation.
- Designed scalable AI inference pipelines, reducing latency by 40% while improving throughput and reliability.
- Built AI-powered document intelligence and retrieval systems that increased operational productivity by 35%.
- Established AI engineering standards and mentored teams on scalable AI architecture.

Bambu · Lead AI Automation Engineer
Jan 2022 – Dec 2023 · Singapore
- Led enterprise AI automation initiatives across fintech operations and customer-facing products.
- Automated 40% of manual workflows through AI-driven solutions and intelligent process automation.
- Introduced LLM-powered internal tools that improved knowledge accessibility and decision-making.
- Drove architecture and deployment strategies for cloud-native AI systems in regulated environments.

Bambu · Senior AI/ML Engineer
Jul 2019 – Dec 2021 · Singapore
- Developed machine learning systems for robo-advisory platforms, recommendation engines, and risk-scoring solutions.
- Built real-time inference services and scalable ML deployment pipelines.
- Improved model performance and operational efficiency through advanced feature engineering and optimization.

Taiger · Senior Machine Learning Engineer
Jan 2018 – Jun 2019 · Singapore
- Led development of enterprise NLP, OCR, semantic search, and document intelligence platforms.
- Architected scalable ML services that improved document processing efficiency by 35%.
- Supported production deployment and scaling of AI solutions for enterprise customers.

Taiger · Machine Learning Engineer
Oct 2016 – Dec 2017 · Singapore
- Built NLP and OCR pipelines for document classification and information extraction.
- Developed backend AI services and APIs for enterprise machine learning applications.
- Improved model accuracy and processing efficiency through optimization initiatives.

Zilingo · Software Engineer II (Full-Stack)
Sep 2015 – Sep 2016 · Singapore
- Developed marketplace platforms supporting logistics, inventory management, and transaction processing.
- Designed backend APIs and optimized application performance for high-growth e-commerce systems.
- Integrated third-party payment and logistics services.

Zilingo · Software Engineer (Full-Stack)
Jul 2014 – Aug 2015 · Singapore
- Built full-stack web applications supporting seller operations and internal business workflows.
- Developed scalable backend services and frontend features for rapidly growing e-commerce platforms.
- Collaborated with product and engineering teams to improve platform reliability and efficiency.`;

export function patchExperienceCube(source, marker = 'title:"PORTFOLIO_CO_02 Experience"') {
  const start = source.indexOf(marker);
  if (start === -1) return source;

  const interiorStart = source.indexOf('interior:{enabled:!0,title:"', start);
  if (interiorStart === -1) return source;

  const titleValueStart = interiorStart + 'interior:{enabled:!0,title:"'.length;
  const titleValueEnd = source.indexOf('",content:`', titleValueStart);
  if (titleValueEnd === -1) return source;

  const contentStart = titleValueEnd + '",content:`'.length;
  const bodyEnd = source.indexOf('`', contentStart);
  if (bodyEnd === -1) return source;

  return (
    source.slice(0, titleValueStart) +
    experienceTitle +
    source.slice(titleValueEnd, contentStart) +
    experienceContent +
    source.slice(bodyEnd)
  );
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
  source = patchExperienceCube(source);

  if (source === before) {
    console.error('Experience cube marker not found');
    process.exit(1);
  }

  writeFileSync(bundlePath, source, 'utf8');
  console.log('Patched experience cube in', bundlePath);
}
