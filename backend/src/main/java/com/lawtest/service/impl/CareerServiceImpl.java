package com.lawtest.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.lawtest.dto.CareerVO;
import com.lawtest.dto.KeywordVO;
import com.lawtest.entity.Career;
import com.lawtest.entity.CareerKeyword;
import com.lawtest.entity.Keyword;
import com.lawtest.mapper.CareerKeywordMapper;
import com.lawtest.mapper.CareerMapper;
import com.lawtest.mapper.KeywordMapper;
import com.lawtest.service.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CareerServiceImpl implements CareerService {

    private final CareerMapper careerMapper;
    private final KeywordMapper keywordMapper;
    private final CareerKeywordMapper careerKeywordMapper;

    @Override
    public List<CareerVO> listCareers() {
        List<Career> careers = careerMapper.selectList(
                Wrappers.<Career>lambdaQuery().orderByAsc(Career::getSortOrder));

        // careerId -> (keywordId -> weight)
        Map<Long, Map<Long, Integer>> careerWords = new HashMap<>();
        for (CareerKeyword ck : careerKeywordMapper.selectList(null)) {
            careerWords.computeIfAbsent(ck.getCareerId(), k -> new HashMap<>())
                    .put(ck.getKeywordId(), ck.getWeight());
        }

        Map<Long, Keyword> keywordMap = keywordMapper.selectList(null).stream()
                .collect(Collectors.toMap(Keyword::getId, k -> k));

        return careers.stream().map(career -> {
            CareerVO vo = new CareerVO();
            BeanUtils.copyProperties(career, vo);
            Map<Long, Integer> words = careerWords.getOrDefault(career.getId(), Map.of());
            List<KeywordVO> keywordVOs = words.entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .map(entry -> {
                        Keyword keyword = keywordMap.get(entry.getKey());
                        return new KeywordVO(keyword.getId(), keyword.getWord(), entry.getValue() >= 2);
                    })
                    .collect(Collectors.toList());
            vo.setKeywords(keywordVOs);
            return vo;
        }).collect(Collectors.toList());
    }
}
