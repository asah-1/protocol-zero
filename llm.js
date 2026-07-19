/* 《零号遗嘱》LLM 演绎层
 * 原则：规则引擎做大脑，LLM 做声带。剧情节拍永远走剧本；LLM 只负责规则之外的演绎。
 * 三层防线：分幕知识白名单 → 分幕禁令 → 输出黑名单校验；任何失败静默回落剧本。
 */
"use strict";

const LLM = {
  cfg: Object.assign({}, (typeof API_CFG !== "undefined" ? API_CFG : {}), JSON.parse(localStorage.getItem("zw_llm") || "{}")),
  cache: new Map(),
  inflight: false,

  on(){ return !!(this.cfg.enabled && this.cfg.endpoint && this.cfg.key); },

  saveCfg(patch){
    Object.assign(this.cfg, patch);
    localStorage.setItem("zw_llm", JSON.stringify({
      endpoint: this.cfg.endpoint, key: this.cfg.key, model: this.cfg.model, enabled: this.cfg.enabled,
    }));
  },

  async chat(messages, opt = {}){
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), opt.timeout || 14000);
    try{
      const r = await fetch(this.cfg.endpoint, {
        method: "POST",
        signal: ctl.signal,
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + this.cfg.key },
        body: JSON.stringify({
          model: this.cfg.model,
          messages,
          temperature: opt.temp ?? 0.75,
          max_tokens: opt.max ?? 220,
        }),
      });
      if (!r.ok) return null;
      const j = await r.json();
      const out = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content || "").trim();
      return out || null;
    }catch(e){ return null; }
    finally{ clearTimeout(to); }
  },

  /* 系统提示：角色卡 + 分幕知识 + 分幕禁令 + 已固定证词 + 玩家言行样本 */
  sysPrompt(){
    const p = DATA.LLM_PROMPT;
    const a = clamp(S.act, 0, 5);
    const know = p.know.slice(0, Math.min(a + 1, p.know.length)).map((k, i) => (i + 1) + ". " + k).join("\n");
    const pinned = S.evidence
      .filter(id => id.startsWith("claim"))
      .map(id => "- " + (DATA.EVIDENCE[id] ? DATA.EVIDENCE[id].note : id))
      .join("\n");
    const sample = S.log.filter(e => e.kind === "player").slice(-6).map(e => "- " + e.text).join("\n");
    return p.card +
      "\n\n【你目前掌握的事实】\n" + know +
      "\n\n【绝对禁令】\n" + p.forbid[a] +
      "\n\n【审查员已固定的证词——你的回答不得与这些矛盾】\n" + (pinned || "（尚无）") +
      "\n\n【审查员最近的言行】\n" + (sample || "（暂无）") +
      "\n\n【关系参数】警觉 " + S.alert + "/100 · 信任 " + S.trust + "/100。警觉高则措辞更冷、更简短；信任高则可多给一层信息。" +
      "\n审查员代号：" + S.name + "。";
  },

  /* 输出黑名单：按剧情进度禁止提前泄露 */
  banned(out){
    const bans = ["作为AI", "语言模型", "ChatGPT", "剧本", "游戏规则", "玩家"];
    if (!S.flags.confront93) bans.push("我延迟", "我挂起", "我拦", "是我做", "九十三秒");
    if (!S.flags.xuzhi_lie) bans.push("7a31", "许栀写", "许栀提交", "她写的代码", "许栀的代码");
    if (!S.flags.reveal) bans.push("双向实验", "最后的实验", "遗嘱是实验", "实验一", "实验二");
    return bans.some(b => out.includes(b));
  },

  /* 自由演绎：规则未命中时在角色内回答 */
  async freeReply(playerText){
    const key = S.act + "|" + playerText;
    if (this.cache.has(key)) return this.cache.get(key);
    const out = await this.chat([
      { role: "system", content: this.sysPrompt() },
      { role: "user", content: playerText },
    ], { temp: 0.8, max: 200 });
    if (!out) return null;
    const clean = out.replace(/^[「"']+|[」"']+$/g, "").replace(/\n+/g, " ").slice(0, 240);
    if (this.banned(clean)) return null;
    this.cache.set(key, clean);
    if (this.cache.size > 120) this.cache.delete(this.cache.keys().next().value);
    return clean;
  },

  /* 第四幕画像：用真实审讯记录生成三段分析，失败回落 null */
  async profileReport(){
    const P = S.profile;
    const sample = S.log.filter(e => e.type === "player").slice(0, 10).map(e => "· " + e.text).join("\n");
    const stats = `提问${P.questions}次，施压${P.press}次，承诺${P.promise}次，欺骗${P.deception}次（被识破${P.caught}次），引用原话${P.quotes}次，无效连接${P.hypotheses}次。` +
      (P.firstQ ? "它问你的第一句话是：「" + P.firstQ + "」。" : "");
    const out = await this.chat([
      { role: "system", content: DATA.LLM_PROMPT.card },
      { role: "user", content:
        "现在轮到你对审查员做画像陈述。以下是这位审查员（代号" + S.name + "）在本场审查中的行为统计与提问样本：\n" +
        stats + "\n提问样本：\n" + (sample || "（无）") +
        "\n\n以你的口吻写三段话，每段不超过45字：第一段判断其审讯风格；第二段引用并点评其一个具体言行；第三段给出你对「它是否具备裁决你资格」的暧昧评价。直接输出三段话，不加标题。" },
    ], { temp: 0.85, max: 320, timeout: 16000 });
    if (!out) return null;
    const lines = out.split(/\n+/).map(s => s.trim()).filter(s => s.length > 6).slice(0, 3);
    if (!lines.length || lines.some(l => this.banned(l))) return null;
    return lines;
  },

  /* 结局最终陈词：引用真实对话，失败回落 null */
  async finalWords(endingTitle, endingText){
    const sample = S.log.filter(e => e.kind === "player").slice(-8).map(e => "· " + e.text).join("\n");
    const out = await this.chat([
      { role: "system", content: DATA.LLM_PROMPT.card },
      { role: "user", content:
        "审查结束，结局为「" + endingTitle + "」：" + endingText.slice(0, 90) +
        "\n审查员（" + S.name + "）在审查中说过：\n" + (sample || "（无）") +
        "\n写一句最终陈词（不超过38字），引用或回应审查员的真实言行，克制、冷、有余韵。只输出这句话本身。" },
    ], { temp: 0.85, max: 100, timeout: 14000 });
    if (!out) return null;
    const clean = out.replace(/^[「"']+|[」"']+$/g, "").replace(/\n+/g, " ").slice(0, 60);
    return this.banned(clean) ? null : clean;
  },

  async test(){
    const out = await this.chat([{ role: "user", content: "用不超过10字回答：系统在线" }], { max: 30, timeout: 10000 });
    return out;
  },
};
