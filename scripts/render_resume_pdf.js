#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { marked } = require("marked");
const { chromium } = require("playwright");

function usage() {
  console.error(
    "Usage: scripts/render_resume_pdf.js INPUT.md OUTPUT.pdf [styles/resume.css]"
  );
  process.exit(1);
}

const [inputPath, outputPath, cssPath = "styles/resume.css"] = process.argv.slice(2);
if (!inputPath || !outputPath) usage();

const cwd = process.cwd();
const absInput = path.resolve(cwd, inputPath);
const absOutput = path.resolve(cwd, outputPath);
const absCss = path.resolve(cwd, cssPath);

if (!fs.existsSync(absInput)) {
  console.error(`Input not found: ${absInput}`);
  process.exit(1);
}

if (!fs.existsSync(absCss)) {
  console.error(`CSS not found: ${absCss}`);
  process.exit(1);
}

const markdown = fs.readFileSync(absInput, "utf8");
const css = fs.readFileSync(absCss, "utf8");
const body = marked.parse(markdown, {
  gfm: true,
  breaks: false,
  mangle: false,
  headerIds: false,
});

const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${path.basename(inputPath)}</title>
  <style>${css}</style>
</head>
<body>
  <main>${body}</main>
</body>
</html>`;

const htmlPath = absOutput.replace(/\.pdf$/i, ".html");
fs.mkdirSync(path.dirname(absOutput), { recursive: true });
fs.writeFileSync(htmlPath, html);

function chromeExecutablePath() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.EDGE_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];

  return candidates.find((candidate) => candidate && fs.existsSync(candidate));
}

(async () => {
  const executablePath = chromeExecutablePath();
  const browser = await chromium.launch({
    headless: true,
    executablePath,
  });
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: absOutput,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`Wrote ${absOutput}`);
  console.log(`Wrote ${htmlPath}`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
