#!/bin/bash
#@author Fred Brooker <git@gscloud.cz>

INPUT="logo.png"
OUT_DIR="."

if ! [ -x "$(command -v convert)" ]; then
  echo "ERROR: convert not found. Check if ImageMagick is installed." >&2
  exit 1
fi

if [ -f $INPUT ]; then
  convert -flatten -background none -resize 512x512 $INPUT $OUT_DIR/logo.webp
  SIZES=(16 128 192 256)
  for size in ${SIZES[@]}; do
    convert -flatten -background black -resize ${size}x${size}^ $INPUT $OUT_DIR/favicon-${size}.png
    convert -flatten -background black -resize ${size}x${size}^ $INPUT $OUT_DIR/favicon-${size}.webp
    if [ -f favicon-${size}.png ]; then
      echo -ne "."
    else
      echo "ERROR: Could not process input file $INPUT" >&2
      exit 1
    fi
  done
else
  echo "ERROR: Input file $INPUT does not exist." >&2
  exit 1
fi
echo -en "\nDone.\n"
