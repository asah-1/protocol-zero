/* 美术资产生成脚本：Doubao Seedream → assets/（生成后本地引用，仓库自包含） */
const fs = require("fs"), path = require("path");
const KEY = "ailab_8fxrE7klOHoLcUnS23c8S2AnoR9ucu/1AWMUz+BReByTduQ7MeWNY7/79Bgx0UW9MDaw6ZrJLu2EEr3gCLS11RTPsxN3gAxZbBpUNC0gwJISgNRtkuUfCp0=";
const URL_ = "https://lab.iwhalecloud.com/gpt-proxy/v1/images/generations";
const OUT = path.join(__dirname, "assets");

const BASE_NEG = "无水印，无签名，无文字，无 logo，无图标，无 UI 元素，无界面，无字幕，干净构图，电影静帧质感";

const ASSETS = [
  { file: "boot-bg.jpg", size: "1280x720",
    prompt: `深夜的数字遗产法医实验室走廊，纵深构图，两侧是深色金属档案柜与磨砂玻璃隔断，尽头一扇透出冷青色微光的门，地面微弱反光，空气中悬浮细小尘埃，几颗极小的暗红色指示灯点缀，冷峻克制，青灰色调，电影感低调照明，35mm 镜头，浅景深，无人物。${BASE_NEG}` },
  { file: "brief-lab.jpg", size: "1280x720",
    prompt: `无人的法医实验室静物场景，不锈钢台面上摆放着透明证物袋和一台老式终端显示器，冷青色顶灯从侧面打亮台面，背景是虚化的仪器架与磨砂玻璃，青灰色调，安静克制，电影感静物摄影，50mm 镜头，浅景深，无人物。${BASE_NEG}` },
  { file: "p-linmo.jpg", size: "864x1152",
    prompt: `42 岁东亚男性研究者半身肖像，面容清瘦疲惫，眼窝深陷，短发微乱，穿深灰色工装外套，坐在昏暗实验室里，身后是模糊的仪器冷光，表情平静而遥远，冷青色调，胶片颗粒质感，85mm 人像镜头，浅景深，克制纪实风格。${BASE_NEG}` },
  { file: "p-lm0.jpg", size: "864x1152",
    prompt: `纯黑背景中由无数微小青灰色光点组成的人形头肩轮廓，点云边缘微微发散，偶有几点暗红色噪点闪烁，神秘克制，数字遗骸氛围，极简构图，高对比，无实体面部，抽象人像。${BASE_NEG}` },
  { file: "p-xuzhi.jpg", size: "864x1152",
    prompt: `32 岁东亚女性医疗官半身肖像，齐肩黑发束起，穿白色制服外套，神情克制，带着疲惫的同情，站在冷白色医疗翼走廊里，背景虚化，冷色调，胶片颗粒质感，85mm 人像镜头，纪实风格。${BASE_NEG}` },
  { file: "p-chendu.jpg", size: "864x1152",
    prompt: `45 岁东亚男性安全主管半身肖像，短寸头，深色高领制服，面部线条冷硬，眼神锐利审视，站在昏暗监控室里，身后屏幕发出微弱冷光，冷青色调，胶片颗粒质感，85mm 人像镜头。${BASE_NEG}` },
  { file: "end-bg.jpg", size: "1280x720",
    prompt: `空无一人的昏暗审讯室，一张金属长桌与两把空椅子，头顶一盏昏黄吊灯投下锥形光，深灰墙面，地面微弱反光，冷峻寂静，青灰色调，电影感广角构图，低调照明，无人物。${BASE_NEG}` },
];

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
  // 清空旧图，避免带水印版本残留
  for (const f of fs.readdirSync(OUT)){
    const p = path.join(OUT, f);
    if (/\.(jpg|jpeg|png|webp)$/i.test(f)) fs.unlinkSync(p);
  }
  for (const a of ASSETS){
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
