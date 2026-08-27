const RACES = [
  { name: "法官", color: "苍穹蓝", hex: "#2E6BE6", pct: 70, h: 301, lead: true },
  { name: "检察官", color: "中国红", hex: "#C8102E", pct: 58, h: 249, lead: false },
  { name: "律师", color: "皓月白", hex: "#F5F7FA", pct: 45, h: 194, lead: false },
  { name: "企业法务", color: "琉璃紫", hex: "#7B5EA7", pct: 32, h: 138, lead: false },
  { name: "AI伦理合规顾问", color: "科创青", hex: "#12B5A5", pct: 20, h: 86, lead: false }
];

let ops = `
bg=I("2:64",{type:"frame",name:"背景光晕",width:1920,height:1080,layoutPositioning:true,left:0,top:0});
gl1=I(bg,{type:"frame",name:"蓝光",left:-160,top:-140,width:980,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#2E6BE629",position:0},{color:"#2E6BE600",position:1}]}]});
gl2=I(bg,{type:"frame",name:"青光",left:1150,top:-160,width:900,height:580,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#12B5A524",position:0},{color:"#12B5A500",position:1}]}]});
gl3=I(bg,{type:"frame",name:"紫光",left:-180,top:560,width:980,height:640,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#7B5EA72E",position:0},{color:"#7B5EA700",position:1}]}]});
gl4=I(bg,{type:"frame",name:"红光",left:1120,top:540,width:960,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#C8102E29",position:0},{color:"#C8102E00",position:1}]}]});

steps=I("2:64",{type:"frame",name:"流程步骤条",width:780,height:60,autoLayout:{direction:"horizontal",alignItems:"center",gap:0,padding:[14,30]},cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},effects:[{type:"background_blur",radius:12,saturation:1}]});
st1=I(steps,{type:"frame",name:"步骤1",width:110,height:30,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd1=I(st1,{type:"frame",name:"圆点1",width:30,height:30,cornerRadius:"auto",fillPaints:"#1677FF2E",stroke:{borderWeight:1,strokePaints:"$brand"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn1=I(sd1,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"check",width:14,height:14,fillPaints:"#6AA8FF"});
sl1=I(st1,{type:"text",nodeText:"勾选特质",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"#FFFFFFC7"});
ln1=I(steps,{type:"frame",name:"连线1",width:88,height:1,fillPaints:[{type:"gradient_linear",stops:[{color:"#1677FFB3",position:0},{color:"#FFFFFF24",position:1}],rotation:90}]});
st2=I(steps,{type:"frame",name:"步骤2",width:110,height:30,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd2=I(st2,{type:"frame",name:"圆点2",width:30,height:30,cornerRadius:"auto",fillPaints:"$brand",stroke:{borderWeight:1,strokePaints:"$brand"},effects:[{type:"drop_shadow",color:"#1677FF73",radius:14}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn2=I(sd2,{type:"text",nodeText:"2",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$white"});
sl2=I(st2,{type:"text",nodeText:"匹配职业",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:600,letterSpacing:1,fillPaints:"$white"});
ln2=I(steps,{type:"frame",name:"连线2",width:88,height:1,fillPaints:"#FFFFFF24"});
st3=I(steps,{type:"frame",name:"步骤3",width:110,height:30,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd3=I(st3,{type:"frame",name:"圆点3",width:30,height:30,cornerRadius:"auto",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF38"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn3=I(sd3,{type:"text",nodeText:"3",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$text_faint"});
sl3=I(st3,{type:"text",nodeText:"揭晓画像",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
ln3=I(steps,{type:"frame",name:"连线3",width:88,height:1,fillPaints:"#FFFFFF24"});
st4=I(steps,{type:"frame",name:"步骤4",width:110,height:30,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd4=I(st4,{type:"frame",name:"圆点4",width:30,height:30,cornerRadius:"auto",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF38"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn4=I(sd4,{type:"text",nodeText:"4",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$text_faint"});
sl4=I(st4,{type:"text",nodeText:"扫码保存",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});

mt=I("2:64",{type:"text",nodeText:"正在为你匹配职业方向…",fontFamily:"$font_main",fontSize:"$fs56",fontWeight:800,letterSpacing:4,fillPaints:"$text_main",effects:[{type:"drop_shadow",color:"#8CBEFF8C",radius:22,offset:{x:0,y:0}},{type:"drop_shadow",color:"#2E6BE659",radius:50,offset:{x:0,y:0}}]});
ms=I("2:64",{type:"text",nodeText:"五色能量柱正在竞速 · 你的特质正在汇聚成答案",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:400,letterSpacing:2,fillPaints:"$text_sub"});

race=I("2:64",{type:"frame",name:"竞速区",width:1200,height:640,autoLayout:{direction:"horizontal",justifyContent:"space_between",alignItems:"stretch",padding:[18,10,6,10]}});
`;

RACES.forEach((r, i) => {
  ops += `
ri${i}=I(race,{type:"frame",name:"${r.name}赛道",width:200,height:640,autoLayout:{direction:"vertical",alignItems:"center",gap:14}});
rn${i}=I(ri${i},{type:"frame",name:"名称",width:200,height:52,autoLayout:{direction:"vertical",alignItems:"center",gap:6}});
rnt${i}=I(rn${i},{type:"text",nodeText:"${r.name}",fontFamily:"$font_main",fontSize:"$fs19",fontWeight:700,letterSpacing:2,fillPaints:"$white"});
rsc${i}=I(rn${i},{type:"text",nodeText:"${r.color}",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"${r.hex}"});
tube${i}=I(ri${i},{type:"frame",name:"柱管",width:152,height:430,cornerRadius:"$r24",fillPaints:"#FFFFFF12",stroke:{borderWeight:1,strokePaints:"#FFFFFF1F"},autoLayout:{direction:"vertical",justifyContent:"end"},clip:true});
fill${i}=I(tube${i},{type:"frame",name:"能量填充",width:152,height:${r.h},cornerRadius:"$r24",fillPaints:[{type:"gradient_linear",stops:[{color:"${r.hex}E6",position:0},{color:"${r.hex}",position:1}],rotation:180}],effects:[{type:"drop_shadow",color:"${r.hex}7A",radius:24}],autoLayout:{direction:"vertical",alignItems:"center",padding:[12,0,0,0]}});
fsc${i}=I(fill${i},{type:"text",nodeText:"${r.pct}%",fontFamily:"$font_main",fontSize:"$fs32",fontWeight:800,letterSpacing:1,fillPaints:"$white"});
pct${i}=I(ri${i},{type:"text",nodeText:"${r.pct}%",fontFamily:"$font_main",fontSize:"$fs22",fontWeight:800,letterSpacing:1,fillPaints:"${r.hex}"});
`;
  if (r.lead) {
    ops += `
badge=I(tube0,{type:"frame",name:"领跑徽章",width:104,height:28,cornerRadius:"$r_pill",fillPaints:[{type:"gradient_linear",stops:[{color:"#FFD666",position:0},{color:"$warning",position:1}],rotation:90}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:5},layoutPositioning:true,left:24,top:-14});
badgi=I(badge,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"zap",width:14,height:14,fillPaints:"#5C3D00"});
badgt=I(badge,{type:"text",nodeText:"领跑",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,letterSpacing:1,fillPaints:"#5C3D00"});
`;
  }
});

ops += `
dsc=I("2:64",{type:"text",nodeText:"本结果为兴趣初步画像，仅供参考 · 测试时长约 2 分钟",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
`;

export default { tool: "apply_design", args: { operations: ops } };
