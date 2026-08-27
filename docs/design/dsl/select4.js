const BARS = [
  { name: "法官", hex: "#2E6BE6", h: 96, score: 6 },
  { name: "检察官", hex: "#C8102E", h: 80, score: 5 },
  { name: "律师", hex: "#F5F7FA", h: 64, score: 4 },
  { name: "企业法务", hex: "#7B5EA7", h: 48, score: 3 },
  { name: "AI伦理", hex: "#12B5A5", h: 32, score: 2 }
];

let ops = `
foot=I("2:63",{type:"frame",name:"底部",width:1920,height:206,autoLayout:{direction:"horizontal",gap:20,alignItems:"center",padding:[0,72,0,72]}});
pool=I(foot,{type:"frame",name:"能量池",width:1330,height:170,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"horizontal",justifyContent:"space_around",alignItems:"end",padding:[14,28,12,28]}});
`;

BARS.forEach((b, i) => {
  ops += `
e${i}=I(pool,{type:"frame",name:"${b.name}能量",width:120,height:140,autoLayout:{direction:"vertical",alignItems:"center",gap:8,justifyContent:"end"}});
bw${i}=I(e${i},{type:"frame",name:"柱槽",width:26,height:96,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0F",stroke:{borderWeight:1,strokePaints:"#FFFFFF1F"},autoLayout:{direction:"vertical",justifyContent:"end"}});
bf${i}=I(bw${i},{type:"frame",name:"能量柱",width:26,height:${b.h},cornerRadius:"$r_pill",fillPaints:[{type:"gradient_linear",stops:[{color:"${b.hex}E6",position:0},{color:"${b.hex}",position:1}],rotation:180}],effects:[{type:"drop_shadow",color:"${b.hex}8C",radius:14}]});
bl${i}=I(e${i},{type:"text",nodeText:"${b.name}",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_sub"});
bs${i}=I(e${i},{type:"text",nodeText:"${b.score} 分",fontFamily:"$font_main",fontSize:"$fs15",fontWeight:700,fillPaints:"${b.hex}"});
`;
});

ops += `
act=I(foot,{type:"frame",name:"操作区",width:456,height:170,cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},autoLayout:{direction:"vertical",gap:12,justifyContent:"center",padding:[16,22]}});
alert=I(act,{type:"frame",name:"提示",width:412,height:46,cornerRadius:"$r10",fillPaints:"#52C41A1F",stroke:{borderWeight:1,strokePaints:"#52C41A59"},autoLayout:{direction:"horizontal",alignItems:"center",gap:10,padding:[0,14]}});
aci=I(alert,{type:"frame",name:"对勾",width:18,height:18,cornerRadius:"auto",fillPaints:"$success",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
aci1=I(aci,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"check",width:12,height:12,fillPaints:"$white"});
actx=I(alert,{type:"text",nodeText:"已满足测试条件，可以开始匹配",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"#B7EB8F"});
btnr=I(act,{type:"frame",name:"按钮行",width:412,height:56,autoLayout:{direction:"horizontal",gap:12}});
bg1=I(btnr,{type:"frame",name:"返回首页",width:200,height:56,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF47"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
bg1t=I(bg1,{type:"text",nodeText:"返回首页",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:600,letterSpacing:1,fillPaints:"#FFFFFFE0"});
bg2=I(btnr,{type:"frame",name:"开始匹配",width:200,height:56,cornerRadius:"$r_pill",fillPaints:[{type:"gradient_linear",stops:[{color:"$brand_light",position:0},{color:"$brand",position:1}],rotation:180}],effects:[{type:"drop_shadow",color:"#1677FF73",radius:24,offset:{x:0,y:6}}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:8}});
bg2i=I(bg2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"zap",width:18,height:18,fillPaints:"$white"});
bg2t=I(bg2,{type:"text",nodeText:"开始匹配",fontFamily:"$font_main",fontSize:"$fs16",fontWeight:600,letterSpacing:1,fillPaints:"$white"});
`;

export default { tool: "apply_design", args: { operations: ops } };
