package com.lawtest.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

/** 匹配结果 */
@Data
public class MatchResultDTO {

    private List<Long> keywordIds;
    /** 五职业得分，key为职业ID字符串 */
    private Map<String, Integer> scores;
    /** 第一适配职业 */
    private CareerScoreDTO first;
    /** 第二适配职业 */
    private CareerScoreDTO second;
    /** 是否并列双适配 */
    private Boolean tie;
    /** 并列最高分的职业ID列表 */
    private List<Long> tieCareerIds;
    /** 引导提示（少于3词/匹配度偏低） */
    private String tip;
    private String disclaimer;
}
