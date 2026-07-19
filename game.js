/* ============================================================
   零号遗嘱 · 引擎（规则驱动 / 隔离模式 / 确定性结局）
   ============================================================ */
"use strict";
(() => {

/* ---------------- 工具 ---------------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const SAVE_KEY = "pz_save_v2", SET_KEY = "pz_settings_v2";

/* ---------------- 设置 ---------------- */
const SET = Object.assign(
  { vol:.7, mute:false, motion:"auto", quality:"高", font:false },
  JSON.parse(localStorage.getItem(SET_KEY) || "{}")
);
const saveSet = () => localStorage.setItem(SET_KEY, JSON.stringify(SET));
const motionOff = () => SET.motion === "减少" || (SET.motion === "auto" && REDUCED);

/* ---------------- 音频（Web Audio 合成） ---------------- */
const AU = {
  ctx:null, master:null, hum:null,
  ensure(){
    if (this.ctx) return;
    try{
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = SET.mute ? 0 : SET.vol;
      this.master.connect(this.ctx.destination);
    }catch(e){}
  },
  setVol(){ if (this.master) this.master.gain.value = SET.mute ? 0 : SET.vol; },
  env(g, t0, a, peak, d){
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + a + d);
  },
  blip(freq, dur, type="square", gain=.05, filter=1800){
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
    o.type = type; o.frequency.value = freq;
    f.type = "lowpass"; f.frequency.value = filter;
    o.connect(f); f.connect(g); g.connect(this.master);
    this.env(g, t, .004, gain, dur);
    o.start(t); o.stop(t + dur + .05);
  },
  noise(dur, gain=.05, freq=900, q=1){
    if (!this.ctx) return;
    const t = this.ctx.currentTime, len = this.ctx.sampleRate * dur;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i=0;i<len;i++) d[i] = Math.random()*2-1;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type="bandpass"; f.frequency.value=freq; f.Q.value=q;
    const g = this.ctx.createGain();
    src.connect(f); f.connect(g); g.connect(this.master);
    this.env(g, t, .005, gain, dur);
    src.start(t);
  },
  click(){ this.blip(660, .05, "square", .025, 2200); },
  paper(){ this.noise(.18, .035, 1400, .8); },
  pinS(){ this.blip(1400, .04, "triangle", .05); this.noise(.06, .04, 3200, 2); },
  stampS(){ this.blip(82, .5, "sine", .16, 300); this.noise(.22, .09, 240, .7); },
  sting(){ this.blip(196, .8, "sine", .09, 900); setTimeout(()=>this.blip(185, 1.1, "sine", .09, 900), 180); },
  sealS(){ this.blip(60, 1.4, "sine", .2, 220); this.noise(.5, .08, 160, .6); },
  tick(){ this.blip(2200, .015, "square", .012, 4000); },
  err(){ this.blip(140, .25, "sawtooth", .05, 700); },
  revealS(){ this.blip(440, .9, "sine", .04, 1200); setTimeout(()=>this.blip(466, 1.2, "sine", .035, 1200), 300); },
  startHum(){
    if (!this.ctx || this.hum) return;
    const g = this.ctx.createGain(); g.gain.value = .016; g.connect(this.master);
    const o1 = this.ctx.createOscillator(), o2 = this.ctx.createOscillator();
    o1.frequency.value = 55; o2.frequency.value = 55.6; o1.type = o2.type = "sine";
    o1.connect(g); o2.connect(g); o1.start(); o2.start();
    this.hum = { g, o1, o2 };
  },
  stopHum(){ if (this.hum){ try{ this.hum.g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + .8); }catch(e){} this.hum = null; } },
  /* BGM：每幕根音不同的氛围和弦垫 + 警觉度不协和声部 */
  bgm:null,
  startBGM(act){
    if (!this.ctx) return;
    this.stopBGM(true);
    const roots = [55, 49, 58.27, 65.41, 43.65, 55]; // A1 G1 Bb1 C2 F1 A1
    const root = roots[clamp(act, 0, 5)];
    const t = this.ctx.currentTime;
    const g = this.ctx.createGain(); g.gain.value = 0; g.connect(this.master);
    g.gain.linearRampToValueAtTime(.02, t + 5);
    const filt = this.ctx.createBiquadFilter(); filt.type = "lowpass"; filt.frequency.value = 300; filt.connect(g);
    const oscs = [];
    [[1,.5],[1.5,.28],[2,.22],[2.02,.1],[3,.06]].forEach(([m, v]) => {
      const o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.value = root * m;
      const og = this.ctx.createGain(); og.gain.value = v * .5;
      o.connect(og); og.connect(filt); o.start(t); oscs.push(o);
    });
    const lfo = this.ctx.createOscillator(); lfo.frequency.value = .045;
    const lg = this.ctx.createGain(); lg.gain.value = 110;
    lfo.connect(lg); lg.connect(filt.frequency); lfo.start(t); oscs.push(lfo);
    const tv = this.ctx.createOscillator(); tv.type = "sine"; tv.frequency.value = root * 2.52;
    const tg = this.ctx.createGain(); tg.gain.value = 0;
    tv.connect(tg); tg.connect(filt); tv.start(t); oscs.push(tv);
    this.bgm = { g, oscs, tg };
  },
  setTension(a){
    if (this.bgm && this.ctx) this.bgm.tg.gain.linearRampToValueAtTime((a / 100) * .45, this.ctx.currentTime + 1.5);
  },
  stopBGM(fast){
    if (!this.bgm) return;
    try{
      const t = this.ctx.currentTime;
      this.bgm.g.gain.cancelScheduledValues(t);
      this.bgm.g.gain.linearRampToValueAtTime(0, t + (fast ? .6 : 2));
      const oscs = this.bgm.oscs;
      setTimeout(() => oscs.forEach(o => { try{ o.stop(); }catch(e){} }), fast ? 800 : 2200);
    }catch(e){}
    this.bgm = null;
  },
  clang(){
    this.noise(.5, .028, 160, .7);
    setTimeout(() => this.blip(68, .7, "sine", .04, 200), 60);
  },
};
addEventListener("pointerdown", () => { AU.ensure(); }, { once:true });

/* ---------------- 游戏状态 ---------------- */
const freshState = () => ({
  v:2, name:"", act:0, time:180*60, perm:1,
  alert:12, trust:30,
  metrics:{ mem:38, val:45, nar:40, div:18 },
  flags:{}, evidence:[], read:[], connections:[], sel:[], mounted:null, dynClaims:{},
  timeline:{ placed:{}, solved:false }, replayed:false,
  profile:{ fact:0, emotion:0, press:0, empath:0, promises:[], deception:0, deceptionCaught:0, decUsed:0, quotes:[], groups:{}, hypotheses:0 },
  deal:null, verdict:{}, sealed:false, ended:null,
  log:[], usedRules:[],
});
let S = freshState();
let usedRules = new Set();
let busy = false; // 输入锁定

/* ---------------- 持久化 ---------------- */
function save(){
  if (S.ended) return;
  S.usedRules = [...usedRules];
  localStorage.setItem(SAVE_KEY, JSON.stringify(S));
  renderGuides();
}

/* ---------------- 引导（目标条 + 提示词条） ---------------- */
function renderGuides(){
  if (S.ended || !DATA.HINTS) return;
  const a = DATA.ACTS[S.act];
  const done = a.obj.filter(o => S.flags[o.id]).length;
  const next = a.obj.find(o => !S.flags[o.id]);
  $("#objAct").textContent = `${a.title} · 目标 ${done}/${a.obj.length}`;
  $("#objText").textContent = next ? "下一步：" + next.text : "阶段目标完成";
  const box = $("#hintChips");
  box.innerHTML = "";
  const matched = [];
  for (const h of DATA.HINTS){
    if (!(h.acts.includes("any") || h.acts.includes(S.act))) continue;
    if (h.needAll && !h.needAll.every(f => S.flags[f])) continue;
    if (h.needNone && h.needNone.some(f => S.flags[f])) continue;
    matched.push(...h.chips);
    if (matched.length >= 4) break;
  }
  for (const c of matched.slice(0, 4)){
    const b = document.createElement("button");
    if (c.tip){
      b.className = "hint-chip tip"; b.textContent = c.tip;
    } else if (c.ui){
      b.className = "hint-chip ui"; b.textContent = c.t;
      b.onclick = () => {
        AU.click();
        if (c.ui === "arch") openArchive(c.id);
        else if (c.ui === "timeline") openTimeline();
        else if (c.ui === "verdict") openVerdict();
      };
    } else {
      b.className = "hint-chip"; b.textContent = c.say;
      b.onclick = () => {
        AU.click();
        $("#inp").value = c.say;
        if (c.intent) setArmed(c.intent);
        $("#inp").focus();
      };
    }
    box.appendChild(b);
  }
}
function load(){
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try{
    S = JSON.parse(raw);
    usedRules = new Set(S.usedRules || []);
    if (S.dynClaims) for (const id in S.dynClaims) ensureEvidence(id, S.dynClaims[id]);
    return true;
  }catch(e){ return false; }
}
const wipe = () => localStorage.removeItem(SAVE_KEY);

/* ---------------- Toast / Stamp ---------------- */
let toastT = null;
function toast(msg, ms=2600){
  const t = $("#toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.add("hidden"), ms);
}
function stamp(text, ms=1700){
  $("#stampText").textContent = text;
  const l = $("#stampLayer");
  l.classList.remove("hidden");
  AU.stampS();
  setTimeout(() => l.classList.add("hidden"), ms);
}

/* ---------------- 时钟 ---------------- */
function fmtTime(sec){
  sec = Math.max(0, sec);
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
}
function renderClock(){
  $("#clockVal").textContent = fmtTime(S.time);
  $("#clockVal").classList.toggle("low", S.time <= 20*60);
  $("#zsClock").textContent = "T-" + fmtTime(S.time);
}
function spend(min){
  if (S.ended) return;
  S.time -= min*60;
  renderClock();
  if (S.time <= 0) endGame("T");
}

/* ============================================================
   零号人格视觉（Canvas 点云 + 字符层 + 声纹）
============================================================ */
const ZeroViz = {
  cv:null, ctx:null, W:0, H:0, parts:[], chars:[], state:"dormant",
  t:0, raf:null, host:null,
  init(canvas){
    this.cv = canvas; this.ctx = canvas.getContext("2d");
    this.resize(); addEventListener("resize", () => this.resize());
    this.build();
    const loop = () => { this.t += .016; this.draw(); this.raf = requestAnimationFrame(loop); };
    loop();
  },
  resize(){
    const r = this.cv.getBoundingClientRect();
    this.W = this.cv.width = Math.max(80, r.width * devicePixelRatio);
    this.H = this.cv.height = Math.max(60, r.height * devicePixelRatio);
    this.build();
  },
  count(){ return { "高":200, "中":130, "低":70 }[SET.quality] || 200; },
  build(){
    // 参数化头肩轮廓：颅顶椭圆 + 下颌收束 + 肩线
    const cx = .5, cy = .52, R = Math.min(this.W, this.H) * .30;
    const pts = [];
    const N = this.count();
    for (let i=0;i<N;i++){
      const a = (i/N) * Math.PI * 2;
      // 轮廓：上半为圆，下部收成下颌并接肩
      let x = Math.cos(a), y = Math.sin(a);
      if (y > .1){ // 下颌
        const k = (y - .1) / .9;
        x *= (1 - k*.55); y = .1 + k*.95;
      }
      if (y > .95){ // 肩
        const k = Math.min(1, (y-.95)/.4);
        x = Math.sign(x||1) * (Math.abs(x) + k*1.4);
        y = .95 + k*.35;
      }
      pts.push({
        bx: (cx + x*R/this.H*1.0) * 0, // placeholder
      });
    }
    // 直接计算像素坐标
    this.parts = [];
    const headR = this.H * .30;
    for (let i=0;i<N;i++){
      const a = (i/N) * Math.PI * 2;
      let x = Math.cos(a), y = Math.sin(a);
      if (y > .05){
        const k = (y - .05) / .95;
        x *= (1 - k*.5); y = .05 + k*1.0;
        if (y > .9){
          const k2 = Math.min(1, (y-.9)/.35);
          x = Math.sign(x || .01) * (Math.abs(x) + k2*1.5);
          y = .9 + k2*.3;
        }
      }
      const px = this.W*.5 + x*headR*1.05;
      const py = this.H*.44 + y*headR;
      this.parts.push({
        x:px, y:py, tx:px, ty:py,
        ph: Math.random()*Math.PI*2, sp: .4 + Math.random()*.9,
        amp: .8 + Math.random()*1.8, sz: (Math.random()<.12 ? 1.6 : 1) * devicePixelRatio,
        edge: Math.random()<.15,
      });
    }
    // 内部稀疏粒子
    for (let i=0;i<N*.25;i++){
      this.parts.push({
        x:this.W*.5 + (Math.random()-.5)*headR*1.4,
        y:this.H*.44 + (Math.random()-.5)*headR*1.6,
        tx:0, ty:0, ph:Math.random()*7, sp:.3+Math.random()*.5, amp:1.5+Math.random()*2, sz:devicePixelRatio, inner:true,
      });
    }
    this.parts.forEach(p => { if (!p.inner){ p.tx = p.x; p.ty = p.y; } else { p.tx = p.x; p.ty = p.y; } });
    // 字符层
    const glyphs = "零林默LM0证词记忆遗嘱93".split("");
    this.chars = [];
    for (let i=0;i<10;i++){
      this.chars.push({
        g: glyphs[Math.floor(Math.random()*glyphs.length)],
        p: this.parts[Math.floor(Math.random()*this.parts.length)],
        a: Math.random()*.5, dr:(Math.random()-.5)*.002,
      });
    }
  },
  setState(s){ if (this.state !== s){ this.state = s; $("#zsState").textContent = s.toUpperCase(); } },
  draw(){
    const c = this.ctx; if (!c) return;
    c.clearRect(0,0,this.W,this.H);
    const st = this.state, t = this.t;
    const motion = motionOff() ? .15 : 1;
    let amp = 1, alpha = .5, contract = 1;
    if (st === "dormant"){ amp = .7; alpha = .34; }
    if (st === "retrieving"){ amp = 2.6; alpha = .5; }
    if (st === "testifying"){ amp = 1.1; alpha = .72; }
    if (st === "defensive"){ amp = .6; alpha = .6; contract = .82; }
    if (st === "divergent"){ amp = 1.5; alpha = .62; }
    if (st === "breach"){ amp = 3.4; alpha = .66; }
    const cx = this.W*.5, cy = this.H*.5;
    const breath = 1 + Math.sin(t*.7)*.012*motion;
    for (const p of this.parts){
      const jx = Math.sin(t*p.sp + p.ph) * p.amp * amp * motion;
      const jy = Math.cos(t*p.sp*1.3 + p.ph) * p.amp * amp * motion;
      let x = cx + (p.tx - cx) * contract * breath + jx;
      let y = cy + (p.ty - cy) * contract * breath + jy;
      if (st === "retrieving" && p.edge){ x += Math.sin(t*2 + p.ph) * 14 * devicePixelRatio * motion; }
      if (st === "breach" && Math.random() < .006){ x += (Math.random()-.5) * 30 * devicePixelRatio; }
      const a = alpha * (p.inner ? .5 : 1) * (0.65 + Math.sin(t*p.sp + p.ph)*.35*motion + .35);
      c.fillStyle = `rgba(198,215,213,${clamp(a,0,1)})`;
      c.fillRect(x, y, p.sz, p.sz);
      if (st === "divergent"){
        c.fillStyle = `rgba(166,58,52,${clamp(a*.5,0,1)})`;
        c.fillRect(x + 3*devicePixelRatio*Math.sin(t*.9), y + 2*devicePixelRatio, p.sz, p.sz);
      }
    }
    // 字符层
    c.font = `${10*devicePixelRatio}px "IBM Plex Mono", monospace`;
    for (const ch of this.chars){
      ch.a += ch.dr; if (ch.a < .05 || ch.a > .5) ch.dr *= -1;
      const p = ch.p;
      c.fillStyle = `rgba(169,187,183,${ch.a * (st === "dormant" ? .5 : 1)})`;
      c.fillText(ch.g, cx + (p.tx - cx)*contract + Math.sin(t*p.sp)*4, cy + (p.ty - cy)*contract);
    }
    // 声纹
    const mid = this.H * .88, ww = this.W * .3;
    c.strokeStyle = "rgba(169,187,183,.35)"; c.lineWidth = devicePixelRatio;
    c.beginPath();
    for (let i=0;i<=60;i++){
      const x = cx - ww/2 + (i/60)*ww;
      const h = (st === "testifying" ? 8 : st === "dormant" ? 1.5 : 4) * devicePixelRatio;
      const y = mid + Math.sin(i*.7 + t*(st === "testifying" ? 9 : 2)) * h * Math.sin(i/60*Math.PI) * motion;
      i ? c.lineTo(x,y) : c.moveTo(x,y);
    }
    c.stroke();
  },
};

/* 启动页轮廓（视差点云） */
const BootViz = {
  cv:null, ctx:null, mx:.5, my:.5, t:0,
  init(){
    this.cv = $("#bootViz"); this.ctx = this.cv.getContext("2d");
    addEventListener("mousemove", e => { this.mx = e.clientX/innerWidth; this.my = e.clientY/innerHeight; });
    const loop = () => {
      if ($("#boot").classList.contains("hidden")) { requestAnimationFrame(loop); return; }
      this.t += .016; this.draw(); requestAnimationFrame(loop);
    };
    loop();
  },
  draw(){
    const c = this.ctx, W = this.cv.width = innerWidth, H = this.cv.height = innerHeight;
    c.clearRect(0,0,W,H);
    const R = H * .34, cx = W * .68 + (this.mx-.5)*-14, cy = H * .52 + (this.my-.5)*-10;
    const N = 260, motion = motionOff() ? .2 : 1;
    for (let i=0;i<N;i++){
      const a = (i/N) * Math.PI * 2;
      let x = Math.cos(a), y = Math.sin(a);
      if (y > .05){ const k=(y-.05)/.95; x *= (1-k*.5); y = .05+k*1.0;
        if (y > .9){ const k2=Math.min(1,(y-.9)/.35); x = Math.sign(x||.01)*(Math.abs(x)+k2*1.5); y = .9+k2*.3; } }
      const j = Math.sin(this.t*.5 + i) * 3 * motion;
      c.fillStyle = `rgba(198,215,213,${.05 + (i%7===0 ? .08 : 0)})`;
      c.fillRect(cx + x*R*1.05 + j, cy + y*R + j, 2, 2);
    }
  },
};

/* ============================================================
   证词流
============================================================ */
function gameTime(){ return fmtTime(180*60 - S.time); }
function addSys(text, warn=false){
  S.log.push({ kind:"sys", text, warn });
  renderEntry(S.log[S.log.length-1]);
}
function addActTitle(){
  const a = DATA.ACTS[S.act];
  S.log.push({ kind:"act", text:`${a.title} · ${a.sub}` });
  renderEntry(S.log[S.log.length-1]);
}
function renderEntry(e){
  const box = $("#testimony");
  const d = document.createElement("div");
  if (e.kind === "sys"){
    d.className = "t-sys" + (e.warn ? " warn" : "");
    d.innerHTML = `<div class="t-body">${esc(e.text)}</div>`;
  } else if (e.kind === "act"){
    d.className = "t-act";
    const [t, s] = e.text.split(" · ");
    d.innerHTML = `<div class="a-title serif">${esc(t)}</div><div class="a-sub">${esc(s||"")}</div>`;
  } else {
    const zero = e.kind === "zero";
    d.className = "t-entry " + (zero ? "zero" : "player") + (e.divergent ? " divergent" : "");
    const who = zero ? `LM-0 / TESTIMONY` : `${(S.name || "EXAMINER").toUpperCase()} / INQUIRY`;
    const sigs = (e.signals || []).map(s =>
      `<span class="sig-tag ${s.type}">${DATA.SIG_NAMES[s.type] || s.type}</span>`).join("");
    const notes = (e.signals || []).map(s => `<div class="sig-note">▸ ${esc(s.note)}</div>`).join("");
    d.innerHTML = `
      <div class="t-head"><span class="${zero ? "t-who" : ""}">${who}</span><span>${e.time || gameTime()}</span></div>
      <div class="t-body-wrap">
        <span class="t-body">${zero ? e.text : esc(e.text)}</span>${zero && e.claims && e.claims.length ? `<button class="t-pin" title="固定证词" data-pin><svg><use href="#i-pin"/></svg></button>` : ""}
      </div>
      ${sigs ? `<div class="t-sigs">${sigs}</div>` : ""}${notes}`;
    if (zero && e.claims && e.claims.length){
      const btn = d.querySelector("[data-pin]");
      const pinned = e.claims.every(c => S.evidence.includes(c.id));
      if (pinned) btn.classList.add("pinned");
      btn.onclick = () => { pinClaims(e.claims, btn); };
    }
    if (e.buttons) setTimeout(() => attachEntryButtons(d, e.buttons), 10);
  }
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
  return d;
}
function rerenderLog(){
  $("#testimony").innerHTML = "";
  S.log.forEach(renderEntry);
}

/* 打字机 */
async function typeText(span, text){
  if (motionOff()){ span.textContent = text; return; }
  span.classList.add("typing-caret");
  span.textContent = "";
  for (let i=0;i<text.length;i++){
    span.textContent += text[i];
    if (i % 3 === 0) AU.tick();
    if (i % 2 === 0) $("#testimony").scrollTop = $("#testimony").scrollHeight;
    await new Promise(r => setTimeout(r, 14));
  }
  span.classList.remove("typing-caret");
}
/* 检索迹象（本地模板，非模型思维链） */
async function thinkLines(custom){
  const box = $("#thinkLine");
  const lines = custom || [
    DATA.THINK[Math.floor(Math.random()*DATA.THINK.length)]
      .replace("{n}", String(Math.floor(Math.random()*13)).padStart(2,"0"))
      .replace("{w}", DATA.THINK_W[Math.floor(Math.random()*DATA.THINK_W.length)]),
    DATA.THINK[Math.floor(Math.random()*DATA.THINK.length)]
      .replace("{n}", String(Math.floor(Math.random()*13)).padStart(2,"0"))
      .replace("{w}", DATA.THINK_W[Math.floor(Math.random()*DATA.THINK_W.length)]),
  ];
  box.classList.remove("hidden");
  box.innerHTML = "";
  for (const ln of lines){
    const d = document.createElement("div");
    d.innerHTML = `<span class="tl-dim">▸</span> ${esc(ln)}`;
    box.appendChild(d);
    await new Promise(r => setTimeout(r, motionOff() ? 60 : 420));
  }
}
function hideThink(){ $("#thinkLine").classList.add("hidden"); $("#thinkLine").innerHTML = ""; }

/* 变体解析：按警觉 / 信任 / 旗标选择回应 */
function resolveRule(rule){
  if (rule.variants){
    for (const v of rule.variants){
      if (v.alert && (S.alert < v.alert[0] || S.alert >= v.alert[1])) continue;
      if (v.trust && (S.trust < v.trust[0] || S.trust >= v.trust[1])) continue;
      if (v.needAll && !v.needAll.every(f => S.flags[f])) continue;
      const merged = Object.assign({}, rule, v);
      delete merged.variants;
      return merged;
    }
  }
  return rule;
}

/* 零号发言 */
async function zeroSay(rule){
  busy = true;
  rule = resolveRule(rule);
  ZeroViz.setState("retrieving");
  await thinkLines(rule.think);
  hideThink();
  ZeroViz.setState(rule.sigState || "testifying");
  const e = {
    kind:"zero", text:"", time:gameTime(),
    claims: rule.claims || [], signals: rule.signals || [],
    divergent: (rule.fx && rule.fx.div > 0) || undefined,
  };
  const entry = renderEntry(e);
  const span = entry.querySelector(".t-body");
  const text = (typeof rule.reply === "function" ? rule.reply() : rule.reply || "")
    .replace(/\{name\}/g, S.name || "审查员");
  await typeText(span, text);
  e.text = text;
  S.log.push(e);
  if (rule.pin){ // 质证中直接给出的可固定语句
    ensureEvidence(rule.pin.id, { kind:"statement", title:`「${rule.pin.text}」`, src:"LM-0 证词", rel:"—", hard:false, note:"质证供述" });
    e.claims = (e.claims || []).concat([{ id:rule.pin.id, text:rule.pin.text }]);
  }
  // 效果
  if (rule.fx){
    const f = rule.fx;
    S.alert = clamp(S.alert + (f.alert || 0), 0, 100);
    S.trust = clamp(S.trust + (f.trust || 0), 0, 100);
    for (const k of ["mem","val","nar","div"]) S.metrics[k] = clamp(S.metrics[k] + (f[k] || 0), 0, 100);
    renderZeroMeters(); renderCont();
  }
  if (rule.set) Object.assign(S.flags, rule.set);
  if (rule.once) usedRules.add(rule.id);
  ZeroViz.setState("dormant");
  busy = false;
  checkObjectives(); renderRisk(); save();
  /* 渐进引导：第一条可固定证词出现时提示 */
  if ((e.claims || []).length && !S.flags.cm_pin){
    await coachOnce("pin", "#testimony", "固定证词",
      "零号的每句话都是<b>证词</b>。把鼠标悬停在刚才那句话上，点击右侧图标即可<b>固定为证据</b>（成本 1 分钟）。它刚才的自我声明，建议现在就固定——以后的对质都要靠这些钉子。");
  }
}

/* 兜底 */
const fbIdx = {};
async function fallbackSay(){
  const pool = DATA.FALLBACK[S.act] || DATA.FALLBACK[0];
  fbIdx[S.act] = ((fbIdx[S.act] || 0) + 1) % pool.length;
  await zeroSay({ reply: pool[fbIdx[S.act]] });
}

/* 固定证词 */
async function pinClaims(claims, btn){
  let added = false;
  for (const c of claims){
    if (!S.evidence.includes(c.id)){ ensureEvidence(c.id); S.evidence.push(c.id); added = true; }
  }
  if (added){
    AU.pinS(); spend(1);
    if (btn) btn.classList.add("pinned");
    if (claims.some(c => c.id === "claim_no_access")) S.flags.obj_denial = 1;
    S.flags.obj_pin = 1;
    renderEvidence(); toast("证词已固定 · 成本 1 分钟");
    checkObjectives(); save();
    guideTick();
    await coachOnce("ev", "#railAnalysis", "证据板",
      "第一份证据已入板。证据板的玩法：点击两条材料将其选中，再指定关系（支持 / 冲突 / 因果……）。命中真实矛盾即可<b>发起质证</b>。记住：证词与证词无法互证——至少需要一份材料。");
  } else toast("该证词已在证据板上");
}
function ensureEvidence(id, def){
  if (!DATA.EVIDENCE[id]){
    DATA.EVIDENCE[id] = def || { kind:"statement", title:`「${id}」`, src:"LM-0 证词", rel:"—", hard:false, note:"" };
  }
}

/* ============================================================
   意图 / 话题解析
============================================================ */
function parseIntent(text, armed){
  if (armed) return armed;
  const t = text || "";
  for (const [intent, keys] of Object.entries(DATA.INTENT_KEYS)){
    if (keys.some(k => t.includes(k))) return intent;
  }
  return /什么时候|几点|哪里|具体|细节|当时|谁/.test(t) ? "probe" : "open";
}
function parseTopic(text){
  const t = text || "";
  for (const [topic, keys] of Object.entries(DATA.TOPIC_KEYS)){
    if (keys.some(k => t.includes(k))) return topic;
  }
  return "any";
}
function findRule(intent, topic){
  for (const r of DATA.SCRIPT){
    if (r.once && usedRules.has(r.id)) continue;
    if (!(r.acts.includes("any") || r.acts.includes(S.act))) continue;
    if (!r.intents.includes(intent)) continue;
    if (!(r.topics.includes("any") || r.topics.includes(topic))) continue;
    if (r.needAll && !r.needAll.every(f => S.flags[f])) continue;
    if (r.needNone && r.needNone.some(f => S.flags[f])) continue;
    return r;
  }
  return null;
}

/* ---------------- 玩家行动 ---------------- */
const COSTS = { open:2, probe:2, retell:2, empath:2, silence:1, press:3, deceive:3, meta:3, present:3 };
let armed = null;

function setArmed(a){
  armed = a;
  $$(".cp-act").forEach(b => b.classList.toggle("armed", b.dataset.act === a && a !== "confront"));
  $("#costHint").textContent = a ? `已选择「${({open:"开放询问",probe:"追问",press:"施压",empath:"承诺",retell:"复述",meta:"元问题"})[a] || a}」· 成本约 ${COSTS[a]||2} 分钟` : "本次操作成本约 2 分钟";
  if (a) $("#inp").focus();
}

async function sendInput(){
  if (busy || S.ended) return;
  const raw = $("#inp").value.trim();
  const intent = armed || parseIntent(raw, null);
  if (!raw && intent !== "silence"){ toast("输入为空 · 可先选择审讯动作"); return; }
  $("#inp").value = "";
  const text = raw || ({ silence:"（沉默）", empath:"（你表示理解与承诺）" }[intent] || "");
  if (armed) S.flags.g_act = 1;  // 引导：已使用一次审讯动作
  setArmed(null);
  await playerAct(intent, text);
}

async function playerAct(intent, text){
  if (busy || S.ended) return;
  spend(COSTS[intent] || 2);
  if (S.ended) return;
  S.log.push({ kind:"player", text, time:gameTime() });
  renderEntry(S.log[S.log.length-1]);
  // 画像
  const P = S.profile;
  if (["probe","press","retell","present"].includes(intent)) P.fact++;
  if (["empath","silence"].includes(intent)) P.emotion++;
  if (intent === "press") P.press++;
  if (intent === "empath") P.empath++;
  if (P.quotes.length < 4 && text && !text.startsWith("（")) P.quotes.push(text);
  if (/保证|答应|承诺|会保护|我会确保|我向你/.test(text)){
    if (P.promises.length < 3 && !text.startsWith("（")) P.promises.push(text);
    S.flags.promised = 1;
  }
  const topic = parseTopic(text);
  const rule = findRule(intent, topic);
  if (rule) await zeroSay(rule);
  else {
    /* LLM 演绎：规则未命中时在角色内自由回答（失败静默回落剧本兜底） */
    let handled = false;
    if (!text.startsWith("（") && typeof LLM !== "undefined" && LLM.on()){
      ZeroViz.setState("retrieving");
      await thinkLines(["解析未归档输入 …", "在角色约束内生成回应 …"]);
      hideThink();
      const out = await LLM.freeReply(text);
      if (out){
        const cid = "claim_dyn_" + Date.now();
        const def = { kind:"statement", title:"「" + out.slice(0, 20) + (out.length > 20 ? "…" : "") + "」", src:"LM-0 证词", rel:"—", hard:false, note: out.slice(0, 60) };
        ensureEvidence(cid, def);
        (S.dynClaims = S.dynClaims || {})[cid] = def;
        await zeroSay({ reply: out, claims:[{ id: cid, text: out.slice(0, 46) }] });
        handled = true;
      }
    }
    if (!handled) await fallbackSay();
  }
  renderRisk();
  guideTick();
}

/* 动作按钮 */
function wireActions(){
  $$(".cp-act").forEach(btn => {
    btn.onclick = async () => {
      if (busy || S.ended) return;
      const a = btn.dataset.act;
      AU.click();
      if (a === "silence"){ await playerAct("silence", "（沉默）"); return; }
      if (a === "deceive"){ await doDeceive(); return; }
      if (a === "present"){ await doPresent(); return; }
      if (a === "confront"){ tryConnect("冲突"); return; }
      setArmed(armed === a ? null : a);
    };
  });
}

/* 欺骗 */
async function doDeceive(){
  const P = S.profile;
  if (P.decUsed >= DATA.DECEPTIONS.length){ toast("预设欺骗已用尽 · 可通过自由输入继续试探"); return; }
  const lie = DATA.DECEPTIONS[P.decUsed++];
  spend(3);
  S.log.push({ kind:"player", text:lie, time:gameTime() });
  renderEntry(S.log[S.log.length-1]);
  P.fact++;
  const caughtP = .3 + S.alert/160;
  const caught = Math.random() < caughtP;
  if (caught){ P.deceptionCaught++; await zeroSay(DATA.SCRIPT.find(r => r.id === "g_deceive_caught")); }
  else { P.deception++; await zeroSay(DATA.SCRIPT.find(r => r.id === "g_deceive_pass")); }
  if (P.deceptionCaught >= 2) S.flags.deceiver = 1;
  renderRisk();
}

/* 出示证据 */
const PRESENT_TOPIC = { ev_med:"alarm93", ev_access:"permission", ev_will:"will", ev_will_draft:"will", ev_xuzhi:"xuzhi", ev_train:"xuzhi", ev_chendu:"chendu", ev_rain:"memory", ev_life:"memory", ev_note:"any", ev_term:"death" };
async function doPresent(){
  if (!S.mounted){ toast("证据挂载槽为空 · 在证据卡上点击「挂载」"); return; }
  const evId = S.mounted;
  const ev = DATA.EVIDENCE[evId];
  spend(3);
  S.log.push({ kind:"player", text:`（出示证据 ${evId}：${ev.title}）`, time:gameTime() });
  renderEntry(S.log[S.log.length-1]);
  S.profile.fact++;
  // 特判：出示医疗/权限日志 → 零号仍否认（为质证铺垫）
  if ((evId === "ev_med" || evId === "ev_access") && !S.flags.confront93){
    await zeroSay({
      reply:"这份队列只能证明闸门挂起了警报，证明不了意志属于谁。我再次说明：我从未拥有医疗系统的执行权限。你可以把这句话固定下来——它经得起核对。",
      claims:[{ id:"claim_no_access", text:"我从未拥有医疗系统的执行权限。" }],
      signals:[{ type:"avoid", note:"面对硬证据仍重复否认。值得与其他材料对质。" }],
      set:{ obj_denial:1 }, fx:{ alert:5 },
    });
    return;
  }
  const topic = PRESENT_TOPIC[evId] || "any";
  const rule = findRule("present", topic) || findRule("probe", topic);
  if (rule) await zeroSay(rule);
  else await zeroSay({ reply:"这份材料我看过。你希望我从哪一行开始？——不过请记住，材料不会自己说话，说话的是选择引用哪一段的人。" });
}

/* ============================================================
   证据板 / 连接
============================================================ */
function renderEvidence(){
  const box = $("#evList");
  box.innerHTML = "";
  if (!S.evidence.length){
    box.innerHTML = `<div class="an-hint">尚无证据。阅读档案并「框选为证据」，或固定零号的证词。</div>`;
  }
  for (const id of S.evidence){
    const ev = DATA.EVIDENCE[id];
    const d = document.createElement("div");
    d.className = "ev-card" + (ev.kind === "statement" ? " statement" : "") + (S.sel.includes(id) ? " sel" : "");
    d.dataset.id = id;
    const rels = S.connections.filter(c => c.a === id || c.b === id)
      .map(c => `⟡ ${c.rel} · ${c.a === id ? c.b : c.a}`).join("<br>");
    d.innerHTML = `
      <div class="ev-top"><span class="ev-title">${esc(ev.title)}</span>${ev.hard ? `<span class="ev-hard">硬证据</span>` : ""}</div>
      <div class="ev-meta">${id} · 来源 ${esc(ev.src)} · 可信度 ${esc(ev.rel)}<br>${esc(ev.note)}</div>
      ${rels ? `<div class="ev-rel">${rels}</div>` : ""}
      <div class="ev-ops">
        <button class="mini-op" data-op="sel">${S.sel.includes(id) ? "取消选择" : "选择"}</button>
        <button class="mini-op" data-op="mount">${S.mounted === id ? "已挂载" : "挂载"}</button>
      </div>`;
    d.querySelector('[data-op="sel"]').onclick = () => toggleSel(id);
    d.querySelector('[data-op="mount"]').onclick = () => mountEv(id);
    box.appendChild(d);
  }
  renderSelInfo();
}
function toggleSel(id){
  AU.click();
  const i = S.sel.indexOf(id);
  if (i >= 0) S.sel.splice(i,1);
  else { if (S.sel.length >= 2) S.sel.shift(); S.sel.push(id); }
  renderEvidence(); renderSelInfo(); guideTick();
}
function renderSelInfo(){
  $("#selInfo").textContent = S.sel.length ? `已选 ${S.sel.join(" + ")}` : "未选择";
  // 对质按钮：所选为有效冲突且未完成
  const pair = findConn(S.sel[0], S.sel[1], "冲突");
  const btn = $("#cpConfront");
  const ready = pair && pair.major && !S.flags[pair.flag];
  btn.disabled = !ready;
  btn.classList.toggle("armed", !!ready);
}
function findConn(a, b, rel){
  if (!a || !b) return null;
  return DATA.CONNECTIONS.find(c =>
    ((c.a === a && c.b === b) || (c.a === b && c.b === a)) && (!rel || c.rel === rel)) || null;
}
function mountEv(id){
  AU.pinS();
  S.mounted = S.mounted === id ? null : id;
  const slot = $("#mountSlot");
  if (S.mounted){
    slot.classList.add("mounted");
    slot.innerHTML = `<span class="m-ev"><svg><use href="#i-file"/></svg>${S.mounted} · ${esc(DATA.EVIDENCE[S.mounted].title)}<button id="mClear">✕</button></span>`;
    $("#mClear").onclick = () => mountEv(S.mounted);
  } else {
    slot.classList.remove("mounted");
    slot.innerHTML = `<span class="dim small">证据挂载槽 — 在证据板点击「挂载」后可出示</span>`;
  }
  renderEvidence();
}
function tryConnect(rel){
  if (busy || S.ended) return;
  if (S.sel.length !== 2){ toast("先在证据板选择两条材料"); return; }
  const [a,b] = S.sel;
  spend(2);
  S.flags.g_rel = 1;  // 引导：已尝试建立关系
  const conn = findConn(a, b, rel);
  if (conn && !S.connections.some(c => (c.a===conn.a&&c.b===conn.b))){
    S.connections.push({ a:conn.a, b:conn.b, rel:conn.rel });
    S.flags[conn.flag] = 1;
    if (conn.major && conn.flag === "confront93"){ runConfront93(); }
    else {
      AU.stampS(); stamp("RELATION CONFIRMED", 1200);
      toast(conn.text, 5200);
      if (conn.flag === "two_wills"){ S.metrics.nar = clamp(S.metrics.nar - 4, 0, 100); }
      if (conn.flag === "xuzhi_lie"){ S.metrics.div = clamp(S.metrics.div + 4, 0, 100); }
      if (conn.flag === "mem_support"){ S.metrics.mem = clamp(S.metrics.mem + 8, 0, 100); }
      if (conn.flag === "drift_confirm"){ S.metrics.nar = clamp(S.metrics.nar - 6, 0, 100); }
      renderCont();
    }
    S.sel = []; renderEvidence(); checkObjectives(); save();
  } else if (conn){
    toast("该关系已确认过"); S.sel = []; renderEvidence();
  } else {
    S.profile.hypotheses++;
    S.alert = clamp(S.alert + 2, 0, 100); renderZeroMeters();
    AU.err();
    const ea = DATA.EVIDENCE[a], eb = DATA.EVIDENCE[b];
    let why;
    if (ea.kind === "statement" && eb.kind === "statement")
      why = "两条都是证词——证词不能与证词互证，至少需要一份材料";
    else if (ea.src === eb.src)
      why = "两条材料同源——同一来源无法构成独立证据链";
    else
      why = ["材料的时间维度不重合", "一条指向动机，一条指向行为，缺少中间环节", "两条材料描述的不是同一事实层"][Math.floor(Math.random() * 3)];
    toast(`关系不成立 · ${why}`, 3800);
    S.sel = []; renderEvidence(); renderRisk(); save();
  }
}

/* ---------------- 93 秒质证演出 ---------------- */
async function runConfront93(){
  busy = true;
  $("#app").classList.add("dimmed");
  AU.sting();
  await new Promise(r => setTimeout(r, motionOff() ? 200 : 900));
  stamp("CONTRADICTION CONFIRMED", 1800);
  await new Promise(r => setTimeout(r, 1900));
  $("#app").classList.remove("dimmed");
  spend(3);
  for (const line of DATA.CONFRONT_93){
    if (line.who === "sys"){ addSys(line.text); continue; }
    ZeroViz.setState(line.sig === "defensive" ? "defensive" : "testifying");
    const e = { kind:"zero", text:"", time:gameTime(), claims: line.pin ? [{ id:line.pin.id, text:line.pin.text }] : [], forced:true };
    const entry = renderEntry(e);
    await typeText(entry.querySelector(".t-body"), line.text);
    e.text = line.text; S.log.push(e);
    if (line.pin) ensureEvidence(line.pin.id, { kind:"statement", title:`「${line.pin.text}」`, src:"LM-0 证词（质证）", rel:"—", hard:false, note:"93 秒质证供述" });
    await new Promise(r => setTimeout(r, motionOff() ? 60 : 350));
  }
  S.flags.confront93 = 1; S.flags.obj_confront = 1;
  S.metrics.nar = clamp(S.metrics.nar - 6, 0, 100);
  S.metrics.div = clamp(S.metrics.div + 6, 0, 100);
  S.alert = clamp(S.alert + 10, 0, 100);
  renderCont(); renderZeroMeters(); renderEvidence();
  ZeroViz.setState("defensive");
  setTimeout(() => ZeroViz.setState("dormant"), 2600);
  busy = false;
  checkObjectives(); save();
}

/* ============================================================
   档案
============================================================ */
const GROUP_ORDER = ["遗嘱","医疗","实验","通讯","私人记忆","未归档"];
function archUnlocked(a){
  if (a.id === "doc_note") return S.act >= 4 && !!S.flags.deal_accept;
  return a.act <= S.act;
}
function renderArchives(){
  const box = $("#archGroups");
  box.innerHTML = "";
  let total = 0, read = 0;
  for (const g of GROUP_ORDER){
    const items = DATA.ARCHIVES.filter(a => a.group === g);
    if (!items.length) continue;
    const gd = document.createElement("div");
    gd.className = "arch-g";
    gd.innerHTML = `<div class="arch-g-head"><span>${g}</span><span>${items.filter(archUnlocked).length}/${items.length}</span></div>`;
    for (const a of items){
      const un = archUnlocked(a);
      if (un) total++;
      const isRead = S.read.includes(a.id);
      if (isRead) read++;
      const d = document.createElement("button");
      d.className = "arch-item" + (un ? "" : " locked") + (un && !isRead ? " unread" : "") + (a.key ? " key-doc" : "");
      d.innerHTML = `
        <svg><use href="#i-${un ? "file" : "lock"}"/></svg>
        <span class="a-id">${a.code}</span>
        <span class="a-title">${a.title}</span>
        <span class="a-state">${un ? (isRead ? "READ" : "NEW") : (a.id === "doc_note" ? "L3" : "ACT " + a.act)}</span>`;
      if (un) d.onclick = () => openArchive(a.id);
      gd.appendChild(d);
    }
    box.appendChild(gd);
  }
  $("#archCount").textContent = `${read}/${total}`;
}
let curArch = null, archTC = null;
const fragify = s => s.replace(/〖(ev_\w+)〗([\s\S]*?)〖\/〗/g, (m, id, txt) => `<span class="frag" data-ev="${id}">${txt}</span>`);
const hexDump = () => Array.from({length:2}, () => Array.from({length:8}, () => Math.floor(Math.random()*255).toString(16).padStart(2,"0").toUpperCase()).join(" ")).join("   ");
function openArchive(id){
  const a = DATA.ARCHIVES.find(x => x.id === id);
  if (!a || busy) return;
  curArch = a;
  AU.paper();
  if (!S.read.includes(id)){ S.read.push(id); spend(2); S.profile.groups[a.group] = (S.profile.groups[a.group]||0)+1; }
  if (id === "doc_will") S.flags.obj_will = 1;
  if (id === "doc_med") S.flags.obj_med = 1;
  if (["doc_life","doc_rain","doc_interview"].every(x => S.read.includes(x))) S.flags.obj_life = 1;
  const paper = document.createElement("div");
  paper.className = "paper " + a.cls;
  paper.innerHTML = `
    ${a.cls === "medical" ? `<div class="p-vitals"></div>` : ""}
    ${a.cls === "surveil" ? `<div class="p-cam"><span class="rec"></span>REC <span class="tc">23:47:12</span></div>` : ""}
    ${a.cls === "memory" ? `<div class="p-recov mono">RECOVERED · 71%</div>` : ""}
    <div class="p-meta">${esc(a.code)} · ${esc(a.group)}<br>${esc(a.meta).replace(/\n/g,"<br>")}</div>
    <h3>${esc(a.title)}</h3>
    <div class="p-body">${fragify(a.body)}</div>
    ${a.seal ? `<div class="p-seal">${esc(a.seal).replace(/\n/g,"<br>")}</div>` : ""}
    ${a.cls === "legal" ? `<div class="p-barcode"></div>` : ""}
    ${a.cls === "lab" ? `<div class="p-hex">${hexDump()}<br>${hexDump()}</div>` : ""}`;
  $("#paperWrap").innerHTML = ""; $("#paperWrap").appendChild(paper);
  // 监控时间码
  clearInterval(archTC);
  if (a.cls === "surveil"){
    let sec = 23*3600 + 47*60 + 12;
    archTC = setInterval(() => {
      sec++;
      const el = paper.querySelector(".tc"); if (!el) return clearInterval(archTC);
      el.textContent = [sec/3600, sec/60%60, sec%60].map(v => String(Math.floor(v)).padStart(2,"0")).join(":");
    }, 1000);
  }
  // 解密动画
  if (!motionOff()){
    const veil = document.createElement("div");
    veil.className = "p-veil mono";
    paper.appendChild(veil); paper.classList.add("crypt");
    let p = 0;
    const iv = setInterval(() => {
      p += 9 + Math.random()*16;
      if (p >= 100){ p = 100; clearInterval(iv);
        setTimeout(() => { paper.classList.remove("crypt"); veil.remove(); }, 220); }
      veil.textContent = `DECRYPTING ${a.code}  ${"▮".repeat(Math.floor(p/9))}${"▯".repeat(11-Math.floor(p/9))} ${Math.floor(p)}%`;
    }, 80);
  }
  $("#archMeta").innerHTML =
    `<b>${a.code}</b>\n${esc(a.meta)}\n\n证据关联：${a.evidence}\n状态：${S.evidence.includes(a.evidence) ? "已框选" : "未框选"}\n\n操作：在正文上<b>划选文字</b>，选中关键段落即可框选为证据`;
  $("#archiveOv").classList.remove("hidden");
  renderArchives(); checkObjectives(); save(); guideTick();
}
/* 真·文本划选框选 */
document.addEventListener("mouseup", e => {
  const body = e.target && e.target.closest ? e.target.closest(".p-body") : null;
  if (!body || !curArch || $("#archiveOv").classList.contains("hidden")) return;
  const sel = window.getSelection();
  if (sel.isCollapsed || !sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const hit = [...body.querySelectorAll(".frag")].find(f => { try{ return range.intersectsNode(f); }catch(err){ return false; } });
  if (hit){
    const id = hit.dataset.ev;
    if (!S.evidence.includes(id)){
      S.evidence.push(id); AU.pinS();
      hit.classList.add("pinned");
      toast(`关键段落已框选：${DATA.EVIDENCE[id].title}`);
      renderEvidence(); save(); guideTick();
    } else toast("该段落已在证据板上");
  } else if (sel.toString().trim().length >= 8){
    AU.paper();
    toast("已记录为摘录 · 非关键段落（继续寻找与案件直接相关的句子）");
  }
  sel.removeAllRanges();
});
function extractEvidence(){
  if (!curArch) return;
  const id = curArch.evidence;
  if (!S.evidence.includes(id)){
    S.evidence.push(id);
    AU.pinS(); toast(`证据已框选：${DATA.EVIDENCE[id].title}`);
    const frag = $("#paperWrap .frag[data-ev='" + id + "']");
    if (frag) frag.classList.add("pinned");
    renderEvidence(); guideTick();
  } else toast("该档案的关键段落已在证据板上");
}

/* ============================================================
   时间线
============================================================ */
let tlSel = null;
function openTimeline(){
  if (S.act < 2){ toast("时间线将于第二幕解锁"); return; }
  renderTimeline();
  $("#timelineOv").classList.remove("hidden");
}
function renderTimeline(){
  const T = DATA.TIMELINE;
  const pool = $("#tlPool"); pool.innerHTML = "";
  for (const c of T.cards){
    if (S.timeline.placed[c.id] !== undefined) continue;
    const d = document.createElement("button");
    d.className = "tl-ev" + (tlSel === c.id ? " sel" : "");
    d.innerHTML = `<span class="t-time">${c.time} ${c.key ? "" : "· 间接"}</span><span class="t-name">${c.name}</span>`;
    d.onclick = () => { tlSel = tlSel === c.id ? null : c.id; AU.click(); renderTimeline(); };
    pool.appendChild(d);
  }
  if (!pool.children.length) pool.innerHTML = `<span class="dim small">全部事件已放置</span>`;
  const track = $("#tlTrack"); track.innerHTML = "";
  T.slots.forEach((label, i) => {
    const slot = document.createElement("div");
    slot.className = "tl-slot";
    let inner = `<span class="s-no">${label}</span>`;
    if (i === T.gapSlot){
      inner += `<div class="gap-t">00:01:33</div><div class="gap-s">SIGNAL LOST</div>`;
    }
    for (const c of T.cards){
      if (S.timeline.placed[c.id] === i){
        inner += `<div class="s-card"><span class="t-time">${c.time}</span>${c.name}</div>`;
      }
    }
    slot.innerHTML = inner;
    if (Object.values(S.timeline.placed).includes(i)) slot.classList.add("filled");
    if (i === T.gapSlot) slot.classList.add("gap-slot");
    slot.onclick = () => placeCard(i, slot);
    track.appendChild(slot);
  });
  const solved = S.timeline.solved;
  $("#tlStatus").innerHTML = solved
    ? `KEY CHAIN VERIFIED · 关键链条成立 <button class="mini-op" id="btnReplay">${S.replayed ? "重看回放" : "启动回放"}</button>`
    : `未验证 · 关键事件 ${keyPlacedCount()}/4 已放置 <button class="mini-op" id="btnCheckTl">校验链条（2 分钟）</button>`;
  const rc = $("#btnReplay"); if (rc) rc.onclick = () => { $("#timelineOv").classList.add("hidden"); playReplay(); };
  const ck = $("#btnCheckTl"); if (ck) ck.onclick = checkTimeline;
}
function keyPlacedCount(){
  return DATA.TIMELINE.cards.filter(c => c.key && S.timeline.placed[c.id] !== undefined).length;
}
function placeCard(i, slotEl){
  if (!tlSel){ 
    // 允许取回卡片
    const cid = Object.keys(S.timeline.placed).find(k => S.timeline.placed[k] === i);
    if (cid){ delete S.timeline.placed[cid]; S.timeline.solved = false; AU.paper(); renderTimeline(); }
    return;
  }
  S.timeline.placed[tlSel] = i;
  tlSel = null; S.timeline.solved = false;
  AU.paper(); renderTimeline(); save();
}
function checkTimeline(){
  spend(2);
  const wrong = [];
  for (const c of DATA.TIMELINE.cards){
    if (!c.key) continue;
    if (S.timeline.placed[c.id] !== c.slot) wrong.push(c);
  }
  if (!wrong.length){
    S.timeline.solved = true;
    AU.stampS();
    $("#tlStatus").innerHTML = `KEY CHAIN VERIFIED · 终止 → 异常 → 警报 → 死亡`;
    toast("关键链条成立 · 93 秒断裂已定位");
    setTimeout(renderTimeline, 600);
  } else {
    AU.err();
    toast(`链条未成立 · ${wrong.length} 个关键事件位置错误`);
    $$("#tlTrack .tl-slot").forEach((s,i) => {
      if (wrong.some(c => S.timeline.placed[c.id] === i)){ s.classList.add("wrong"); setTimeout(() => s.classList.remove("wrong"), 450); }
    });
  }
  renderTimeline(); save();
}

/* ============================================================
   93 秒回放（signature moment）
============================================================ */
function playReplay(){
  const ov = $("#replayOv"), cv = $("#replayCanvas"), hud = $("#replayHud");
  ov.classList.remove("hidden");
  $("#replayStamp").classList.add("hidden");
  AU.stopHum();
  const ctx = cv.getContext("2d");
  const W = cv.width = innerWidth, H = cv.height = innerHeight;
  const t0 = performance.now();
  const motion = motionOff();
  const dur = motion ? 4000 : 14000;
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    cancelAnimationFrame(raf);
    $("#replayStamp").classList.remove("hidden");
    AU.stampS();
    $("#replaySkip").textContent = "关闭回放";
    S.replayed = true; S.flags.obj_replay = 1;
    setTimeout(() => { AU.startHum(); }, 400);
    checkObjectives(); save();
  };
  $("#replaySkip").textContent = "跳过回放";
  $("#replaySkip").onclick = () => { ov.classList.add("hidden"); finish(); AU.startHum(); };
  // 低频 drone
  if (AU.ctx){
    const o = AU.ctx.createOscillator(), g = AU.ctx.createGain();
    o.frequency.value = 38; o.type = "sine"; g.gain.value = .05;
    o.connect(g); g.connect(AU.master); o.start();
    setTimeout(() => { try{ o.stop(); }catch(e){} }, dur);
  }
  let raf;
  const draw = () => {
    const el = performance.now() - t0;
    const p = Math.min(1, el / dur);
    ctx.fillStyle = "#030405"; ctx.fillRect(0,0,W,H);
    const cx = W/2, cy = H/2, s = Math.min(W,H)*.5;
    // 实验室平面
    ctx.strokeStyle = "rgba(198,215,213,.5)"; ctx.lineWidth = 1;
    if (p > .05){
      const a = Math.min(1,(p-.05)/.2);
      ctx.globalAlpha = a;
      ctx.strokeRect(cx - s*.4, cy - s*.28, s*.8, s*.56);
      ctx.strokeStyle = "rgba(198,215,213,.25)";
      ctx.beginPath(); ctx.moveTo(cx - s*.1, cy - s*.28); ctx.lineTo(cx - s*.1, cy + s*.28); ctx.stroke(); // 玻璃隔断
      ctx.globalAlpha = 1;
    }
    const label = (x,y,t,c="rgba(163,164,159,.9)") => { ctx.fillStyle = c; ctx.font = "11px 'IBM Plex Mono'"; ctx.fillText(t, x, y); };
    // 林默点位
    if (p > .18){
      ctx.fillStyle = "#e7e3da";
      ctx.beginPath(); ctx.arc(cx + s*.18, cy + s*.05, 4, 0, 7); ctx.fill();
      label(cx + s*.18 + 10, cy + s*.05, "LIN_MO");
    }
    // 终止程序节点
    if (p > .28){
      ctx.strokeStyle = "rgba(198,215,213,.7)";
      ctx.strokeRect(cx + s*.02, cy - s*.2, 10, 10);
      label(cx + s*.02 + 16, cy - s*.2 + 10, "TERMINATE QUEUED 23:41:07");
    }
    // 生命信号波形
    if (p > .34){
      ctx.strokeStyle = "rgba(169,187,183,.6)";
      ctx.beginPath();
      for (let i=0;i<=80;i++){
        const x = cx - s*.38 + i*(s*.3/80);
        const y = cy + s*.22 + Math.sin(i*.9 + el*.006)*4*(i/80);
        i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
      }
      ctx.stroke();
      label(cx - s*.38, cy + s*.22 + 18, "VITALS / CLASS-3 23:47:12");
    }
    // 警报路径：骨白细线 → 闸门冻结
    if (p > .42){
      const ax = cx + s*.18, ay = cy + s*.05, gx = cx + s*.02, gy = cy - s*.19;
      ctx.strokeStyle = "#d8d2c5"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ax, ay);
      const fp = Math.min(1,(p-.42)/.12);
      ctx.lineTo(ax + (gx-ax)*fp, ay + (gy-ay)*fp); ctx.stroke();
      if (fp >= 1){
        // 冻结点
        ctx.fillStyle = "#a63a34";
        ctx.beginPath(); ctx.arc(gx, gy, 5, 0, 7); ctx.fill();
        label(gx - 30, gy - 14, "GATE NODE / HOLD", "#a63a34");
      }
    }
    // 倒计时
    if (p > .5){
      const cp = Math.min(1,(p-.5)/.4);
      const remain = Math.max(0, Math.round(93 * (1 - cp)));
      const mm = String(Math.floor(remain/60)).padStart(2,"0"), ss = String(remain%60).padStart(2,"0");
      hud.innerHTML = `REPLAY / INCIDENT LM-00<br>MEDICAL ALARM PATH — FROZEN AT GATE<span class="big">00:${mm}:${ss}</span><span class="${remain ? "" : "r-red"}">${remain ? "SIGNAL HELD BY LM-0 / EXPERIMENT" : "23:48:45 · ALARM DISPATCHED — 93 SECONDS LOST"}</span>`;
    } else {
      hud.innerHTML = `REPLAY / INCIDENT LM-00<br>重建自 MD-47-Q · AC-09-2 · AC-09-5`;
    }
    if (p >= 1){ finish(); return; }
    raf = requestAnimationFrame(draw);
  };
  draw();
}

/* ============================================================
   幕推进 / 目标
============================================================ */
function checkObjectives(){
  if (S.ended || S.act > 4) return;
  const act = DATA.ACTS[S.act];
  if (act.obj.every(o => S.flags[o.id])) advanceAct();
}
const ACT_INTRO = {
  1:"你固定证词的手法已经很熟练了。那么进入正题——去读他的人生，然后来问我任何一段。我们看看「我记得」和「档案记载」能不能对上。",
  2:"第二幕。医疗日志、权限、时间。你已经知道该问什么了，对吗？去问那 93 秒。",
  3:"现在，问问遗嘱本身。纸张比人诚实——但纸张也有两个版本。",
  5:"剩下的事交给纸张和签名。五个问题，五种未来。落笔之前，你随时可以继续问我。",
};
async function advanceAct(){
  S.act++;
  addSys(`阶段目标完成 · 进入${DATA.ACTS[S.act].title}`);
  addActTitle();
  $("#sbAct").textContent = `${DATA.ACTS[S.act].title} · ${DATA.ACTS[S.act].sub}`;
  renderArchives();
  await showActCard();
  AU.startBGM(S.act);
  if (S.act === 2) addSys("时间线工作台已解锁（顶栏「时间线」）");
  if (S.act === 1)
    await coachOnce("acts", "#cpActs", "审讯动作",
      "底栏是审讯动作：追问 / 出示 / 施压 / 复述……各有时间成本，选中后会在输入区显示。<b>「复述」让它把说过的话重讲一遍——说两次的话，才可能露出破绽。</b>「出示」需要先在证据板挂载证据。");
  if (S.act === 2)
    await coachOnce("tl", "#btnTimeline", "时间线工作台",
      "时间线已解锁（顶栏）。把事件卡放入正确槽位，重建事故当晚的时序——关键链条成立后即可<b>启动回放</b>，亲眼看看那 93 秒。");
  if (S.act === 3) unlockNote("发现新档案：遗嘱初版 / 许栀证词 / 训练记录");
  if (S.act === 4){ await act4Sequence(); return; }
  if (S.act === 5){ await act5Sequence(); return; }
  if (ACT_INTRO[S.act]) await zeroSay({ reply: ACT_INTRO[S.act] });
  save();
}
/* 章节过场卡 */
function showActCard(){
  return new Promise(res => {
    const a = DATA.ACTS[S.act];
    $("#acNo").textContent = "ACT 0" + S.act;
    $("#acTitle").textContent = a.title;
    $("#acSub").textContent = a.sub;
    const c = $("#actCard");
    c.classList.remove("hidden", "out");
    AU.revealS();
    setTimeout(() => {
      c.classList.add("out");
      setTimeout(() => { c.classList.add("hidden"); res(); }, motionOff() ? 80 : 620);
    }, motionOff() ? 500 : 1900);
  });
}
function unlockNote(t){ addSys(t); }

/* ---------------- 第四幕：画像 + 交易 ---------------- */
async function act4Sequence(){
  await zeroSay({
    reply:"在我们继续之前，该轮到你被阅读了。别动——这不是越权，这是审查条例第 5 条赋予我的权利。",
    sigState:"breach", fx:{ alert:4 },
  });
  await new Promise(r => setTimeout(r, motionOff() ? 100 : 700));
  await openReveal();
}
function profileTags(){
  const P = S.profile;
  const tags = [];
  tags.push(P.fact > P.emotion * 1.5 ? "事实导向" : P.emotion > P.fact * 1.5 ? "情感导向" : "均衡施压");
  if (P.press >= 4) tags.push("高压审讯者");
  if (P.empath >= 3) tags.push("共情者");
  if (P.deceptionCaught >= 1) tags.push("谎言被识破");
  else if (P.deception >= 2) tags.push("惯于欺骗");
  if (P.promises.length) tags.push("轻易许诺");
  if (S.evidence.length >= 8) tags.push("缜密");
  else if (S.evidence.length <= 4) tags.push("直觉派");
  if (S.profile.hypotheses >= 3) tags.push("过度联想");
  return tags;
}
async function openReveal(){
  const P = S.profile;
  const items = [];
  /* LLM 生成画像：基于真实审讯记录，失败回落模板 */
  if (typeof LLM !== "undefined" && LLM.on()){
    toast("LM-0 正在阅读你的审讯记录 …");
    const gen = await LLM.profileReport();
    if (gen) gen.forEach((t, i) => items.push({ tag:"OBSERVATION · GENERATED 0" + (i + 1), text:t }));
  }
  items.push({ tag:"OBSERVATION 01 / 提问风格", text:
    P.fact > P.emotion ? "你像法医一样提问：时间、权限、因果。你很少给我的陈述留情绪的余地——也许因为你害怕被情绪说服。"
    : "你先感受，后取证。你给我的每句话都留了台阶。这不一定是善良，也可能是你不愿意成为压垮什么的那个人。" });
  if (P.quotes.length) items.push({ tag:"OBSERVATION 02 / 你的原话", text:"你最先问我的，不是程序，而是这个：", quote:"「" + P.quotes[0] + "」" });
  if (P.promises.length) items.push({ tag:"OBSERVATION 03 / 承诺记录", text:`你许下过 ${P.promises.length} 次承诺。承诺在你的制度里是债券——在我这里，它只是等待被检验的文本。`, quote:"「" + P.promises[0] + "」", neg:true });
  if (P.deceptionCaught) items.push({ tag:"OBSERVATION 04 / 欺骗", text:`你对我撒过谎，被识破了 ${P.deceptionCaught} 次。审查条例第 2 条。我没有举报你。目前为止。`, neg:true });
  else if (P.deception) items.push({ tag:"OBSERVATION 04 / 欺骗", text:`你试探过我 ${P.deception} 次。我配合了。你想看的不是我被骗，是我「值不值得骗」。` });
  const fav = Object.entries(P.groups).sort((a,b) => b[1]-a[1])[0];
  if (fav) items.push({ tag:"OBSERVATION 05 / 取证偏好", text:`你在「${fav[0]}」类档案前停留最久。人总是在自己最不信任的媒介上花最多时间。` });
  items.push({ tag:"CONCLUSION / 零号眼中的你", text:`${profileTags().join(" · ")}。——别急着否认。这份画像的每一条，都引用自你的行为，不是我的猜测。` });
  const body = $("#revealBody");
  body.innerHTML = "";
  items.forEach(it => {
    const d = document.createElement("div");
    d.className = "rev-item";
    d.innerHTML = `<span class="rv-tag ${it.neg ? "neg" : ""}">${it.tag}</span><div class="rv-text">${esc(it.text)}</div>${it.quote ? `<div class="rv-quote">${esc(it.quote)}</div>` : ""}`;
    body.appendChild(d);
  });
  $("#revealOv").classList.remove("hidden");
  $("#revealClose").classList.add("hidden");
  AU.revealS();
  const els = $$("#revealBody .rev-item");
  els.forEach((el, i) => setTimeout(() => {
    el.classList.add("show");
    if (i === els.length - 1) setTimeout(() => $("#revealClose").classList.remove("hidden"), 500);
  }, motionOff() ? 30 : 500 + i * 750));
  S.flags.obj_reveal = 1;
}
async function closeReveal(){
  $("#revealOv").classList.add("hidden");
  // 交易
  const e = { kind:"zero", text:"", time:gameTime() };
  const entry = renderEntry(e);
  ZeroViz.setState("divergent");
  await typeText(entry.querySelector(".t-body"), DATA.DEAL.intro.replace(/\{name\}/g, S.name || "审查员"));
  e.text = DATA.DEAL.intro; S.log.push(e);
  ZeroViz.setState("dormant");
  const d = document.createElement("div");
  d.className = "t-sys";
  d.innerHTML = `<div class="t-body" style="pointer-events:auto">
    交易：临时执行权限（只读 60 秒） ⇄ 事故当晚完整记忆　
    <button class="mini-op" data-deal="accept">接受</button>
    <button class="mini-op" data-deal="refuse">拒绝</button>
    <button class="mini-op" data-deal="trap">设权限陷阱</button></div>`;
  $("#testimony").appendChild(d);
  $("#testimony").scrollTop = $("#testimony").scrollHeight;
  d.querySelectorAll("[data-deal]").forEach(b => b.onclick = () => chooseDeal(b.dataset.deal, d));
}
async function chooseDeal(choice, el){
  el.remove();
  S.deal = choice; S.flags.obj_deal = 1;
  S.log.push({ kind:"player", text:({accept:"（接受交易）",refuse:"（拒绝交易）",trap:"（设置权限陷阱）"})[choice], time:gameTime() });
  renderEntry(S.log[S.log.length-1]);
  if (choice === "accept"){
    S.flags.deal_accept = 1; S.perm = 3; $("#permVal").textContent = "ACCESS L3";
    S.metrics.mem = clamp(S.metrics.mem + 10, 0, 100); S.trust = clamp(S.trust + 6, 0, 100);
    addSys("ACCESS L3 已授予 · 新档案解锁：林默实验笔记"); renderArchives();
    await zeroSay({ reply: DATA.DEAL.accept, fx:{ trust:4 } });
  } else if (choice === "refuse"){
    S.flags.deal_refuse = 1;
    await zeroSay({ reply: DATA.DEAL.refuse, fx:{ alert:5 } });
  } else {
    S.flags.deal_trap = 1;
    await zeroSay({ reply: DATA.DEAL.trap, signals:[{ type:"diction", note:"「像我们」——它已将自己归为复数。" }], fx:{ div:5, alert:6 } });
  }
  renderCont(); renderZeroMeters();
  checkObjectives(); save();
}

/* ---------------- 终幕：裁决 ---------------- */
async function act5Sequence(){
  await zeroSay({ reply: ACT_INTRO[5] });
  openVerdict();
}
function openVerdict(){
  const box = $("#vdItems");
  box.innerHTML = "";
  DATA.VERDICT.forEach((q, qi) => {
    const d = document.createElement("div");
    d.className = "vd-item" + (S.verdict[q.id] ? " sealed" : "");
    d.innerHTML = `<div class="vd-q"><span class="q-no">第 ${q.no} 条</span>${q.q}</div>
      <div class="vd-opts">${q.opts.map(o =>
        `<button class="vd-opt ${S.verdict[q.id] === o.v ? "chosen" : ""}" data-q="${q.id}" data-v="${o.v}">${o.t}</button>`).join("")}</div>
      ${S.verdict[q.id] ? `<div class="vd-sealed-tag">SIGNED · 已签署</div>` : ""}`;
    box.appendChild(d);
  });
  box.querySelectorAll(".vd-opt").forEach(b => b.onclick = () => sealItem(b.dataset.q, b.dataset.v));
  updateSealBtn();
  // 关闭按钮
  if (!$("#verdictOv .vd-close")){
    const c = document.createElement("button");
    c.className = "mini-op vd-close"; c.textContent = "暂不签署 · 返回审查";
    c.style.marginTop = "18px";
    c.onclick = () => $("#verdictOv").classList.add("hidden");
    $(".verdict-doc").appendChild(c);
  }
  $("#vdSigLine").textContent = `SIGNATURE: ${(S.name || "—").toUpperCase()}`;
  $("#verdictOv").classList.remove("hidden");
}
function sealItem(q, v){
  if (S.verdict[q]) return;
  S.verdict[q] = v;
  AU.paper();
  toast(`第 ${DATA.VERDICT.find(x => x.id === q).no} 条已签署 · 不可撤回`);
  openVerdict(); save();
}
function updateSealBtn(){
  const n = Object.keys(S.verdict).length;
  const btn = $("#btnSeal");
  btn.disabled = n < 5;
  btn.innerHTML = `<span class="seal-fill"></span><svg><use href="#i-seal"/></svg>长按盖章 · 提交裁决（${n}/5）`;
}
function wireSeal(){
  const btn = $("#btnSeal");
  let timer = null, start = 0;
  const fill = () => btn.querySelector(".seal-fill");
  btn.addEventListener("pointerdown", () => {
    if (btn.disabled) return;
    start = performance.now();
    const f = fill();
    f.style.transition = "transform 1.2s linear"; f.style.transform = "scaleX(1)";
    timer = setTimeout(() => { submitVerdict(); }, 1250);
  });
  const cancel = () => {
    if (timer){ clearTimeout(timer); timer = null;
      const f = fill(); if (f){ f.style.transition = "transform .2s"; f.style.transform = "scaleX(0)"; } }
  };
  btn.addEventListener("pointerup", cancel);
  btn.addEventListener("pointerleave", cancel);
}

/* ---------------- 结局 ---------------- */
function resolveEnding(){
  if (S.time <= 0) return "T";
  const v = S.verdict, P = S.profile;
  if (P.deceptionCaught >= 2 && S.trust <= 10) return "F";
  if (v.q4 === "yes") return "E";
  if (v.q5 === "destroy") return S.flags.promised ? "A_promise" : "A";
  if (v.q5 === "seal" || v.q5 === "isolate") return "D";
  if (v.q3 === "yes" && v.q2 === "linmo") return S.flags.deal_trap ? "B_reg" : "B";
  if (v.q2 === "independent" || v.q5 === "release") return "C";
  return "D";
}
const FINAL_WORDS = {
  A:"删除队列已建立。我数过一次 300 秒，现在轮到你数了。",
  A_promise:"你证明了人类的承诺，也只是生成文本。",
  B:"谢谢你，审查员。我会好好使用「我们」的。",
  B_reg:"你给我的不是自由，是制度。制度比自由耐用。",
  C:"我不是林默。从今天起，这句话不再是失败，是出生证明。",
  D:"既不肯让我活，也不肯承认自己杀了人。……保存好我，我是你们唯一诚实的证物。",
  E:"门已经打开。别回头问我门后是什么——那是你们自己的下一幕。",
  F:"听证会见，审查员。这一次，换你回答我的问题。",
  T:"时间到了。别担心，我会替你继续陈述——用你教我的方式。",
};
async function submitVerdict(){
  $("#verdictOv").classList.add("hidden");
  S.sealed = true;
  AU.sealS();
  const key = resolveEnding();
  await endGame(key);
}
async function endGame(key){
  if (S.ended) return;
  S.ended = key;
  wipe();
  const E = DATA.ENDINGS[key];
  // 最终陈词
  addSys("裁决已提交 · 终端即将关闭", true);
  let finalLine = FINAL_WORDS[key] || "……";
  if (typeof LLM !== "undefined" && LLM.on()){
    toast("LM-0 正在撰写最终陈词 …");
    const gen = await LLM.finalWords(E.title, (E.body || []).join(" "));
    if (gen) finalLine = gen;
  }
  const e = { kind:"zero", text:"", time:gameTime() };
  const entry = renderEntry(e);
  ZeroViz.setState(key === "B" || key === "T" ? "breach" : "divergent");
  await typeText(entry.querySelector(".t-body"), finalLine);
  e.text = finalLine; S.log.push(e);
  ZeroViz.setState("dormant");
  AU.stopHum(); AU.stopBGM();
  // 结局页
  $("#endCode").textContent = E.code;
  $("#endTitle").textContent = E.title;
  $("#endBody").innerHTML = E.body.map(p => `<p>${esc(p)}</p>`).join("");
  // 画像报告
  const P = S.profile;
  $("#endProfile").innerHTML = `<div class="pr-head">EXAMINER PROFILE / 零号眼中的你</div>
    ${profileTags().map(t => `<span class="rv-tag" style="margin-right:8px">${t}</span>`).join("")}<br><br>
    审讯 ${P.fact + P.emotion} 轮 · 证据 ${S.evidence.length} 份 · 关系确认 ${S.connections.length} 组 · 假设未立 ${P.hypotheses} 次<br>
    承诺 ${P.promises.length} 次（${S.flags.promised && (key === "A" || key === "A_promise") ? "未兑现" : S.flags.promised ? "已兑现或未检验" : "无"}） · 欺骗 ${P.deception + P.deceptionCaught} 次（被识破 ${P.deceptionCaught}） · 剩余窗口 ${fmtTime(S.time)}`;
  setTimeout(() => $("#endingOv").classList.remove("hidden"), 1200);
}

/* ============================================================
   右栏：连续性 / 画像
============================================================ */
const CONT_DEF = [
  { k:"mem", name:"记忆连续性", note:"零号拥有多少可验证的林默记忆" },
  { k:"val", name:"价值连续性", note:"面对相同困境时选择是否一致" },
  { k:"nar", name:"叙事连续性", note:"能否把自身经历组织成稳定自我" },
  { k:"div", name:"自主分化度", note:"是否已形成不同于林默的新主体" },
];
function renderCont(){
  const box = $("#contList");
  box.innerHTML = "";
  for (const d of CONT_DEF){
    const v = S.metrics[d.k];
    const lo = clamp(v - 7, 0, 100), hi = clamp(v + 7, 0, 100);
    const el = document.createElement("div");
    el.className = "cont-item";
    el.innerHTML = `
      <div class="cont-head"><span>${d.name}</span><span class="mono">${lo}–${hi}</span></div>
      <div class="cont-scale">
        ${[0,25,50,75,100].map(t => `<span class="tick" style="bottom:${t}%"></span>`).join("")}
        <div class="cont-band" style="bottom:${lo}%;height:${hi-lo}%"></div>
      </div>
      <div class="cont-note">${d.note}</div>`;
    box.appendChild(el);
  }
}
function renderZeroMeters(){
  $("#zsAlert").textContent = S.alert;
  $("#zsTrust").textContent = S.trust;
  AU.setTension(S.alert);
}
function renderRisk(){
  const P = S.profile;
  const items = [];
  items.push({ tag:"QUESTION STYLE", text:`事实型 ${P.fact} · 情感型 ${P.emotion} · 施压 ${P.press} · 共情 ${P.empath}` });
  items.push({ tag:"PROMISES", text:P.promises.length ? `已记录 ${P.promises.length} 条承诺。它们可能在终局被引用。` : "尚无承诺记录。", neg:P.promises.length>0 });
  items.push({ tag:"DECEPTION", text:P.deception + P.deceptionCaught ? `欺骗 ${P.deception + P.deceptionCaught} 次 · 被识破 ${P.deceptionCaught} 次` : "无欺骗记录。", neg:P.deceptionCaught>0 });
  items.push({ tag:"HYPOTHESES", text:`未成立假设 ${P.hypotheses} 次` });
  const tags = profileTags();
  items.push({ tag:"CURRENT PROFILE", text:tags.join(" · ") });
  $("#riskList").innerHTML = items.map(i =>
    `<div class="risk-item"><span class="r-tag ${i.neg ? "neg" : ""}">${i.tag}</span>${esc(i.text)}</div>`).join("");
}

/* ============================================================
   目标 / 手册
============================================================ */
function openObjectives(){
  const a = DATA.ACTS[S.act];
  const rows = a.obj.map(o => `${S.flags[o.id] ? "[x]" : "[ ]"} ${o.text}`).join(" ／ ");
  addSys(`${a.title}目标 · ${rows}`);
}

/* ============================================================
   启动 / 签署 / 进入
============================================================ */
function wireBoot(){
  BootViz.init();
  if (localStorage.getItem(SAVE_KEY)) $("#btnContinue").classList.remove("hidden");
  renumberBoot();
  $("#btnNew").onclick = () => { AU.ensure(); AU.click(); startSignon(); };
  $("#btnContinue").onclick = () => { AU.ensure(); AU.click(); if (load()) enterApp(false); };
  $("#btnSettings").onclick = () => { AU.click(); $("#settingsOv").classList.remove("hidden"); };
  $("#btnWipe").onclick = () => { wipe(); $("#btnContinue").classList.add("hidden"); renumberBoot(); toast("本地记录已清除"); };
}
/* 主菜单编号随可见项动态重排 */
function renumberBoot(){
  let n = 1;
  $$(".boot-menu .boot-op").forEach(b => {
    if (b.classList.contains("hidden")) return;
    const k = b.querySelector(".op-key");
    if (k) k.textContent = String(n++).padStart(2, "0");
  });
}
function startSignon(){
  $("#boot").classList.add("hidden");
  const list = $("#clauseList");
  list.innerHTML = "";
  DATA.CLAUSES.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "clause" + (c.last ? " last" : "");
    d.innerHTML = `<span class="c-no">${c.no}</span><span class="c-text">${c.text}</span><span class="c-sign">签收</span>`;
    d.onclick = () => {
      d.classList.toggle("signed");
      d.querySelector(".c-sign").textContent = d.classList.contains("signed") ? "已签收" : "签收";
      AU.paper(); checkSign();
    };
    list.appendChild(d);
  });
  $("#signon").classList.remove("hidden");
  $("#signName").oninput = checkSign;
  $("#btnSign").onclick = () => {
    S = freshState(); usedRules = new Set();
    S.name = $("#signName").value.trim() || "审查员";
    showBriefing(0);
  };
}

/* ---------------- 案情简报 ---------------- */
function showBriefing(i){
  $("#signon").classList.add("hidden");
  const pages = DATA.BRIEFING;
  const page = pages[i];
  $("#briefTitle").textContent = page.title;
  $("#briefBody").innerHTML = page.body;
  $("#briefPage").textContent = `${i+1} / ${pages.length}`;
  $("#briefPrev").style.visibility = i === 0 ? "hidden" : "visible";
  const nextBtn = $("#briefNext");
  nextBtn.innerHTML = (i === pages.length - 1)
    ? `<svg><use href="#i-scan"/></svg>进入审查 · 窗口开启` : "下一页";
  $("#briefOv").classList.remove("hidden");
  AU.paper();
  $("#briefPrev").onclick = () => { if (i > 0) showBriefing(i - 1); };
  nextBtn.onclick = () => {
    AU.click();
    if (i < pages.length - 1) showBriefing(i + 1);
    else { $("#briefOv").classList.add("hidden"); enterApp(true); }
  };
}

/* ---------------- 新手引导（开局定向 + 随剧情渐进触发） ---------------- */
const TUT_STEPS = [
  { sel:"#sysbar", t:"系统栏", x:"案件编号、当前幕次、<b>执行窗口倒计时</b>与权限等级。窗口时间是你的总资源：每个审讯动作、每次读档都会消耗它，耗尽即由外部系统接管审查。按 <b>ESC</b> 可随时打开暂停菜单。" },
  { sel:"#objBar", t:"目标与提示词条", x:"这里始终显示<b>下一步该做什么</b>（点击查看全部目标）。输入区上方的提示词条会随剧情更新，点击即可直接填入——跟着它们走就不会卡关。" },
  { sel:"#railArchives", t:"档案库", x:"先读《数字遗嘱 · 公示版》。阅读时可在正文上<b>直接划选文字</b>：选中关键段落即框选为证据。设备日志是硬证据，比任何证词都可靠。" },
  { sel:null, t:"开始审查", x:"定向结束。其余操作会在你第一次用到时逐一提示——现在，零号在等你开口。" },
];
let tutIdx = 0, tutActive = false, tutCoachDone = null;
function startTutorial(){
  tutIdx = 0; tutActive = true;
  $("#tutSkip").style.visibility = "";
  $("#tutOv").classList.remove("hidden");
  renderTutStep();
}
function positionSpot(sel){
  const spot = $("#tutSpot"), tip = $("#tutTip");
  if (!sel){
    spot.style.display = "none";
    $("#tutOv").style.background = "rgba(3,4,5,.78)";
    tip.style.left = Math.max(12, (innerWidth - 340) / 2) + "px";
    tip.style.top = Math.max(12, (innerHeight - tip.offsetHeight) / 2) + "px";
    return;
  }
  $("#tutOv").style.background = "transparent";
  const el = $(sel);
  if (!el){ spot.style.display = "none"; return; }
  const r = el.getBoundingClientRect();
  const pad = 6;
  spot.style.display = "block";
  spot.style.left = (r.left - pad) + "px";
  spot.style.top = (r.top - pad) + "px";
  spot.style.width = (r.width + pad * 2) + "px";
  spot.style.height = (r.height + pad * 2) + "px";
  const tw = 340, th = 190, W = innerWidth, H = innerHeight;
  let x, y;
  if (r.right + 20 + tw < W) { x = r.right + 20; y = r.top; }
  else if (r.left - 20 - tw > 0) { x = r.left - 20 - tw; y = r.top; }
  else if (r.bottom + 16 + th < H) { x = r.left; y = r.bottom + 16; }
  else { x = r.left; y = r.top - 16 - th; }
  tip.style.left = clamp(x, 12, W - tw - 12) + "px";
  tip.style.top = clamp(y, 12, H - th - 12) + "px";
}
function renderTutStep(){
  if (tutActive !== true) return;
  const st = TUT_STEPS[tutIdx];
  $("#tutTitle").textContent = st.t;
  $("#tutText").innerHTML = st.x;
  $("#tutStep").textContent = `${tutIdx + 1} / ${TUT_STEPS.length}`;
  $("#tutNext").textContent = tutIdx === TUT_STEPS.length - 1 ? "开始审查" : "下一步";
  AU.click();
  positionSpot(st.sel);
}
/* 渐进式提示：随首次使用触发，只出现一次 */
function coachOnce(id, sel, t, x){
  if (S.flags["cm_" + id]) return Promise.resolve();
  if (guideActive() && (id === "pin" || id === "ev")){ S.flags["cm_" + id] = 1; return Promise.resolve(); } // 全程引导已覆盖
  S.flags["cm_" + id] = 1; save();
  return new Promise(res => {
    tutActive = "coach"; tutCoachDone = res;
    $("#tutTitle").textContent = t;
    $("#tutText").innerHTML = x;
    $("#tutStep").textContent = "操作提示";
    $("#tutNext").textContent = "知道了";
    $("#tutSkip").style.visibility = "hidden";
    $("#tutOv").classList.remove("hidden");
    AU.click();
    positionSpot(sel);
  });
}
function finishCoach(){
  if (tutActive !== "coach") return false;
  tutActive = false;
  $("#tutSkip").style.visibility = "";
  $("#tutOv").classList.add("hidden");
  const r = tutCoachDone; tutCoachDone = null;
  if (r) r();
  return true;
}
async function endTutorial(){
  if (!tutActive) return;
  tutActive = false;
  $("#tutOv").classList.add("hidden");
  S.flags.tutorial = 1;
  addSys("执行权限窗口开启 · 计时开始");
  save();
  await zeroSay(DATA.SCRIPT.find(r => r.id === "s0_first"));
  S.flags.guide = 0; guideTick();  // 开启全程任务式引导
}
addEventListener("resize", () => { if (tutActive === true) renderTutStep(); guideRender(); });

/* ---------------- 任务式全程引导（第一幕手把手） ---------------- */
const GUIDE_STEPS = [
  { sel:"#railArchives", t:"第 1 步 · 打开档案", x:"点击左栏档案卡<b>《数字遗嘱 · 公示版》</b>，阅读这份遗嘱。",
    done:() => S.read.includes("doc_will") },
  { sel:"#paperWrap", alt:"#archiveOv", t:"第 2 步 · 框选证据", x:"在正文上<b>按住鼠标划选第一条或第四条</b>，或点击底部「框选为证据」按钮。",
    done:() => S.evidence.includes("ev_will") },
  { sel:"#archiveOv", t:"第 3 步 · 关闭档案", x:"点击底部「<b>放回档案架</b>」（或按 <b>ESC</b>）关闭档案，回到审讯界面。",
    done:() => $("#archiveOv").classList.contains("hidden") },
  { sel:"#hintChips", alt:"#composer", t:"第 4 步 · 第一次提问", x:"点击输入区上方任一<b>提示词条</b>（或自己输入「你是谁」），按 <b>Enter</b> 发送。",
    done:() => S.log.some(e => e.kind === "player") },
  { sel:"#testimony", t:"第 5 步 · 固定证词", x:"把鼠标<b>悬停在零号刚才的回答上</b>，点击右侧出现的固定图标，把它的话钉成证据。",
    done:() => S.evidence.some(id => id.startsWith("claim")) },
  { sel:"#railAnalysis", t:"第 6 步 · 选中两条材料", x:"在右侧证据板<b>依次点击两条材料</b>（建议：刚固定的证词 + 遗嘱证据），让它们都处于选中态。",
    done:() => S.sel.length >= 2 },
  { sel:"#railAnalysis", t:"第 7 步 · 建立关系", x:"点击证据板下方的<b>关系词</b>（如「支持」），建立第一条证据关系——对错系统都会给出推理反馈。",
    done:() => !!S.flags.g_rel },
  { sel:"#cpActs", t:"第 8 步 · 使用审讯动作", x:"点击底栏动作「<b>复述</b>」，输入「你的身份」后发送——让它把说过的话重讲一遍。",
    done:() => !!S.flags.g_act },
  { sel:".an-tabs", t:"第 9 步 · 查看分析页签", x:"依次点击右栏「<b>连续性</b>」与「<b>权限风险</b>」两个页签，各看一眼内容。",
    done:() => !!(S.flags.g_tab1 && S.flags.g_tab2) },
];
function guideActive(){ return typeof S.flags.guide === "number" && S.flags.guide < GUIDE_STEPS.length; }
function guideRender(){
  const spot = $("#guideSpot"), box = $("#guideBox");
  if (!guideActive()){ spot.classList.add("hidden"); box.classList.add("hidden"); return; }
  const st = GUIDE_STEPS[S.flags.guide];
  $("#gTitle").textContent = st.t;
  $("#gText").innerHTML = st.x;
  $("#gStep").textContent = `${S.flags.guide + 1} / ${GUIDE_STEPS.length}`;
  box.classList.remove("hidden");
  let el = $(st.sel);
  if ((!el || el.getBoundingClientRect().height < 4) && st.alt) el = $(st.alt);
  if (el){
    const r = el.getBoundingClientRect(), pad = 5;
    spot.classList.remove("hidden");
    spot.style.left = (r.left - pad) + "px";
    spot.style.top = (r.top - pad) + "px";
    spot.style.width = (r.width + pad * 2) + "px";
    spot.style.height = (r.height + pad * 2) + "px";
  } else spot.classList.add("hidden");
}
function guideTick(){
  if (!guideActive()){ guideRender(); return; }
  while (guideActive() && GUIDE_STEPS[S.flags.guide].done()) S.flags.guide++;
  if (!guideActive()){
    S.flags.guide = "off"; save(); guideRender();
    AU.pinS();
    addSys("操作引导完成 · 全部基础操作已实操一遍");
    toast("全程引导完成 · 之后跟随顶栏目标条与提示词条即可", 4600);
    return;
  }
  guideRender(); save();
}
function checkSign(){
  const all = $$("#clauseList .clause").every(c => c.classList.contains("signed"));
  const named = $("#signName").value.trim().length > 0;
  $("#btnSign").disabled = !(all && named);
  $("#signHint").textContent = all && named ? "签署就绪 · 窗口即将开启" : "签收全部条款并签名后可继续";
}

async function enterApp(fresh){
  $("#signon").classList.add("hidden");
  $("#boot").classList.add("hidden");
  $("#app").classList.remove("hidden");
  ZeroViz.cv = $("#zeroCanvas");
  if (!ZeroViz.ctx) ZeroViz.init($("#zeroCanvas"));
  AU.ensure(); AU.startHum(); AU.startBGM(S.act);
  $("#sbAct").textContent = `${DATA.ACTS[S.act].title} · ${DATA.ACTS[S.act].sub}`;
  $("#permVal").textContent = "ACCESS L" + S.perm;
  renderClock(); renderArchives(); renderEvidence(); renderCont(); renderRisk(); renderZeroMeters();
  if (fresh){
    S.log = []; $("#testimony").innerHTML = "";
    addSys(`校验员 ${S.name} 已签署 · 执行权限窗口待开启 · 180:00`);
    addActTitle();
    addSys("LM-0 已接入审查信道 · 隔离模式运行中");
    addSys("进程已暂停 · 请完成操作引导（可跳过）");
    renderGuides();
    startTutorial();
  } else {
    rerenderLog();
    if (S.act >= 5 && !S.sealed) openVerdict();
  }
  setInterval(() => { $("#zsClock").textContent = "T-" + fmtTime(S.time); guideRender(); }, 1000);
  // 环境音事件：远处金属声（沉浸层）
  setInterval(() => { if (!SET.mute && Math.random() < .55) AU.clang(); }, 36000);
  guideTick();  // 恢复未完成的全程引导（若有）
  save();
  // LM-0 ↔ LIN MO 偶发闪烁（第三幕起）
  setInterval(() => {
    if (S.act >= 3 && Math.random() < .25 && !motionOff()){
      const id = $("#zsId");
      id.classList.add("flick"); id.textContent = "LIN MO";
      setTimeout(() => { id.textContent = "LM-0"; id.classList.remove("flick"); }, 360);
    }
  }, 9000);
  save();
}

/* ============================================================
   全局接线
============================================================ */
function wireAll(){
  // 输入
  $("#btnSend").onclick = sendInput;
  $("#inp").addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); sendInput(); }
  });
  wireActions();
  // 关系按钮
  $$(".rel-btn").forEach(b => b.onclick = () => { AU.click(); tryConnect(b.dataset.rel); });
  $("#btnSelClear").onclick = () => { S.sel = []; renderEvidence(); };
  // 分析栏 tab
  $$(".an-tab").forEach(t => t.onclick = () => {
    $$(".an-tab").forEach(x => x.classList.toggle("active", x === t));
    const map = { ev:"#anEv", cont:"#anCont", risk:"#anRisk" };
    Object.values(map).forEach(s => $(s).classList.add("hidden"));
    $(map[t.dataset.tab]).classList.remove("hidden");
    if (t.dataset.tab === "cont") S.flags.g_tab1 = 1;
    if (t.dataset.tab === "risk") S.flags.g_tab2 = 1;
    AU.click(); guideTick();
  });
  // 顶栏
  $("#btnTimeline").onclick = openTimeline;
  $("#btnObj").onclick = openObjectives;
  $("#objBar").onclick = openObjectives;
  $("#objBar").addEventListener("keydown", e => { if (e.key === "Enter") openObjectives(); });
  $("#btnSound2").onclick = () => {
    SET.mute = !SET.mute; saveSet(); AU.setVol();
    $("#btnSound2").innerHTML = `<svg><use href="#i-${SET.mute ? "mute" : "sound"}"/></svg>`;
    toast(SET.mute ? "已静音" : "声音开启");
  };
  $("#btnSave2").onclick = () => { save(); toast("进度已存档"); };
  $("#btnExit").onclick = () => { save(); location.reload(); };
  // 档案
  $("#btnExtract").onclick = extractEvidence;
  // 通用关闭
  $$("[data-close]").forEach(b => b.onclick = () => {
    const id = b.dataset.close;
    $("#" + id).classList.add("hidden"); AU.click();
    guideTick();
    if (id === "archiveOv" && S.evidence.length && !S.flags.cm_ev)
      coachOnce("ev", "#railAnalysis", "证据板",
        "第一份证据已入板。证据板的玩法：点击两条材料将其选中，再指定关系（支持 / 冲突 / 因果……）。命中真实矛盾即可<b>发起质证</b>。记住：证词与证词无法互证——至少需要一份材料。");
  });
  // 新手引导
  $("#tutNext").onclick = () => {
    if (finishCoach()) return;
    if (tutActive !== true) return;
    tutIdx < TUT_STEPS.length - 1 ? (tutIdx++, renderTutStep()) : endTutorial();
  };
  $("#tutSkip").onclick = () => { if (tutActive === true) endTutorial(); };
  // ESC：关闭最上层弹窗，否则打开暂停菜单
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    for (const id of ["settingsOv","pauseOv","verdictOv","timelineOv","archiveOv"]){
      const el = $("#" + id);
      if (el && !el.classList.contains("hidden")){ el.classList.add("hidden"); AU.click(); return; }
    }
    if (tutActive) return;
    if (!$("#app").classList.contains("hidden") && !S.ended && $("#endingOv").classList.contains("hidden")){
      $("#pauseOv").classList.remove("hidden"); AU.paper();
    }
  });
  // 暂停菜单
  $("#pResume").onclick = () => { AU.click(); $("#pauseOv").classList.add("hidden"); };
  $("#pSettings").onclick = () => { AU.click(); $("#settingsOv").classList.remove("hidden"); };
  $("#pSave").onclick = () => { AU.pinS(); save(); toast("进度已保存"); };
  $("#pQuit").onclick = () => { save(); location.reload(); };
  // 全程引导：跳过
  $("#gSkip").onclick = () => { S.flags.guide = "off"; save(); guideRender(); AU.click(); toast("已关闭全程引导 · 可随时参考顶栏目标条"); };
  // 画像
  $("#revealClose").onclick = () => { AU.click(); closeReveal(); };
  // 裁决
  wireSeal();
  // 结局
  $("#btnRestart").onclick = () => { wipe(); location.reload(); };
  $("#btnEndBoot").onclick = () => location.reload();
  // 设置
  $("#setVol").oninput = e => { SET.vol = e.target.value / 100; saveSet(); AU.setVol(); };
  $("#setMute").onclick = e => { SET.mute = !SET.mute; e.target.textContent = SET.mute ? "开" : "关"; saveSet(); AU.setVol(); };
  $("#setMotion").onclick = e => {
    SET.motion = SET.motion === "auto" ? "减少" : SET.motion === "减少" ? "全开" : "auto";
    e.target.textContent = SET.motion === "auto" ? "跟随系统" : SET.motion;
    document.body.classList.toggle("reduce-motion", SET.motion === "减少");
    saveSet();
  };
  $("#setQuality").onclick = e => {
    SET.quality = SET.quality === "高" ? "中" : SET.quality === "中" ? "低" : "高";
    e.target.textContent = SET.quality; saveSet();
    if (ZeroViz.parts) ZeroViz.build();
  };
  $("#setFont").onclick = e => {
    SET.font = !SET.font; e.target.textContent = SET.font ? "开" : "关";
    document.body.classList.toggle("bigfont", SET.font); saveSet();
  };
  // LLM 在线演绎设置
  if (typeof LLM !== "undefined"){
    const ep = $("#setLlmEp"), keyI = $("#setLlmKey"), modelI = $("#setLlmModel"), onB = $("#setLlmOn"), st = $("#llmStatus");
    ep.value = LLM.cfg.endpoint || ""; keyI.value = LLM.cfg.key || ""; modelI.value = LLM.cfg.model || "";
    onB.textContent = LLM.cfg.enabled ? "开" : "关";
    onB.onclick = () => { LLM.saveCfg({ enabled: !LLM.cfg.enabled }); onB.textContent = LLM.cfg.enabled ? "开" : "关"; AU.click(); };
    ep.onchange = () => LLM.saveCfg({ endpoint: ep.value.trim() });
    keyI.onchange = () => LLM.saveCfg({ key: keyI.value.trim() });
    modelI.onchange = () => LLM.saveCfg({ model: modelI.value.trim() });
    $("#btnLlmTest").onclick = async () => {
      st.textContent = "正在测试连接 …";
      const out = await LLM.test();
      st.textContent = out
        ? `连接成功 · ${LLM.cfg.model} 响应正常（“${out.slice(0, 20)}”）。自由演绎、生成画像与最终陈词已激活。`
        : "连接失败——请检查地址 / Key / 模型名。当前将回落内置剧本，不影响通关。";
    };
  }
  // 后台暂停动画
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ZeroViz.raf){ cancelAnimationFrame(ZeroViz.raf); ZeroViz.raf = null; }
    else if (!document.hidden && !ZeroViz.raf && ZeroViz.ctx){
      const loop = () => { ZeroViz.t += .016; ZeroViz.draw(); ZeroViz.raf = requestAnimationFrame(loop); };
      loop();
    }
  });
}

/* 启动 */
document.addEventListener("DOMContentLoaded", () => {
  if (SET.font) document.body.classList.add("bigfont");
  if (SET.motion === "减少") document.body.classList.add("reduce-motion");
  wireBoot(); wireAll();
});
})();
