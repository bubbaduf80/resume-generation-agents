#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_PROFILE = path.join(
  "data",
  "career_inventory",
  "career_profile.md"
);

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phonePattern =
  /(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s).-]*\d{3}[\s.-]*\d{4}/g;
const linkedinPattern =
  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/gi;

function usage() {
  console.error(
    "Usage: node scripts/check_profile_contact.js [--profile data/career_inventory/career_profile.md] <markdown...>"
  );
}

function parseArgs(argv) {
  let profile = DEFAULT_PROFILE;
  const files = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--profile") {
      profile = argv[i + 1];
      i += 1;
    } else {
      files.push(arg);
    }
  }

  return { profile, files };
}

function firstFieldValue(text, fieldName) {
  const match = text.match(new RegExp(`^-\\s*${fieldName}:\\s*(.+)$`, "im"));
  return match ? match[1].trim() : "";
}

function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

function normalizePhone(value) {
  const digits = digitsOnly(value);
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

function normalizeLinkedIn(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function collectMatches(text, pattern) {
  return Array.from(new Set(text.match(pattern) || []));
}

const { profile, files } = parseArgs(process.argv.slice(2));

if (!files.length) {
  usage();
  process.exit(2);
}

if (!fs.existsSync(profile)) {
  console.error(`Contact check failed: profile not found: ${profile}`);
  process.exit(2);
}

const profileText = fs.readFileSync(profile, "utf8");
const expectedEmail = firstFieldValue(profileText, "Email");
const expectedPhone = firstFieldValue(profileText, "Phone");
const expectedLinkedIn = firstFieldValue(profileText, "LinkedIn");

if (!expectedEmail || !expectedPhone || !expectedLinkedIn) {
  console.error(
    `Contact check failed: profile must contain '- Email:', '- Phone:', and '- LinkedIn:' fields: ${profile}`
  );
  process.exit(2);
}

const expectedEmailLower = expectedEmail.toLowerCase();
const expectedPhoneDigits = normalizePhone(expectedPhone);
const expectedLinkedInNormalized = normalizeLinkedIn(expectedLinkedIn);
let hasError = false;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Contact check failed: file not found: ${file}`);
    hasError = true;
    continue;
  }

  const text = fs.readFileSync(file, "utf8");
  const emails = collectMatches(text, emailPattern);
  const phones = collectMatches(text, phonePattern);
  const linkedIns = collectMatches(text, linkedinPattern);

  for (const email of emails) {
    if (email.toLowerCase() !== expectedEmailLower) {
      console.error(
        `${file}: email does not match career profile: found "${email}", expected "${expectedEmail}"`
      );
      hasError = true;
    }
  }

  for (const phone of phones) {
    if (normalizePhone(phone) !== expectedPhoneDigits) {
      console.error(
        `${file}: phone does not match career profile: found "${phone}", expected "${expectedPhone}"`
      );
      hasError = true;
    }
  }

  for (const linkedIn of linkedIns) {
    if (normalizeLinkedIn(linkedIn) !== expectedLinkedInNormalized) {
      console.error(
        `${file}: LinkedIn URL does not match career profile: found "${linkedIn}", expected "${expectedLinkedIn}"`
      );
      hasError = true;
    }
  }

  const requiresContact = /resume/i.test(path.basename(file));

  if (requiresContact && !emails.length) {
    console.error(`${file}: no email address found`);
    hasError = true;
  }

  if (requiresContact && !phones.length) {
    console.error(`${file}: no phone number found`);
    hasError = true;
  }

  if (requiresContact && !linkedIns.length) {
    console.error(`${file}: no LinkedIn URL found`);
    hasError = true;
  }
}

process.exit(hasError ? 1 : 0);
