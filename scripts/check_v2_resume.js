#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function usage() {
  console.error("Usage: node scripts/check_v2_resume.js <resume-v2.md...>");
}

const files = process.argv.slice(2);

if (!files.length) {
  usage();
  process.exit(2);
}

function wordCount(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

let hasError = false;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`${file}: file not found`);
    hasError = true;
    continue;
  }

  const text = fs.readFileSync(file, "utf8");
  const basename = path.basename(file);
  const marker = '<div class="page-break"></div>';
  const lower = text.toLowerCase();

  if (!text.includes(marker)) {
    console.error(`${file}: missing v2 appendix page-break marker: ${marker}`);
    hasError = true;
  }

  if (!/^## Appendix: Product And Service Leadership$/m.test(text)) {
    console.error(`${file}: missing required appendix heading`);
    hasError = true;
  }

  if (/\b27\s+years\b/i.test(text) || /\byears of experience\b/i.test(text)) {
    console.error(`${file}: explicit total-years experience language found`);
    hasError = true;
  }

  if (/^##\s+Relevant Experience\s*$/im.test(text)) {
    console.error(`${file}: forbidden Relevant Experience heading found`);
    hasError = true;
  }

  if (!/^##\s+Skills And Operating Strengths\s*$/im.test(text)) {
    console.error(`${file}: missing Skills And Operating Strengths section`);
    hasError = true;
  }

  if (!/^##\s+Experience\s*$/im.test(text)) {
    console.error(`${file}: missing Experience section`);
    hasError = true;
  }

  if (!/^##\s+Education\s*$/im.test(text)) {
    console.error(`${file}: missing Education section`);
    hasError = true;
  }

  if (/GPA\s*[:=]?\s*\d/i.test(text)) {
    console.error(`${file}: explicit GPA language found`);
    hasError = true;
  }

  const core = text.includes(marker) ? text.split(marker)[0] : text;
  const coreWords = wordCount(core);
  const totalWords = wordCount(text);

  if (coreWords > 1000) {
    console.error(
      `${file}: v2 core resume is ${coreWords} words before appendix, above 1000-word guideline`
    );
    hasError = true;
  }

  if (lower.includes("merlin")) {
    console.error(`${file}: forbidden project name "merlin" found`);
    hasError = true;
  }

  console.log(`${basename}: v2 check passed (${coreWords} core words, ${totalWords} total words)`);
}

process.exit(hasError ? 1 : 0);

