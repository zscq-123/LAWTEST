package com.lawtest.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawtest.dto.MatchResultDTO;
import com.lawtest.dto.TestRecordVO;
import com.lawtest.entity.TestRecord;
import com.lawtest.mapper.TestRecordMapper;
import com.lawtest.service.MatchingService;
import com.lawtest.service.TestRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestRecordServiceImpl implements TestRecordService {

    private final TestRecordMapper testRecordMapper;
    private final MatchingService matchingService;
    private final ObjectMapper objectMapper;

    @Override
    public TestRecordVO save(List<Long> keywordIds) {
        MatchResultDTO result = matchingService.match(keywordIds);
        TestRecord record = new TestRecord();
        try {
            record.setSelectedKeywords(objectMapper.writeValueAsString(result.getKeywordIds()));
            record.setScores(objectMapper.writeValueAsString(result.getScores()));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("测试记录序列化失败", e);
        }
        record.setResultCareerId(result.getFirst().getCareerId());
        testRecordMapper.insert(record);

        TestRecordVO vo = new TestRecordVO();
        vo.setRecordId(record.getId());
        vo.setResultCareerId(record.getResultCareerId());
        vo.setResult(result);
        return vo;
    }
}
