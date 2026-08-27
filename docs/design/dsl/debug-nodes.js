export default {
  tool: "eval_script",
  args: {
    script: `
const radar = pixso.currentPage.findAll(n => n.name === "雷达图");
const p1 = pixso.currentPage.findAll(n => n.name === "雷达面板");
return {
  radar: radar.map(n => ({ id: n.id, type: n.type })),
  p1: p1.map(n => ({ id: n.id, type: n.type }))
};
`
  }
};
