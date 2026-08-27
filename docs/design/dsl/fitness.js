const REQS = [
  "体检标准：严格符合公务员录用体检通用标准，无传染病、无影响履职的身体缺陷。",
  "体态风貌：五官端正、体态得体，具备良好精神风貌，适配庭审履职场景。",
  "视力要求：视力达标，无色盲色弱，可长期审阅卷宗、研判案件。",
  "身心耐力：身心稳定、耐力充足，可适应连续开庭、密集合议、加班办案的高强度节奏。"
];
const PLAN = [
  ["大一 · 体能筑基", "按公务员体检标准完成预检，建立慢跑＋拉伸习惯，改善体态。"],
  ["大二 · 专项强化", "站姿坐姿形体训练，下肢耐力训练，适配连续开庭久坐/久站。"],
  ["大三 · 职业场景模拟", "长时间庭审模拟下的注意力训练，情绪调节与放松练习。"],
  ["大四 · 达标冲刺", "体检复查与达标冲刺，保持有氧＋核心训练常态化。"]
];

let ops = `
bg=I("2:67",{type:"frame",name:"背景光晕",width:1920,height:1080,layoutPositioning:true,left:0,top:0});
gl1=I(bg,{type:"frame",name:"蓝光",left:-160,top:-140,width:980,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#2E6BE629",position:0},{color:"#2E6BE600",position:1}]}]});
gl2=I(bg,{type:"frame",name:"青光",left:1150,top:-160,width:900,height:580,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#12B5A524",position:0},{color:"#12B5A500",position:1}]}]});
gl3=I(bg,{type:"frame",name:"紫光",left:-180,top:560,width:980,height:640,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#7B5EA72E",position:0},{color:"#7B5EA700",position:1}]}]});
gl4=I(bg,{type:"frame",name:"红光",left:1120,top:540,width:960,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#C8102E29",position:0},{color:"#C8102E00",position:1}]}]});

head=I("2:67",{type:"frame",name:"顶部",width:1920,height:96,autoLayout:{direction:"horizontal",justifyContent:"space_between",alignItems:"flex-end",padding:[0,72,10,72]}});
ht=I(head,{type:"frame",name:"标题区",width:1000,height:78,autoLayout:{direction:"vertical",gap:6,justifyContent:"center"}});
ht1=I(ht,{type:"text",nodeText:"法官 · 体能赋能方案",fontFamily:"$font_main",fontSize:"$fs40",fontWeight:800,letterSpacing:2,fillPaints:"$text_main"});
ht1j=I(ht,{type:"text",nodeText:"法官 · 体能赋能方案",fontFamily:"$font_main",fontSize:"$fs40",fontWeight:800,letterSpacing:2,fillPaints:"$c_judge",effects:[{type:"drop_shadow",color:"#2E6BE680",radius:26,offset:{x:0,y:0}}],layoutPositioning:true,left:0,top:0});
ht2=I(ht,{type:"text",nodeText:"身体是职业长跑的本钱，大学四年一步一步来",fontFamily:"$font_main",fontSize:"$fs15",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});
hr=I(head,{type:"frame",name:"返回画像",width:150,height:48,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF47"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
hrt=I(hr,{type:"text",nodeText:"返回画像",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:600,letterSpacing:1,fillPaints:"#FFFFFFE0"});

main=I("2:67",{type:"frame",name:"主体",width:1920,height:830,autoLayout:{direction:"horizontal",gap:20,padding:[0,72,0,72]}});
left=I(main,{type:"frame",name:"插画卡",width:360,height:830,cornerRadius:"$r14",clip:true,fillPaints:"$bg_dark",stroke:{borderWeight:1,strokePaints:"#2E6BE659"},effects:[{type:"drop_shadow",color:"#00000066",radius:12,offset:{x:0,y:4}}],autoLayout:{direction:"vertical",gap:0}});
li=I(left,{type:"frame",name:"插画区",width:360,height:520,fillPaints:[{type:"gradient_linear",stops:[{color:"$c_judge",position:0},{color:"#0E2B5E",position:1}],rotation:160}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
lii=I(li,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"landmark",width:160,height:160,fillPaints:"#FFFFFFB3"});
lb=I(left,{type:"frame",name:"信息区",width:360,height:310,autoLayout:{direction:"vertical",alignItems:"center",gap:10,justifyContent:"center",padding:[0,24]}});
lbt=I(lb,{type:"frame",name:"标签",width:150,height:28,cornerRadius:"$r_pill",fillPaints:"#2E6BE629",stroke:{borderWeight:1,strokePaints:"#2E6BE673"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
lbt1=I(lbt,{type:"text",nodeText:"苍穹蓝 #2E6BE6",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:500,fillPaints:"$c_judge"});
lbn=I(lb,{type:"text",nodeText:"法官",fontFamily:"$font_main",fontSize:"$fs26",fontWeight:800,letterSpacing:3,fillPaints:"$white"});
lbs=I(lb,{type:"text",nodeText:"「法平如水，公正如一」",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});

mid=I(main,{type:"frame",name:"达标要求",width:680,height:830,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"vertical",gap:12,padding:[18,22]}});
mt=I(mid,{type:"frame",name:"标题",width:400,height:26,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
mtb=I(mt,{type:"frame",name:"色条",width:4,height:20,cornerRadius:2,fillPaints:"$c_judge",effects:[{type:"drop_shadow",color:"#2E6BE699",radius:8}]});
mtt=I(mt,{type:"text",nodeText:"身体素质达标要求",fontFamily:"$font_main",fontSize:"$fs22",fontWeight:600,letterSpacing:1,fillPaints:"$text_main"});
ml=I(mid,{type:"frame",name:"列表",width:636,height:740,autoLayout:{direction:"vertical",gap:10}});
`;

REQS.forEach((s, i) => {
  ops += `
mi${i}=I(ml,{type:"frame",name:"条目${i + 1}",width:636,height:172,cornerRadius:"$r10",fillPaints:"#FFFFFF08",stroke:{borderWeight:1,strokePaints:"#FFFFFF12"},autoLayout:{direction:"horizontal",alignItems:"flex-start",gap:14,padding:[16,16]}});
mn${i}=I(mi${i},{type:"frame",name:"序号",width:26,height:26,cornerRadius:"auto",fillPaints:"$c_judge",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
mnt${i}=I(mn${i},{type:"text",nodeText:"${i + 1}",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$white"});
mtx${i}=I(mi${i},{type:"text",nodeText:"${s}",fontFamily:"$font_main",fontSize:"$fs15",fontWeight:400,lineHeight:1.6,textGrowth:"fixed-width",width:560,fillPaints:"$text_sub"});
`;
});

ops += `
right=I(main,{type:"frame",name:"锻炼计划",width:680,height:830,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"vertical",gap:12,padding:[18,22]}});
rt=I(right,{type:"frame",name:"标题",width:500,height:26,autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
rtb=I(rt,{type:"frame",name:"色条",width:4,height:20,cornerRadius:2,fillPaints:"$c_judge",effects:[{type:"drop_shadow",color:"#2E6BE699",radius:8}]});
rtt=I(rt,{type:"text",nodeText:"大学四年阶梯式锻炼计划",fontFamily:"$font_main",fontSize:"$fs22",fontWeight:600,letterSpacing:1,fillPaints:"$text_main"});
tl=I(right,{type:"frame",name:"时间线",width:636,height:740,autoLayout:{direction:"vertical",gap:0}});
`;

PLAN.forEach(([t, c], i) => {
  ops += `
tn${i}=I(tl,{type:"frame",name:"节点${i + 1}",width:636,height:185,autoLayout:{direction:"horizontal",gap:14}});
td${i}=I(tn${i},{type:"frame",name:"圆点区",width:26,height:185,autoLayout:{direction:"vertical",alignItems:"center"}});
tdl${i}=I(td${i},{type:"frame",name:"竖线",width:2,height:185,fillPaints:${i < 3 ? "#2E6BE6B3" : "#2E6BE600"},layoutPositioning:true,left:12,top:0});
tdd${i}=I(td${i},{type:"frame",name:"圆点",width:20,height:20,cornerRadius:"auto",fillPaints:"$bg_dark",stroke:{borderWeight:2,strokePaints:"$c_judge"},effects:[{type:"drop_shadow",color:"#2E6BE68C",radius:10}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"},layoutPositioning:true,left:3,top:4});
tdc${i}=I(tdd${i},{type:"frame",name:"内点",width:6,height:6,cornerRadius:"auto",fillPaints:"$c_judge"});
ttx${i}=I(tn${i},{type:"frame",name:"文本区",width:596,height:185,autoLayout:{direction:"vertical",gap:6}});
ttt${i}=I(ttx${i},{type:"text",nodeText:"${t}",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:700,letterSpacing:1,fillPaints:"$white"});
ttc${i}=I(ttx${i},{type:"text",nodeText:"${c}",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,lineHeight:1.6,textGrowth:"fixed-width",width:596,fillPaints:"$text_sub"});
`;
});

ops += `
foot=I("2:67",{type:"frame",name:"底部操作",width:1920,height:140,autoLayout:{direction:"vertical",alignItems:"center",gap:10,justifyContent:"center"}});
fa=I(foot,{type:"frame",name:"按钮组",width:440,height:56,autoLayout:{direction:"horizontal",gap:16}});
fb1=I(fa,{type:"frame",name:"扫码带走",width:210,height:56,cornerRadius:"$r_pill",fillPaints:[{type:"gradient_linear",stops:[{color:"$brand_light",position:0},{color:"$brand",position:1}],rotation:180}],effects:[{type:"drop_shadow",color:"#1677FF73",radius:24,offset:{x:0,y:6}}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:8}});
fb1i=I(fb1,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"qrcode",width:20,height:20,fillPaints:"$white"});
fb1t=I(fb1,{type:"text",nodeText:"扫码带走",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:600,letterSpacing:1,fillPaints:"$white"});
fb2=I(fa,{type:"frame",name:"导师对接",width:210,height:56,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF47"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:8}});
fb2i=I(fb2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"message-circle",width:20,height:20,fillPaints:"#FFFFFFE0"});
fb2t=I(fb2,{type:"text",nodeText:"导师对接",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:600,letterSpacing:1,fillPaints:"#FFFFFFE0"});
fd=I(foot,{type:"text",nodeText:"本内容为通识性建议，非医疗意见；如有健康问题请遵医嘱。",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
`;

export default { tool: "apply_design", args: { operations: ops } };
