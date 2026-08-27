package com.lawtest.service.impl;

import com.lawtest.dto.StatsSummaryVO;
import com.lawtest.entity.Career;
import com.lawtest.mapper.CareerMapper;
import com.lawtest.mapper.StatsMapper;
import com.lawtest.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final StatsMapper statsMapper;
    private final CareerMapper careerMapper;

    @Override
    public StatsSummaryVO summary() {
        Map<Long, String> careerNames = careerMapper.selectList(null).stream()
                .collect(Collectors.toMap(Career::getId, Career::getName));

        StatsSummaryVO vo = new StatsSummaryVO();
        vo.setTotalParticipants(statsMapper.countRecords());

        // 职业分布：SQL GROUP BY 聚合，不再全表扫描
        List<StatsSummaryVO.CareerCountDTO> dist = statsMapper.countByCareer().stream().map(row -> {
            StatsSummaryVO.CareerCountDTO dto = new StatsSummaryVO.CareerCountDTO();
            dto.setCareerId(((Number) row.get("careerId")).longValue());
            dto.setName(careerNames.getOrDefault(dto.getCareerId(), "未知"));
            dto.setCount(((Number) row.get("cnt")).longValue());
            return dto;
        }).collect(Collectors.toList());
        vo.setCareerDistribution(dist);

        // 高频勾选词：JSON_TABLE 展开后 SQL 分组计数（原 Java 逐条解析）
        List<StatsSummaryVO.KeywordCountDTO> top = statsMapper.topKeywords().stream().map(row -> {
            StatsSummaryVO.KeywordCountDTO dto = new StatsSummaryVO.KeywordCountDTO();
            dto.setKeywordId(((Number) row.get("keywordId")).longValue());
            Object word = row.get("word");
            dto.setWord(word == null ? "未知" : word.toString());
            dto.setCount(((Number) row.get("cnt")).longValue());
            return dto;
        }).collect(Collectors.toList());
        vo.setTopKeywords(top);
        return vo;
    }
}
