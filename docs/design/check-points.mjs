import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "file:///D:/Users/Lenovo/Documents/ChatGPT/LAWTEST/frontend/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const CHECKS = [
  {
    file: "home.html", png: "01-首页.png", w: 1920, h: 1080,
    points: [
      ["主标题区", ".home-title"],
      ["开始测试按钮", ".btn-primary"],
      ["律师卡头像", ".career-card:nth-child(1) .career-avatar"],
      ["法官卡头像", ".career-card:nth-child(2) .career-avatar"],
      ["检察官卡头像", ".career-card:nth-child(3) .career-avatar"],
      ["法务卡头像", ".career-card:nth-child(4) .career-avatar"],
      ["AI卡头像", ".career-card:nth-child(5) .career-avatar"]
    ]
  },
  {
    file: "select.html", png: "02-特质词选择.png", w: 1920, h: 1080,
    points: [
      ["律师选中词卡", ".word-col:nth-child(1) .word-card.on"],
      ["法官选中词卡", ".word-col:nth-child(2) .word-card.on"],
      ["检察官选中词卡", ".word-col:nth-child(3) .word-card.on"],
      ["法务选中词卡", ".word-col:nth-child(4) .word-card.on"],
      ["AI选中词卡", ".word-col:nth-child(5) .word-card.on"],
      ["法官能量柱", ".energy-item:nth-child(1) .energy-bar"],
      ["AI能量柱", ".energy-item:nth-child(5) .energy-bar"],
      ["成功提示条", ".alert"],
      ["开始匹配按钮", ".sel-actions .btn-primary"]
    ]
  },
  {
    file: "matching.html", png: "03-匹配动画.png", w: 1920, h: 1080,
    points: [
      ["法官竞速柱", ".race-item:nth-child(1) .race-fill"],
      ["检察官竞速柱", ".race-item:nth-child(2) .race-fill"],
      ["律师竞速柱", ".race-item:nth-child(3) .race-fill"],
      ["法务竞速柱", ".race-item:nth-child(4) .race-fill"],
      ["AI竞速柱", ".race-item:nth-child(5) .race-fill"],
      ["领跑徽章", ".lead-badge"]
    ]
  },
  {
    file: "reveal.html", png: "04-揭晓.png", w: 1920, h: 1080,
    points: [
      ["职业头像", ".reveal-avatar"],
      ["职业名", ".reveal-career"],
      ["匹配度86%", ".reveal-match"],
      ["第二适配胶囊", ".reveal-second"],
      ["查看画像按钮", ".reveal-actions .btn-primary"]
    ]
  },
  {
    file: "profile.html", png: "05-职业画像.png", w: 1920, h: 1080,
    points: [
      ["Hero插画区", ".hero-illust"],
      ["Hero头像", ".hero-top .career-avatar"],
      ["查看体能方案", ".hero-actions .btn-primary"],
      ["雷达中心", "#radar"],
      ["优势条目1", ".panel:nth-of-type(2) .num-item:nth-child(1)"]
    ]
  },
  {
    file: "fitness.html", png: "06-体能赋能.png", w: 1920, h: 1080,
    points: [
      ["左栏插画", ".fit-illust"],
      ["达标条目1", ".fit-panel:nth-of-type(1) .num-item:nth-child(1)"],
      ["时间线节点1", ".tl-node:nth-child(1) .tl-dot"],
      ["扫码带走按钮", ".fit-actions .btn-primary"]
    ]
  },
  {
    file: "report-mobile.html", png: "07-手机报告长页.png", w: 390, h: 2400,
    points: [
      ["Hero渐变区", ".hero"],
      ["法官职业名", ".hero .job-name"],
      ["导师按钮", ".mentor-btn"],
      ["收藏入口", ".fav-entry"],
      ["保存长图按钮", ".m-actionbar .m-btn-primary"]
    ]
  },
  {
    file: "favorites-mobile.html", png: "08-我的收藏.png", w: 390, h: 844,
    points: [
      ["收藏数标签", ".fav-count"],
      ["法官卡头像", ".fav-card:nth-child(1) .fav-avatar"],
      ["法官卡匹配度", ".fav-card:nth-child(1) .fav-match-tag"],
      ["检察官卡头像", ".fav-card:nth-child(2) .fav-avatar"],
      ["检察官卡匹配度", ".fav-card:nth-child(2) .fav-match-tag"]
    ]
  }
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"]
});

for (const chk of CHECKS) {
  const p = await browser.newPage();
  await p.setViewport({ width: chk.w, height: chk.h, deviceScaleFactor: 1 });
  await p.goto("file://" + path.join(__dirname, "pages", chk.file), { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));

  const points = await p.evaluate((sels) => {
    return sels.map(([label, sel]) => {
      const el = document.querySelector(sel);
      if (!el) return { label, sel, miss: true };
      const r = el.getBoundingClientRect();
      return {
        label,
        sel,
        x: Math.round(r.left + r.width / 2),
        y: Math.round(r.top + r.height / 2),
        w: Math.round(r.width),
        h: Math.round(r.height)
      };
    });
  }, chk.points);

  const b64 = fs.readFileSync(path.join(__dirname, "preview", chk.png)).toString("base64");
  const samples = await p.evaluate(async (args) => {
    const img = new Image();
    img.src = "data:image/png;base64," + args.b64;
    await img.decode();
    const cv = document.createElement("canvas");
    cv.width = img.width;
    cv.height = img.height;
    const ctx = cv.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return args.pts.map((pt) => {
      if (pt.miss) return pt;
      const d = ctx.getImageData(pt.x, pt.y, 1, 1).data;
      return { label: pt.label, rgb: [d[0], d[1], d[2]] };
    });
  }, { b64, pts: points });

  console.log("\n===== " + chk.png.replace(".png", "") + " =====");
  samples.forEach((s) => {
    if (s.miss) console.log("  ✗ 未找到", s.label, s.sel);
    else console.log("  " + s.label.padEnd(12), "RGB(" + s.rgb.join(",") + ")");
  });
  await p.close();
}

await browser.close();
