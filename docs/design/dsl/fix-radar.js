export default {
  tool: "eval_script",
  args: {
    script: `
const svg = pixso.getNodeById("2:807");
const radar = pixso.getNodeById("2:699");
const out = { svgFound: !!svg, radarFound: !!radar };
if (svg) {
  try { svg.layoutPositioning = "AUTO"; } catch (e) { out.layoutErr = String(e); }
  svg.clipsContent = true;
  svg.x = 0;
  svg.y = 0;
  out.svgSize = [svg.width, svg.height];
}
if (radar) {
  radar.clipsContent = true;
  out.radarSize = [radar.width, radar.height];
}
return out;
`
  }
};
