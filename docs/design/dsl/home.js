export default {
  tool: "apply_design",
  args: {
    operations: `
bg=I("2:62",{type:"frame",name:"背景光晕",width:1920,height:1080,layoutPositioning:true,left:0,top:0});
gl1=I(bg,{type:"frame",name:"蓝光",left:-160,top:-140,width:980,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#2E6BE629",position:0},{color:"#2E6BE600",position:1}]}]});
gl2=I(bg,{type:"frame",name:"青光",left:1150,top:-160,width:900,height:580,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#12B5A524",position:0},{color:"#12B5A500",position:1}]}]});
gl3=I(bg,{type:"frame",name:"紫光",left:-180,top:560,width:980,height:640,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#7B5EA72E",position:0},{color:"#7B5EA700",position:1}]}]});
gl4=I(bg,{type:"frame",name:"红光",left:1120,top:540,width:960,height:620,cornerRadius:"auto",fillPaints:[{type:"gradient_radial",stops:[{color:"#C8102E29",position:0},{color:"#C8102E00",position:1}]}]});

head=I("2:62",{type:"frame",name:"顶部",width:"fill_container",autoLayout:{direction:"vertical",alignItems:"center",gap:14,padding:[44,0,0,0]}});
tag=I(head,{type:"frame",name:"活动标签",autoLayout:{direction:"horizontal",alignItems:"center",gap:8,padding:[6,18]},cornerRadius:"$r_pill",fillPaints:"#1677FF1A",stroke:{borderWeight:1,strokePaints:"#7AB8FF66"}});
dot=I(tag,{type:"frame",name:"光点",width:7,height:7,cornerRadius:"auto",fillPaints:"$brand",effects:[{type:"drop_shadow",color:"$brand",radius:10}]});
tagTxt=I(tag,{type:"text",nodeText:"法学院迎新特别活动 · V1.0",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:500,letterSpacing:2,fillPaints:"#FFFFFFD9"});
title=I(head,{type:"text",nodeText:"五彩法途 · 筑梦未来",fontFamily:"$font_main",fontSize:"$fs72",fontWeight:800,letterSpacing:6,lineHeight:1.15,fillPaints:[{type:"gradient_linear",stops:[{color:"$c_lawyer",position:0},{color:"#A8C8FF",position:0.2},{color:"$c_judge",position:0.38},{color:"$c_legal",position:0.58},{color:"$c_prosecutor",position:0.76},{color:"$c_ai",position:0.9},{color:"$c_lawyer",position:1}],rotation:0}],effects:[{type:"drop_shadow",color:"#8CAAFF59",radius:18,offset:{x:0,y:0}},{type:"drop_shadow",color:"#00000080",radius:6,offset:{x:0,y:2}}]});
subtitle=I(head,{type:"text",nodeText:"75 个特质词 · 5 大法律职业方向 · 3 分钟生成专属职业画像",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:400,letterSpacing:2,fillPaints:"$text_sub"});

steps=I("2:62",{type:"frame",name:"流程步骤条",width:780,autoLayout:{direction:"horizontal",alignItems:"center",gap:0,padding:[14,30]},cornerRadius:"$r14",fillPaints:"$glass_bg",stroke:{borderWeight:1,strokePaints:"$glass_border"},effects:[{type:"background_blur",radius:12,saturation:1}]});
st1=I(steps,{type:"frame",name:"步骤1",autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd1=I(st1,{type:"frame",name:"圆点1",width:30,height:30,cornerRadius:"auto",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF38"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn1=I(sd1,{type:"text",nodeText:"1",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$text_faint"});
sl1=I(st1,{type:"text",nodeText:"勾选特质",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
ln1=I(steps,{type:"frame",name:"连线1",width:88,height:1,fillPaints:"#FFFFFF24"});
st2=I(steps,{type:"frame",name:"步骤2",autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd2=I(st2,{type:"frame",name:"圆点2",width:30,height:30,cornerRadius:"auto",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF38"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn2=I(sd2,{type:"text",nodeText:"2",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$text_faint"});
sl2=I(st2,{type:"text",nodeText:"匹配职业",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
ln2=I(steps,{type:"frame",name:"连线2",width:88,height:1,fillPaints:"#FFFFFF24"});
st3=I(steps,{type:"frame",name:"步骤3",autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd3=I(st3,{type:"frame",name:"圆点3",width:30,height:30,cornerRadius:"auto",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF38"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn3=I(sd3,{type:"text",nodeText:"3",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$text_faint"});
sl3=I(st3,{type:"text",nodeText:"揭晓画像",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
ln3=I(steps,{type:"frame",name:"连线3",width:88,height:1,fillPaints:"#FFFFFF24"});
st4=I(steps,{type:"frame",name:"步骤4",autoLayout:{direction:"horizontal",alignItems:"center",gap:10}});
sd4=I(st4,{type:"frame",name:"圆点4",width:30,height:30,cornerRadius:"auto",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF38"},autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
sn4=I(sd4,{type:"text",nodeText:"4",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:700,fillPaints:"$text_faint"});
sl4=I(st4,{type:"text",nodeText:"扫码保存",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});

grid=I("2:62",{type:"frame",name:"职业卡片",width:"fill_container",height:"fill_container",autoLayout:{direction:"horizontal",gap:26,alignItems:"center",justifyContent:"center"}});
c1=I(grid,{type:"frame",name:"律师卡",width:302,height:452,cornerRadius:"$r14",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF1F"},effects:[{type:"drop_shadow",color:"#00000066",radius:12,offset:{x:0,y:4}}],autoLayout:{direction:"vertical",gap:0}});
t1=I(c1,{type:"frame",name:"顶边",width:302,height:2,fillPaints:"$c_lawyer",layoutPositioning:true,left:0,top:0,effects:[{type:"drop_shadow",color:"$c_lawyer",radius:10}]});
il1=I(c1,{type:"frame",name:"插画区",width:"fill_container",height:178,fillPaints:[{type:"gradient_linear",stops:[{color:"#F5F7FA4D",position:0},{color:"#F5F7FA00",position:1}],rotation:180}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ii1=I(il1,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"scale",width:96,height:96,fillPaints:"#F5F7FA80"});
bd1=I(c1,{type:"frame",name:"卡体",width:"fill_container",height:"fill_container",autoLayout:{direction:"vertical",alignItems:"center",gap:10,padding:[22,20,20,20]}});
av1=I(bd1,{type:"frame",name:"头像",width:58,height:58,cornerRadius:"$r14",fillPaints:[{type:"gradient_linear",stops:[{color:"$c_lawyer",position:0},{color:"#9AA0AA",position:1}],rotation:140}],effects:[{type:"drop_shadow",color:"#F5F7FA66",radius:20}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ai1=I(av1,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"scale",width:30,height:30,fillPaints:"$bg_deep"});
nm1=I(bd1,{type:"text",nodeText:"律师",fontFamily:"$font_main",fontSize:"$fs26",fontWeight:700,letterSpacing:2,fillPaints:"$c_lawyer"});
tg1=I(bd1,{type:"frame",name:"颜色标签",autoLayout:{direction:"horizontal",alignItems:"center",padding:[0,12]},height:26,cornerRadius:"$r_pill",fillPaints:"#F5F7FA29",stroke:{borderWeight:1,strokePaints:"#F5F7FA73"}});
tg1t=I(tg1,{type:"text",nodeText:"皓月白 #F5F7FA",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:500,fillPaints:"$c_lawyer"});
sg1=I(bd1,{type:"text",nodeText:"“以法为盾，以理服人”",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});

c2=I(grid,{type:"frame",name:"法官卡",width:302,height:452,cornerRadius:"$r14",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF1F"},effects:[{type:"drop_shadow",color:"#00000066",radius:12,offset:{x:0,y:4}}],autoLayout:{direction:"vertical",gap:0}});
t2=I(c2,{type:"frame",name:"顶边",width:302,height:2,fillPaints:"$c_judge",layoutPositioning:true,left:0,top:0,effects:[{type:"drop_shadow",color:"$c_judge",radius:10}]});
il2=I(c2,{type:"frame",name:"插画区",width:"fill_container",height:178,fillPaints:[{type:"gradient_linear",stops:[{color:"#2E6BE64D",position:0},{color:"#2E6BE600",position:1}],rotation:180}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ii2=I(il2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"landmark",width:96,height:96,fillPaints:"#2E6BE680"});
bd2=I(c2,{type:"frame",name:"卡体",width:"fill_container",height:"fill_container",autoLayout:{direction:"vertical",alignItems:"center",gap:10,padding:[22,20,20,20]}});
av2=I(bd2,{type:"frame",name:"头像",width:58,height:58,cornerRadius:"$r14",fillPaints:[{type:"gradient_linear",stops:[{color:"$c_judge",position:0},{color:"#123A80",position:1}],rotation:140}],effects:[{type:"drop_shadow",color:"#2E6BE666",radius:20}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ai2=I(av2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"landmark",width:30,height:30,fillPaints:"$white"});
nm2=I(bd2,{type:"text",nodeText:"法官",fontFamily:"$font_main",fontSize:"$fs26",fontWeight:700,letterSpacing:2,fillPaints:"$c_judge"});
tg2=I(bd2,{type:"frame",name:"颜色标签",autoLayout:{direction:"horizontal",alignItems:"center",padding:[0,12]},height:26,cornerRadius:"$r_pill",fillPaints:"#2E6BE629",stroke:{borderWeight:1,strokePaints:"#2E6BE673"}});
tg2t=I(tg2,{type:"text",nodeText:"苍穹蓝 #2E6BE6",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:500,fillPaints:"$c_judge"});
sg2=I(bd2,{type:"text",nodeText:"“法平如水，公正如一”",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});

c3=I(grid,{type:"frame",name:"检察官卡",width:302,height:452,cornerRadius:"$r14",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF1F"},effects:[{type:"drop_shadow",color:"#00000066",radius:12,offset:{x:0,y:4}}],autoLayout:{direction:"vertical",gap:0}});
t3=I(c3,{type:"frame",name:"顶边",width:302,height:2,fillPaints:"$c_prosecutor",layoutPositioning:true,left:0,top:0,effects:[{type:"drop_shadow",color:"$c_prosecutor",radius:10}]});
il3=I(c3,{type:"frame",name:"插画区",width:"fill_container",height:178,fillPaints:[{type:"gradient_linear",stops:[{color:"#C8102E4D",position:0},{color:"#C8102E00",position:1}],rotation:180}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ii3=I(il3,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"shield",width:96,height:96,fillPaints:"#C8102E80"});
bd3=I(c3,{type:"frame",name:"卡体",width:"fill_container",height:"fill_container",autoLayout:{direction:"vertical",alignItems:"center",gap:10,padding:[22,20,20,20]}});
av3=I(bd3,{type:"frame",name:"头像",width:58,height:58,cornerRadius:"$r14",fillPaints:[{type:"gradient_linear",stops:[{color:"$c_prosecutor",position:0},{color:"#8E0B21",position:1}],rotation:140}],effects:[{type:"drop_shadow",color:"#C8102E66",radius:20}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ai3=I(av3,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"shield",width:30,height:30,fillPaints:"$white"});
nm3=I(bd3,{type:"text",nodeText:"检察官",fontFamily:"$font_main",fontSize:"$fs26",fontWeight:700,letterSpacing:2,fillPaints:"$c_prosecutor"});
tg3=I(bd3,{type:"frame",name:"颜色标签",autoLayout:{direction:"horizontal",alignItems:"center",padding:[0,12]},height:26,cornerRadius:"$r_pill",fillPaints:"#C8102E29",stroke:{borderWeight:1,strokePaints:"#C8102E73"}});
tg3t=I(tg3,{type:"text",nodeText:"中国红 #C8102E",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:500,fillPaints:"$c_prosecutor"});
sg3=I(bd3,{type:"text",nodeText:"“恪守正义，敢于亮剑”",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});

c4=I(grid,{type:"frame",name:"企业法务卡",width:302,height:452,cornerRadius:"$r14",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF1F"},effects:[{type:"drop_shadow",color:"#00000066",radius:12,offset:{x:0,y:4}}],autoLayout:{direction:"vertical",gap:0}});
t4=I(c4,{type:"frame",name:"顶边",width:302,height:2,fillPaints:"$c_legal",layoutPositioning:true,left:0,top:0,effects:[{type:"drop_shadow",color:"$c_legal",radius:10}]});
il4=I(c4,{type:"frame",name:"插画区",width:"fill_container",height:178,fillPaints:[{type:"gradient_linear",stops:[{color:"#7B5EA74D",position:0},{color:"#7B5EA700",position:1}],rotation:180}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ii4=I(il4,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"file-check",width:96,height:96,fillPaints:"#7B5EA780"});
bd4=I(c4,{type:"frame",name:"卡体",width:"fill_container",height:"fill_container",autoLayout:{direction:"vertical",alignItems:"center",gap:10,padding:[22,20,20,20]}});
av4=I(bd4,{type:"frame",name:"头像",width:58,height:58,cornerRadius:"$r14",fillPaints:[{type:"gradient_linear",stops:[{color:"$c_legal",position:0},{color:"#4A3670",position:1}],rotation:140}],effects:[{type:"drop_shadow",color:"#7B5EA766",radius:20}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ai4=I(av4,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"file-check",width:30,height:30,fillPaints:"$white"});
nm4=I(bd4,{type:"text",nodeText:"企业法务",fontFamily:"$font_main",fontSize:"$fs26",fontWeight:700,letterSpacing:2,fillPaints:"$c_legal"});
tg4=I(bd4,{type:"frame",name:"颜色标签",autoLayout:{direction:"horizontal",alignItems:"center",padding:[0,12]},height:26,cornerRadius:"$r_pill",fillPaints:"#7B5EA729",stroke:{borderWeight:1,strokePaints:"#7B5EA773"}});
tg4t=I(tg4,{type:"text",nodeText:"琉璃紫 #7B5EA7",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:500,fillPaints:"$c_legal"});
sg4=I(bd4,{type:"text",nodeText:"“行稳致远，合规制胜”",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});

c5=I(grid,{type:"frame",name:"AI伦理卡",width:302,height:452,cornerRadius:"$r14",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF1F"},effects:[{type:"drop_shadow",color:"#00000066",radius:12,offset:{x:0,y:4}}],autoLayout:{direction:"vertical",gap:0}});
t5=I(c5,{type:"frame",name:"顶边",width:302,height:2,fillPaints:"$c_ai",layoutPositioning:true,left:0,top:0,effects:[{type:"drop_shadow",color:"$c_ai",radius:10}]});
il5=I(c5,{type:"frame",name:"插画区",width:"fill_container",height:178,fillPaints:[{type:"gradient_linear",stops:[{color:"#12B5A54D",position:0},{color:"#12B5A500",position:1}],rotation:180}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ii5=I(il5,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"cpu",width:96,height:96,fillPaints:"#12B5A580"});
bd5=I(c5,{type:"frame",name:"卡体",width:"fill_container",height:"fill_container",autoLayout:{direction:"vertical",alignItems:"center",gap:10,padding:[22,20,20,20]}});
av5=I(bd5,{type:"frame",name:"头像",width:58,height:58,cornerRadius:"$r14",fillPaints:[{type:"gradient_linear",stops:[{color:"$c_ai",position:0},{color:"#0A7A70",position:1}],rotation:140}],effects:[{type:"drop_shadow",color:"#12B5A566",radius:20}],autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center"}});
ai5=I(av5,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"cpu",width:30,height:30,fillPaints:"$white"});
nm5=I(bd5,{type:"text",nodeText:"AI伦理合规顾问",fontFamily:"$font_main",fontSize:"$fs24",fontWeight:700,letterSpacing:2,fillPaints:"$c_ai"});
tg5=I(bd5,{type:"frame",name:"颜色标签",autoLayout:{direction:"horizontal",alignItems:"center",padding:[0,12]},height:26,cornerRadius:"$r_pill",fillPaints:"#12B5A529",stroke:{borderWeight:1,strokePaints:"#12B5A573"}});
tg5t=I(tg5,{type:"text",nodeText:"科创青 #12B5A5",fontFamily:"$font_main",fontSize:"$fs13",fontWeight:500,fillPaints:"$c_ai"});
sg5=I(bd5,{type:"text",nodeText:"“科技向善，规则先行”",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_dim"});

foot=I("2:62",{type:"frame",name:"底部操作",width:"fill_container",autoLayout:{direction:"vertical",alignItems:"center",gap:12,padding:[0,0,26,0]}});
act=I(foot,{type:"frame",name:"按钮组",autoLayout:{direction:"horizontal",gap:18}});
btn1=I(act,{type:"frame",name:"开始测试",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:8,padding:[0,40]},height:56,cornerRadius:"$r_pill",fillPaints:[{type:"gradient_linear",stops:[{color:"$brand_light",position:0},{color:"$brand",position:1}],rotation:180}],effects:[{type:"drop_shadow",color:"#1677FF73",radius:24,offset:{x:0,y:6}},{type:"drop_shadow",color:"#00000059",radius:8,offset:{x:0,y:2}}]});
bi1=I(btn1,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"rocket",width:20,height:20,fillPaints:"$white"});
bt1=I(btn1,{type:"text",nodeText:"开始测试",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:600,letterSpacing:1,fillPaints:"$white"});
btn2=I(act,{type:"frame",name:"我的收藏",autoLayout:{direction:"horizontal",alignItems:"center",justifyContent:"center",gap:8,padding:[0,40]},height:56,cornerRadius:"$r_pill",fillPaints:"#FFFFFF0A",stroke:{borderWeight:1,strokePaints:"#FFFFFF47"}});
bi2=I(btn2,{type:"icon_font",iconFontFamily:"lucide",iconFontName:"star",width:20,height:20,fillPaints:"#FFFFFFE0"});
bt2=I(btn2,{type:"text",nodeText:"我的收藏",fontFamily:"$font_main",fontSize:"$fs18",fontWeight:600,letterSpacing:1,fillPaints:"#FFFFFFE0"});
tip=I(foot,{type:"text",nodeText:"本结果为兴趣初步画像，仅供参考 · 测试时长约 2 分钟",fontFamily:"$font_main",fontSize:"$fs14",fontWeight:400,letterSpacing:1,fillPaints:"$text_faint"});
`
  }
};
