#!/usr/bin/env node
// scripts/add-zero-to-snapshot-filenames.js
// Recursively renames every file in the snapshots directory by adding a '0' before the extension.
// Example: 'fre1.txt' -> 'fre10.txt'

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const snapshotsDir = path.join(__dirname, "..", "public", "snapshots");

function addZeroToFilenames(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      addZeroToFilenames(fullPath);
    } else {
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      // Only rename if it doesn't already end with '0'
      if (!base.endsWith("0")) {
        const newName = base + "0" + ext;
        const newPath = path.join(dir, newName);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed: ${file} -> ${newName}`);
      }
    }
  });
}

addZeroToFilenames(snapshotsDir);
