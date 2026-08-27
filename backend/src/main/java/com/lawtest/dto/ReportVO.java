package com.lawtest.dto;

import com.lawtest.entity.FitnessPlan;
import com.lawtest.entity.FitnessRequirement;
import com.lawtest.entity.Mentor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/** 完整报告视图对象 */
@Data
public class ReportVO {

    /** 报告编号 */
    private String code;
    /** 生成时间 */
    private LocalDateTime createdAt;
    /** 报告页URL（二维码内容） */
    private String qrUrl;
    /** 二维码图片（base64 data URL） */
    private String qrImage;
    /** 匹配结果 */
    private MatchResultDTO match;
    /** 第一适配职业基本信息 */
    private CareerVO career;
    /** 职业画像 */
    private ProfileVO profile;
    /** AI 深度分析（已生成时返回，未生成为 null） */
    private AiAnalysisVO aiAnalysis;
    private List<FitnessRequirement> fitnessRequirements;
    private List<FitnessPlan> fitnessPlans;
    private List<Mentor> mentors;
}
