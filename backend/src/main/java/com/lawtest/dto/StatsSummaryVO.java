package com.lawtest.dto;

import lombok.Data;

import java.util.List;

/** 统计汇总 */
@Data
public class StatsSummaryVO {

    private Long totalParticipants;
    private List<CareerCountDTO> careerDistribution;
    private List<KeywordCountDTO> topKeywords;

    @Data
    public static class CareerCountDTO {
        private Long careerId;
        private String name;
        private Long count;
    }

    @Data
    public static class KeywordCountDTO {
        private Long keywordId;
        private String word;
        private Long count;
    }
}
