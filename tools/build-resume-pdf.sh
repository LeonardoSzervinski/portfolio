#!/usr/bin/env sh
# Prints resume.html to PDF (Portuguese and English) with headless Chrome.
# Usage: npm run build:resume   (set CHROME=/path/to/chrome if it is not auto-detected)
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/assets/documents"

if [ -z "${CHROME:-}" ]; then
  for candidate in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$(command -v google-chrome 2>/dev/null || true)" \
    "$(command -v chromium 2>/dev/null || true)"; do
    if [ -n "$candidate" ] && [ -x "$candidate" ]; then CHROME="$candidate"; break; fi
  done
fi

if [ -z "${CHROME:-}" ]; then
  echo "Chrome not found. Set CHROME=/path/to/chrome." >&2
  exit 1
fi

mkdir -p "$OUT"
for lang in pt en; do
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --allow-file-access-from-files \
    --virtual-time-budget=5000 --print-to-pdf="$OUT/curriculo-leonardo-$lang.pdf" \
    "file://$ROOT/resume.html?lang=$lang" >/dev/null 2>&1
  echo "✓ $OUT/curriculo-leonardo-$lang.pdf"
done
