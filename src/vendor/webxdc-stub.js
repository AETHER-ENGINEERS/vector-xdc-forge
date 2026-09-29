/* Browser stub so XDC Forge can be opened as a plain page while developing the IDE.
   Vector / Delta Chat inject their own webxdc.js and this file is not packed. */
(function () {
  if (window.webxdc) return;
  let serial = 0;
  const updates = [];
  const listeners = [];
  function addr() {
    const n = Math.random().toString(16).slice(2, 10);
    return "stub@" + n;
  }
  window.webxdc = {
    selfAddr: addr(),
    selfName: "Forge Dev",
    sendUpdate(update, descr) {
      serial += 1;
      const rec = Object.assign({ serial: serial, max_serial: serial }, update);
      updates.push(rec);
      listeners.forEach(function (fn) { try { fn(rec); } catch (e) { console.error(e); } });
    },
    setUpdateListener(fn, startSerial) {
      listeners.push(fn);
      updates.forEach(function (u) {
        if (u.serial > (startSerial || 0)) fn(u);
      });
      return Promise.resolve();
    },
    sendToChat(message) {
      const name = message && message.file && message.file.name;
      if (message && message.file) {
        let blob = null;
        if (message.file.blob) blob = message.file.blob;
        else if (typeof message.file.base64 === "string") {
          const bin = atob(message.file.base64);
          const arr = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          blob = new Blob([arr]);
        } else if (typeof message.file.plainText === "string") {
          blob = new Blob([message.file.plainText], { type: "text/plain" });
        }
        if (blob && name) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = name;
          a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        }
      }
      if (message && message.text) console.info("[webxdc.sendToChat]", message.text);
      return Promise.resolve();
    },
    importFiles(filter) {
      return new Promise(function (resolve) {
        const input = document.createElement("input");
        input.type = "file";
        if (filter && filter.multiple) input.multiple = true;
        const acc = [];
        if (filter && filter.extensions) acc.push.apply(acc, filter.extensions);
        if (filter && filter.mimeTypes) acc.push.apply(acc, filter.mimeTypes);
        if (acc.length) input.accept = acc.join(",");
        input.onchange = function () {
          resolve(Array.prototype.slice.call(input.files || []));
        };
        input.click();
      });
    },
  };
})();
