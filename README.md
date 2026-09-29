# XDC Forge

A [WebxDC](https://webxdc.org) IDE that itself runs as a WebxDC inside [Vector](https://vectorapp.io).

Edit HTML / JS / CSS / assets, preview one or two simulated peers, pack a `.xdc`, and hand it to a Vector chat with `sendToChat`. No CDN. No host server. The messenger is the store.

**Status:** v0.1.0 Phase 0 — local projects, templates, multi-peer preview, pack / import.

**License:** https://github.com/AETHER-ENGINEERS/AETHER-ENGINEERS/blob/main/LICENSE

Repo: https://github.com/AETHER-ENGINEERS/vector-xdc-forge

This is a sibling of [OMARG-Vector-strudel](https://github.com/AETHER-ENGINEERS/OMARG-Vector-strudel), not a continuation of it.

---

## Drop-in

```sh
bash scripts/pack-xdc.sh    # fetches JSZip if needed, writes ./xdc-forge.xdc
```

Attach `xdc-forge.xdc` in a Vector chat. Tap **Start**.

Do not zip `webxdc.js`. The host injects it.

Browser smoke test (no Vector): open `src/index.html`. The bundled stub implements `importFiles` / `sendToChat` as file-picker + download.

---

## What it does

| Action | How |
|---|---|
| New project | Hello chat / shared counter / blank templates |
| Edit | File tree + tabs + line-numbered editor. Ctrl/Cmd+S saves to IndexedDB |
| Assets | `importFiles` or the Asset button. Binaries stored as base64 |
| Preview | 1–2 sandboxed iframes with a mock `webxdc` that routes `sendUpdate` between peers. Ctrl/Cmd+Enter |
| Pack & send | JSZip → `.xdc` → `webxdc.sendToChat` (download fallback in the browser stub) |
| Import `.xdc` | Unzip into a new project |

Projects live in IndexedDB on the device that opened the Forge instance. They are not automatically synced across the chat. That is Phase 2 (room document / Yjs).

---

## Architecture

WebxDC is network-isolated, so JSZip is vendored at pack time.

| Piece | Role |
|---|---|
| `src/app.js` | Projects, editor, pack, preview bus |
| `src/vendor/jszip.min.js` | Zip / unzip `.xdc` |
| `src/vendor/webxdc-stub.js` | Browser-only. Not packed |
| Preview mock | Injected blob `webxdc` + `postMessage` to the parent |

Preview rewrites `src` / `href` on `index.html` to blob URLs. Relative `fetch()`, CSS `url()`, and dynamic imports are not rewritten in v0.1 — keep those assets referenced from HTML tags or inline them.

Vector realtime (`joinRealtimeChannel`) is documented in the API pane and reserved for Phase 1 of apps you *build*, not used by Forge itself yet.

---

## Phases

0. Editor + IndexedDB + templates + 2-peer preview + pack/import — current
1. CodeMirror / better highlighting, icon generator, manifest form, preview `fetch` map
2. Collaborative project document over `sendUpdate` so a room can co-author an xdc
3. Vector Nexus listing

Cap: packed Forge stays well under Vector's 50 MB.

---

## Resources

- https://webxdc.org/docs/
- https://webxdc.org/docs/spec/format.html
- https://webxdc.org/docs/spec/sendToChat.html
- https://webxdc.org/docs/spec/importFiles.html
- https://github.com/VectorPrivacy/Vector/blob/master/docs/webxdc-realtime.md
