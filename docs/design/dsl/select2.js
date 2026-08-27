const COLS = [
  { guid: "2:248", name: "法官列", careerName: "法官", colorName: "苍穹蓝", hex: "#2E6BE6", var: "$c_judge", words: [
    ["公正无私",1,1],["沉稳内敛",0,0],["严谨审慎",1,1],["是非分明",0,0],["敬畏规则",1,1],["客观理性",1,0],["耐心细致",0,0],["大局观强",0,0],
    ["坚守底线",1,0],["思维缜密",0,0],["克制谦和",0,0],["履职尽责",0,0],["明辨是非",0,0],["廉洁自律",0,0],["公允中立",0,0]
  ] },
  { guid: "2:249", name: "检察官列", careerName: "检察官", colorName: "中国红", hex: "#C8102E", var: "$c_prosecutor", words: [
    ["立场坚定",1,0],["嫉恶扬善",1,0],["严谨细致",0,0],["敢于担当",1,1],["权责明晰",0,0],["洞察力强",0,0],["恪守正义",1,1],["执纪严明",0,0],
    ["求真务实",0,0],["思维严谨",0,0],["行动力强",0,0],["忠于法治",1,0],["严谨履职",0,0],["敢于监督",0,0],["清正自律",0,0]
  ] }
];

let ops = `
U("2:246",{autoLayout:{direction:"horizontal",gap:20,padding:[0,64,0,64]}});
U("2:255",{fillPaints:"#F5F7FA29",stroke:{borderWeight:1,strokePaints:"#F5F7FA73"}});
U("2:258",{fillPaints:"#F5F7FA38",stroke:{borderWeight:1,strokePaints:"#F5F7FA",dashPattern:[4,4]},effects:[{type:"drop_shadow",color:"#F5F7FA61",radius:16}]});
U("2:263",{fillPaints:"#F5F7FA38",stroke:{borderWeight:1,strokePaints:"#F5F7FA",dashPattern:[4,4]},effects:[{type:"drop_shadow",color:"#F5F7FA61",radius:16}]});
U("2:268",{fillPaints:"#F5F7FA38",stroke:{borderWeight:1,strokePaints:"#F5F7FA",dashPattern:[4,4]},effects:[{type:"drop_shadow",color:"#F5F7FA61",radius:16}]});
`;

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
