const WORDS = [
  ["公正无私", "#2E6BE6"], ["严谨审慎", "#2E6BE6"], ["敬畏规则", "#2E6BE6"],
  ["敢于担当", "#C8102E"], ["恪守正义", "#C8102E"],
  ["思辨敏捷", "#4A5568"], ["逻辑缜密", "#4A5568"], ["善于沟通", "#4A5568"],
  ["细致严谨", "#7B5EA7"], ["创新思维", "#12B5A5"]
];
const STRENGTHS = [
  "公正无私、是非分明：心中有标尺，天然能守住中立与底线。",
  "严谨审慎、客观理性：不轻信、不臆断，习惯用证据和逻辑说话。",
  "大局观强、思维缜密：看问题不局限于局部，能统筹全局。",
  "耐心细致、克制谦和：坐得住、沉得下，情绪稳定有定力。"
];
const IMPROVES = [
  "连续开庭与久坐对体态和腰椎考验大——从大一开始练核心与站姿。",
  "过度追求周全可能决策偏慢——练习在信息有限时果断决策。",
  "克制内敛易把情绪闷在心里——学会健康释放压力。",
  "专业之外多接触社会百态，才能让裁判更贴近人情。"
];

let ops = `
hero=I("2:68",{type:"frame",name:"Hero",width:390,height:424,clip:true,fillPaints:[{type:"gradient_linear",stops:[{color:"$c_judge",position:0},{color:"#123A80",position:0.6},{color:"#0B1D40",position:1}],rotation:165}],autoLayout:{direction:"vertical",alignItems:"center",justifyContent:"end",gap:8,padding:[0,24,34,24]}});
heroi=I(hero,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"landmark",width:220,height:220,fillPaints:"#FFFFFF38",layoutPositioning:true,left:85,top:20});
hpm=I(hero,{type:"frame",name:"顶蒙版",width:390,height:200,fillPaints:[{type:"gradient_linear",stops:[{color:"#0912269E",position:0},{color:"#09122600",position:1}],rotation:180}],layoutPositioning:true,left:0,top:0});
hpill=I(hero,{type:"frame",name:"标签",width:190,height:28,cornerRadius:"$r_pill",fillPaints:"#FFFFFF29",stroke:{borderWeight:1,strokePaints:"#FFFFFF73"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hpill1=I(hpill,{type:"text",nodeText:"五彩法途 · 职业画像",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,letterSpacing:2,fillPaints:"$white"});
hnm=I(hero,{type:"text",nodeText:"法官",fontFamily:"$font_main",fontSize:"$fs34",fontWeight:800,letterSpacing:5,fillPaints:"$white"});
hsl=I(hero,{type:"text",nodeText:"「法平如水，公正如一」",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:2,fillPaints:"#FFFFFFC7"});
hmt=I(hero,{type:"text",nodeText:"86%",fontFamily:"$font_main",fontSize:"$fs52",fontWeight:800,letterSpacing:1,fillPaints:"$white",effects:[{type:"drop_shadow",color:"#FFFFFF59",radius:26,offset:{x:0,y:0}}]});
hdiv=I(hero,{type:"frame",name:"分隔线",width:64,height:1,fillPaints:"#FFFFFF66"});
hsc=I(hero,{type:"text",nodeText:"第二适配 · 检察官 · 72%",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"#FFFFFFD9"});
hcd=I(hero,{type:"text",nodeText:"报告编号 WCT202608271234",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:400,letterSpacing:1,fillPaints:"#FFFFFF8C"});

c1=I("2:68",{type:"frame",name:"特质词卡",width:358,height:150,cornerRadius:"$r14",fillPaints:"$white",effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:10,padding:[14,14]}});
c1t=I(c1,{type:"frame",name:"标题",width:320,height:22,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
c1tb=I(c1t,{type:"frame",name:"色条",width:4,height:16,cornerRadius:2,fillPaints:"$c_judge"});
c1tt=I(c1t,{type:"text",nodeText:"你勾选的特质词",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
c1w=I(c1,{type:"frame",name:"词流",width:330,height:92,autoLayout:{direction:"horizontal",wrap:true,gap:7}});
`;

WORDS.forEach(([w, hex], i) => {
  ops += `
w${i}=I(c1w,{type:"frame",name:"词${i + 1}",height:28,autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",padding:[0,12]},cornerRadius:"$r_pill",fillPaints:"${hex}1A",stroke:{borderWeight:1,strokePaints:"${hex}57"}});
wt${i}=I(w${i},{type:"text",nodeText:"${w}",fontFamily:"$font_main",fontSize:12.5,fontWeight:600,fillPaints:"${hex}"});
`;
});

ops += `
c2=I("2:68",{type:"frame",name:"优势卡",width:358,height:306,cornerRadius:"$r14",fillPaints:"$white",effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:10,padding:[14,14]}});
c2t=I(c2,{type:"frame",name:"标题",width:320,height:22,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
c2tb=I(c2t,{type:"frame",name:"色条",width:4,height:16,cornerRadius:2,fillPaints:"$c_judge"});
c2tt=I(c2t,{type:"text",nodeText:"你的能力优势",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
c2l=I(c2,{type:"frame",name:"列表",width:330,height:250,autoLayout:{direction:"vertical",gap:8}});
`;

STRENGTHS.forEach((s, i) => {
  ops += `
s${i}=I(c2l,{type:"frame",name:"条目${i + 1}",width:330,height:56,autoLayout:{direction:"horizontal",alignItems:"flex-start",gap:10}});
sn${i}=I(s${i},{type:"frame",name:"序号",width:21,height:21,cornerRadius:"auto",fillPaints:"$c_judge",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
snt${i}=I(sn${i},{type:"text",nodeText:"${i + 1}",fontFamily:"$font_main",fontSize:11.5,fontWeight:700,fillPaints:"$white"});
stx${i}=I(s${i},{type:"text",nodeText:"${s}",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,lineHeight:1.5,textGrowth:"fixed-width",width:296,fillPaints:"#3D4A5C"});
`;
});

ops += `
c3=I("2:68",{type:"frame",name:"短板卡",width:358,height:306,cornerRadius:"$r14",fillPaints:"$white",effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:10,padding:[14,14]}});
c3t=I(c3,{type:"frame",name:"标题",width:320,height:22,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
c3tb=I(c3t,{type:"frame",name:"色条",width:4,height:16,cornerRadius:2,fillPaints:"$warning"});
c3tt=I(c3t,{type:"text",nodeText:"短板与提升建议",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
c3l=I(c3,{type:"frame",name:"列表",width:330,height:250,autoLayout:{direction:"vertical",gap:8}});
`;

IMPROVES.forEach((s, i) => {
  ops += `
u${i}=I(c3l,{type:"frame",name:"条目${i + 1}",width:330,height:56,autoLayout:{direction:"horizontal",alignItems:"flex-start",gap:10}});
un${i}=I(u${i},{type:"frame",name:"序号",width:21,height:21,cornerRadius:"auto",fillPaints:"$warning",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
unt${i}=I(un${i},{type:"text",nodeText:"${i + 1}",fontFamily:"$font_main",fontSize:11.5,fontWeight:700,fillPaints:"$white"});
utx${i}=I(u${i},{type:"text",nodeText:"${s}",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,lineHeight:1.5,textGrowth:"fixed-width",width:296,fillPaints:"#3D4A5C"});
`;
});

ops += `
c4=I("2:68",{type:"frame",name:"雷达卡",width:358,height:270,cornerRadius:"$r14",fillPaints:"$white",effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:10,padding:[14,14]}});
c4t=I(c4,{type:"frame",name:"标题",width:320,height:22,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
c4tb=I(c4t,{type:"frame",name:"色条",width:4,height:16,cornerRadius:2,fillPaints:"$c_judge"});
c4tt=I(c4t,{type:"text",nodeText:"能力雷达图",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
c4r=I(c4,{type:"frame",name:"雷达区",width:330,height:210,autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
c4box=I(c4r,{type:"frame",name:"雷达图",width:300,height:196,autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
`;

export default { tool: "apply_design", args: { operations: ops } };
