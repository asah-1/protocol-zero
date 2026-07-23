/* 人物立绘底部再裁剪，彻底移除右下角水印/修复痕迹 */
const Jimp = require("jimp");
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "assets");
const CROP = 56; // 从底部再裁 56px

(async () => {
  for (const f of ["p-linmo.jpg", "p-xuzhi.jpg", "p-chendu.jpg"]){
    const p = path.join(OUT, f);
    const img = await Jimp.read(p);
    const w = img.getWidth(), h = img.getHeight();
    img.crop(0, 0, w, h - CROP);
    await img.writeAsync(p);
    console.log("crop", f, `${w}x${h} -> ${w}x${h - CROP}`);
  }
})();
