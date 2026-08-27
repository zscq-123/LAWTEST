export default {
  tool: "eval_script",
  args: {
    script: `
const stray = pixso.getNodeById("2:775");
if (stray) stray.remove();
const frames = {};
for (const n of pixso.currentPage.children) {
  if (/^0[1-8]-/.test(n.name)) frames[n.name.slice(0, 2)] = n;
}
const positions = {
  "01": [0, 0], "02": [1960, 0], "03": [3920, 0], "04": [5880, 0],
  "05": [7840, 0], "06": [9800, 0], "07": [0, 1120], "08": [430, 1120]
};
const moved = {};
for (const [k, [x, y]] of Object.entries(positions)) {
  if (frames[k]) { frames[k].x = x; frames[k].y = y; moved[k] = [x, y]; }
}
return { moved, strayDeleted: !!stray };
`
  }
};
