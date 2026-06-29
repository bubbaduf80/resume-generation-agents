#!/usr/bin/env node

const fs = require("fs");

const paths = process.argv.slice(2);

if (paths.length === 0) {
  console.error("Usage: node scripts/check_markdown_currency.js FILE.md [...]");
  process.exit(2);
}

let failed = false;

for (const filePath of paths) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const match = line.match(/\\?\$(?=\d)/);
    if (!match) return;

    console.error(
      `${filePath}:${index + 1}: unsafe currency dollar sign; use &#36;`
    );
    failed = true;
  });
}

process.exit(failed ? 1 : 0);
