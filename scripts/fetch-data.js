#!/usr/bin/env node
/**
 * Fetch Open Occult JSON data into data/vendor/
 * Runs automatically before start (prestart hook)
 * Skips if files already exist
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VENDOR_DIR = join(__dirname, '..', 'data', 'vendor');

const SOURCES = [
  {
    name: 'botanicals.json',
    url: 'https://raw.githubusercontent.com/openoccult/openoccult-data/main/categories/occult/botanicals.json'
  },
  {
    name: 'crystals.json',
    url: 'https://raw.githubusercontent.com/openoccult/openoccult-data/main/categories/occult/crystals.json'
  },
  {
    name: 'colors.json',
    url: 'https://raw.githubusercontent.com/openoccult/openoccult-data/main/categories/occult/colors.json'
  },
  {
    name: 'runes.json',
    url: 'https://raw.githubusercontent.com/openoccult/openoccult-data/main/categories/divination/runes.json'
  }
];

async function main() {
  mkdirSync(VENDOR_DIR, { recursive: true });

  for (const src of SOURCES) {
    const dest = join(VENDOR_DIR, src.name);
    if (existsSync(dest)) {
      console.log(`  ✓ ${src.name} already exists, skipping`);
      continue;
    }
    console.log(`  ↓ fetching ${src.name}...`);
    try {
      const res = await fetch(src.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      // validate JSON
      JSON.parse(text);
      writeFileSync(dest, text, 'utf-8');
      console.log(`  ✓ ${src.name} saved (${(text.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  ✗ ${src.name} failed: ${err.message}`);
    }
  }
  console.log('Done.');
}

main();
