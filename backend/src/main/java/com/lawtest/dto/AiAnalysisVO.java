package com.lawtest.dto;

import lombok.Data;

import java.util.List;

/** AI 深度分析结果（大模型生成） */
@Data
public class AiAnalysisVO {

    /** 职业契合度解读（2~3 句） */
    private String summary;

    /** 你的核心优势（基于勾选词，3~5 条） */
    private List<String> strengths;

    /** 潜在短板与提升建议（3~5 条） */
    private List<String> improvements;

    /** 大学四年发展建议（结合本职业，2~4 条） */
    private List<String> plans;

    /** 一句话格言/寄语 */
    private String motto;

    /** 免责声明（AI 生成内容仅供参考） */
    private String disclaimer;
}
