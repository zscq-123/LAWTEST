import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { callTool } from "./client.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "preview", "pixso");
fs.mkdirSync(outDir, { recursive: true });

const FRAMES = [
  ["2:62", "01-首页"],
  ["2:63", "02-特质词选择"],
  ["2:64", "03-匹配动画"],
  ["2:65", "04-揭晓"],
  ["2:66", "05-职业画像"],
  ["2:67", "06-体能赋能"],
  ["2:68", "07-手机报告长页"],
  ["2:69", "08-我的收藏"]
];

for (const [guid, name] of FRAMES) {
  const res = await callTool("get_export_image", {
    guid,
    exportSettings: { constraint: { type: 1, value: 1 }, imageType: 1 }
  });
  const text = res.result?.content?.[0]?.text || "";
  let b64 = null;
  const urlMatch = text.match(/https?:\/\/[^\s]+\.png/);
  if (urlMatch) {
    const r = await fetch(urlMatch[0]);
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(path.join(outDir, name + ".png"), buf);
    console.log("URL export:", name, buf.length);
    continue;
  }
  try {
    const j = JSON.parse(text);
    b64 = j.imageData || j.base64 || j.data || null;
    if (!b64 && j.url) {
      const r = await fetch(j.url);
      const buf = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(path.join(outDir, name + ".png"), buf);
      console.log("URL export:", name, buf.length);
      continue;
    }
  } catch {
    b64 = text.startsWith("data:") ? text.split(",")[1] : null;
  }
  if (!b64) {
    console.log("FAIL", name, text.slice(0, 200));
    continue;
  }
  const buf = Buffer.from(b64, "base64");
  fs.writeFileSync(path.join(outDir, name + ".png"), buf);
  console.log("OK", name, buf.length);
}
