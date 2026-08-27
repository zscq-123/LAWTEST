const RADAR = [
  { label: "逻辑思辨", value: 92 },
  { label: "沟通协作", value: 78 },
  { label: "抗压执行", value: 85 },
  { label: "严谨细致", value: 96 },
  { label: "创新适应", value: 64 }
];
const cx = 150, cy = 120, R = 100;
const pt = (i, r) => {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240" viewBox="0 0 300 240">';
for (const lv of [0.25, 0.5, 0.75, 1]) {
  let pts = "";
  for (let i = 0; i < 5; i++) {
    const [x, y] = pt(i, R * lv);
    pts += (i ? " " : "") + x.toFixed(1) + "," + y.toFixed(1);
  }
  svg += `<polygon points="${pts}" fill="${lv === 1 ? "rgba(46,107,230,0.06)" : "none"}" stroke="rgba(255,255,255,0.14)"/>`;
}
for (let i = 0; i < 5; i++) {
  const [x, y] = pt(i, R);
  svg += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.14)"/>`;
}
let vpts = "";
RADAR.forEach((d, i) => {
  const [x, y] = pt(i, (R * d.value) / 100);
  vpts += (i ? " " : "") + x.toFixed(1) + "," + y.toFixed(1);
});
svg += `<polygon points="${vpts}" fill="rgba(46,107,230,0.32)" stroke="#2E6BE6" stroke-width="2.4" stroke-linejoin="round"/>`;
RADAR.forEach((d, i) => {
  const [x, y] = pt(i, (R * d.value) / 100);
  svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#6AA8FF" stroke="#fff" stroke-width="1.4"/>`;
});
svg += "</svg>";

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
bg=I("2:66",{type:"frame",name:"背景光晕",width:1920,height:1080,layoutPositioning:true,left:0,top:0});
gl1=I(bg,{type:"frame",name:"蓝光",left:-160,top:-140,width:980,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#2E6BE629",position:0},{color:"#2E6BE600",position:1}]}]});
gl2=I(bg,{type:"frame",name:"青光",left:1150,top:-160,width:900,height:580,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#12B5A524",position:0},{color:"#12B5A500",position:1}]}]});
gl3=I(bg,{type:"frame",name:"紫光",left:-180,top:560,width:980,height:640,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#7B5EA72E",position:0},{color:"#7B5EA700",position:1}]}]});
gl4=I(bg,{type:"frame",name:"红光",left:1120,top:540,width:960,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#C8102E29",position:0},{color:"#C8102E00",position:1}]}]});

head=I("2:66",{type:"frame",name:"顶部",width:1920,height:96,autoLayout:{direction:"horizontal",justifyContent:"space_between",alignItems:"flex-end",padding:[0,72,10,72]}});
ht=I(head,{type:"frame",name:"标题区",width:900,height:78,autoLayout:{direction:"vertical",gap:6,justifyContent:"center"}});
ht1=I(ht,{type:"text",nodeText:"我的职业画像",fontFamily:"$font_main",fontSize:"$fs40",fontWeight:800,letterSpacing:3,fillPaints:"$c_judge",effects:[{type:"drop_shadow",color:"#2E6BE680",radius:26,offset:{x:0,y:0}}]});
ht2=I(ht,{type:"text",nodeText:"生成于 2026-08-27 10:30 · 报告编号 WCT202608271234",fontFamily:"$font_main",fontSize:"$fs15",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});
hr=I(head,{type:"frame",name:"重新测试",width:150,height:48,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF47"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hrt=I(hr,{type:"text",nodeText:"重新测试",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:600,letterSpacing:1,fillPaints:"#FFFFFFE0"});

main=I("2:66",{type:"frame",name:"主体",width:1920,height:880,autoLayout:{direction:"horizontal",gap:20,padding:[0,72,0,72]}});
hero=I(main,{type:"frame",name:"Hero卡",width:440,height:880,cornerRadius:"$r14",clip:true,fillPaints:"$bg_dark",stroke:{borderWeight:1,strokePaints:"#2E6BE659"},effects:[{type:"drop_shadow",color:"#00000066",radius:12,offset:{x:0,y:4}}],autoLayout:{direction:"vertical",gap:0}});
hi=I(hero,{type:"frame",name:"插画区",width:440,height:200,fillPaints:[{type:"gradient_linear",stops:[{color:"$c_judge",position:0},{color:"#123A80",position:1}],rotation:160}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hii=I(hi,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"landmark",width:110,height:110,fillPaints:"#FFFFFFB3"});
hb=I(hero,{type:"frame",name:"卡体",width:440,height:680,autoLayout:{direction:"vertical",gap:14,padding:[20,22,22,22]}});
htop=I(hb,{type:"frame",name:"头部行",width:396,height:84,autoLayout:{direction:"horizontal",alignItems:"center",gap:16}});
hv=I(htop,{type:"frame",name:"头像",width:84,height:84,cornerRadius:"$r16",fillPaints:[{type:"gradient_linear",stops:[{color:"$c_judge",position:0},{color:"#123A80",position:1}],rotation:140}],effects:[{type:"drop_shadow",color:"#2E6BE666",radius:20}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hvi=I(hv,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"landmark",width:42,height:42,fillPaints:"$white"});
hvin=I(htop,{type:"frame",name:"名称区",width:280,height:84,autoLayout:{direction:"vertical",gap:6,justifyContent:"center"}});
hvnm=I(hvin,{type:"text",nodeText:"法官",fontFamily:"$font_main",fontSize:"$fs40",fontWeight:800,letterSpacing:3,fillPaints:"$white"});
hvtg=I(hvin,{type:"frame",name:"标签",width:230,height:28,cornerRadius:"$r_pill",fillPaints:"#2E6BE629",stroke:{borderWeight:1,strokePaints:"#2E6BE673"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hvtg1=I(hvtg,{type:"text",nodeText:"苍穹蓝 · 专属色 #2E6BE6",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:500,fillPaints:"$c_judge"});
hrow=I(hb,{type:"frame",name:"匹配行",width:396,height:44,autoLayout:{direction:"horizontal",alignItems:"center",gap:12}});
hmt=I(hrow,{type:"text",nodeText:"86%",fontFamily:"$font_main",fontSize:"$fs30",fontWeight:800,letterSpacing:1,fillPaints:"$c_judge"});
hsl=I(hrow,{type:"text",nodeText:"「法平如水，公正如一」",fontFamily:"$font_main",fontSize:"$fs15",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});
hsc=I(hb,{type:"frame",name:"第二适配",width:230,height:32,cornerRadius:"$r_pill",fillPaints:"#C8102E1F",stroke:{borderWeight:1,strokePaints:"#C8102E73"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hsc1=I(hsc,{type:"text",nodeText:"第二适配 · 检察官 · 72%",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,letterSpacing:0.5,fillPaints:"#FF9AA8"});
hbtns=I(hb,{type:"frame",name:"按钮区",width:396,height:140,autoLayout:{direction:"vertical",gap:10,justifyContent:"flex-end"}});
hb1=I(hbtns,{type:"frame",name:"查看体能方案",width:396,height:52,cornerRadius:"$r_pill",fillPaints:[{type:"gradient_linear",stops:[{color:"$brand_light",position:0},{color:"$brand",position:1}],rotation:180}],effects:[{type:"drop_shadow",color:"#1677FF73",radius:24,offset:{x:0,y:6}}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hb1t=I(hb1,{type:"text",nodeText:"查看体能方案",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:600,letterSpacing:1,fillPaints:"$white"});
hbrow=I(hbtns,{type:"frame",name:"次按钮行",width:396,height:44,autoLayout:{direction:"horizontal",gap:10}});
hb2=I(hbrow,{type:"frame",name:"生成二维码",width:193,height:44,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF47"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:6}});
hb2i=I(hb2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"qrcode",width:16,height:16,fillPaints:"#FFFFFFE0"});
hb2t=I(hb2,{type:"text",nodeText:"生成二维码",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:600,fillPaints:"#FFFFFFE0"});
hb3=I(hbrow,{type:"frame",name:"导师对接",width:193,height:44,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF47"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:6}});
hb3i=I(hb3,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"message-circle",width:16,height:16,fillPaints:"#FFFFFFE0"});
hb3t=I(hb3,{type:"text",nodeText:"导师对接",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:600,fillPaints:"#FFFFFFE0"});

right=I(main,{type:"frame",name:"右栏",width:1416,height:880,autoLayout:{direction:"vertical",gap:14}});
p1=I(right,{type:"frame",name:"雷达面板",width:1416,height:306,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"vertical",gap:10,padding:[14,20]}});
p1t=I(p1,{type:"frame",name:"标题",width:400,height:24,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
p1tb=I(p1t,{type:"frame",name:"色条",width:4,height:18,cornerRadius:2,fillPaints:"$c_judge",effects:[{type:"drop_shadow",color:"#2E6BE699",radius:8}]});
p1tt=I(p1t,{type:"text",nodeText:"能力雷达图",fontFamily:"$font_main",fontSize:"$fs20",fontWeight:600,letterSpacing:1,fillPaints:"$text_main"});
p1row=I(p1,{type:"frame",name:"内容行",width:1376,height:240,autoLayout:{direction:"horizontal",gap:24,alignItems:"center"}});
radar=I(p1row,{type:"frame",name:"雷达图",width:480,height:240,autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
rdv=I(radar,{type:"vector",name:"雷达矢量",svg:"${svg}"});
rv=I(p1row,{type:"frame",name:"数值列表",width:440,height:210,autoLayout:{direction:"vertical",gap:8,justifyContent:"center"}});
`;

RADAR.forEach((d, i) => {
  ops += `
rv${i}=I(rv,{type:"frame",name:"${d.label}值",width:440,height:32,cornerRadius:"$r6",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF14"},autoLayout:{direction:"horizontal",justifyContent:"space_between",alignItems:"center",padding:[0,12]}});
rvl${i}=I(rv${i},{type:"text",nodeText:"${d.label}",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,fillPaints:"$text_sub"});
rvv${i}=I(rv${i},{type:"text",nodeText:"${d.value}",fontFamily:"$font_main",fontSize:"$fs15",fontWeight:800,fillPaints:"#6AA8FF"});
`;
});

ops += `
p2=I(right,{type:"frame",name:"优势面板",width:1416,height:276,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"vertical",gap:10,padding:[14,20]}});
p2t=I(p2,{type:"frame",name:"标题",width:400,height:24,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
p2tb=I(p2t,{type:"frame",name:"色条",width:4,height:18,cornerRadius:2,fillPaints:"$c_judge",effects:[{type:"drop_shadow",color:"#2E6BE699",radius:8}]});
p2tt=I(p2t,{type:"text",nodeText:"你的能力优势",fontFamily:"$font_main",fontSize:"$fs20",fontWeight:600,letterSpacing:1,fillPaints:"$text_main"});
p2l=I(p2,{type:"frame",name:"列表",width:1376,height:210,autoLayout:{direction:"vertical",gap:8}});
`;

STRENGTHS.forEach((s, i) => {
  ops += `
pi${i}=I(p2l,{type:"frame",name:"条目${i + 1}",width:1376,height:46,cornerRadius:"$r10",fillPaints:"#FFFFFF08",stroke:{borderWeight:1,strokePaints:"#FFFFFF12"},autoLayout:{direction:"horizontal",alignItems:"center",gap:14,padding:[0,14]}});
pn${i}=I(pi${i},{type:"frame",name:"序号",width:24,height:24,cornerRadius:"auto",fillPaints:"$c_judge",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
pnt${i}=I(pn${i},{type:"text",nodeText:"${i + 1}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:700,fillPaints:"$white"});
ptx${i}=I(pi${i},{type:"text",nodeText:"${s}",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,lineHeight:1.5,textGrowth:"fixed-width",width:1310,fillPaints:"$text_sub"});
`;
});

ops += `
p3=I(right,{type:"frame",name:"短板面板",width:1416,height:276,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"vertical",gap:10,padding:[14,20]}});
p3t=I(p3,{type:"frame",name:"标题",width:400,height:24,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
p3tb=I(p3t,{type:"frame",name:"色条",width:4,height:18,cornerRadius:2,fillPaints:"$warning",effects:[{type:"drop_shadow",color:"#FAAD1499",radius:8}]});
p3tt=I(p3t,{type:"text",nodeText:"短板与提升建议",fontFamily:"$font_main",fontSize:"$fs20",fontWeight:600,letterSpacing:1,fillPaints:"$text_main"});
p3l=I(p3,{type:"frame",name:"列表",width:1376,height:210,autoLayout:{direction:"vertical",gap:8}});
`;

IMPROVES.forEach((s, i) => {
  ops += `
qi${i}=I(p3l,{type:"frame",name:"条目${i + 1}",width:1376,height:46,cornerRadius:"$r10",fillPaints:"#FFFFFF08",stroke:{borderWeight:1,strokePaints:"#FFFFFF12"},autoLayout:{direction:"horizontal",alignItems:"center",gap:14,padding:[0,14]}});
qn${i}=I(qi${i},{type:"frame",name:"序号",width:24,height:24,cornerRadius:"auto",fillPaints:"$warning",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
qnt${i}=I(qn${i},{type:"text",nodeText:"${i + 1}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:700,fillPaints:"$white"});
qtx${i}=I(qi${i},{type:"text",nodeText:"${s}",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,lineHeight:1.5,textGrowth:"fixed-width",width:1310,fillPaints:"$text_sub"});
`;
});

ops += `
dsc=I("2:66",{type:"text",nodeText:"本结果为兴趣初步画像，仅供参考",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
`;

export default { tool: "apply_design", args: { operations: ops } };
