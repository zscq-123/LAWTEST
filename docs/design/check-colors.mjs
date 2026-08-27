import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "file:///D:/Users/Lenovo/Documents/ChatGPT/LAWTEST/frontend/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const PAGES = [
  { name: "01-首页", w: 1920, h: 1080, gw: 24, gh: 14 },
  { name: "02-特质词选择", w: 1920, h: 1080, gw: 24, gh: 14 },
  { name: "03-匹配动画", w: 1920, h: 1080, gw: 24, gh: 14 },
  { name: "04-揭晓", w: 1920, h: 1080, gw: 24, gh: 14 },
  { name: "05-职业画像", w: 1920, h: 1080, gw: 24, gh: 14 },
  { name: "06-体能赋能", w: 1920, h: 1080, gw: 24, gh: 14 },
  { name: "07-手机报告长页", w: 390, h: 2400, gw: 10, gh: 26 },
  { name: "08-我的收藏", w: 390, h: 844, gw: 10, gh: 18 }
];

const PALETTE = [
  { k: "D", rgb: [11, 18, 32] },      // 深蓝黑底
  { k: "d", rgb: [14, 22, 38] },      // 深底偏亮
  { k: "W", rgb: [245, 247, 250] },   // 浅底/白
  { k: "w", rgb: [255, 255, 255] },   // 纯白
  { k: "B", rgb: [22, 119, 255] },    // 品牌蓝
  { k: "J", rgb: [46, 107, 230] },    // 法官蓝
  { k: "R", rgb: [200, 16, 46] },     // 检察官红
  { k: "P", rgb: [123, 94, 167] },    // 法务紫
  { k: "C", rgb: [18, 181, 165] },    // 科创青
  { k: "Y", rgb: [250, 173, 20] },    // 警示黄
  { k: "G", rgb: [82, 196, 26] }      // 成功绿
];

function classify(rgb) {
  let best = "O", bd = 1e9;
  for (const p of PALETTE) {
    const d = Math.hypot(rgb[0] - p.rgb[0], rgb[1] - p.rgb[1], rgb[2] - p.rgb[2]);
    if (d < bd) { bd = d; best = p.k; }
  }
  return best;
}

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"]
});

for (const page of PAGES) {
  const p = await browser.newPage();
  const src = path.join(__dirname, "preview", page.name + ".png");
  const b64 = fs.readFileSync(src).toString("base64");
  const dataUrl = "data:image/png;base64," + b64;
  const map = await p.evaluate(async (args) => {
    const img = new Image();
    img.src = args.src;
    await img.decode();
    const cw = args.gw, ch = args.gh;
    const cv = document.createElement("canvas");
    cv.width = cw; cv.height = ch;
    const ctx = cv.getContext("2d");
    ctx.drawImage(img, 0, 0, cw, ch);
    const data = ctx.getImageData(0, 0, cw, ch).data;
    const out = [];
    for (let y = 0; y < ch; y++) {
      let row = "";
      for (let x = 0; x < cw; x++) {
        const i = (y * cw + x) * 4;
        const rgb = [data[i], data[i + 1], data[i + 2]];
        const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
        let best = "O", bd = 1e9;
        for (const pl of [
          { k: "D", rgb: [11, 18, 32] },
          { k: "d", rgb: [16, 26, 44] },
          { k: "W", rgb: [245, 247, 250] },
          { k: "w", rgb: [255, 255, 255] },
          { k: "B", rgb: [22, 119, 255] },
          { k: "J", rgb: [46, 107, 230] },
          { k: "R", rgb: [200, 16, 46] },
          { k: "P", rgb: [123, 94, 167] },
          { k: "C", rgb: [18, 181, 165] },
          { k: "Y", rgb: [250, 173, 20] },
          { k: "G", rgb: [82, 196, 26] }
        ]) {
          const d = Math.hypot(rgb[0] - pl.rgb[0], rgb[1] - pl.rgb[1], rgb[2] - pl.rgb[2]);
          if (d < bd) { bd = d; best = pl.k; }
        }
        if (best === "O") best = lum > 200 ? "w" : lum < 40 ? "D" : "d";
        row += best;
      }
      out.push(row);
    }
    return out;
  }, { src: dataUrl, gw: page.gw, gh: page.gh });

  console.log("\n===== " + page.name + " =====");
  console.log(map.join("\n"));
  await p.close();
}

await browser.close();
