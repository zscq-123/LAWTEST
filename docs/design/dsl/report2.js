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
const MENTORS = [
  ["王", "王法官（示例）", "基层法院法官 · 民事审判庭", "微信：wang-judge-demo"],
  ["孙", "孙法官（示例）", "中级法院法官 · 刑事审判庭", "微信：sun-judge-demo"]
];

let ops = `
c5=I("2:68",{type:"frame",name:"达标卡",width:358,height:244,cornerRadius:"$r14",fillPaints:"$white",effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:10,padding:[14,14]}});
c5t=I(c5,{type:"frame",name:"标题",width:320,height:22,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
c5tb=I(c5t,{type:"frame",name:"色条",width:4,height:16,cornerRadius:2,fillPaints:"$c_judge"});
c5tt=I(c5t,{type:"text",nodeText:"身体素质达标要求",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
c5l=I(c5,{type:"frame",name:"列表",width:330,height:184,autoLayout:{direction:"vertical",gap:8}});
`;

REQS.forEach((s, i) => {
  ops += `
r${i}=I(c5l,{type:"frame",name:"条目${i + 1}",width:330,height:40,autoLayout:{direction:"horizontal",alignItems:"flex-start",gap:10}});
rn${i}=I(r${i},{type:"frame",name:"序号",width:21,height:21,cornerRadius:"auto",fillPaints:"$c_judge",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
rnt${i}=I(rn${i},{type:"text",nodeText:"${i + 1}",fontFamily:"$font_main",fontSize:11.5,fontWeight:700,fillPaints:"$white"});
rtx${i}=I(r${i},{type:"text",nodeText:"${s}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:400,lineHeight:1.45,textGrowth:"fixed-width",width:296,fillPaints:"#3D4A5C"});
`;
});

ops += `
c6=I("2:68",{type:"frame",name:"计划卡",width:358,height:308,cornerRadius:"$r14",fillPaints:"$white",effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:10,padding:[14,14]}});
c6t=I(c6,{type:"frame",name:"标题",width:320,height:22,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
c6tb=I(c6t,{type:"frame",name:"色条",width:4,height:16,cornerRadius:2,fillPaints:"$c_judge"});
c6tt=I(c6t,{type:"text",nodeText:"大学四年锻炼计划",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
c6l=I(c6,{type:"frame",name:"时间线",width:330,height:248,autoLayout:{direction:"vertical",gap:8}});
`;

PLAN.forEach(([t, c], i) => {
  ops += `
p${i}=I(c6l,{type:"frame",name:"节点${i + 1}",width:330,height:56,autoLayout:{direction:"horizontal",gap:12}});
pd${i}=I(p${i},{type:"frame",name:"圆点",width:12,height:12,cornerRadius:"auto",fillPaints:"$c_judge",effects:[{type:"drop_shadow",color:"#2E6BE62E",radius:0,spread:3}],layoutPositioning:true,left:0,top:4});
ptx${i}=I(p${i},{type:"frame",name:"文本区",width:306,height:56,autoLayout:{direction:"vertical",gap:4}});
ptt${i}=I(ptx${i},{type:"text",nodeText:"${t}",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
ptc${i}=I(ptx${i},{type:"text",nodeText:"${c}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:400,lineHeight:1.45,textGrowth:"fixed-width",width:306,fillPaints:"#64748B"});
`;
});

ops += `
c7=I("2:68",{type:"frame",name:"导师卡",width:358,height:208,cornerRadius:"$r14",fillPaints:"$white",effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:10,padding:[14,14]}});
c7t=I(c7,{type:"frame",name:"标题",width:320,height:22,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
c7tb=I(c7t,{type:"frame",name:"色条",width:4,height:16,cornerRadius:2,fillPaints:"$c_judge"});
c7tt=I(c7t,{type:"text",nodeText:"实务导师对接",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,letterSpacing:0.5,fillPaints:"#1F2733"});
c7l=I(c7,{type:"frame",name:"导师列表",width:330,height:148,autoLayout:{direction:"vertical",gap:8}});
`;

MENTORS.forEach(([ch, name, title, wechat], i) => {
  ops += `
m${i}=I(c7l,{type:"frame",name:"导师${i + 1}",width:330,height:70,cornerRadius:"$r12",fillPaints:"#F5F7FA",stroke:{borderWeight:1,strokePaints:"#E6EBF2"},autoLayout:{direction:"horizontal",alignItems:"center",gap:12,padding:[10,10]}});
ma${i}=I(m${i},{type:"frame",name:"头像",width:42,height:42,cornerRadius:"auto",fillPaints:[{type:"gradient_linear",stops:[{color:"$c_judge",position:0},{color:"#123A80",position:1}],rotation:140}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
mat${i}=I(ma${i},{type:"text",nodeText:"${ch}",fontFamily:"$font_main",fontSize:"$fs17",fontWeight:700,fillPaints:"$white"});
minfo${i}=I(m${i},{type:"frame",name:"信息",width:150,height:48,autoLayout:{direction:"vertical",gap:2,justifyContent:"center"}});
min${i}=I(minfo${i},{type:"text",nodeText:"${name}",fontFamily:"$font_main",fontSize:14.5,fontWeight:700,fillPaints:"#1F2733"});
mit${i}=I(minfo${i},{type:"text",nodeText:"${title}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:400,fillPaints:"#64748B"});
miw${i}=I(minfo${i},{type:"text",nodeText:"${wechat}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:400,fillPaints:"$c_judge"});
mb${i}=I(m${i},{type:"frame",name:"预约交流",width:76,height:30,cornerRadius:"$r_pill",fillPaints:"$brand",effects:[{type:"drop_shadow",color:"#1677FF52",radius:10,offset:{x:0,y:3}}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
mbt${i}=I(mb${i},{type:"text",nodeText:"预约交流",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:600,fillPaints:"$white"});
`;
});

ops += `
dsc=I("2:68",{type:"text",nodeText:"本结果为兴趣初步画像，仅供参考\n本内容为通识性建议，非医疗意见；如有健康问题请遵医嘱。",fontFamily:"$font_main",fontSize:11.5,fontWeight:400,lineHeight:1.7,textAlign:"center",textGrowth:"fixed-width",width:358,fillPaints:"#8A97A8"});
fen=I("2:68",{type:"frame",name:"收藏入口",width:180,height:30,autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:6}});
feni=I(fen,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"star",width:14,height:14,fillPaints:"$brand"});
fent=I(fen,{type:"text",nodeText:"我的收藏",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:600,fillPaints:"$brand"});
fenr=I(fen,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"arrow-right",width:14,height:14,fillPaints:"$brand"});

bar=I("2:68",{type:"frame",name:"底部操作栏",width:390,height:78,fillPaints:"#FFFFFFD1",effects:[{type:"background_blur",radius:16,saturation:1},{type:"drop_shadow",color:"#1F273314",radius:24,offset:{x:0,-6}}],autoLayout:{direction:"horizontal",gap:10,alignItems:"center",justifyContent:"center",padding:[12,16]},layoutPositioning:true,left:0,top:2322});
ba1=I(bar,{type:"frame",name:"保存长图",width:110,height:44,cornerRadius:"$r_pill",fillPaints:"$brand",effects:[{type:"drop_shadow",color:"#1677FF59",radius:14,offset:{x:0,y:4}}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:6}});
ba1i=I(ba1,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"download",width:15,height:15,fillPaints:"$white"});
ba1t=I(ba1,{type:"text",nodeText:"保存长图",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:600,fillPaints:"$white"});
ba2=I(bar,{type:"frame",name:"收藏",width:110,height:44,cornerRadius:"$r_pill",fillPaints:"$white",stroke:{borderWeight:1,strokePaints:"#D9E2EF"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:6}});
ba2i=I(ba2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"star",width:15,height:15,fillPaints:"#3D4A5C"});
ba2t=I(ba2,{type:"text",nodeText:"收藏",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:600,fillPaints:"#3D4A5C"});
ba3=I(bar,{type:"frame",name:"复制链接",width:110,height:44,cornerRadius:"$r_pill",fillPaints:"$white",stroke:{borderWeight:1,strokePaints:"#D9E2EF"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:6}});
ba3i=I(ba3,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"link",width:15,height:15,fillPaints:"#3D4A5C"});
ba3t=I(ba3,{type:"text",nodeText:"复制链接",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:600,fillPaints:"#3D4A5C"});
`;

export default { tool: "apply_design", args: { operations: ops } };
