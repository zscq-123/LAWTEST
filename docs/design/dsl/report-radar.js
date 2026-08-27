const RADAR = [
  { value: 92 }, { value: 78 }, { value: 85 }, { value: 96 }, { value: 64 }
];
const cx = 150, cy = 98, R = 76;
const pt = (i, r) => {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="196" viewBox="0 0 300 196">';
for (const lv of [0.25, 0.5, 0.75, 1]) {
  let pts = "";
  for (let i = 0; i < 5; i++) {
    const [x, y] = pt(i, R * lv);
    pts += (i ? " " : "") + x.toFixed(1) + "," + y.toFixed(1);
  }
  svg += `<polygon points="${pts}" fill="${lv === 1 ? "#2E6BE60D" : "none"}" stroke="#E3E9F0"/>`;
}
for (let i = 0; i < 5; i++) {
  const [x, y] = pt(i, R);
  svg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E3E9F0"/>`;
}
let vpts = "";
RADAR.forEach((d, i) => {
  const [x, y] = pt(i, (R * d.value) / 100);
  vpts += (i ? " " : "") + x.toFixed(1) + "," + y.toFixed(1);
});
svg += `<polygon points="${vpts}" fill="#2E6BE638" stroke="#2E6BE6" stroke-width="2.2" stroke-linejoin="round"/>`;
RADAR.forEach((d, i) => {
  const [x, y] = pt(i, (R * d.value) / 100);
  svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="#2E6BE6" stroke="#FFFFFF" stroke-width="1.2"/>`;
});
svg += "</svg>";

export default {
  tool: "eval_script",
  args: {
    script: `
const svg = ${JSON.stringify(svg)};
const node = await pixso.createNodeFromSvg(svg);
node.name = "雷达矢量";
const frame = pixso.currentPage.findAll(n => n.name === "雷达图")[0];
if (!frame) return { ok: false, why: "no radar frame" };
try {
  frame.appendChild(node);
  node.x = 0;
  node.y = 0;
  return { ok: true, mode: "child", id: node.id };
} catch (e) {
  node.x = frame.x;
  node.y = frame.y;
  return { ok: true, mode: "absolute", id: node.id };
}
`
  }
};
