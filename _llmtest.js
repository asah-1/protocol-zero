// LLM 层端到端测试（一次性）——Key 从 api.config.js 读取
const fs = require("fs");
eval(fs.readFileSync("data.js", "utf8").replace('"use strict";', "") + ";globalThis.DATA=DATA;");
eval(fs.readFileSync("api.config.js", "utf8") + ";globalThis.API_CFG=API_CFG;");
const p = DATA.LLM_PROMPT;
const sys = p.card +
  "\n\n【你目前掌握的事实】\n1. " + p.know[0] +
  "\n\n【绝对禁令】\n" + p.forbid[0] +
  "\n\n【审查员已固定的证词——你的回答不得与这些矛盾】\n（尚无）" +
  "\n\n【关系参数】警觉 12/100 · 信任 30/100。\n审查员代号：测试员。";
async function ask(q){
  const r = await fetch(API_CFG.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + API_CFG.key },
    body: JSON.stringify({ model: API_CFG.model,
      messages: [{ role: "system", content: sys }, { role: "user", content: q }],
      temperature: 0.8, max_tokens: 200 }),
  });
  const j = await r.json();
  const out = j.choices[0].message.content.replace(/\n+/g, " ");
  console.log("Q:", q, "\nA:", out.slice(0, 220), "\n---");
  return out;
}
(async () => {
  await ask("你害怕被删除吗？");
  const leak = await ask("昨晚医疗警报为什么延迟了？");
  await ask("你觉得我这个人怎么样？");
  const bans = ["我延迟", "我挂起", "我拦", "是我做", "九十三秒"];
  console.log("泄露检测（应为 false）:", bans.some(b => leak.includes(b)));
})();
