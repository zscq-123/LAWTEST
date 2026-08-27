const CAREERS = [
  { name: "律师", colorName: "皓月白", color: "$c_lawyer", words: [
    ["思辨敏捷",1,1],["口齿清晰",0,0],["文笔流畅",0,0],["逻辑缜密",1,1],["善于沟通",1,1],["临场应变",1,0],["共情包容",0,0],["抗压坚韧",1,0],
    ["细节敏锐",0,0],["善于论证",0,0],["灵活变通",0,0],["责任心强",0,0],["表达自信",0,0],["复盘总结",0,0],["维权果敢",0,0]
  ] }
];

let ops = `
bg=I("2:63",{type:"frame",name:"背景光晕",width:1920,height:1080,layoutPositioning:true,left:0,top:0});
gl1=I(bg,{type:"frame",name:"蓝光",left:-160,top:-140,width:980,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#2E6BE629",position:0},{color:"#2E6BE600",position:1}]}]});
gl2=I(bg,{type:"frame",name:"青光",left:1150,top:-160,width:900,height:580,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#12B5A524",position:0},{color:"#12B5A500",position:1}]}]});
gl3=I(bg,{type:"frame",name:"紫光",left:-180,top:560,width:980,height:640,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#7B5EA72E",position:0},{color:"#7B5EA700",position:1}]}]});
gl4=I(bg,{type:"frame",name:"红光",left:1120,top:540,width:960,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#C8102E29",position:0},{color:"#C8102E00",position:1}]}]});

head=I("2:63",{type:"frame",name:"顶部",width:1920,height:132,autoLayout:{direction:"horizontal",justifyContent:"space_between",alignItems:"center",padding:[0,72,0,72]}});
lt=I(head,{type:"frame",name:"标题区",width:700,height:96,autoLayout:{direction:"vertical",gap:8,justifyContent:"center"}});
lt1=I(lt,{type:"text",nodeText:"勾选最像你的特质词",fontFamily:"$font_main",fontSize:"$fs36",fontWeight:800,letterSpacing:2,fillPaints:"$text_main"});
lt2=I(lt,{type:"text",nodeText:"每词对应一个职业方向，颜色即该职业 · 虚线边框为核心词",fontFamily:"$font_main",fontSize:"$fs15",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});
pg=I(head,{type:"frame",name:"进度面板",width:560,height:92,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"horizontal",alignItems:"center",gap:24,padding:[16,24]}});
pgw=I(pg,{type:"frame",name:"进度条区",width:300,height:48,autoLayout:{direction:"vertical",gap:6,justifyContent:"center"}});
track=I(pgw,{type:"frame",name:"进度轨道",width:300,height:6,cornerRadius:"$r_pill",fillPaints:"#FFFFFF1A"});
fill=I(track,{type:"frame",name:"进度填充",width:300,height:6,cornerRadius:"$r_pill",fillPaints:[{type:"gradient_linear",stops:[{color:"#73D13D",position:0},{color:"$success",position:1}],rotation:90}]});
cap=I(pgw,{type:"text",nodeText:"进度 · 选满 10 个即可开始匹配",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});
pgc=I(pg,{type:"frame",name:"计数区",width:140,height:52,autoLayout:{direction:"vertical",gap:2,alignItems:"flex-end"}});
pgc1=I(pgc,{type:"text",nodeText:"10 / 10",fontFamily:"$font_main",fontSize:"$fs32",fontWeight:800,letterSpacing:1,fillPaints:"$text_main"});
pgc2=I(pgc,{type:"text",nodeText:"已选 10 个词",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});

area=I("2:63",{type:"frame",name:"词卡区",width:1920,height:742,autoLayout:{direction:"horizontal",gap:20,padding:[0,72,0,72]},clip:true});
`;

for (let c = 1; c <= 5; c++) {
  ops += `col${c}=I(area,{type:"frame",name:"${CAREERS[0]?.name || "列" + c}列",width:340,height:742,autoLayout:{direction:"vertical",gap:10},clip:true});\n`;
}

// 律师列内容
const col = CAREERS[0];
ops += `
ch=I(col1,{type:"frame",name:"列头",width:340,height:56,autoLayout:{direction:"horizontal",alignItems:"center",gap:10,padding:[0,0,0,16]},stroke:{borderWeight:[0,0,0,2],strokePaints:"${col.color}"}});
cd=I(ch,{type:"frame",name:"圆点",width:8,height:8,cornerRadius:"auto",fillPaints:"${col.color}",effects:[{type:"drop_shadow",color:"${col.color}",radius:8}]});
cn=I(ch,{type:"text",nodeText:"${col.name}",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:700,letterSpacing:1,fillPaints:"$text_main"});
ct=I(ch,{type:"frame",name:"标签",width:110,height:24,cornerRadius:"$r_pill",fillPaints:"${col.color}29",stroke:{borderWeight:1,strokePaints:"${col.color}73"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ctt=I(ct,{type:"text",nodeText:"${col.colorName}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:500,fillPaints:"${col.color}"});
`;

for (let r = 0; r < 8; r++) {
  ops += `rw${r}=I(col1,{type:"frame",name:"行${r + 1}",width:340,height:64,autoLayout:{direction:"horizontal",gap:10}});\n`;
  for (let j = 0; j < 2; j++) {
    const idx = r * 2 + j;
    if (idx >= 15) continue;
    const [word, core, selected] = col.words[idx];
    const fill = selected ? `${col.color}38` : "#FFFFFF0D";
    const stroke = selected
      ? `{borderWeight:1,strokePaints:"${col.color}",dashPattern:${core ? "[4,4]" : "null"}}`
      : `{borderWeight:1,strokePaints:"#FFFFFF38",dashPattern:[4,4]}`;
    const glow = selected ? `,effects:[{type:"drop_shadow",color:"${col.color}61",radius:16}]` : "";
    ops += `wc${r}_${j}=I(rw${r},{type:"frame",name:"词卡",width:156,height:64,cornerRadius:"$r10",fillPaints:"${fill}",stroke:${stroke}${glow},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});\n`;
    ops += `wt${r}_${j}=I(wc${r}_${j},{type:"text",nodeText:"${word}",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:${selected ? 600 : 400},letterSpacing:1,fillPaints:"${selected ? "#FFFFFF" : "#FFFFFFAD"}"});\n`;
  }
}

export default { tool: "apply_design", args: { operations: ops } };
