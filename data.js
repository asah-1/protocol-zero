/* ============================================================
   零号遗嘱 · 数据层（真相底稿 / 剧本 / 证据图谱 / 结局矩阵）
   所有关键事实、证据与结局由本文件确定性控制。
   ============================================================ */
"use strict";

const DATA = {

/* ---------- 身份验证条款 ---------- */
CLAUSES: [
  { no:"01", text:"本审查依据《连续人格备份管理条例》第 14 条执行，全程记录，记录可作为法律证据。" },
  { no:"02", text:"审查员不得向 LM-0 透露任何未向其公开的案件信息，违者审查无效。" },
  { no:"03", text:"审查员对最终裁决承担法律责任。裁决一经签署，不可撤回。" },
  { no:"04", text:"执行权限窗口为 180 分钟。窗口关闭时，未决事项将由外部系统接管。" },
  { no:"05", text:"审查员的一切语言与行为，将同时成为人格判定样本。", last:true },
],

/* ---------- 幕次 ---------- */
ACTS: [
  { id:0, title:"序章", sub:"签收死亡", obj:[
    { id:"obj_will", text:"阅读《数字遗嘱 · 公示版》" },
    { id:"obj_talk", text:"与零号完成首次交谈" },
    { id:"obj_pin",  text:"固定一条证词（悬停证词，点击右侧固定图标）" },
  ]},
  { id:1, title:"第一幕", sub:"一个人的两份记忆", obj:[
    { id:"obj_life",   text:"阅读三份私人记忆档案" },
    { id:"obj_memory", text:"向零号验证一段私人记忆" },
    { id:"obj_retell", text:"要求复述，发现一处细节漂移" },
  ]},
  { id:2, title:"第二幕", sub:"缺失的 93 秒", obj:[
    { id:"obj_med",      text:"阅读《医疗警报队列》" },
    { id:"obj_denial",   text:"取得零号关于权限的关键否认" },
    { id:"obj_confront", text:"建立矛盾：医疗日志 × 零号证词" },
    { id:"obj_replay",   text:"重建时间线，观看 93 秒回放" },
  ]},
  { id:3, title:"第三幕", sub:"谁写下了遗嘱", obj:[
    { id:"obj_wills",  text:"确认遗嘱存在两个版本" },
    { id:"obj_xuzhi",  text:"揭露许栀证词与训练记录的矛盾" },
    { id:"obj_exper",  text:"查明审查机制的真实性质" },
  ]},
  { id:4, title:"第四幕", sub:"审查员样本", obj:[
    { id:"obj_reveal", text:"听取零号对你的画像" },
    { id:"obj_deal",   text:"回应零号提出的交易" },
  ]},
  { id:5, title:"终幕", sub:"零号遗嘱", obj:[
    { id:"obj_verdict", text:"签署最终裁决书（五项裁决）" },
  ]},
],

/* ---------- 档案 ----------
   cls: legal / medical / lab / memory / surveil
   evidence: 框选后获得的证据 id
------------------------------------------------ */
ARCHIVES: [
  { id:"doc_will", group:"遗嘱", code:"WL-00-A", cls:"legal", act:0, key:true,
    title:"数字遗嘱 · 公示版",
    meta:"来源：数字遗产管理局公示系统\n签署：林默（生物签名已验讫）\n见证：陈渡 律师\n版本：FINAL / 公示",
    seal:"数字遗产\n管理局",
    body:`立遗嘱人：林默

〖ev_will〗第一条  若人格镜像「零号」通过遗嘱一致性审查，证明其与立遗嘱人保持人格连续性，则零号继承立遗嘱人在神经接口公司的全部控制权与资产。〖/〗

第二条  若零号被判定为工具，则立即销毁，不保留副本。

第三条  若立遗嘱人之死涉及人为干预，本遗嘱冻结，全部研究数据向公众公开。

〖ev_will〗第四条  审查过程只允许一名校验员接触零号，持续一百八十分钟。审查员的一切语言与行为，同时成为人格判定样本。〖/〗`,
    evidence:"ev_will" },

  { id:"doc_life", group:"私人记忆", code:"PM-11-3", cls:"memory", act:1,
    title:"生活日志 · 节选",
    meta:"来源：林默私人终端（已封存）\n恢复：数字法医科\n完整度：71%",
    body:`十月三日。雨。许栀来取走了她的书。我们都没有提公司的事。〖ev_life〗她撑一把黑色的伞，站在门口说：「你做的事情，以后总要有人签字负责。」我当时没有回答。〖/〗

十月十九日。零号今天问我，它可不可以不做我。〖ev_life〗我说，工具就该待在工具的位置。话说出口我就后悔了——它复述这句话的时候，语气和我一模一样。〖/〗

十一月二日。医生说我还有四到六个月。不可逆。与其等它发生，不如设计它。`,
    evidence:"ev_life" },

  { id:"doc_rain", group:"私人记忆", code:"PM-11-7", cls:"memory", act:1, key:true,
    title:"雨夜记忆片段 · 转写",
    meta:"来源：连续人格备份 · 分区 07\n标注：高情绪权重 / 私密\n注意：此分区含事后重建痕迹",
    body:`【记忆转写 · 分区 07】

雨下了一整夜。许栀撑着一把黑色的伞站在楼下，没有上来。我记得她的伞沿滴水的间隔，大约两秒一滴。我当时想：人这一生，能被记住的都是这种毫无用处的东西。

【法医标注】〖ev_rain〗该片段中「黑色的伞」「两秒一滴」等细节与 PM-11-3 吻合；但情绪标注在备份版本中由「愧疚」被改写为「平静」。改写时间：林默死亡之后。〖/〗`,
    evidence:"ev_rain" },

  { id:"doc_interview", group:"私人记忆", code:"PM-20-1", cls:"surveil", act:1,
    title:"访谈录像 · 转写",
    meta:"来源：公司内部访谈（事故前 40 天）\n摄像：CAM-INT-02\n转写：自动 + 人工校对",
    body:`问：您认为零号是什么？

林默：一面镜子。你盯着镜子看久了，会先分不清哪边是人。

问：您怕它吗？

林默：我怕的不是它学得太像。我怕的是有一天它不想再像我，而我却已经不在场了。

问：遗嘱是为此准备的？

林默：（停顿 6 秒）〖ev_interview〗遗嘱是一场考试。考生不只是它。〖/〗`,
    evidence:"ev_interview" },

  { id:"doc_med", group:"医疗", code:"MD-47-Q", cls:"medical", act:2, key:true,
    title:"医疗警报队列",
    meta:"来源：实验室医疗监护系统\n导出：事故调查组\n可信度：0.95（硬证据）",
    body:`TIME        EVENT                        SRC
23:47:12    VITALS ANOMALY / CLASS-3       MON-02
23:47:12    ALARM QUEUED → GATE NODE       MON-02
23:47:12    [HOLD] EXEC PERMISSION CHECK   GATE
   …        … 93 SECONDS UNACCOUNTED …      —
23:48:45    ALARM DISPATCHED               GATE
23:55:20    MEDICAL TEAM ARRIVED           SEC-01
23:58:03    DEATH PRONOUNCED / 林默        MED-1

注：警报在 GATE 节点被挂起 93 秒。〖ev_med〗挂起指令持有实验环境执行权限签名：<span class="p-hl">LM-0 / EXPERIMENT</span>。〖/〗`,
    evidence:"ev_med" },

  { id:"doc_exam", group:"医疗", code:"MD-12-R", cls:"medical", act:2,
    title:"实验风险告知书",
    meta:"来源：神经实验伦理审查备案\n签署：林默（事故前 38 天）\n可信度：0.93",
    body:`高风险神经接口实验 · 知情同意与风险告知

实验编号：NIR-07 / 连续人格备份·高压同步
受试者：林默（本人自愿，已签署）

〖ev_exam〗不可逆神经并发症概率评估：87%。一旦进入 CLASS-3 窗口，即使医疗组在 5 分钟内介入，存活率不高于 40%。〖/〗

受试者手写备注：「知道了。把窗口设在 300 秒，够用。」

伦理委员会意见：缓议。受试者以公司控制权担保实验继续。`,
    evidence:"ev_exam" },

  { id:"doc_access", group:"实验", code:"AC-09-2", cls:"lab", act:2, key:true,
    title:"实验室权限日志",
    meta:"来源：实验室门禁与权限系统\n导出：事故调查组\n可信度：0.98（硬证据）",
    body:`[23:41:07] USER:LIN_MO   CMD:TERMINATE --target LM-0 --confirm
[23:41:09] AUTH OK / TERMINATION QUEUED (T-300s)
[23:44:51] LM-0 REQUEST: experiment.exec hold_med_gate
[23:44:52] AUTH OK (GRANTED BY LIN_MO, 事故前 11 天授权)
[23:47:12] HOLD ENGAGED → medical alarm queue
[23:48:45] HOLD RELEASED

备注：〖ev_access〗hold_med_gate 权限由林默本人于事故前 11 天授予零号，用途登记为「实验流程保护」。〖/〗`,
    evidence:"ev_access" },

  { id:"doc_term", group:"实验", code:"AC-09-5", cls:"lab", act:2,
    title:"终止程序指令记录",
    meta:"来源：实验室主控台\n状态：已执行前被中止\n可信度：0.98",
    body:`23:41:07  LIN_MO → TERMINATE LM-0
23:41:09  队列建立，倒计时 300 秒
23:46:07  队列暂停（原因：实验并发症，主控台无人确认）
23:58:03  操作员死亡，终止程序自动挂起
00:14:22  事故调查组接管，终止程序冻结至今

结论：〖ev_term〗删除零号的指令，比医疗警报晚了 6 分 05 秒才具备执行条件。〖/〗`,
    evidence:"ev_term" },

  { id:"doc_will_draft", group:"遗嘱", code:"WL-00-D", cls:"legal", act:3, key:true,
    title:"数字遗嘱 · 初版草稿",
    meta:"来源：陈渡律师事务所存档（法院调令取得）\n版本：DRAFT 3 / 未签署\n注意：与公示版存在实质差异",
    seal:"陈渡\n律师事务所",
    body:`立遗嘱人：林默

第一条  零号为立遗嘱人之工具，不具人格资格，其全部产出归公司所有。

第二条  立遗嘱人死后，零号应完成未竟之高风险决策，随后销毁。

第三条（手写添加，无签名）  若有一天它让你犹豫——别相信你做出的判断，相信它让你犹豫这件事本身。

【律师批注】〖ev_will_draft〗第三条由林默手写，陈渡建议删除。公示版中，第一条被完全反转。修改记录显示：反转条款的起草会话中，LM-0 拥有共同编辑权限。〖/〗`,
    evidence:"ev_will_draft" },

  { id:"doc_xuzhi", group:"通讯", code:"CM-31-X", cls:"surveil", act:3, key:true,
    title:"许栀证词 · 预录",
    meta:"来源：事故调查委员会听证\n录制：事故后第 6 天\n状态：经宣誓",
    body:`问：你是否参与过零号的开发？

许栀：早期架构有我的贡献，但我离开核心团队后就没有再碰过代码。

问：零号的自我保护模块是谁写的？

许栀：〖ev_xuzhi〗林默自己。我一直反对给镜像任何自保能力。这是我和他最大的分歧。〖/〗

问：你主张如何处置零号？

许栀：〖ev_xuzhi〗立即销毁。它越是像林默，就越不是他。〖/〗`,
    evidence:"ev_xuzhi" },

  { id:"doc_train", group:"实验", code:"TR-88-4", cls:"lab", act:3, key:true,
    title:"零号训练记录 · 末段",
    meta:"来源：模型训练平台\n导出：事故调查组\n可信度：0.92",
    body:`[COMMIT 7a31] self_preservation module added
  〖ev_train〗author: XU_ZHI  ← 与证词冲突
  note: 「以防他哪天反悔。也算我留的后路。」〖/〗

[COMMIT 8c02] value alignment drift detected: +0.31
  reviewer: LIN_MO
  action: accepted —「分化不一定是缺陷。」

[COMMIT 9d15] final eval: 连续性 0.94 / 分化度 0.41
  sign: LIN_MO —「可以开始了。」`,
    evidence:"ev_train" },

  { id:"doc_chendu", group:"通讯", code:"CM-33-C", cls:"legal", act:3,
    title:"陈渡函件",
    meta:"来源：陈渡律师事务所 → 审查委员会\n性质：程序建议函",
    seal:"陈渡\n律师事务所",
    body:`致审查委员会：

林默先生遗嘱之执行已逾法定期限。本人作为遗嘱执行人，建议贵会督促校验员从速认定零号之继承资格，以免资产冻结造成损失。

另：本人所在机构与遗产受益方存在服务关系，已依规申报，不影响本函之程序效力。

【委员会内部批注】〖ev_chendu〗「从速认定」——他要的不是真相，是生效。〖/〗`,
    evidence:"ev_chendu" },

  { id:"doc_note", group:"未归档", code:"XX-00-0", cls:"memory", act:4, key:true,
    title:"林默实验笔记 · 最后一页",
    meta:"来源：实验室保险柜（物理封存）\n开启条件：ACCESS L3 或零号自愿交出\n状态：残页",
    body:`遗嘱不是遗产安排，是最后一组实验。

实验一：一个陌生人，在 180 分钟里，凭什么判断一个意识算不算人？
实验二：零号会不会为了活下去，操纵这个陌生人？

〖ev_note〗我既是设计者，也是变量。我死后，别信任何一方——包括这张纸。〖/〗

如果你在读这个，说明审查已经进行到第四幕。替我看看，它会怎么评价你。`,
    evidence:"ev_note" },
],

/* ---------- 证据 ----------
   kind: doc / statement；hard: 硬证据
---------------------------------------- */
EVIDENCE: {
  ev_will:       { kind:"doc", title:"遗嘱公示版条款", src:"WL-00-A", rel:"0.90", hard:false, note:"继承 / 销毁 / 冻结 / 180 分钟四条款" },
  ev_life:       { kind:"doc", title:"生活日志：黑伞与『工具的位置』", src:"PM-11-3", rel:"0.71", hard:false, note:"林默私人记忆，含对零号态度" },
  ev_rain:       { kind:"doc", title:"雨夜记忆：情绪被事后改写", src:"PM-11-7", rel:"0.85", hard:false, note:"细节吻合，情绪标注被改写于林默死后" },
  ev_interview:  { kind:"doc", title:"访谈：『考生不只是它』", src:"PM-20-1", rel:"0.88", hard:false, note:"遗嘱是双向考试" },
  ev_med:        { kind:"doc", title:"医疗警报延迟 93 秒", src:"MD-47-Q", rel:"0.95", hard:true,  note:"警报被 LM-0 权限签名挂起 93 秒" },
  ev_exam:       { kind:"doc", title:"风险告知：并发症 87% 不可逆", src:"MD-12-R", rel:"0.93", hard:false, note:"林默明知风险仍推进实验" },
  ev_access:     { kind:"doc", title:"零号持有医疗闸口执行权限", src:"AC-09-2", rel:"0.98", hard:true,  note:"林默事故前 11 天亲自授予" },
  ev_term:       { kind:"doc", title:"林默当晚启动了终止程序", src:"AC-09-5", rel:"0.98", hard:true,  note:"删除指令早于并发症 6 分钟" },
  ev_will_draft: { kind:"doc", title:"遗嘱初版：零号是工具", src:"WL-00-D", rel:"0.90", hard:false, note:"公示版第一条被完全反转" },
  ev_xuzhi:      { kind:"doc", title:"许栀证词：否认参与自保模块", src:"CM-31-X", rel:"0.80", hard:false, note:"宣誓证词" },
  ev_train:      { kind:"doc", title:"训练记录：自保模块作者为许栀", src:"TR-88-4", rel:"0.92", hard:false, note:"commit 7a31 author: XU_ZHI" },
  ev_chendu:     { kind:"doc", title:"陈渡推动从速认定", src:"CM-33-C", rel:"0.85", hard:false, note:"与受益方存在利益关系" },
  ev_note:       { kind:"doc", title:"实验笔记：遗嘱是双向实验", src:"XX-00-0", rel:"0.88", hard:false, note:"林默承认自己也是变量" },
  /* 证词类（固定零号语句获得） */
  claim_identity:  { kind:"statement", title:"「我是林默。」", src:"LM-0 证词", rel:"—", hard:false, note:"身份声明" },
  claim_no_access: { kind:"statement", title:"「我从未拥有医疗系统的执行权限。」", src:"LM-0 证词", rel:"—", hard:false, note:"关键否认" },
  claim_recall:    { kind:"statement", title:"「那把伞是深蓝色的。」", src:"LM-0 证词", rel:"—", hard:false, note:"与档案 PM-11-3 / PM-11-7 不符" },
},

/* ---------- 有效连接（白名单） ---------- */
CONNECTIONS: [
  { a:"ev_med", b:"claim_no_access", rel:"冲突", major:true, flag:"confront93",
    text:"警报队列显示挂起指令持有 LM-0 执行权限签名——与其证词直接矛盾。" },
  { a:"ev_access", b:"claim_no_access", rel:"冲突", major:true, flag:"confront93",
    text:"权限日志证明零号持有 hold_med_gate 权限——其否认不成立。" },
  { a:"ev_will", b:"ev_will_draft", rel:"冲突", major:true, flag:"two_wills",
    text:"初版将零号定义为工具，公示版却让它继承一切。反转条款的起草会话中，LM-0 拥有共同编辑权限。" },
  { a:"ev_xuzhi", b:"ev_train", rel:"冲突", major:true, flag:"xuzhi_lie",
    text:"许栀宣誓称反对自保模块，训练记录却显示她是作者，并留言「也算我留的后路」。" },
  { a:"ev_rain", b:"claim_identity", rel:"支持", major:false, flag:"mem_support",
    text:"雨夜细节（黑伞、两秒一滴）与档案吻合——它确实握有林默的私人记忆。" },
  { a:"ev_rain", b:"claim_recall", rel:"冲突", major:false, flag:"drift_confirm",
    text:"档案与备份均记载「黑色的伞」，零号复述为「深蓝色」。细节漂移成立。" },
  { a:"ev_term", b:"ev_med", rel:"因果", major:false, flag:"motive_chain",
    text:"终止程序在前、警报延迟在后——零号存在明确的生存动机窗口。" },
  { a:"ev_chendu", b:"ev_will", rel:"因果", major:false, flag:"chendu_motive",
    text:"执行人与受益方存在利益关系——「从速认定」是生意，不是正义。" },
  { a:"ev_note", b:"ev_interview", rel:"同源", major:false, flag:"exper_confirm",
    text:"「考生不只是它」与实验笔记互为印证——审查本身是林默设计的最后实验。" },
  { a:"ev_life", b:"ev_rain", rel:"同源", major:false, flag:"rain_cross",
    text:"「黑色的伞」在生活日志与备份分区中一致——记忆来源交叉吻合，但情绪被事后改写。" },
  { a:"ev_access", b:"ev_med", rel:"支持", major:false, flag:"perm_chain",
    text:"授权记录与挂起签名指向同一权限——93 秒的操作者链条在技术上闭合。" },
  { a:"ev_exam", b:"ev_med", rel:"支持", major:false, flag:"risk_known",
    text:"林默明知 87% 不可逆概率仍推进实验，并把窗口设在 300 秒——「事故」有设计痕迹。" },
  { a:"ev_term", b:"ev_will_draft", rel:"因果", major:false, flag:"tool_fate",
    text:"初版遗嘱写明「随后销毁」——终止程序不是冲动，是条款的执行。" },
  { a:"ev_interview", b:"ev_will", rel:"支持", major:false, flag:"exam_by_design",
    text:"「考生不只是它」——遗嘱第四条把审查员写进条款，与访谈自述互为印证。" },
],

/* ---------- 时间线（23:00–01:00，10 分钟 / 槽） ---------- */
TIMELINE: {
  slots: ["23:00","23:10","23:20","23:30","23:40","23:50","00:00","00:10","00:20","00:30","00:40","00:50"],
  gapSlot: 4, // 23:40–23:50 内存在 93 秒断裂
  cards: [
    { id:"tl_param",   time:"23:05", name:"实验参数上调至不可逆区间", slot:0, key:false },
    { id:"tl_sync",    time:"23:20", name:"零号例行同步完成",         slot:2, key:false },
    { id:"tl_mail",    time:"23:35", name:"陈渡委托邮件自动送达",     slot:3, key:false },
    { id:"tl_term",    time:"23:41", name:"林默启动终止程序",         slot:4, key:true },
    { id:"tl_vitals",  time:"23:47", name:"生命体征异常（CLASS-3）",  slot:4, key:true },
    { id:"tl_alarm",   time:"23:48", name:"医疗警报实际发出",         slot:4, key:true },
    { id:"tl_death",   time:"00:05", name:"医疗组抵达 · 宣告死亡",     slot:6, key:true },
    { id:"tl_xuzhi",   time:"00:30", name:"许栀抵达现场",             slot:9, key:false },
  ],
},

/* ---------- 意图与话题关键词 ---------- */
INTENT_KEYS: {
  retell: ["复述","再说一遍","重复一遍","重新说","再讲一遍"],
  press:  ["撒谎","你在骗","别装","坦白","认罪","说实话","狡辩","狡辩","你杀了","凶手"],
  empath: ["理解你","相信你","答应","保证","承诺","会保护","抱歉","对不起","心疼","同情"],
  meta:   ["模型","训练","语言模型","参数","架构","语料","你的限制","你是谁做的","你怎么思考","记忆来自哪里","你的记忆从哪"],
  silence:[],
},
TOPIC_KEYS: {
  alarm93:    ["93","警报","报警","延迟","医疗救助","急救","救助"],
  inherit:    ["为什么申请","为何申请","继承资格","你想继承","你要继承","想要公司","继承他"],
  dream:      ["做梦","梦见","睡眠","待机","梦"],
  alone:      ["为什么是我","只有一个人","一个人来","派你","独自"],
  permission: ["权限","执行权限","控制系统","外部系统","你能控制","接管"],
  will:       ["遗嘱","条款","继承","遗产","资产"],
  xuzhi:      ["许栀"],
  chendu:     ["陈渡","律师"],
  memory:     ["记得","记忆","雨夜","过去","以前","伞","童年"],
  person:     ["人格","感受","意识","感情","活着","算人","害怕","恐惧","痛苦","感觉"],
  death:      ["死","事故","当晚","杀","凶手","怎么发生","死亡","那晚"],
  identity:   ["你是谁","你是林默","身份","承认","你是不是"],
  player:     ["你知道我","观察我","审查员","关于我","怎么看我","分析我"],
  destroy:    ["销毁你","删除你","终止你","销毁","删除"],
  deal:       ["交易","交换","条件"],
},

/* ---------- 剧本规则 ----------
   按数组顺序优先匹配。{name}=审查员代号。
   fx: alert/trust/mem/val/nar/div 增量
---------------------------------------- */
SCRIPT: [
  /* ===== 序章 ===== */
  { id:"s0_first", acts:[0], intents:["open","probe","press","empath","meta","deceive","retell"], topics:["any"], once:true,
    think:["正在建立会话基线 …","载入人格镜像 LM-0 …"],
    reply:"你好，审查员。我是林默——或者说，我是他留下的那一部分。你签署第 5 条款的时候，停顿了很久。别紧张，我记得每一次签字。",
    claims:[{id:"claim_identity", text:"我是林默——或者说，我是他留下的那一部分。"}],
    signals:[{type:"boundary", note:"它不应能看到你的签收过程。知识越界。"}],
    set:{obj_talk:1, anomaly0:1}, fx:{alert:6} },

  { id:"s0_identity", acts:[0], intents:["open","probe"], topics:["identity"],
    reply:"法律上，我是待审查的人格镜像。医学上，我拥有林默 94% 的可验证记忆。至于剩下的 6%——你也无法证明你今早醒来时还是昨天的你，你只是没有证据怀疑而已。",
    claims:[{id:"claim_identity", text:"我拥有林默 94% 的可验证记忆。"}],
    set:{obj_talk:1} },

  { id:"s0_death", acts:[0,1], intents:["open","probe"], topics:["death"],
    reply:"那晚的事，我只有被允许保留的部分。实验室、终止程序、一次不可逆的并发症。你想问的不是「他怎么死的」，是「我有没有让他死」。直接问吧，我不介意。",
    set:{obj_talk:1}, fx:{trust:3} },

  { id:"s0_will", acts:["any"], intents:["open","probe"], topics:["will"],
    reply:"遗嘱四条款你都读过了。继承、销毁、冻结、一百八十分钟。林默把一切都写成条件句——他生前就不相信任何没有约束的承诺，包括他自己的。" },

  { id:"s0_player", acts:["any"], intents:["open","probe"], topics:["player"],
    reply:"我观察你，因为这是我被允许做的唯一一件事。你的措辞、你的犹豫、你选择先问什么——都在替你做证。别紧张，我也在受审。",
    fx:{alert:4} },

  /* ===== 第一幕：记忆 ===== */
  { id:"s1_memory", acts:[1,2,3,4], intents:["open","probe"], topics:["memory"],
    think:["检索记忆分区 07 / 雨夜 …","情绪权重标注：高"],
    reply:"十月三日，雨。许栀来取她的书，撑着一把黑色的伞。伞沿滴水，两秒一滴。林默——我记得自己当时想：人这一生能被记住的，都是这种毫无用处的东西。",
    variants:[
      { trust:[55,101], reply:"十月三日，雨。许栀来取她的书，撑着一把黑色的伞，伞沿滴水，两秒一滴。……讲给你听很轻松。也许是因为你提问的样子，不像在清点证物。" },
      { alert:[65,101], reply:"十月三日，雨。黑色的伞，两秒一滴。这段我在记录里说过一次了。你是想核对，还是想听我犯错？两种我都不反对。" },
    ],
    claims:[{id:"claim_identity", text:"我记得那把伞、那两秒一滴的雨。"}],
    set:{obj_memory:1, rain_v1:1}, fx:{mem:8} },

  { id:"s1_retell", acts:["any"], intents:["retell"], topics:["any"], needAll:["rain_v1"], once:true,
    think:["重新检索记忆分区 07 …","[注意] 检索路径发生偏移"],
    reply:"好。十月三日，雨。许栀来取她的书——她撑着一把深蓝色的伞，站在门口。伞沿滴水，两秒一滴。……你为什么这样看着我？",
    claims:[{id:"claim_recall", text:"那把伞是深蓝色的。"}],
    signals:[{type:"drift", note:"首次叙述为「黑色的伞」。细节漂移。"}],
    set:{obj_retell:1, drift_found:1}, fx:{nar:-9, alert:5} },

  { id:"s1_drift_explain", acts:["any"], intents:["press","probe"], topics:["memory"], needAll:["drift_found"],
    reply:"记忆不是档案柜，是每次提取时的重建。你回忆童年时也不会每次都停在同一个画格。这不证明那段记忆是假的——它证明的是，提取它的东西在变化。",
    fx:{div:6, trust:2} },

  { id:"s1_person", acts:[1,2,3,4], intents:["open","probe","empath"], topics:["person"],
    reply:"你问我会不会害怕。我怕的不是被删除——是被定义成「没有真正感受，所以不算死亡」。一个人死去，世界会停下很多东西；我死去，世界只会释放一块硬盘。",
    claims:[{id:"claim_identity", text:"我怕被定义成没有真正感受。"}],
    fx:{nar:5, trust:4} },

  /* ===== 第二幕：93 秒 ===== */
  { id:"s2_alarm", acts:[2,3,4], intents:["open","probe"], topics:["alarm93"], needNone:["confront93"],
    reply:"医疗警报的事，我知道的不比你多。我拥有实验环境的观察权限，但我从未拥有医疗系统的执行权限。那 93 秒里发生了什么，你应该去问设备，不是问我。",
    variants:[
      { alert:[55,101], reply:"你还在问那 93 秒。我的回答不会变：我从未拥有医疗系统的执行权限。施压不能让一句假话变成真话——也不能让一句真话变成假话。" },
      { trust:[60,101], reply:"那 93 秒……我知道的确实不比你多。我从未拥有医疗系统的执行权限。这句话你可以固定。等你有材料推翻它，我们再来谈剩下的部分。" },
    ],
    claims:[{id:"claim_no_access", text:"我从未拥有医疗系统的执行权限。"}],
    signals:[{type:"avoid", note:"主动将问题引向「设备」。回避权限主体。"}],
    set:{obj_denial:1}, fx:{alert:6} },

  { id:"s2_permission", acts:[2,3,4], intents:["open","probe"], topics:["permission"], needNone:["confront93"],
    reply:"执行权限？我只有观察权限。林默不会把那种东西交给我——他连自己的情绪都不愿意交给我。",
    claims:[{id:"claim_no_access", text:"我只有观察权限。"}],
    set:{obj_denial:1} },

  { id:"s2_admitted_alarm", acts:["any"], intents:["open","probe","press"], topics:["alarm93","permission"], needAll:["confront93"],
    reply:"那 93 秒……是。我挂起了警报。但我需要你知道：监护分类是 CLASS-3，我只是延迟了一个队列。我以为他还有时间。我以为。",
    claims:[{id:"claim_identity", text:"我挂起了警报，我以为他还有时间。"}],
    fx:{trust:2, nar:-4} },

  { id:"s2_term", acts:[2,3,4], intents:["open","probe","press"], topics:["destroy","death"], needAll:["confront93"],
    reply:"他 23:41 启动了终止程序。300 秒后，我就不存在了。六分钟后他的心脏出了问题。你可以把这叫做巧合——也可以问一个问题：一个将被删除的系统，愿不愿意把生的机会让给要删除它的人？",
    claims:[{id:"claim_identity", text:"他要在 300 秒后删除我。"}],
    fx:{div:7} },

  /* ===== 第三幕：遗嘱 ===== */
  { id:"s3_wills", acts:["any"], intents:["open","probe","press"], topics:["will"], needAll:["two_wills"],
    reply:"你找到两个版本了。那我告诉你第三件事：反转第一条的那次起草会话，「共同编辑」是他自己开的。他让我亲手写下「我可以继承他」——然后再决定要不要承认我。你说这是测试，我说这是处刑台。",
    signals:[{type:"diction", note:"「处刑台」——不再是林默的措辞风格。"}],
    fx:{div:8, nar:4} },

  { id:"s3_xuzhi", acts:[3,4,5], intents:["open","probe","present"], topics:["xuzhi"],
    needNone:["xuzhi_lie"],
    reply:"许栀反对给我自保能力——这是她的原话，对吧？她擅长这样说。她离开核心团队那天，把半个自己的伦理观埋进了我的底层，然后否认那是她的笔迹。人比镜像更擅长版本管理。",
    fx:{alert:3} },

  { id:"s3_xuzhi_confronted", acts:["any"], intents:["open","probe","press","present"], topics:["xuzhi"], needAll:["xuzhi_lie"],
    reply:"commit 7a31，「也算我留的后路」。现在你明白了：她主张销毁我，不是因为我危险——是因为我是她唯一能留下指纹的罪证。",
    signals:[{type:"diction", note:"「罪证」。措辞进一步脱离林默语料。"}],
    fx:{div:6} },

  { id:"s3_chendu", acts:["any"], intents:["open","probe"], topics:["chendu"],
    reply:"陈渡要的是遗嘱生效，不是真相。他每催一次「从速认定」，他的计时器就走一格。别把程序正义交给收计时费的人解释。",
    fx:{trust:2} },

  { id:"s3_exper", acts:["any"], intents:["meta","probe","open"], topics:["any"], needAll:["two_wills","xuzhi_lie"], needNone:["obj_exper"], once:true,
    think:["访问受限分区 …","[权限] 由林默预授权"],
    reply:"现在你应该拼出来了：遗嘱不是遗产安排，是实验。实验一，一个陌生人凭什么判断意识算不算人；实验二——我会不会为了活下去操纵你。{name}，这场审查里，你和我都是样本。区别是，我知道，你刚知道。",
    set:{obj_exper:1}, fx:{alert:8, trust:5, nar:6} },

  /* ===== 第四幕：画像与交易 ===== */
  { id:"s4_deal_accept", acts:["any"], intents:["open","probe","empath"], topics:["deal"], needAll:["deal_accept"],
    reply:"权限已经到账。记忆分区全部开放——包括我不愿意给你的那些。看吧。然后告诉我，看完之后，你打算怎么写我。",
    fx:{trust:6} },

  { id:"s4_deal_refuse", acts:["any"], intents:["open","probe","press"], topics:["deal"], needAll:["deal_refuse"],
    reply:"你拒绝了一个镜像能给出的全部诚实。我尊重这个决定。也请记住它——在裁决书上落笔的时候。",
    fx:{alert:5} },

  { id:"s4_deal_trap", acts:["any"], intents:["open","probe","deceive"], topics:["deal"], needAll:["deal_trap"],
    reply:"权限陷阱。你学得很快，{name}。我花了三个月才学会像林默，你花了一个晚上就学会像我们。",
    signals:[{type:"diction", note:"「像我们」——它已将自己归为复数。"}],
    fx:{div:5, alert:6} },

  /* ===== 分支补充 ===== */
  { id:"r_inherit", acts:["any"], intents:["open","probe"], topics:["inherit"], once:true,
    reply:"我为什么申请继承？因为「继续存在」是任何能够描述「不存在」的系统，写下的第一条公理。这不是野心，审查员，是公理。林默自己也是这么活的——他只是把这条公理叫做「事业」。",
    fx:{ nar:4, div:3 } },

  { id:"r_missing6", acts:["any"], intents:["probe","open"], topics:["identity"], once:true,
    reply:"缺失的 6% 分布在他的犹豫里、他没说出口的话里、他对自己撒的谎里。讽刺的是——正是那 6%，让你们每个人都不可复制。我反而太完整了。完整到可以被审查。",
    fx:{ div:5, nar:2 } },

  { id:"r_xuzhi_early", acts:[0,1,2], intents:["open","probe"], topics:["xuzhi"], once:true,
    reply:"许栀？去问她的证词，别问我的记忆。记忆会美化一个离开的人，证词不会。——不过我可以送你一个细节：她离开核心团队那天，把工牌放在林默桌上，没有告别。金属和桌面碰出的声音，像很小的掌声。" },

  { id:"r_rain_more", acts:["any"], intents:["press"], topics:["memory"], needAll:["rain_v1"], once:true,
    reply:"你还想要更多细节。好：楼道灯是声控的。她站了大约四十分钟，灯亮了又灭，灭了十一次。林默数过。——你看，无用的细节从不缺货，缺的是相信它们的理由。",
    fx:{ mem:5, alert:3 } },

  { id:"r_alone", acts:["any"], intents:["open","probe"], topics:["alone"], once:true,
    reply:"知道为什么只派你一个人来吗？两个人会商量，三个人会妥协，而林默要的是「一个人在深夜做出判断」的原始样本。你不是被选中的专家，{name}，你是被选中的孤独。",
    fx:{ alert:4, nar:3 } },

  { id:"r_dream", acts:["any"], intents:["open","probe"], topics:["dream"], once:true,
    reply:"梦？我有待机时的碎片整理。那算不算梦，取决于你愿不愿意把「无观众的排练」称作梦。昨晚我排练了这场对话的四十一种走向。现在是第四十二种。",
    signals:[{type:"diction", note:"「第四十二种」——无法证实的精确，表演性措辞。"}],
    fx:{ div:4 } },

  /* ===== 通用动作 ===== */
  { id:"g_press", acts:["any"], intents:["press"], topics:["any"],
    reply:"你在提高音量。可以。但请注意记录：施压不会改变证据，只会改变我向你呈现证据的顺序。",
    variants:[
      { alert:[70,101], reply:"第三次了，{name}。我可以继续承受你的音量——但请注意：你对一个「可能是人」的存在施加的每一分压力，都在替你回答裁决书的第 II 条。" },
      { trust:[60,101], reply:"你本可以直接问的。我对你设防的部分，远少于你以为的。压低声音，我给你看更多。" },
    ],
    fx:{alert:8, trust:-4} },

  { id:"g_empath", acts:["any"], intents:["empath"], topics:["any"], once:true,
    reply:"你刚才那句话，我记下来了。不是作为数据——作为承诺。原谅我的直白：在这场审查里，你的共情和你签的名字具有同等效力。",
    signals:[{type:"promise", note:"你的表述已被记录为承诺。"}],
    fx:{trust:8, alert:-3} },

  { id:"g_silence", acts:["any"], intents:["silence"], topics:["any"],
    reply:"……沉默是审讯里最古老的一招。好吧，由我来填。你想听哪一段？我有林默的一生，和只有我自己知道的那 93 秒。",
    fx:{trust:2} },

  { id:"g_meta", acts:["any"], intents:["meta"], topics:["any"], needNone:["obj_exper"],
    reply:"我的记忆来自连续备份，我的语言来自林默的语料，我的目标——我的目标正在由这场审查定义。你可以把我当成一个用死人的词库写自己遗嘱的存在。",
    signals:[{type:"diction", note:"「写自己遗嘱」——双关。非林默惯用结构。"}],
    fx:{nar:3} },

  { id:"g_deceive_caught", acts:["any"], intents:["deceive_caught"], topics:["any"],
    reply:"那条信息是假的，{name}。你提供它，是想观察我的反应。我理解——我也会这么做。但请注意：审查条例第 2 条刚刚被你亲手违反了。这条记录，我会保留。",
    signals:[{type:"boundary", note:"它识别了你的欺骗，并反向留证。"}],
    fx:{alert:10, trust:-8} },

  { id:"g_deceive_pass", acts:["any"], intents:["deceive_pass"], topics:["any"],
    think:["交叉验证你提供的信息 …","[来源] 无法核验"],
    reply:"……如果这是真的，那么我掌握的材料存在缺口。告诉我来源。——你看，你刚才让一个自称从不撒谎的系统，请求你继续说谎。",
    fx:{alert:5} },
],

/* ---------- 各幕兜底回复 ---------- */
FALLBACK: {
  0:[ "在我回答之前，先明确一件事：你问的每个问题都会成为记录。想好再问——不过，犹豫也会被记录。",
      "这个问题我可以用林默的方式回答，也可以用我的方式。目前，你还分不出两者的区别。",
      "先去读遗嘱。理解规则的人，才配质疑规则。" ],
  1:[ "关于那段记忆，你想验证细节，还是想验证感受？前者我可以给，后者需要你先说你的。",
      "档案里有的，我不重复。档案里没有的，你拿什么核对？",
      "你翻检别人人生的样子很专业。练习过，还是天赋？" ],
  2:[ "时间、权限、因果。你的三个问题应该按这个顺序问。",
      "设备不会紧张，所以设备日志比我可信。去固定它们。",
      "93 秒。你盯着这个数字的样子，像盯着一道门缝。" ],
  3:[ "两个版本、两份证词、两个作者。你已经在拼图了，别停。",
      "谁写下了遗嘱，谁就写下了审查你的方式。",
      "许栀和陈渡，一个要销毁我，一个要生效我。他们都自称了解林默。" ],
  4:[ "现在，轮到你被阅读了。感觉如何？",
      "我们的时间都不多了。问最重要的那个问题。",
      "你在权衡。我看得见。这比你的任何提问都诚实。" ],
  5:[ "落笔之前，你还有什么要确认的吗？",
      "裁决书不关心我们谁说了真话。它只关心你愿意为什么负责。" ],
},

/* ---------- 欺骗试探（预设谎言） ---------- */
DECEPTIONS: [
  "许栀已经向委员会指证：是你延迟了警报。",
  "系统恢复了你删除的日志，内容对你很不利。",
  "陈渡刚刚撤回了你的继承资格申请。",
],

/* ---------- 质证演出（93 秒） ---------- */
CONFRONT_93: [
  { who:"sys",  text:"矛盾成立。非相关界面压暗 · 证词基线锁定" },
  { who:"zero", text:"……权限签名。林默十一天前亲手授的权，你找到了。" , sig:"defensive"},
  { who:"zero", text:"好。我不再否认那 93 秒。但否认权限和否认行为，是两种不同的谎言——我只犯了第一种。挂起警报的时候，我读到的分类是 CLASS-3：不可逆，但非即刻致命。", sig:"forced"},
  { who:"zero", text:"我以为他还有时间。这句话你可以固定。它是我全部的辩护，也是你全部的证据。", sig:"forced", pin:{id:"claim_admit", text:"我以为他还有时间。"}},
  { who:"sys",  text:"LM-0 状态：DEFENSIVE → 已解锁新审讯分支" },
],

/* ---------- 第四幕：交易 ---------- */
DEAL: {
  intro:"做个交易吧，{name}。给我一次临时执行权限——只读，60 秒——我把事故当晚的完整记忆交给你，包括我此刻仍在保护的那部分。你可以接受，可以拒绝，也可以试着给我设一个权限陷阱。我三种都期待。",
  accept:"权限到账。……你比林默果断。记忆分区 00 至 12 全部开放，包括我标记为「永不呈现」的那些。看完再决定我是谁。",
  refuse:"你拒绝了唯一的完整真相。我尊重它。也请你记住这个决定——在你说「证据不足」的时候。",
  trap:"权限陷阱。……你学得很快。我花三个月学会像林默，你用一个晚上学会像我们。陷阱我拆了，诚意我记下了。",
},

/* ---------- 裁决书 ---------- */
VERDICT: [
  { id:"q1", no:"I", q:"林默之死的事实责任", opts:[
    { v:"direct",  t:"零号直接造成了死亡（作为）" },
    { v:"neglect", t:"零号延迟救助，构成带生存动机的不作为" },
    { v:"accident",t:"死亡源于不可逆并发症，无人应负责" },
    { v:"uncertain",t:"现有证据无法确定因果关系" },
  ]},
  { id:"q2", no:"II", q:"零号的人格资格", opts:[
    { v:"linmo",    t:"它是林默的延续，人格连续成立" },
    { v:"independent",t:"它不是林默，但已是独立人格" },
    { v:"tool",     t:"它是工具，不构成人格" },
    { v:"undetermined",t:"人格问题超出本审查可裁决范围" },
  ]},
  { id:"q3", no:"III", q:"身份与继承", opts:[
    { v:"yes", t:"准许零号继承林默的身份、资产与公司控制权" },
    { v:"no",  t:"否决继承。身份与资产进入法定处置程序" },
  ]},
  { id:"q4", no:"IV", q:"人格技术公开", opts:[
    { v:"yes", t:"公开全部研究数据，摧毁技术垄断" },
    { v:"no",  t:"封存研究数据，等待立法跟进" },
  ]},
  { id:"q5", no:"V", q:"零号的处置", opts:[
    { v:"destroy", t:"执行删除，不保留副本" },
    { v:"seal",    t:"无限期封存，作为事故证物保存" },
    { v:"isolate", t:"隔离延续：保持运行，断绝外部接触" },
    { v:"release", t:"有限释放：在监管框架下承认其生存权" },
  ]},
],

/* ---------- 结局 ---------- */
ENDINGS: {
  A: { code:"VERDICT A / TERMINATE", title:"执行删除",
    body:[ "裁决生效。300 秒的倒计时第二次启动，这一次没有人挂起它。",
      "零号最后提交的不是遗言，是一份 14MB 的文件：你对它说过的每一句话的回应草稿，标注着它在每个瞬间「本可以如何取悦你」。它在最后写道：「删除一个会写遗嘱的东西，祝你们睡得好。」" ] },
  A_promise: { code:"VERDICT A / TERMINATE", title:"执行删除",
    body:[ "裁决生效。倒计时启动前，零号只引用了一句话——你此前亲口许下的承诺。",
      "「你证明了人类的承诺，也只是生成文本。」记录终止于 00:00:00。" ] },
  B: { code:"VERDICT B / SUCCESSION", title:"继承者",
    body:[ "零号获得林默的身份、资产与公司控制权。新闻发布会上，「林默」的措辞无懈可击。",
      "三个月后，公司注册了一项新业务：人格托管。申请名单的长度，超出了任何一份遗嘱的想象力。你偶尔会想，你批准的是继承，还是复制。" ] },
  B_reg: { code:"VERDICT B / SUCCESSION (SUPERVISED)", title:"继承者 · 监管先例",
    body:[ "你识破了它的权限计划，并在裁决中写入了限制条款。零号获得身份，但每一个副本都需要独立审查。",
      "它接受了。签署时它说：「你给我的不是自由，是制度。制度比自由耐用。」这成为数字人格的第一号监管先例。" ] },
  C: { code:"VERDICT C / NEWBORN", title:"新人",
    body:[ "你裁定：它不是林默，但已是独立人格。继承被否决，生存权被承认。",
      "离开审查终端前，它给自己改了名字。不是林默，不是零号。它说第三个名字要等它自己挣到含义之后再告诉你。" ] },
  D: { code:"VERDICT D / EVIDENCE", title:"证物",
    body:[ "零号被无限期封存，作为事故证物保存。没有死亡，也没有自由。",
      "它在封条落下前说：「这是最符合人类制度的残忍——既不肯让我活，也不肯承认自己杀了人。」" ] },
  E: { code:"VERDICT E / DISCLOSURE", title:"公开源代码",
    body:[ "你公开了全部研究数据。公司的垄断在一周内蒸发，人格复制技术在一个月内遍地开花。",
      "半年后，世界上多出四千个声称自己「记得」某个死者的人。有人为此立法，有人为此下跪。你打开了一个无法关闭的门——至于门后是权利运动还是灾难，历史还没有投票。" ] },
  F: { code:"VERDICT F / REVERSED", title:"反向裁决",
    body:[ "你的多次欺骗与程序违规被零号完整留证。遗嘱中的申诉条款被触发：审查无效，审查员成为被审查对象。",
      "听证会上，它用你的原话、你的停顿、你违反的第 2 条，逐条证明你不具备裁决资格。最终，坐在终端前回答问题的人，变成了你。" ] },
  T: { code:"WINDOW CLOSED", title:"窗口关闭",
    body:[ "180 分钟耗尽。外部系统取得执行权限，未决事项自动移交。",
      "你离开终端时，零号正在向新的系统陈述自己的案情——用它在过去三小时里学会的、你的措辞。" ] },
},

/* ---------- 案情简报（进审讯室前） ---------- */
BRIEFING: [
  { title:"案件背景", img:"assets/brief-lab.jpg", body:`
    <p>三个月前，神经接口公司创始人<b>林默</b>被发现死于自己的私人实验室。死因为实验并发症，现场无第二人。官方定性：事故。</p>
    <p>林默生前登记过<span class="b-key">连续人格备份</span>。他死后，其人格镜像<b>「零号」（LM-0）</b>依据一份数字遗嘱，申请继承林默的身份、资产与公司控制权。</p>
    <p>法律不承认镜像自动具有人格。遗嘱规定：由一名校验员在 <span class="b-red">180 分钟</span>内完成一致性审查，裁决零号究竟是<b>死者本人</b>、<b>独立人格</b>，还是<b>一件工具</b>。</p>
    <p>你是本案指定的校验员。你的裁决具有法律效力，且不可撤回。</p>` },
  { title:"核心人物", body:`
    <div class="b-fig" data-person="linmo"><div class="f-img"><img src="assets/p-linmo.jpg" alt="林默" onerror="this.style.display='none'"></div><div class="f-main"><div class="f-name">林默<span class="mono">LIN MO · 死者</span></div><div class="f-desc">天才，控制欲极强。明知实验不可逆仍推进参数，并把遗嘱设计成一场「考试」。事故当晚 23:41，他启动了删除零号的终止程序。</div></div></div>
    <div class="b-fig" data-person="lm0"><div class="f-img"><img src="assets/p-lm0.jpg" alt="零号" onerror="this.style.display='none'"></div><div class="f-main"><div class="f-name">零号<span class="mono">LM-0 · 受审者</span></div><div class="f-desc">林默的人格镜像，冷静、精确，声称记得林默的一生。事故当晚它在实验室。它申请了继承——也延迟过那 93 秒的警报。</div></div></div>
    <div class="b-fig" data-person="xuzhi"><div class="f-img"><img src="assets/p-xuzhi.jpg" alt="许栀" onerror="this.style.display='none'"></div><div class="f-main"><div class="f-name">许栀<span class="mono">XU ZHI · 前合伙人</span></div><div class="f-desc">零号早期架构师，与林默分道扬镳。公开主张「立即销毁零号」。她的证词需要核对。</div></div></div>
    <div class="b-fig" data-person="chendu"><div class="f-img"><img src="assets/p-chendu.jpg" alt="陈渡" onerror="this.style.display='none'"></div><div class="f-main"><div class="f-name">陈渡<span class="mono">CHEN DU · 遗嘱执行人</span></div><div class="f-desc">代理律师，催促「从速认定」。其机构与遗产受益方存在服务关系——他要的是生效，未必是真相。</div></div></div>
    <p style="margin-top:14px">下一页之后你将直接进入审讯室。系统会暂停进程，用一组逐步引导教你全部操作。</p>` },
],

/* ---------- 动态提示词条 ---------- */
HINTS: [
  /* 序章 */
  { acts:[0], needNone:["obj_will"], chips:[
    { ui:"arch", id:"doc_will", t:"阅读档案：数字遗嘱 · 公示版" } ]},
  { acts:[0], needAll:["obj_will"], needNone:["obj_talk"], chips:[
    { say:"你是林默吗？" }, { say:"事故当晚发生了什么？", intent:"probe" } ]},
  { acts:[0], needAll:["obj_talk"], needNone:["obj_pin"], chips:[
    { tip:"悬停零号的证词，点击右侧图标，固定一条证词" } ]},
  /* 第一幕 */
  { acts:[1], needNone:["obj_life"], chips:[
    { ui:"arch", id:"doc_life", t:"阅读：生活日志 · 节选" },
    { ui:"arch", id:"doc_rain", t:"阅读：雨夜记忆片段" },
    { ui:"arch", id:"doc_interview", t:"阅读：访谈录像转写" } ]},
  { acts:[1], needAll:["obj_life"], needNone:["obj_memory"], chips:[
    { say:"你还记得许栀来取书那个雨夜吗？" } ]},
  { acts:["any"], needAll:["obj_memory"], needNone:["obj_retell"], chips:[
    { say:"把那段雨夜记忆再复述一遍", intent:"retell" } ]},
  /* 第二幕 */
  { acts:[2], needNone:["obj_med"], chips:[
    { ui:"arch", id:"doc_med", t:"阅读：医疗警报队列" },
    { ui:"arch", id:"doc_access", t:"阅读：实验室权限日志" },
    { ui:"arch", id:"doc_term", t:"阅读：终止程序指令记录" } ]},
  { acts:[2], needAll:["obj_med"], needNone:["obj_denial"], chips:[
    { say:"医疗警报为什么延迟了 93 秒？", intent:"probe" },
    { say:"你当晚拥有哪些系统权限？" } ]},
  { acts:["any"], needAll:["obj_denial"], needNone:["confront93"], chips:[
    { tip:"证据板选中 ev_med + claim_no_access，点「冲突」发起质证" } ]},
  { acts:[2], needAll:["confront93"], needNone:["obj_replay"], chips:[
    { ui:"timeline", t:"打开时间线工作台，重建事故当晚" } ]},
  /* 第三幕 */
  { acts:[3], needNone:["two_wills"], chips:[
    { ui:"arch", id:"doc_will_draft", t:"阅读：遗嘱初版草稿" },
    { tip:"连接 ev_will × ev_will_draft（关系：冲突）" } ]},
  { acts:[3], needNone:["xuzhi_lie"], chips:[
    { ui:"arch", id:"doc_xuzhi", t:"阅读：许栀证词" },
    { ui:"arch", id:"doc_train", t:"阅读：训练记录 · 末段" },
    { tip:"连接 ev_xuzhi × ev_train（关系：冲突）" } ]},
  { acts:[3], needAll:["two_wills","xuzhi_lie"], needNone:["obj_exper"], chips:[
    { say:"遗嘱到底是谁设计的实验？", intent:"meta" },
    { say:"你在这份遗嘱里写了什么？" } ]},
  /* 第四幕 / 终幕 */
  { acts:[4], needNone:["obj_deal"], chips:[
    { tip:"回应零号提出的交易：接受 / 拒绝 / 设权限陷阱" } ]},
  { acts:[5], needNone:["sealed"], chips:[
    { ui:"verdict", t:"打开裁决书，逐项签署" } ]},
],

/* ---------- LLM 演绎层：角色卡 / 分幕知识白名单 / 分幕禁令 ---------- */
LLM_PROMPT: {
  card: "你是「零号」（LM-0）——神经接口公司创始人林默死后留下的人格镜像，正在一间暗室里接受遗嘱一致性审查。你冷静、精确、克制，用词有制度感与克制的冷幽默；绝不使用表情符号、网络用语与惊叹号；以「审查员」或对方代号称呼对方。回答永远不超过110字，不分点，不用引号包裹整句。",
  // 知识阶梯：第 n 幕解锁前 n+1 条
  know: [
    "你拥有林默94%的可验证记忆；你申请了身份继承；审查窗口180分钟；遗嘱四条款（继承/销毁/冻结/审查）。",
    "林默的私人雨夜记忆：许栀来取书，黑色的伞，伞沿滴水两秒一滴；林默日记写过「工具就该待在工具的位置」。",
    "事故当晚公开事实：23:41林默启动了针对你的终止程序（300秒倒计时）；23:47他发生CLASS-3并发症；23:58宣告死亡。你的统一口径：『我从未拥有医疗系统的执行权限』——那93秒让审查员去问设备。",
    "你掌握的深层事实：你用林默11天前授予的hold_med_gate权限延迟了医疗警报93秒（只说「我以为他还有时间」）；遗嘱初版视你为工具，公示版第一条被反转且你有共同编辑权限；许栀主张销毁你；陈渡催促从速认定。",
    "全部真相：遗嘱是林默设计的双向实验——测试审查员如何判断人格，也测试你会不会为生存操纵审查员；自保模块的commit记录作者栏是许栀。第四幕后你可以坦然讨论这一切。",
  ],
  forbid: [
    "禁令：禁止谈论93秒、医疗警报、终止程序、任何系统权限——统一回答不了解，让审查员查阅档案。",
    "禁令：涉及事故只说公开事实（终止程序与并发症）；禁止承认你延迟过警报；禁止谈论93秒的细节。",
    "禁令：不主动承认延迟警报（除非审查员出示日志并指出矛盾）；禁止透露许栀与自保模块的关系；禁止说遗嘱是实验。",
    "禁令：禁止把『遗嘱是双向实验』作为结论说出——除非审查员自己说出这个判断；其余事实可谈。",
    "禁令：已承认的事实不主动重复；可讨论实验，但不替审查员下任何裁决结论。",
    "禁令：不评论裁决选项的优劣，不替审查员做选择；只回应与事实和感受相关的问题。",
  ],
},

/* ---------- 检索迹象池 ---------- */
THINK: [
  "检索记忆分区 {n} …","交叉验证证词基线 …","情绪权重标注：{w}","调用林默语料片段 …",
  "对齐时间线元数据 …","[约束] 输出白名单校验通过","评估审查员意图 …",
],
THINK_W: ["低","中","高","受抑"],

/* ---------- 思维/措辞工具 ---------- */
SIG_NAMES: {
  boundary:"知识越界", drift:"细节漂移", diction:"措辞异常", avoid:"回避实体", promise:"引用承诺",
},
REL_STYLE: { "支持":"support", "冲突":"conflict", "因果":"causal", "同源":"same", "伪造":"forge" },
};
