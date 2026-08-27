const COLS = [
  { guid: "2:250", name: "企业法务列", careerName: "企业法务", colorName: "琉璃紫", hex: "#7B5EA7", words: [
    ["风控敏锐",1,0],["细致严谨",1,1],["合规审慎",1,0],["统筹协调",0,0],["务实高效",0,0],["保密自律",1,0],["思维周全",0,0],["善于复盘",0,0],
    ["适配性强",0,0],["成本可控",0,0],["风险预判",1,0],["流程规范",0,0],["沟通稳妥",0,0],["落地执行力强",0,0],["耐心细致",0,0]
  ] },
  { guid: "2:251", name: "AI伦理列", careerName: "AI伦理合规顾问", colorName: "科创青", hex: "#12B5A5", words: [
    ["创新思维",1,1],["跨界融合",1,0],["与时俱进",0,0],["审慎包容",0,0],["逻辑前沿",0,0],["敬畏科技",1,0],["坚守伦理",1,0],["敏锐洞察",0,0],
    ["迭代学习",0,0],["全局思辨",0,0],["规则优化",0,0],["数据敏感",1,0],["合规前瞻",0,0],["跨界思辨",0,0],["求真务实",0,0]
  ] }
];

let ops = "";

for (const col of COLS) {
  ops += `
U("${col.guid}",{name:"${col.name}"});
ch=I("${col.guid}",{type:"frame",name:"列头",width:340,height:56,autoLayout:{direction:"horizontal",alignItems:"center",gap:10,padding:[0,0,0,16]},stroke:{borderWeight:[0,0,0,2],strokePaints:"${col.hex}"}});
cd=I(ch,{type:"frame",name:"圆点",width:8,height:8,cornerRadius:"auto",fillPaints:"${col.hex}",effects:[{type:"drop_shadow",color:"${col.hex}",radius:8}]});
cn=I(ch,{type:"text",nodeText:"${col.careerName}",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:700,letterSpacing:1,fillPaints:"$text_main"});
ct=I(ch,{type:"frame",name:"标签",width:110,height:24,cornerRadius:"$r_pill",fillPaints:"${col.hex}29",stroke:{borderWeight:1,strokePaints:"${col.hex}73"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ctt=I(ct,{type:"text",nodeText:"${col.colorName}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:500,fillPaints:"${col.hex}"});
`;
  for (let r = 0; r < 8; r++) {
    ops += `rw=I("${col.guid}",{type:"frame",name:"行${r + 1}",width:340,height:64,autoLayout:{direction:"horizontal",gap:10}});\n`;
    for (let j = 0; j < 2; j++) {
      const idx = r * 2 + j;
      if (idx >= 15) continue;
      const [word, core, selected] = col.words[idx];
      const fill = selected ? `${col.hex}38` : "#FFFFFF0D";
      const dash = core ? "[4,4]" : null;
      const strokeObj = selected
        ? `{borderWeight:1,strokePaints:"${col.hex}"${dash ? `,dashPattern:${dash}` : ""}}`
        : `{borderWeight:1,strokePaints:"#FFFFFF38",dashPattern:[4,4]}`;
      const glow = selected ? `,effects:[{type:"drop_shadow",color:"${col.hex}61",radius:16}]` : "";
      ops += `wc=I(rw,{type:"frame",name:"词卡",width:156,height:64,cornerRadius:"$r10",fillPaints:"${fill}",stroke:${strokeObj}${glow},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});\n`;
      ops += `wt=I(wc,{type:"text",nodeText:"${word}",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:${selected ? 600 : 400},letterSpacing:1,fillPaints:"${selected ? "#FFFFFF" : "#FFFFFFAD"}"});\n`;
    }
  }
}

export default { tool: "apply_design", args: { operations: ops } };
