/* 最终压缩背景图，避免 jimp 重写写回 100% 质量 */
const Jimp = require("jimp");
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "assets");

(async () => {
  const files = fs.readdirSync(OUT).filter(f => /-(bg|lab)\.jpg$/i.test(f) || /^act\d+-bg\.jpg$/i.test(f));
  for (const f of files){
    const p = path.join(OUT, f);
    const img = await Jimp.read(p);
    img.quality(80);
    await img.writeAsync(p);
    console.log("final", f, `${(fs.statSync(p).size/1024).toFixed(0)}KB`, `${img.getWidth()}x${img.getHeight()}`);
  }
})();
