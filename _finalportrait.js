/* 最终压缩人物立绘，去除 jimp 默认 100% 质量导致体积反弹 */
const Jimp = require("jimp");
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "assets");

(async () => {
  for (const f of ["p-linmo.jpg", "p-xuzhi.jpg", "p-chendu.jpg", "p-lm0.jpg"]){
    const p = path.join(OUT, f);
    const img = await Jimp.read(p);
    img.quality(80);
    await img.writeAsync(p);
    console.log("final", f, `${(fs.statSync(p).size/1024).toFixed(0)}KB`, `${img.getWidth()}x${img.getHeight()}`);
  }
})();
