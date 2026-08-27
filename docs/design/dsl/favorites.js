const CARDS = [
  {
    icon: "landmark", name: "法官", hex: "#2E6BE6", tag: "86%", code: "WCT202608271234", time: "2026-08-27 10:30"
  },
  {
    icon: "shield", name: "检察官", hex: "#C8102E", tag: "72%", code: "WCT202608271205", time: "2026-08-26 15:20"
  }
];

let ops = `
hd=I("2:69",{type:"frame",name:"吸顶栏",width:390,height:64,fillPaints:"#F5F7FAF0",effects:[{type:"background_blur",radius:12,saturation:1},{type:"drop_shadow",color:"#E6EBF2",radius:0,spread:1,offset:{x:0,y:1}}],autoLayout:{direction:"horizontal",justifyContent:"space_between",alignItems:"center",padding:[16,16]}});
ht=I(hd,{type:"frame",name:"标题",width:160,height:30,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
hti=I(ht,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"star",width:18,height:18,fillPaints:"$warning"});
htt=I(ht,{type:"text",nodeText:"我的收藏",fontFamily:"$font_main",fontSize:"$fs19",fontWeight:800,letterSpacing:0.5,fillPaints:"#1F2733"});
htc=I(ht,{type:"frame",name:"数量",width:20,height:20,cornerRadius:"auto",fillPaints:"$warning",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
htc1=I(htc,{type:"text",nodeText:"2",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:700,fillPaints:"$white"});
hb=I(hd,{type:"frame",name:"按钮组",width:130,height:32,autoLayout:{direction:"horizontal",gap:8}});
hb1=I(hb,{type:"frame",name:"首页",width:61,height:32,cornerRadius:"$r_pill",fillPaints:"$white",stroke:{borderWeight:1,strokePaints:"#D9E2EF"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:4}});
hb1i=I(hb1,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"home",width:13,height:13,fillPaints:"#3D4A5C"});
hb1t=I(hb1,{type:"text",nodeText:"首页",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:600,fillPaints:"#3D4A5C"});
hb2=I(hb,{type:"frame",name:"清空",width:61,height:32,cornerRadius:"$r_pill",fillPaints:"$white",stroke:{borderWeight:1,strokePaints:"#FFCCC7"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:4}});
hb2i=I(hb2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"trash-2",width:13,height:13,fillPaints:"#C8102E"});
hb2t=I(hb2,{type:"text",nodeText:"清空",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:600,fillPaints:"#C8102E"});
`;

CARDS.forEach((c, i) => {
  ops += `
card${i}=I("2:69",{type:"frame",name:"收藏卡${i + 1}",width:358,height:150,cornerRadius:"$r14",fillPaints:"$white",stroke:{borderWeight:1,strokePaints:"#E6EBF2"},effects:[{type:"drop_shadow",color:"#1F27330F",radius:10,offset:{x:0,y:2}}],autoLayout:{direction:"vertical",gap:0,padding:[0,0,0,0]}});
cbar${i}=I(card${i},{type:"frame",name:"色条",width:4,height:150,fillPaints:"${c.hex}",cornerRadius:[6,0,0,6],layoutPositioning:true,left:0,top:0});
cbody${i}=I(card${i},{type:"frame",name:"卡体",width:358,height:150,autoLayout:{direction:"vertical",gap:10,padding:[14,14,14,18]}});
cmain${i}=I(cbody${i},{type:"frame",name:"主体行",width:326,height:52,autoLayout:{direction:"horizontal",alignItems:"center",gap:12}});
cav${i}=I(cmain${i},{type:"frame",name:"头像",width:50,height:50,cornerRadius:"$r13",fillPaints:[{type:"gradient_linear",stops:[{color:"${c.hex}",position:0},{color:"${c.hex}B3",position:1}],rotation:140}],effects:[{type:"drop_shadow",color:"${c.hex}5C",radius:14}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
cavi${i}=I(cav${i},{type:"icon_font",iconFontFamily:"lucide",iconFontName:"${c.icon}",width:26,height:26,fillPaints:"$white"});
cinfo${i}=I(cmain${i},{type:"frame",name:"信息",width:260,height:52,autoLayout:{direction:"vertical",gap:3,justifyContent:"center"}});
cname${i}=I(cinfo${i},{type:"frame",name:"名称行",width:260,height:24,autoLayout:{direction:"horizontal",alignItems:"center",gap:8}});
cnamet${i}=I(cname${i},{type:"text",nodeText:"${c.name}",fontFamily:"$font_main",fontSize:16.5,fontWeight:700,fillPaints:"#1F2733"});
ctag${i}=I(cname${i},{type:"frame",name:"匹配度",width:44,height:20,cornerRadius:"$r_pill",fillPaints:"${c.hex}",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ctagt${i}=I(ctag${i},{type:"text",nodeText:"${c.tag}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:700,fillPaints:"$white"});
ccode${i}=I(cinfo${i},{type:"text",nodeText:"编号 ${c.code}",fontFamily:"$font_main",fontSize:12.5,fontWeight:400,letterSpacing:0.3,fillPaints:"#64748B"});
ctime${i}=I(cinfo${i},{type:"frame",name:"时间行",width:220,height:16,autoLayout:{direction:"horizontal",alignItems:"center",gap:5}});
ctimei${i}=I(ctime${i},{type:"icon_font",iconFontFamily:"lucide",iconFontName:"clock",width:13,height:13,fillPaints:"#8A97A8"});
ctimet${i}=I(ctime${i},{type:"text",nodeText:"生成于 ${c.time}",fontFamily:"$font_main",fontSize:"$fs12",fontWeight:400,fillPaints:"#8A97A8"});
cact${i}=I(cbody${i},{type:"frame",name:"操作行",width:326,height:40,autoLayout:{direction:"horizontal",justifyContent:"flex-end",alignItems:"center",gap:8},stroke:{borderWeight:[1,0,0,0],strokePaints:"#E6EBF2"}});
cb1${i}=I(cact${i},{type:"frame",name:"取消收藏",width:84,height:32,cornerRadius:"$r_pill",fillPaints:"$white",stroke:{borderWeight:1,strokePaints:"#FFCCC7"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
cb1t${i}=I(cb1${i},{type:"text",nodeText:"取消收藏",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:600,fillPaints:"#C8102E"});
cb2${i}=I(cact${i},{type:"frame",name:"打开报告",width:96,height:32,cornerRadius:"$r_pill",fillPaints:"$brand",effects:[{type:"drop_shadow",color:"#1677FF3D",radius:10,offset:{x:0,y:3}}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:5}});
cb2i${i}=I(cb2${i},{type:"icon_font",iconFontFamily:"lucide",iconFontName:"eye",width:14,height:14,fillPaints:"$white"});
cb2t${i}=I(cb2${i},{type:"text",nodeText:"打开报告",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:600,fillPaints:"$white"});
`;
});

ops += `
note=I("2:69",{type:"frame",name:"空状态说明",width:358,height:60,cornerRadius:"$r10",fillPaints:"#FAAD141A",stroke:{borderWeight:1,strokePaints:"#FAAD1480",dashPattern:[4,4]},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",padding:[10,14]}});
notet=I(note,{type:"text",nodeText:"空状态示意：无收藏时展示「还没有收藏报告，快去测试并收藏一份吧」+「前往测试」按钮",fontFamily:"$font_main",fontSize:11.5,fontWeight:400,lineHeight:1.6,textAlign:"center",textGrowth:"fixed-width",width:330,fillPaints:"#8A6D1A"});
`;

export default { tool: "apply_design", args: { operations: ops } };
