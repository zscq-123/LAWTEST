export default {
  tool: "write_variables",
  args: {
    variableSets: {
      "五彩法途": { name: "五彩法途", modes: ["默认"] }
    },
    variables: {
      // 底色与文字
      "bg_deep": { type: "color", variableSet: "五彩法途", values: { "默认": "#060D1A" } },
      "bg_dark": { type: "color", variableSet: "五彩法途", values: { "默认": "#0B1220" } },
      "glass_bg": { type: "color", variableSet: "五彩法途", values: { "默认": "#FFFFFF0A" } },
      "glass_border": { type: "color", variableSet: "五彩法途", values: { "默认": "#FFFFFF24" } },
      "text_main": { type: "color", variableSet: "五彩法途", values: { "默认": "#FFFFFFEB" } },
      "text_sub": { type: "color", variableSet: "五彩法途", values: { "默认": "#FFFFFFA6" } },
      "text_dim": { type: "color", variableSet: "五彩法途", values: { "默认": "#FFFFFF80" } },
      "text_faint": { type: "color", variableSet: "五彩法途", values: { "默认": "#FFFFFF5C" } },
      "white": { type: "color", variableSet: "五彩法途", values: { "默认": "#FFFFFF" } },
      // 品牌与状态
      "brand": { type: "color", variableSet: "五彩法途", values: { "默认": "#1677FF" } },
      "brand_light": { type: "color", variableSet: "五彩法途", values: { "默认": "#2F88FF" } },
      "success": { type: "color", variableSet: "五彩法途", values: { "默认": "#52C41A" } },
      "warning": { type: "color", variableSet: "五彩法途", values: { "默认": "#FAAD14" } },
      "error": { type: "color", variableSet: "五彩法途", values: { "默认": "#C8102E" } },
      // 五职业色
      "c_lawyer": { type: "color", variableSet: "五彩法途", values: { "默认": "#F5F7FA" } },
      "c_judge": { type: "color", variableSet: "五彩法途", values: { "默认": "#2E6BE6" } },
      "c_prosecutor": { type: "color", variableSet: "五彩法途", values: { "默认": "#C8102E" } },
      "c_legal": { type: "color", variableSet: "五彩法途", values: { "默认": "#7B5EA7" } },
      "c_ai": { type: "color", variableSet: "五彩法途", values: { "默认": "#12B5A5" } },
      // 字号
      "fs72": { type: "number", variableSet: "五彩法途", values: { "默认": 72 } },
      "fs64": { type: "number", variableSet: "五彩法途", values: { "默认": 64 } },
      "fs56": { type: "number", variableSet: "五彩法途", values: { "默认": 56 } },
      "fs48": { type: "number", variableSet: "五彩法途", values: { "默认": 48 } },
      "fs40": { type: "number", variableSet: "五彩法途", values: { "默认": 40 } },
      "fs36": { type: "number", variableSet: "五彩法途", values: { "默认": 36 } },
      "fs32": { type: "number", variableSet: "五彩法途", values: { "默认": 32 } },
      "fs28": { type: "number", variableSet: "五彩法途", values: { "默认": 28 } },
      "fs26": { type: "number", variableSet: "五彩法途", values: { "默认": 26 } },
      "fs24": { type: "number", variableSet: "五彩法途", values: { "默认": 24 } },
      "fs22": { type: "number", variableSet: "五彩法途", values: { "默认": 22 } },
      "fs20": { type: "number", variableSet: "五彩法途", values: { "默认": 20 } },
      "fs18": { type: "number", variableSet: "五彩法途", values: { "默认": 18 } },
      "fs17": { type: "number", variableSet: "五彩法途", values: { "默认": 17 } },
      "fs16": { type: "number", variableSet: "五彩法途", values: { "默认": 16 } },
      "fs15": { type: "number", variableSet: "五彩法途", values: { "默认": 15 } },
      "fs14": { type: "number", variableSet: "五彩法途", values: { "默认": 14 } },
      "fs13": { type: "number", variableSet: "五彩法途", values: { "默认": 13 } },
      "fs12": { type: "number", variableSet: "五彩法途", values: { "默认": 12 } },
      "fs11": { type: "number", variableSet: "五彩法途", values: { "默认": 11 } },
      // 间距
      "sp4": { type: "number", variableSet: "五彩法途", values: { "默认": 4 } },
      "sp8": { type: "number", variableSet: "五彩法途", values: { "默认": 8 } },
      "sp12": { type: "number", variableSet: "五彩法途", values: { "默认": 12 } },
      "sp16": { type: "number", variableSet: "五彩法途", values: { "默认": 16 } },
      "sp20": { type: "number", variableSet: "五彩法途", values: { "默认": 20 } },
      "sp24": { type: "number", variableSet: "五彩法途", values: { "默认": 24 } },
      "sp32": { type: "number", variableSet: "五彩法途", values: { "默认": 32 } },
      "sp40": { type: "number", variableSet: "五彩法途", values: { "默认": 40 } },
      "sp48": { type: "number", variableSet: "五彩法途", values: { "默认": 48 } },
      "sp56": { type: "number", variableSet: "五彩法途", values: { "默认": 56 } },
      "sp80": { type: "number", variableSet: "五彩法途", values: { "默认": 80 } },
      // 圆角
      "r6": { type: "number", variableSet: "五彩法途", values: { "默认": 6 } },
      "r10": { type: "number", variableSet: "五彩法途", values: { "默认": 10 } },
      "r14": { type: "number", variableSet: "五彩法途", values: { "默认": 14 } },
      "r16": { type: "number", variableSet: "五彩法途", values: { "默认": 16 } },
      "r24": { type: "number", variableSet: "五彩法途", values: { "默认": 24 } },
      "r_pill": { type: "number", variableSet: "五彩法途", values: { "默认": 999 } },
      // 字体
      "font_main": { type: "string", variableSet: "五彩法途", values: { "默认": "PingFang SC" } },
      "font_alt": { type: "string", variableSet: "五彩法途", values: { "默认": "Microsoft YaHei" } }
    }
  }
};
