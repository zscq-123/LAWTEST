export default {
  tool: "eval_script",
  args: {
    script: `
const svg = pixso.getNodeById("2:807");
const info = svg ? { w: svg.width, h: svg.height, type: svg.type, children: svg.children.map(c => ({ name: c.name, w: c.width, h: c.height, x: c.x, y: c.y })) } : null;
const radar = pixso.getNodeById("2:699");
const ri = radar ? { w: radar.width, h: radar.height } : null;
return { svg: info, radar: ri };
`
  }
};
