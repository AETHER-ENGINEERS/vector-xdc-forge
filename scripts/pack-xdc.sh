#!/usr/bin/env bash
# Pack src/ into xdc-forge.xdc. Do NOT include webxdc.js — the host injects it.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src"
OUT="$ROOT/xdc-forge.xdc"
if [[ ! -f "$SRC/vendor/jszip.min.js" ]]; then
  echo "vendor missing — fetching jszip 3.10.1"
  mkdir -p "$SRC/vendor"
  curl -fsSL "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js" -o "$SRC/vendor/jszip.min.js"
fi
rm -f "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp "$SRC/index.html" "$SRC/style.css" "$SRC/app.js" "$SRC/manifest.toml" "$TMP/"
mkdir -p "$TMP/vendor"
cp "$SRC/vendor/jszip.min.js" "$TMP/vendor/"
# Do not pack vendor/webxdc-stub.js — only used when opening src/ in a browser.
if [[ -f "$SRC/icon.png" ]]; then cp "$SRC/icon.png" "$TMP/"; fi
(
  cd "$TMP"
  zip -9 -X -r "$OUT" . >/dev/null
)
SIZE=$(wc -c < "$OUT")
echo "wrote $OUT ($SIZE bytes)"
if (( SIZE > 50000000 )); then
  echo "warning: over 50MB Vector cap" >&2
fi
