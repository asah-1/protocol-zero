/* 美术资产生成脚本：Doubao Seedream → assets/（生成后本地引用，仓库自包含）
   用法：node _genart.js            → 全量生成
        node _genart.js p-linmo act0  → 只生成文件名含这些关键字的资产 */
const fs = require("fs"), path = require("path");
const KEY = "ailab_8fxrE7klOHoLcUnS23c8S2AnoR9ucu/1AWMUz+BReByTduQ7MeWNY7/79Bgx0UW9MDaw6ZrJLu2EEr3gCLS11RTPsxN3gAxZbBpUNC0gwJISgNRtkuUfCp0=";
const URL_ = "https://lab.iwhalecloud.com/gpt-proxy/v1/images/generations";
const OUT = path.join(__dirname, "assets");

const BASE_NEG = "绝对不要任何水印，不要签名，不要文字，不要 logo，不要图标，不要 UI 元素，不要界面，不要字幕，不要边框，不要角落标记，不要 AI 生成字样，干净构图";
/* 日系刑侦漫画风（人物） */
const MANGA = "日本写实刑侦漫画画风，浦泽直树式悬疑气质，精致手绘线稿与水彩淡彩上色结合，网点纸阴影质感，电影分镜式构图，冷青灰色调，神秘克制氛围，高颜值美型人物，五官精致立体，眼神有故事感，无水印无文字无签名无logo";
/* 电影 forensic 风（场景） */
const CINE = "电影感低调照明，冷峻克制，青灰色调，空气中悬浮细小尘埃，浅景深，无人物";

const ASSETS = [
  { file: "boot-bg.jpg", size: "1280x720",
    prompt: `深夜的数字遗产法医实验室走廊，纵深构图，两侧是深色金属档案柜与磨砂玻璃隔断，尽头一扇透出冷青色微光的门，地面微弱反光，几颗极小的暗红色指示灯点缀，35mm 镜头。${CINE}。${BASE_NEG}` },
  { file: "brief-lab.jpg", size: "1280x720",
    prompt: `无人的法医实验室静物场景，不锈钢台面上摆放着透明证物袋和一台老式终端显示器，冷青色顶灯从侧面打亮台面，背景是虚化的仪器架与磨砂玻璃，安静克制，50mm 镜头。${CINE}。${BASE_NEG}` },
  { file: "p-linmo.jpg", size: "864x1152",
    prompt: `42 岁东亚男性研究者半身肖像，清瘦俊美的中年面容，深邃疲惫却锐利的眼睛，微乱黑发夹杂几缕灰白，穿深色高领外套，侧身回眸，纯暗背景中一道冷青色轮廓光勾勒肩线，表情平静而遥远，像藏着未说出的实验秘密。${MANGA}。${BASE_NEG}` },
  { file: "p-lm0.jpg", size: "864x1152",
    prompt: `纯黑背景中由无数微小青灰色光点组成的人形头肩轮廓，点云边缘微微发散，偶有几点暗红色噪点闪烁，神秘克制，数字遗骸氛围，极简构图，高对比，无实体面部，抽象人像。${BASE_NEG}` },
  { file: "p-xuzhi.jpg", size: "864x1152",
    prompt: `32 岁东亚女性建筑师的半身肖像，冷艳知性，齐肩黑发一丝不乱，眉眼锋利而带着压抑的悲伤，穿深色高领毛衣与浅灰西装外套，站在雨夜落地窗前，窗外冷蓝色雨丝虚化，玻璃上有她的淡淡倒影，神情克制，像在为某个谎言守口如瓶。${MANGA}。${BASE_NEG}` },
  { file: "p-chendu.jpg", size: "864x1152",
    prompt: `45 岁东亚男性律师半身肖像，斯文俊朗，梳得整齐的侧分黑发，金丝细框眼镜后是一双精明计算的眼睛，嘴角有礼貌而疏离的微笑，深色三件套西装与口袋巾，坐在夜间律师事务所的皮椅上，身后书架与一盏暖黄台灯，暖光与窗外冷光在脸上交界，亦正亦邪的神秘感。${MANGA}。${BASE_NEG}` },
  { file: "end-bg.jpg", size: "1280x720",
    prompt: `空无一人的昏暗审讯室，一张金属长桌与两把空椅子，头顶一盏昏黄吊灯投下锥形光，深灰墙面，地面微弱反光，冷峻寂静，广角构图。${CINE}。${BASE_NEG}` },
  /* ---- 六幕场景背景 ---- */
  { file: "act0-bg.jpg", size: "1280x720",
    prompt: `深夜的遗产审查签署室，一张金属签署台居中，台面上摊开文件与一枚红色印泥印章，一台老式终端屏幕发出冷青色微光，背景是没入黑暗的档案柜，顶灯在台面投下孤独的锥形光。${CINE}。${BASE_NEG}` },
  { file: "act1-bg.jpg", size: "1280x720",
    prompt: `无尽的私人记忆档案库，高耸的深色档案架向黑暗中延伸消失，架间悬浮着无数微小光点像漂浮的记忆碎片，一道冷青色光束从高窗斜射进来，尘埃浮动，纵深构图，安静而异样。${CINE}。${BASE_NEG}` },
  { file: "act2-bg.jpg", size: "1280x720",
    prompt: `深夜空荡的医疗监护室，一张空病床，床头心电监护仪屏幕亮着冷绿色波形，墙角一枚暗红色警报灯投下危险的光晕，地面瓷砖微弱反光，冷白色调中混入警报红，紧张压抑。${CINE}。${BASE_NEG}` },
  { file: "act3-bg.jpg", size: "1280x720",
    prompt: `夜间律师事务所办公室，深色木质书桌上散落着两个版本的遗嘱文件、一支钢笔与老花镜，一盏绿色银行家台灯投下暖黄光晕，背景是满墙法律典籍书架没入阴影，暖光与窗外冷青色夜光对峙。${CINE}。${BASE_NEG}` },
  { file: "act4-bg.jpg", size: "1280x720",
    prompt: `单向镜审讯室的镜面一侧，整面墙的深色镜子映出模糊人影轮廓，镜前一把空椅子，镜面冷光与阴影交界，构图对称，被观看与观看的压迫感，神秘冷峻。${CINE}。${BASE_NEG}` },
  { file: "act5-bg.jpg", size: "1280x720",
    prompt: `庄严空旷的遗产裁决厅，高窗透入冷白色晨光，中央一张签署长桌，桌上放着印章与合上的一册档案，背景深处一座天平雕塑剪影，地面大理石微弱反光，寂静肃穆，仪式感。${CINE}。${BASE_NEG}` },
];

const filter = process.argv.slice(2);
const list = filter.length ? ASSETS.filter(a => filter.some(k => a.file.includes(k))) : ASSETS;
if (!list.length){ console.log("no match"); process.exit(1); }

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
  // 只清理本次要重新生成的图，避免带水印版本残留
  for (const a of list){
    const p = path.join(OUT, a.file);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  for (const a of list){
    const dest = path.join(OUT, a.file);
    try {
      const res = await fetch(URL_, {
        method: "POST",
        headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "g-doubao-seedream-5-0-pro", prompt: a.prompt, size: a.size }),
      });
      const j = await res.json();
      const url = j.data && j.data[0] && j.data[0].url;
      if (!url) { console.log("FAIL", a.file, JSON.stringify(j).slice(0, 300)); continue; }
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log("OK", a.file, (buf.length / 1024).toFixed(0) + "KB");
    } catch (e) { console.log("ERR", a.file, e.message); }
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log("done");
})();
