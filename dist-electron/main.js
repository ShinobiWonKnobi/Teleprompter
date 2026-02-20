import { app as o, BrowserWindow as r, ipcMain as i, globalShortcut as t } from "electron";
import { fileURLToPath as p } from "node:url";
import n from "node:path";
const l = n.dirname(p(import.meta.url));
process.env.APP_ROOT = n.join(l, "..");
const s = process.env.VITE_DEV_SERVER_URL, f = n.join(process.env.APP_ROOT, "dist-electron"), a = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? n.join(process.env.APP_ROOT, "public") : a;
let e;
function c() {
  e = new r({
    width: 600,
    height: 150,
    alwaysOnTop: !0,
    frame: !1,
    transparent: !0,
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: n.join(l, "preload.mjs")
    }
  }), e.setAlwaysOnTop(!0, "screen-saver"), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? e.loadURL(s) : e.loadFile(n.join(a, "index.html"));
}
o.on("window-all-closed", () => {
  process.platform !== "darwin" && (o.quit(), e = null);
});
o.on("activate", () => {
  r.getAllWindows().length === 0 && c();
});
o.whenReady().then(() => {
  c(), i.on("window-close", () => {
    e && e.close();
  }), i.on("window-minimize", () => {
    e && e.minimize();
  }), t.register("Alt+Space", () => {
    e && e.webContents.send("shortcut-play-pause");
  }), t.register("Alt+Up", () => {
    e && e.webContents.send("shortcut-speed-up");
  }), t.register("Alt+Down", () => {
    e && e.webContents.send("shortcut-speed-down");
  });
});
o.on("will-quit", () => {
  t.unregisterAll();
});
export {
  f as MAIN_DIST,
  a as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};
