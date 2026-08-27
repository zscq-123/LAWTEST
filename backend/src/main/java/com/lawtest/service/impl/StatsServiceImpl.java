package com.lawtest.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawtest.dto.StatsSummaryVO;
import com.lawtest.entity.Career;
import com.lawtest.entity.Keyword;
import com.lawtest.entity.TestRecord;
import com.lawtest.mapper.CareerMapper;
import com.lawtest.mapper.KeywordMapper;
import com.lawtest.mapper.TestRecordMapper;
import com.lawtest.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsServiceImpl implements StatsService {

    private final TestRecordMapper testRecordMapper;
    private final CareerMapper careerMapper;
    private final KeywordMapper keywordMapper;
    private final ObjectMapper objectMapper;

    @Override
    public StatsSummaryVO summary() {
        List<TestRecord> records = testRecordMapper.selectList(null);
        Map<Long, Career> careerMap = careerMapper.selectList(null).stream()
                .collect(Collectors.toMap(Career::getId, c -> c));
        Map<Long, Keyword> keywordMap = keywordMapper.selectList(null).stream()
                .collect(Collectors.toMap(Keyword::getId, k -> k));

        StatsSummaryVO vo = new StatsSummaryVO();
        vo.setTotalParticipants((long) records.size());

        // 职业分布
        Map<Long, Long> distribution = new HashMap<>();
        for (TestRecord record : records) {
            distribution.merge(record.getResultCareerId(), 1L, Long::sum);
        }
        List<StatsSummaryVO.CareerCountDTO> careerDist = new ArrayList<>();
        distribution.forEach((careerId, count) -> {
            StatsSummaryVO.CareerCountDTO dto = new StatsSummaryVO.CareerCountDTO();
            dto.setCareerId(careerId);
            dto.setName(careerMap.get(careerId) == null ? "未知" : careerMap.get(careerId).getName());
            dto.setCount(count);
            careerDist.add(dto);
        });
        careerDist.sort(Comparator.comparing(StatsSummaryVO.CareerCountDTO::getCount).reversed());
        vo.setCareerDistribution(careerDist);

        // 高频勾选词（Top 10）
        Map<Long, Long> frequency = new HashMap<>();
        for (TestRecord record : records) {
            try {
                List<Long> ids = objectMapper.readValue(
                        record.getSelectedKeywords(), new TypeReference<>() {
                        });
                for (Long id : ids) {
                    frequency.merge(id, 1L, Long::sum);
                }
            } catch (Exception ignored) {
                // 单条脏数据不影响整体统计
            }
        }
        List<StatsSummaryVO.KeywordCountDTO> topKeywords = frequency.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    StatsSummaryVO.KeywordCountDTO dto = new StatsSummaryVO.KeywordCountDTO();
                    dto.setKeywordId(entry.getKey());
                    dto.setWord(keywordMap.get(entry.getKey()) == null
                            ? "未知" : keywordMap.get(entry.getKey()).getWord());
                    dto.setCount(entry.getValue());
                    return dto;
                })
                .collect(Collectors.toList());
        vo.setTopKeywords(topKeywords);
        return vo;
    }
}
