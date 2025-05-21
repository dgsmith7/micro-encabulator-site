#!/bin/bash
# Recursively convert all PNG files in ./public/snapshots and subfolders to WebP using ImageMagick
SNAPSHOT_DIR="./public/snapshots"
find "$SNAPSHOT_DIR" -type f -name "*.png" | while read -r pngfile; do
  webpfile="${pngfile%.png}.webp"
  echo "Converting $pngfile -> $webpfile"
  magick convert "$pngfile" "$webpfile"
done
echo "All PNG files converted to WebP."