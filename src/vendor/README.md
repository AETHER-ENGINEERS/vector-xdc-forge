`jszip.min.js` is fetched at pack time by `scripts/pack-xdc.sh` (jsDelivr, JSZip 3.10.1, MIT).

It is not committed. The packed `.xdc` includes the minified file because WebxDC has no network at runtime.

`webxdc-stub.js` *is* committed. It is only loaded when you open `src/index.html` in a browser. Vector injects the real `webxdc.js` and the stub is not zipped into the container.
