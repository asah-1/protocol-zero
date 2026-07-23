/* 压缩人物立绘与背景图，提升 GitHub Pages 加载速度 */
const Jimp = require("jimp");
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "assets");

async function compress(file, opts){
  const p = path.join(OUT, file);
  if (!fs.existsSync(p)) return;
  const img = await Jimp.read(p);
  const before = (fs.statSync(p).size / 1024).toFixed(0);
  if (opts.width && img.getWidth() > opts.width) img.resize(opts.width, Jimp.AUTO);
  if (opts.quality) img.quality(opts.quality);
  await img.writeAsync(p);
  const after = (fs.statSync(p).size / 1024).toFixed(0);
  console.log("compress", file, `${before}KB -> ${after}KB`, `${img.getWidth()}x${img.getHeight()}`);
}

(async () => {
  // 人物图：宽度限制 600，质量 82
  for (const f of ["p-linmo.jpg", "p-xuzhi.jpg", "p-chendu.jpg", "p-lm0.jpg"]){
    await compress(f, { width: 600, quality: 82 });
  }
  // 背景图：宽度限制 1024，质量 82（原本 1280x720，可适度压缩）
  for (const f of fs.readdirSync(OUT).filter(x => /-(bg|lab)\.jpg$/i.test(x) || /^act\d+-bg\.jpg$/i.test(x))){
    await compress(f, { width: 1024, quality: 82 });
  }
})();
