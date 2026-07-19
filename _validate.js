// 数据一致性校验（一次性工具）
const fs = require("fs");
const path = require("path");
const dir = __dirname;
const src = fs.readFileSync(path.join(dir, "data.js"), "utf8");
eval(src.replace('"use strict";', "") + "\n;globalThis.DATA = DATA;");
const DATA = globalThis.DATA;
const errs = [];
// 1. 连接白名单引用的证据存在
for (const c of DATA.CONNECTIONS) {
  if (!DATA.EVIDENCE[c.a]) errs.push("CONN missing a: " + c.a);
  if (!DATA.EVIDENCE[c.b]) errs.push("CONN missing b: " + c.b);
  if (!DATA.REL_STYLE[c.rel]) errs.push("CONN bad rel: " + c.rel);
}
// 2. 档案产出的证据存在
for (const a of DATA.ARCHIVES) {
  if (!DATA.EVIDENCE[a.evidence]) errs.push("ARCH evidence missing: " + a.id + " -> " + a.evidence);
}
// 3. 剧本 claims 引用
const dyn = ["claim_admit"];
for (const r of DATA.SCRIPT) {
  for (const c of (r.claims || [])) {
    if (!DATA.EVIDENCE[c.id] && !dyn.includes(c.id)) errs.push("SCRIPT claim missing: " + r.id + " -> " + c.id);
  }
  for (const f of (r.needAll || []).concat(r.needNone || [])) {
    if (typeof f !== "string") errs.push("SCRIPT bad flag in " + r.id);
  }
}
// 4. 规则 id 唯一
const ids = new Set();
for (const r of DATA.SCRIPT) { if (ids.has(r.id)) errs.push("dup rule: " + r.id); ids.add(r.id); }
// 5. 时间线
const T = DATA.TIMELINE;
for (const c of T.cards) {
  if (c.slot < 0 || c.slot >= T.slots.length) errs.push("TL slot OOB: " + c.id);
}
const keyCards = T.cards.filter(c => c.key);
if (keyCards.length !== 4) errs.push("TL key cards != 4");
// 6. 幕次目标引用的档案存在
if (!DATA.ARCHIVES.find(a => a.id === "doc_will")) errs.push("doc_will missing");
if (!DATA.ARCHIVES.find(a => a.id === "doc_med")) errs.push("doc_med missing");
// 7. 结局齐全
for (const k of ["A","A_promise","B","B_reg","C","D","E","F","T"]) {
  if (!DATA.ENDINGS[k]) errs.push("ENDING missing: " + k);
}
// 8. HTML id 交叉校验
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const js = fs.readFileSync(path.join(dir, "game.js"), "utf8");
const usedIds = new Set([...js.matchAll(/\$\("#([A-Za-z0-9_]+)"\)/g)].map(m => m[1]));
for (const id of usedIds) {
  if (!html.includes(`id="${id}"`) && !["btnReplay","btnCheckTl","mClear"].includes(id)) {
    errs.push("HTML missing id: #" + id);
  }
}
// 9. data-close 目标存在
for (const m of html.matchAll(/data-close="([A-Za-z0-9_]+)"/g)) {
  if (!html.includes(`id="${m[1]}"`)) errs.push("data-close target missing: " + m[1]);
}
if (errs.length) { console.log("FAIL\n" + errs.join("\n")); process.exit(1); }
console.log("ALL CONSISTENCY CHECKS PASSED");
console.log("archives:", DATA.ARCHIVES.length, "| evidence:", Object.keys(DATA.EVIDENCE).length,
  "| rules:", DATA.SCRIPT.length, "| connections:", DATA.CONNECTIONS.length, "| endings:", Object.keys(DATA.ENDINGS).length);
