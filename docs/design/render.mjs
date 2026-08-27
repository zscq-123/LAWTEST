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
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb"]
});

for (const page of PAGES) {
  const pageRef = await browser.newPage();
  await pageRef.setViewport({ width: page.width, height: page.height, deviceScaleFactor: 1 });
  await pageRef.goto("file://" + path.join(__dirname, "pages", page.file), {
    waitUntil: "networkidle0",
    timeout: 30000
  });
  await new Promise((r) => setTimeout(r, 900));
  const out = path.join(__dirname, "preview", page.name + ".png");
  await pageRef.screenshot({ path: out, fullPage: false });
  console.log("OK", page.name, out);
  await pageRef.close();
}

await browser.close();
console.log("DONE");
