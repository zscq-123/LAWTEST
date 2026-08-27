import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "file:///D:/Users/Lenovo/Documents/ChatGPT/LAWTEST/frontend/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const PAGES = [
  { file: "home.html", name: "01-首页", width: 1920, height: 1080 },
  { file: "select.html", name: "02-特质词选择", width: 1920, height: 1080 },
  { file: "matching.html", name: "03-匹配动画", width: 1920, height: 1080 },
  { file: "reveal.html", name: "04-揭晓", width: 1920, height: 1080 },
  { file: "profile.html", name: "05-职业画像", width: 1920, height: 1080 },
  { file: "fitness.html", name: "06-体能赋能", width: 1920, height: 1080 },
  { file: "report-mobile.html", name: "07-手机报告长页", width: 390, height: 2400 },
  { file: "favorites-mobile.html", name: "08-我的收藏", width: 390, height: 844 }
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"]
});

for (const page of PAGES) {
  const p = await browser.newPage();
  await p.setViewport({ width: page.width, height: page.height, deviceScaleFactor: 1 });
  await p.goto("file://" + path.join(__dirname, "pages", page.file), {
    waitUntil: "networkidle0",
    timeout: 30000
  });
  await new Promise((r) => setTimeout(r, 600));

  const result = await p.evaluate((vp) => {
    const issues = [];
    const W = vp.width;
    const H = vp.height;

    // 1. 文档溢出
    const doc = document.documentElement;
    if (doc.scrollWidth > W + 2) issues.push(`横向溢出: scrollWidth=${doc.scrollWidth} > ${W}`);
    if (doc.scrollHeight > H + 2) issues.push(`纵向溢出: scrollHeight=${doc.scrollHeight} > ${H}`);

    // 2. 元素越界（跳过全屏背景层）
    const skip = (el) => {
      const cls = el.className && String(el.className);
      return /desktop-bg|reveal-bg|hero img|bg-illust|m-actionbar/.test(cls);
    };
    document.querySelectorAll("*").forEach((el) => {
      if (skip(el)) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > H + 1) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? "#" + el.id : "";
        const cls = el.className ? "." + String(el.className).split(" ").join(".") : "";
        issues.push(
          `越界 ${tag}${id}${cls.slice(0, 60)} @(${Math.round(r.left)},${Math.round(r.top)}) ${Math.round(r.width)}x${Math.round(r.height)} → 右${Math.round(r.right)} 下${Math.round(r.bottom)}`
        );
      }
    });

    // 3. 文本溢出容器
    document.querySelectorAll("h1,h2,h3,p,span,button,div").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      if (cs.overflowX === "visible" || cs.overflowX === "auto") return;
      if (el.scrollWidth > el.clientWidth + 3 && el.textContent.trim().length > 0) {
        issues.push(
          `文本溢出 ${el.tagName} "${el.textContent.trim().slice(0, 26)}" (${el.scrollWidth} > ${el.clientWidth})`
        );
      }
    });

    // 4. 元素重叠检查（关键控件之间）
    const keySel = [".btn", ".word-card.on", ".step.active", ".energy-bar", ".m-btn", ".mentor-btn"];
    const items = [];
    keySel.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0) items.push({ el, r });
      });
    });
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const ov = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const ovv = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (ov > 4 && ovv > 4) {
          issues.push(
            `重叠 ${a.el.tagName}.${String(a.el.className).slice(0, 30)} × ${b.el.tagName}.${String(b.el.className).slice(0, 30)} (${ov.toFixed(0)}x${ovv.toFixed(0)})`
          );
        }
      }
    }
    return issues.slice(0, 40);
  }, { width: page.width, height: page.height });

  console.log(`\n===== ${page.name} =====`);
  if (result.length === 0) console.log("  无问题");
  else result.forEach((x) => console.log("  !", x));
  await p.close();
}

await browser.close();
console.log("\nVERIFY DONE");
