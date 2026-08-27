import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { callTool } from "./client.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "preview", "pixso", "shots");
fs.mkdirSync(outDir, { recursive: true });

function parseShots(text) {
  try {
    const j = JSON.parse(text);
    return j.screenshots || [];
  } catch {
    return [];
  }
}

// 批量截图（take_screenshot，每组 ≤3）
const batches = [
  { nodeIds: ["2:62", "2:63", "2:64"], names: ["01-首页", "02-特质词选择", "03-匹配动画"] },
  { nodeIds: ["2:65", "2:66", "2:67"], names: ["04-揭晓", "05-职业画像", "06-体能赋能"] }
];

for (const b of batches) {
  const res = await callTool("take_screenshot", { nodeIds: b.nodeIds });
  const text = res.result?.content?.[0]?.text || "";
  const shots = parseShots(text);
  for (const s of shots) {
    const name = b.names[b.nodeIds.indexOf(s.nodeId)];
    if (s.base64 && name) {
      fs.writeFileSync(path.join(outDir, name + ".png"), Buffer.from(s.base64, "base64"));
      console.log("shot", name, s.nodeId);
    }
  }
}

// 手机页单张截图（get_screenshot）
for (const [guid, name] of [["2:68", "07-手机报告长页"], ["2:69", "08-我的收藏"]]) {
  const res = await callTool("get_screenshot", { guid });
  const content = res.result?.content?.[0];
  const text = content?.text || "";
  if (content?.type === "image" && content?.data) {
    fs.writeFileSync(path.join(outDir, name + ".png"), Buffer.from(content.data, "base64"));
    console.log("shot(image)", name, guid);
    continue;
  }
  try {
    const j = JSON.parse(text);
    if (j.base64) {
      fs.writeFileSync(path.join(outDir, name + ".png"), Buffer.from(j.base64, "base64"));
      console.log("shot", name, guid);
      continue;
    }
  } catch {}
  const m = text.match(/https?:\/\/[^\s]+\.png/);
  if (m) {
    const r = await fetch(m[0]);
    fs.writeFileSync(path.join(outDir, name + ".png"), Buffer.from(await r.arrayBuffer()));
    console.log("shot(url)", name, guid);
  } else {
    console.log("shot FAIL", name, text.slice(0, 150));
  }
}
