/* 用左侧相邻像素覆盖右下角水印区，适合深色背景 */
const Jimp = require("jimp");
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "assets");
const WM_W = 130, WM_H = 55; // 右下角水印区估算尺寸

(async () => {
  const files = fs.readdirSync(OUT).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  for (const f of files){
    const p = path.join(OUT, f);
    const img = await Jimp.read(p);
    const w = img.getWidth(), h = img.getHeight();
    const x0 = Math.max(0, w - WM_W), y0 = Math.max(0, h - WM_H);
    for (let y = y0; y < h; y++){
      const sampleX = Math.max(0, x0 - 3);
      for (let x = x0; x < w; x++){
        const c = img.getPixelColor(sampleX, y);
        img.setPixelColor(c, x, y);
      }
    }
    img.quality(80);
    await img.writeAsync(p);
    console.log("wm-removed", f, `${w}x${h}`, `${(fs.statSync(p).size/1024).toFixed(0)}KB`);
  }
})();
