/* 自动裁掉人物图右下角/底部可能的水印条，保留构图主体 */
const Jimp = require("jimp");
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "assets");
const CROP_BOTTOM = 72; // 裁掉底部 72px（足够覆盖常见 AI 水印条）

(async () => {
  for (const f of ["p-linmo.jpg","p-xuzhi.jpg","p-chendu.jpg"]){
    const p = path.join(OUT, f);
    if (!fs.existsSync(p)) continue;
    const img = await Jimp.read(p);
    const w = img.getWidth(), h = img.getHeight();
    if (h <= CROP_BOTTOM + 50){ console.log("skip", f); continue; }
    img.crop(0, 0, w, h - CROP_BOTTOM);
    await img.writeAsync(p);
    console.log("fixed", f, `${w}x${h} -> ${w}x${h - CROP_BOTTOM}`);
  }
})();
